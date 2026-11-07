# Content and Disclosures to Confirm Before Launch — LawGlitch &middot; Alfie

This document tracks verified corporate and product details for **LawGlitch** (under the sole proprietorship of **Sandipan Dutta**) and its first product, **Alfie** (Alfie Browser Automation Assistant).

---

## 1. Resolved Corporate & Brand Identifiers

| Item | Status | Verified Value | Notes |
| :--- | :--- | :--- | :--- |
| **Company / Trade Name** | **CONFIRMED** | **LawGlitch** | Confirmed by project owner. |
| **Legal Entity / Proprietorship** | **CONFIRMED** | **Sandipan Dutta** (Sole Proprietorship, operating as LawGlitch) | Confirmed legal operator for compliance, disclaimers, and terms. |
| **Company Logo** | **CONFIRMED** | LawGlitch Balance Scale Logo (`assets/images/lawglitch-logo.svg`) | Copied from owner-supplied logo artwork. |
| **Product Name** | **CONFIRMED** | **Alfie** (Alfie Web Extension) | LawGlitch's first browser automation assistant. |
| **Short Descriptor** | **CONFIRMED** | *Local-first browser automation assistant that turns plain-language tasks into visible, step-by-step browser actions.* | Grounded in verified extension codebase. |
| **Product Hierarchy** | **CONFIRMED** | Alfie is the first product by LawGlitch. | Explicit company & product relationship. |
| **Supported Browsers** | **CONFIRMED** | **Google Chrome**, **Mozilla Firefox**, and **Microsoft Edge** | Direct web store links provided in place of manual zip downloads. |
| **Task Planning & Inference** | **CONFIRMED** | Alfie Local Model (`cactus-needle` 35.3 MB browser/WASM runtime) | Pinned model cached by browser on first use; executes purely on client device. Zero remote prompt streaming. |
| **Element Finder** | **CONFIRMED** | DOM Page Map with BM25 shortlist (up to 30 candidates) | Maps rendered interactive controls; visible keyboard chips (`Alt+Shift+M`); multi-point hit-testing avoids occluded elements. |
| **Speech-to-Text Input** | **CONFIRMED** | Dual mode: Browser-Native or On-Device Moonshine Tiny (ONNX Web) | Moonshine runs locally in extension offscreen document; native recognition uses browser engine. `Alt+Shift+S`. |
| **Execution Safety Modes** | **CONFIRMED** | 1. **Ask first (Standard)**<br>2. **Full auto** | Standard pauses before sensitive clicks, types, submits, and navigations. Full auto removes confirmation pauses while retaining permission and validation boundaries. |
| **Skills Engine** | **CONFIRMED** | Reusable `/skill-name` local recordings | Stores validated tool actions and user prompt answers locally. |

---

## 2. Unresolved Legal & Store Link Placeholders (Requires Owner Input)

The following items can be edited directly in `index.html` and `legal/index.html`:

| Placeholder | Context | Required Owner Input |
| :--- | :--- | :--- |
| `[CHROME WEB STORE URL]` | Install button for Google Chrome | Public listing URL on the Chrome Web Store once approved. |
| `[FIREFOX ADDONS URL]` | Install button for Mozilla Firefox | Public listing URL on Mozilla Add-ons (AMO) once approved. |
| `[EDGE ADDONS URL]` | Install button for Microsoft Edge | Public listing URL on Microsoft Edge Add-ons once approved. |
| `[PUBLIC CONTACT EMAIL]` | Site footer, support, general inquiries | Public inquiry mailbox (e.g., `contact@lawglitch.com` or `hello@lawglitch.com`). |
| `[PRIVACY / LEGAL CONTACT EMAIL]` | Legal Hub privacy requests, takedowns | Dedicated monitored privacy mailbox (e.g., `privacy@lawglitch.com`). |
| `[SECURITY CONTACT EMAIL / URL]` | Security disclosure and vulnerability reports | Security reporting channel (e.g., `security@lawglitch.com`). |
| `[CANONICAL DOMAIN]` | Production domain, SEO, sitemap | Production domain (e.g., `https://lawglitch.com`). |
| `[VALID ADDRESS]` | Legal Hub operator disclosures | Physical business or registered postal address if required in relevant markets. |
| `[COUNTRY]` | Country of establishment | LawGlitch / Sandipan Dutta incorporation/residence country. |
| `[JURISDICTION]` | Terms of use governing law | Governing court/state jurisdiction. |
| `[EFFECTIVE DATE / LAST UPDATED]` | Legal policy header | Formal publication date (e.g., `October 26, 2026`). |
| `[PUBLIC REPOSITORY URL]` | Code links, changelog | GitHub or public source repository URL (if open-source). |

---

## 3. Pre-Launch Verification Checklist

- [x] Company trade name confirmed as **LawGlitch**.
- [x] Sole proprietorship legal name confirmed as **Sandipan Dutta**.
- [x] Official LawGlitch balance scale logo integrated as vector SVG and favicon.
- [x] Product name confirmed as **Alfie**, designated as LawGlitch's first product.
- [x] Manual ZIP download references removed; replaced with **Chrome, Firefox, and Edge store links**.
- [x] Relative asset paths (`./assets/...` and `../assets/...`) configured for seamless Live Server & subpath preview.
- [ ] Insert active extension store URLs for Chrome, Firefox, and Edge in `index.html`.
- [ ] Fill in `[PUBLIC CONTACT EMAIL]`, `[PRIVACY / LEGAL CONTACT EMAIL]`, and `[CANONICAL DOMAIN]` in `legal/index.html` and `index.html`.
- [ ] Confirm Cloudflare Pages deployment and attach custom domain.
