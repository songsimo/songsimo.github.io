# AI Development & Content Guidelines for this Blog

This project is a static personal tech blog built with **Astro** (based on the AstroPaper theme), styled with **Tailwind CSS**, and deployed via **GitHub Pages**.

All AI assistants must strictly follow the rules below when drafting posts, modifying styles, or updating code.

---

## 1. Package Manager & Environment
- **Package Manager**: Strictly use **npm** (do NOT use pnpm, yarn, or bun).
- **Run Dev**: `npm run dev`
- **Build**: `npm run build`
- **Install**: `npm install`

---

## 2. Blog Post Authoring Rules (`src/content/blog/`)
When generating or editing blog articles:
- **File Location**: All markdown/MDX files must be created inside `src/content/blog/`.
- **Frontmatter Schema**: Every post **must** follow the Astro Content Collection schema defined below:

```yaml
---
author: "작성자 이름"
pubDatetime: 2026-09-23T12:00:00Z   # ISO 8601 UTC string format (Required)
modDatetime: 2026-09-23T15:00:00Z   # Optional, for updated posts
title: "Article Title Here"         # Required
featured: false                     # boolean (Required)
draft: false                        # boolean (Required - true hides from production)
tags:
  - tech
  - architecture                    # Array of strings (Required, at least 1 tag)
description: "Brief summary under 160 characters." # Required
---