/**
 * /about 본문의 진입점. about.astro가 이 파일 하나만 불러온다.
 *
 *   menu.js    섹션 내비 햄버거 메뉴 (모바일)
 *   scroll.js  부드러운 스크롤 · 섹션 내비 배경 · 맨 위로 버튼 · 스크롤 스파이
 *   reveal.js  스크롤 등장 효과
 *   repos.js   GitHub 저장소 목록 (로딩/성공/빈 데이터/에러)
 *   form.js    문의 폼 검증
 *
 * 다크 모드 토글과 저장(localStorage)은 블로그 헤더가 맡는다.
 * 이 페이지의 CSS는 <html data-theme>이 바뀌는 것만 보고 색을 바꾼다.
 *
 * 블로그는 페이지를 이동할 때 화면만 교체(ClientRouter)한다. 모듈은 한 번만 실행되므로
 * 화면 초기화는 `astro:page-load`마다 하고, 떠날 때(`astro:before-swap`)는
 * window · document에 붙인 리스너를 AbortController로 한꺼번에 정리한다.
 */
import { initMenu } from "./menu.js";
import {
  initSmoothScroll,
  initScrollEffects,
  initScrollSpy,
} from "./scroll.js";
import { initReveal } from "./reveal.js";
import { initRepos } from "./repos.js";
import { initContactForm } from "./form.js";

let controller = null;

const start = () => {
  const profile = document.getElementById("profile");
  // 다른 페이지이거나, 이미 초기화한 화면이면 아무것도 하지 않는다
  if (!profile || profile.dataset.ready === "true") return;
  profile.dataset.ready = "true";

  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  initMenu(signal);
  initSmoothScroll();
  initScrollEffects(signal);
  initReveal(signal);
  initScrollSpy(signal);
  initRepos();
  initContactForm();
};

document.addEventListener("astro:page-load", start);
document.addEventListener("astro:before-swap", () => controller?.abort());

// 모듈이 늦게 불러와져 astro:page-load를 놓친 경우를 위해 한 번 바로 시도한다
start();