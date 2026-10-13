# SUNFLOWER — WEBSITE STRUCTURE & FUNCTIONAL SPECIFICATION
> **Version:** 2.0 · 2026-10-13  
> **Status:** Seven public routes approved. Internal page sections are implementation specifications subject to real content/media and user review.  
> **Visual reference:** Sonoco homepage section storytelling + Sunflower business context  
> **Related:** `../../AGENTS.md` (working rules at workspace root) · `DESIGN.md` (UI/UX and media)

## 0. What this document governs

**This document specifies:** sitemap, page objectives, ordered sections, interactions, data, media slots and recommended Next.js architecture.

**This document does not replace:** `AGENTS.md` for agent behavior, `DESIGN.md` for colors/typography/motion, verified company facts or existing production code.

**Project type:** Public corporate website + showcase + lead generation for Sunflower. **Do not confuse with the internal Sunflower ERP/CRM.**

### Approved seven-page information architecture

| ID | Route | Menu name | Core job |
|---|---|---|---|
| P01 | `/` | Trang chủ | Brand positioning and discovery |
| P02 | `/gioi-thieu` | Giới thiệu | Who Sunflower is |
| P03 | `/san-pham` | Sản phẩm | What Sunflower offers |
| P04 | `/giai-phap` | Giải pháp | Which business problems are addressed |
| P05 | `/nang-luc` | Năng lực | How Sunflower can deliver |
| P06 | `/du-an` | Dự án | Evidence of finished work |
| P07 | `/lien-he` | Liên hệ | Real lead / quotation intake |

**No eighth top-level page** without approval. Optional future `/san-pham/[slug]`, `/du-an/[slug]`, `/giai-phap/[slug]` are not automatically in phase 1.

## 1. Shared site shell

### Header

- Logo linked to `/`.
- Main navigation (desktop): `Giới thiệu`, `Sản phẩm`, `Giải pháp`, `Năng lực`, `Dự án`.
- Primary Header CTA: `Yêu cầu báo giá` → `/lien-he`.
- Header on home Hero initially transparent/light-on-dark; after scroll solid high-contrast background; on interior pages use stable blue/white style.
- Mobile hamburger menu with working focus/close states.
- Optional search only after the catalogue volume demonstrates a real need.
- Do not add ERP Login to main marketing navigation unless explicitly requested.

### Footer

- Company/contact information verified by Sunflower.
- Links to all seven top-level routes.
- Social profiles only if company-provided and valid.
- Legal/policy links as required by live contact form and applicable obligations.
- No fictional address, phone, email or customer logo.

### Shared conversion behavior

- `Khám phá sản phẩm` → `/san-pham`.
- `Xem giải pháp` → `/giai-phap`.
- `Tìm hiểu năng lực` → `/nang-luc`.
- `Yêu cầu báo giá` → `/lien-he`.
- Specific source context may be passed using validated query params:
  - `/lien-he?san-pham=<slug>`
  - `/lien-he?nhu-cau=<slug>`
  - `/lien-he?du-an=<slug>`
- Do not expose sensitive internal identifiers in public URLs.

## 2. Page P01 — HOME `/`

**Goal:** A confident first impression that clearly shows labels/printing/products, provides pathways to relevant content and gets a B2B visitor to request a quote.

**Visual reference:** Sonoco-inspired full-width industrial video, blue curved/accent Hero, strong headline, meaningful high-density corporate sections, varied image-first layout.

| Order | Section / component | Content & layout | Action |
|---|---|---|---|
| 01 | `VideoHero` | Cinematic production video, navy curved overlay/gradient, approved value proposition, poster, pause control | `/san-pham`, `/lien-he` |
| 02 | `BrandIntroduction` | Short Sunflower narrative, one factory/company photo | `/gioi-thieu` |
| 03 | `FeaturedProductCategories` | 4–6 category photos within an editorial grid, not 13 tiny tiles | `/san-pham` |
| 04 | `WhySunflower` | Differentiators with *verified* evidence; large navy section | `/nang-luc` |
| 05 | `CapabilitiesFeature` | Large real equipment/production image and useful capability statements | `/nang-luc` |
| 06 | `SolutionsByIndustry` | 3 image-first use-case entries (examples only until approved) | `/giai-phap` |
| 07 | `FeaturedProjects` | 3 real approved project/product photos | `/du-an` |
| 08 | `ProcessPreview` | Verified steps from enquiry to delivery, concise responsive timeline | `/nang-luc` |
| 09 | `ContactCTA` | Strong closing contact section | `/lien-he` |
| 10 | `Footer` | Navigation/contact | 7 routes |

**Home implementation notes**
- The large Hero video is exclusive to Home; do not auto-play a heavy video on every interior page.
- Hero must make clear this site is about Sunflower labels/print solutions in the first screen.
- The Home page reuses content images from other pages. Avoid duplicate assets and duplicate copy.
- Optional latest news/insights sections from Sonoco are **NOT IN SCOPE** until Sunflower approves a real editorial workflow.
- If there are no approved metrics/testimonials, do not invent counters; replace with a factual process/product story.

**Home acceptance:** Functional Hero pause/play and fallback, legible text throughout the video, clear B2B CTA, interesting section pacing, responsive navigation, no false proof.

## 3. Page P02 — ABOUT `/gioi-thieu`

**Goal:** Explain who Sunflower is, its business positioning and why it is a credible working partner.

**Suggested section order**
1. `InteriorPageHero`: large headline + real company photo/brand texture.
2. `CompanyOverview`: what Sunflower provides, to whom and why.
3. `OurStory`: authentic development story. **No invented founding year**.
4. `VisionValues`: only values/mission statements approved by company.
5. `PeopleAndCulture`: real photos of staff, work or collaboration with permission.
6. `CompanyMilestones` (optional): timeline only with authenticated dates.
7. `RelatedLinks`: product/capability shortcuts.
8. `ContactCTA`.

**Functional needs:** CTA to `/san-pham`, `/nang-luc`, `/lien-he`; logical reading order and photo caption where needed.

**Do not duplicate:** Technical equipment/process details belong mainly to `/nang-luc`.

**Photos target:** 4 unique original images (some used on home).

## 4. Page P03 — PRODUCTS `/san-pham`

**Goal:** Help business visitors browse product groups, understand common applications and submit a relevant quotation request. Not a consumer shopping cart.

**Sections**
1. `InteriorPageHero`: headline / short introduction / optional category montage.
2. `CategoryNavigation`: accessible jump links or real filtering only where appropriate.
3. `ProductCatalogue`: consistent photo-led cards with names, concise descriptions, applications.
4. `SpecificationsGuide`: how to communicate material, size, adhesive, quantities, ribbon/printing needs; only after review.
5. `ProductInquiryCTA`: link to `/lien-he` with selected category context.
6. `CommonQuestions` (optional, only real approved FAQs).

### Working 13-group product list — verify before publication

| Slug suggestion | Display group |
|---|---|
| `tem-trang-cuon` | Tem trắng cuộn |
| `tem-mau-cuon` | Tem màu cuộn |
| `tem-mau-to` | Tem màu tờ |
| `tem-trang-to` | Tem trắng tờ |
| `muc-in` | Mực in |
| `may-in` | Máy in |
| `may-quet` | Máy quét |
| `hop` | Hộp |
| `the-bai` | Thẻ bài |
| `tem-det` | Tem dệt |
| `tem-vai-nilon` | Tem vải nilon |
| `satin` | Satin |
| `bang-dinh` | Băng dính |

These names originate from previously discussed Sunflower product groups. **They are an editorial starting catalogue, NOT a claim that all 13 are confirmed current public offerings.**

**Each item data:** `slug`, `name`, `shortDescription`, `image`, `applications[]`, `specifications[]` (only verified), `inquiryLink`.

**Interaction**
- Category jump/filter must change the visible catalogue or move to the correct anchor; no decorative inactive filters.
- Optional search only if useful and truly wired.
- Clicking `Yêu cầu báo giá` for an item navigates to `/lien-he?san-pham=<slug>` with verified safe prefilling.
- No prices/inventory/reviews/checkout by default.

**Photos target:** 13 original category photos; square / consistent lighting.

## 5. Page P04 — SOLUTIONS `/giai-phap`

**Goal:** Show what business problems Sunflower helps solve, distinct from a simple product catalogue.

**Section architecture**
1. `InteriorPageHero`: problem-solving value proposition.
2. `SolutionsOverview`: concise overview and customer context.
3. `UseCaseSections`: **problem → approach → relevant product → outcome** for each approved use case.
4. `RelatedProductLinks`: cross-link into `/san-pham`.
5. `ContactCTA`: inquiry with context.

**Five possible image/use-case buckets (validate before publishing):**
- Retail / POS labels and shelf/product identification.
- Warehousing / barcode identification and logistics.
- Industrial manufacturing / traceability and durability.
- Garments / textile labels, hang tags and satin.
- Branded packaging / custom print.

These are discovery categories, not claims about a confirmed client portfolio.

**Interaction:** anchors/tabs only if needed; `/lien-he?nhu-cau=<slug>` prefill; each action has real destination.

**Photos target:** 5 approved application images.

## 6. Page P05 — CAPABILITIES `/nang-luc`

**Goal:** Demonstrate verified technical and operational capacity with evidence, not generic superlatives.

**Sections**
1. `InteriorPageHero`: manufacturing/quality heading with real factory equipment imagery.
2. `CapabilityOverview`: verified scope (design, prepress, material guidance, printing, finishing).
3. `EquipmentAndTechnology`: real machinery/tech details only after confirmation.
4. `ProductionProcess`: enquiry → requirements → artwork/prepress → printing/processing → QC → delivery (step names to verify).
5. `QualityControl`: actual quality measures and checks, no invented certification.
6. `ManufacturingGallery`: full-width photo-led factory/process media.
7. `CollaborationAndDelivery`: how orders/approvals are coordinated.
8. `ContactCTA`: quote/discussion.

**Photos target:** 6 original pieces: facility, printing press, finishing/cutting, operators/process, QC, packed outputs.

**Optional:** PDF company profile download only if Sunflower supplies a publishable file and real link.

**Proof standard:** Every number/certificate needs a confirmed source. If missing, remove claim or mark pending, never fabricate.

## 7. Page P06 — PROJECTS `/du-an`

**Goal:** Let visitors see real finished output and evaluate print/material quality.

**Sections**
1. `InteriorPageHero`: work/results title and large approved project photo.
2. `ProjectGallery`: responsive, consistent and high-resolution.
3. `CategoryFilter`: only if actual data exists and filtering works.
4. `SelectedProjectStories`: per-case `brief → work performed → final product` when publishable.
5. `RelatedSolutionLinks`.
6. `ContactCTA`.

**Photos target:** 6 approved original project/product-result images.

**Privacy / permission:** Do not publish customers, artwork, labels, contracts, drawings or product information without authorization. If only sample products are allowed, label the section `Mẫu thành phẩm`, not `Dự án khách hàng`.

**Optional detail route** `/du-an/[slug]`: requires editorial approval and source data.

## 8. Page P07 — CONTACT `/lien-he`

**Goal:** Securely collect real consultation, partnership and product quotation requests.

**Layout suggestion**
1. `InteriorPageHero`: short heading and explanatory subtitle.
2. `VerifiedContactDetails`: phone, email, address and hours **only as provided**.
3. `InquiryForm`: clear fields and purpose.
4. `LocationAndMap` (optional): map only for a verified physical address.
5. `DirectContactCTA`: valid hotline/email where available.
6. `Footer`.

**Suggested form data model**

| Field | Mandatory? | Notes |
|---|---|---|
| `purpose` | Yes | `quotation` / `consultation` / `partnership` |
| `fullName` | Yes | Contact person's name |
| `companyName` | No | B2B organization |
| `phone` or `email` | At least one | Validate consistently server-side |
| `productSlug` | No | Prefilled from products route |
| `solutionSlug` | No | Prefilled from solutions route |
| `message` | Yes | Actual request |
| `quantity`, `dimensions`, `deadline` | No | Quote-specific, after product requirements confirmed |
| `privacyConsent` | Where required | Clear legal text |

**Form behavior:**
- Client-side helpful validation plus **server-side verification**.
- Working loading/empty/error/success states.
- No fake "sent successfully" if no real server or inbox integration.
- Sanitize and validate URL query params; never trust client input.
- Protect against spam and rate limits as appropriate.
- Persist or forward only through an approved backend; use environment variables for secrets.
- Accessibility: labels, required messages, keyboard path, live-region status as appropriate.
- Display a privacy policy before public launch when collection requirements apply.

**Photo target:** 1 optional original office/showroom image.

## 9. User journeys and cross-linking

| Visitor type | Expected journey |
|---|---|
| Business seeks a label/material | `/` → `/san-pham` → `/lien-he?san-pham=...` |
| Purchasing manager qualifies a supplier | `/` → `/nang-luc` → `/du-an` → `/lien-he` |
| Visitor has a use-case, not a product name | `/` → `/giai-phap` → `/san-pham` or `/lien-he?nhu-cau=...` |
| Potential partner evaluates company | `/gioi-thieu` → `/nang-luc` → `/lien-he` |

No user account is required for inquiry.

## 10. Media inventory and file naming

**Original v1 asset target: 35 photographs + 1 Hero video + 1 poster (the poster is a frame of the video).**

| Folder | Target | Usage |
|---|---:|---|
| `public/videos/hero/` | 1 (+ optional mobile version) | Cinematic Home video |
| `public/images/hero/` | 1 poster | Preload/fallback for Hero |
| `public/images/company/` | 4 | About + Home preview |
| `public/images/products/` | 13 | Catalogue + Home previews |
| `public/images/solutions/` | 5 | Industry/use cases + Home |
| `public/images/capabilities/` | 6 | Factory/process + Home |
| `public/images/projects/` | 6 | Showcase + Home |
| `public/images/contact/` | 1 | Contact |
| `public/images/brand/` | as provided | Company logo/marks; NOT included in 35 |

**File examples**
```text
public/
├── images/
│   ├── brand/
│   │   ├── sunflower-logo.svg
│   │   └── sunflower-logo-light.svg
│   ├── hero/
│   │   └── hero-poster.webp
│   ├── company/
│   │   ├── company-overview.webp
│   │   └── team-workflow.webp
│   ├── products/
│   │   ├── tem-trang-cuon.webp
│   │   ├── tem-mau-cuon.webp
│   │   └── ...
│   ├── solutions/
│   ├── capabilities/
│   ├── projects/
│   └── contact/
└── videos/
    ├── hero/
    │   ├── hero-desktop.mp4
    │   └── hero-mobile.mp4       # optional
    └── manufacturing/           # future approved media only
```

**Production media gate:** The above filenames define intended slots, **not a claim these files already exist**. Reference photos/footage must be licensed, and actual company capability/client imagery must be authenticated.

## 11. Recommended Next.js App Router folder structure

The single `AGENTS.md` lives at the workspace root, one directory above `sunflower-website/`, and applies to the website source below it.

```text
sunflower-website/
├── README.md
├── docs/
│   ├── INDEX.md                       # Canonical document map
│   ├── DESIGN.md                      # Visual system
│   ├── STRUCTURE.md                   # This file
│   ├── REFERENCE_GUIDE.md              # Reference principles and links
│   ├── ARCHITECTURE.md                 # Actual source architecture
│   ├── IMPLEMENTATION_PLAN.md          # Delivery modules and acceptance
│   └── PROJECT_OVERVIEW.md             # Original ERP context, not website specs
├── public/
│   ├── images/{brand,hero,company,products,solutions,capabilities,projects,contact}/
│   └── videos/hero/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx
│   │   ├── gioi-thieu/page.tsx
│   │   ├── san-pham/page.tsx
│   │   ├── giai-phap/page.tsx
│   │   ├── nang-luc/page.tsx
│   │   ├── du-an/page.tsx
│   │   ├── lien-he/page.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts                 # when deployed publicly
│   │   └── robots.ts                  # when deployed publicly
│   ├── components/
│   │   ├── layout/{Header,Footer,Container}.tsx
│   │   ├── ui/                        # Button, links, form primitives
│   │   ├── media/                     # VideoHero, MediaImage, VideoControls
│   │   ├── editorial/                 # SectionHeading, ImageTextSection
│   │   ├── products/                  # CategoryGrid, ProductCard
│   │   ├── capabilities/              # ProcessTimeline
│   │   ├── projects/                  # ProjectGallery
│   │   └── contact/                   # InquiryForm
│   ├── sections/
│   │   ├── home/                      # Each Home section composer
│   │   ├── about/
│   │   ├── products/
│   │   ├── solutions/
│   │   ├── capabilities/
│   │   ├── projects/
│   │   └── contact/
│   ├── content/                       # Typed copy/products/solutions/projects
│   ├── lib/                           # Validation, utilities, form submission adapter
│   ├── hooks/                         # Only real reusable client hooks
│   └── types/
├── package.json
└── tsconfig.json
```

Folder trees show **recommended final organization**, not directories that should be created empty. Adapt to the actual existing repo. Avoid aggressive restructuring without specific benefit.

Maintain one document directory as listed above. Reference screenshots live only in `../reference/desktop/` relative to the website root; link to them instead of copying them into the repository or public assets.

### Architecture responsibilities

- **`app/`**: routing, per-page metadata, section composition, server entry.
- **`sections/`**: page-level content arrangements, free of shared complex business logic.
- **`components/`**: reusable UI, media, forms and editorial primitives.
- **`content/`**: a single source of truth for public data; typed arrays/objects, not repeated JSX literals.
- **`lib/`**: validation, shared utilities, security/routing adapters.
- **`public/`**: optimized, authorized assets only.

Server Components by default. Client Components only when needed for `VideoHero` controls, mobile menu, working filters or form interactivity.

## 12. Basic content models (types are guides, not required schema)

```ts
type ProductCategory = {
  slug: string;
  name: string;
  shortDescription: string;
  image: string;
  applications?: string[];
  specifications?: Array<{ label: string; value: string }>;
  isApprovedForPublication: boolean;
};

type Solution = {
  slug: string;
  title: string;
  customerProblem: string;
  approach: string;
  relatedProductSlugs: string[];
  image: string;
  isApprovedForPublication: boolean;
};

type Project = {
  slug: string;
  title: string;
  summary: string;
  imagePaths: string[];
  isApprovedForPublication: boolean;
  clientAttributionApproved?: boolean;
};
```

Only build a CMS when editing frequency and responsible content owners justify it. Static typed data is enough for phase 1.

## 13. Implementation milestones

**M1 — Foundation:** Design tokens, responsive header/footer, 7 routes, real navigation.  
**M2 — Hero/Brand:** VideoHero + poster + pause/play + mobile layout + Home first sections.  
**M3 — B2B Content:** Product, Solution, Capability and Project pages with approved assets.  
**M4 — Conversion:** Real quote form and permitted contact channels.  
**M5 — Polish:** Functional/visual QA, performance, SEO, accessibility, final content review.

Do not claim all phases complete if the project lacks real images, video, content or a form destination.

## 14. Page acceptance checklist

- [ ] All seven routes work and have distinct H1/title/description.
- [ ] Header/footer/navigation work on desktop and mobile.
- [ ] Home Hero is video-capable, readable, responsive and accessible.
- [ ] Product and solution lists are accurate and have real actions.
- [ ] Capabilities/projects are evidenced and permitted for publication.
- [ ] Quote form has honest, secure submission behavior.
- [ ] No internal ERP/customer data leaked.
- [ ] Styling conforms to `docs/DESIGN.md`.
- [ ] Tested at narrow, tablet and wide screens; media loading is reasonable.
- [ ] Every content gap is documented without publishing invented claims.

## 15. Items awaiting confirmation before launch

1. Actual Sunflower logo and brand-use requirements.
2. Hero desktop footage and poster (plus mobile version if provided).
3. Product categories/specifications and publishable product photos.
4. Exact manufacturing claims, process steps and approved factory photos.
5. Approved use cases and project photos with customer permissions.
6. Real phone/email/address plus destination for quote form.
7. Privacy text, consent and retention requirements for contact data.

**v2.0 change:** Replaces old uncertain static Hero with approved cinematic Video Hero, integrates Sonoco-inspired blue/green editorial direction, preserves approved seven routes and original B2B conversion behavior.
