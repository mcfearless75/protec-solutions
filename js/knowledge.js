/* ============================================================
   PROTEC SOLUTIONS — knowledge base
   Powers the AI assistant, command palette and semantic search.
   Pure client-side: no API keys, no backend, GitHub Pages safe.
   ============================================================ */

window.PROTEC_KB = {

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

  /* ---------- site map for the command palette ---------- */
  pages: [
    { title: "Home", url: "index.html", icon: "⌂", desc: "Protection and software, engineered together" },
    { title: "Goldshield Protection", url: "goldshield.html", icon: "◈", desc: "Official UK distribution, 24/7 antimicrobial surface protection" },
    { title: "Bespoke Apps", url: "apps.html", icon: "◐", desc: "Web apps, mobile apps and portals built for your sector" },
    { title: "AI Lab", url: "ai-lab.html", icon: "✦", desc: "Live interactive AI tools you can use right now" },
    { title: "Sectors", url: "sectors.html", icon: "▤", desc: "Healthcare, education, transport, hospitality, facilities" },
    { title: "Contact", url: "contact.html", icon: "✉", desc: "Talk to a human, or let the AI scope it first" }
  ],

  /* ---------- deep links surfaced by search ---------- */
  actions: [
    { title: "Coverage Calculator", url: "goldshield.html#calculator", icon: "∑", desc: "Work out product volume and cost for your floor area" },
    { title: "Protection Simulator", url: "goldshield.html#simulator", icon: "◉", desc: "Watch microbial load over 30 days, treated vs untreated" },
    { title: "Product Advisor", url: "goldshield.html#advisor", icon: "◈", desc: "Answer four questions, get the right Goldshield product" },
    { title: "App Scoper", url: "apps.html#scoper", icon: "◑", desc: "Build a live spec, timeline and budget for your app" },
    { title: "Tech Stack Picker", url: "apps.html#stack", icon: "⬡", desc: "Get a recommended stack for your project shape" },
    { title: "Feature Prioritiser", url: "apps.html#prioritiser", icon: "▦", desc: "Rank features by impact versus effort" },
    { title: "AI Readiness Score", url: "ai-lab.html#readiness", icon: "◎", desc: "Score your business on AI adoption readiness" },
    { title: "Copy Generator", url: "ai-lab.html#copygen", icon: "✎", desc: "Generate on-brand marketing copy instantly" },
    { title: "ROI Modeller", url: "ai-lab.html#roi", icon: "£", desc: "Model return on a bespoke software build" },
    { title: "Sector Matcher", url: "sectors.html#matcher", icon: "▤", desc: "Find the right protection and software mix for your sector" },
    { title: "Book a Consultation", url: "contact.html#book", icon: "✉", desc: "Fifteen minutes, no pitch deck" }
  ],

  /* ---------- Goldshield product catalogue ---------- */
  products: [
    {
      id: "gs75",
      name: "Goldshield GS75 Surface Protectant",
      tag: "Flagship",
      blurb: "Water-based antimicrobial that bonds to the surface and keeps working for up to 90 days between applications.",
      coveragePerLitre: 40,
      pricePerLitre: 68,
      durabilityDays: 90,
      surfaces: ["Hard surfaces", "Desks", "Handrails", "Door furniture", "Washrooms"],
      sectors: ["healthcare", "education", "office", "hospitality", "transport"],
      certs: ["EN 1276", "EN 13697", "ISO 22196"]
    },
    {
      id: "gs5",
      name: "Goldshield GS5 Fabric & Soft Surface",
      tag: "Textiles",
      blurb: "Designed for soft furnishings, seating, curtains and carpet. Odour control plus continuous antimicrobial action.",
      coveragePerLitre: 25,
      pricePerLitre: 74,
      durabilityDays: 60,
      surfaces: ["Seating", "Carpet", "Curtains", "Vehicle interiors", "Mattresses"],
      sectors: ["hospitality", "transport", "education", "care"],
      certs: ["ISO 20743", "AATCC 100"]
    },
    {
      id: "gsfog",
      name: "Goldshield Electrostatic Fogging System",
      tag: "Application",
      blurb: "Electrostatic delivery wraps the charged droplet around the object, including shadowed faces a cloth never reaches.",
      coveragePerLitre: 90,
      pricePerLitre: 61,
      durabilityDays: 90,
      surfaces: ["Whole rooms", "Vehicle cabins", "Classrooms", "Wards", "Gyms"],
      sectors: ["healthcare", "education", "transport", "leisure"],
      certs: ["EN 14476", "EN 13697"]
    },
    {
      id: "gshand",
      name: "Goldshield Hand Protection",
      tag: "Personal",
      blurb: "Alcohol-free skin protectant that stays active on the skin for hours rather than evaporating in seconds.",
      coveragePerLitre: 220,
      pricePerLitre: 52,
      durabilityDays: 1,
      surfaces: ["Hands", "Personal use", "Front of house"],
      sectors: ["healthcare", "hospitality", "retail", "education"],
      certs: ["EN 1500"]
    },
    {
      id: "gsair",
      name: "Goldshield Air & HVAC Treatment",
      tag: "Air",
      blurb: "Treats ductwork, filters and air handling units so the system stops recirculating what it just collected.",
      coveragePerLitre: 55,
      pricePerLitre: 79,
      durabilityDays: 120,
      surfaces: ["HVAC", "Ductwork", "Filters", "AHUs"],
      sectors: ["healthcare", "office", "leisure", "transport"],
      certs: ["ISO 22196", "EN 13697"]
    }
  ],

  /* ---------- app build catalogue ---------- */
  appTypes: [
    { id: "portal", name: "Client / Staff Portal", baseWeeks: 8, baseCost: 14000, blurb: "Secure login, role-based dashboards, document handling, audit trail." },
    { id: "mobile", name: "Mobile App (iOS + Android)", baseWeeks: 12, baseCost: 26000, blurb: "Cross-platform build, offline-first, push notifications, store submission." },
    { id: "ecommerce", name: "E-commerce Platform", baseWeeks: 10, baseCost: 18000, blurb: "Catalogue, payments, stock sync, order flow, customer accounts." },
    { id: "internal", name: "Internal Ops Tool", baseWeeks: 6, baseCost: 9500, blurb: "Replaces the spreadsheet that runs your business but shouldn't." },
    { id: "booking", name: "Booking / Scheduling System", baseWeeks: 7, baseCost: 12000, blurb: "Calendars, resource allocation, reminders, payment capture." },
    { id: "compliance", name: "Compliance & Audit Platform", baseWeeks: 10, baseCost: 19500, blurb: "Evidence capture, expiry tracking, automated reporting, inspector view." }
  ],

  addOns: [
    { id: "ai", name: "AI assistant / copilot", weeks: 3, cost: 6500 },
    { id: "payments", name: "Payments & subscriptions", weeks: 2, cost: 3800 },
    { id: "offline", name: "Offline-first sync", weeks: 2, cost: 4200 },
    { id: "analytics", name: "Analytics dashboard", weeks: 2, cost: 3400 },
    { id: "integrations", name: "Third-party integrations", weeks: 2, cost: 4500 },
    { id: "whitelabel", name: "White-label multi-tenant", weeks: 3, cost: 7200 },
    { id: "sso", name: "SSO & enterprise auth", weeks: 1, cost: 2900 },
    { id: "maps", name: "Mapping & geolocation", weeks: 2, cost: 3600 }
  ],

  sectors: [
    { id: "healthcare", name: "Healthcare & Care", icon: "✚", protection: "GS75 + Fogging + Air", software: "Compliance platform, staff rota, incident capture", note: "Infection control evidence is the deliverable, not the spray." },
    { id: "education", name: "Education", icon: "✎", protection: "GS75 + Fogging + GS5", software: "Parent portal, attendance, safeguarding logs", note: "Treat during holidays, protect through term." },
    { id: "transport", name: "Transport & Fleet", icon: "⬗", protection: "GS5 + Fogging", software: "Fleet tracking, driver app, defect reporting", note: "Cabin turnaround in minutes, not hours." },
    { id: "hospitality", name: "Hospitality & Leisure", icon: "◆", protection: "GS5 + GS75 + Hand", software: "Booking engine, guest app, loyalty", note: "Guests notice the certificate on the door." },
    { id: "facilities", name: "Facilities & FM", icon: "⬢", protection: "Full programme", software: "Job dispatch, asset register, SLA dashboards", note: "One contractor, two revenue lines." },
    { id: "retail", name: "Retail", icon: "▣", protection: "GS75 + Hand", software: "E-commerce, stock sync, click and collect", note: "Front of house confidence, back of house efficiency." },
    { id: "office", name: "Corporate & Office", icon: "▦", protection: "GS75 + Air", software: "Desk booking, visitor management, intranet", note: "Return-to-office friction removed." },
    { id: "industrial", name: "Industrial & Manufacturing", icon: "⚙", protection: "GS75 + Air", software: "Production dashboards, QA capture, maintenance", note: "Downtime is the only metric that matters." }
  ],

  /* ---------- assistant answer bank ---------- */
  faq: [
    {
      keys: ["goldshield", "what is goldshield", "antimicrobial", "product range", "protection"],
      answer: "**Goldshield** is an antimicrobial surface technology and we are an official UK distribution partner. Unlike a standard disinfectant that kills on contact and then evaporates, Goldshield bonds to the surface and keeps working continuously for up to 90 days.\n\nThe range covers hard surfaces (GS75), soft furnishings (GS5), electrostatic fogging, hand protection and HVAC treatment. Try the [Product Advisor](goldshield.html#advisor) and it will pick the right one for your site in about twenty seconds."
    },
    {
      keys: ["how long", "last", "durability", "90 days", "reapply", "how often"],
      answer: "Durability depends on the product and the traffic level:\n\n• **GS75 hard surface** — up to 90 days\n• **GS5 fabric** — up to 60 days\n• **Electrostatic fog** — up to 90 days\n• **HVAC treatment** — up to 120 days\n• **Hand protection** — hours per application\n\nHigh-touch, high-traffic areas sit at the lower end of those ranges. The [Protection Simulator](goldshield.html#simulator) shows the decay curve against an untreated control."
    },
    {
      keys: ["safe", "toxic", "children", "food", "safety", "harmful", "non-toxic"],
      answer: "The core products are water-based, alcohol-free and non-leaching — the active stays bonded to the surface rather than transferring. Once cured they are safe around children, food preparation areas and animals.\n\nCertification covers **EN 1276**, **EN 13697**, **EN 14476** and **ISO 22196**. Full data sheets go out with every quote."
    },
    {
      keys: ["cost", "price", "how much", "budget", "quote", "pricing", "expensive"],
      answer: "For protection, cost is driven by area and product. Roughly £61–£79 per litre with coverage between 25 and 220 m² per litre depending on surface type. Run the [Coverage Calculator](goldshield.html#calculator) for a real number against your floor area.\n\nFor software, a typical build lands between **£9.5k and £30k**, with ops tools at the lower end and full mobile apps at the top. The [App Scoper](apps.html#scoper) produces a costed spec in about a minute."
    },
    {
      keys: ["app", "build", "development", "software", "bespoke", "web app", "mobile"],
      answer: "We build bespoke web applications, mobile apps and portals — client portals, booking systems, compliance platforms, internal ops tools and e-commerce.\n\nTypical timelines: internal tools from **6 weeks**, portals from **8 weeks**, mobile apps from **12 weeks**. Everything is built to your process rather than bent around off-the-shelf software.\n\nUse the [App Scoper](apps.html#scoper) to get a live spec with timeline and budget."
    },
    {
      keys: ["tech", "stack", "technology", "framework", "language", "hosting"],
      answer: "Stack is chosen to fit the project, not the CV. Typically:\n\n• **Web** — modern JS front end, API back end, Postgres\n• **Mobile** — cross-platform so one build serves iOS and Android\n• **Auth & data** — Supabase or equivalent managed platform\n• **Hosting** — Railway, Netlify or Vercel depending on shape\n\nThe [Tech Stack Picker](apps.html#stack) will recommend a specific combination for your project."
    },
    {
      keys: ["ai", "artificial intelligence", "assistant", "automation", "copilot", "chatbot"],
      answer: "AI is built into what we ship, not bolted on afterwards. That means copilots inside your portal, document extraction, automated triage, natural-language reporting and predictive scheduling.\n\nThe [AI Lab](ai-lab.html) has live tools you can use right now — readiness scoring, a copy generator and an ROI modeller. All running client-side, no sign-up."
    },
    {
      keys: ["timeline", "how long build", "delivery", "when", "lead time", "weeks"],
      answer: "Protection can usually be scheduled within **5–10 working days** of survey, and most sites are treated outside operating hours.\n\nSoftware runs in two-week sprints with something demonstrable at the end of each. Internal tools **6 weeks**, portals **8 weeks**, compliance platforms **10 weeks**, mobile apps **12 weeks**. Add-ons extend that — the [App Scoper](apps.html#scoper) calculates it precisely."
    },
    {
      keys: ["sector", "industry", "who do you work with", "clients", "customers"],
      answer: "Healthcare and care, education, transport and fleet, hospitality and leisure, facilities management, retail, corporate offices and industrial.\n\nEach sector gets a different protection and software mix — the [Sector Matcher](sectors.html#matcher) will show yours."
    },
    {
      keys: ["contact", "call", "speak", "human", "email", "phone", "get in touch", "book"],
      answer: "Straight through to a person:\n\n• **Email** — hello@protec-solutions.co.uk\n• **Phone** — +44 (0)1234 567 890\n\nOr use the [booking form](contact.html#book). Fifteen minutes, no pitch deck, and you'll get a straight answer on whether we're the right fit."
    },
    {
      keys: ["distribution", "distributor", "official", "partner", "reseller", "trade"],
      answer: "We hold **official UK distribution** for Goldshield products. That means genuine stock, current batch certification, full technical data sheets and direct manufacturer support.\n\nTrade and reseller terms are available for FM contractors and cleaning companies — worth a conversation if you're already on site with clients."
    },
    {
      keys: ["application", "apply", "how applied", "fogging", "spray", "process"],
      answer: "Three application routes:\n\n1. **Electrostatic fogging** — charged droplets wrap around objects and reach shadowed faces. Fastest for whole rooms and vehicle cabins.\n2. **Trigger spray and cloth** — targeted high-touch points, done by your own team after a short training session.\n3. **Immersion or dip** — textiles and smaller items in volume.\n\nMost sites use fogging for the initial treatment, then in-house spray for high-touch maintenance between visits."
    },
    {
      keys: ["training", "certified", "team", "in-house", "diy"],
      answer: "Yes — we train client teams to apply and maintain the protection in-house. Half-day session, certificate issued, and you keep the ongoing cost down considerably.\n\nWe still handle the periodic deep treatment and the certification audit so the evidence trail stays clean."
    },
    {
      keys: ["hello", "hi", "hey", "help", "what can you do", "start"],
      answer: "I can help with two things:\n\n**Protection** — Goldshield products, coverage, cost, application and certification.\n\n**Software** — bespoke web apps, mobile apps, portals, AI features, timelines and budgets.\n\nAsk me anything, or hit one of the quick prompts below. Every tool on this site runs live in your browser."
    }
  ],

  fallback: "I don't have a specific answer to that one, but a human will. Email **hello@protec-solutions.co.uk** or use the [contact form](contact.html#book).\n\nIn the meantime, try asking about Goldshield products, coverage and cost, application methods, app development timelines, tech stack, or which sectors we work in."
};
