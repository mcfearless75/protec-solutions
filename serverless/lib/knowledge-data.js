/* ============================================================
   PROTEC SOLUTIONS - server-side knowledge base (Node/CommonJS)
   ============================================================
   This is a DELIBERATE, PRICE-STRIPPED copy of the product and
   service facts that live in js/knowledge.js (the browser-side
   knowledge base used by the keyword-matching assistant).

   Why a separate copy rather than requiring js/knowledge.js directly:
   - js/knowledge.js assigns to `window`, which does not exist in a
     Node/serverless runtime, so it cannot be require()'d as-is.
   - Every price field (pricePerLitre, baseCost, addOn cost) has been
     removed on purpose. The AI assistant must never quote a price:
     pricing was deliberately taken off this site, so the safest
     guarantee is that the figures are simply not present in the data
     it is given.

   MAINTENANCE: if you add, remove or change a product, sector or app
   type in js/knowledge.js, mirror the non-price facts here too. This
   file is small and flat on purpose so that's a quick, low-risk edit.
   ============================================================ */

"use strict";

const KNOWLEDGE = {
  company: {
    name: "ProTec Solutions",
    domain: "protec-solutions.co.uk",
    legalName: "PROTEC SOLUTIONS LTD",
    companyNumber: "17353418 (England and Wales)",
    registeredOffice: "80 Birkenhead Road, Meols, Wirral, CH47 0LB",
    email: "hello@protec-solutions.co.uk",
    region: "United Kingdom",
    lines: [
      "Official UK distribution for Goldshield antimicrobial protection",
      "Bespoke web application and mobile app development",
      "Care home software it builds and runs: CareOps, CareRota and DOBS"
    ]
  },

  /* care home software - mirrors KB.careProducts in js/knowledge.js,
     with the fuller fact list from docs/CARE-UPDATE.md section 3 */
  careProducts: [
    {
      name: "CareOps",
      what: "Operations and compliance evidence for UK care homes",
      url: "https://careops.protec-solutions.co.uk/",
      page: "https://www.protec-solutions.co.uk/careops.html",
      facts: [
        "Scheduled checklists per room (per shift, daily, weekly, monthly, every N months). 12 ready-made checks including fridge and freezer temperatures, medication fridge, fire doors, fire alarm test, hot water temperatures, legionella flush, kitchen opening and closing, cleaning.",
        "Readings are judged against a range; a failed or out-of-range line raises a task automatically. Missed checks raise a task the next morning.",
        "One QR poster per room serves fault reporting and that room's checks. Staff without a login sign in on a shared tablet with a PIN.",
        "Tasks: deadlines by priority, assignment with acceptance, checklists, attachments, a permanent activity trail.",
        "Incidents: lifecycle, CQC-notifiable flag, follow-up tasks.",
        "Services and key dates: contractor servicing, certificates, renewal reminders.",
        "Staff compliance: DBS, right to work, training expiry, renewals raised automatically.",
        "Reports: on-time rates, room by room, every check every day, incidents, evidence by CQC regulation (Regs 9 to 20A).",
        "Governance: monthly pack with a named sign-off, stored unchanged; a full audit export for inspections.",
        "Alerts by email, SMS, push and a daily digest. Sign-in with Microsoft 365 or an email link. Installs to a phone home screen.",
        "A public sample report for a fictional home: https://careops.protec-solutions.co.uk/sample-report"
      ],
      dataBoundary: "Holds no resident records by design. Free-text fields carry a \"no names\" prompt."
    },
    {
      name: "CareRota",
      what: "Rotas, shift cover and timesheets for care homes",
      url: "https://carerota.protec-solutions.co.uk/",
      page: "https://www.protec-solutions.co.uk/carerota.html",
      facts: [
        "Weekly rota builder with drafts, publish, copy last week and templates; staffing-level coverage view.",
        "Cover cascade: a dropped shift is offered to eligible staff first (role, skills, in-date certificates, 11-hour rest, 48-hour weekly cap), then widens in timed tiers until claimed.",
        "Open shifts, shift swaps, availability, leave requests and allowances.",
        "Clock in and out on a phone or a door tablet with a PIN.",
        "Timesheets with pay-period lock; reports for payroll, lateness, sickness, scheduled against actual, and working time.",
        "Calendar feed, push notifications, per-shift messages."
      ],
      dataBoundary: "Holds staff data only. No resident records."
    },
    {
      name: "DOBS",
      what: "Digital observations and body maps - a separate clinical tool with its own site",
      url: "https://dobs.app/",
      page: "https://dobs.app/",
      facts: [
        "Digital body maps; vital signs with NEWS2 scoring; neurological (GCS), behaviour and mood, food and fluid, sleep observations.",
        "Observation due and overdue status per resident; automated pattern alerts (fixed rules, not a model).",
        "Read-only family portal with a PIN. Fingerprint or face sign-in on the device."
      ],
      dataBoundary: "Holds resident clinical data - the one ProTec care product that does. Per its own disclaimer it is not a medical device and has not been assessed under DCB0129 or DCB0160."
    }
  ],

  /* AI telephone answering - facts verified in each client's repo, Oct 2026.
     The three clients and Keenan's quote are published with permission. */
  aiTelephone: {
    summary: "An AI voice agent (Retell AI) picks up calls the client's team can't answer, takes the details, and logs each call as a ticket in the client's own system with a transcript and summary, alerting the right people. Calls are sent over a signature-checked webhook.",
    limits: [
      "No live transfer to a person: the AI takes the details and staff call back.",
      "Not an emergency service; no clinical, legal or financial advice.",
      "Do not claim 24/7 answering, guaranteed response times, call volumes or uptime."
    ],
    clients: [
      { name: "Traknet", what: "operations platform for a security guarding and patrol company", facts: "Phoned-in faults become urgent tickets. Out of hours the nearest on-call guard is offered the job by WhatsApp or SMS and an app alert; after 5 minutes it moves to the next nearest guard, and management is alerted if nobody is left. In office hours faults go to the named office contact, and messages for accounts or sales go to that team. Known clients can check an existing job from their registered number. Calls that end before anything is logged still become a missed-call ticket." },
      { name: "Truth Care", what: "specialist residential brain-injury rehabilitation service", facts: "The agent says it is automated, sorts referrals, staff calling in, concerns about a resident and general messages, and reads the caller a ticket number. It never gives clinical advice or confirms who is a resident, and tells emergencies to dial 999. Staff work tickets from a board or by email reply, with a daily digest. Call recording is off; caller details are redacted 12 months after a ticket closes." },
      { name: "PRL Site Solutions", what: "construction recruitment agency in the Wirral", facts: "Built into the bespoke operations app ProTec made for PRL. Calls are sorted into new applicant, contractor query, client enquiry, urgent or other; urgent calls are flagged in the staff email; staff see transcripts on a calls page and mark them actioned; callers are matched to existing contractor records where possible." }
    ],
    testimonials: [
      { quote: "ProTec Solutions made the whole process seamless, from creating our bespoke app to setting up our AI phone system. Great service throughout, and we're really pleased with the results. Highly recommended!", by: "Keenan, PRL Site Solutions" }
    ]
  },

  careFaq: [
    { q: "Does this replace our care planning system?", a: "No. CareOps and CareRota cover operations, compliance evidence and staffing. Keep your care records system for assessments, care plans and daily notes." },
    { q: "Does it hold resident information?", a: "CareOps and CareRota do not. DOBS, the separate clinical observation tool, does, and is described on its own site." },
    { q: "Is it CQC approved?", a: "CQC does not approve software. CareOps produces dated, attributable records and exports organised by the regulations inspectors work to." },
    { q: "Do staff need their own phone or login?", a: "No. A shared tablet with a PIN works, and so does scanning a room poster." },
    { q: "Do you use AI on our data?", a: "No. No AI is run over customer data in CareOps or CareRota." },
    { q: "What does it cost?", a: "Per home, per month, quoted directly. Book a demo via the contact page." }
  ],

  /* hard rules for anything the assistant says about care software */
  careBoundaries: [
    "CareOps and CareRota are not care planning systems, digital social care records or eMAR, and hold no resident records.",
    "DOBS holds resident clinical observations. Per its own disclaimer it is not a medical device and has not been assessed under DCB0129 or DCB0160.",
    "ProTec is not CQC and does not set or enforce standards. No ProTec product is \"CQC approved\", \"CQC compliant\" or \"CQC certified\" - say it \"produces the evidence CQC inspectors ask for\".",
    "No ProTec care product currently holds DTAC, DSPT, Cyber Essentials, ISO 27001 or NHS assured status.",
    "Never describe any care product as \"AI-powered\". No AI is run over customer data in CareOps or CareRota; DOBS' alerts are fixed rules.",
    "Never state care-software customer counts, name care-software customers, or say \"trusted by care homes\".",
    "Never compare ProTec's care products against named competitors.",
    "Describe CareOps and CareRota as working alongside the care records system a home already has, not replacing it."
  ],

  /* Goldshield product catalogue - pricePerLitre deliberately omitted */
  products: [
    {
      name: "Goldshield GS75 Surface Protectant",
      tag: "Flagship",
      blurb: "Water-based antimicrobial that bonds to the surface and keeps working for up to 14 days between applications.",
      coveragePerLitre: "100 m² per litre",
      durabilityDays: 14,
      surfaces: ["Hard surfaces", "Desks", "Handrails", "Door furniture", "Washrooms"],
      sectors: ["healthcare", "education", "office", "hospitality", "transport"],
      certs: ["EN 1276", "EN 13697", "ISO 22196"]
    },
    {
      name: "Goldshield GS5 Fabric & Soft Surface",
      tag: "Textiles",
      blurb: "Designed for soft furnishings, seating, curtains and carpet. Odour control plus continuous antimicrobial action.",
      coveragePerLitre: "100 m² per litre",
      durabilityDays: 14,
      surfaces: ["Seating", "Carpet", "Curtains", "Vehicle interiors", "Mattresses"],
      sectors: ["hospitality", "transport", "education", "care"],
      certs: ["ISO 20743", "AATCC 100"]
    },
    {
      name: "Goldshield Hand Protection",
      tag: "Personal",
      blurb: "Alcohol-free skin protectant that stays active on the skin for hours rather than evaporating in seconds.",
      coveragePerLitre: "220 m² per litre",
      durabilityDays: 1,
      surfaces: ["Hands", "Personal use", "Front of house"],
      sectors: ["healthcare", "hospitality", "retail", "education"],
      certs: ["EN 1500"]
    },
    {
      name: "Goldshield Air & HVAC Treatment",
      tag: "Air",
      blurb: "Treats ductwork, filters and air handling units so the system stops recirculating what it just collected.",
      coveragePerLitre: "55 m² per litre",
      durabilityDays: 120,
      surfaces: ["HVAC", "Ductwork", "Filters", "AHUs"],
      sectors: ["healthcare", "office", "leisure", "transport"],
      certs: ["ISO 22196", "EN 13697"]
    }
  ],

  /* application methods, safety and training - factual, no prices */
  application: {
    methods: [
      "Electrostatic fogging - charged droplets wrap around objects and reach shadowed faces. Fastest for whole rooms and vehicle cabins.",
      "Trigger spray and cloth - targeted high-touch points, done by the client's own team after a short training session.",
      "Immersion or dip - textiles and smaller items in volume."
    ],
    safety: "Core products are water-based, alcohol-free and non-leaching (the active stays bonded to the surface rather than transferring). Once cured they are safe around children, food preparation areas and animals. Certification covers EN 1276, EN 13697, EN 14476 and ISO 22196.",
    training: "Client teams can be trained to apply and maintain the protection in-house - a half-day session with a certificate issued. ProTec still handles the periodic deep treatment and the certification audit so the evidence trail stays clean.",
    schedulingNote: "Protection can usually be scheduled within 5-10 working days of a site survey, and most sites are treated outside operating hours.",
    distribution: "ProTec Solutions holds official UK distribution for Goldshield products - genuine stock, current batch certification, full technical data sheets and direct manufacturer support. Trade and reseller terms are available for FM contractors and cleaning companies."
  },

  /* app build catalogue - baseCost deliberately omitted */
  appTypes: [
    { name: "Client / Staff Portal", baseWeeks: 8, blurb: "Secure login, role-based dashboards, document handling, audit trail." },
    { name: "Mobile App (iOS + Android)", baseWeeks: 12, blurb: "Cross-platform build, offline-first, push notifications, store submission." },
    { name: "E-commerce Platform", baseWeeks: 10, blurb: "Catalogue, payments, stock sync, order flow, customer accounts." },
    { name: "Internal Ops Tool", baseWeeks: 6, blurb: "Replaces the spreadsheet that runs the business but shouldn't." },
    { name: "Booking / Scheduling System", baseWeeks: 7, blurb: "Calendars, resource allocation, reminders, payment capture." },
    { name: "Compliance & Audit Platform", baseWeeks: 10, blurb: "Evidence capture, expiry tracking, automated reporting, inspector view." }
  ],

  /* add-ons - cost deliberately omitted */
  addOns: [
    { name: "AI assistant / copilot", weeks: 3 },
    { name: "Payments & subscriptions", weeks: 2 },
    { name: "Offline-first sync", weeks: 2 },
    { name: "Analytics dashboard", weeks: 2 },
    { name: "Third-party integrations", weeks: 2 },
    { name: "White-label multi-tenant", weeks: 3 },
    { name: "SSO & enterprise auth", weeks: 1 },
    { name: "Mapping & geolocation", weeks: 2 }
  ],

  softwareApproach: "Stack is chosen to fit the project: modern JS front end with an API back end and Postgres for web, a cross-platform build for mobile so one codebase serves iOS and Android, Supabase or an equivalent managed platform for auth and data, and Railway, Netlify or Vercel for hosting depending on the shape of the project. Software runs in two-week sprints with something demonstrable at the end of each sprint. AI is built into what ProTec ships rather than bolted on afterwards - copilots inside portals, document extraction, automated triage, natural-language reporting and predictive scheduling.",

  sectors: [
    { name: "Healthcare & Care", protection: "GS75 + Fogging + Air", software: "CareOps (checks, incidents, compliance), CareRota (rotas and cover)", note: "Infection control evidence is the deliverable, not the spray." },
    { name: "Education", protection: "GS75 + Fogging + GS5", software: "Parent portal, attendance, safeguarding logs", note: "Treat during holidays, protect through term." },
    { name: "Transport & Fleet", protection: "GS5 + Fogging", software: "Fleet tracking, driver app, defect reporting", note: "Cabin turnaround in minutes, not hours." },
    { name: "Hospitality & Leisure", protection: "GS5 + GS75 + Hand", software: "Booking engine, guest app, loyalty", note: "Guests notice the certificate on the door." },
    { name: "Facilities & FM", protection: "Full programme", software: "Job dispatch, asset register, SLA dashboards", note: "One contractor, two revenue lines." },
    { name: "Retail", protection: "GS75 + Hand", software: "E-commerce, stock sync, click and collect", note: "Front of house confidence, back of house efficiency." },
    { name: "Corporate & Office", protection: "GS75 + Air", software: "Desk booking, visitor management, intranet", note: "Return-to-office friction removed." },
    { name: "Industrial & Manufacturing", protection: "GS75 + Air", software: "Production dashboards, QA capture, maintenance", note: "Downtime is the only metric that matters." }
  ],

  /* deep links the assistant is allowed to point people to */
  usefulLinks: [
    { title: "Product Advisor", url: "https://www.protec-solutions.co.uk/goldshield.html#advisor" },
    { title: "Protection Simulator", url: "https://www.protec-solutions.co.uk/goldshield.html#simulator" },
    { title: "App Scoper", url: "https://www.protec-solutions.co.uk/apps.html#scoper" },
    { title: "Tech Stack Picker", url: "https://www.protec-solutions.co.uk/apps.html#stack" },
    { title: "Sector Matcher", url: "https://www.protec-solutions.co.uk/sectors.html#matcher" },
    { title: "Book a consultation / site survey", url: "https://www.protec-solutions.co.uk/contact.html#book" },
    { title: "AI telephone answering", url: "https://www.protec-solutions.co.uk/ai-telephone.html" },
    { title: "Care software overview", url: "https://www.protec-solutions.co.uk/care.html" },
    { title: "CareOps", url: "https://www.protec-solutions.co.uk/careops.html" },
    { title: "CareRota", url: "https://www.protec-solutions.co.uk/carerota.html" },
    { title: "CareOps sample report (fictional home)", url: "https://careops.protec-solutions.co.uk/sample-report" },
    { title: "DOBS (separate clinical product)", url: "https://dobs.app/" },
    { title: "AI information", url: "https://www.protec-solutions.co.uk/ai-information.html" },
    { title: "Privacy notice", url: "https://www.protec-solutions.co.uk/privacy.html" }
  ]
};

module.exports = KNOWLEDGE;
