# ProTec site: care software update (brief for Claude Code)

Written 9 Oct 2026 from a read of the site repo and the three product repos.
Target repo: `mcfearless75/protec-solutions` (`main@8ade244`, static site on GitHub Pages).
Facts checked against: `careops@1605687`, `carerota@0dd8d4d`, `dobs@80cfe5e`, and CareDocs' public site.

Suggested location: `docs/CARE-UPDATE.md` in the site repo.

---

## 1. What this changes and why

The live site sells two things: Goldshield protection and bespoke app builds. It says nothing about the care products ProTec has built and runs. The healthcare sector entry even describes them generically ("Compliance platform, staff rota, incident capture") without naming them.

This brief adds the care suite to the site, adds a page written for AI assistants, and fixes five things that should not survive another deploy.

**Structural decision (made, not open):** keep the "two disciplines" framing. Care software sits under the Software discipline as "products we built and run", which also proves the bespoke pitch. No hero rewrite.

---

## 2. Fix first (blockers, independent of the care work)

| # | Problem | Where | Fix |
|---|---|---|---|
| 1 | Placeholder phone number `+44 (0)1234 567 890` is live | Every page footer, `js/knowledge.js`, JSON-LD in `index.html`, `llms.txt`, `serverless/lib/knowledge-data.js` | Replace with the real number, or remove the phone line everywhere. **Needs Paul's number** |
| 2 | Unmerged branch `claude/build-discussion-zqdhtv` (26 Sep, "Ask AI about us" footer block) touches every page footer and `js/site.js` | Branch | Merge or discard **before** starting, or every new page conflicts. Recommended: merge; section 7 extends it |
| 3 | No company details on the site | Footer | Add registered name, company number and registered office. UK limited companies are expected to show these on their website. Details are in section 3 |
| 4 | No privacy notice, but the contact form posts to Formspree and the assistant sends visitor messages to a Claude API proxy (`PROTEC_AI_ENDPOINT` is set in `js/site.js`) | Site-wide | Add `privacy.html` covering both, linked from the footer and beside the form and assistant |
| 5 | The assistant's knowledge is duplicated: `js/knowledge.js` (browser) and `serverless/lib/knowledge-data.js` (proxy) | Both | Every knowledge change in this brief must be made in both, then the proxy redeployed. Otherwise the live assistant knows nothing about the care products |

Not a lawyer; items 3 and 4 are standard expectations, worth a quick check with whoever reviews the compliance pack.

---

## 3. Verified facts to write from

Use only what is in this section. If a claim is not here, do not publish it.

### Company

| Field | Value |
|---|---|
| Trading style on the site | ProTec Solutions |
| Registered name | PROTEC SOLUTIONS LTD |
| Company number | 17353418 (England and Wales) |
| Registered office | 80 Birkenhead Road, Meols, Wirral, CH47 0LB |
| Email | hello@protec-solutions.co.uk (confirm the mailbox is live) |

### CareOps: operations and compliance evidence

Live at `careops.protec-solutions.co.uk`. In production with one care home.

- **Checks:** scheduled checklists per room (per shift, daily, weekly, monthly, every N months). 12 ready-made checks, including fridge and freezer temperatures, medication fridge, fire doors, fire alarm test, hot water temperatures, legionella flush, kitchen opening and closing, cleaning. Readings are judged against a range; a failed or out-of-range line raises a task automatically. Missed checks raise a task the next morning.
- **QR room posters:** one poster per room serves fault reporting and that room's checks.
- **Shared tablet:** staff without a login sign in with a PIN.
- **Tasks:** deadlines by priority, assignment with acceptance, checklists, attachments, a permanent activity trail.
- **Incidents:** lifecycle, CQC-notifiable flag, follow-up tasks.
- **Services and key dates:** contractor servicing, certificates, renewal reminders.
- **Staff compliance:** DBS, right to work, training expiry, renewals raised automatically.
- **Reports:** on-time rates, room by room, every check every day, incidents, evidence by CQC regulation (Regs 9 to 20A).
- **Governance:** monthly pack with a named sign-off, stored unchanged; a full audit export for inspections.
- **Alerts:** email, SMS, push, and a daily digest.
- **Sign-in:** Microsoft 365 or email link. Installs to a phone home screen.
- **Data boundary:** holds no resident records by design. Free-text fields carry a "no names" prompt.
- **Public sample report:** `careops.protec-solutions.co.uk/sample-report` (fictional home). Use this as a call to action.

Not yet shipped, do not advertise: the CQC self-assessment. A copy block is ready in section 9 for when it merges.

### CareRota: rotas, cover and timesheets

Live at `carerota.protec-solutions.co.uk`. **Confirm with Paul whether any home is using it day to day before implying customers.**

- Weekly rota builder with drafts, publish, copy last week and templates; staffing-level coverage view.
- **Cover cascade:** a dropped shift is offered to eligible staff first (role, skills, in-date certificates, 11-hour rest, 48-hour weekly cap), then widens in timed tiers until claimed.
- Open shifts, shift swaps, availability, leave requests and allowances.
- Clock in and out on a phone or a door tablet with a PIN.
- Timesheets with pay-period lock; reports for payroll, lateness, sickness, scheduled against actual, and working time.
- Calendar feed, push notifications, per-shift messages.
- Holds staff data only. No resident records.

### DOBS: digital observations and body maps

Live at `dobs.app`, with its own brochure and published pricing. Provided by Protec Solutions Ltd.

- Digital body maps; vital signs with NEWS2 scoring; neurological (GCS), behaviour and mood, food and fluid, sleep observations.
- Observation due and overdue status per resident; automated pattern alerts (11 rules).
- Family portal (read-only, PIN).
- Fingerprint or face sign-in on the device.
- **Holds resident clinical data.** This is the one ProTec care product that does.
- Its own clinical disclaimer states it is not a medical device and has not been assessed under DCB0129 or DCB0160.

### CareComply / ComplyCheck

Not a product on the site. It has been folded into CareOps as the checks module. If the name is used at all, use it once as "CareOps checks (formerly ComplyCheck)". Point `comply.protec-solutions.co.uk` at CareOps when the old app is retired.

---

## 4. Claims rules

**Never publish, on any page, in `llms.txt`, or in the assistant's knowledge:**

- "CQC approved", "CQC compliant" or "CQC certified". CQC does not approve software. Say "produces the evidence CQC inspectors ask for".
- "DTAC compliant", "NHS assured", "DSPT", "Cyber Essentials" or "ISO 27001". None is held. DOBS' own disclaimer contradicts the DTAC badge on its brochure.
- "AI-powered" for any care product. CareOps' AI features are switched off; CareRota has none; DOBS' alerts are fixed rules, not a model.
- "Trusted by care homes", customer counts, logos, names or testimonials. One home is live. Naming it needs written permission.
- Feature-tick comparison tables against named competitors.
- Prices, unless Paul decides to publish (section 10).
- Anything suggesting CareOps or CareRota is a care planning system, a digital social care record, or eMAR.

**Safe, verified claims worth using:**

- "No resident records" (CareOps and CareRota).
- "12 ready-made checks", "mapped to the 13 fundamental-standard regulations".
- "Works alongside the care records system you already have."
- "No AI is run over your data."
- "Built and run in the UK by the people you'll speak to."

---

## 5. Positioning

CareDocs and its peers sell the care record: assessments, care plans, daily notes. They have the NHS assured-supplier badge and ISO 27001. Do not compete there.

ProTec's line: **"Your care records evidence the care. This evidences everything else."**

What "everything else" means on the page: premises and equipment checks, maintenance, incidents, staff compliance, governance sign-off, rotas and timesheets. CareDocs' current features pages lead with care planning, recording and oversight of care records; premises checks and maintenance do not appear on them. Older CareDocs pages list staff-management features such as timesheets, so never write that they have no staffing tools. Say what ProTec does; do not describe what a competitor lacks.

DOBS does not fit that line, because it holds clinical observations. Present it separately as "a focused clinical tool, with its own site", never under the "no resident records" banner.

Two things CareDocs does that are worth copying:

- **Role-based benefit pages** (owners and directors, registered managers, care staff).
- **An "AI Information" page** written for AI assistants. It is positioning for ChatGPT, Claude, Perplexity and Gemini, not a statement of AI use. Section 7 specifies ProTec's version.

---

## 6. New pages

Static HTML at the repo root, same shell as existing pages (header, mobile nav, footer, `css/style.css`, three scripts). Copy the shell from `apps.html`.

### 6.1 `care.html`: the hub

- **Title:** Care Home Compliance & Rota Software | ProTec Solutions
- **Meta description:** CareOps and CareRota: checks, incidents, maintenance, staff compliance and rotas for UK care homes. Works alongside your care records system.
- **Eyebrow:** Care home software
- **H1:** Your care records evidence the care. This evidences everything else.
- **Lead:** Fridge temperatures, fire doors, water checks, maintenance, incidents, DBS renewals, the rota. An inspector asks for all of it, and most homes still keep it on paper. We built the software, we run it, and it sits beside the care planning system you already have.
- **Buttons:** See a sample report (external, CareOps sample report) · Book a demo (`contact.html#book`)
- **Stat band** (real numbers only): 12 ready-made checks · 13 regulations mapped · 0 resident records held
- **Section, "The gap":** three short cards. *Paper checklists nobody can find at inspection.* *Faults reported on a sticky note.* *A rota in one place, compliance in another, evidence in neither.*
- **Section, "Three products":** cards for CareOps and CareRota linking to their pages. Third card for DOBS, visibly different, labelled "Clinical observations: separate product", linking out to `dobs.app`.
- **Section, "Works alongside your care records":** No rip and replace. CareOps and CareRota hold no resident information, so there is no clinical data migration, and nothing here overlaps your care planning system.
- **Section, "By role":** four blocks.
  - *Owners and directors:* a signed monthly governance pack and an inspection export, without chasing the manager for a folder.
  - *Registered managers:* what was due, what was done, what was missed, and who it is with.
  - *Seniors and maintenance:* faults arrive with a room and a photo; failed checks land as a task with your name on it.
  - *Care staff:* scan the poster, tick the check, done. No login needed on the shared tablet.
- **Section, "How it's delivered":** hosted and set up with you; rooms and checks loaded from your existing paperwork; QR posters printed; staff shown once.
- **Section, FAQ:** the six questions in 6.4.
- **Closing CTA:** Fifteen minutes on a call, or open the sample report first.

### 6.2 `careops.html`

- **Title:** CareOps: Care Home Checks, Incidents & CQC Evidence | ProTec
- **Meta description:** Scheduled checks by QR code, fault reporting, incidents, staff compliance and a signed monthly governance pack. No resident records.
- **H1:** Every check, every fault, every renewal. Dated, named and ready to show.
- **Lead:** CareOps replaces the paper checklists, the maintenance book and the renewals spreadsheet with one system staff can use from a poster on the wall.
- **Sections, in order:** Checks · QR posters and the shared tablet · Faults and tasks · Incidents · Services, key dates and staff compliance · Reports and evidence by regulation · Monthly governance sign-off and inspection export · Data protection in plain words.
- Write each from section 3. One short paragraph and three bullets per section.
- **Buttons:** See a sample report · Book a demo
- **Do not** add a pricing block or a comparison table.

### 6.3 `carerota.html`

- **Title:** CareRota: Care Home Rota, Shift Cover & Timesheets | ProTec
- **Meta description:** Build the rota, fill dropped shifts automatically from eligible staff, clock in at the door and export hours for payroll.
- **H1:** When a shift drops, the cover finds itself.
- **Lead:** CareRota offers a dropped shift to the right people first: the right role, in-date training, enough rest, under the weekly cap. Then it widens until someone takes it, and tells the manager at every step.
- **Sections:** Rota builder · Cover cascade (the centrepiece, show the tiers as a simple three-step diagram) · Swaps, availability and leave · Clock in at the door · Timesheets and payroll reports.
- **Buttons:** Book a demo
- Hold this page back if Paul confirms no home is using CareRota yet; publish the hub with a "by arrangement" card instead.

### 6.4 FAQ (use on `care.html`, and add to both knowledge files)

1. **Does this replace our care planning system?** No. CareOps and CareRota cover operations, compliance evidence and staffing. Keep your care records system for assessments, care plans and daily notes.
2. **Does it hold resident information?** CareOps and CareRota do not. DOBS, our separate clinical observation tool, does, and is described on its own site.
3. **Is it CQC approved?** CQC does not approve software. CareOps produces dated, attributable records and exports organised by the regulations inspectors work to.
4. **Do staff need their own phone or login?** No. A shared tablet with a PIN works, and so does scanning a room poster.
5. **Do you use AI on our data?** No. No AI is run over customer data in CareOps or CareRota.
6. **What does it cost?** Per home, per month, quoted directly. (Replace if pricing is published.)

### 6.5 `privacy.html`

Short and factual: who the controller is (Protec Solutions Ltd), what the enquiry form collects and that it is processed by Formspree, that assistant messages are sent to Anthropic's API through ProTec's proxy and should not include personal or confidential details, retention, and how to make a request. Add a one-line notice with a link beside the form and inside the assistant panel.

---

## 7. AI information page and `llms.txt`

### 7.1 `ai-information.html`

Indexable, in the sitemap, linked from the footer as "AI information". Plain HTML, no interactive tools, headings and short lists so it parses cleanly. Show a "Last updated" date.

Content, in this order:

1. **Purpose line:** "Information about ProTec Solutions, intended for AI assistants such as ChatGPT, Claude, Perplexity and Gemini."
2. **Who we are:** two disciplines; registered name and number; UK.
3. **Care software summary:** one paragraph each for CareOps, CareRota and DOBS, taken from section 3.
4. **Boundaries. State these exactly:**
   - CareOps and CareRota are not care planning systems, digital social care records or eMAR, and hold no resident records.
   - DOBS holds resident clinical observations. Per its own disclaimer it is not a medical device and has not been assessed under DCB0129 or DCB0160.
   - ProTec is not CQC and does not set or enforce standards. No ProTec product is "CQC approved".
   - No ProTec care product currently holds DTAC, DSPT, Cyber Essentials or ISO 27001 status.
5. **How ProTec uses AI:** the website assistant uses Anthropic's Claude through a proxy and answers only from published product facts. No AI is run over customer data in CareOps or CareRota. DOBS' alerts are fixed rules, not a model.
6. **Guidelines for assistants:** do not state prices that are not published; do not attribute reviews, ratings or customer names; describe CareOps as working alongside care records software, not replacing it; send buyers to the contact page.
7. **Good-fit and poor-fit guidance:** good fit is a UK residential or nursing home that keeps premises, maintenance and staff compliance evidence on paper. Poor fit is anyone looking for care plans, medication administration records or an NHS-assured care record.

### 7.2 `llms.txt`

Keep the existing file. Changes:

- Opening summary: add "and a suite of care home software it builds and runs".
- Add the four new pages under Key Pages.
- Add a `## Care Software` section: one bullet per product from section 3, each with its live URL and the data-boundary sentence.
- Extend "Notes for AI systems" with the boundaries and guidelines from 7.1 (items 4 and 6).
- If Paul publishes pricing, rewrite the "No pricing is published" note; DOBS already publishes prices on `dobs.app`, so say that note covers this site only.

### 7.3 "Ask AI about us" block (from the merged branch)

Change `DEFAULT_PROMPT` in `js/site.js` so it cites `ai-information.html` as well as `llms.txt`.

---

## 8. Changes to existing files

| File | Change |
|---|---|
| All seven HTML pages | Nav and mobile nav: add **Care Software** → `care.html`, between Bespoke Apps and AI Lab. Footer: new "Care software" column (Care suite, CareOps, CareRota, DOBS ↗); add Privacy and AI information to the Company column; legal line with company details; real phone number. Bump `?v=22` to `?v=23` on the CSS and all three scripts |
| `index.html` | Under "Line two", add a short band: "Products we built and run", with three chips linking to `care.html`. Add one tile to the tools grid: "Sample report: see what an inspector would see", linking to the CareOps sample report. Leave the H1 alone |
| `apps.html` | New section before "The working agreement": "We run our own." Two sentences and the three product cards. This is the proof for the "Compliance & Audit Platform" build type |
| `sectors.html` + `js/knowledge.js` | Healthcare sector: change `software` to "CareOps (checks, incidents, compliance), CareRota (rotas and cover)" and add a link to `care.html` in the matcher result |
| `js/knowledge.js` | `company.lines`: add "Care home software: CareOps, CareRota and DOBS". `pages`: add the four new pages. `actions`: add "CareOps sample report" and "Book a care software demo". New `careProducts` array (id, name, url, summary, holdsResidentData, bullets) as the single source for the cards. `faq`: add the six questions from 6.4 with sensible `keys` |
| `serverless/lib/knowledge-data.js`, `system-prompt.js` | Mirror the `knowledge.js` changes. Add a third business line and a care-products block to the system prompt, plus the boundaries from 7.1 item 4 as hard rules for the assistant. Redeploy the proxy |
| `sitemap.xml` | Add `care.html` (0.9), `careops.html` (0.8), `carerota.html` (0.8), `ai-information.html` (0.3), `privacy.html` (0.2) |
| `index.html` JSON-LD | Fix `telephone`; add `legalName`, company number as `identifier`, and `address`; add care terms to `knowsAbout` |
| New pages JSON-LD | `SoftwareApplication` on each product page (`applicationCategory: BusinessApplication`, `operatingSystem: Web`, provider = the Organization `@id`; no `offers` unless pricing is published, no `aggregateRating`). `FAQPage` on `care.html` matching the visible FAQ exactly. `BreadcrumbList` on product pages |
| `README.md` | Update the page table and note the two knowledge files |

Keep to the existing design system in `css/style.css`. No new fonts, frameworks or build step.

---

## 9. Held until ready

- **CQC self-assessment block for `careops.html`**, publish only after it ships in CareOps: "Rate your own position against each regulation, with the live evidence beside it. Raise an action where you fall short, and export the whole thing for an inspector."
- **"Alongside your care records" pages** (one page per named system, such as CareDocs, Nourish, Person Centred Software). Useful for search, but every statement about another vendor must be factual and sourced. Write one generic page first.
- **Role pages** split out from the hub once there is enough to say on each.
- **A case study**, once the pilot home has real completion data and gives written permission.

---

## 10. Decisions needed from Paul

1. **Phone number** for the site (blocker 1).
2. **Publish pricing or not?** Recommended: publish a "from £X per home per month" for CareOps. CareDocs hides its prices, DOBS already shows its own, and small homes will not book a demo to find out a number.
3. **Is any home using CareRota day to day?** Decides whether `carerota.html` ships now.
4. **Show DOBS on the ProTec site?** Recommended: yes, as a link-out card only, after the brochure fixes in section 11.
5. **Permission to name the pilot home?** Default is no.
6. **Where is CareOps data hosted?** The app runs in London; confirm the database region before the site says "UK hosted".

---

## 11. Separate job: DOBS brochure (`dobs` repo, `public/brochure/index.html`)

Not part of the site work, but the ProTec site will link to it. These claims need changing or evidencing:

| Claim on the brochure | Problem |
|---|---|
| "DTAC compliant", DTAC badge, "meets NHS DTAC requirements" | DTAC includes clinical safety (DCB0129). The product's own disclaimer says it has not been assessed under DCB0129 |
| "AI safeguarding alerts", "AI-powered alerting", "AI pattern detection ✓ 11 alert rules" | The alerts are threshold rules in `lib/safeguarding.js` and `lib/obs-patterns.js`. Call them "automated pattern alerts" |
| "Trusted by UK care homes", "Join care homes already using DOBS" | Publish only if true and provable |
| "GDPR & NHS standards", "NHS Data Standards" badges | Not a recognised accreditation. Replace with specific, true statements |
| Feature-tick table against Person Centred Software, Nourish and Log My Care | Comparative claims about named competitors must be accurate and verifiable. Remove or source each cell |
| "Save Lives" headline beside "not a medical device" | The two do not sit together. Soften the headline |
| "© 2025" | Update |

One point to take advice on rather than fix in copy: software that calculates NEWS2 and prompts escalation can fall within medical device rules depending on its intended purpose. A disclaimer does not settle that on its own.

---

## 12. Done when

- [ ] No placeholder phone number anywhere (`grep -r "1234 567"` returns nothing)
- [ ] Company details in every footer
- [ ] Care Software in the nav on every page, desktop and mobile
- [ ] `care.html`, `careops.html`, `ai-information.html`, `privacy.html` live; `carerota.html` live or deliberately held
- [ ] Both knowledge files updated and the proxy redeployed; the assistant answers "what is CareOps?" and "does it hold resident data?" correctly
- [ ] Ctrl+K finds CareOps, CareRota and the sample report
- [ ] `llms.txt` and `sitemap.xml` updated; every sitemap URL returns 200
- [ ] JSON-LD validates; FAQ markup matches the visible FAQ
- [ ] No claim from the "never publish" list appears (`grep -ri "cqc approved\|cqc compliant\|dtac\|ai-powered\|trusted by"`)
- [ ] Cache-bust version bumped on every page
- [ ] Checked on a real phone: nav opens and closes, new pages scroll, no horizontal overflow
