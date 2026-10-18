/**
 * Projects 섹션: GitHub API로 공개 저장소를 불러와 카드로 보여준다.
 *
 * 상태는 네 가지다.
 *   loading  스켈레톤 카드 + "불러오는 중" 안내
 *   success  저장소 카드 목록
 *   empty    "공개된 저장소가 없어요" 안내
 *   error    네트워크 오류 · 서버 오류 · 요청 한도(rate limit) 안내 + 다시 시도 버튼
 *
 *   fetch 결과 → 상태(status) 변경 → render가 화면을 한 번에 다시 그린다
 */
import { $, escapeHtml } from "./utils.js";
import { createStore } from "./store.js";

const formatDate = iso =>
  new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const repoCard = ({
  name,
  description,
  html_url: url,
  language,
  stargazers_count: stars = 0,
  updated_at: updatedAt,
}) => {
  // 링크는 https://로 시작하는 주소만 허용한다
  const safeUrl =
    typeof url === "string" && url.startsWith("https://") ? url : "#";
  const languageChip = language
    ? `<li class="chip">${escapeHtml(language)}</li>`
    : "";

  return `
    <li class="card repo-card">
      <h3 class="repo-card__title">
        <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>
      </h3>
      <p class="repo-card__desc">${escapeHtml(description ?? "설명이 아직 없어요.")}</p>
      <ul class="repo-card__meta">
        ${languageChip}
        <li><span aria-hidden="true">★</span> <span class="sr-only">별</span>${escapeHtml(stars)}</li>
        <li>
          <time datetime="${escapeHtml(updatedAt)}">${escapeHtml(formatDate(updatedAt))}</time> 업데이트
        </li>
      </ul>
    </li>`;
};

const skeletonCards = (count = 3) =>
  Array.from(
    { length: count },
    () => `
      <li class="card repo-card repo-card--skeleton" aria-hidden="true">
        <span class="skeleton skeleton--title"></span>
        <span class="skeleton"></span>
        <span class="skeleton skeleton--short"></span>
      </li>`
  ).join("");

// 성공 상태는 카드 목록이 직접 보여주므로 안내 박스가 필요 없다.
const STATE_MARKUP = {
  loading: () => `
    <p class="state__text"><span class="spinner" aria-hidden="true"></span>저장소를 불러오는 중이에요…</p>`,
  empty: () => `
    <p class="state__title">아직 공개된 저장소가 없어요</p>
    <p class="state__text">첫 프로젝트를 GitHub에 올리면 이곳에 자동으로 나타나요.</p>`,
  error: error => `
    <p class="state__title">${escapeHtml(error?.title)}</p>
    <p class="state__text">${escapeHtml(error?.detail)}</p>
    <button class="button button--ghost" type="button" data-action="retry">다시 시도</button>`,
};

// 응답 코드를 사람이 이해할 수 있는 안내로 바꾼다 (레이트 리밋 포함)
const toApiError = (response, username) => {
  const remaining = response.headers.get("x-ratelimit-remaining");
  const resetAt = Number(response.headers.get("x-ratelimit-reset"));
  const isRateLimited =
    response.status === 429 || (response.status === 403 && remaining === "0");

  if (isRateLimited) {
    const minutes = resetAt
      ? Math.max(1, Math.ceil((resetAt * 1000 - Date.now()) / 60000))
      : null;
    return {
      title: "GitHub API 요청 한도를 넘었어요",
      detail: `${
        minutes ? `약 ${minutes}분 뒤에` : "잠시 뒤에"
      } 다시 시도해주세요. (로그인 없는 요청은 시간당 60회까지만 허용돼요)`,
    };
  }

  if (response.status === 404) {
    return {
      title: "GitHub 사용자를 찾을 수 없어요",
      detail: `아이디(${username})가 맞는지 about.astro의 data-github-user 값을 확인해주세요.`,
    };
  }

  return {
    title: "저장소를 불러오지 못했어요",
    detail: `GitHub 서버가 ${response.status} 응답을 보냈어요. 잠시 뒤에 다시 시도해주세요.`,
  };
};

export const initRepos = () => {
  const container = $("#repo-container");
  const grid = $("#repo-grid");
  const stateBox = $("#repo-state");
  if (!container || !grid || !stateBox) return;

  // about.astro가 data-* 속성으로 넘겨준 설정
  const username = container.dataset.githubUser ?? "";
  const limit = Number(container.dataset.repoLimit) || 6;

  const render = ({ status, repos, error }) => {
    container.setAttribute("aria-busy", String(status === "loading"));

    if (status === "loading") {
      grid.innerHTML = skeletonCards();
    } else if (status === "success") {
      grid.innerHTML = repos.map(repoCard).join("");
    } else {
      grid.innerHTML = "";
    }

    const buildState = STATE_MARKUP[status];
    stateBox.hidden = !buildState;
    stateBox.dataset.state = status;
    stateBox.innerHTML = buildState ? buildState(error) : "";
  };

  const store = createStore(
    { status: "loading", repos: [], error: null },
    render
  );

  const loadRepos = async () => {
    store.set({ status: "loading", error: null });

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
        { headers: { Accept: "application/vnd.github+json" } }
      );

      if (!response.ok) {
        store.set({ status: "error", error: toApiError(response, username) });
        return;
      }

      const data = await response.json();
      const repos = data.filter(({ fork }) => !fork).slice(0, limit);

      store.set(
        repos.length > 0
          ? { status: "success", repos }
          : { status: "empty", repos: [] }
      );
    } catch {
      // 오프라인이거나 응답을 해석하지 못한 경우
      store.set({
        status: "error",
        error: {
          title: "네트워크에 문제가 생겼어요",
          detail: "인터넷 연결을 확인한 뒤 다시 시도해주세요.",
        },
      });
    }
  };

  // 안내 박스 안의 버튼은 매번 새로 그려지므로 이벤트 위임으로 처리한다
  stateBox.addEventListener("click", ({ target }) => {
    if (target instanceof Element && target.closest('[data-action="retry"]')) {
      loadRepos();
    }
  });

  loadRepos();
};