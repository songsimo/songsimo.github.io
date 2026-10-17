/**
 * /about 페이지에 들어가는 내용과 설정.
 *
 * 문구·기술 스택·연락 채널을 바꾸고 싶다면 마크업(.astro)이나 스크립트를
 * 건드리지 말고 이 파일만 고치세요.
 */
import config from "@/config";

/** GitHub 아이디. Projects 섹션이 이 계정의 공개 저장소를 불러옵니다. */
export const GITHUB_USERNAME = "songsimo"; // TODO: 본인 GitHub 아이디로 바꿔주세요

/** Projects 섹션에 보여줄 저장소 개수 (포크 제외, 최근 업데이트 순) */
export const REPO_LIMIT = 6;

export const hero = {
  badge: "Wayfarer 1",
  name: config.site.author
};

export const about = {
  paragraphs: [
    "이커머스에서 웹 개발 엔지니어로 일하고 있으며 제품을 개발할 때 여러 방법을 고민하고 상황에 맞는 최선의 방법을 선택합니다. 장인 정신을 중요하게 생각하고 비즈니스 가치를 높이기 위한 중요한 방향성이라 생각합니다. 주도적으로 업무를 진행할 수 있는 환경을 선호합니다."
  ],
  facts: [
    { label: "주력", value: "Java, Spring, Spring Boot, Javascript" },
    { label: "학습 중", value: "AI" },
    { label: "기록", value: "개발 블로그" },
  ],
  avatarAlt: "초록색 후드를 입은 픽셀 아트 개발자 캐릭터",
};

export const skillGroups = [
  { title: "Backend", items: ["Java", "Spring", "Spring Boot", "MyBatis"] },
  { title: "Database", items: ["Oracle", "PostgreSQL"] },
  {
    title: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript ES6+, VueJS, JQuery"],
  },
  { title: "Tools", items: ["Git", "GitHub"] },
];

/** 연락 섹션 오른쪽의 "다른 채널". 블로그 링크는 컴포넌트에서 base를 붙여 추가합니다. */
export const contactLinks = [
  { label: "GitHub", href: `https://github.com/${GITHUB_USERNAME}` },
  { label: "LinkedIn", href: `https://linkedin.com/in/${GITHUB_USERNAME}` }
];
