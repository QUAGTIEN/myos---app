# AGENTS.md — SUNFLOWER CORPORATE WEBSITE
> **Version:** 2.0 · 2026-10-13  
> **Role:** System instructions for Codex / coding agents  
> **Project:** Sunflower public-facing corporate website (NOT Sunflower internal ERP)  
> **Primary visual reference:** https://www.sonoco.com/na

## 0. READ FIRST — FILE CONTRACT

Before any code changes, read the documents in this order:

1. `AGENTS.md` — **HOW TO WORK**: guardrails, workflow, quality standards.
2. `docs/DESIGN.md` — **HOW IT LOOKS**: approved direction, colors, media, motion, responsive.
3. `docs/STRUCTURE.md` — **WHAT TO BUILD**: seven approved routes, sections, user journeys, data and folder layout.
4. `README.md`, `package.json`, existing source code — **WHAT ALREADY EXISTS**.

**Scope and authority:** The user's latest explicit instruction overrides any older proposal. The **seven top-level pages are approved** and must not be replaced. The **Sonoco-inspired visual direction** and **cinematic video Hero** supersede the former Revolve/Dye Spot still-image Hero guidance. Preserve real Sunflower identity and verified business information. Report conflicts rather than silently choosing.

**Important naming:** Codex automatically discovers `AGENTS.md` by convention. Use this exact filename at repository root. `docs/DESIGN.md` and `docs/STRUCTURE.md` are linked reference specifications.

## 1. PRODUCT BRIEF

- **Brand:** Sunflower, a company working with printed labels, decals, printing consumables and related packaging/product identification solutions. Verify each public claim before publishing.
- **Website:** Corporate Website + Product Showcase + B2B Lead Generation.
- **Primary audience:** Business purchasers, brand owners, sourcing teams, production/warehouse stakeholders and potential business partners.
- **Primary outcome:** Visitors understand the offering, view product groups, evaluate actual capabilities and request a quote/contact.
- **Language:** Vietnamese by default; English only if specifically requested.
- **NOT in scope:** Internal Sunflower ERP/CRM, dashboard UI, multi-vendor marketplace, default checkout/cart, user accounts or an LMS.
- **Stack:** Next.js App Router + React + TypeScript + Tailwind CSS. Respect the installed project versions. Deploy target: Vercel (if already configured).

## 2. NON-NEGOTIABLE DESIGN DIRECTION

**Modern Industrial Corporate × Sonoco-inspired editorial storytelling.**

Borrow the following **principles**, not Sonoco's proprietary design or assets:

- Confident dark-blue brand blocks, bright white/soft-neutral sections, strong large-scale typography.
- Restrained green call-to-action accent on blue or white backgrounds.
- Cinematic industrial footage in Hero; large production/product imagery further down the page.
- Full-bleed media, editorial split sections, strong visual hierarchy, informative B2B storytelling.
- Alternating wide image, story, industry, product and capability sections: no monotonous grids.
- A high-information, credible enterprise look rather than an empty one-screen landing page.
- A subtle curved/arc-shaped blue Hero treatment **inspired by** the reference; create original geometry.

**Brand distinction:** The blue/green interface palette in `docs/DESIGN.md` is a **Sunflower adaptation** based on publicly observable Sonoco hues, not a certified pixel-for-pixel copy of Sonoco CSS. Use the official Sunflower logo/colors if later supplied; update tokens rather than hardcoding styles.

### Forbidden without explicit user approval

- Copying Sonoco logo, text, footage, trademarks, CSS, design assets or exact compositions.
- Replacing Sunflower product photos with generated "real" factory evidence.
- Unsubstantiated numbers: years, machines, certifications, facility size, clients, capacity, delivery guarantees, sustainability results.
- SaaS-style cards everywhere, fake analytics, fake ratings, generic AI gradients, neon effects, glassmorphism, unnecessary 3D.
- Unrequested pages, e-commerce checkout, payment logic, login/ERP entry points or news/blog sections.
- Multiple distracting carousels, scroll hijacking, forced sound, cursors or autoplay popups.
- Installing a new animation/CMS/database library without checking whether existing tools suffice.

## 3. OFFICIAL SITE MAP — SEVEN TOP-LEVEL PAGES

```text
/                Trang chủ
/gioi-thieu      Giới thiệu
/san-pham        Sản phẩm
/giai-phap       Giải pháp
/nang-luc        Năng lực
/du-an           Dự án / Thành phẩm
/lien-he         Liên hệ & Yêu cầu báo giá
```

Page goals, ordered sections, functionality, navigation and asset placement are in `docs/STRUCTURE.md`.

**Detail pages** such as `/san-pham/[slug]` or `/du-an/[slug]` are optional extensions, not approved by default. Do not add them before approval and real content are available.

## 4. HERO — APPROVED DIRECTION

Use the **Cinematic Industrial Video Hero** defined in `docs/DESIGN.md`.

- Background: user-provided licensed industrial/video footage; use a real poster fallback.
- Video: muted, loop, playsInline, autoplay only where supported; no sound on start.
- Desktop: tall, cinematic Hero. Large type positioned in a controlled dark-blue area or on a dark gradient; video must remain visible, with clear focal point. Optionally use an original large navy curved mask/panel to evoke Sonoco.
- Mobile: optimized portrait crop or separate mobile asset; avoid placing text over important video details.
- CTA: `Khám phá sản phẩm` → `/san-pham`; alternative CTA `Yêu cầu báo giá` → `/lien-he`.
- Accessible Pause/Play control, reduced-motion preference, `Save-Data`/constrained network fallback where supported.
- If the actual footage does not exist: **do not pretend it exists**. Implement a clearly marked poster/placeholder and document required media.
- Prefer a simple HTML5 `<video>` to a heavy third-party player unless streaming requirements justify the change.
- No video forced to download on every route; Hero media belongs only on `/`.

## 5. CONTENT, ASSETS & TRUST

- Use confirmed company information; label gaps `TODO: XÁC NHẬN VỚI SUNFLOWER` in staging documentation, not in a public claim.
- No fictional testimonials, customer logos, ISO badges, production metrics or project names.
- Product catalogue may use the **13 previously discussed groups as a working list**; publishing names/specs needs Sunflower confirmation (see `STRUCTURE.md`).
- Treat sample/stock photos as *illustrative*, never as evidence of Sunflower's actual factory or production.
- Track image/video license and consent for every externally sourced asset. Do not hotlink reference-site videos.
- Do not expose personal/customer data from the internal ERP in the public website.
- Public copy must be specific and helpful, not generic: explain types of labels/materials, uses, actual workflow and contact process.
- Define one primary CTA per section; adjacent secondary links allowed when clearly less prominent.

## 6. ARCHITECTURE & CODE QUALITY

- Reuse existing files and components where possible; inspect `package.json` and folder structure before proposing a refactor.
- Server Components by default. Add `"use client"` only where interactivity, browser APIs or animations need it.
- One route file composes meaningful sections; avoid monolithic 1000-line JSX pages.
- Centralize design tokens in CSS; no hardcoded repeated color values, spacing or motion timings in components.
- Favor semantic HTML (`header`, `nav`, `main`, `section`, `footer`) and Next.js `Link`, `Image`, `Metadata`.
- Reuse `Header`, `Footer`, `Button`, `Container`, `SectionHeading`, `VideoHero`, `ImageText`, `ProductGallery`, `ContactCTA`.
- Use shadcn/ui for suitable primitives when already installed; **do not let its default dashboard aesthetic dictate the public website**.
- Choose a single primary animation engine if needed (CSS + one of Motion or GSAP). Use GSAP ScrollTrigger only for scroll choreography with concrete benefit.
- Assets live in `public/images`, `public/videos`; text/catalogue data in `src/content` or equivalent. See `docs/STRUCTURE.md`.
- Never commit secrets, API keys, build credentials or live form submissions.
- No backend/database is required for a static product showcase. Add one when an approved, functional quote form needs persistence/routing.

## 7. UX / A11Y / PERFORMANCE REQUIREMENTS

- Responsive review: 390×844, 768×1024, 1024×768, 1440×900 and 1920×1080.
- Keyboard navigation, visible focus, proper labels, error messages, 44×44px recommended targets.
- Target WCAG AA contrast: 4.5:1 normal text, 3:1 large text; test actual hero poster + video frames.
- Honor `prefers-reduced-motion`: no decorative entrance transitions, show static Hero poster.
- Video: use a poster first, efficient source encoding, no unnecessary preload on mobile; test real transfer sizes, avoid a fixed unrealistic universal file-size rule.
- Images: responsive dimensions, `next/image` when appropriate, good `alt`, avoid layout shifts, no stretched low-resolution thumbnails.
- Navigation, filters, forms and anchor links must work. Do not show a success toast for a form that is not connected.
- SEO per route: unique title, description, one H1, Open Graph, sitemap/robots for a public site. Structured data only for verified details.

## 8. MANDATORY CODEX WORKFLOW

### Phase A — AUDIT (before modifying code)

1. Read the three specs and inspect the existing project.
2. Identify what already works and which files would change.
3. Inventory missing media/content/credentials; make no assumptions about their existence.
4. Provide a short plan: **goal → files → approach → tests → questions that actually block work**.
5. For a major redesign or an entire new site, seek approval of the proposed implementation plan/first-screen direction before mass implementation. Do not repeatedly ask to reapprove fixed seven-page IA.

### Phase B — FOUNDATION

1. Integrate design tokens and font; establish responsive `Container`, `Header`, `Footer`, button variants.
2. Build or update the homepage **Video Hero** with poster fallback and accessible controls.
3. Confirm Hero and navigation visually at desktop/mobile before implementing every page.

### Phase C — IMPLEMENT IN SMALL SLICES

1. Implement homepage by sections, then inner-page templates.
2. Reuse shared components and structured content.
3. Add product/solution/project data only after confirming source and permission.
4. Connect quote form to an approved real destination; otherwise keep the UI visibly in non-production demo mode.
5. Preserve Git diff scope; do not overwrite unrelated work or change file organization merely for appearance.

### Phase D — QA & REPORT

Run available checks (adapt to `package.json` scripts):
```bash
npm run lint
npx tsc --noEmit
npm run build
```
Then review in browser if tooling allows: 390 / 768 / 1024 / 1440 / 1920 widths; Hero readability, focus, menu, overflow, video, forms, CTA destinations, loaded resources. Do not claim visual QA if no screenshots/browser checks were performed.

**Final response after each coding task:**
- Completed: routes/components/files.
- Tested: commands and actual results.
- Pending: content/assets/approval.
- Known limitations; do not claim production-readiness without end-to-end verification.

## 9. DEFINITION OF DONE

- [ ] The requested task is in the correct approved page(s), not an invented new feature.
- [ ] UI follows `docs/DESIGN.md` tokens/section recipes rather than arbitrary AI styling.
- [ ] All copy, media and client references are verified or labeled as not production-ready.
- [ ] Hero has working video behavior and a robust accessible fallback, if Hero was in scope.
- [ ] Nav/CTA/filter/form behaviors are real, or pending integration is made explicit.
- [ ] Desktop/tablet/mobile visually checked when browser available; no horizontal overflow.
- [ ] A11y, SEO, perf and security basics covered.
- [ ] Lint, TypeScript and build run where environment permits.
- [ ] Changes and remaining blockers are summarized transparently.

## 10. REFERENCE MATERIAL & CHANGE LOG

- Sonoco North America homepage: https://www.sonoco.com/na
- Sonoco Products: https://www.sonoco.com/na/products
- Local visual specification: `docs/DESIGN.md`
- Information architecture: `docs/STRUCTURE.md`

**v2.0 changes:** Replaces static editorial split Hero with cinematic video, shifts visual reference to Sonoco, strengthens blue/green corporate system, **preserves** the seven-page structure and no-invented-facts rule.
