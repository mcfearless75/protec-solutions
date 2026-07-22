# ProTec Solutions — protec-solutions.co.uk

Multi-page static site for ProTec Solutions: official UK distribution for Goldshield
antimicrobial protection, plus bespoke web and mobile application development.

**Live:** hosted on GitHub Pages from the `main` branch, root directory.
No build step — every file is served exactly as committed.

## What's on it

| Page | Interactive tools |
|------|-------------------|
| `index.html` | Hero particle field, animated stats, dual proposition |
| `goldshield.html` | 30-day protection simulator (canvas chart), coverage & cost calculator, 4-question product advisor |
| `apps.html` | Live app scoper (cost + timeline + phases), tech stack picker, feature prioritiser with impact/effort quadrant |
| `ai-lab.html` | AI readiness score, copy generator, ROI modeller |
| `sectors.html` | Sector matcher across 8 verticals |
| `contact.html` | Smart enquiry form (mailto — no backend needed) |

**Site-wide:** ProTec AI assistant (intent matching over `js/knowledge.js`, voice input
via Web Speech API), Ctrl+K command palette with fuzzy search across pages, tools,
products and sectors. Everything runs client-side. No API keys, no backend, nothing to leak.

## Structure

```
index.html … contact.html   six pages + 404.html
css/style.css               design system (brand tokens at the top of :root)
js/knowledge.js             single source of truth: products, pricing, sectors, FAQ
js/site.js                  header, reveals, canvas, palette, AI assistant
js/tools.js                 all 11 interactive tools
assets/                     brand logos
CNAME                       www.protec-solutions.co.uk
```

To change prices, products, sectors or assistant answers, edit `js/knowledge.js` only —
every tool and the assistant read from it.

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

- Phone number `+44 (0)1234 567 890` (in page footers and `js/knowledge.js`)
- Confirm `hello@protec-solutions.co.uk` is a live mailbox
- Product pricing/coverage figures in `js/knowledge.js` against the actual Goldshield price list
