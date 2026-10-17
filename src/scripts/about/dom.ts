export const $ = <T extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T | null => scope.querySelector<T>(selector);

export const $$ = <T extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T[] => [...scope.querySelectorAll<T>(selector)];

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollBehavior = () =>
  prefersReducedMotion() ? "auto" : "smooth";

// 외부에서 온 문자열(저장소 이름·설명 등)을 HTML에 넣기 전에 반드시 이스케이프한다.
const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHtml = (value: unknown = ""): string =>
  String(value).replace(/[&<>"']/g, char => HTML_ESCAPES[char]);