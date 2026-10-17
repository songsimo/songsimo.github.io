import { NAV_SCROLL_THRESHOLD, SCROLL_TOP_THRESHOLD } from "./config";
import { $, $$, scrollBehavior } from "./dom";

export const initSmoothScroll = () => {
  $$<HTMLAnchorElement>('#profile a[href^="#"]').forEach(link => {
    link.addEventListener("click", (event: MouseEvent) => {
      const hash = link.hash; // "#about" — 타입이 string이라 null 검사가 필요 없다
      const target =
        hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
      if (!target) return;

      event.preventDefault(); // 브라우저의 즉시 점프 대신 우리가 스크롤한다
      target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      target.focus({ preventScroll: true }); // 키보드·스크린리더 사용자도 이동한 곳을 알 수 있게
      if (window.location.hash !== hash) {
        history.pushState(null, "", hash);
      }
    });
  });
};

export const initScrollEffects = (signal?: AbortSignal) => {
  const nav = $("#page-nav");
  const scrollTop = $("#scroll-top");
  if (!nav || !scrollTop) return;

  const update = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > NAV_SCROLL_THRESHOLD);
    scrollTop.classList.toggle("is-visible", y > SCROLL_TOP_THRESHOLD);
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true, signal }
  );

  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });

  update(); // 새로고침 후 중간 위치에서 시작해도 올바른 상태로
};

export const initScrollSpy = (signal?: AbortSignal) => {
  if (!("IntersectionObserver" in window)) return;

  const links = $$<HTMLAnchorElement>('#page-nav a[href^="#"]');
  const targets = [$("#hero"), ...links.map(link => $(link.hash))].filter(
    (target): target is HTMLElement => target !== null
  );

  // 화면 가운데 가로선을 지나는 섹션을 "현재 섹션"으로 본다
  const observer = new IntersectionObserver(
    entries => {
      entries
        .filter(({ isIntersecting }) => isIntersecting)
        .forEach(({ target }) => {
          links.forEach(link => {
            if (link.hash === `#${target.id}`) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  targets.forEach(target => observer.observe(target));
  signal?.addEventListener("abort", () => observer.disconnect());
};