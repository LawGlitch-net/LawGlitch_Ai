# LawGlitch — Alfie Official Website & Product Hub

Official website, product catalog, and comprehensive governance hub for **Alfie**—the flagship local-first browser automation companion developed by **LawGlitch** (under the sole proprietorship of **Sandipan Dutta**).

Built according to [`LawGlitch_Alfie_Website_Reconstruction_PRD.md`](LawGlitch_Alfie_Website_Reconstruction_PRD.md).

---

## 1. Architecture & Pages

The website is a static-first, dependency-light four-page web application:

1. **Home (`/` -> `index.html`):** Product-led introduction to Alfie with 3-step workflow, benefits, illustrative interactive preview, privacy summary, and pricing.
2. **Products (`/products/` -> `products/index.html`):** Central product catalog derived from `assets/js/products.js`, featuring Alfie and the browser store availability matrix.
3. **Terms & Privacy (`/terms/` -> `terms/index.html`):** Legally structured governance hub with in-page Table of Contents, GDPR / DPDP lawful bases, cookies disclosure (zero trackers), and commercial licensing terms.
4. **Dashboard (`/dashboard/` -> `dashboard/index.html`):** Clean static roadmap preview of upcoming Pro features and native autonomous agents. Contains zero fake login forms or credential inputs.
5. **404 Page (`404.html`):** Accessible error page with consistent brand navigation.

---

## 2. Browser Store Availability Status

As configured in `assets/js/products.js`:

- **Microsoft Edge:** **Available Now** ([Alifie - Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/alifie/ghcjkpeimdeacochedajjlijbinmmege))
- **Mozilla Firefox:** **Available Now** ([Alfie - Firefox Browser Add-ons](https://addons.mozilla.org/en-US/firefox/addon/alfie/))
- **Google Chrome:** **Coming Soon** (Store review in progress; safe disabled state without broken links)

Every install button on every page opens the shared, accessible **Install Modal** (`assets/js/install-modal.js`).

---

## 3. Brand & Operator Identity

- **Parent Brand / Company:** **LawGlitch**
- **Sole Proprietor / Legal Name:** **Sandipan Dutta**
- **Primary Product:** **Alfie**
- **Public & Commercial Inquiries:** `lawglitch@outlook.com`
- **Official Brand Mark:** LawGlitch Balance Scale Logo (`assets/images/lawglitch-logo.svg`)

---

## 4. Local Preview

You can run and preview the site locally using any standard static server:

```powershell
# Using npm
npm start

# Or using Python
python -m http.server 3000
```

Then visit **`http://localhost:3000`**.

---

## 5. Cloudflare Pages Deployment

The static output directory is ready for deployment:
- Output Directory: `.`
- Build Command: none (or leave blank)
- Redirects: `_redirects` handles legacy `/legal/*` to `/terms/`
- Headers: `_headers` applies strict CSP, HSTS, and asset caching rules.
