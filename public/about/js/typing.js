import { $, escapeHtml, prefersReducedMotion } from "./utils.js";

const TYPING_DELAY = 55; // 한 글자당 ms
const START_DELAY = 400; // 시작 전 잠깐 멈춤

export const initTyping = signal => {
  const target = $("[data-typing]");
  if (!target || prefersReducedMotion()) return;

  const chars = Array.from(target.textContent.trim().replace(/\s+/g, " "));
  const fullText = chars.join("");

  target.innerHTML = `
    <span class="sr-only">${escapeHtml(fullText)}</span>
    <span aria-hidden="true"><span class="typing__done"></span><span class="typing__caret"></span><span class="typing__rest"></span></span>`;

  const done = $(".typing__done", target);
  const rest = $(".typing__rest", target);
  const caret = $(".typing__caret", target);

  let count = 0;
  let timer = 0;

  const typeNext = () => {
    count += 1;
    done.textContent = chars.slice(0, count).join("");
    rest.textContent = chars.slice(count).join("");

    if (count < chars.length) {
      timer = window.setTimeout(typeNext, TYPING_DELAY);
    } else {
      caret.classList.add("is-done"); // 다 쓰면 커서는 깜빡임을 멈추고 사라진다
    }
  };

  done.textContent = "";
  rest.textContent = fullText;
  timer = window.setTimeout(typeNext, START_DELAY);

  // 다른 페이지로 이동하면 멈춘다
  signal?.addEventListener("abort", () => window.clearTimeout(timer));
};