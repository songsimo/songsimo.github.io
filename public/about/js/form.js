/**
 * 문의 폼 검증.
 *
 *   입력·blur·제출 이벤트 → 상태(errors, status) 변경 → render가 에러 문구와 스타일을 갱신
 *
 * 이 폼은 보낼 서버가 없는 데모다. 검증을 통과하면 입력을 비우고 안내만 보여준다.
 */
import { $, EMAIL_PATTERN } from "./utils.js";
import { createStore } from "./store.js";

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

const STATUS_MESSAGES = {
  idle: "",
  invalid: "입력 내용을 다시 확인해주세요.",
  success:
    "메시지가 확인되었어요. 다만 이 폼은 데모라서 실제로 전송되지는 않아요.",
};

const FIELD_NAMES = Object.keys(FIELD_RULES);

const emptyErrors = () => ({ name: "", email: "", message: "" });

const validateField = (field, value) => FIELD_RULES[field](value.trim());

const hasError = errors => Object.values(errors).some(Boolean);

export const initContactForm = () => {
  const form = $("#contact-form");
  const statusEl = $("#form-status");
  if (!form || !statusEl) return;

  const controlOf = field => form.elements.namedItem(field);

  // 이벤트 대상이 우리 입력칸이면 필드 이름을, 아니면 null
  const fieldOf = target =>
    (target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement) &&
    FIELD_NAMES.includes(target.name)
      ? target.name
      : null;

  const render = ({ errors, status }) => {
    FIELD_NAMES.forEach(field => {
      const message = errors[field];
      const input = controlOf(field);
      const errorEl = $(`[data-error-for="${field}"]`, form);
      if (errorEl) errorEl.textContent = message;
      input.setAttribute("aria-invalid", String(Boolean(message)));
      input.classList.toggle("is-invalid", Boolean(message));
    });

    statusEl.dataset.status = status;
    statusEl.textContent = STATUS_MESSAGES[status];
  };

  const store = createStore({ errors: emptyErrors(), status: "idle" }, render);

  // 필드 하나만 다시 검사한다 (blur, 또는 이미 에러가 난 필드를 고치는 중일 때)
  const revalidate = field => {
    const errors = {
      ...store.get().errors,
      [field]: validateField(field, controlOf(field).value),
    };
    store.set({ errors, status: hasError(errors) ? "invalid" : "idle" });
  };

  form.addEventListener("focusout", ({ target }) => {
    const field = fieldOf(target);
    if (field) revalidate(field);
  });

  form.addEventListener("input", ({ target }) => {
    const field = fieldOf(target);
    if (field && store.get().errors[field]) revalidate(field);
  });

  form.addEventListener("submit", event => {
    event.preventDefault(); // 페이지가 새로고침되는 기본 제출 동작을 막는다

    const errors = Object.fromEntries(
      FIELD_NAMES.map(field => [
        field,
        validateField(field, controlOf(field).value),
      ])
    );
    const firstInvalid = FIELD_NAMES.find(field => errors[field]);

    if (firstInvalid) {
      store.set({ errors, status: "invalid" });
      controlOf(firstInvalid).focus();
      return;
    }

    form.reset();
    store.set({ errors: emptyErrors(), status: "success" });
  });
};