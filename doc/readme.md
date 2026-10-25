# 나를 소개하는 웹페이지 처음부터 만들기

- Git 주소: <https://github.com/songsimo/songsimo.github.io>
- GitHub Pages: <https://songsimo.github.io/about/>


> **구조 참고**
> 이 저장소는 Astro(AstroPaper 테마) 블로그입니다. 블로그 테마를 유지하기 위해
> 헤더 · 브레드크럼 · 푸터는 블로그의 Astro 컴포넌트를 그대로 쓰고,
> **`/about` 페이지의 `<main>` 본문만 프레임워크 없이 순수 HTML · CSS · JavaScript로** 만들었습니다.
> 다크 모드 토글 버튼과 페이지 푸터는 블로그 공통 영역에 있습니다. 자세한 내용은 아래 해당 항목에 적었습니다.

---

## 목차

1. [프로젝트 기본 구조](#1-프로젝트-기본-구조)
2. [시맨틱 마크업 및 섹션 구성](#2-시맨틱-마크업-및-섹션-구성)
3. [스타일링 및 레이아웃](#3-스타일링-및-레이아웃)
4. [인터랙션 기능](#4-인터랙션-기능)
5. [GitHub API 연동](#5-github-api-연동)
6. [상태 관리 패턴](#6-상태-관리-패턴)
7. [배포](#7-배포)
8. [비기능 요구사항 및 제약 사항](#8-비기능-요구사항-및-제약-사항)
9. [요구사항 체크리스트](#9-요구사항-체크리스트)

---

## 1. 프로젝트 기본 구조

| 요구사항 | 구현 위치 |
| --- | --- |
| `index.html` | `src/pages/about.astro` — `<main>` 안쪽은 Astro 문법 없이 순수 HTML. 빌드 시 `dist/about/index.html`로 생성 |
| `css/style.css` | `public/about/css/style.css` |
| JS 파일 (`defer`) | `public/about/js/*.js` — 진입점 `main.js` 하나를 `type="module" defer`로 로드 |
| `images/` 폴더 | `public/about/images/avatar.svg` |

```
public/about/
├── css/
│   └── style.css      # 본문 스타일 (.profile 안으로 한정)
├── images/
│   └── avatar.svg     # About 섹션 아바타
└── js/
    ├── main.js        # 진입점 — 각 모듈 초기화
    ├── store.js       # 상태 저장소 (이벤트 → 상태 → 렌더)
    ├── utils.js       # 공용 도우미 · 설정값(임계값, 브레이크포인트)
    ├── menu.js        # 햄버거 메뉴
    ├── scroll.js      # 부드러운 스크롤 · 내비 배경 · 맨 위로 · 스크롤 스파이
    ├── reveal.js      # Intersection Observer 등장 효과
    ├── repos.js       # GitHub API 저장소 목록
    ├── form.js        # 문의 폼 검증 · 전송
    └── typing.js      # Hero 타이핑 효과
```

CSS · JS 연동 (`src/pages/about.astro`)

```html
<link slot="head" rel="stylesheet" href="/about/css/style.css" />
...
<script is:inline type="module" defer src="/about/js/main.js"></script>
```

`public/` 폴더의 파일은 Astro가 가공하지 않고 그대로 배포하므로, 작성한 HTML · CSS · JS가 그대로 브라우저에 전달됩니다.

---

## 2. 시맨틱 마크업 및 섹션 구성

### 2-1. 주요 섹션

`src/pages/about.astro`

| 섹션 | 마크업 |
| --- | --- |
| Hero | `<section class="hero" id="hero" aria-labelledby="hero-title">` |
| About | `<section class="section" id="about" aria-labelledby="about-title">` |
| Skills | `<section class="section" id="skills" aria-labelledby="skills-title">` |
| Projects | `<section class="section" id="projects" aria-labelledby="projects-title">` |
| Contact | `<section class="section" id="contact" aria-labelledby="contact-title">` |
| Footer | 블로그 공통 `<Footer />` 컴포넌트 (`src/components/Footer.astro`, `<footer>` 요소) |

그 밖에 `<nav aria-label="프로필 섹션">`, `<header class="section__header">`, `<figure>`, `<dl>/<dt>/<dd>`(About 요약 정보), `<ul>/<li>`(기술 스택 · 저장소 카드), `<time datetime>`(저장소 업데이트일) 등 의미에 맞는 요소를 사용했습니다.

### 2-2. 앵커 링크

```html
<ul class="page-nav__list" id="page-nav-list">
  <li><a href="#about">About</a></li>
  <li><a href="#skills">Skills</a></li>
  <li><a href="#projects">Projects</a></li>
  <li><a href="#contact">Contact</a></li>
</ul>
```

각 `href`는 섹션의 `id`와 일치합니다.

### 2-3. 의미 있는 이미지 `alt`

```html
<img
  class="about__avatar"
  src="/about/images/avatar.svg"
  alt="초록색 후드를 입은 픽셀 아트 개발자 캐릭터"
  width="160"
  height="160"
  loading="lazy"
/>
```

장식용 아이콘(SVG, ●, ★)에는 `aria-hidden="true"`를 붙여 스크린리더가 읽지 않게 했습니다.

### 2-4. `label`과 `for`-`id` 매칭

```html
<label for="contact-name">이름</label>
<input type="text" id="contact-name" name="name" required aria-describedby="contact-name-error" />

<label for="contact-email">이메일</label>
<input type="email" id="contact-email" name="email" required aria-describedby="contact-email-error" />

<label for="contact-message">메시지</label>
<textarea id="contact-message" name="message" rows="5" required aria-describedby="contact-message-error"></textarea>
```

에러 문구 요소는 `aria-describedby`로 입력칸과 연결되어 있습니다.

---

## 3. 스타일링 및 레이아웃

### 3-1. CSS 변수(`:root`)와 다크 모드(`[data-theme="dark"]`)

`public/about/css/style.css`

```css
:root {
  --p-bg: #f8faf3;
  --p-fg: #202a20;
  --p-accent: #2f7d4f;
  --p-surface: #ffffff;
  --p-border: #dbe2cc;
  /* ... */
  --p-nav-height: 3rem;
  --p-radius: 0.375rem;
  --p-transition: 0.2s ease;
}

[data-theme="dark"] {
  --p-bg: #151d16;
  --p-fg: #eef2ea;
  --p-accent: #57c17c;
  --p-surface: #1b251c;
  --p-border: #2c3a2c;
  /* ... */
}
```

모든 컴포넌트는 색을 직접 쓰지 않고 `var(--p-*)`만 참조하므로, `<html data-theme>` 값이 바뀌면 페이지 전체 색이 함께 바뀝니다. 아직 `data-theme`이 정해지기 전에는 `@media (prefers-color-scheme: dark)`로 시스템 설정을 따릅니다.

### 3-2. 모바일 퍼스트 + 브레이크포인트(768px, 1024px)

기본 스타일은 모바일 기준이고, `min-width` 미디어 쿼리로 넓은 화면을 덧붙입니다.

```css
/* 기본(모바일): 섹션 목록은 접혀 있고 햄버거 버튼으로 연다 */
.profile .page-nav__list {
  display: none;
  position: absolute;
  flex-direction: column;
  /* ... */
}

/* 태블릿 ≥ 768px: 햄버거 바를 숨기고 목록을 가로로, 소개 섹션 2단 */
@media (min-width: 768px) {
  .profile .page-nav__bar { display: none; }
  .profile .page-nav__list {
    position: static;
    display: flex;
    flex-direction: row;
  }
  .profile .about {
    flex-direction: row;
    gap: 2rem;
  }
}

/* 데스크톱 ≥ 1024px: 히어로 · 간격 · 글자 크기 확대 */
@media (min-width: 1024px) {
  .profile .hero__title { font-size: 3rem; }
  .profile .skill-grid,
  .profile .repo-grid { gap: 1.25rem; }
}
```

JS에서도 같은 브레이크포인트를 상수로 공유합니다 (`public/about/js/utils.js`).

```js
export const DESKTOP_QUERY = "(min-width: 768px)"; // CSS의 태블릿 브레이크포인트와 같은 값
```

### 3-3. 레이아웃 선택 근거: Flexbox vs CSS Grid

| 대상 | 선택 | 이유 |
| --- | --- | --- |
| 섹션 내비게이션 (`.page-nav__list`), 카드 내부 (`.repo-card`), 칩 목록 | **Flexbox** | 항목을 **한 축(가로 또는 세로)** 으로 나란히 놓고 간격만 조절하면 되는 **1차원 레이아웃**. 항목 개수·길이에 맞춰 크기가 유연하게 늘고 줄며, `flex-direction`만 바꾸면 모바일 세로 목록 ↔ 데스크톱 가로 메뉴로 전환된다. |
| 기술 스택 카드 (`.skill-grid`), 저장소 카드 (`.repo-grid`) | **CSS Grid** | 카드를 **행과 열을 동시에** 맞춰 배치해야 하는 **2차원 레이아웃**. `repeat(auto-fit, minmax(...))`로 화면 너비에 따라 열 개수가 자동으로 바뀌므로(모바일 1열 → 태블릿 2열 → 데스크톱 3열), 미디어 쿼리 없이도 반응형이 되고 같은 행의 카드 높이·폭이 일정하게 정렬된다. |

**Flexbox — 섹션 내비게이션** (`public/about/css/style.css`)

```css
/* 모바일(기본): 세로 한 줄로 펼쳐지는 패널 */
.profile .page-nav__list {
  display: none;
  flex-direction: column;
  gap: 0.25rem;
}
.profile .page-nav__list.is-open {
  display: flex;
}

/* 768px ↑: 같은 목록을 가로 한 줄로 */
@media (min-width: 768px) {
  .profile .page-nav__list {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
```

**Flexbox — 카드 내부 세로 정렬**

```css
.profile .repo-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
```

**CSS Grid — 기술 스택 · 저장소 카드 목록**

```css
/* 카드 최소 폭(13rem / 14rem)을 지키면서 들어갈 수 있는 만큼 열을 만든다 */
.profile .skill-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
}

.profile .repo-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
}

/* 1024px ↑: 열 개수는 Grid가 알아서 정하고, 간격만 넓힌다 */
@media (min-width: 1024px) {
  .profile .skill-grid,
  .profile .repo-grid {
    gap: 1.25rem;
  }
}
```

정리하면, **"한 줄로 늘어놓기"는 Flexbox, "바둑판처럼 깔기"는 Grid**로 나눠 썼습니다.

---

## 4. 인터랙션 기능

임계값은 로직과 분리해 `public/about/js/utils.js`에 모아 두었습니다.

```js
export const NAV_SCROLL_THRESHOLD = 60;  // 이 높이(px)를 넘으면 섹션 내비 배경이 바뀐다
export const SCROLL_TOP_THRESHOLD = 300; // 이 높이(px)를 넘으면 맨 위로 버튼이 나타난다
```

### 4-1. 햄버거 메뉴 토글 (`classList.toggle`)

`public/about/js/menu.js`

```js
const render = ({ open }) => {
  list.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "섹션 메뉴 닫기" : "섹션 메뉴 열기");
};

const store = createStore({ open: false }, render);

toggle.addEventListener("click", () => {
  store.set({ open: !store.get().open });
});
```

```css
.profile .page-nav__list.is-open { display: flex; }
```

추가로 링크 클릭 · 메뉴 바깥 클릭 · `Esc` 키로 닫히고, 768px 이상으로 넓어지면 자동으로 닫힙니다.

### 4-2. 부드러운 스크롤

`public/about/js/scroll.js`

```js
export const initSmoothScroll = () => {
  $$('#profile a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const { hash } = link;
      const target = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      target.focus({ preventScroll: true }); // 키보드·스크린리더 사용자도 이동한 곳을 알 수 있게
      if (window.location.hash !== hash) history.pushState(null, "", hash);
    });
  });
};
```

`scrollBehavior()`는 OS의 "동작 줄이기" 설정이 켜져 있으면 `"auto"`를 돌려줍니다. 섹션에는 `scroll-margin-top`을 주어 sticky 내비에 제목이 가려지지 않게 했습니다.

### 4-3. 스크롤 탑 버튼 (300px 이상에서 노출)

### 4-4. 네비게이션 스타일 변경 (60px 이상에서 배경 전환)

두 기능은 같은 스크롤 핸들러에서 처리합니다. `public/about/js/scroll.js`

```js
const update = () => {
  const y = window.scrollY;
  nav.classList.toggle("is-scrolled", y > NAV_SCROLL_THRESHOLD);      // 60px
  scrollTop.classList.toggle("is-visible", y > SCROLL_TOP_THRESHOLD); // 300px
};

// 스크롤 이벤트는 아주 자주 발생하므로 프레임당 한 번만 처리한다
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    update();
    ticking = false;
  });
}, { passive: true, signal });

scrollTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
});
```

```css
.profile .page-nav.is-scrolled {
  background: var(--p-nav-bg);
  backdrop-filter: blur(8px);
}

.profile .scroll-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

### 4-5. 다크 모드 (토글 + LocalStorage 유지)

토글 버튼은 블로그 헤더(`src/components/Header.astro`의 `#theme-btn`)에 있고, 동작은 `src/scripts/theme.ts`가 맡습니다. 프로필 본문 CSS는 `<html data-theme>`의 변화만 보고 색을 바꿉니다(3-1 참고).

```ts
// src/scripts/theme.ts
const THEME_KEY = "theme";

function persist(): void {
  localStorage.setItem(THEME_KEY, themeValue); // 상태 저장
  reflect();
}

function reflect(): void {
  const root = document.firstElementChild;
  root?.setAttribute("data-theme", themeValue); // 화면 반영
  // ...
}

document.querySelector("#theme-btn")?.addEventListener("click", () => {
  themeValue = themeValue === LIGHT ? DARK : LIGHT; // 상태 변경
  persist();
});
```

새로고침했을 때 깜빡임이 없도록, 페이지를 그리기 전에 저장된 값을 먼저 읽습니다 (`src/layouts/Layout.astro`).

```js
const stored = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const theme = stored ?? (prefersDark ? "dark" : "light");
document.firstElementChild?.setAttribute("data-theme", theme);
```

### 4-6. 스크롤 애니메이션 (Intersection Observer)

`public/about/js/reveal.js`

```js
const observer = new IntersectionObserver(
  (entries, self) => {
    entries
      .filter(({ isIntersecting }) => isIntersecting)
      .forEach(({ target }) => {
        target.classList.add("is-visible");
        self.unobserve(target); // 한 번 나타나면 더 볼 필요 없다
      });
  },
  { threshold: 0.15 }
);

$$("#profile .reveal").forEach(item => {
  item.classList.add("is-pending");
  observer.observe(item);
});
```

```css
.profile .reveal.is-pending {
  opacity: 0;
  transform: translateY(1.25rem);
}
.profile .reveal.is-pending.is-visible {
  opacity: 1;
  transform: none;
  transition: opacity 0.6s ease, transform 0.6s ease;
}
```

JS가 `is-pending`을 붙인 요소만 숨기므로 JS가 꺼져 있어도 내용은 보입니다. 같은 Intersection Observer로 현재 보고 있는 섹션의 메뉴 항목에 `aria-current`를 붙이는 스크롤 스파이(`initScrollSpy`)도 구현했습니다.

### 4-7. 폼 UX (필수값 · 이메일 형식 검증, 기본 동작 방지, 피드백)

`public/about/js/form.js`

```js
// 에러 문구를 돌려주고, 통과하면 ""
const FIELD_RULES = {
  name: value => (value ? "" : "이름을 입력해주세요."),
  email: value => {
    if (!value) return "이메일을 입력해주세요.";
    return EMAIL_PATTERN.test(value)
      ? ""
      : "이메일 형식이 올바르지 않아요. (예: name@example.com)";
  },
  message: value => {
    if (!value) return "메시지를 입력해주세요.";
    return value.length >= 10 ? "" : "메시지는 10자 이상 입력해주세요.";
  },
};
```

```js
// utils.js
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

```js
form.addEventListener("submit", async event => {
  event.preventDefault(); // 페이지가 새로고침되는 기본 제출 동작을 막는다

  const errors = Object.fromEntries(
    FIELD_NAMES.map(field => [field, validateField(field, controlOf(field).value)])
  );
  const firstInvalid = FIELD_NAMES.find(field => errors[field]);

  if (firstInvalid) {
    store.set({ errors, status: "invalid" });
    controlOf(firstInvalid).focus();
    return;
  }

  store.set({ errors, status: "sending" });
  // ... Formspree로 fetch POST → success | error
});
```

피드백 방식

- 필드별 에러 문구: `<p class="field__error">`에 표시, 입력칸에 `aria-invalid` · `is-invalid` 적용
- 전체 상태 문구: `<p class="form__status" role="status">`에 `invalid` / `sending` / `success` / `error` 메시지 표시
- 전송 중에는 제출 버튼 비활성화
- 칸을 벗어날 때(`focusout`) 검사하고, 에러가 난 칸은 입력하는 동안(`input`) 다시 검사
- 브라우저 기본 검증 말풍선 대신 직접 만든 피드백을 쓰기 위해 `<form novalidate>` 사용

---

## 5. GitHub API 연동

`public/about/js/repos.js`

### 5-1. 엔드포인트 호출

GitHub 아이디는 HTML의 `data-*` 속성으로 넘깁니다.

```html
<div id="repo-container" data-github-user="songsimo" data-repo-limit="6" aria-live="polite" aria-busy="true">
```

```js
const response = await fetch(
  `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
  { headers: { Accept: "application/vnd.github+json" } }
);
```

### 5-2. 4가지 상태 UI

| 상태 | 화면 |
| --- | --- |
| `loading` | 스켈레톤 카드 3개 + 스피너 "저장소를 불러오는 중이에요…" |
| `success` | 저장소 카드 목록 (이름 · 설명 · 언어 · 별 · 업데이트일) + 언어별 필터 |
| `error` | 레이트 리밋 / 404 / 서버 오류 / 네트워크 오류 안내 + "다시 시도" 버튼 |
| `empty` | "아직 공개된 저장소가 없어요" 안내 |

```js
const loadRepos = async () => {
  store.set({ status: "loading", error: null });

  try {
    const response = await fetch(/* ... */);

    if (!response.ok) {
      store.set({ status: "error", error: toApiError(response, username) });
      return;
    }

    const data = await response.json();
    const repos = data.filter(({ fork }) => !fork);

    store.set(
      repos.length > 0
        ? { status: "success", repos, language: ALL }
        : { status: "empty", repos: [] }
    );
  } catch {
    store.set({
      status: "error",
      error: { title: "네트워크에 문제가 생겼어요", detail: "인터넷 연결을 확인한 뒤 다시 시도해주세요." },
    });
  }
};
```

레이트 리밋은 응답 헤더로 구분하고, 언제 다시 시도하면 되는지 알려줍니다.

```js
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
      detail: `${minutes ? `약 ${minutes}분 뒤에` : "잠시 뒤에"} 다시 시도해주세요. (로그인 없는 요청은 시간당 60회까지만 허용돼요)`,
    };
  }
  if (response.status === 404) { /* 사용자를 찾을 수 없음 */ }
  return { /* 그 밖의 서버 오류 */ };
};
```

API에서 받은 문자열은 HTML에 넣기 전에 `escapeHtml()`로 이스케이프하고, 링크는 `https://`로 시작하는 주소만 허용해 XSS를 막았습니다.

### 5-3. 배열 → 카드 변환: `filter` · `map` · `forEach`를 쓰는 이유

저장소 배열을 화면의 카드로 바꾸는 과정은 **고르기(filter) → 변환하기(map) → 이어 붙이기(join)** 순서입니다 (`public/about/js/repos.js`).

```js
// success 상태의 render
grid.innerHTML = filterByLanguage(repos, language) // 1. filter: 선택한 언어의 저장소만 남김
  .slice(0, limit)                                   // 2. 최대 6개
  .map(repoCard)                                     // 3. map: 저장소 객체 → 카드 HTML 문자열
  .join("");                                         // 4. 문자열 배열 → 하나의 HTML
```

```js
// filter — 조건에 맞는 요소만 남긴 "새 배열"을 돌려준다
const filterByLanguage = (repos, language) =>
  language === ALL ? repos : repos.filter(repo => repo.language === language);

// map에 넘기는 변환 함수 — 저장소 객체 하나를 카드 <li> 하나로 바꾼다
const repoCard = ({ name, description, html_url: url, language, stargazers_count: stars = 0, updated_at: updatedAt }) => `
  <li class="card repo-card">
    <h3 class="repo-card__title"><a href="${escapeHtml(safeUrl)}" ...>${escapeHtml(name)}</a></h3>
    <p class="repo-card__desc">${escapeHtml(description ?? "설명이 아직 없어요.")}</p>
    ...
  </li>`;
```

| 메서드 | 사용한 곳 | 선택 이유 |
| --- | --- | --- |
| `filter` | 포크 저장소 제외 (`data.filter(({ fork }) => !fork)`), 언어 필터 (`filterByLanguage`) | 조건에 맞는 요소만 담은 **새 배열**을 돌려주므로 원본 `repos`(상태)를 바꾸지 않는다. 그래서 필터를 "전체"로 되돌리면 원래 목록이 그대로 남아 있다. |
| `map` | 저장소 → 카드 HTML (`.map(repoCard)`), 필터 버튼 · 스켈레톤 카드 생성 | 입력 배열과 **같은 길이의 새 배열**로 1:1 변환한다. 원본을 바꾸지 않고(불변성), 변환 함수가 템플릿 리터럴을 돌려주므로 `.join("")`과 이어서 HTML을 한 번에 만들 수 있다. `innerHTML`에 한 번만 넣으므로 DOM 갱신도 한 번으로 끝난다. |
| `forEach` | 필터 버튼의 `aria-pressed` 갱신, 언어별 개수 세기, Observer 등록 | 돌려받을 값이 없고 **부수 효과(DOM 속성 변경 등)만** 필요한 경우. 새 배열이 필요 없으므로 `map` 대신 `forEach`를 쓴다. |

```js
// forEach — 값을 만들지 않고 이미 있는 버튼의 속성만 바꾼다
$$("[data-language]", filterBox).forEach(button => {
  button.setAttribute("aria-pressed", String(button.dataset.language === language));
});
```

---

## 6. 상태 관리 패턴

"사용자 이벤트 → 상태 변경 → 화면 업데이트" 흐름을 작은 저장소 하나로 통일했습니다. 이벤트 핸들러는 DOM을 직접 만지지 않고 `set`만 부르며, DOM을 바꾸는 일은 `render` 함수 한 곳에서만 합니다.

`public/about/js/store.js`

```js
export const createStore = (initialState, render) => {
  let state = initialState;

  const get = () => state;

  const set = patch => {
    state = { ...state, ...patch };
    render(state);
  };

  render(state); // 처음 상태도 같은 render로 그린다
  return { get, set };
};
```

이 패턴을 적용한 인터랙션 (4가지 + 다크 모드)

| 인터랙션 | 이벤트 | 상태 | 화면 업데이트 |
| --- | --- | --- | --- |
| 햄버거 메뉴 (`menu.js`) | 버튼 클릭 · `Esc` · 바깥 클릭 | `{ open }` | `is-open` 토글, `aria-expanded` · `aria-label` 변경 |
| GitHub API (`repos.js`) | 페이지 진입 · "다시 시도" 클릭 | `{ status, repos, error }` | 스켈레톤 / 카드 / 빈 안내 / 에러 안내 렌더 |
| 언어 필터 (`repos.js`) | 필터 버튼 클릭 | `{ language }` | 카드 목록 필터링(`array.filter`), `aria-pressed` 변경 |
| 폼 유효성 (`form.js`) | `focusout` · `input` · `submit` | `{ errors, status }` | 에러 문구 · `aria-invalid` · 상태 문구 · 버튼 비활성화 |
| 다크 모드 (`theme.ts`) | 테마 버튼 클릭 | `themeValue` (+ LocalStorage) | `<html data-theme>` 변경 → CSS 변수 전환 |

---

## 7. 배포

`.github/workflows/deploy.yml` — `main` 브랜치에 push하면 GitHub Actions가 빌드 후 GitHub Pages에 배포합니다.

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist
  deploy:
    needs: build
    steps:
      - uses: actions/deploy-pages@v5
```

배포 주소: <https://songsimo.github.io/about/>

---

## 8. 비기능 요구사항 및 제약 사항

검사 범위는 프로필 본문 코드(`src/pages/about.astro`의 `<main>`, `public/about/**`)입니다.

### 8-1. 외부 라이브러리 사용 금지

- 프로필 본문의 JS는 모두 직접 작성한 ES 모듈이며 `import`는 같은 폴더의 파일(`./utils.js`, `./store.js` 등)만 참조합니다.
- `public/about/css/style.css`는 순수 CSS이며 CSS 프레임워크를 쓰지 않습니다. 레이아웃은 Flexbox와 CSS Grid로 직접 구성했습니다.
- React, Vue, jQuery, Bootstrap 등을 불러오는 `<script>` · `<link>`가 없습니다.

> 참고: 블로그 공통 영역(헤더 · 푸터 · 레이아웃)은 기존 AstroPaper 테마를 유지하기 위해 Astro와 Tailwind CSS로 되어 있습니다. 프로필 본문은 이 영역과 분리되어 있고, 스타일은 `.profile` 안으로만 한정해 서로 영향을 주지 않습니다.

### 8-2. `var` 사용 금지

모든 변수는 `const` 또는 `let`으로 선언했습니다.

```bash
$ grep -nE "\bvar\s" public/about/js/*.js src/scripts/theme.ts
# (결과 없음)
```

`let`은 값이 바뀌는 곳에만 씁니다. 예) `store.js`의 `state`, `scroll.js`의 `ticking`, `main.js`의 `controller`.

### 8-3. 인라인 스타일(`style="..."`) · `onclick` 속성 금지

```bash
$ grep -nE 'style="|onclick' src/pages/about.astro public/about/js/*.js
# (결과 없음)
```

- 스타일은 모두 `style.css`의 클래스로 적용하고, JS는 `classList.toggle/add`와 `hidden` · `aria-*` · `data-*` 속성만 바꿉니다.
- 모든 이벤트는 `addEventListener`로 등록합니다. 매번 다시 그려지는 버튼("다시 시도", 언어 필터)은 부모 요소에 이벤트 위임으로 처리합니다.

```js
stateBox.addEventListener("click", ({ target }) => {
  if (target instanceof Element && target.closest('[data-action="retry"]')) {
    loadRepos();
  }
});
```

### 8-4. 그 밖에 신경 쓴 점

- **접근성**: `aria-expanded` · `aria-controls` · `aria-live` · `aria-busy` · `aria-current` · `role="status"`, 스크린리더 전용 텍스트(`.sr-only`), 이동한 섹션으로 포커스 이동
- **동작 줄이기**: `prefers-reduced-motion`이 켜져 있으면 부드러운 스크롤 · 등장 효과 · 타이핑 효과를 끔
- **성능**: 스크롤 핸들러는 `requestAnimationFrame`으로 프레임당 한 번만 실행, `passive: true`
- **리스너 정리**: 블로그의 페이지 전환(ClientRouter) 때 `AbortController`로 `window` · `document` 리스너와 Observer를 한꺼번에 정리 (`main.js`)
- **JS 없이도 동작**: 등장 효과 요소는 JS가 있을 때만 숨기고, 저장소 목록은 `<noscript>`로 GitHub 링크 제공

---

## 9. 요구사항 체크리스트

### 기능 요구사항

- [x] 프로젝트 기본 구조 — HTML / `css/style.css` / `js/*.js`(`defer`) / `images/` 분리 및 연동
- [x] 섹션 구성 — Hero, About, Skills, Projects, Contact, Footer
- [x] 앵커 링크, 의미 있는 이미지 `alt`, `label`–`for`/`id` 매칭
- [x] CSS 변수(`:root`)와 다크 모드(`[data-theme="dark"]`)
- [x] 모바일 퍼스트, 768px · 1024px 브레이크포인트
- [x] 레이아웃 선택 근거 — 내비게이션 Flexbox(1차원), 카드 Grid(2차원, `auto-fit` + `minmax`)
- [x] 햄버거 메뉴 토글 (`classList.toggle`)
- [x] 부드러운 스크롤
- [x] 스크롤 탑 버튼 (300px)
- [x] 네비게이션 배경 전환 (60px)
- [x] 다크 모드 토글 + LocalStorage 유지
- [x] Intersection Observer 스크롤 애니메이션
- [x] 폼 검증(필수값 · 이메일 형식), `preventDefault`, 피드백
- [x] GitHub API `/users/songsimo/repos` 호출
- [x] 로딩 · 성공 · 에러(레이트 리밋 포함) · 빈 데이터 4가지 상태 UI
- [x] 배열 → 카드 변환 — `filter`(고르기) → `map`(변환) → `join`, 부수 효과는 `forEach`
- [x] "이벤트 → 상태 → 화면" 패턴 3가지 이상 (메뉴, API, 언어 필터, 폼, 다크 모드)
- [x] GitHub Pages 배포 (GitHub Actions)

### 비기능 요구사항

- [x] 프로필 본문에 외부 프레임워크 · 라이브러리 미사용
- [x] `var` 미사용 (`const`, `let`만 사용)
- [x] 인라인 `style` · `onclick` 미사용 (`addEventListener`만 사용)

### 데스크탑/모바일/다크모드

1. 데스크탑
![desktop](/images/desktop.png)

2. 모바일
![mobile](/images/mobile.png)

3. 다크모드
![darkmode](/images/darkmode.png)