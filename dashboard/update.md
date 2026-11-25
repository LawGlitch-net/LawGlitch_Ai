# LawGlitch Website Update — Product, Dashboard, SEO & Content System

## 1. Overall Objective

Redesign and improve the existing https://lawglitch.pages.dev website to strengthen its marketing, product positioning, user onboarding and long-term organic search visibility.

The website should establish **LawGlitch as a technology and AI automation studio**, with Alfie as its flagship product.

The primary objectives are:

- Improve conversion from website visitors to Alfie users.
- Make installing and configuring Alfie straightforward.
- Introduce an authenticated user dashboard for Alfie Agent Gateway access.
- Create a scalable SEO system with editable metadata and dedicated landing pages.
- Introduce a dedicated blog section for organic traffic, educational content and topical authority.
- Generate leads for custom AI agents, integrations and automation projects.

### Implementation principles

- Preserve the existing website's visual identity and working functionality.
- Keep the interface modern, lightweight, responsive and conversion-focused.
- Avoid unnecessary dependencies, backend functions and database tables.
- Prefer static content and JSON-driven configuration wherever practical.
- Make the content structure easy to expand without repeatedly modifying application code.

---

# 2. User Dashboard & Authentication

## 2.1 Navigation

Add a Dashboard entry to the top-right section of the navigation bar.

- Logged-out visitors see a Login button.
- Authenticated users see a Dashboard button or profile indicator.
- Dashboard should be accessible only to authenticated users.

## 2.2 Authentication

Implement Google and GitHub OAuth authentication through Supabase Auth.

After successful authentication:

1. Verify the authenticated Supabase user.
2. Create a corresponding profile if one does not already exist.
3. Associate the profile with the Supabase Auth UUID.
4. Retrieve the user's existing profile if it already exists.
5. Redirect the user to their dashboard.

Use `lawglitch@gmail.com` as the designated administrative account for initial account management and administration.

Do not create duplicate profiles when an existing user logs in again.

## 2.3 Dashboard layout

Display the following information:

### Account Information

- Username: Full email address.
- Account status.
- Current plan.
- Account creation date (optional).

### Gateway Credentials

Provide a dedicated section titled:

**Alfie Agent Gateway**

Display:

- Username: User's full email address.
- Password: Masked or hidden by default.
- Generate password button (`+`).
- Delete/revoke credential option.

When the user clicks `+`:

1. Generate a cryptographically secure random one-time token.
2. Store only its SHA-256 hash in `profiles.gateway_key_hash`.
3. Set `gateway_key_active = true`.
4. Display the raw token once for the user to copy.
5. Never display or retrieve the raw token again after the generation response.

If a credential already exists, explain that generating another credential will replace the existing one.

Display this warning beneath the generated password:

> This password is not stored here. You will never be able to view it again, so make sure to copy it and keep it somewhere secure.

### Gateway Setup Instructions

Display the following instructions beneath the credential section:

**How to connect Alfie to your account**

1. Open your Alfie browser extension.
2. Navigate to Extension Settings.
3. Open Custom HTTP and select Add Integration.
4. Choose **Alfie Agent Gateway** from the provider templates.
5. Enter the following credentials:

| Field | Value |
|---|---|
| Provider | Alfie Agent Gateway |
| URL | `https://alfie.lawglitch.workers.dev` |
| Username | Your registered email address |
| Password | Your generated one-time password |

Make the gateway URL clickable and provide a copy button.

Display the URL in a highlighted code-style element.

### Usage & Credits

Display a usage section below the credentials.

Show:

- Credits available: `credits_remaining`
- Credits used: `credits_used`
- Total allocated credits: `credits_remaining + credits_used`

Present the usage visually through a simple progress bar.

Calculate:

`Usage percentage = credits_used / (credits_remaining + credits_used) × 100`

Handle a zero-credit allocation without division errors.

When the user's available credits reach zero:

Display:

> You've reached your current usage limit. Contact us to upgrade your plan or request additional credits.

Contact: `lawglitch@outlook.com`

Make the email clickable.

### Account Status Handling

If the account is not active, restrict gateway access and display:

> Your account doesn't appear to be active yet. Please contact us at lawglitch@outlook.com to learn more about activation.

Do not expose gateway credentials or allow gateway requests from inactive accounts.

---

# 3. Simplified Backend Architecture

Keep the backend intentionally minimal.

**Required infrastructure:**

- 1 Supabase table: `profiles`
- 2 Supabase Edge Functions.
- 1 Cloudflare Worker.
- Existing n8n workflow for agent execution, credit consumption and usage management.

Do not introduce additional tables, RPC functions or a separate credit-management system.

## 3.1 Supabase Database

Use the following single-table structure:

```sql
create table public.profiles (
  id uuid not null,
  email text not null,
  display_name text null,

  terms_accepted boolean not null default false,
  terms_accepted_at timestamp with time zone null,

  user_verified boolean not null default false,
  account_active boolean not null default false,

  plan text not null default 'unverified',

  credits_remaining integer not null default 0,
  credits_used integer not null default 0,

  gateway_key_hash text null,
  gateway_key_active boolean not null default false,

  created_at timestamp with time zone not null default now(),
  last_used_at timestamp with time zone null,

  constraint profiles_pkey primary key (id),

  constraint profiles_id_fkey
    foreign key (id)
    references auth.users (id)
    on delete cascade,

  constraint profiles_credits_remaining_check
    check (credits_remaining >= 0),

  constraint profiles_credits_used_check
    check (credits_used >= 0),

  constraint profiles_plan_check
    check (
      plan = any (
        array[
          'unverified',
          'beta',
          'pro',
          'suspended'
        ]::text[]
      )
    )
);

create index if not exists idx_profiles_email
on public.profiles using btree (email);

create index if not exists idx_profiles_gateway_key
on public.profiles using btree (gateway_key_hash)
where gateway_key_active = true;
```

Important:

- Keep `account_active` in this same table.
- Do not create another profile or subscription table.
- Enable appropriate Row Level Security.
- Users must only be able to read their own permitted profile information.
- Never allow users to directly modify credits, plan, verification or gateway credential fields.
- Administrative updates should be performed through trusted server-side operations.

## 3.2 Edge Function 1 — Authentication & Profile Creation

One Edge Function responsible for account initialization and profile management.

Responsibilities:

1. Receive the authenticated user's Supabase identity.
2. Validate the identity using Supabase Auth.
3. Create a profile if one does not exist.
4. Prevent duplicate profiles.
5. Return the authenticated user's permitted profile information.

OAuth login itself should use Supabase Auth's native Google and GitHub providers.

Do not build a second authentication system unnecessarily.

## 3.3 Edge Function 2 — Gateway Credential Management

One Edge Function handling credential generation and deletion.

Supported operations:

**Generate / Replace**

- Generate a cryptographically secure random token.
- Hash the token using SHA-256.
- Store the hash in `gateway_key_hash`.
- Set `gateway_key_active = true`.
- Return the raw token only once to the authenticated user.

**Delete / Revoke**

- Set `gateway_key_active = false`.
- Clear `gateway_key_hash`.
- Invalidate the previous credential immediately.

Require authenticated ownership verification for both operations.

The Edge Function must never return stored hashes as user credentials.

---

# 4. Cloudflare Worker — Alfie Agent Gateway

Deploy the Cloudflare Worker through the Cloudflare web dashboard.

Endpoint:

`https://alfie.lawglitch.workers.dev`

Its purpose is to act as a lightweight, authenticated HTTP gateway between the Alfie extension and the existing n8n agent workflow.

Do not move credit calculations, agent instructions or rate-limiting logic into the Worker.

Those responsibilities already belong to the n8n agent workflow.

## 4.1 Request Flow

1. Receive incoming HTTP requests from Alfie.
2. Accept POST requests for the gateway endpoint.
3. Read the HTTP Basic Authorization header.
4. Decode the Base64 credentials to obtain username and raw password.
5. Retrieve the corresponding profile from Supabase.
6. Check that the account is active and the gateway credential has not been revoked.
7. Hash the submitted raw password using SHA-256.
8. Compare the resulting hash against `gateway_key_hash`.
9. Reject unauthorized or inactive accounts.
10. Forward the original HTTP request to the configured n8n webhook.
11. Wait for n8n to finish processing.
12. Return n8n's response to the original caller.

## 4.2 Request Preservation

The Worker must not modify the request payload.

Preserve:

- HTTP method.
- Request body.
- Content type.
- Relevant headers.
- Original request data.

Only handle the authentication and routing required by the gateway.

Avoid forwarding the original Authorization header to n8n unless explicitly required.

## 4.3 Caching

Use Cloudflare caching for profile and credential validation where appropriate.

Cache authenticated credential information to reduce unnecessary Supabase lookups.

However:

- Keep the cache short-lived.
- Ensure credential deletion and revocation take effect promptly.
- Never allow cached authorization to bypass account suspension or credential revocation indefinitely.

## 4.4 Environment Secrets

Store the following securely as Cloudflare Worker environment secrets:

- Supabase URL.
- Supabase server-side credentials.
- n8n webhook URL.
- Any additional required private configuration.

Never expose these credentials in the frontend or browser extension.

## 4.5 Error Handling

Return appropriate HTTP responses:

- `400`: Invalid request.
- `401`: Invalid or missing credentials.
- `403`: Account inactive or suspended.
- `405`: Unsupported HTTP method.
- `502`: Upstream n8n failure.
- `500`: Internal gateway error.

Use HTTPS throughout.

Remember that Base64 is encoding, not encryption. The security of Basic Authentication depends on HTTPS and proper token handling.

---

# 5. Installation System

Make installation significantly easier by introducing a consistent installation experience.

## 5.1 Install Buttons

Add a prominent **Install Alfie** button to:

- Homepage hero section.
- Product page hero section.
- Relevant product information sections.
- Final homepage CTA.

Use consistent styling and behavior throughout the website.

## 5.2 Installation Popup

Clicking Install Alfie should open a responsive modal.

The modal should display available browser installation options using Font Awesome Brands icons where available.

Initially support:

- Google Chrome.
- Microsoft Edge.
- Other Chromium-based browsers listed in the installation configuration JSON.

For Chrome and Edge, include placeholder icon references in the JSON until the final icon assets are supplied.

Each browser option should have:

- Browser name.
- Browser icon.
- Installation URL.
- Availability status.

## 5.3 JSON-Driven Browser Configuration

Use one JSON configuration to manage available browser installations.

Example:

```json
{
  "browsers": [
    {
      "name": "Google Chrome",
      "icon": "/icons/chrome.svg",
      "url": "",
      "available": false
    },
    {
      "name": "Microsoft Edge",
      "icon": "/icons/edge.svg",
      "url": "",
      "available": false
    },
    {
      "name": "Brave",
      "icon": "",
      "url": "",
      "available": false
    }
  ]
}
```

Behavior:

- If a valid installation URL exists, make the option clickable.
- If the URL is empty, display **Coming Soon**.
- Coming Soon options must appear greyed out and disabled.
- Do not redirect users to empty or invalid URLs.

## 5.4 Developer Installation Alternative

Under the browser installation options, display:

> Using another Chromium-based browser? You can also install Alfie manually through Developer Mode.

Include a clickable **Click here** link.

This link should open the existing installation walkthrough or relevant developer installation instructions.

The popup must work properly on desktop and mobile.

---

# 6. Website Marketing & Positioning

Review and improve the wording throughout the existing website.

The objective is to make the product immediately understandable, communicate its actual benefits and encourage installation.

Avoid excessive technical terminology in the primary marketing copy.

Use technical explanations in dedicated sections for visitors who want to understand how Alfie works.

## 6.1 Brand Positioning

**LawGlitch**

An independent technology studio building practical AI agents, browser automation and custom integrations.

**Alfie**

An AI-powered browser assistant designed to turn natural-language instructions into visible, step-by-step browser actions.

**Custom Development**

Tailored AI agents, API integrations, automation workflows and intelligent systems built around individual business requirements.

## 6.2 Suggested Homepage Hero

Eyebrow:

A LAWGLITCH PRODUCT · AI-POWERED BROWSER AUTOMATION

Main heading:

**Stop doing the busywork. Let your browser do it.**

Supporting text:

Alfie turns everyday instructions into clear, step-by-step browser actions. Navigate websites, interact with forms and automate repetitive tasks with a faster, more controlled browsing experience.

Primary CTA:

**Get Alfie Free**

Secondary CTA:

**Explore What Alfie Can Do**

Additional CTA:

**Build Something Custom?**

Link the additional CTA to:

https://lawglitch.pages.dev/contact

## 6.3 Suggested Homepage Sections

Organize the homepage around the following content structure:

1. Hero — Immediate product value and installation CTA.
2. Browser Compatibility — Supported browsers and installation.
3. The Problem — Repetitive browsing and manual workflows.
4. The Solution — How Alfie simplifies browser interaction.
5. Features — Keyboard control, natural-language instructions, voice, skills and safety confirmation.
6. How It Works — A simple three-step demonstration.
7. Architecture — Local execution, privacy and token efficiency, with technically accurate explanations.
8. Use Cases — Research, data entry, repetitive workflows and business operations.
9. Pricing & Licensing — Personal and commercial usage.
10. Custom Integrations — Introduce LawGlitch's development services.
11. FAQ — Answer installation, compatibility, privacy and usage questions.
12. Final CTA — Install Alfie or contact LawGlitch.

Keep the existing product demonstrations and working interactive elements wherever possible.

Do not remove existing features simply to shorten the homepage.

## 6.4 Product Page

Create a dedicated product page for Alfie.

It should provide more detailed information than the homepage, including:

- What Alfie does.
- Key features.
- How it works.
- Supported browsers.
- Installation instructions.
- Privacy and architecture.
- Licensing and pricing.
- Frequently asked questions.
- Installation CTA.

The homepage should sell the idea.

The product page should explain the product and convert interested visitors.

## 6.5 Custom Development CTA

Introduce a consistent but unobtrusive CTA throughout relevant website sections.

Suggested wording:

**Need something beyond Alfie?**

We build custom AI agents, integrations and automation systems designed around your workflow.

**Explore Custom Solutions →**

Link:

https://lawglitch.pages.dev/contact

The CTA should be visible without interrupting the main Alfie installation journey.

---

# 7. SEO Management System

Create a dedicated, editable SEO configuration system.

The objective is to make SEO improvements possible without manually editing metadata in multiple application components.

Use JSON-driven metadata wherever practical.

## 7.1 SEO Configuration

Create a centralized configuration file, for example:

`/content/seo.json`

Suggested structure:

```json
{
  "site": {
    "name": "LawGlitch",
    "url": "https://lawglitch.pages.dev",
    "defaultTitle": "LawGlitch | AI Agents, Automation & Custom Integrations",
    "defaultDescription": "Explore Alfie, an AI-powered browser assistant, and discover custom AI agents, integrations and automation solutions by LawGlitch.",
    "defaultImage": "/images/og-default.png",
    "twitterHandle": ""
  },
  "pages": {
    "home": {
      "path": "/",
      "title": "LawGlitch | AI Agents & Browser Automation",
      "description": "Discover Alfie, an AI-powered browser assistant, and explore custom AI agents and automation solutions.",
      "keywords": [
        "AI browser automation",
        "browser assistant",
        "AI agents",
        "workflow automation",
        "custom AI integrations"
      ],
      "index": true
    },
    "alfie": {
      "path": "/products/alfie",
      "title": "Alfie | AI-Powered Browser Automation Assistant",
      "description": "Automate repetitive browser tasks with Alfie. Give natural-language instructions and execute visible, step-by-step browser actions.",
      "keywords": [
        "AI browser assistant",
        "browser automation extension",
        "AI web automation",
        "Chromium browser automation"
      ],
      "index": true
    },
    "contact": {
      "path": "/contact",
      "title": "Contact LawGlitch | Custom AI Agents & Integrations",
      "description": "Discuss custom AI agents, business automation, API integrations and tailored software solutions with LawGlitch.",
      "index": true
    }
  }
}
```

Treat this as an initial example, not a permanent keyword list.

Each page should have its own relevant metadata.

## 7.2 Metadata Implementation

Automatically generate the following for every indexable page:

- Unique page title.
- Meta description.
- Canonical URL.
- Open Graph title.
- Open Graph description.
- Open Graph image.
- Twitter/X card metadata.
- Appropriate robots directives.

Ensure metadata is rendered in the initial HTML response and is accessible to search engines.

Avoid relying exclusively on client-side JavaScript to insert SEO metadata after the page loads.

## 7.3 Technical SEO

Implement:

- XML sitemap.
- robots.txt.
- Canonical URLs.
- Clean, descriptive URLs.
- Correct heading hierarchy.
- Image alt text.
- Internal linking.
- Mobile responsiveness.
- Fast page loading.
- Proper 404 handling.
- Structured data where appropriate.

Use relevant Schema.org markup:

- Organization.
- SoftwareApplication.
- Product, where appropriate.
- Article.
- BreadcrumbList.
- FAQPage only where eligible and supported by the actual page content.

Avoid adding misleading structured data or fake reviews and ratings.

---

# 8. Dedicated Blog & Organic Growth System

Create a dedicated blog section.

Suggested URL:

`/blog`

The blog should be an independent content section with its own index page, categories, article pages and SEO metadata.

Its purpose is to attract organic search traffic through useful educational articles related to browser automation, AI agents, productivity, integrations and workflow automation.

## 8.1 Blog Structure

Create:

- Blog homepage.
- Individual article pages.
- Category pages.
- Related articles section.
- Search or filtering functionality.
- Featured articles section.

Suggested initial categories:

1. AI & Automation.
2. Browser Automation.
3. AI Agents.
4. Productivity & Workflows.
5. Integrations & APIs.
6. Tutorials & Guides.
7. LawGlitch Updates.

## 8.2 Content Management

Start with a lightweight content-driven architecture.

Use Markdown files for articles and JSON for metadata or category configuration.

Suggested structure:

```text
/content
  /seo
    seo.json
  /blog
    /articles
      introduction-to-browser-automation.md
      how-ai-agents-work.md
      automating-repetitive-browser-tasks.md
    categories.json
```

Each article should support:

- Title.
- Slug.
- Short description.
- Main content.
- Author.
- Publication date.
- Last updated date.
- Category.
- Tags.
- Featured image.
- Image alt text.
- SEO title.
- SEO description.
- Canonical URL.
- Indexing status.

Example article metadata:

```yaml
---
title: "What Is Browser Automation and How Does It Work?"
slug: "what-is-browser-automation"
description: "Learn how browser automation works, where it is useful and how AI is changing the way people interact with websites."
author: "LawGlitch"
published: "2026-11-25"
updated: "2026-11-25"
category: "Browser Automation"
tags:
  - Browser Automation
  - AI
  - Productivity
featuredImage: "/images/blog/browser-automation.png"
imageAlt: "Illustration of automated browser interactions"
seoTitle: "What Is Browser Automation? A Practical Guide"
seoDescription: "Understand browser automation, common use cases and how AI-powered tools can simplify repetitive website tasks."
canonical: ""
index: true
---
```

Use static generation or prerendering for article pages wherever possible.

## 8.3 SEO Content Strategy

Build topical authority rather than publishing random articles for keyword volume.

Initial content clusters:

**Cluster 1 — Browser Automation**

- What Is Browser Automation?
- How to Automate Repetitive Browser Tasks.
- Browser Automation vs Traditional RPA.
- How AI Is Changing Browser Automation.
- Best Uses of Browser Automation for Everyday Work.

**Cluster 2 — AI Agents**

- What Are AI Agents?
- How AI Agents Work.
- AI Agents vs Traditional Chatbots.
- How to Build an AI Agent for Business Workflows.
- How AI Agents Interact with External Tools.

**Cluster 3 — Productivity**

- How to Reduce Repetitive Computer Work.
- Automating Online Forms and Data Entry.
- Improving Productivity with Browser Shortcuts.
- How to Simplify Multi-Step Web Workflows.

**Cluster 4 — Integrations**

- What Is an API Integration?
- How AI Agents Connect to External Services.
- How to Connect Browser Automation to n8n.
- Building Custom AI Automation Workflows.

Articles should be genuinely useful, technically accurate and independently valuable.

Naturally introduce Alfie where relevant, rather than turning every article into a product advertisement.

Link relevant articles to the Alfie product page and custom development contact page.

## 8.4 Blog SEO Requirements

Every article must have:

- A unique title.
- A descriptive URL slug.
- A unique meta description.
- One clear H1.
- Logical H2 and H3 headings.
- Relevant internal links.
- Descriptive image alt text.
- Article structured data.
- Canonical URL.
- Social sharing metadata.

Include publication and modification dates where appropriate.

Do not generate duplicate or thin category pages.

---

# 9. Visual & Technical Quality Requirements

Maintain the existing LawGlitch visual identity while improving clarity and consistency.

### Design

- Modern, clean and professional.
- Consistent typography and spacing.
- Responsive layouts.
- Clear CTA hierarchy.
- Subtle transitions and animations.
- Accessible contrast.
- Consistent buttons, modals and cards.

### Performance

- Avoid unnecessary libraries.
- Optimize images.
- Lazy-load below-the-fold imagery.
- Avoid blocking scripts.
- Keep the dashboard lightweight.
- Prioritize mobile performance.

### Accessibility

- Keyboard-accessible navigation.
- Accessible modals.
- Proper labels for inputs.
- Visible focus indicators.
- Appropriate semantic HTML.
- Accessible error and success messages.

---

# 10. Final Implementation Checklist

### Dashboard & Authentication

- [ ] Dashboard button in navigation.
- [ ] Google OAuth.
- [ ] GitHub OAuth.
- [ ] Automatic profile creation.
- [ ] Duplicate profile protection.
- [ ] Account information display.
- [ ] One-time gateway password generation.
- [ ] Password copy functionality.
- [ ] Credential revocation.
- [ ] Gateway setup instructions.
- [ ] Credit usage display.
- [ ] Account activation handling.

### Backend

- [ ] Exactly one `profiles` table.
- [ ] Exactly two Edge Functions.
- [ ] Existing Supabase Auth integration.
- [ ] Cloudflare Worker deployed.
- [ ] Basic Authentication validation.
- [ ] SHA-256 credential verification.
- [ ] Credential revocation support.
- [ ] n8n webhook forwarding.
- [ ] Proper error handling.
- [ ] No unnecessary RPC functions or additional database tables.

### Installation

- [ ] Homepage Install button.
- [ ] Product page Install button.
- [ ] Browser selection modal.
- [ ] JSON-driven browser configuration.
- [ ] Chrome and Edge placeholder icons.
- [ ] Coming Soon state for unavailable browsers.
- [ ] Developer Mode installation alternative.

### Marketing

- [ ] Improved homepage hero.
- [ ] Clearer product positioning.
- [ ] Dedicated Alfie product page.
- [ ] Clear feature descriptions.
- [ ] Better use-case presentation.
- [ ] Custom development CTA.
- [ ] Consistent installation CTAs.
- [ ] Updated FAQ.

### SEO & Blog

- [ ] Centralized SEO configuration.
- [ ] Unique metadata for every page.
- [ ] Canonical URLs.
- [ ] XML sitemap.
- [ ] robots.txt.
- [ ] Structured data.
- [ ] Dedicated blog homepage.
- [ ] Individual article pages.
- [ ] Category system.
- [ ] Markdown-based content management.
- [ ] Article-level SEO metadata.
- [ ] Internal linking.
- [ ] Search Console readiness.

---

# 11. Implementation Priority

Work in the following order to avoid unnecessary rework.

**Phase 1 — Core Product & Conversion**
1. Update homepage positioning and copy.
2. Improve navigation.
3. Add installation popup.
4. Improve product page.
5. Add custom development CTAs.

**Phase 2 — Dashboard & Gateway**
1. Create the single Supabase profile table.
2. Implement authentication and profile creation.
3. Implement credential generation and revocation.
4. Deploy and test Cloudflare Worker.
5. Build dashboard UI.
6. Test the complete extension-to-n8n request flow.

**Phase 3 — SEO Foundation**
1. Implement centralized SEO configuration.
2. Implement page-level metadata.
3. Generate sitemap and robots.txt.
4. Add structured data.
5. Verify indexing and rendering.

**Phase 4 — Blog & Organic Growth**
1. Create blog architecture.
2. Implement Markdown-based articles.
3. Create category pages.
4. Implement article-level SEO.
5. Publish the initial content clusters.
6. Establish an ongoing publishing and updating process.

## Final Instructions

Keep the project simple, modular and maintainable.

Do not unnecessarily rebuild working components or introduce additional backend infrastructure.

Preserve existing Alfie functionality and the current website's design language.

Prioritize actual user conversion, a frictionless installation experience, secure credential handling and long-term organic search visibility.

The final result should make LawGlitch look and function like a credible technology studio with a real product, not simply a landing page for a browser extension.