# songsimo.github.io

개발자 블로그. [AstroPaper](https://github.com/satnaing/astro-paper)를 기반으로, 다크 톤 + 그린 계열 컬러에 픽셀 포인트(로고/뱃지/태그)를 절제해서 얹은 커스텀 테마입니다.

## 로컬에서 실행하기

```bash
pnpm install
pnpm run dev       # http://localhost:4321
```

```bash
pnpm run build      # dist/ 에 정적 사이트 빌드 (astro check → build → pagefind 색인)
pnpm run preview    # 빌드 결과 미리보기
```

> ⚠️ `dist/index.html`을 브라우저에서 더블클릭해서 직접 여는 방식(file://)은 피해주세요. 폰트/스크립트가 절대경로(`/…`)로 참조되어 있어서 로컬 파일로 열면 일부가 깨집니다. 반드시 `pnpm run dev` / `pnpm run preview`처럼 로컬 서버로 띄우거나, 실제 배포된 GitHub Pages 주소로 확인하세요.

Node.js 22 이상이 필요합니다.

## 프로젝트 구조

```
src/
├── components/          # 재사용 UI 컴포넌트 (Header, Footer, Card, Comments, Tag, Pagination …)
├── layouts/
│   ├── Layout.astro       # 모든 페이지의 뼈대: <head>/meta, 폰트, 다크모드 스크립트
│   └── PostLayout.astro   # 포스트 전용 레이아웃 (OG 이미지, JSON-LD 등 추가)
├── pages/                # 파일 경로 = URL 라우트
│   ├── index.astro              # 홈 (배너 + 최신 글 목록)
│   ├── about.astro               # /about — content/pages/about.md를 렌더링
│   ├── posts/[...slug]/          # 포스트 상세 페이지 + 하위 컴포넌트(목차, 댓글, 공유 버튼 등)
│   ├── posts/[...page].astro     # /posts — 글 목록(페이지네이션)
│   ├── tags/                     # 태그별 글 목록
│   ├── archives/                 # 연도/월별 아카이브
│   └── search.astro              # Pagefind 검색 UI
├── content/
│   ├── posts/*.md          # 실제 블로그 글 — 새 글은 여기에 추가
│   └── pages/about.md      # 프로필(/about) 페이지 본문
├── styles/
│   ├── theme.css            # 색상 CSS 변수 (라이트/다크 각각)
│   ├── global.css           # Tailwind 유틸리티, 픽셀 포인트 스타일
│   └── typography.css       # 본문(prose) 타이포그래피
├── i18n/                  # 다국어 문자열 (lang/ko.ts, lang/en.ts)
├── utils/                 # 정렬·슬러그·경로 등 헬퍼 함수
├── constants/giscus.ts    # 댓글 위젯 설정
├── types/config.ts        # astro-paper.config.ts의 타입 정의
└── config.ts              # astro-paper.config.ts를 불러와 앱 전체에 공급하는 진입점

astro-paper.config.ts   # 사이트 메타데이터 · 기능 토글 · 소셜 링크 등 최상위 설정
astro.config.ts         # Astro/Vite 자체 설정 (마크다운 렌더러, Shiki 코드 하이라이팅 등)
```

## 시작하기 전에 꼭 확인할 것 (TODO)

1. **`astro-paper.config.ts`**
   - `site.url` 이 실제 배포 주소(`https://<github-username>.github.io/`)와 일치하는지 확인
   - `site.author`, `site.profile`, `socials` 배열을 원하는 값으로 교체 (지금은 자리표시자입니다)
   - `features.editPost.url` 저장소 경로/브랜치가 다르면 함께 수정

2. **소개/첫 글 내용 채우기**
   - `src/content/pages/about.md` — 프로필(`/about`) 페이지. 지금은 자기소개가 자리표시자로 되어 있습니다
   - `src/content/posts/welcome.md` — 첫 포스트 샘플. `<!-- TODO -->` 주석이 달린 부분을 실제 내용으로 바꿔주세요

3. **댓글(giscus) 켜기** — `src/constants/giscus.ts`
   - 이 저장소가 **public**이고 **Discussions**가 켜져 있어야 합니다 (Settings → General → Features → Discussions)
   - [giscus 앱](https://github.com/apps/giscus)을 이 저장소에 설치
   - [giscus.app/ko](https://giscus.app/ko)에서 저장소를 연결하면 `repo` / `repoId` / `category` / `categoryId` 값이 생성됩니다 — 이 값을 `src/constants/giscus.ts`에 채워 넣으면 댓글이 자동으로 켜집니다 (비워두면 "댓글 꺼짐" 안내만 표시됩니다)
   - 다크/라이트 모드 전환 시 댓글창 테마도 함께 바뀌도록 이미 구현되어 있습니다 (`src/components/Comments.astro`)

4. **글 쓰기** — `src/content/posts/*.md`에 마크다운 파일 추가. `welcome.md`를 참고하세요. 필수 필드: `pubDatetime`, `title`, `description`. `tags`, `featured`, `draft`, `author` 등은 선택(비우면 `astro-paper.config.ts`의 `site.author`가 기본값으로 쓰입니다).

## GitHub Pages 배포

`.github/workflows/deploy.yml`에 `main` 브랜치 푸시 시 자동 빌드 + 배포하는 GitHub Actions 워크플로우가 이미 포함되어 있습니다.

처음 배포할 때 딱 한 번, 저장소 Settings → Pages → **Build and deployment → Source**를 **GitHub Actions**로 설정해주세요. 그 다음부터는 `main`에 푸시할 때마다 자동으로 `https://<github-username>.github.io/`에 배포됩니다.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<github-username>/songsimo.github.io.git
git push -u origin main
```

## 테마 커스터마이징

- **색상**: `src/styles/theme.css` — `--accent`(포레스트 그린), `--accent-2`(우드 브라운), `--background`, `--border` 등 CSS 변수만 바꾸면 전체 팔레트가 바뀝니다. 라이트/다크 각각 따로 정의되어 있습니다.
- **픽셀 포인트**: `Press Start 2P` 폰트를 로고, "PLAYER 1" 뱃지, 태그 칩, 댓글 라벨 등 작은 요소에만 절제해서 사용합니다 (`font-pixel`, `pixel-badge`, `retro-chip` 유틸리티, `src/styles/global.css`). 본문은 읽기 편한 `Google Sans Code` 모노스페이스 폰트를 사용하며, 둘 다 `@fontsource`로 self-host되어 있어 빌드 시 외부 네트워크 요청이 없습니다.
- **모바일 내비게이션**: 화면이 좁아지면(`sm` 이하) 헤더 오른쪽에 햄버거 버튼이 나타나 전체 메뉴(포스트/태그/프로필/아카이브/검색/다크모드)를 펼치는 드롭다운으로 바뀝니다 (`src/components/Header.astro`).
- **홈 배너**: `public/images/banner-light.png` / `banner-dark.png` — 라이트·다크 모드에 맞춰 자동으로 바뀌는 픽셀 아트 배경입니다. 직접 그린 그래픽이라 다른 이미지로 교체하고 싶으면 같은 파일명(권장 비율 약 1152×336)으로 덮어쓰면 됩니다.
- **코드 블록 하이라이팅**: 라이트 `min-light`, 다크 `github-dark` 테마 (`astro.config.ts`의 `shikiConfig`).
- **포스트 목차(TOC)**: `astro-paper.config.ts`의 `features.tableOfContents`로 켜고 끌 수 있고, `position: "left" | "right"`로 위치를 정할 수 있습니다. 데스크톱 큰 화면(2xl, 1536px↑)에서만 나타나며, 제목을 스크롤해서 지나가면 나타나 화면에 고정된 채로 함께 스크롤됩니다 (`src/pages/posts/[...slug]/_components/TableOfContents.astro`).

## 페이지 구성

- **홈 (`/`)**: 배너 + 최신 글 목록만 보여주는 블로그 랜딩 페이지입니다. 자기소개는 없습니다.
- **프로필 (`/about`)**: 자기소개와 소셜 링크는 여기로 옮겨뒀습니다. 내용은 `src/content/pages/about.md`에서 수정하세요.

## 기능

- 다크/라이트 모드 토글
- 태그/카테고리, 아카이브
- Pagefind 기반 정적 검색
- giscus 댓글 (설정 필요, 위 참고)
- RSS, 사이트맵, 동적 OG 이미지 생성
- 전체 한국어 UI