/**
 * 모바일 햄버거 메뉴 (섹션 내비게이션).
 *
 *   버튼 클릭 → 상태(open) 변경 → render가 classList.toggle로 목록을 보이고 숨김
 *
 * CSS는 768px 미만에서만 목록을 접어 두고, 768px 이상에서는 항상 펼쳐 둔다.
 * 화면이 넓어지면 열려 있던 상태도 함께 닫는다.
 */
import { $, DESKTOP_QUERY } from "./utils.js";
import { createStore } from "./store.js";

export const initMenu = signal => {
  const toggle = $("#nav-toggle");
  const list = $("#page-nav-list");
  if (!toggle || !list) return;

  const render = ({ open }) => {
    list.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "섹션 메뉴 닫기" : "섹션 메뉴 열기"
    );
  };

  const store = createStore({ open: false }, render);
  const close = () => store.set({ open: false });

  toggle.addEventListener("click", () => {
    store.set({ open: !store.get().open });
  });

  // 목록 안의 링크를 누르면 이동과 함께 닫는다
  list.addEventListener("click", ({ target }) => {
    if (target instanceof Element && target.closest("a")) close();
  });

  // Esc로 닫고, 포커스는 버튼으로 돌려준다
  document.addEventListener(
    "keydown",
    ({ key }) => {
      if (key === "Escape" && store.get().open) {
        close();
        toggle.focus();
      }
    },
    { signal }
  );

  // 메뉴 바깥을 누르면 닫는다
  document.addEventListener(
    "click",
    ({ target }) => {
      if (!store.get().open || !(target instanceof Node)) return;
      if (!list.contains(target) && !toggle.contains(target)) close();
    },
    { signal }
  );

  // 데스크톱 폭이 되면 모바일에서 열어 둔 상태를 정리한다
  window.matchMedia(DESKTOP_QUERY).addEventListener(
    "change",
    ({ matches }) => {
      if (matches) close();
    },
    { signal }
  );
};