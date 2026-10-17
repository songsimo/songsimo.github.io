/**
 * /about 페이지의 진입점. about.astro가 이 파일 하나만 불러온다.
 *
 *   scroll.ts  부드러운 스크롤 · 섹션 내비 배경 · 맨 위로 버튼 · 스크롤 스파이
 *   reveal.ts  스크롤 등장 효과
 *   repos.ts   GitHub 저장소 목록 (로딩/성공/빈 데이터/에러)
 *   form.ts    문의 폼 검증
 *
 * 블로그는 페이지를 이동할 때 화면만 교체(ClientRouter)하므로, 이 스크립트는
 * 한 번만 실행된다. 그래서 `astro:page-load`마다 초기화하고,
 * 떠날 때(`astro:before-swap`)는 window에 붙인 리스너를 정리한다.
 */
import { initSmoothScroll, initScrollEffects, initScrollSpy } from "./scroll";
import { initReveal } from "./reveal";
import { initRepos } from "./repos";
import { initContactForm } from "./form";

let controller: AbortController | null = null;

const start = () => {
  controller?.abort();
  if (!document.getElementById("profile")) return; // 다른 페이지에서는 아무것도 하지 않는다

  controller = new AbortController();
  const { signal } = controller;

  initSmoothScroll();
  initScrollEffects(signal);
  initReveal(signal);
  initScrollSpy(signal);
  initRepos();
  initContactForm();
};

document.addEventListener("astro:page-load", start);
document.addEventListener("astro:before-swap", () => controller?.abort());