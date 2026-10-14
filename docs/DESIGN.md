# SUNFLOWER — DESIGN SYSTEM
> **Version:** 2.2 · 2026-10-14
> **Status:** Approved *design direction*; exact legal Sunflower brand colors, logo, video footage and content still require source verification.  
> **Primary reference:** https://www.sonoco.com/na  
> **Visual DNA:** Sonoco-inspired · Modern Industrial Corporate · Powerful · Cinematic · Expressive motion · Product depth · Clean editorial
> **Authority:** Defines visual presentation. Functions and routes are defined in `STRUCTURE.md`.

## 1. Design intent / What to borrow from Sonoco

### Latest approved brief — modern, powerful, dimensional

The owner's instruction on 14/10/2026 supersedes the earlier restrained-motion direction: **Sunflower must be professional and clean, yet visibly modern, powerful and eye-catching, with multiple purposeful effects, animation and 3D blocks. Traditional/dated corporate styling is unacceptable.** Motion and depth are part of the visual identity and acceptance criteria, not an optional polish pass.

Keep Sonoco's editorial clarity, strong typography, large media, controlled whitespace and section rhythm. Use MWDT as a secondary reference for prominent product objects and depth across section boundaries. Keep Sunflower's brighter blue/orange palette, Inter, cinematic video Hero, content and seven-page structure. This direction authorizes richer movement and spatial composition without copying either reference's assets or exact layouts. Detailed effects below are Sunflower proposals, not assertions about animations observed on those sites.

The static composition must also feel contemporary: confident scale contrast, intentional overlaps, open galleries, dimensional product/packaging forms and varied image/text arrangements. A conventional stack of centered headings, equal cards and basic fades is insufficient. Visual energy must come from the design as well as movement.

1. **Large-scale corporate color blocks:** deep navy/blue creates identity; white/off-white preserves readability.
2. **Strong hero:** a bold industrial video area, prominent headline, one dominant action.
3. **Editorial sequencing:** Hero → clear message → products/markets → differentiators → capabilities/proof → project imagery → contact.
4. **Full-bleed media + strong information hierarchy:** large product/manufacturing photographs instead of random decorative icons.
5. **Controlled action accent:** use the active orange CTA tokens against bright blue and neutral sections; baseline green remains inactive.
6. **Strong typography:** large, confident, concise Vietnamese headings with real B2B meaning.
7. **High production value, low visual clutter.** Each section earns its place.

**Legal/design rule:** This is an **adapted palette and layout system for Sunflower**, not a claim that the values below are Sonoco's exact production CSS or official style guide. Public references indicate Sonoco blues around `#234172` and `#00488E`; the green accent and other values below are designed for this project. Do not copy their photographs, videos, text, logo or pixel-level layout.

## 2. Color system — FINAL PROPOSED TOKENS FOR SUNFLOWER

| Token | HEX | Role |
|---|---|---|
| `--brand-navy` | `#12345F` | Dark corporate Hero / contrast sections |
| `--brand-navy-deep` | `#092746` | Footer / Hero gradient edge |
| `--brand-blue` | `#00488E` | Primary brand blue / headings, links |
| `--brand-blue-soft` | `#234172` | Alternate navy-blue surface |
| `--brand-green` | `#8ABD37` | High-visibility CTA background; **dark text on it** |
| `--brand-green-hover` | `#A0CF4B` | Hover/active accent |
| `--brand-gold` | `#C9A04B` | Optional small Sunflower identity accent, never the main CTA |
| `--background` | `#FFFFFF` | Main page background |
| `--surface` | `#F5F7F9` | Soft alternate section |
| `--surface-blue` | `#EAF1F7` | Light branded info section |
| `--foreground` | `#172B3A` | Dark heading / body |
| `--muted` | `#5B6975` | Supporting text |
| `--border` | `#DFE5EA` | Hairlines / controlled cards |
| `--on-dark` | `#FFFFFF` | On navy/video overlay |

**Usage guideline (not a numerical CSS rule):** most of the page white/light (around 60–70%), sizeable navy/blue areas (25–35%) and sparing green/gold accents (5–10%). Do not turn every section navy.

### Sample CSS contract

```css
:root {
  --brand-navy: #12345f;
  --brand-navy-deep: #092746;
  --brand-blue: #00488e;
  --brand-blue-soft: #234172;
  --brand-green: #8abd37;
  --brand-green-hover: #a0cf4b;
  --brand-gold: #c9a04b;

  --background: #ffffff;
  --surface: #f5f7f9;
  --surface-blue: #eaf1f7;
  --foreground: #172b3a;
  --muted: #5b6975;
  --border: #dfe5ea;
  --on-dark: #ffffff;

  --container-max: 1320px;
  --radius-control: 6px;
  --radius-media: 10px;
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
}
```

If the repo already uses Tailwind/shadcn tokens, **map these values into the existing system** rather than duplicating two competing color sources. Verify all final foreground/background combinations for WCAG AA. Color-pair warning: never use white small text over bright green; use dark navy instead.

### Core color pairings

| Background | Text | Usage |
|---|---|---|
| Navy `#12345F` | White | Hero, capability blocks, footer |
| White `#FFFFFF` | Dark `#172B3A` | Main editorial sections |
| Surface `#F5F7F9` | Dark `#172B3A` | Products, process, supporting copy |
| Green `#8ABD37` | Deep navy `#092746` | Primary CTA (test contrast) |
| Blue `#00488E` | White | Secondary primary button on light sections |

**Brand mark caveat:** If Sunflower's official yellow is essential in the logo, leave it in the mark and use sparingly as a decorative brand accent. Do not replace official brand assets with a Sonoco-colored logo.

### Active color direction requested 14/10/2026 — brighter blue + orange

The user's latest comparison screenshots request a fresher blue and orange buttons, superseding the earlier amber-button preview. The active interface uses the existing `--brand-blue: #00488E` for primary branded surfaces and orange for actions. Layout, typography, media and seven-page scope remain unchanged. Keep the current `data-accent="warm"` activation rather than adding another theme/source tree. The baseline palette above remains available; these are Sunflower interface choices, not a claim about Sonoco's official CSS or Sunflower's legal brand guidelines.

| Active token | Value | Role |
|---|---|---|
| `--brand-navy` in active variant | `var(--brand-blue)` → `#00488E` | Primary blue Hero, branded surfaces and headings |
| `--brand-navy-deep` | `#092746` | Dark button text and small video-control/caption backplates |
| `--brand-orange` | `#F58A2B` | All primary button backgrounds, navigation underline and small arrow/wordmark details |
| `--brand-orange-hover` | `#D97732` | Deeper orange hover background |
| `--surface-warm` | `#F7F5EF` | Light corner outside the Home blue Hero curve |

Shared UI consumes semantic tokens `--action-accent`, `--action-hover`, `--focus-accent`, `--detail-accent`, `--mark-accent` and `--hero-base`. Default values map to the baseline green/gold/light-blue palette; the active variant maps actions to orange/deeper-orange and the corner to ivory. Amber remains an unused optional token, not an action background. Focus is blue on light surfaces, white on Hero/overlay Header, and blue on the wordmark's light desktop corner; mobile wordmark uses white focus. Do not hardcode palette values in individual components or create a separate demo source tree.

Calculated contrast: deep-navy `#092746` text on orange is 6.15:1 and on hover is 4.77:1; white text/focus on blue is 9.06:1. Orange on blue is 3.69:1 for small non-text details. Bright orange is not used for normal body text on white. White text against an 86% blue overlay composited over white is 6.36:1; this calculation does not replace frame-by-frame/browser review.

Removing the root `data-accent="warm"` attribute restores the original baseline. Do not remove it during routine implementation: the active brighter-blue/orange direction is explicitly requested by the user.

## 3. Typography & hierarchy

- **Recommended font:** `Inter` (via `next/font/google`), with Vietnamese coverage. Prefer provided official font if available; do not add several unrelated families.
- Headings: semibold/bold `650–750`, slightly tight tracking, controlled line breaks.
- H1 video Hero desktop: `clamp(3rem, 5.4vw, 6rem)` / line-height `1.02–1.10`; target 2–4 short lines in Vietnamese.
- H1 other pages: `clamp(2.8rem, 4.8vw, 5rem)`.
- H2 section: `clamp(2.1rem, 3.4vw, 3.8rem)`, line-height `1.12`.
- H3: `clamp(1.35rem, 2vw, 2rem)`.
- Body: `16–18px`, line-height `1.55–1.7`. Secondary text: `14–16px`.
- Eyebrow: `12–14px`, semibold, slightly increased letter spacing.
- Max reading measure: 60–75 characters/line for paragraphs; Hero text width ~560–680px.
- Heading structure: one H1 per route, H2 sections, H3 subsections. Never make all headings uppercase; all caps only for short editorial labels or short display lines.
- Use actual label-industry language (`tem nhãn`, `decal`, `mực in`, `gia công`, `quy cách`, `giải pháp theo ngành`) rather than generic buzzwords.

## 4. Layout, grid, section rhythm

| Attribute | Desktop | Tablet | Mobile |
|---|---|---|---|
| Content max width | 1320px | Fluid | Fluid |
| Side gutters | 40–64px | 28–36px | 20px |
| Grid | 12 columns | 6–8 columns | 1–2 practical columns |
| Major section padding | 96–136px | 72–96px | 60–76px |
| Normal text/image gap | 48–88px | 32–56px | 24–36px |

Spacing scale: `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128px`. Use CSS tokens/utilities rather than arbitrary values.

### Approved composition recipes

**A — Cinematic Hero (home only):**
- 100% viewport width, `min-height: 88–100svh` on desktop, content aligned to an internal grid.
- Video full-bleed behind layout; let subject remain visible.
- Original dark-blue curved *arc/mask/panel* rising from left or framing the right-side video, Sonoco-inspired but not copied. If the actual footage clashes with the arc, use a navy left-to-right gradient instead.
- Text/H1 in a clear zone left or lower-left; primary green CTA and optional white/outline secondary link.
- Navbar overlays Hero in light-on-dark mode; change to solid white/navy with scroll only after contrast testing.
- Pausing video must not hide title or controls.

**B — Editorial Split:** 6/6 or 5/7, photo+text; alternate text-left/image-right, then image-left/text-right.

**C — Color Block Feature:** full-width navy surface, white headline and 2–4 readable capability statements. Prefer separators and layout rhythm over colored cards.

**D — Product Catalogue Grid:** desktop 3–4 columns, tablet 2, mobile 1–2; consistent photo aspect ratios; names and useful short descriptions.

**E — Industry/Use-case Feature:** large editorial photography, short customer problem → solution benefit, link to `/giai-phap`.

**F — Production Timeline:** actual process steps connected by rule/number; mobile vertical list, not an impossible tiny horizontal timeline.

**G — Project Showcase:** large asymmetric photo grid or 2-column project previews; no fake client/project credentials.

**H — Contact Finish:** clear final CTA, darker navy panel, concise choice to contact/quote.

**Avoid:** endless 3-card grids, dashboard panels, loud colored borders, repeated rounded tiles, gratuitous badges.

## 5. Video Hero specification (required design target)

### Creative direction

- Footage: precision label printing, production equipment, rollers, product close-ups, inspection, real finished products.
- Suggested 12–18-second seamless loop; **duration is editorial guidance, not a hard technical limit**.
- Original shot sequence: machinery reveal → label roll detail → inking/finishing → product detail.
- Avoid fast-cut gaming aesthetics, fake sparks, aggressive glows or stock footage that implies it is Sunflower's own factory.
- Poster: keyframe consistent with first video scene. WebP/AVIF.

### Technical acceptance

| Property | Requirement |
|---|---|
| Desktop source | 16:9 footage, around 1920×1080 capture/export if available |
| Mobile source | 9:16 or separate carefully re-framed file, optional |
| Video format | Widely supported MP4/H.264 baseline; modern alternative optional |
| Playback | `autoPlay`, `muted`, `loop`, `playsInline`, manual pause/play |
| Fallback | `<video poster>` / static image when motion unavailable |
| Reduced motion | Static poster instead of autoplay |
| Mobile data | Prefer poster when user settings/performance warrant it |
| Audio | None by default |
| Sizing | Compress by visual quality, measure network transfer and LCP; avoid oversized footage |
| Accessibility | Accessible Pause/Play button, keyboard control, readable text |

**Reference structure only:**

```tsx
<section className="relative isolate min-h-[90svh] overflow-hidden">
  <video
    className="absolute inset-0 h-full w-full object-cover"
    autoPlay
    muted
    loop
    playsInline
    poster="/images/hero/hero-poster.webp"
    aria-hidden="true"
  >
    <source src="/videos/hero/hero-desktop.mp4" type="video/mp4" />
  </video>
  {/* Navy overlay / original curved panel, real text, real controls */}
</section>
```

The JSX example illustrates markup only: complete implementation must include motion/user-preference handling, real pause/play control, safe fallback, adaptive video loading and overlay contrast.

### Hero copy pattern

- Eyebrow: `SUNFLOWER / GIẢI PHÁP TEM NHÃN & IN ẤN`
- H1 draft (requires content approval): `Giải pháp tem nhãn cho từng nhu cầu sản xuất.`
- Supporting copy: one compact value paragraph, avoid invented certifications or production statistics.
- Primary CTA: `Khám phá sản phẩm` → `/san-pham`.
- Secondary CTA: `Yêu cầu báo giá` → `/lien-he`.
- Small scroll cue optional, must not overshadow CTA.

## 6. Header & navigation

- Desktop: logo left, `Trang chủ` followed by 5 core navigation links, quote CTA right; header height about 76–88px. The explicit Home link was requested by the owner on 14/10/2026 and uses the existing active underline/focus treatment.
- At the very top of Home Hero: transparent over navy/video if readable. Scrolled state: white or navy solid background with clear border. No translucent glass blur by default.
- The CTA should be compact and legible; do not duplicate a floating CTA widget.
- Mobile: accessible menu trigger, large-enough touch target, non-overlapping full menu, close on route change, no hidden horizontal links.
- Sticky behavior is allowed if it does not steal excessive viewport height.
- Link active/focus states are visible without relying only on color.

## 7. Components & states

| Component | Behavior |
|---|---|
| Primary CTA | Green surface + deep navy text on dark Hero; blue+white acceptable in light sections |
| Secondary CTA | Text link/outline with arrow; never compete with primary |
| Buttons | Height 44–52px, moderate 4–8px radius, visible focus |
| Images | Object-fit cover for editorial; contain or controlled crop for product photos |
| Category tiles | Image-first, slim text area, hover scale ≤1.04 |
| Process rows | Strong number, subtitle, explanation, fine separator |
| Project cards | Large image, project/product type, context; no shadows unless essential |
| Forms | Label, input, required hint, validation, loading, error, verified success |
| Footer | Deep navy, clear grouped links, actual contact/company data |

No random icon illustrations where good imagery or text tells the story better.

## 8. Motion & interaction system

### 8.1 Required motion language

**Expressive, precise, industrial.** Combine several complementary effects through the page: typographic entrances, image reveals, staggered galleries, short scroll-linked movement, interaction feedback and dimensional product staging. A single global fade-in is not an adequate implementation. Each section has a dominant motion idea and supporting interactions; vary the choreography while sharing timing/easing tokens. The video remains an important focal point, with the UI and 3D composition contributing their own energy.

| Area | Required design treatment | Behavior |
|---|---|---|
| Header / menu | Animated underline, responsive opening/closing | Short transitions; clear active/focus states; no delayed navigation |
| Video Hero | Phrase-level title reveal, sequenced copy/CTA, controlled blue-panel/media reveal | One coordinated entrance, roughly 600–900ms; keep video/controls readable and preserve the existing Hero |
| BrandIntroduction | Image revealed through a mask, text entering with a distinct offset | Trigger on entry; do not split every paragraph into animated words |
| Featured products | Staggered presentation, image depth and linked hover/focus feedback | Product remains identifiable; no decorative hover suggesting clickability on a non-link |
| WhySunflower | Staggered photo blocks and depth between foreground/background | Animate the composition's existing offsets; retain illustration captions and credits |
| Product/packaging signature | Original dimensional object overlapping an existing image/color boundary | A required visual anchor inside an approved section, not a new route or replacement for the video Hero |
| ContactCTA | Confident heading entrance, responsive button/arrow interaction | CTA stays available immediately; no continuously flashing or bouncing button |

Entrances normally play once per page visit. Longer decorative motion belongs to the signature object, not every card; stop it offscreen and provide a stop/static option if it runs continuously. Preserve native scroll speed and reading order. No forced scroll snapping, hijacking, custom cursor or blocking transition screens.

### 8.2 3D and dimensional composition

**3D blocks are explicitly approved and required in the visual direction.** Prioritize Sunflower-related forms: a label roll with visible thickness, layered printed sheets, an extruded packaging box or a material/sample stack. Model depth, perspective, lighting and a consistent contact shadow so the object has believable volume. Use blue/orange/neutral tokens and original generic artwork; avoid unrelated cubes/orbs or copied MWDT component geometry.

- First implementation: native CSS perspective/3D transforms and layered geometry for a product-related scene. A cut-out packshot can support a 2.5D layer, but a flat image with a shadow alone does not satisfy the full dimensional brief.
- Proposed placement: the Hero-to-BrandIntroduction boundary or FeaturedProductCategories composition, preserving section order and safe zones for title/CTA. At least one prominent dimensional scene is required on the final Home design; the pattern may then be reused selectively on inner pages.
- Pointer tilt may use modest rotation and translateZ on fine-pointer desktop. Scroll-linked translation/rotation should have a short bounded range. Keep labels/text readable; no endless fast spinning.
- Photographic packshots need sufficient resolution and authorized backgrounds/artwork. Interactive WebGL is an optional later technical route if a real model/viewer need emerges; it is not necessary for CSS-built 3D forms.
- Generic 3D forms are brand/product illustrations, not proof of a real Sunflower machine, factory, client project or exact product specification. The G2 CSS scene is explicitly captioned as an illustration; no external model or packshot asset is implied.

### 8.3 Motion/depth tokens — implemented centrally in G2.Motion

These canonical targets are now present in `globals.css`. Keep existing palette/spacing tokens and update this contract when tuning rather than scattering numbers across components.

| Token | Initial value | Purpose |
|---|---|---|
| `--motion-fast` | `180ms` | Links/arrows/underline |
| `--motion-ui` | `240ms` | Buttons and menu interaction |
| `--motion-reveal` | `600ms` | Section/image reveal |
| `--motion-hero` | `800ms` | Hero entrance sequence |
| `--motion-stagger` | `80ms` | Neighboring blocks/phrase offsets |
| `--motion-distance` | `24px` | Standard entrance translation |
| `--motion-hover-distance` | `4px` | Linked arrow translation |
| `--motion-hover-scale` | `1.03` | Product image hover |
| `--motion-scroll-range` | `48px` | Maximum initial desktop parallax travel |
| `--depth-perspective` | `1000px` | Scene perspective |
| `--depth-layer` | `24px` | Supporting layer depth |
| `--depth-feature` | `64px` | Foreground product depth |
| `--depth-tilt-max` | `8deg` | Initial desktop pointer tilt bound |
| `--ease-standard` | Existing `cubic-bezier(0.22, 1, 0.36, 1)` | Shared movement easing |

### 8.4 Implementation and accessible fallbacks

Default to self-authored CSS/keyframes, IntersectionObserver and lightweight browser JavaScript. No external repo is required. Add a shared reveal/scene controller only when it serves real usages; preserve Server Components for copy/page composition. Consider at most one motion engine only when native tools cannot cleanly deliver the agreed choreography; do not install multiple libraries or a 3D renderer automatically.

Use progressive enhancement: essential content and CTA are visible in server HTML/no-JS mode, before observer/scene initialization and if an asset fails. Never leave text at opacity zero because a script has not loaded. Animate transform/opacity where possible; avoid scroll-driven layout recalculation, oversized compositing layers and a permanent will-change on every element. Performance targets must be measured, not described as guaranteed.

Mobile uses the same confident composition with shorter offsets, fewer simultaneous effects and a static or simplified dimensional scene. Disable pointer tilt on touch. Under prefers-reduced-motion, remove reveals/parallax/tilt/continuous motion and use the Hero poster, keeping the strong type, spacing and static product depth. Caption, focus outline, video controls, forms and navigation stay operable throughout animations.

## 9. Imagery & media art direction

**Media allocation (original assets target for v1):**
- 1 desktop Hero video + 1 poster generated from actual footage; optional mobile edit.
- 35 distinct content photographs: Company 4, Products 13, Solutions 5, Capabilities 6, Projects 6, Contact 1.
- Homepage reuses many of these photos — **do not make 15–20 extra homepage images** just to fill space.
- Count is a planning estimate; publish only verified and licensed files.

| Usage | Preferred framing |
|---|---|
| Home video Hero | 16:9 cinematic, safe text/subject zones |
| Editorial/company | 3:2 landscape |
| Product categories | 1:1 or 4:5 consistent |
| Solutions/industry | 4:3 landscape |
| Capability/equipment | 3:2 landscape |
| Projects | 4:3 or editorial asymmetry |
| Contact | 3:2 |

- Products should share consistent lighting, background and crop.
- Factory/capacity/project evidence MUST come from actual Sunflower-authorized material.
- Never upscale tiny images until they blur; choose enough source pixels, deliver responsive formats.
- Use descriptive filenames; no generic `image1.png` or URL hotlinks.
- Full media paths and names live in `STRUCTURE.md`.

## 10. Responsive & visual QA

### G1 implementation refinement — 14/10/2026

Header/Hero retains the approved blue/light composition and the user's active brighter-blue/orange revision above. Header switches to the dialog menu below 1200px so the five links, brand descriptor and quotation action have room; its height remains 88px desktop/tablet and 76px mobile.

Hero uses the same three phrase groups on desktop/mobile: `Giải pháp` / `tem nhãn cho` / `từng sản phẩm.`. CSS consumes `--hero-title-size` (the existing desktop type clamp), `--hero-media-min-height: 520px` and `--hero-focal-point: 70% center`. The latter two describe media geometry/framing, not new brand colors or spacing scales. Desktop media starts at 40% of the viewport, uses a 16:9 base ratio with a minimum height bounded by 60svh; the original navy arc remains. On mobile and portrait tablet, copy and footage occupy separate rows and the footage retains 16:9 because no separate portrait source exists. No stretch/upscale export is introduced.

Poster stays behind the video until the `playing` event. The desktop gradient has an explicit layer above both assets and protects the left text zone, fading to clear sooner at 62%; the dark bottom gradient is removed. On mobile/portrait tablet, text is outside the footage so no media overlay is needed. Caption/status remain on small deep-navy backplates to keep text legible. Autoplay rejection leaves a manual Play action. Reduced motion and supported Save-Data/2G signals prevent mounting the video/source; errors return to the poster.

Fresh production-browser review is complete at all five required viewport sizes using bundled Playwright and Chrome headless. Screenshots exposed aspect-ratio/min-height expanding the absolute media width, causing internal horizontal scrolling after focus; explicit breakpoint width constraints now keep media inside its gutter. Screenshots were retaken and inspected after the fix. Caption/control width is constrained; error fallback offers manual retry. See IMPLEMENTATION_PLAN.md for measured geometry, reference comparison, interaction evidence and browser/device limitations. No separate mobile Sonoco reference exists.

Test breakpoints at viewport widths `390`, `768`, `1024`, `1440`, `1920` px (also test unusually narrow ~320px if relevant).

- **Mobile Hero:** approximately 82–100svh when practical; text block prioritizes clarity, not desktop crop reproduction.
- Center the focal point on mobile, reduce arc complexity or remove it if it blocks video.
- Main title max 3–5 short lines on mobile with no clipping.
- Product grid 1–2 columns depending content; buttons accessible and full-width where needed.
- Alternate editorial splits stack in a deliberate narrative order.
- Avoid fixed heights that cut text on localization or browser font scaling.
- No horizontal overflow or image stretching.
- Inspect text contrast against multiple Hero frames, not only poster.
- Check loading fallback, autoplay blocked, paused state and reduced motion.

### G2 section implementation

The new Home slice applies existing recipes: pale-blue/white editorial introduction (REF-08), an open two-column selection of four products (REF-06), and four photographic collaboration statements staggered across three columns on bright brand-blue (REF-02). Portrait/mobile layouts stack in reading order. One primary section action links to the approved route. ContactCTA uses a pale-blue relief section before the deep-blue shared Footer. Tokens add only aliases for section padding/H2/H3 sizing from the existing spacing/type contract; no new palette, animation engine or decoration. Photos retain illustration/credit text.

Per the owner’s explicit G2 request, no new browser/screenshot or separate lint/typecheck QA is run in this slice. Responsive styling is implemented but visual acceptance remains pending. G1 screenshots do not certify G2.

### G2.Motion implementation — 14/10/2026

G2.Motion adds a shared IntersectionObserver controller with progressive enhancement; phrase/media Hero reveal, introduction image mask, staggered product and collaboration compositions, responsive menu transitions, and button/arrow feedback. The featured-products section now contains a CSS-built label-roll, printed-sheet and label-web scene with real perspective/layer thickness, bounded desktop scroll movement and pointer tilt. It is captioned as a 3D illustration, not a technical specification or factory claim. No animation dependency, WebGL renderer, model asset or new route was added.

At 1440×900 and 390×844, production-preview screenshots confirm the intended composition, complete content and no horizontal overflow. Motion state was inspected in-browser; desktop tilt changes the 3D transform, mobile menu opens/closes, and no page errors occurred. Reduced-motion keeps all reveal content visible, removes the scene movement and uses the existing static Hero poster. TypeScript and production build pass; the full G1 five-viewport/media/network test matrix and lint were not repeated for this slice.

## 11. EXAMPLE SECTION SEQUENCE / COLOR MAP

| Home sequence | Visual recipe | Background |
|---|---|---|
| 01 Hero | Video + original navy curve + headline | Navy/video |
| 02 Brand introduction | Editorial story | White |
| 03 Products | Category gallery | Light surface |
| 04 Why Sunflower | Differentiators / proof | Navy |
| 05 Capabilities | Big manufacturing media + process | White |
| 06 Solutions/Industries | Image-first vertical editorial | Light surface |
| 07 Projects | Large gallery | White |
| 08 Process/quality | Timeline, proof-oriented | Blue-tinted / white |
| 09 Contact CTA | Strong closing action | Deep navy |
| 10 Footer | Site-wide navigation/contact | Deep navy |

**This sequence is for the Home page.** Seven top-level routes and exact functions are governed by `docs/STRUCTURE.md`.

## 12. Design system acceptance criteria

- [ ] Sonoco-inspired **blue/white/light-neutral + active orange** hierarchy is recognizable, with original Sunflower identity.
- [ ] The result feels modern, powerful and eye-catching; traditional/dated corporate composition is rejected even if its spacing is clean.
- [x] Multiple complementary motion patterns and a prominent product-related dimensional/3D scene are implemented; a generic fade-only page is insufficient.
- [x] Motion/depth follow section 8, with usable touch, reduced-motion and no-JS states; the CSS illustration requires no external 3D asset.
- [ ] Hero has cinematic video, safe overlay, distinctive large typography, accessible fallback.
- [ ] Pages feel like a substantial B2B corporate website, not a generic three-card landing page.
- [ ] Design tokens/spacing/type are consistent across pages.
- [ ] Photos and proof are real or explicitly non-production placeholders.
- [ ] Sections have varied layouts but stable margins and editorial rhythm.
- [ ] Mobile is intentionally composed, not merely scaled down.
- [ ] Verified CTA flows and accessible states.
