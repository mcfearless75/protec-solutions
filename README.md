# ProTec Solutions — protec-solutions.co.uk

Multi-page static site for ProTec Solutions: official UK distribution for Goldshield
antimicrobial protection, bespoke web and mobile application development, and the care
home software ProTec builds and runs (CareOps, CareRota, DOBS).

**Live:** hosted on GitHub Pages from the `main` branch, root directory.
No build step — every file is served exactly as committed.

## What's on it

| Page | Interactive tools |
|------|-------------------|
| `index.html` | Hero particle field, animated stats, dual proposition |
| `goldshield.html` | 30-day protection simulator (canvas chart), 4-question product advisor |
| `apps.html` | Live app scoper (timeline + phases; no prices shown), tech stack picker, feature prioritiser with impact/effort quadrant |
| `ai-lab.html` | AI readiness score, copy generator, ROI modeller |
| `sectors.html` | Sector matcher across 8 verticals |
| `contact.html` | Smart enquiry form (posts to Formspree, mailto fallback if unreachable) |
| `ai-telephone.html` | AI telephone answering: Traknet, Truth Care and PRL builds, client quote, FAQ with matching `FAQPage` JSON-LD |
| `care.html` | Care software hub: product cards (from `KB.careProducts`), by-role, FAQ with matching `FAQPage` JSON-LD |
| `careops.html` | CareOps product page, `SoftwareApplication` + breadcrumb JSON-LD |
| `carerota.html` | CareRota product page, cover cascade diagram |
| `ai-information.html` | Plain facts and boundaries for AI assistants (linked from footer, cited by the Ask AI block) |
| `privacy.html` | Privacy notice for the enquiry form and the assistant |

**Site-wide:** ProTec AI assistant (intent matching over `js/knowledge.js`, voice input
via Web Speech API), Ctrl+K command palette with fuzzy search across pages, tools,
products and sectors. Everything runs client-side. No API keys, no backend, nothing to leak.

## Structure

```
index.html … privacy.html   twelve pages + 404.html
css/style.css               design system (brand tokens at the top of :root)
js/knowledge.js             single source of truth: products, sectors, FAQ
js/site.js                  header, reveals, canvas, palette, AI assistant
js/tools.js                 all 10 interactive tools
assets/                     brand logos
CNAME                       www.protec-solutions.co.uk
```

To change prices, products, sectors or assistant answers, edit `js/knowledge.js` — every
tool, the care product cards and the keyword assistant read from it.

**There are two knowledge files.** The live assistant (Claude via the proxy in
`serverless/`) reads `serverless/lib/knowledge-data.js`, a price-stripped copy. Any
knowledge change must be made in both files and the proxy redeployed, or the live
assistant will not know about it. Care-software wording must follow the claims rules
in `docs/CARE-UPDATE.md` section 4.

## Custom domain — DNS to set at your registrar

The repo's `CNAME` file already declares `www.protec-solutions.co.uk`. For the domain
to resolve, add these records where the domain's DNS is managed:

| Type | Host | Value |
|------|------|-------|
| CNAME | `www` | `mcfearless75.github.io` |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Then in the repo: **Settings → Pages → Enforce HTTPS** (tick it once the certificate
is issued, usually within an hour of DNS propagating).

Until DNS is live, the site is reachable at
`https://mcfearless75.github.io/protec-solutions/` (note: this URL redirects to the
custom domain once the CNAME file is active, so set the DNS records promptly).

## Deploying changes

```bash
git add -A && git commit -m "update" && git push
```

Pages redeploys automatically in under a minute. Bump the `?v=` query strings on the
CSS/JS links when changing those files so returning visitors get the fresh assets.

## Placeholders to replace before going live

- No phone number is published (removed Oct 2026). If one is added, put it in the
  footers, `contact.html`, both knowledge files, `llms.txt` and the JSON-LD in `index.html`
- Confirm `hello@protec-solutions.co.uk` is a live mailbox
- `pricePerLitre` in `js/knowledge.js` is unverified and used only internally, to rank
  products against each other when the Product Advisor's "lowest running cost" option
  is picked — it is never shown to a visitor. No cost or price figure is displayed
  anywhere on the site; protection pricing is quote-only via the contact form.
  Coverage (m²/L) and duration (days) figures ARE shown and are confirmed real data.
