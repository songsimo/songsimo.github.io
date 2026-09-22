import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    // TODO: 실제 GitHub Pages 저장소 이름과 맞춰주세요 (예: https://<username>.github.io/)
    url: "https://songsimo.github.io/",
    title: "CONTINUE.LOG",
    description: "코드, 회고, 성장 기록을 남기는 기술 블로그",
    // TODO: 실제 이름(또는 닉네임)으로 교체하세요 — meta 태그, OG 이미지, 글 작성자 표시에 쓰입니다
    author: "블로그 주인장",
    // TODO: 원하는 프로필 링크(예: 이력서, 노션, 개인 사이트)로 교체하세요
    profile: "",
    ogImage: "default-og.jpg",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      // TODO: 저장소 이름/브랜치가 다르면 이 경로도 함께 수정하세요
      enabled: true,
      url: "https://github.com/songsimo/songsimo.github.io/edit/main/",
    },
    search: "pagefind",
  },
  // TODO: 아래 소셜 링크를 실제 계정 주소로 교체하세요 (필요 없는 항목은 삭제해도 됩니다)
  socials: [
    { name: "github", url: "https://github.com/songsimo" },
    { name: "mail", url: "mailto:you@example.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});