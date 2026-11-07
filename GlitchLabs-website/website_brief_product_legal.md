# Website Brief --- \[PRODUCT NAME\]

## Two-page product website for a privacy-conscious browser extension

**Purpose:** Build a polished, fast, responsive static website that
explains the extension, what it does today, what is planned next, and
how the project handles privacy and legal obligations.

**Deployment target:** GitHub repository → Cloudflare Pages\
**Pages:** `/` (Home) and `/legal` (Legal)\
**Style:** Premium, restrained, technical, editorial; no generic
AI-template appearance.

> IMPORTANT: Replace every `[PLACEHOLDER]` and remove any statement that
> is not factually true before publishing. The legal sections below are
> a strong implementation brief and draft framework, not a guarantee
> against litigation or a substitute for jurisdiction-specific legal
> advice. The website, extension, store listing, backend, and actual
> data practices must match.

------------------------------------------------------------------------

# PART A --- PRODUCT AND DESIGN BRIEF

## 1. Product positioning

The product is a browser extension intended to make the web easier to
understand and operate through a more capable, user-directed interface.
It may use browser-native capabilities, page context, speech input, and
automation/agent integrations as those capabilities are implemented.

Do not claim features are released unless they are available in the
current public build. Distinguish clearly between: - **Available now**
--- tested, released functionality. - **In development** --- actively
being built, not guaranteed. - **Exploring** --- an idea, not a
commitment or release promise.

Do not promise that the product works on every website, never makes
mistakes, is completely private, is fully local, or is "100% secure"
unless those claims can be substantiated and remain true in all relevant
circumstances.

### Brand placeholders

-   Product name: `[PRODUCT NAME]`
-   Short descriptor: `A more capable way to work with the web.`
-   Publisher / legal entity or individual: `[LEGAL NAME]`
-   Contact: `[PUBLIC CONTACT EMAIL]`
-   Website: `[CANONICAL DOMAIN]`
-   Extension store URL:
    `[EXTENSION STORE URL, OR OMIT UNTIL AVAILABLE]`
-   Repository: `[PUBLIC REPOSITORY URL, IF ANY]`
-   Last updated date for legal content: `[DATE]`

## 2. Art direction

Create an original visual identity. Avoid the common "AI startup
template" pattern: giant gradient blob, random floating cards, repeated
pill badges, stock robot imagery, excessive glassmorphism, and
meaningless animated gradients.

### Visual system

-   Background: deep graphite / near-black (`#0B0D10` or similar).
-   Primary text: warm off-white (`#F3F4F6`).
-   Secondary text: muted cool gray (`#A0A6B1`).
-   Accent: restrained electric blue (`#6B8CFF` or similar); use
    sparingly.
-   Surfaces: slightly lighter charcoal (`#12161C`).
-   Borders: subtle low-contrast gray (`rgba(255,255,255,0.10)`).
-   Typography: use a high-quality sans-serif such as Inter, Geist, or
    system sans. Prefer a locally bundled, open-licensed font if
    feasible; otherwise use a system stack to avoid extra network
    requests.
-   Use a consistent spacing scale, generous whitespace, clear
    typographic hierarchy, and deliberate alignment.
-   Use crisp vector icons from an open-source icon library such as
    Lucide (MIT license), with consistent stroke weight.
-   Avoid emojis as primary interface icons.
-   Avoid giant rounded cards everywhere. Mix open editorial sections,
    fine dividers, and only a few purposeful panels.
-   Ensure excellent light/dark contrast; the default theme can be dark.

### Hero art: original lightweight 3D asset

Create a hero composition that communicates "an intelligent layer over
the web," not a robot or AI brain.

Preferred concept: - A floating, abstract browser frame or stack of
browser-like panels. - Three to five translucent, carefully modeled
layers at different depths. - Small geometric markers representing page
elements, actions, or connected tools. - One subtle cobalt/blue light
source and realistic but restrained shadows. - Neutral studio lighting,
physically plausible materials, clean silhouettes. - Slow, nearly
imperceptible motion only: gentle rotation, parallax, or a light
sweep. - Keep the text and CTA separate from the 3D canvas for
readability and accessibility.

### Asset sourcing and licensing

Preferred order: 1. Build a simple original scene with Three.js using
basic geometry, which is open source under the MIT license. 2. Use a
downloadable community asset only after checking the exact asset's
license, attribution requirements, redistribution rights, and whether
the source file can be included in the repository. 3. Avoid a remote 3D
embed if it introduces a third-party tracker, heavy runtime, restrictive
licensing, or a dependency that makes the page fragile.

Possible references: - Three.js examples:
https://threejs.org/examples/ - Three.js repository and license:
https://github.com/mrdoob/three.js - Lucide icons and license:
https://github.com/lucide-icons/lucide - Spline community:
https://app.spline.design/community

Do not describe an asset as "open source" merely because it is publicly
viewable. Verify the specific asset license and record the source and
license in `THIRD_PARTY_NOTICES.md`.

### 3D performance rules

-   Prefer a small, optimized GLB/GLTF asset or a scene made from simple
    geometry.
-   Lazy-load the 3D module after the initial page content is visible;
    do not block the first render on WebGL.
-   Provide a static poster image fallback for unsupported devices,
    reduced-motion users, or failed WebGL initialization.
-   Respect `prefers-reduced-motion`; disable continuous animation when
    it is set.
-   Do not require mouse movement for the hero to make sense.
-   Keep the 3D area decorative (`aria-hidden="true"`) when it contains
    no meaningful information.
-   Ensure the headline, description, and CTA render immediately even if
    the 3D asset fails.
-   Avoid large, uncompressed textures and unnecessary post-processing.
-   If a scene materially harms mobile performance, replace it on small
    screens with the static poster.
-   No autoplay sound, no forced scroll effects, no cursor replacement,
    and no intrusive loading screen.

## 3. Information architecture

Exactly two primary pages:

1.  `/` --- Home
2.  `/legal` --- Legal hub

The legal page can contain multiple clearly titled sections in one page;
do not create extra pages unless a real business or legal need appears
later.

Global header: - Wordmark / product name on the left. - `Product` or
`Overview` anchor link. - `Roadmap` anchor link. - `Legal` link to
`/legal`. - One primary CTA: `Get the extension` when a real store URL
exists; otherwise `Follow development` or `Coming soon`. - Mobile menu
must be keyboard accessible and not cover content unexpectedly.

Global footer: - Product name and one-line descriptor. - Links to Home
and Legal. - Contact email. - Copyright year generated at build time or
maintained manually. - Optional source code / extension store links only
if real. - No fake social links or placeholder buttons in production.

## 4. Home page --- exact section plan and draft copy

### A. Header

Minimal, sticky only if it does not distract. Use a subtle bottom border
or transparent background that becomes solid on scroll. Avoid a large
navigation bar.

### B. Hero

Eyebrow: `A NEW LAYER FOR THE WEB`

Headline: **The web, on your terms.**

Supporting copy:
`[PRODUCT NAME] is a browser extension built to make working with the web feel more direct, capable, and user-controlled. We’re building a clearer way to understand pages, give instructions, and bring useful actions closer to where you work.`

Primary CTA: - If published: `Get the extension` →
`[EXTENSION STORE URL]` - If not published: `Follow development` → a
real public repository, release page, or contact link. If none exists,
use a non-clickable status label rather than a fake CTA.

Secondary CTA: `See what we’re building` → scroll to the product
section.

Hero visual: the custom 3D browser-layer scene described above.

Optional small status line, only if accurate: `In development` /
`Available for [SUPPORTED BROWSER]`.

### C. Product explanation

Heading: **Less friction between you and the task.**

Body:
`The browser is where a lot of work happens, but interacting with every page still takes effort. [PRODUCT NAME] explores a more natural layer for working with web content—one that keeps the user in control and makes complex interactions easier to express.`

Use three concise feature blocks. Each must be edited to reflect the
real current build:

1.  **A more useful interface**\
    `A lightweight interface designed to sit close to the page and stay out of the way when you don’t need it.`

2.  **Context-aware interaction**\
    `A developing approach to working with page content and interactive elements, with the goal of making web tasks easier to direct.`

3.  **Voice, when you want it**\
    `We’re exploring speech as an optional way to give instructions. Supported input methods and processing details will be documented before release.`

Do not imply that the product currently reads all page content, records
audio, executes arbitrary actions, or supports a particular AI provider
unless those capabilities are implemented and documented.

### D. How it works

Heading: **From intention to interaction.**

Use a restrained three-step horizontal sequence on desktop and stacked
sequence on mobile: 1. **Open** ---
`Bring up the extension when you need it.` 2. **Describe** ---
`Express the task in the supported interaction mode.` 3. **Review and
act** ---
`Understand what the extension is about to do and stay in control of consequential actions.`

The third step is a product principle, not a claim that confirmation
currently exists. If the implementation does not offer previews or
confirmations, rewrite this section to accurately describe its actual
behavior. Never market safeguards that do not exist.

### E. Principles

Heading: **Built with intention.**

Three principles: - **User-directed** ---
`The user should understand when the extension is active and how to stop or dismiss it.` -
**Transparent** ---
`Permissions, processing, and meaningful limitations should be explained in plain language.` -
**Practical by design** ---
`Fast interactions and a lightweight interface matter more than decorative complexity.`

Only describe these as established guarantees if product behavior and
testing support them. Otherwise use "Our design goals" as the heading.

### F. Roadmap

Heading: **What's next.** Subheading:
`A public view of the direction—not a promise of specific release dates.`

Use three roadmap columns or rows, with text status labels rather than
colorful badges: - **Now** ---
`[LIST ONLY SHIPPED OR CURRENTLY ACTIVE WORK]` - **Next** ---
`[LIST THE NEXT PLANNED ITEMS]` - **Exploring** ---
`[LIST EXPERIMENTS THAT MAY CHANGE OR NEVER SHIP]`

Potential roadmap topics, only if genuinely planned: - Improving
extension reliability and page compatibility. - Making interaction
states and user control clearer. - Expanding voice input options. -
Improving local speech recognition and caching behavior. - Adding or
improving integrations for external tools.

Do not publish dates unless the team is prepared to maintain them. State
that priorities may change, but do not use that statement to excuse
misleading claims.

### G. Privacy preview

Heading: **Privacy should be understandable.**

Copy:
`A browser extension can interact with sensitive parts of a person’s online life. We want our permissions, data flows, and third-party dependencies to be understandable before people rely on the product. Our legal page explains the data practices that actually apply to the current release.`

Link: `Read our privacy and legal information` → `/legal`

Important: This copy must be updated if the product's actual behavior
does not support the stated goal. Do not claim "we never collect data,"
"everything stays on your device," or "we do not track you" until the
complete website and extension stack has been audited.

### H. Final CTA

Heading: **Follow the build.**

Copy:
`[PRODUCT NAME] is being built iteratively. See the current release, follow development, or get in touch.`

Buttons: - `Get the extension` if live; otherwise `Follow development`
if a real destination exists. - `Contact` →
`mailto:[PUBLIC CONTACT EMAIL]`

### I. Footer

Include product name, `Home`, `Legal`, and the public contact email. Do
not include an address unless legally required and the correct address
has been confirmed. Do not invent a company name, address, registration
number, or contact person.

## 5. Legal page --- structure and content rules

Page title: **Legal & Privacy**

Intro:
`This page explains the terms that apply to this website and [PRODUCT NAME], and how personal data is handled. The details below must describe the current product and its actual technical behavior. If a feature or data flow is not used, remove the corresponding text rather than implying that it is.`

Show: - `Last updated: [DATE]` - A small table of contents with anchor
links. - Plain-language sections with readable line length. - A clear
contact route. - No dark-pattern consent controls.

The draft policy template in Part B below should be used as the initial
content, then edited and reviewed before publication.

## 6. Interaction and motion

-   Smooth scrolling only where it respects reduced-motion settings.
-   Small, purposeful hover states.
-   Buttons have visible keyboard focus and pressed states.
-   No fake loading states, fake notifications, fake user counts, fake
    testimonials, fake ratings, or fabricated press logos.
-   Roadmap statuses must be text, not color alone.
-   Do not use scroll-jacking, infinite marquees, or motion that
    obscures content.
-   All links and controls must work. No placeholder `href="#"` links in
    production.
-   Avoid modal newsletter forms unless there is a real service, real
    consent process, and a documented retention policy.

## 7. Accessibility

-   Use semantic HTML landmarks: `header`, `nav`, `main`, `section`,
    `footer`.
-   Exactly one meaningful `h1` per page.
-   Maintain logical heading hierarchy.
-   Keyboard navigation must work for all links, menus, and controls.
-   Focus indicators must be visible.
-   Ensure sufficient contrast, especially for muted text and thin
    borders.
-   Add descriptive alt text to meaningful images; use empty alt text
    for decorative images.
-   Keep text outside the 3D canvas.
-   Respect `prefers-reduced-motion`.
-   Do not communicate roadmap status by color alone.
-   Ensure the legal table of contents works on mobile and keyboard.
-   Test zoom at 200% and narrow viewports.

## 8. SEO and social metadata

Home title: `[PRODUCT NAME] — A more capable way to work with the web`
Home description:
`Discover [PRODUCT NAME], a browser extension exploring a more direct, user-controlled way to work with web content.`
Legal title: `Legal & Privacy — [PRODUCT NAME]` Legal description:
`Privacy information, terms, disclosures, and contact details for [PRODUCT NAME].`

Add: - Canonical URL once the production domain is known. - Open Graph
title, description, and a custom 1200×630 social image. - Favicon and
web app theme color. - `robots.txt` allowing indexing of public pages,
unless there is a reason not to. - A sitemap only if useful; for a
two-page static site, it can be a simple static XML file. - Do not add
Organization structured data with invented business information. - Avoid
keyword stuffing.

## 9. Technical implementation

### Recommended stack

For the simplest and fastest deployment: - Plain HTML, CSS, and minimal
JavaScript; or a very small static build using Vite if component reuse
is useful. - No backend, database, authentication, or server-side
rendering. - No dependency on a third-party font CDN. - No analytics by
default. - No remote scripts unless their necessity, privacy impact, and
license have been reviewed. - A static 3D asset or a small Three.js
module loaded asynchronously. - Two routes/pages: `/` and `/legal/` or
`/legal.html`. Choose one convention and configure links consistently.

A static site is ideal because it minimizes moving parts. Cloudflare
Pages supports static HTML and Git-based deployments. See: -
https://developers.cloudflare.com/pages/framework-guides/deploy-anything/ -
https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/

### Suggested repository structure

``` text
/
├── index.html
├── legal/
│   └── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   │   ├── hero-poster.webp
│   │   └── og-image.png
│   └── 3d/
│       └── hero-scene.glb
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── THIRD_PARTY_NOTICES.md
└── README.md
```

If using Vite, adjust the output directory to `dist` and ensure
`/legal/` is generated as a static page. If using plain HTML, keep
`index.html` at the deployment output root and `legal/index.html` under
`legal/`.

### Performance targets

Treat these as engineering goals, not guarantees: - Fast first render on
a mid-range mobile device. - Hero headline and CTA render before the 3D
scene. - No layout shift when the scene loads; reserve its aspect
ratio. - Compressed AVIF/WebP images. - Use modern JS and CSS without a
heavy component framework. - Avoid shipping unused icon packs or
libraries. - Test with Lighthouse and real mobile hardware where
possible. - Test the page with WebGL disabled and with reduced motion
enabled. - Do not load a 3D scene if it is not visible or if the user
prefers reduced motion.

### Security headers

Configure reasonable headers where supported by Cloudflare Pages, using
a `_headers` file or equivalent: - `X-Content-Type-Options: nosniff` -
`Referrer-Policy: strict-origin-when-cross-origin` -
`Permissions-Policy` disabling browser features the marketing site does
not use (for example camera, microphone, geolocation); make sure this
policy does not conflict with any intended website functionality. - A
restrictive Content Security Policy after enumerating all scripts,
styles, fonts, images, and any WebGL asset origins. Start with
report-only if necessary, test thoroughly, then enforce. -
`frame-ancestors 'none'` if the site must not be embedded. -
`Strict-Transport-Security` only when the domain is correctly
HTTPS-configured and all relevant subdomains have been assessed.

Do not blindly copy a CSP that breaks Three.js or the site. Do not add
broad wildcard sources for convenience. Security headers are
defense-in-depth and do not replace secure extension code or server-side
controls.

## 10. Deployment checklist

1.  Create a GitHub repository.
2.  Add the static website files.
3.  Test both pages locally, including mobile layout, keyboard
    navigation, and reduced motion.
4.  Commit and push to the production branch.
5.  In Cloudflare, open **Workers & Pages → Create application → Pages →
    Import an existing Git repository**.
6.  Select the repository and production branch.
7.  For plain HTML, set the build command to `exit 0` (or leave it blank
    if supported) and set the output directory to the folder containing
    `index.html`. For Vite, use `npm run build` and output directory
    `dist`.
8.  Deploy and verify the generated `pages.dev` address.
9.  Attach the custom domain and confirm HTTPS.
10. Test `/` and `/legal/`, direct URL entry, refresh behavior, 404
    behavior, mobile navigation, and all external links.
11. Review security headers and browser console errors.
12. Confirm legal contact details and policies are accurate before
    public launch.
13. Check that each new GitHub push deploys correctly and that preview
    deployments do not accidentally expose secrets.

Never put API keys, private tokens, signing credentials, or secrets in
the static repository. Static site assets are public.

------------------------------------------------------------------------

# PART B --- LEGAL HUB DRAFT

## Legal review warning

This is a comprehensive starting template, not a legal opinion. It
cannot make the project "legally secured" by itself. EU, US, and Indian
obligations depend on the entity, users, business model, actual data
flows, age range, tracking, AI providers, payments, and product
functionality. Have qualified counsel review the final version,
particularly before collecting sensitive page content, voice recordings,
account data, or payments.

**Do not publish the policy with unfilled placeholders. Do not promise a
data practice you have not verified.** A false privacy statement can
increase risk rather than reduce it.

## 1. Operator and contact information

**Operator:** `[FULL LEGAL NAME OR REGISTERED ENTITY NAME]`\
**Business / postal address:**
`[VALID ADDRESS IF REQUIRED OR APPROPRIATE]`\
**Country of establishment:** `[COUNTRY]`\
**Contact email:** `[PRIVACY / LEGAL CONTACT EMAIL]`\
**Website:** `[CANONICAL DOMAIN]`\
**Product:** `[PRODUCT NAME]`\
**Effective date:** `[DATE]`\
**Last updated:** `[DATE]`

If a company operates the product, identify the correct legal entity
rather than only the brand. If a sole individual operates it, confirm
what disclosures are legally required in the relevant markets and
whether a business address or representative is required. Do not publish
a fake address or an unmonitored email.

## 2. Scope

This notice covers the public website and, where stated, the
`[PRODUCT NAME]` browser extension and related services. Separate the
website's data practices from the extension's data practices. The
extension may access page content, browser APIs, speech input, or
external services in ways the static marketing website does not.

This notice should explain: - what information is processed; - why it is
processed and the legal basis where required; - whether information
leaves the device; - who receives it; - retention and deletion; - how
users exercise rights; - how to contact the operator or relevant
regulator.

If the extension has different processing modes, describe them
separately in plain language.

## 3. Data we process

**Publish only the subsections that accurately describe the actual
implementation.** Complete an internal data inventory before launch.

### 3.1 Website access and technical logs

The hosting provider may process technical information needed to deliver
and protect the website, such as IP address, request time, requested
path, user-agent/browser details, referrer, and security events,
depending on the hosting configuration and provider logs.

-   Purposes: deliver the site, diagnose errors, prevent abuse, and
    maintain security.
-   Legal basis, where GDPR applies:
    `[CONFIRM APPROPRIATE BASIS, OFTEN LEGITIMATE INTEREST FOR NECESSARY SECURITY/DELIVERY PROCESSING]`.
-   Retention: `[VERIFY HOSTING LOG RETENTION AND CONFIGURATION]`.
-   Recipients: `[CLOUDFLARE AND ANY OTHER ACTUAL PROVIDERS]`.

Do not say that no personal data is processed simply because the site
has no login or database. Hosting and security logs may still involve
personal data.

### 3.2 Contact messages

If a visitor emails us, we process the sender's email address, message,
and any information they choose to include.

-   Purpose: respond to the request and maintain necessary
    correspondence.
-   Legal basis where GDPR applies: steps requested before a potential
    contract, legitimate interests, or another basis confirmed by
    counsel, depending on the message.
-   Retention:
    `[DEFINE A REASONABLE RETENTION PERIOD AND EXCEPTIONS FOR LEGAL OBLIGATIONS]`.
-   Do not use contact details for marketing unless there is an
    appropriate legal basis and any required consent.

Do not add a contact form unless submissions have a real destination,
access controls, spam protection, and a documented retention process.

### 3.3 Extension permissions and page context

If the extension reads page content, detects interactive elements, or
interacts with websites, disclose: - the specific browser permissions
requested; - what content is accessed and when; - whether processing
happens locally or remotely; - what is transmitted and to which
provider; - whether page content is stored, and for how long; - what
user action activates the processing; - how the user stops, disables, or
uninstalls the extension.

Suggested fill-in text:
`When you activate [FEATURE], the extension accesses [SPECIFIC DATA] on [SCOPE OF PAGES] to [PURPOSE]. This information is [PROCESSED LOCALLY / SENT TO NAMED PROVIDER(S) / BOTH]. It is retained for [PERIOD] or [NOT STORED AFTER PROCESSING], subject to [EXCEPTIONS]. The feature can be disabled by [INSTRUCTIONS].`

Do not claim that the extension only reads the active tab, only works on
user-initiated pages, or never transmits page content unless this is
verified in the source code and network behavior.

### 3.4 Voice and speech recognition

If speech input is available, clearly state: - whether the browser's
native speech API is used; - whether a local speech model is downloaded
or cached; - the model's approximate download size and cache behavior if
material; - whether audio is sent to the browser vendor or another
provider; - whether raw audio or transcripts are retained; - whether
transcripts are sent to an agent or AI provider; - how microphone access
is initiated and stopped.

Template:
`When you choose voice input, the extension requests microphone access through [ACTUAL API / MECHANISM]. Speech is processed using [ACTUAL METHOD]. [AUDIO / TRANSCRIPTS / BOTH] [REMAIN ON DEVICE / ARE SENT TO PROVIDER NAME]. We retain [DATA] for [PERIOD / NOT RETAINED], for [PURPOSE]. You can stop voice input by [INSTRUCTIONS].`

Never say "voice stays on your device" if any fallback or browser-native
service can send audio to a remote service. Distinguish raw audio from
text transcripts.

### 3.5 AI, agent, and external integrations

If the extension sends prompts, transcripts, page content, or actions to
third-party services, identify those service providers by name or
meaningful category and explain: - which data is transmitted; - why it
is transmitted; - whether it is used to generate a response or execute a
task; - whether the provider retains the data or uses it for model
improvement, based on the actual provider terms and account
configuration; - applicable retention and transfer arrangements; - how
users can avoid or disable the feature.

Template:
`If you enable [FEATURE], the extension sends [DATA CATEGORIES] to [PROVIDER] to [PURPOSE]. The provider processes the data under its applicable terms and privacy documentation: [LINK]. The extension does not send this information when [TRUE CONDITIONS].`

Do not rely on vague language such as "trusted partners." Do not state
that a provider does not train on data without checking the specific
product/API terms and configuration.

### 3.6 Accounts, analytics, payments, crash reports, and mailing lists

If any of these are introduced, add a separate disclosure for each: -
account identifiers and authentication; - analytics events and
identifiers; - advertising or attribution identifiers; - payment
processors and transaction records; - crash logs and diagnostics; -
mailing-list signups and unsubscribe mechanism; - support or feedback
tools.

If not used, do not imply they are used. Revisit this policy whenever
the product changes.

## 4. Purposes and legal bases

Where GDPR applies, identify a valid legal basis for each processing
purpose rather than using a blanket consent statement. Depending on the
activity, a basis may include performance of a contract, steps before
entering a contract, compliance with a legal obligation, consent, or
legitimate interests after the required assessment.

Example mapping to complete:

  -------------------------------------------------------------------------------------
  Processing purpose      Data                    Legal basis / condition
  ----------------------- ----------------------- -------------------------------------
  Serve and secure        Technical request and   `[CONFIRM]`
  website                 security logs           

  Respond to email        Email address and       `[CONFIRM]`
                          message                 

  Deliver extension       `[DATA]`                `[CONFIRM]`
  feature                                         

  Optional analytics      `[DATA]`                `[CONFIRM; CONSENT WHERE REQUIRED]`

  Optional marketing      Email/contact details   `[CONFIRM; CONSENT WHERE REQUIRED]`
  -------------------------------------------------------------------------------------

For India, map processing to the applicable DPDP Act/Rules requirements
and lawful grounds, taking account of commencement and transition
provisions. Do not assume that GDPR legal-basis terminology maps
directly to Indian law.

## 5. Cookies and similar technologies

Initial recommendation: do not deploy advertising cookies, analytics
trackers, session replay, or third-party tracking pixels on the
marketing website.

Suggested notice if verified:
`This website does not intentionally use advertising cookies or third-party analytics trackers. The hosting and security infrastructure may process technical request data required to deliver and protect the site. If we introduce non-essential cookies or similar technologies, we will update this notice and obtain consent where required before they are activated.`

This wording must be verified against actual behavior, including
Cloudflare settings, embedded media, fonts, analytics, and any external
scripts. Local storage, pixels, fingerprinting, and SDKs may also be
relevant; do not treat "no cookies" as a blanket exemption from all
tracking rules.

If optional cookies or tracking are added: - use a compliant
consent-management mechanism in jurisdictions that require consent; - do
not load non-essential trackers before valid consent; - provide a
genuine reject option comparable in prominence to accept; - allow
preferences to be changed or withdrawn later; - document consent records
as appropriate; - provide a clear notice of each technology's purpose
and provider; - do not use pre-ticked boxes or dark patterns.

## 6. Sharing and recipients

List actual recipients and their roles. Possible categories, only if
applicable: - hosting, CDN, DNS, and security provider; - email
provider; - AI or speech-processing provider; - crash-reporting or
analytics provider; - payment processor; - professional advisers; -
authorities or courts when legally required.

Template:
`We share information only where necessary for the purposes described in this notice, under applicable terms and safeguards. Our current service providers are: [PROVIDER, ROLE, LINK TO PRIVACY NOTICE, PROCESSING LOCATION / TRANSFER DETAILS WHERE RELEVANT].`

Do not claim that information is never shared if the host, browser APIs,
or AI providers receive it. If data is sold, shared for cross-context
behavioral advertising, or used for targeted advertising within the
meaning of applicable laws, obtain specific legal advice and implement
required disclosures and opt-out mechanisms.

## 7. International transfers

If personal data is transferred across borders, explain the relevant
destinations or transfer mechanism where required. For EU/EEA personal
data, confirm whether an adequacy decision applies or whether
appropriate safeguards such as Standard Contractual Clauses and any
necessary supplementary measures are required. Identify any transfer
impact assessment obligations with counsel.

Template:
`Some service providers may process data outside your country, including in [COUNTRIES / REGIONS]. Where required, we use legally recognized transfer mechanisms and safeguards. Details can be requested at [CONTACT EMAIL].`

Do not state that data stays in India, the EU, or the user's device
unless the complete system supports that statement.

## 8. Retention and deletion

Use specific retention periods wherever possible, not "as long as
necessary" alone.

Complete a schedule:

  -----------------------------------------------------------------------------------------
  Data category           Retention period               Deletion method / exceptions
  ----------------------- ------------------------------ ----------------------------------
  Website security logs   `[PROVIDER-VERIFIED PERIOD]`   `[METHOD]`

  Support emails          `[PERIOD]`                     `[METHOD]`

  Voice audio             `[PERIOD OR NOT RETAINED]`     `[METHOD]`

  Transcripts/prompts     `[PERIOD OR NOT RETAINED]`     `[METHOD]`

  Page content / task     `[PERIOD OR NOT RETAINED]`     `[METHOD]`
  context                                                

  Account and billing     `[PERIOD]`                     `[LEGAL RETENTION REQUIREMENTS]`
  records, if any                                        
  -----------------------------------------------------------------------------------------

Explain exceptions for legal claims, security investigations, and
mandatory recordkeeping. Make sure the policy matches actual provider
retention settings and backups.

## 9. Security

Suggested wording:
`We use reasonable technical and organizational measures designed to protect information appropriate to the nature of the processing. No website, browser extension, transmission method, or storage system can be guaranteed completely secure. We review access, dependencies, permissions, and data handling as the product evolves.`

Do not claim certifications, audits, encryption standards, bug bounty
programs, or independent penetration tests unless they exist. Document
internal procedures for vulnerability reports, access control,
dependency updates, incident handling, and data minimization.

Create a security contact route:
`[SECURITY CONTACT EMAIL OR RESPONSIBLE DISCLOSURE URL]`. Do not publish
sensitive operational details or secrets.

## 10. User rights

### EU/EEA and UK, where applicable

Explain the rights that may apply depending on circumstances: -
access; - rectification; - erasure; - restriction; - data portability; -
objection; - withdrawal of consent without affecting prior lawful
processing; - complaint to the competent supervisory authority.

Provide a contact method and explain how requests are verified and
answered within applicable deadlines. State that some rights are subject
to legal conditions and exceptions. If applicable, identify the
controller and EU/UK representative or data protection officer when
legally required.

### United States

Rights vary by state and business applicability. Where applicable,
provide ways to request access/knowledge, correction, deletion,
portability, and to opt out of sale, sharing, or targeted advertising.
Include appeal procedures where required and explain how authorized
agents may submit requests if applicable.

Do not claim that every state law applies to every user or that a right
is unconditional. Determine applicability based on the operator's
activities, thresholds, and exemptions.

### India

Explain how users may exercise rights available under the applicable
Digital Personal Data Protection Act and Rules, including correction,
erasure, grievance redressal, and nomination rights where applicable.
Provide a grievance contact or mechanism and any required response
timelines, as confirmed by counsel.

Because the Indian framework has commencement and transition provisions,
verify which duties are in force on the actual launch date and monitor
subsequent notifications. Do not assume that every provision became
enforceable at the same time.

### How to submit a request

`Email [PRIVACY EMAIL] with the subject “Privacy Request.” Tell us which right you wish to exercise and which product or interaction your request concerns. We may request reasonable information to verify the request and protect against unauthorized disclosure. We will respond within the timeframe required by applicable law.`

Do not request excessive identity documents. Define a safe verification
method appropriate to the request.

## 11. Children and age restrictions

Choose and publish a truthful policy. Do not use a generic "not intended
for children" sentence as a substitute for required age controls or
parental consent.

Template to complete with counsel:
`[PRODUCT NAME] is intended for [AGE / AUDIENCE]. We do not knowingly collect personal information from children in circumstances where parental consent or other child-specific requirements apply unless we have implemented the legally required process. If you believe a child has provided information improperly, contact [EMAIL] so we can assess and take appropriate action.`

Review: - US COPPA if the service is directed to children under 13 or
has relevant actual knowledge; - EU member-state digital consent ages
and child-protection rules where relevant; - Indian requirements
relating to children under the DPDP Act and applicable Rules, including
restrictions or exemptions that may apply to the specific product.

If the extension can access arbitrary page content, consider the risk of
processing children's information even when the marketing site is not
directed at children.

## 12. Third-party services and external links

`The website or extension may link to third-party websites and services. Their privacy practices and terms are controlled by those providers. Review the relevant provider documentation before enabling an integration. A link does not mean we control or endorse all content on that service.`

List actual third-party services and their privacy notices when they
process user data. External links alone do not replace required
processor disclosures or contractual safeguards.

## 13. Changes to this notice

`We may update this notice as the website, extension, service providers, or applicable laws change. We will update the “Last updated” date and provide additional notice or obtain consent when required. Material changes to processing will not be treated as authorized merely because a revised policy has been posted.`

For meaningful changes, consider an in-product notice and, where
required, renewed consent. Retain a record of prior policy versions.

## 14. Terms of use

### Acceptance and scope

`These terms govern access to this website and use of [PRODUCT NAME], operated by [LEGAL NAME]. By using the service, you agree to these terms to the extent permitted by applicable law. If you do not agree, do not use the service.`

Have counsel decide whether extension installation or use is the
appropriate acceptance mechanism and whether a separate click-to-accept
flow is necessary. A passive footer link may not be sufficient for every
contract or consumer context.

### Eligibility and lawful use

`You must use the service lawfully and in accordance with the rules that apply to your use of websites, browser software, and third-party services. You must not use it to violate others’ rights, bypass lawful access controls, interfere with systems, or carry out unlawful or harmful activity.`

Do not suggest that users are solely responsible for all legal
consequences if the operator also has statutory duties.

### Product behavior and limitations

`The extension may produce incomplete, incorrect, or unexpected results. You are responsible for reviewing important outputs and confirming consequential actions. Availability, website compatibility, and features may change. Do not rely on the service as the sole basis for legal, medical, financial, safety-critical, or other high-impact decisions.`

Adjust to the product's actual risk profile. If the extension executes
actions, describe the supported confirmation controls, limitations, and
how to stop a running task.

### Third-party websites and services

`The extension may interact with third-party websites or services. Those services may change their interfaces, terms, or access rules. We do not control third-party content or availability. You remain responsible for complying with the terms and applicable laws governing those services.`

Do not claim a blanket right to access or automate any website. Review
website terms, browser-store policies, and applicable computer access
laws.

### Intellectual property

`The website, branding, and original materials are owned by or licensed to [LEGAL NAME], except for third-party materials identified in applicable notices. These terms do not transfer ownership to you. You may not copy or redistribute protected materials except as permitted by law or the relevant license.`

If the extension or site is open source, link to the exact license and
explain which repository/files it covers. Do not imply that the brand,
logos, or all website assets are open source unless they are.

### Feedback

`If you submit feedback, do not include confidential or sensitive information unless necessary. We may use suggestions to improve the product, subject to applicable law and any separate agreement. This clause does not transfer ownership of your pre-existing intellectual property or override rights that cannot lawfully be waived.`

### Suspension and termination

`We may suspend or discontinue access where reasonably necessary for security, abuse prevention, legal compliance, or service changes. Where required by law or contract, we will provide notice or other protections. You may stop using the extension and uninstall it at any time.`

### Warranties

`To the extent permitted by applicable law, the website and extension are provided on an “as available” basis and without promises that the service will be uninterrupted, error-free, compatible with every website, or suitable for every purpose.`

This must not exclude mandatory consumer guarantees or statutory rights.

### Limitation of liability

`Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited, including any mandatory consumer rights or liability for fraud, willful misconduct, or other categories that applicable law makes non-excludable. Subject to that limitation, any exclusions or caps must be reviewed and tailored to the governing law and the nature of the service.`

**Do not insert a sweeping "we are never liable for anything" clause.**
It may be unenforceable and misleading. Have counsel draft any specific
cap, indirect-loss exclusion, indemnity, or business-user limitation for
the jurisdictions and user types involved.

### Changes and availability

`Features may be changed, suspended, or retired as the product evolves. Roadmap items and estimated dates are informational only and are not contractual commitments unless expressly stated otherwise.`

### Governing law and disputes

`These terms are governed by the laws of [JURISDICTION], except to the extent mandatory consumer-protection laws provide otherwise. Any dispute-resolution or venue provision must preserve non-waivable rights and be reviewed for enforceability in the markets served.`

Do not choose a governing law or court location without confirming the
operator's legal situation. Arbitration, class-action waivers, mandatory
venue, and consumer dispute terms need specialist review and may be
invalid or restricted in some jurisdictions.

## 15. Copyright and takedown contact

`For copyright, licensing, or other intellectual-property concerns, contact [EMAIL] with a description of the material, the relevant URL or location, your relationship to the rights, and a way to contact you.`

If the product hosts user content or operates in a way that triggers
specific notice-and-takedown regimes, obtain advice about the relevant
statutory process. Do not claim DMCA safe-harbor protection or
intermediary status without verifying eligibility and completing
required steps.

## 16. Accessibility statement --- optional but recommended

Publish only if the team is prepared to maintain it:
`We aim to make this website usable with keyboard navigation, readable contrast, responsive layouts, and reduced-motion preferences. If you encounter an accessibility barrier, contact [EMAIL] and describe the page and issue so we can review it.`

Do not claim conformance to WCAG or legal accessibility standards unless
the site has been evaluated and the claim is accurate.

## 17. Legal and compliance checklist before launch

### Identity and notices

-   [ ] Correct legal operator/entity name confirmed.
-   [ ] Required business/contact disclosures checked for applicable
    markets.
-   [ ] Real contact email monitored.
-   [ ] Legal page has effective date and last-updated date.
-   [ ] No placeholders remain.
-   [ ] Privacy and terms are linked from every relevant surface,
    including extension listing/settings where appropriate.

### Data mapping

-   [ ] Inventory every data item collected by website and extension.
-   [ ] Map permissions to real functionality and explain them before or
    at the relevant point of use.
-   [ ] Verify whether page content, transcripts, audio, prompts, URLs,
    or task history leave the device.
-   [ ] Identify every processor/provider and review its terms,
    retention, and training settings.
-   [ ] Confirm hosting log behavior and retention.
-   [ ] Define retention and deletion processes, including backups.
-   [ ] Check that policy claims match observed network requests and
    source code.
-   [ ] Verify security incident and data-subject request procedures.

### EU/EEA and UK

-   [ ] Assess GDPR territorial scope and controller/processor roles.
-   [ ] Document purpose, minimization, legal basis, retention, and
    rights handling.
-   [ ] Assess whether a DPIA is required, particularly for systematic
    or sensitive processing.
-   [ ] Determine whether an EU/UK representative or DPO is legally
    required.
-   [ ] Review international transfers and contracts.
-   [ ] Assess ePrivacy rules for cookies, SDKs, pixels, local storage,
    and similar technologies.
-   [ ] Check accessibility, consumer, and digital-market obligations
    relevant to the product and distribution.

### United States

-   [ ] Review FTC Act risks and ensure privacy/security claims are
    substantiated.
-   [ ] Determine which state privacy laws apply, including California,
    based on actual thresholds and business activity.
-   [ ] Implement applicable access/deletion/correction/opt-out
    processes.
-   [ ] Assess COPPA and other child-related requirements.
-   [ ] Review state breach-notification laws and incident response.
-   [ ] If advertising or targeted tracking is added, review disclosure
    and opt-out obligations.

### India

-   [ ] Review the DPDP Act, 2023 and the notified DPDP Rules, 2025,
    including commencement and transition provisions effective at
    launch.
-   [ ] Identify applicable notice, consent/lawful-use, security,
    grievance, retention, breach, and rights obligations.
-   [ ] Confirm whether any child-related requirements or exemptions
    apply.
-   [ ] Check other applicable Indian laws and sector-specific
    requirements based on the actual product and business model.
-   [ ] Maintain a process to monitor new rules, notifications, and
    commencement dates.

### Browser extension and AI

-   [ ] Review the relevant browser Web Store policies and required
    privacy disclosures.
-   [ ] Request only necessary permissions.
-   [ ] Provide clear in-product notices for sensitive access and
    external transmission.
-   [ ] Verify voice input behavior and browser-native speech API data
    flows.
-   [ ] Verify local model downloads, caching, updates, and storage.
-   [ ] Review external agent/AI provider policies and retention
    settings.
-   [ ] Add a user-visible way to stop/disable relevant features where
    appropriate.
-   [ ] Avoid claiming full local processing, zero collection, or
    guaranteed security unless verified.
-   [ ] Test that the legal page and store listing describe the same
    behavior.

### Website quality and operations

-   [ ] All external links are real and tested.
-   [ ] No fake testimonials, numbers, customer logos, or claims.
-   [ ] No trackers are loaded before any required consent.
-   [ ] Legal page is keyboard accessible and readable on mobile.
-   [ ] Security headers are tested.
-   [ ] Dependencies and third-party asset licenses are documented.
-   [ ] Privacy and security contact channels are monitored.
-   [ ] A process exists for policy updates when data flows change.

------------------------------------------------------------------------

# PART C --- OFFICIAL REFERENCES FOR THE IMPLEMENTER

Use primary sources and re-check them immediately before launch. This
list is not exhaustive and does not replace legal advice.

## European Union / EEA

-   European Commission --- GDPR information for individuals:\
    https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en
-   European Commission --- GDPR principles for businesses and
    organisations:\
    https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en
-   Your Europe --- securing a website and data protection information:\
    https://europa.eu/youreurope/business/growing/digitalising/securing-website/index_en.htm
-   European Commission --- cookie policy example and cookie
    information:\
    https://commission.europa.eu/cookies-policy_en
-   Also review the GDPR text, applicable national ePrivacy
    implementations, and EDPB guidance relevant to the actual
    processing.

## United States

-   Federal Trade Commission --- Privacy and Security for businesses:\
    https://www.ftc.gov/business-guidance/privacy-security
-   California Attorney General --- CCPA overview:\
    https://oag.ca.gov/privacy/ccpa
-   FTC --- review COPPA guidance if children's data may be involved:\
    https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy
-   Review applicable state privacy, consumer-protection,
    breach-notification, and sector-specific laws based on the operator
    and product.

## India

-   Ministry of Electronics and Information Technology --- Acts and
    policies, including DPDP Rules, 2025:\
    https://www.meity.gov.in/documents/act-and-policies
-   Press Information Bureau --- announcement on notification of DPDP
    Rules, 2025:\
    https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190655
-   Verify the official Act, Rules, corrigenda, and commencement
    notifications available through MeitY and the Gazette of India.

## Deployment and open-source assets

-   Cloudflare Pages --- static HTML deployment:\
    https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
-   Cloudflare Pages --- GitHub integration:\
    https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
-   Three.js examples:\
    https://threejs.org/examples/
-   Three.js source and license:\
    https://github.com/mrdoob/three.js
-   Lucide icons and license:\
    https://github.com/lucide-icons/lucide

------------------------------------------------------------------------

# FINAL INSTRUCTION TO THE WEBSITE CREATOR

Build the complete website from this specification. Prioritize clarity,
originality, loading speed, accessibility, and a premium visual finish.
Implement the Home and Legal pages as static pages and make every
navigation element work.

Before coding, identify all unresolved placeholders and create a short
`CONTENT_TO_CONFIRM.md` listing the information the owner must supply.
You may build the layout using clearly marked placeholders, but do not
invent the legal operator, contact details, current product
capabilities, providers, retention periods, or legal claims.

Use a custom, lightweight 3D hero with a static fallback. Document all
third-party asset licenses. Do not add analytics, advertising trackers,
cookies, a newsletter service, or a backend unless explicitly requested.

Deliver: 1. The complete static site. 2. The two responsive pages. 3.
Optimized hero asset and fallback. 4. SEO metadata, favicon, and social
preview image. 5. Security headers with a tested CSP appropriate to the
actual assets. 6. `THIRD_PARTY_NOTICES.md`. 7. `CONTENT_TO_CONFIRM.md`.
8. `README.md` with exact GitHub + Cloudflare Pages deployment
instructions. 9. A final pre-launch checklist that identifies every
remaining legal and factual item requiring owner confirmation.
