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
    email: "hello@protec-solutions.co.uk",
    phone: "+44 (0)1234 567 890",
    region: "United Kingdom",
    lines: [
      "Official UK distribution for Goldshield antimicrobial protection",
      "Bespoke web application and mobile app development"
    ]
  },

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
    { name: "Healthcare & Care", protection: "GS75 + Fogging + Air", software: "Compliance platform, staff rota, incident capture", note: "Infection control evidence is the deliverable, not the spray." },
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
    { title: "Book a consultation / site survey", url: "https://www.protec-solutions.co.uk/contact.html#book" }
  ]
};

module.exports = KNOWLEDGE;
