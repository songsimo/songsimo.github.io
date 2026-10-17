// 숫자처럼 "나중에 바꿀 수 있는 값"은 로직과 분리해 여기에 모아 둔다.
// (GitHub 아이디와 저장소 개수는 src/data/about.ts에서 data-* 속성으로 넘어온다)

export const NAV_SCROLL_THRESHOLD = 60; // 이 높이(px)를 넘으면 섹션 내비 배경이 바뀐다
export const SCROLL_TOP_THRESHOLD = 300; // 이 높이(px)를 넘으면 맨 위로 버튼이 나타난다
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
