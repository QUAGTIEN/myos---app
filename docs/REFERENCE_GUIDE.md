# SUNFLOWER — VISUAL REFERENCE GUIDE

> **Version:** 1.0 · 14/10/2026  
> **Primary reference:** https://www.sonoco.com/na  
> **Source material:** 8 desktop screenshots **provided by the project owner** and included in `../reference/desktop/`.\
> **Purpose:** Map the **observable visual design principles** of Sonoco to the approved 7-page Sunflower corporate website.  
> **Applies to:** Sunflower website only, **not** the internal Sunflower ERP/CRM.  
> **Working language:** Vietnamese; component names remain in English.

## 0. READ FIRST — RULES FOR CODEX

Read in this order:

1. `../AGENTS.md`: **HOW TO WORK**, security and agent workflow.
2. `docs/DESIGN.md`: **HOW IT LOOKS**, canonical design tokens, font, spacing, animation.
3. `docs/STRUCTURE.md`: **WHAT TO BUILD**, seven approved pages, content and functionality.
4. `docs/REFERENCE_GUIDE.md` (this file): **WHAT TO LEARN FROM EACH SCREENSHOT**.
5. Open the actual images under `../reference/desktop/` with an image-viewing tool before designing each corresponding section.

**Priority:** Latest user-approved instructions > true Sunflower business identity/assets > `AGENTS.md`, `DESIGN.md`, `STRUCTURE.md` > this guide > subjective inference. If a reference screenshot conflicts with a fixed design token, **report the conflict and propose a change for approval**. Do not silently rewrite design colors or copy Sonoco exactly.

**Reference policy:** Screenshots are for internal study, not website assets. No copying Sonoco logos, actual imagery, proprietary video, text, symbols, customer claims or pixel-exact layout. Use original/authorized Sunflower assets and brand wording. Adapt the *principles* (composition, hierarchy, color rhythm, image treatment, responsive strategy), not the content.

**Evidence limits:** All eight supplied images are **desktop stills**. They do **not** demonstrate the real animation timing, hover states, video transitions, mobile design, implementation technology or exact CSS values. Motion and mobile behavior below are **Sunflower design proposals** informed by those stills, not observations of Sonoco. Obtain screen recordings/mobile screenshots before asserting a match in those areas.

## 1. INVENTORY — EIGHT SCREENSHOTS

Paths in code spans are relative to the sunflower-website repository root. Markdown links are relative to this document in docs/. The single screenshot pack is in ../reference/desktop/ at workspace level; do not create another copy.

| ID | Screenshot | Observed composition | Best Sunflower target | Priority |
|---|---|---|---|---|
| REF-01 | `../reference/desktop/01-home-cinematic-hero.png` | Dark-blue oversized curve, overlay header, rectangular landscape media at right, large white H1, green CTA | `/` → `VideoHero`, `Header` | **Critical** |
| REF-02 | `../reference/desktop/02-staggered-value-cards.png` | Deep-navy section; 5 unevenly stacked photographic cards, white text, green arrow | `/` → `WhySunflower`; `/nang-luc` | High |
| REF-03 | `../reference/desktop/03-circle-stats.png` | White/ice-blue section; 4 large floating circular metrics; generous negative space | `/gioi-thieu` and Home only **if figures are verified** | Conditional |
| REF-04 | `../reference/desktop/04-editorial-content-cards.png` | Four tall editorial image cards, bottom blue overlays, green category tags | `/du-an`; Home → featured projects | Medium |
| REF-05 | `../reference/desktop/05-interior-photo-hero.png` | Full-bleed photographic interior-page hero with centered white text and overlay navigation | `/giai-phap` or another interior-page hero | High |
| REF-06 | `../reference/desktop/06-two-column-product-gallery.png` | Two-column product categories, large cut-out item images, light-blue/white field, no boxed cards | `/san-pham` | **Critical** |
| REF-07 | `../reference/desktop/07-about-curved-blue-hero.png` | Deep-blue curved Hero, narrative text left, rounded wide photograph right, sparse arc motifs | `/gioi-thieu` → `AboutHero` | **Critical** |
| REF-08 | `../reference/desktop/08-history-editorial-split.png` | Half light-blue/half white background, large editorial photo left, historical copy right | `/gioi-thieu` → `OurStory`; `/nang-luc` feature | High |

> IMPORTANT: These screenshots are from **different pages/positions**. They are not eight consecutive Home sections. Do not build them all sequentially on the homepage.

## 2. VISUAL PRINCIPLES CONSISTENT ACROSS IMAGES

### 2.1 Identity and color composition

- Strong **blue corporate architecture**: dark or mid-blue areas provide brand identity; white/light-blue provides relief.
- Approximate visible screenshot palette (pixel observations, **not verified official CSS**): main blue around `#00488E` (REF-01), deep section blue around `#002E66` (REF-02), white `#FFFFFF`, pale sky-blue surfaces around `#D7EEF9`, with a bright green CTA/accent.
- **Existing `docs/DESIGN.md` remains the canonical source** (currently defines values such as `--brand-navy: #12345F`, `--brand-blue: #00488E`, `--brand-green: #8ABD37`). Treat screenshot colors as comparison targets; if the brand palette is to be tuned closer, request explicit approval and adjust DESIGN only once.
- Green belongs in focused interaction points (CTA, arrows, small tags/accents); don't paint entire card groups green.
- White typography on navy/photo; dark-blue typography on white/light-blue. Verify contrast on actual media.

### 2.2 Typography and visual hierarchy

- Large, bold, confident headlines; regular, legible supporting paragraphs; small label/eyebrow when meaningful.
- Headline can overlap a **designed photo/color boundary** (REF-01), but always remains legible and avoids clipping.
- Align headings and supporting text to consistent page gutters; don't scatter labels across unrelated offsets.
- Strong section introductions and purposeful whitespace. Not every region needs a border or a card.
- Use approved typography tokens from `DESIGN.md`; do not guess or claim the exact Sonoco font from screenshots.

### 2.3 Section variety

- Mix **curved blue hero**, **deep-blue image grid**, **light editorial text/stats**, **image-led content gallery**, **two-column product showcase**, **history story split**.
- Consistent container alignment matters more than forcing all sections to use one shared card template.
- Big image / concise text should dominate; fewer, higher-quality components over many small decorative tiles.
- Maintain the rhythm: dark → light → white → dark when content justifies; do not repeat navy blocks without pause.

### 2.4 Header has TWO observed contexts

- REF-01 / REF-07: overlay header on a dark-blue Hero with contrasting white menu; logo area can sit over a light/white cutout.
- REF-02/03/04/06/08: clean white fixed/sticky-looking header with blue logo, dark menu and green CTA. These stills do **not** prove its actual sticky implementation.
- For Sunflower: create **one reusable Header with two visual variants**, `over-hero` and `solid`, driven by route/scroll state while preserving keyboard use and readable logos.
- Sonoco's utility items `Investors`, `Careers`, region/language do NOT automatically apply to Sunflower. Use only approved seven-page navigation.

## 3. DETAILED REFERENCE ANALYSIS

### REF-01 — HOME CINEMATIC HERO

**File:** [`01-home-cinematic-hero.png`](../../reference/desktop/01-home-cinematic-hero.png)\
**Applies to:** Home `VideoHero` + shared `Header`.

**Visible in screenshot**
- Giant **blue quarter-ellipse / sweeping curve** comes in from left/bottom and blends into a large blue background. Upper-left outside of curve remains light, framing the logo.
- Header: upper-right small utility links; main navigation placed high above the visual; vivid green pill CTA. Sunflower should keep a simpler approved menu.
- **Landscape media rectangle begins around 40% of page width** and runs nearly to the right edge; heading begins around 16% from left and *extends visually across the boundary* between blue and media.
- H1 uses **very large bold all-white type** in multiple compact lines, anchoring the lower-left/middle of the Hero.
- Main CTA sits below title on the blue panel. A circular brand-message accent overlaps the upper-left region of the media; this is optional and should be remade distinctly or omitted.
- The screenshot contains a pause icon at lower right, but still imagery **cannot verify** actual video playback.

**Adapt for Sunflower**
1. **Wide viewport Hero** (approx 90–100svh desktop); visual priority: `HeroVideo` → large H1 → green CTA.
2. Use **original** CSS/SVG navy arc or a tailored blue overlay framing the left text area; do not trace the exact Sonoco curve.
3. Position real licensed label-production footage on the right/behind Hero; protect readable text with navy/gradient.
4. Text in Vietnamese relevant to labels/printing. Draft: `Tem nhãn chuẩn xác cho từng sản phẩm.` (copy needs owner approval).
5. CTA `Khám phá sản phẩm` → `/san-pham`, optional secondary `Yêu cầu báo giá` → `/lien-he`.
6. Real Pause/Play button and an effective poster fallback; accessible touch target, reduced-motion support.
7. Mobile design must be **proposed separately**: stack copy in a clear zone, crop footage intelligently, simplify arc.

**Implementation notes**: `VideoHero.tsx` + `HeroVideo.tsx` (if separation is justified), `Header` variant, CSS overlay/clip-path/pseudo-element. Avoid using a screenshot as a background or embedding Sonoco's original footage. Avoid heavy GSAP unless the proposed motion specifically requires it.

**Acceptance:** H1 + CTA visible immediately; 40–60% split visually feels purposeful; no text loss over moving video; video accessible/fallback works. Verify against the approved mock, **not pixel-identical to Sonoco**.

### REF-02 — STAGGERED VALUE / CAPABILITY TILES

**File:** [`02-staggered-value-cards.png`](../../reference/desktop/02-staggered-value-cards.png)\
**Applies to:** Home `WhySunflower` or `CapabilitiesHighlights`.

**Visible in screenshot**
- **Solid deep blue** section that takes most of viewport; five large photo tiles arranged in **three uneven vertical columns** instead of a conventional equal-row grid.
- Grayscale/dark editorial photos; dark overlay improves contrast with **white strong headings** near tile top.
- Small bright-green right arrows near tile bottom; modest rounded photo corners.
- Tile heights/column start positions vary, creating visual movement **without** needing actual animation.
- White/lighter curved section transition appears at lower-right edge.

**Adapt for Sunflower**
- Suggested 4 or 5 verified capability entries: `Vật liệu & quy cách`, `Tư vấn giải pháp`, `Công đoạn sản xuất`, `Kiểm tra chất lượng`, `Phối hợp đơn hàng`; **publish only verified capabilities**.
- Use real Sunflower operations/product photos; arrows navigate to `/nang-luc`, relevant anchored section, or `/giai-phap` (actual route).
- Build with CSS Grid and intentional offset styles; no masonry dependency needed for a small fixed set.
- Keep desktop rhythm staggered; mobile stacks as a normal 1-column list to preserve usability.
- Use dark overlay and accurate photo framing, no fabricated business achievements or generic stock-as-factory claims.

**Acceptance:** Clearly readable labels, no overlapping cards, uniform spacing rhythm, links work, responsive order is logical.

### REF-03 — CIRCULAR CORPORATE METRICS

**File:** [`03-circle-stats.png`](../../reference/desktop/03-circle-stats.png)\
**Applies to:** About/company overview **ONLY IF REAL VERIFIED NUMBERS EXIST**.

**Visible in screenshot**
- Left: blue eyebrow + multi-line blue heading + paragraph + understated text link.
- Right: four large white **circles** positioned asymmetrically over almost-white/light-blue background; bold blue/green numbers and all-caps labels.
- Fine circular partial strokes around badges, subtle pale backdrop and dotted concentric arcs from below.
- Substantial open white space; text and circles act as balanced columns.

**Adapt for Sunflower**
- Only show numbers Sunflower can verify and approves for publication (e.g. catalogued product groups **if accurate**, operational indicators **if proven**).
- **Never copy 22K+, 4K+, 265, 37 or 125+ years** from Sonoco. Never invent substitute numbers, fake growth counters or certifications.
- If verified metrics are not available, **do not use statistic circles**. Replace this with an editorial introduction, a real process timeline, or a 3-item factual capabilities summary with text.
- Optional subtle ring decoration is CSS/SVG only; never imply official badges/certifications.

**Acceptance:** Every displayed number has an auditable approved source; mobile circles stack cleanly without clipping.

### REF-04 — IMAGE-LED EDITORIAL CARDS

**File:** [`04-editorial-content-cards.png`](../../reference/desktop/04-editorial-content-cards.png)\
**Applies to:** Home `FeaturedProjects`; `/du-an` gallery.

**Visible in screenshot**
- Bright white page with compact section heading left and small green CTA far right.
- **Four tall portrait-ish cards** in one horizontal row on desktop; similar widths, generous gaps, softly rounded corners.
- Media dominates each card. A **dark semi-transparent navy overlay near the bottom** supports the white, multiline title. Small bright-green category chips sit near top right.
- Mix of editorial photo styles; cards share a stable visual system.

**Adapt for Sunflower**
- Borrow **card geometry, image-to-text proportion, overlays and category labels**, not Sonoco news/insights function.
- Apply to `Dự án tiêu biểu`, `Mẫu thành phẩm`, or an approved set of product use cases. **Do NOT add Blog/Tin tức** just because reference has “Insights”.
- Include short type labels such as `TEM CUỘN`, `NHÃN MAY MẶC`, only when correct; project names/clients require permission.
- Card click opens actual approved content or a meaningful `/du-an` destination; no fake detail pages.
- Responsive: 4 columns only where readable; 2 columns on tablet, 1 or 2 on mobile depending text length.

**Acceptance:** Distinct images, readable titles across varied photos, meaningful tags and click destinations.

### REF-05 — INTERIOR PHOTOGRAPHIC HERO

**File:** [`05-interior-photo-hero.png`](../../reference/desktop/05-interior-photo-hero.png)\
**Applies to:** `/giai-phap` landing Hero; pattern can be reused on selected interior pages.

**Visible in screenshot**
- Large **full-bleed landscape lifestyle image** beneath/behind a transparent high-contrast navigation overlay.
- Center-aligned, very large **white H1** and short white paragraph. Subtle dark/dim overlay brings typography forward.
- Second horizontal navigation row sits under main header, associated with an interior-page hierarchy.
- Bottom of screenshot transitions directly into a **navy editorial section** with text/image split.

**Adapt for Sunflower**
- Use a photo of an **actual application environment** (labels on goods, barcode/warehouse, textile tags, packaging), with real permissions.
- Replace centered slogan with an accurate Sunflower problem/solution statement. Keep a short, useful description.
- Only add second-level nav if page categories/subsections truly justify it; do not copy Sonoco categories.
- Page-specific photo or poster, **not another autoplay full-length Hero video on every page**.
- CTA optional; if present use `/san-pham` or `/lien-he` and don't overwhelm the photo.

**Acceptance:** H1 remains clear at all breakpoints; overlay/background contrast verified; secondary nav, if any, has actual anchor destinations.

### REF-06 — PRODUCT CATALOGUE WITH OPEN BACKGROUNDS

**File:** [`06-two-column-product-gallery.png`](../../reference/desktop/06-two-column-product-gallery.png)\
**Applies to:** `/san-pham` product landing/featured categories.

**Visible in screenshot**
- Entire page treated as **two clean vertical zones**: pale-blue wash on left half, white on right half, rather than individual bordered cards.
- Each zone includes **a large cut-out grouping of physical products** against an open background, then dark-blue title and 2–4 short lines of supporting text.
- Product media carries most visual weight; category blocks repeat in a tidy 2-column rhythm.
- Plenty of top/side negative space, aligned text blocks, clear enterprise look.

**Adapt for Sunflower**
- Use approved product groups from `STRUCTURE.md`: tem trắng/màu cuộn, tem tờ, mực in, máy in/máy quét, vải/tem dệt, hộp, thẻ bài etc. Names/specs need confirmation.
- **Top categories** can use this 2-column editorial open-background recipe; the remaining 13 groups can use a more compact consistent product grid. Do not force all 13 into overly tall wide blocks.
- Product photos: real packshots, even lighting, good source resolution; use `object-contain` where labels/rolls must not be cropped.
- Titles and summaries follow a unified baseline. Alternate blue-tinted/white backgrounds with intention, not random colors.
- Link each group to working anchor or approved detail page; `Yêu cầu báo giá` passes verified category context to `/lien-he`.

**Acceptance:** Product photos look credible, text panels align, 2-column/1-column transition works; no consumer e-commerce elements invented.

### REF-07 — ABOUT HERO WITH CURVED BLUE BRAND SHAPE

**File:** [`07-about-curved-blue-hero.png`](../../reference/desktop/07-about-curved-blue-hero.png)\
**Applies to:** `/gioi-thieu` Hero; can inspire a limited `/nang-luc` blue Hero variant.

**Visible in screenshot**
- White triangular/curved corner upper-left flows into a **large navy-blue brand-shaped field**, echoing Home's visual DNA.
- Secondary navigation row within Hero, white title and paragraphs at left; prominent **wide photo with rounded corners** at right.
- Fine dotted circular arcs on far right serve as secondary detail; media and H1 remain focal.
- Hard edge below the Hero transitions to a very light-blue next section.

**Adapt for Sunflower**
- `AboutHero` uses an **original curved navy panel**, white headline, short authentic company introduction left, one verified company/team/photo right.
- Do not reuse Sonoco's environmental photo/message; adapt to labels/materials/company reality.
- Keep blue curve as **brand language** shared with Home, but not every interior page needs the identical shape.
- Dotted arcs/rings are optional tiny decoration, only if they stay visually quiet and are responsive.
- Optional in-page nav only if actual subsections exist; otherwise leave out.

**Acceptance:** Asymmetric split is balanced, long Vietnamese copy does not collide with photo, shapes don't hide media on mobile.

### REF-08 — HISTORY / COMPANY STORY EDITORIAL SPLIT

**File:** [`08-history-editorial-split.png`](../../reference/desktop/08-history-editorial-split.png)\
**Applies to:** `/gioi-thieu` → `OurStory`; `/nang-luc` explanatory text/photo split.

**Visible in screenshot**
- White header and page, then a **pale-blue background zone largely occupying the left half** of the content section, white zone on right.
- A large editorial photo with rounded corners sits inside the left area, around mid-height.
- Right text column: small uppercase blue eyebrow, bold dark-blue heading, several readable paragraphs.
- Generous spacing between the image and editorial copy; not enclosed inside a card.

**Adapt for Sunflower**
- Place real company/workshop/story photograph left; authentic introduction/history/working approach right. **Never invent founding dates**.
- If not enough real history exists, replace the `History` title with `Cách chúng tôi làm việc` or `Hành trình cùng khách hàng` — only if Sunflower approves the copy.
- Use 5/7 or 6/6 split from `DESIGN.md`. Pale-blue background may extend beyond its column to create editorial weight.
- On mobile stack photo and text in coherent sequence; maintain readable line lengths and avoid empty spacer bands.

**Acceptance:** Image and text aligned, 16–18px legible body copy, no fake timeline/history, graceful responsive stacking.

## 4. REFERENCE → PAGE MAPPING (APPROVED 7-PAGE SITE)

| Sunflower page | Primary refs | Supporting refs | Implementation principle |
|---|---|---|---|
| `/` Home | REF-01, REF-02 | REF-04, REF-08 | Cinematic first impression → factual benefits/capabilities → product/projects CTA |
| `/gioi-thieu` About | REF-07, REF-08 | REF-03 only if verified metrics | Bold brand-shaped opening → real business story |
| `/san-pham` Products | REF-06 | REF-04 for select gallery tiles | Large packshots + functional category browsing |
| `/giai-phap` Solutions | REF-05 | REF-08, REF-06 | Application photograph → customer problem/approach/products |
| `/nang-luc` Capabilities | REF-02, REF-08 | REF-03 only if verified metrics | Evidence-first photos → actual workflow, QA, manufacturing |
| `/du-an` Projects | REF-04 | REF-06 | Image-led gallery of publishable real work |
| `/lien-he` Contact | shared REF-01/07 navy language | REF-08 for simple split | Brand-consistent contact heading, *working* form and verified contact data |

**Missing reference coverage:** No dedicated Sonoco mobile screenshot, form/contact screenshot, approved Sunflower product photography, or recorded video-motion sample among these eight. Codex must use `DESIGN.md` / `STRUCTURE.md` for those cases and state where design assumptions are proposed rather than observed.

## 5. PRACTICAL COMPONENT RECIPES

| Pattern | Design task | Likely React/CSS component | Notes |
|---|---|---|---|
| Hero curve | Distinctive blue shape behind video/text | `HeroBrandArc` | Use native CSS/SVG; custom geometry, not traced screenshot |
| Two header modes | Transparent on Hero / solid when scrolling | `Header` | Real navigation, readable focus, not two separate duplicated headers |
| Cinematic background | Video / poster / pause control | `VideoHero` | HTML5 video, reduced-motion fallback |
| Staggered image tiles | 3 asymmetric columns | `ValueHighlights` | CSS grid with deliberate offsets, mobile stack |
| Circular proof | Real metrics, optional | `VerifiedMetrics` | Implement only after data approval; simple CSS circles |
| Editorial cards | Project/product image collections | `EditorialCardGrid` | Different content, unified card geometry |
| Two-column product features | Big packshots, open backgrounds | `ProductFeatureGrid` | `object-contain` for full product shape |
| Text/image split | Story/process/capability | `EditorialSplitSection` | Configurable order, background, alignment |
| Contact CTA | Navy final action panel | `ContactCTA` | Real `/lien-he` destination |

**Component discipline:** Only create a shared component once it serves at least two meaningful usages or isolates real complexity. One-off layout can remain in its page section. Don't install masonry/animation libraries for a layout CSS can achieve.

## 6. HOW CODEX MUST USE THIS GUIDE

### Stage 1 — Reference audit, NO code changes

1. Check that all eight named screenshots exist and open each one.
2. Extract an observation summary: section geometry, typography hierarchy, colors, image proportions, white space, CTA and any *visible* UI affordances.
3. Distinguish **observed** from **inferred** behavior (e.g., paused-video icon is visible, but actual player behavior is not verified).
4. Identify which Sunflower page/section maps to each screenshot.
5. Compare reference expectations with `DESIGN.md` and `STRUCTURE.md`; record any conflicts (especially palette adjustments and Hero geometry).
6. State missing Sunflower assets/content; do not substitute fictional corporate facts.

### Stage 2 — Wireframe and visual mock

1. Make a Home wireframe based on `STRUCTURE.md`, **not an exact 8-screenshot paste-up**.
2. Design a desktop visual mock at 1440px and a mobile mock at 390px for Header + Hero + 1–2 representative sections.
3. Include actual Sunflower-approved copy/assets when available; otherwise explicitly mark placeholders and use safe generic visual shapes.
4. Show how navy arc, video right focal area, green CTA and white editorial rhythm translate into Sunflower's brand.
5. Request approval **before** building all seven pages. If mock requires code to show motion, build a clearly scoped throwaway/iterative prototype, not full backend features.

### Stage 3 — Component architecture and implementation

1. After mock approval, audit current Next.js files and propose minimum useful shared components.
2. Build Header and Hero first; implement video accessibility and poster fallback.
3. Add one representative dark section and one light editorial section; visually confirm brand rhythm.
4. Continue page-by-page per `STRUCTURE.md` without adding unsupported features.
5. For each component, cite the reference ID in implementation notes/PR (e.g., `Hero based on REF-01`).

### Stage 4 — VISUAL QA LOOP

For every approved section:

1. Render at viewport widths `390`, `768`, `1024`, `1440`, `1920` (when tools available).
2. Capture a screenshot (desktop and mobile at minimum).
3. Compare **your result vs. intended reference pattern** for: dominant composition, container alignment, headline scale, content density, negative space, media focal area, color hierarchy and CTA prominence.
4. Check mobile layout independently; screenshots provided do NOT define Sonoco's mobile behavior.
5. Check actual working states: menu, CTA links, video pause, reduced motion, image loading, focus, form validation.
6. Fix large structural deviations before micro-adjusting radii or shadows.
7. Explain what is still different **and whether the difference is intentional for Sunflower**.

**Visual QA rating (internal heuristic, not scientific accuracy score):**
- `Layout`: section hierarchy, grid, content rhythm.
- `Color`: navy/light sections and clear CTA accent.
- `Typography`: H1 scale, line length, header hierarchy.
- `Media`: real photo quality, crops, video readability.
- `Responsive`: coherent composition on mobile.
- `Interaction`: working menu/CTA/video/form.

**Stop gate:** Do not proceed to building *all* remaining pages if the approved Home Header + Hero + first representative sections are visibly off-direction.

## 7. ASSET OWNERSHIP & SHIPPING RULES

`../reference/desktop/*` are **reference screenshots only**:

- Never import them in `src/` as customer-facing components.
- Never copy them to `public/`, bundle in production, or host them as Sunflower business imagery.
- Never use Sonoco logotype or photo pixels in generated production graphics.
- Keep real publishable Sunflower brand/photos/videos under `public/images/` and `public/videos/` with explicit provenance.
- Product photos and manufacturing evidence must come from Sunflower or properly licensed, truthfully labeled sources.
- If the video has not yet been provided, implement a clear image poster/mock with a documented missing-media task.
- For a public Git repository, consider excluding `references/` from commits and instead storing the reference pack privately according to the user's permissions and organizational policy.

## 8. HANDOFF CHECKLIST

- [ ] All 8 images in `../reference/desktop/`, filenames match this file.
- [ ] Read `../AGENTS.md`, `docs/DESIGN.md`, `docs/STRUCTURE.md`.
- [ ] Open and summarize visual evidence from relevant images.
- [ ] Do not confuse Sonoco's product names/pages with Sunflower's approved seven pages.
- [ ] No fabricated metrics or actual-factory claims.
- [ ] Home Hero direction based on REF-01; About based on REF-07/08; Products based on REF-06.
- [ ] Visual mock reviewed at desktop/mobile before large-scale implementation.
- [ ] Media/motion assumptions recorded; no claim of observing animations from still screenshots.
- [ ] Implemented UI is visually compared by screenshots after coding.

---

### Suggested Codex kickoff prompt

> Read `../AGENTS.md`, `docs/DESIGN.md`, `docs/STRUCTURE.md`, and `docs/REFERENCE_GUIDE.md`. Open all 8 screenshots under `../reference/desktop/`. Produce a visual-analysis report mapping each reference to the approved Sunflower pages, clearly separating visible facts from inferred animation/responsive behavior. Then propose a **Home desktop/mobile mockup for Header + Cinematic Video Hero + two representative sections**. Keep the existing seven-page sitemap. Do not yet implement all site routes or integrate Firebase. Explain the layout, type hierarchy, spacing, and media/assets still needed. Ask for approval of the mock before detailed component architecture and full coding.
