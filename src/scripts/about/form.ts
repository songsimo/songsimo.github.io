import { EMAIL_PATTERN } from "./config";
import { $ } from "./dom";
import { createStore } from "./store";
import type { FieldErrors, FieldName, FormState, FormStatus } from "./types";

type Rule = (value: string) => string; // 에러 문구를 돌려주고, 통과하면 ""

const FIELD_RULES: Record<FieldName, Rule> = {
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

const STATUS_MESSAGES: Record<FormStatus, string> = {
  idle: "",
  invalid: "입력 내용을 다시 확인해주세요.",
  success:
    "메시지가 확인되었어요. 다만 이 폼은 데모라서 실제로 전송되지는 않아요.",
};

// Object.keys는 string[]을 돌려주므로 FieldName[]으로 좁혀 둔다
const FIELD_NAMES = Object.keys(FIELD_RULES) as FieldName[];

const isFieldName = (name: string): name is FieldName => name in FIELD_RULES;

const emptyErrors = (): FieldErrors => ({ name: "", email: "", message: "" });

const validateField = (field: FieldName, value: string) =>
  FIELD_RULES[field](value.trim());

const hasError = (errors: FieldErrors) => Object.values(errors).some(Boolean);

type FormControl = HTMLInputElement | HTMLTextAreaElement;

export const initContactForm = () => {
  const form = $<HTMLFormElement>("#contact-form");
  const statusEl = $("#form-status");
  if (!form || !statusEl) return;

  // form.elements.namedItem()은 Element | RadioNodeList | null이라서, 우리 입력칸 타입으로 좁혀 쓴다
  const controlOf = (field: FieldName) =>
    form.elements.namedItem(field) as FormControl;

  // 이벤트 대상(EventTarget | null)이 우리 입력칸이면 필드 이름을, 아니면 null
  const fieldOf = (target: EventTarget | null): FieldName | null =>
    (target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement) &&
    isFieldName(target.name)
      ? target.name
      : null;

  const render = ({ errors, status }: FormState) => {
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

  const store = createStore<FormState>(
    { errors: emptyErrors(), status: "idle" },
    render
  );

  // 필드 하나만 다시 검사한다 (blur, 또는 이미 에러가 난 필드를 고치는 중일 때)
  const revalidate = (field: FieldName) => {
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

    // fromEntries는 { [k: string]: string }을 돌려주므로 FieldErrors로 좁혀 준다
    const errors = Object.fromEntries(
      FIELD_NAMES.map(field => [
        field,
        validateField(field, controlOf(field).value),
      ])
    ) as FieldErrors;
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