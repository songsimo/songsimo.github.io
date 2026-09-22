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
├── public/                  # 파비콘, 프로필, 기본 OG 이미지 등
├── astro-paper.config.ts    # ⚙️ 블로그 정보 설정 (제목, 설명, 소셜 링크 등)
├── astro.config.ts          # ⚙️ Astro 및 빌드 플러그인 설정
└── .github/workflows/       # 🚀 GitHub Pages 자동 배포 파이프라인
```

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