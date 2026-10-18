/**
 * 공용 도우미와 설정값.
 */

// 숫자처럼 "나중에 바꿀 수 있는 값"은 로직과 분리해 여기에 모아 둔다.
export const NAV_SCROLL_THRESHOLD = 60; // 이 높이(px)를 넘으면 섹션 내비 배경이 바뀐다
export const SCROLL_TOP_THRESHOLD = 300; // 이 높이(px)를 넘으면 맨 위로 버튼이 나타난다
export const DESKTOP_QUERY = "(min-width: 768px)"; // CSS의 태블릿 브레이크포인트와 같은 값
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 요소 선택
export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];

// 움직임을 줄여 달라는 OS 설정이면 부드러운 스크롤을 끈다
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollBehavior = () =>
  prefersReducedMotion() ? "auto" : "smooth";

// 외부에서 온 문자열(저장소 이름·설명 등)을 HTML에 넣기 전에 반드시 이스케이프한다.
const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, char => HTML_ESCAPES[char]);