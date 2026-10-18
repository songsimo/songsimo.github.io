/**
 * 스크롤 등장 효과.
 *
 * IntersectionObserver가 화면에 들어온 .reveal에 is-visible을 붙인다.
 * JS가 is-pending을 붙인 요소만 CSS가 숨기므로, JS가 없으면 내용은 그냥 보인다.
 */
import { $$ } from "./utils.js";

export const initReveal = signal => {
  if (!("IntersectionObserver" in window)) return;

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

  signal?.addEventListener("abort", () => observer.disconnect());
};