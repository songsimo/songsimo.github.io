# 📝 기술 블로그 (Tech Blog)

> Astro 기반 테마(AstroPaper)를 사용한 GitHub Pages 정적 블로그입니다.  
> 마크다운 작성 후 Git Push 시 GitHub Actions를 통해 무중단으로 자동 빌드 및 배포됩니다.  
> 🤭 AI를 활용하여 블로그를 만들고 문서(Readme)를 정리했습니다.
---

## 📂 프로젝트 핵심 구조

블로그 운영 시 주로 확인하고 수정하는 디렉터리 안내입니다.

```text
├── src/
│   ├── content/blog/        # ✍️ 블로그 글(Markdown/MDX)이 저장되는 곳
│   ├── assets/              # 본문 이미지 및 정적 에셋
│   ├── components/          # 공통 UI 컴포넌트 (헤더, 푸터 등)
│   ├── layouts/             # 레이아웃 템플릿
│   └── pages/               # 라우팅 페이지 (태그, 아카이브, 검색 등)
├── public/                  # 파비콘, 기본 OG 이미지 등 (빌드 없이 그대로 배포)
│   └── about/               # 🙋 프로필 본문의 CSS · JS · 이미지 (아래 참고)
├── astro-paper.config.ts    # ⚙️ 블로그 정보 설정 (제목, 설명, 소셜 링크 등)
├── astro.config.ts          # ⚙️ Astro 및 빌드 플러그인 설정
└── .github/workflows/       # 🚀 GitHub Pages 자동 배포 파이프라인
```

## 🙋 프로필 페이지 (`/about/`)

헤더 · 브레드크럼 · 푸터는 블로그의 Astro 컴포넌트를 그대로 쓰고, **본문(`<main>` 안쪽)만 프레임워크 없이 순수 HTML/CSS/JavaScript**로 만들었습니다.

```text
src/pages/about.astro        # 본문 마크업 (Astro 문법 없이 순수 HTML) + 블로그 프레임
public/about/
├── css/style.css            # CSS 변수(:root, [data-theme="dark"]), 모바일 퍼스트(768px · 1024px)
├── js/                      # ES 모듈 (defer)
│   ├── main.js              #   진입점 (astro:page-load에서 초기화)
│   ├── utils.js             #   요소 선택, 설정값
│   ├── store.js             #   "이벤트 → 상태 변경 → 화면 업데이트" 저장소
│   ├── menu.js              #   섹션 내비 햄버거 메뉴
│   ├── scroll.js            #   부드러운 스크롤, 내비 배경(60px), 맨 위로 버튼(300px), 스크롤 스파이
│   ├── reveal.js            #   스크롤 등장 효과 (IntersectionObserver)
│   ├── repos.js             #   GitHub API (로딩 / 성공 / 에러·레이트 리밋 / 빈 데이터)
│   └── form.js              #   문의 폼 검증
└── images/                  # 아바타 등 이미지
```

- 다크 모드 토글과 저장(localStorage)은 블로그 헤더가 맡고, 본문 CSS는 `<html data-theme>` 값만 보고 색을 바꿉니다.
- GitHub 아이디와 보여줄 저장소 개수는 `about.astro`의 `#repo-container`에 있는 `data-github-user`, `data-repo-limit`로 바꿉니다.
- 본문 CSS는 모두 `.profile` 안으로 한정되어 있어서 블로그 헤더 · 푸터에 영향을 주지 않습니다.

## 🚀 빠른 시작 (로컬 환경)
본 프로젝트는 npm을 표준 패키지 매니저로 사용합니다.

1. 패키지 설치
```Bash
npm install
```

2. 로컬 개발 서버 실행

```Bash
npm run dev
```
브라우저에서 http://localhost:4321로 접속하여 실시간 변경 사항을 확인합니다.

3. 정적 빌드 테스트
```Bash
npm run build
```

## ✍️ 새 글 작성 방법
src/content/blog/ 폴더 아래에 새 마크다운 파일(예: my-first-post.md)을 생성하고 상단에 Frontmatter(메타데이터)를 작성합니다.

```markdown
---
author: 본인 이름
pubDatetime: 2026-09-23T12:00:00Z
title: 글 제목을 입력하세요
postSlug: post-url-slug
featured: false
draft: false
tags:
  - backend
  - architecture
description: 글의 요약 설명을 적어주세요.
---

여기에 본문 내용을 마크다운 문법으로 작성합니다.
```

- draft: true로 설정하면 배포 시 사이트에 노출되지 않아 임시 글로 둘 수 있습니다.

- featured: true로 설정하면 홈 화면 추천 글 영역에 강조 표시됩니다.

## 🛠️ 블로그 개인화 설정
사이트 기본 정보 변경: astro-paper.config.ts 파일에서 사이트 이름, 작성자 정보, 사이트 설명, 소셜 링크 등을 수정합니다.

도메인 및 기본 URL: astro.config.ts 파일의 site 필드에 블로그 URL을 지정합니다.

## 🚢 배포 방식
설정된 배포 브랜치(기본: main)에 커밋 후 push하면 GitHub Actions(.github/workflows/deploy.yml)가 자동으로 실행되어 정적 빌드 후 GitHub Pages로 즉시 무중단 배포됩니다.