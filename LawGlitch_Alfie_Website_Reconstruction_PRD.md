# Product Requirements Document
## LawGlitch public website reconstruction — Alfie launch

**Document status:** Implementation-ready product and design brief  
**Source reviewed:** `GlitchLabs-website.zip` (33 ZIP entries; static HTML/CSS/JS project)  
**Product stage:** Public launch / static-first  
**Primary deliverable:** Reconstruct and simplify the existing website while preserving its premium visual quality and repairing brand, assets, navigation, links, and deployment paths.

---

## 0. Executive direction

Rebuild the existing website as a premium, approachable product website for **Alfie**, the first public product of **LawGlitch**.

The current website has a strong visual foundation: dark atmospheric styling, a custom 3D hero, custom SVG artwork, a polished CSS system, an interactive product demonstration, and a detailed legal page. The main issue is not that the site looks bad. It is that the information architecture and copy expose too much implementation detail too early. It reads like an engineering brief or developer documentation rather than a product introduction for a broad audience.

**Do not discard the existing visual direction. Refine it.** Preserve the strongest visual assets and interaction ideas, remove visual and informational noise, make the product immediately understandable, and ensure every path and link works.

### Brand hierarchy — mandatory

- **LawGlitch** is the company / parent identity.
- **Alfie** is the product and must receive the strongest visual and editorial emphasis.
- The internal production/division name **GlitchLabs must not appear in public-facing website copy, navigation, metadata, footer, legal page headings, social cards, or visible logos**.
- A restrained “A LawGlitch product” or “By LawGlitch” attribution is sufficient. Do not turn the site into a corporate homepage.
- Do not use the existing GlitchLabs wordmark as the primary brand. Do not imply that GlitchLabs is a separate company.

### Static-first implementation rule

The website is static for the current launch. Do not build or simulate:
- User accounts, sign-up, login, password reset, sessions, or password storage.
- A database, API backend, server-side rendering, payment checkout, subscriptions, or account entitlements.
- A pretend dashboard that accepts credentials but cannot authenticate them.
- AI agent functionality that is not yet available.

Where these capabilities are planned, show a clear **Coming soon** state and explain briefly what will arrive. Keep the frontend structured so a backend can be added later without rewriting the public visual system.

---

## 1. Product goals and success criteria

### 1.1 Primary goals

1. A first-time visitor understands what Alfie does within five seconds.
2. The site looks like a carefully art-directed software product, not a template or developer console.
3. The primary action — installing Alfie — is easy to find and works consistently from every page.
4. Product information is maintainable from one central static product registry.
5. Visitors can understand availability, browser support, pricing/licensing, and future features without guessing.
6. The legal and privacy information remains complete enough to review, but is easier to navigate and read.
7. All pages and assets work when deployed at the domain root and when previewed from a nested local folder.
8. No broken icons, logos, store links, internal routes, anchors, or placeholder destinations reach production.

### 1.2 Non-goals for this release

- No authentication or dashboard data.
- No payment provider integration.
- No server-side product management.
- No newsletter signup or contact form backend.
- No analytics or tracking added by the redesign unless explicitly approved.
- No public technical API reference or full engineering documentation.
- No Firefox installation while Firefox is under development and unstable.

### 1.3 Success measures

| Measure | Acceptance target |
|---|---|
| First-screen clarity | Product name, plain-language value, and install CTA visible without scrolling on common desktop and mobile sizes |
| Navigation | Four top-level destinations; same order and labels across pages |
| Install journey | Every install CTA opens the same product-first browser selector |
| Firefox | Visible as disabled / “In development”; cannot be selected or opened |
| Product catalogue | Home quick links and Products page derive from the same registry |
| Dashboard | No credential inputs; explicit Coming soon state |
| Link health | Zero broken internal routes, local assets, or active placeholder URLs |
| Accessibility | Keyboard-operable controls, visible focus, semantic headings, useful labels, reduced-motion support |
| Performance | No unnecessary 3D work on mobile / reduced-motion; aim for good Core Web Vitals |
| Legal clarity | Current base-product practices separated from future AI / paid-plan processing |

---

## 2. Source project audit

The uploaded archive contains 33 entries and an existing static site with:
- `index.html`
- `legal/index.html`
- `assets/css/styles.css` (~32.9 KB)
- `assets/js/main.js`
- `assets/js/hero-3d.js`
- `assets/js/vendor/three.min.js` (~603 KB)
- SVG assets for LawGlitch, GlitchLabs, Alfie, browser marks, and hero artwork
- `og-image.png`, PNG extension icons, `favicon.ico`
- `_headers`, `robots.txt`, `sitemap.xml`
- `website_brief_product_legal.md`, `CONTENT_TO_CONFIRM.md`, and supporting documentation

### 2.1 Preserve and improve

- The dark, premium visual foundation and existing spacing / surface treatments.
- The custom Alfie logo and hero poster, after visual review and correct brand usage.
- The 3D hero concept if it remains visually strong and does not dominate content or harm performance.
- The interactive showcase concept, but simplify it into a user-facing “How Alfie works” explanation.
- The existing legal content as source material; do not silently delete important disclosures.
- The existing static hosting approach and local vendor assets where practical.

### 2.2 Confirmed source issues

| Finding | Evidence | Required resolution |
|---|---|---|
| Brand hierarchy is reversed | Home page title, header, hero and footer present GlitchLabs as primary; legal page presents LawGlitch / GlitchLabs together | Rebrand public site to LawGlitch parent + Alfie product; remove GlitchLabs public references |
| Duplicate company logos | `lawglitch-logo.svg` and `glitchlabs-logo.svg` have identical SHA-256 content | Establish a single canonical LawGlitch logo asset; archive or remove duplicate |
| Broken favicon references | Home references `./favicon.png`; legal page references `../favicon.svg`; archive contains `favicon.ico` but not those referenced files | Use the existing ICO or create verified SVG/PNG favicons; ensure every page points to real files |
| Store URLs are placeholders | Chrome, Firefox, Edge anchors contain bracketed placeholder URLs | Configure only verified URLs; no placeholder may be a clickable link |
| Contact addresses are placeholders | `mailto:[PUBLIC CONTACT EMAIL]` and legal contact placeholders | Use the approved public email; use a prefilled, editable `mailto:` message for licensing |
| Canonical domain is placeholder | Canonical and OG URLs use `[CANONICAL DOMAIN]` | Configure actual domain before release; otherwise do not publish a fake canonical |
| Sitemap / robots are placeholder-based | `robots.txt` and `sitemap.xml` use `[CANONICAL DOMAIN]` | Generate from the final domain and actual route structure |
| Technical density is high | Hero foregrounds model size, WASM, telemetry; sections foreground BM25, DOM map, 16-tool schema, Moonshine, execution receipts | Translate features into benefits; move technical depth out of the main conversion path |
| Firefox is incorrectly described as supported | Current home page says Firefox supported and has an install CTA | Show disabled “In development”; no active link or install action |
| Inline styling is excessive | Audit found 39 inline style attributes on home and 12 on legal page | Move presentation into named CSS classes and design tokens |
| Heavy 3D runtime | Three.js vendor file is ~603 KB; hero script is ~22 KB and creates a continuously animated scene | Load only when needed, reduce scene complexity, pause offscreen, use static fallback, disable on reduced motion / constrained devices |
| Current demo may be misread | Demo UI changes labels to “approved/executed” locally without actually controlling a browser | Label as an illustrative preview; never imply it performed real actions |

**Path audit note:** The current HTML already uses mostly relative paths (`./assets/...` and `../assets/...`), and the existing in-page anchors inspected resolve. Preserve that advantage. The confirmed missing local references are the two favicon paths. The placeholder store URLs and contact links are not local-file errors, but are still broken destinations.

### 2.3 Content that should leave the main landing page

Do not lead with:
- Cactus-Needle model name or 35.3 MB size.
- WASM / ONNX / Moonshine implementation details.
- BM25 ranking.
- DOM page maps and hit-testing.
- Tool schema signatures or “16 tools”.
- Task IDs, step IDs, execution receipts, cancellation timeouts.
- Browser service-worker / offscreen-document implementation.
- Manifest V3 version and browser minimum-version tables.

These details may be retained in a separate technical note or expandable “How it works” area only when they are useful to a user. Do not delete useful factual information from source material without retaining it somewhere appropriate.

---

## 3. Audience and message hierarchy

### 3.1 Primary audience

People who use browsers every day and want faster, more accessible ways to interact with websites. They may not know what a DOM, model runtime, WASM, API, or tool schema is.

### 3.2 Secondary audience

Power users, developers, accessibility-conscious users, and technically curious visitors who want optional detail about how Alfie works.

### 3.3 Core product promise

**Alfie helps you get things done in your browser using simple instructions, keyboard controls, and voice input.**

Supporting messages:
- Reduce repetitive clicking and navigation.
- Use typed or spoken instructions to guide browser actions.
- Keep actions visible and understandable.
- The current base product is designed to work locally in the browser; state this only to the extent verified by the extension's current code and permissions.
- User control and clear confirmation are important parts of the product experience.

### 3.4 Copy rules

- Lead with the outcome, then explain the mechanism.
- Prefer short sentences and concrete verbs.
- One main idea per section.
- Avoid unexplained acronyms and implementation jargon.
- If a technical term must remain, explain it in plain language on first use.
- Do not use absolute privacy promises such as “zero data ever” unless every relevant data flow has been audited.
- Separate the extension’s local processing from browser-store, browser-vendor, website, hosting-provider, and optional future AI processing.
- Do not describe unavailable features as if they are live.
- Avoid generic hype (“revolutionary”, “next-generation”, “supercharge everything”).

### 3.5 Suggested hero copy

**Eyebrow:** A more natural way to use your browser  
**Headline:** Let your browser do the busywork.  
**Description:** Alfie turns simple instructions into clear browser actions. Use your keyboard, type what you need, or speak a command — and stay in control as you work.  
**Primary CTA:** Get Alfie  
**Secondary CTA:** See how it works  
**Trust line:** Built for clarity, control, and more accessible browsing.

This is proposed copy, not a claim that every described feature is available in every browser. Validate the final feature set before publishing.

---

## 4. Information architecture — four pages

Top-level navigation must be exactly:
1. Home
2. Products
3. Terms & Privacy
4. Dashboard

Use the same navigation component, labels, order, active state, and footer across all pages. On mobile, use a compact accessible menu.

### 4.1 Home — product-led landing page

Purpose: Explain Alfie quickly and lead visitors to installation.

Recommended section order:

1. **Header**
   - Compact LawGlitch wordmark.
   - Navigation: Home / Products / Terms & Privacy / Dashboard.
   - Primary “Get Alfie” button.
   - No engineering links in primary navigation.

2. **Hero**
   - Preserve the premium 3D / hero artwork if it survives performance review.
   - Alfie name and one plain-language promise.
   - One primary install CTA and one secondary “How it works” anchor.
   - Keep hero copy to 2–3 short lines.
   - Remove the row of technical specification chips.

3. **Quick product links**
   - Generated from the same product registry as Products page.
   - Show Alfie now; future products appear automatically when added and approved.
   - Do not hand-maintain a separate home-page product list.

4. **How Alfie helps**
   - Three benefit cards:
     - Keyboard-first control.
     - Type or speak a request.
     - Stay in control of actions.
   - Use a clear icon and one short description per card.

5. **How it works**
   - Three-step visual explanation:
     1. Tell Alfie what you want.
     2. Review the suggested action.
     3. Let Alfie carry it out, with confirmation where required.
   - If using an interactive demo, label it “Illustrative preview”.
   - No fake live browser execution.

6. **Privacy / local-first preview**
   - A short, carefully qualified summary of the current base product.
   - Link to Terms & Privacy for details.
   - Do not make claims that conflict with actual extension permissions or website-host logs.

7. **Pricing and availability**
   - Base product: Free for non-commercial use.
   - Commercial use: 14-day trial allowed with proper records; commercial licence required after trial / for continued commercial use.
   - Pro plans and native AI agents: “Coming soon”.
   - Licensing CTA opens a prefilled `mailto:`.

8. **Final CTA**
   - Repeat “Get Alfie”.
   - Small note: Firefox is still in development and is not currently available.

9. **Footer**
   - Subtle LawGlitch identity.
   - Links to Products, Terms & Privacy, Dashboard, contact.
   - Copyright year generated from JavaScript or fixed during build.
   - Do not mention GlitchLabs.

### 4.2 Products — dynamic static catalogue

Purpose: A single catalogue that can grow without rewriting page layout.

- Product cards generated from `products.js` or a small static JSON file.
- Each product has: stable `id`, name, short description, category, icon/logo path, status, browser availability, store URLs, optional detail route, and optional “coming soon” message.
- Home quick links must consume the same registry.
- Installer modal must consume the same registry.
- Dashboard product-agent preview must consume the same registry.
- No database required for current launch.
- New product addition should require one registry entry and its assets, not edits in multiple HTML pages.

**Current product:** Alfie — Available for Chrome and Edge once real store URLs are configured. Firefox — disabled / in development.

### 4.3 Terms & Privacy — clear, complete, readable

Purpose: Provide honest, useful information without overwhelming the landing page.

Use a readable document layout with:
- Clear page title and last-updated date.
- Short overview at the top.
- Sticky or in-page table of contents on desktop; accessible collapsible contents on mobile.
- Clear headings, short paragraphs, lists, and callouts for important distinctions.
- No oversized legal hero that pushes the actual policy far below the fold.

Preserve and review the legal material already in `legal/index.html` and `website_brief_product_legal.md`, but reorganize it. Do not invent jurisdiction, registration details, postal addresses, legal contact addresses, or dates.

Recommended top-level groupings:
1. Who operates the product and how to contact us.
2. What the current website and base extension do / do not collect.
3. Local processing and browser permissions.
4. Optional external AI services and future Pro plans.
5. Cookies, hosting logs, and third-party services.
6. Data retention, security, and user requests.
7. Advertising — possible future non-invasive ads, with details disclosed before introduction.
8. Terms of use and acceptable use.
9. Free personal use, commercial trial, and commercial licensing.
10. Availability, browser support, and changes.

**Privacy wording must be reviewed against actual data flows.** A static website can still produce hosting/server logs; browsers and extension stores have their own data practices; websites visited by the user may collect their own data. Future AI agent services may need prompts, page context, account information, or other data. Explain these distinctions plainly and update the policy before enabling such features.

### 4.4 Dashboard — static preview only

Purpose: Show where future account-based features will live without pretending they exist.

- Page heading: “Your workspace is taking shape.”
- Clearly marked “Dashboard — Coming soon”.
- No username or password fields.
- No create-account or login form.
- Explain that account access will arrive with hosted services / native AI agents.
- Show product-specific agent cards generated from the central product registry.
- For Alfie, display exactly or substantially: **“Native AI agents for this product are coming soon. Stay tuned.”**
- Do not collect or store any personal data on this page.
- Optional CTA: “Explore Alfie” or “Get the free extension”.

---

## 5. Installation flow — shared component

Every “Install”, “Get Alfie”, or product install CTA on every page must open the same accessible modal.

### 5.1 Required flow

1. Modal title: “Choose a product”.
2. List available products from the product registry.
3. User selects a product.
4. Show browser choices for that product:
   - Chrome: active only if a verified Chrome Web Store URL exists.
   - Edge: active only if a verified Edge Add-ons URL exists.
   - Firefox: visible but disabled, with “In development”.
5. Selecting an active browser opens the exact official store listing in a new tab.
6. If the store URL has not yet been configured, show a disabled “Store listing coming soon” state. Never link to a placeholder string.

### 5.2 Modal requirements

- Close button, Escape key, and backdrop dismissal.
- Focus moves into the modal on open and returns to the trigger on close.
- Focus is trapped while modal is open.
- `role="dialog"`, `aria-modal="true"`, accessible heading, and labelled controls.
- Browser choices must be actual links only when available; disabled choices must not be fake links.
- Prevent background scrolling while open.
- On mobile, modal becomes a bottom sheet or full-width dialog with comfortable spacing.
- Modal works with keyboard and screen readers.
- No duplicated install logic across pages.

---

## 6. Visual design direction

### 6.1 Preserve the existing premium foundation

The current site already has a dark canvas, indigo/cyan accents, layered surfaces, custom SVG art, and a 3D hero. Keep the recognizable visual language but reduce competing effects.

Recommended art direction:
- Dark charcoal / deep navy background, not pure black.
- Existing indigo-violet as the primary accent.
- Cyan as a restrained secondary accent, not a competing brand color.
- Warm amber only where it belongs to the actual LawGlitch logo or a deliberate status.
- Soft gradients and atmospheric light used sparingly.
- Strong typographic hierarchy, generous whitespace, clear content widths.
- Cards should be used selectively; not every paragraph needs a bordered panel.
- Premium means deliberate restraint, not maximum glow, blur, animation, or decoration.

### 6.2 Design tokens

Before component work, consolidate tokens in `:root`:
- Color: background, surface, elevated surface, border, primary, secondary, text, muted, success, warning, disabled.
- Typography: one primary sans-serif family, one optional mono family for small metadata only.
- Type scale: hero, h1, h2, h3, body, small, label.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Radius scale: small / medium / large / pill.
- Shadows: subtle / elevated / modal.
- Motion: fast / normal / slow, plus reduced-motion behavior.
- Content widths: standard and legal reading width.

Avoid inline styles. Use named classes and reusable components.

### 6.3 Typography

- Choose a contemporary, highly readable sans-serif with a distinctive but not gimmicky heading weight.
- Keep monospace limited to small technical metadata, version numbers, or status labels.
- Body copy should be comfortably readable (roughly 16–18px desktop, 15–17px mobile).
- Keep line lengths around 55–75 characters for longer copy.
- Avoid all-caps paragraphs and tiny letter-spaced labels as primary information.
- Ensure the hero headline wraps intentionally on desktop and mobile.

### 6.4 Layout and density

- Use a consistent max-width container.
- Increase vertical spacing between major sections.
- Limit each section to one primary visual idea.
- Do not stack multiple badges, metadata chips, and spec rows around the same message.
- Use whitespace to create hierarchy.
- Ensure the hero has enough breathing room but does not push the install CTA below the first screen on mobile.

---

## 7. Logo, icon, and asset system

### 7.1 Brand assets

- Audit every SVG visually before use.
- `lawglitch-logo.svg` and `glitchlabs-logo.svg` are byte-identical; do not treat them as two separate identities.
- Use one authoritative LawGlitch logo.
- Use `alfie-logo.svg` for Alfie product identity only if it remains legible at small sizes and visually matches the updated palette.
- Keep a wordmark / icon lockup consistent across header, footer, favicon, social preview, and product cards.
- Do not redraw or distort a logo using CSS filters, arbitrary shadows, or non-uniform scaling.
- Preserve vector SVG where possible; optimize SVGs and ensure unique internal IDs if embedding inline.

### 7.2 Iconography

- Remove decorative Unicode glyphs and emoji used as functional icons.
- Use one coherent icon family throughout (preferred: Lucide-style outline SVGs or a small local SVG sprite).
- Do not mix random icon packs, emoji, text glyphs, and custom line icons.
- Use consistent stroke width, corner style, optical size, and alignment.
- Functional icon-only buttons need accessible names and tooltips where appropriate.
- Decorative icons should be `aria-hidden="true"`.
- Browser logos must be official, current marks or simple text labels; do not approximate brand logos with generic Unicode symbols.
- Do not load an entire icon font or a large icon framework for a small set of icons. Prefer tree-shaken SVGs or local SVG files.

### 7.3 Image handling

- Keep the original hero poster as the static fallback.
- Use explicit image width / height or aspect ratio to avoid layout shifts.
- Use lazy loading for below-the-fold images.
- Do not lazy-load the primary hero/LCP image.
- Provide meaningful alt text for informative images; empty alt for purely decorative art.
- Create optimized WebP/AVIF variants only when visual quality is preserved and the static hosting pipeline can serve them reliably.

---

## 8. Motion, 3D, and performance

### 8.1 3D hero

The existing Three.js bundle is approximately 603 KB before compression. The hero script creates a particle field and animated scene. Keep the 3D concept only if it contributes to the product story and passes performance checks.

Requirements:
- Load the 3D runtime only on the home page and only when the hero container exists.
- Prefer a dynamic import or deferred script strategy compatible with the current static architecture.
- Do not block initial text, CTA, or page interaction on 3D initialization.
- Keep `hero-poster.svg` visible as the immediate fallback and as the permanent fallback when WebGL is unavailable.
- Respect `prefers-reduced-motion: reduce`: no continuous animation; show static artwork.
- On small screens, low-power devices, or constrained hardware, use the poster or a simplified scene.
- Pause rendering when the hero is offscreen and when the tab is hidden.
- Dispose WebGL resources and listeners when no longer needed.
- Cap device pixel ratio and particle count; test on integrated graphics and mobile.
- Do not attach global mousemove listeners unnecessarily; scope pointer tracking to the hero and disable on touch.
- Provide a graceful error path. A failed 3D scene must never break the rest of the page.

### 8.2 Performance budgets and targets

Targets, measured on representative mobile and desktop connections:
- Aim for Core Web Vitals “good” thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile where field data becomes available.
- No 3D initialization before first meaningful content is painted.
- Avoid large render-blocking scripts.
- Minimize JS on pages that do not need the 3D hero.
- Lazy-load non-critical images and optional visuals.
- Set image dimensions and font-display behavior.
- Prefer system or self-hosted fonts for predictable loading; if using remote font services, update CSP and privacy disclosures.
- No autoplay video, audio, or scroll-jacking.
- Use CSS transforms/opacity for motion where practical; avoid expensive layout animation.

---

## 9. Technical architecture and source organization

Keep the project static and dependency-light. Do not introduce a frontend framework unless there is a concrete need.

Suggested structure:

```text
/
├── index.html
├── products/
│   └── index.html
├── terms/
│   └── index.html
├── dashboard/
│   └── index.html
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── js/
│   │   ├── app.js
│   │   ├── products.js
│   │   ├── install-modal.js
│   │   ├── navigation.js
│   │   └── hero-3d.js
│   ├── images/
│   │   ├── brand/
│   │   ├── products/
│   │   └── hero/
│   └── icons/
├── legal/ (optional redirect to /terms/)
├── favicon.ico
├── favicon.svg
├── 404.html
├── robots.txt
├── sitemap.xml
├── _headers
├── _redirects
└── README.md
```

The current project may use a simpler folder arrangement if it is cleaner to preserve existing paths. The structure above is a target, not a requirement to move every file. If routes are moved, update every internal link, canonical, sitemap entry, OG URL, and redirect in the same change.

### 9.1 Central product registry

Use a single static registry, e.g. `assets/js/products.js`:

```js
window.LAWGLITCH_PRODUCTS = [
  {
    id: "alfie",
    name: "Alfie",
    tagline: "A more natural way to work with your browser.",
    description: "Give your browser clear instructions and stay in control of each action.",
    status: "available",
    icon: "/assets/images/products/alfie-logo.svg",
    install: {
      chrome: { label: "Chrome", url: "" },
      edge: { label: "Microsoft Edge", url: "" },
      firefox: { label: "Firefox", url: "", status: "coming-soon" }
    },
    agentStatus: "Native AI agents for this product are coming soon. Stay tuned."
  }
];
```

Use the registry to render:
- Home quick links.
- Products catalogue.
- Install modal product list.
- Dashboard agent previews.

Important implementation notes:
- Keep URLs empty until real store listing URLs are supplied.
- Do not render an anchor with an empty `href`.
- Validate allowed URL protocols (`https:` only for store links).
- Avoid using `innerHTML` with untrusted registry values; use DOM APIs or carefully escape all strings.
- Stable IDs, not array indexes, should identify products.
- Product status controls whether install CTAs are active.

### 9.2 Shared components

Implement once and reuse:
- Header / responsive navigation.
- Footer.
- Install modal.
- Product card.
- Status pill.
- Coming-soon panel.
- Feature card.
- Legal table of contents.
- Browser option.

Do not copy-paste different versions of the install modal across four pages.

---

## 10. Paths, connectors, metadata, and deployment repair

This is a release-critical workstream. Every internal route and external connector must be explicitly audited.

### 10.1 Path rules

- Prefer root-relative paths for production if the site is always deployed at the domain root (`/assets/...`, `/products/`).
- If nested-folder previews must remain supported, use a deliberate base-path strategy and test it. Do not mix root-relative and page-relative paths casually.
- For nested pages, ensure asset paths resolve from the nested route.
- Avoid ambiguous `./` navigation targets when the intended destination is the home page; use explicit `/` or the correct relative route.
- Ensure trailing slash policy is consistent.
- Add a working `404.html`.
- If old routes are changed, add 301 redirects in Cloudflare Pages `_redirects`.

### 10.2 Internal connector checklist

Verify every:
- Header navigation item.
- Footer navigation item.
- CTA.
- Product detail link.
- In-page anchor.
- Legal table-of-contents item.
- Logo home link.
- Modal close action.
- Mobile menu toggle.
- Email link.
- Browser store link.
- Social link, if any.

### 10.3 External connectors

| Connector | Current state | Required behavior |
|---|---|---|
| Chrome Web Store | Placeholder in source | Open verified official listing only |
| Edge Add-ons | Placeholder in source | Open verified official listing only |
| Firefox Add-ons | Placeholder and currently claimed supported | Disabled with “In development”; no URL |
| Commercial licensing email | Existing placeholder mailto | `mailto:lawglitch@outlook.com` with encoded subject and editable default body |
| General contact | Placeholder | Use approved public contact email or omit until confirmed |
| Canonical domain | Placeholder | Configure only after domain confirmed |
| Social / repository | Not confirmed | Do not invent or display dead icons |

Suggested licensing email:
- To: `lawglitch@outlook.com`
- Subject: `Commercial Licensing Inquiry — Alfie`
- Body: `Hello,\n\nI am interested in obtaining a commercial licence for Alfie.\n\nPlease share the applicable licensing terms, pricing, and requirements.\n\nThank you.`

Use percent-encoded `mailto:` query parameters. Test on desktop and mobile; note that a mail app must be configured by the visitor.

### 10.4 Cloudflare Pages

- Static output directory must contain the four page routes and all assets.
- No build command is needed if using plain HTML/CSS/JS.
- Test direct navigation to each nested route, not only navigation from home.
- Configure `_headers` and CSP to match actual dependencies.
- The current CSP allows only self-hosted scripts/styles/fonts and `connect-src 'self'`. If a remote font, analytics, or external service is introduced, update CSP intentionally rather than weakening it broadly.
- Review the current `Permissions-Policy`: it disables microphone. If the website itself does not use microphone, that is fine; Alfie's extension permission is separate from website policy.
- Keep long immutable cache headers for versioned assets; use revalidation for HTML.
- Update `robots.txt` and `sitemap.xml` to the final domain and real pages.
- Use Cloudflare Pages `_redirects` for legacy routes where needed.

---

## 11. Legal, pricing, and availability content

### 11.1 Current product offer

- Base Alfie product: free for non-commercial use.
- Commercial use: a 14-day trial is allowed with proper records.
- Commercial licensing: contact `lawglitch@outlook.com`.
- Pro plans: coming soon.
- Native AI agents: coming soon.
- Firefox: in development; not stable / not currently available.
- Chrome and Edge: only mark available once the actual store listings are live and verified.

### 11.2 Future AI and advertising disclosure

State that non-invasive advertising may be introduced in the future, but do not imply that advertising currently exists.

State that paid AI agent services may require data to provide their functionality. Before enabling them:
- Define what inputs are processed.
- Identify any external AI / hosting providers.
- Explain retention and deletion.
- Explain whether page context is sent externally.
- Explain the user's choices and controls.
- Update privacy terms before launch.

Do not say “we collect no data” without clarifying the scope: base extension, static website, browser store, browser vendor, visited websites, hosting logs, and future optional services are separate systems.

### 11.3 Legal review

The existing legal hub contains detailed GDPR / UK / US / India DPDP references and placeholder jurisdiction / contact details. Preserve as draft source material but flag all unresolved facts. Do not present legal compliance as guaranteed. Obtain qualified legal review before production, especially for:
- Operator identity and contact information.
- Jurisdiction and governing law.
- Privacy / data-controller statements.
- Browser extension permissions and actual network behavior.
- Commercial trial and licence terms.
- Future AI processing and advertising.

---

## 12. Accessibility requirements

Target WCAG 2.2 AA as the practical baseline.

- Semantic landmarks: header, nav, main, footer.
- One clear H1 per page; headings must follow a logical order.
- All controls keyboard-operable.
- Visible focus styles with sufficient contrast.
- Focus must not be hidden behind sticky navigation or modal overlays.
- Sufficient text contrast: 4.5:1 for normal text, 3:1 for large text.
- Do not use color alone to communicate available / disabled / coming-soon states.
- Touch targets should be at least 24 × 24 CSS px minimum where WCAG exceptions do not apply; aim larger for primary mobile controls.
- Every form control (if any future form is added) needs a persistent label and clear error handling.
- Modals must manage focus and support Escape.
- Use `aria-expanded` on disclosure controls and `aria-current="page"` on active navigation.
- Decorative 3D canvas and decorative icons must be hidden from assistive technology.
- Respect `prefers-reduced-motion`.
- Do not auto-play sound or use flashing effects.
- Test with keyboard-only navigation and at least one screen reader/browser combination.

---

## 13. SEO and social metadata

For each page:
- Unique, plain-language `<title>`.
- Unique meta description.
- Canonical URL on the real production domain.
- Open Graph title, description, URL, and image.
- Twitter/X summary card metadata.
- Valid favicon references.
- `lang="en"`.
- Meaningful H1 and semantic structure.
- Sitemap includes only canonical public pages.
- `robots.txt` references the correct sitemap.
- No `noindex` on launch pages unless intentionally staging.
- Do not mention GlitchLabs in title, metadata, OG text, structured data, or visible copy.

Suggested titles:
- Home: `Alfie — A Smarter Way to Work With Your Browser | LawGlitch`
- Products: `Products | LawGlitch`
- Terms: `Terms & Privacy | LawGlitch`
- Dashboard: `Dashboard — Coming Soon | LawGlitch`

---

## 14. Required implementation skills and agent direction

The implementation agent should behave as a small senior product-design and frontend team. Use the following skill tracks in order. Each track has a clear responsibility and output.

### Skill 1 — Senior product designer / visual auditor

**Mission:** Preserve the existing premium visual identity while reducing clutter.

**Instructions:**
- Inspect the existing site in a browser at desktop, tablet, and mobile sizes before editing.
- Inventory the visual assets, typography, colors, surfaces, shadows, gradients, and motion.
- Identify what is distinctive and should stay.
- Identify competing visual effects, overused cards, excess badges, crowded nav, and poor hierarchy.
- Create a small design-token sheet before implementation.
- Do not replace a distinctive existing visual with a generic SaaS template.
- Make the hero product-led and ensure the main CTA has visual priority.
- Use whitespace and typographic contrast instead of adding more panels.

**Deliverables:** Design audit, token map, page wireframes, before/after section map.

### Skill 2 — Product content designer / UX writer

**Mission:** Translate technical implementation into understandable product value.

**Instructions:**
- Write for everyday browser users first, technically curious users second.
- Keep the hero headline, description, and CTAs short.
- Convert feature mechanisms into benefits.
- Keep detailed implementation facts out of the primary reading path.
- Maintain precise claims: never imply features are available if they are not.
- Use one consistent term for each feature.
- Use explicit availability labels: Available, Coming soon, In development.
- Keep licensing and privacy copy honest and scoped.

**Deliverables:** Final page copy, CTA labels, status copy, feature summaries, legal plain-language summaries.

### Skill 3 — Brand and asset librarian

**Mission:** Repair logos, icons, and image usage.

**Instructions:**
- Inspect SVG artwork visually and inspect viewBox, dimensions, fills, strokes, IDs, and file sizes.
- Identify the canonical LawGlitch logo and Alfie product mark.
- Remove duplicate or mislabelled logo assets from the public output.
- Do not use the duplicate GlitchLabs-named SVG as a separate brand identity.
- Replace inconsistent Unicode / emoji / generic browser glyphs with one coherent SVG icon system.
- Verify browser marks are authentic and used only for supported browser options.
- Fix every favicon reference and social image reference.
- Use `alt=""` for decorative artwork and meaningful alt text for informative visuals.

**Deliverables:** Asset map, canonical filenames, icon inventory, favicon set, verified image references.

### Skill 4 — Frontend architect (static-first)

**Mission:** Implement a maintainable four-page static website.

**Instructions:**
- Read the existing source before replacing it.
- Preserve useful assets and code where possible.
- Keep HTML semantic and CSS token-driven.
- Use one shared product registry.
- Render home quick links, product cards, installer choices, and dashboard agent cards from the registry.
- Build one reusable installation modal.
- Avoid framework adoption unless the current static approach becomes materially harder to maintain.
- Do not introduce backend services or fake account forms.
- Keep product data safe from HTML injection.
- Keep scripts modular and page-aware.

**Deliverables:** Four pages, shared components, central product registry, static deployment-ready folder.

### Skill 5 — Motion and 3D specialist

**Mission:** Keep the hero's premium feel without sacrificing usability or performance.

**Instructions:**
- Evaluate whether the current Three.js scene is worth retaining.
- Keep the poster visible before the scene is ready.
- Defer loading and initialize only on home.
- Pause offscreen and on hidden tabs.
- Respect reduced motion and touch devices.
- Reduce particle count / resolution on constrained devices.
- Clean up listeners and GPU resources.
- Never let WebGL failure block the hero CTA or page content.

**Deliverables:** 3D performance plan, fallback behavior, reduced-motion behavior, tested scene lifecycle.

### Skill 6 — Accessibility reviewer

**Mission:** Make the premium interface operable and understandable by more people.

**Instructions:**
- Test keyboard navigation, focus order, focus visibility, and mobile menu behavior.
- Test the installer modal focus trap and return focus.
- Check text contrast and target sizes.
- Confirm status labels are not color-only.
- Check heading structure, landmark roles, labels, alt text, and `aria-current`.
- Verify reduced-motion behavior.
- Use WCAG 2.2 AA as the baseline.

**Deliverables:** Accessibility checklist, issue log, remediation verification.

### Skill 7 — Performance engineer

**Mission:** Ensure the site is lightweight and fast.

**Instructions:**
- Audit JS payload, CSS, image weight, font loading, and render-blocking resources.
- Keep Three.js off non-home pages.
- Use lazy loading below the fold and eager/high priority only for the actual hero/LCP visual.
- Set image dimensions.
- Avoid unnecessary third-party requests.
- Run Lighthouse or equivalent on representative mobile and desktop profiles.
- Validate Core Web Vitals targets.

**Deliverables:** Before/after payload summary, Lighthouse report, optimization list.

### Skill 8 — QA / route and connector auditor

**Mission:** Prove that every visible link and asset works.

**Instructions:**
- Crawl every HTML page.
- Validate all local `src` and `href` references.
- Validate all internal anchors against target IDs.
- Check route behavior at root and nested routes.
- Check every external URL is intentional, secure, and real.
- Check mailto encoding and recipient.
- Check store links only exist when confirmed.
- Check favicon, OG image, canonical, sitemap, robots, and 404.
- Check no `GlitchLabs` string remains in public output.
- Check Firefox cannot be installed or selected.
- Check all install buttons open the same modal.

**Deliverables:** Link report, asset report, browser matrix, release checklist.

### Skill 9 — Legal and privacy fact checker

**Mission:** Ensure the copy does not overstate privacy or compliance.

**Instructions:**
- Compare policy claims with extension permissions, code network calls, local storage, website hosting, and third-party dependencies.
- Separate current behavior from planned behavior.
- Verify all contact and legal identity fields with the owner.
- Flag jurisdictional statements that need counsel.
- Ensure future AI agent data processing is disclosed before launch.
- Ensure future advertising is described as potential, not current.
- Do not invent legal details or certify compliance.

**Deliverables:** Fact-check matrix, unresolved owner questions, legal-review checklist.

---

## 15. Recommended implementation workflow

Do not ask an agent to “make it beautiful” and let it rewrite everything in one pass. Use staged, reviewable work.

### Phase 0 — Baseline and backup
- Extract the ZIP into a clean working directory.
- Preserve the original untouched.
- Run the current site locally.
- Capture desktop and mobile screenshots.
- Record current page load / asset requests.
- Build a list of all assets, routes, IDs, links, and placeholders.

### Phase 1 — Brand and information architecture
- Remove GlitchLabs from the public-facing brand system.
- Confirm LawGlitch logo and Alfie product mark.
- Create four-page route map.
- Approve plain-language positioning and page copy.
- Map old sections to new sections; identify content to archive rather than delete.

### Phase 2 — Design system and assets
- Consolidate tokens.
- Standardize typography and icons.
- Repair favicon and social image paths.
- Remove duplicated logo asset from output.
- Refactor inline styles into reusable classes.

### Phase 3 — Static product architecture
- Create product registry.
- Build shared header/footer.
- Build dynamic product cards and home quick links.
- Build shared installation modal.
- Add Chrome/Edge links only when verified.
- Disable Firefox.

### Phase 4 — Page implementation
- Home.
- Products.
- Terms & Privacy.
- Dashboard Coming Soon.

### Phase 5 — Motion and performance
- Retain/refine or replace the 3D scene with static fallback.
- Add reduced-motion and mobile fallbacks.
- Optimize images, scripts, and font strategy.

### Phase 6 — QA and deployment
- Run route and asset crawler.
- Test all four pages on desktop/mobile.
- Test modal and keyboard accessibility.
- Test direct URL navigation and refresh on nested routes.
- Configure domain metadata, sitemap, robots, headers, redirects, and 404.
- Final legal review.
- Deploy to staging, then production.

---

## 16. Acceptance criteria / definition of done

### Brand
- [ ] LawGlitch is the parent identity and Alfie is the main product.
- [ ] No public-facing GlitchLabs name, logo, metadata, or footer reference remains.
- [ ] LawGlitch logo and Alfie logo are correctly mapped and visually consistent.

### Pages and content
- [ ] Home, Products, Terms & Privacy, and Dashboard routes exist.
- [ ] Home communicates Alfie in plain language.
- [ ] Product registry drives all product surfaces.
- [ ] Terms & Privacy retains necessary detail and is readable.
- [ ] Dashboard shows Coming soon and contains no login or password inputs.
- [ ] Pro plans and native agents are clearly marked Coming soon.
- [ ] Pricing/licensing is consistent with the approved terms.

### Install flow
- [ ] All install CTAs open the same modal.
- [ ] Modal lists products first, then browsers.
- [ ] Chrome and Edge open only verified official listings.
- [ ] Firefox is visible but disabled.
- [ ] Empty / missing store URLs never become clickable links.
- [ ] Modal is keyboard and screen-reader operable.

### Paths and connectors
- [ ] No missing local image, script, stylesheet, favicon, or font references.
- [ ] No broken internal routes or in-page anchors.
- [ ] No placeholder URLs or placeholder email recipients remain.
- [ ] Canonical, OG, sitemap, and robots use the confirmed domain.
- [ ] `404.html` exists and is styled.
- [ ] Direct visits and refreshes work on nested routes.

### Accessibility and performance
- [ ] Reduced-motion users receive a static hero.
- [ ] WebGL failure does not affect content or install actions.
- [ ] 3D is not loaded on irrelevant pages.
- [ ] Keyboard focus is visible and never obscured.
- [ ] Text and controls meet contrast and target-size requirements.
- [ ] Performance targets are measured and documented.

### Privacy and legal
- [ ] Current and future processing are clearly separated.
- [ ] No unverified “zero data” or “fully compliant” claim.
- [ ] Future AI processing and advertising are described as future possibilities.
- [ ] Legal placeholders are resolved or removed before public release.
- [ ] Qualified legal review is completed before launch.

---

## 17. Owner inputs required before production

The implementer should proceed with the static structure and mark these as configuration values. Do not block the visual reconstruction waiting for all of them.

1. Final production domain.
2. Actual Chrome Web Store listing URL.
3. Actual Edge Add-ons listing URL.
4. Confirmation of public contact email (licensing email is already specified as `lawglitch@outlook.com`).
5. Approved legal effective date and governing jurisdiction.
6. Final confirmation of current extension permissions and any outbound network requests.
7. Confirmation of whether the existing LawGlitch logo artwork is the final official company mark.

Firefox does not need a store URL for this release because it remains disabled.

---

## 18. Research and implementation references

These references inform the design and engineering requirements. They are guidance, not a substitute for project-specific testing.

### Content clarity and information architecture
- GOV.UK — [Understand content design](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/understand-content-design/): start with user needs, publish only the content users need, split large content into useful destinations, and maintain it.
- Office for National Statistics — [Plain language](https://service-manual.ons.gov.uk/content/writing-for-users/plain-language): use clear headings, task-focused CTAs, short sentences, active voice, and consistent terminology.
- Digital.gov — [Design for understanding](https://digital.gov/guides/plain-language/design): logical structure, key information near the top, descriptive headings, and scannable lists.

### Accessibility
- W3C — [WCAG 2.2](https://www.w3.org/TR/WCAG22/): normative accessibility requirements, including contrast, keyboard operation, focus, and target size.
- W3C WAI — [What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/): focus not obscured and other updated criteria.
- W3C WAI — [Focus Appearance understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html): guidance on visible keyboard focus.

### Performance and media
- web.dev — [Responsive images](https://web.dev/learn/design/responsive-images): responsive image sizing, eager loading for hero imagery, and lazy loading for below-the-fold imagery.
- Chrome for Developers — [Performance guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/performance/performance): image dimensions, fetch priority, lazy loading, and avoiding unnecessary main-thread work.
- Google Search Central — [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals): LCP, INP, and CLS user-experience targets.
- MDN — [Lazy loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading): defer non-critical resources until needed.

### Icons and security
- Google for Developers — [Material Icons guide](https://developers.google.com/fonts/docs/material_icons): use a consistent, legible icon family and respect icon licensing.
- MDN — [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP): maintain a deliberate CSP aligned with the actual scripts, styles, fonts, and connection endpoints.

### Static deployment
- Cloudflare Pages — [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/): route and static HTML behavior.
- Cloudflare Pages — [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/): use `_redirects` for intentional route migrations.

---

## 19. Final instruction to the implementation agent

You are reconstructing an existing premium website, not generating a generic landing page from scratch.

1. Inspect the supplied ZIP and preserve a clean backup.
2. Run and visually inspect the existing site before changing it.
3. Keep its strongest visual assets and design character.
4. Simplify the message and navigation for non-technical users.
5. Implement the four-page static architecture described here.
6. Keep LawGlitch subtly present and Alfie visually dominant; do not mention GlitchLabs publicly.
7. Use one product registry and one shared install modal.
8. Keep account creation, dashboard authentication, Pro plans, and native AI agents clearly marked Coming soon.
9. Keep Firefox disabled until explicitly approved.
10. Repair every path, connector, favicon, canonical, social image, sitemap, and route.
11. Do not invent store URLs, email addresses, legal facts, or privacy claims.
12. Test the actual rendered site at desktop and mobile sizes before calling the work complete.
13. Return a concise implementation report listing changed files, preserved assets, removed clutter, unresolved owner inputs, test results, and any known limitations.

**The finished site should feel like a premium product launch for a useful browser companion — not a technical specification, not a developer dashboard, and not a generic AI SaaS template.**
