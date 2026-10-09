/* ============================================================
   PROTEC SOLUTIONS — knowledge base
   Powers the AI assistant, command palette and semantic search.
   Pure client-side: no API keys, no backend, GitHub Pages safe.
   ============================================================ */

window.PROTEC_KB = {

  company: {
    name: "ProTec Solutions",
    domain: "protec-solutions.co.uk",
    legalName: "PROTEC SOLUTIONS LTD",
    companyNumber: "17353418",
    registeredOffice: "80 Birkenhead Road, Meols, Wirral, CH47 0LB",
    email: "hello@protec-solutions.co.uk",
    region: "United Kingdom",
    lines: [
      "Official UK distribution for Goldshield antimicrobial protection",
      "Bespoke web application and mobile app development",
      "Care home software: CareOps, CareRota and DOBS"
    ]
  },

  /* ---------- site map for the command palette ---------- */
  pages: [
    { title: "Home", url: "index.html", icon: "⌂", desc: "Protection and software, engineered together" },
    { title: "Goldshield Protection", url: "goldshield.html", icon: "◈", desc: "Official UK distribution, 24/7 antimicrobial surface protection" },
    { title: "Bespoke Apps", url: "apps.html", icon: "◐", desc: "Web apps, mobile apps and portals built for your sector" },
    { title: "Care Software", url: "care.html", icon: "✚", desc: "CareOps and CareRota for UK care homes. Works alongside your care records" },
    { title: "CareOps", url: "careops.html", icon: "☑", desc: "Care home checks, incidents, maintenance and CQC evidence" },
    { title: "CareRota", url: "carerota.html", icon: "◷", desc: "Care home rota, shift cover cascade and timesheets" },
    { title: "AI Information", url: "ai-information.html", icon: "ⓘ", desc: "Facts about ProTec for AI assistants" },
    { title: "AI Lab", url: "ai-lab.html", icon: "✦", desc: "Live interactive AI tools you can use right now" },
    { title: "Sectors", url: "sectors.html", icon: "▤", desc: "Healthcare, education, transport, hospitality, facilities" },
    { title: "Contact", url: "contact.html", icon: "✉", desc: "Talk to a human, or let the AI scope it first" }
  ],

  /* ---------- deep links surfaced by search ---------- */
  actions: [
    { title: "Protection Simulator", url: "goldshield.html#simulator", icon: "◉", desc: "Watch microbial load over 30 days, treated vs untreated" },
    { title: "Product Advisor", url: "goldshield.html#advisor", icon: "◈", desc: "Answer four questions, get the right Goldshield product" },
    { title: "App Scoper", url: "apps.html#scoper", icon: "◑", desc: "Build a live spec, timeline and budget for your app" },
    { title: "Tech Stack Picker", url: "apps.html#stack", icon: "⬡", desc: "Get a recommended stack for your project shape" },
    { title: "Feature Prioritiser", url: "apps.html#prioritiser", icon: "▦", desc: "Rank features by impact versus effort" },
    { title: "AI Readiness Score", url: "ai-lab.html#readiness", icon: "◎", desc: "Score your business on AI adoption readiness" },
    { title: "Copy Generator", url: "ai-lab.html#copygen", icon: "✎", desc: "Generate on-brand marketing copy instantly" },
    { title: "ROI Modeller", url: "ai-lab.html#roi", icon: "£", desc: "Model return on a bespoke software build" },
    { title: "Sector Matcher", url: "sectors.html#matcher", icon: "▤", desc: "Find the right protection and software mix for your sector" },
    { title: "Book a Consultation", url: "contact.html#book", icon: "✉", desc: "Fifteen minutes, no pitch deck" },
    { title: "CareOps Sample Report", url: "https://careops.protec-solutions.co.uk/sample-report", icon: "☑", desc: "See what an inspector would see (fictional home)" },
    { title: "Book a Care Software Demo", url: "contact.html#book", icon: "✚", desc: "Fifteen minutes on CareOps or CareRota" }
  ],

  /* ---------- care home software we built and run ----------
     Single source for the product cards on care.html, apps.html and the
     command palette. Facts only from docs/CARE-UPDATE.md section 3; the
     claims rules in section 4 of that file apply to every word here. */
  careProducts: [
    {
      id: "careops",
      name: "CareOps",
      tag: "Operations & compliance evidence",
      url: "careops.html",
      site: "https://careops.protec-solutions.co.uk/",
      summary: "Scheduled checks by QR poster, fault reporting, incidents, staff compliance and a signed monthly governance pack.",
      holdsResidentData: false,
      bullets: [
        "12 ready-made checks, failures raise a task automatically",
        "Evidence organised by CQC regulation (Regs 9 to 20A)",
        "Shared tablet with PIN, no login needed for staff"
      ]
    },
    {
      id: "carerota",
      name: "CareRota",
      tag: "Rotas, cover & timesheets",
      url: "carerota.html",
      site: "https://carerota.protec-solutions.co.uk/",
      summary: "Weekly rota builder with a cover cascade that offers dropped shifts to eligible staff first, clock-in at the door and payroll-ready timesheets.",
      holdsResidentData: false,
      bullets: [
        "Cover checks role, training, 11-hour rest and the 48-hour cap",
        "Swaps, availability, leave and open shifts",
        "Timesheets with pay-period lock and payroll reports"
      ]
    },
    {
      id: "dobs",
      name: "DOBS",
      tag: "Clinical observations: separate product",
      url: "https://dobs.app/",
      site: "https://dobs.app/",
      summary: "Digital body maps and resident observations, including vital signs with NEWS2 scoring. A focused clinical tool with its own site.",
      holdsResidentData: true,
      bullets: [
        "Body maps, vital signs, GCS, behaviour, food and fluid, sleep",
        "Due and overdue status per resident, automated pattern alerts",
        "Holds resident clinical data, unlike CareOps and CareRota"
      ]
    }
  ],

  /* ---------- Goldshield product catalogue ---------- */
  products: [
    {
      id: "gs75",
      name: "Goldshield GS75 Surface Protectant",
      tag: "Flagship",
      blurb: "Water-based antimicrobial that bonds to the surface and keeps working for up to 14 days between applications.",
      coveragePerLitre: 100,
      pricePerLitre: 68,
      durabilityDays: 14,
      surfaces: ["Hard surfaces", "Desks", "Handrails", "Door furniture", "Washrooms"],
      sectors: ["healthcare", "education", "office", "hospitality", "transport"],
      certs: ["EN 1276", "EN 13697", "ISO 22196"]
    },
    {
      id: "gs5",
      name: "Goldshield GS5 Fabric & Soft Surface",
      tag: "Textiles",
      blurb: "Designed for soft furnishings, seating, curtains and carpet. Odour control plus continuous antimicrobial action.",
      coveragePerLitre: 100,
      pricePerLitre: 74,
      durabilityDays: 14,
      surfaces: ["Seating", "Carpet", "Curtains", "Vehicle interiors", "Mattresses"],
      sectors: ["hospitality", "transport", "education", "care"],
      certs: ["ISO 20743", "AATCC 100"]
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

  /* ---------- independent evidence: peer-reviewed studies, lab reports,
     site trials ----------
     Deliberately empty until real citations exist. The Evidence section
     on goldshield.html only renders when this array is non-empty, so
     leaving it empty is completely safe — nothing broken or placeholder
     ever appears on the live site.

     NEVER invent an entry here "to show what it would look like". A
     fabricated citation is indistinguishable from a real one once it's
     on the page, and this is exactly the kind of claim that can turn
     into a false-advertising problem if it's wrong.

     Add real entries in this exact shape:
     {
       type: "peer-reviewed" | "lab-report" | "site-trial",
       title: "Exact study or report title",
       source: "Journal name, or lab/testing body name",
       year: 2024,
       finding: "One plain-English sentence — the actual result, not marketing copy.",
       url: "https://doi.org/... or the report link. Omit the key entirely if there's no public link.",
       productId: "gs75"   // optional — matches a product id above, shows as a badge on that product's card
     }

     Curated from a September 2025 Goldshield Technologies bibliography of
     81 independent studies (10 peer-reviewed and published). Not every
     study is listed here — deliberately excluded: general microbiology/
     virology papers that don't test a Goldshield product directly, and
     agriculture trials (citrus, table grapes) that don't match this
     site's actual sectors. Full bibliography available on request.

     Product mapping, confirmed with Paul: "Goldshield 5" = GS5 (fabric),
     "Goldshield 75" = GS75 (hard surface), "Goldshield 24" = Hand
     Protection (alcohol-free). Entries testing "Goldshield 86"/"55"/"101"
     or the bare active ingredient (QAS) rather than a numbered product
     are left without a productId rather than force-matched to one of
     the four current SKUs.
  */
  evidence: [
    // ---- peer-reviewed, published ----
    {
      type: "peer-reviewed",
      title: "Evaluation and quantitative microbial risk assessment of a unique antimicrobial agent for hospital surface treatment",
      source: "American Journal of Infection Control",
      year: 2015,
      finding: "Nine-month trial across 18 patient rooms at Oakwood Hospital and Medical Center, Michigan. Infection risk reduced by 4 logs for gram-positive and 3 logs for gram-negative bacteria on high-touch surfaces, suggesting the treatment could prevent 5–10% of hospital-acquired infections.",
      productId: "gs75"
    },
    {
      type: "peer-reviewed",
      title: "Long-acting water-stable organosilane agent and its sustained effect on reducing microbial load in an intensive care unit",
      source: "American Journal of Infection Control",
      year: 2017,
      finding: "Five-month randomised, double-blind controlled trial across 18 ICU rooms at Genesys Regional Medical Center, Michigan — the first study of its kind for this technology. Monthly application showed sustained bioburden reduction associated with lower infection risk.",
      productId: "gs75"
    },
    {
      type: "peer-reviewed",
      title: "In vitro evaluation of a novel process for reducing bacterial contamination of environmental surfaces",
      source: "American Journal of Infection Control",
      year: 2011,
      finding: "Henry Ford Hospital, Detroit. Tested against MRSA, Pseudomonas aeruginosa and E. coli on fabric, Formica and stainless steel. On fabric, viable bacteria stayed inhibited for 14 days.",
      productId: "gs5"
    },
    {
      type: "peer-reviewed",
      title: "Application of a quaternary ammonium agent on surgical face masks before use for pre-decontamination of nosocomial infection-related bio-aerosols",
      source: "Aerosol Science and Technology",
      year: 2016,
      finding: "Tzu Chi University, Taiwan. 99.3% efficiency against three tested bacterial species, maintaining efficacy at least one week after coating.",
      productId: "gs5"
    },
    {
      type: "peer-reviewed",
      title: "Effective antiviral coatings for deactivating SARS-CoV-2 virus on N95 respirator masks or filters",
      source: "Materials Today Advances",
      year: 2022,
      finding: "Coated N95, cotton and non-woven materials inactivated Alpha and Beta SARS-CoV-2 variants over three days and across three consecutive viral exposures, with no cytotoxicity found on treated masks.",
      productId: "gs75"
    },
    {
      type: "peer-reviewed",
      title: "Antimicrobial Coating Efficacy for Prevention of Pseudomonas aeruginosa Biofilm Growth on ISS Water System Materials",
      source: "Frontiers in Microbiology",
      year: 2022,
      finding: "Montana State University Center for Biofilm Engineering, with NASA's Jet Propulsion Laboratory. 99.999–99.9999% reduction in biofilm accumulation over 24–48 hours across four materials used in the International Space Station's water system, tested in nutrient broth. Efficacy dropped in a potato-starch growth medium, which the researchers attribute to starches masking the coating's mechanism."
    },
    {
      type: "lab-report",
      title: "Use of antimicrobial coatings to prevent multispecies, multidomain biofilm growth of ISS isolates in wastewater system",
      source: "73rd International Astronautical Congress (conference proceedings, not a peer-reviewed journal)",
      year: 2022,
      finding: "Follow-up ISS wastewater-tank study, Montana State University and NASA JPL. Reduced biofilm accumulation against Pseudomonas aeruginosa and a five-microbe consortium on Inconel and Teflon; showed the greatest log reduction of the coatings tested against P. aeruginosa (2.8 log). Researchers noted further testing is needed over longer periods and in microgravity conditions before drawing firm conclusions."
    },
    {
      type: "peer-reviewed",
      title: "A standardized procedure for quantitative evaluation of residual viral activity on antiviral treated textiles",
      source: "Textile Research Journal",
      year: 2022,
      finding: "North Carolina State University (Wilson College of Textiles). Used the product to help develop and validate a new standardised test protocol for residual antiviral activity on treated fabrics, showing a significant difference between treated and untreated material.",
      productId: "gs5"
    },
    {
      type: "peer-reviewed",
      title: "Effects of Quaternary Ammonium Silane Coatings on Mixed Fungal and Bacterial Biofilms on Tracheoesophageal Shunt Prostheses",
      source: "Applied and Environmental Microbiology",
      year: 2006,
      finding: "University Medical Center Groningen, Netherlands. The active ingredient's coating reduced mixed yeast and bacterial biofilm on silicone rubber medical device material and was found non-toxic in cell culture testing — the first study to show this specific effect on mixed biofilms."
    },
    {
      type: "peer-reviewed",
      title: "Quaternary ammonium salt coated air filter for bioaerosol removal from building indoor air",
      source: "Building and Environment",
      year: 2024,
      finding: "Oak Ridge National Laboratory. A simple spray-coating method applied to HVAC air filters maintained over 99.9% antibacterial efficiency three months after application, with bacterial and viral filtration efficiency both above 99.9%.",
      productId: "gsair"
    },

    // ---- independent lab reports ----
    {
      type: "lab-report",
      title: "Assessment of Antibacterial Efficacy of Goldshield against MRSA and VRE",
      source: "Dept. of Soil, Water and Environmental Science, University of Arizona (Dr Charles Gerba)",
      year: 2008,
      finding: "Tested on stainless steel, plastic, vinyl and ceramic tile. Over 98% residual protection on all surfaces except vinyl (86.7%); 99%+ residual effect against MRSA on stainless steel, plastic and tile after 14 days.",
      productId: "gs75"
    },
    {
      type: "lab-report",
      title: "Virucidal Efficacy of Goldshield 5 used for Inanimate Environmental Surfaces",
      source: "Center for Medicinal Plant Research, Stephen F. Austin State University",
      year: 2010,
      finding: "Tested to ASTM E1053/E1482-04 and US EPA protocol against Influenza A H1N1. 2.5 log reduction; treated surfaces showed no viral infectivity after one hour.",
      productId: "gs5"
    },
    {
      type: "lab-report",
      title: "Microbiological Analysis Based on EN 1276 — bactericidal activity of chemical disinfectants and antiseptics",
      source: "MGS Laboratories, UK",
      year: 2011,
      finding: "Tested against E. coli, Enterococcus hirae, Staphylococcus aureus and Pseudomonas aeruginosa. Log reductions between 5.03 and 5.25 across all four organisms — comfortably above the standard's pass threshold.",
      productId: "gshand"
    },
    {
      type: "lab-report",
      title: "EN 14476 — virucidal quantitative suspension test (chemical disinfectants and antiseptics used in human medicine)",
      source: "BluTest Laboratories, Glasgow",
      year: 2015,
      finding: "Tested against an Ebola virus strain. At least a 4-log reduction, with residual activity maintained for at least 60 minutes.",
      productId: "gshand"
    },
    {
      type: "lab-report",
      title: "Microbiological Analysis Based on EN 1500 — hygienic handrub",
      source: "MGS Laboratories, UK",
      year: 2012,
      finding: "Tested against E. coli K12 as a 30- and 60-second hand rub across five participants. Mean log reduction of 2.59.",
      productId: "gshand"
    },
    {
      type: "lab-report",
      title: "Antimicrobial Efficacy of Treated Medical Masks Modified for Viruses",
      source: "Microchem Laboratory, Round Rock, Texas",
      year: 2016,
      finding: "AATCC 100 methodology against Influenza A H1N1, human coronavirus 229E and poliovirus 1. 99.68% reduction against H1N1 and 94.38% against the coronavirus strain at first application.",
      productId: "gs5"
    },
    {
      type: "lab-report",
      title: "Effectiveness test report of antiviral-treated medical rubber glove / medical mask against SARS-CoV-2",
      source: "Wuhan Virus Research Institute, Chinese Academy of Sciences",
      year: 2020,
      finding: "Independent Chinese Academy of Sciences testing against live SARS-CoV-2. 94.87% virus inactivation on treated gloves and 99.88% on treated masks, versus untreated controls.",
      productId: "gs5"
    },

    // ---- real-world site trials ----
    {
      type: "site-trial",
      title: "Assessment of microbiological reduction and residual performance in clinical training areas",
      source: "Ipswich Hospital, UK (Lead Infection Prevention Nurse)",
      year: 2015,
      finding: "Applied to high-touch clinical training surfaces alongside normal hospital cleaning. Reduced contamination was still measurable 2–3 days after application and after normal cleaning had taken place — covering the gap where routine cleaning frequency drops, such as over a weekend.",
      productId: "gs75"
    },
    {
      type: "site-trial",
      title: "Goldshield 5 Antimicrobial Test — wheelchairs, stretchers and tray tables",
      source: "University of Pittsburgh Medical Center, Clinical Support Services",
      year: 2008,
      finding: "634 tests using ATP bioburden detection over six weeks. Regular cleaning plus treatment showed a dramatic, sustained reduction in bioburden compared with regular cleaning alone.",
      productId: "gs5"
    },
    {
      type: "site-trial",
      title: "Use of ATP Detection Process to Evaluate Residual Efficacy on Treated Surfaces in New York City Schools",
      source: "New York City Board of Education",
      year: 2006,
      finding: "Gymnasiums, weight rooms, classroom desks, sinks and lockers across three schools. 32% of tested spaces failed bacterial testing before treatment; zero failures after treatment, with protection persisting for four weeks.",
      productId: "gs5"
    },
    {
      type: "site-trial",
      title: "Microbiological results from a test on a London Underground train",
      source: "Independent company microbiologist",
      year: 2015,
      finding: "High-touch areas including grab rails and seats tested before treatment and again after three weeks in normal passenger service. Sustained, dramatic reduction in bacterial contamination across the whole train.",
      productId: "gs5"
    },
    {
      type: "site-trial",
      title: "Residual Surface Protection Test Report — 7-day ATP Cleanliness Evaluation",
      source: "Sha Tin Hyatt Hotel, Hong Kong (Mono Care Limited, Field Hygiene Specialist)",
      year: 2025,
      finding: "Fogger application across high-touch and hidden hotel surfaces. Over 98% average reduction in microbial ATP levels seven days after a single application, with no reapplication or wiping — including hidden, dust-prone areas like air inlets.",
      productId: "gs75"
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
    { id: "healthcare", name: "Healthcare & Care", icon: "✚", protection: "GS75 + Fogging + Air", software: "CareOps (checks, incidents, compliance), CareRota (rotas and cover)", link: { label: "See the care software", url: "care.html" }, note: "Infection control evidence is the deliverable, not the spray." },
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
      answer: "**Goldshield** is an antimicrobial surface technology and we are an official UK distribution partner. Unlike a standard disinfectant that kills on contact and then evaporates, Goldshield bonds to the surface and keeps working continuously — up to 120 days for HVAC treatment, 14 days between applications for GS75 and GS5.\n\nThe range covers hard surfaces (GS75), soft furnishings (GS5), hand protection and HVAC treatment — applied by trigger spray or, for whole rooms and vehicle cabins, electrostatic fogging. Try the [Product Advisor](goldshield.html#advisor) and it will pick the right one for your site in about twenty seconds."
    },
    {
      keys: ["how long", "last", "durability", "90 days", "reapply", "how often"],
      answer: "Durability depends on the product and the traffic level:\n\n• **GS75 hard surface** — up to 14 days\n• **GS5 fabric** — up to 14 days\n• **HVAC treatment** — up to 120 days\n• **Hand protection** — hours per application\n\nHigh-touch, high-traffic areas sit at the lower end of those ranges. The [Protection Simulator](goldshield.html#simulator) shows the decay curve against an untreated control."
    },
    {
      keys: ["safe", "toxic", "children", "food", "safety", "harmful", "non-toxic"],
      answer: "The core products are water-based, alcohol-free and non-leaching — the active stays bonded to the surface rather than transferring. Once cured they are safe around children, food preparation areas and animals.\n\nCertification covers **EN 1276**, **EN 13697**, **EN 14476** and **ISO 22196**. Full data sheets go out with every quote."
    },
    {
      keys: ["cost", "price", "how much", "budget", "quote", "pricing", "expensive"],
      answer: "For protection, cost depends on floor area, product and traffic level, so we'd rather give you a real number than an average that's wrong for your site. A quick [site survey](contact.html#book) gets you an exact quote — usually within a day or two of the visit.\n\nFor software, a typical build lands between **£9.5k and £30k**, with ops tools at the lower end and full mobile apps at the top. The [App Scoper](apps.html#scoper) produces a costed spec in about a minute.\n\nCareOps and CareRota are priced per home, per month, and quoted directly. [Book a demo](contact.html#book) and you'll get the number on the call."
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
      answer: "Straight through to a person:\n\n• **Email** — hello@protec-solutions.co.uk\n\nOr use the [booking form](contact.html#book). Fifteen minutes, no pitch deck, and you'll get a straight answer on whether we're the right fit."
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
    /* ---- care home software (docs/CARE-UPDATE.md 6.4 + product basics) ---- */
    {
      keys: ["careops", "what is careops", "care home software", "care software", "care home checks", "cqc evidence"],
      answer: "**CareOps** is care home software we built and run. It covers the operational side an inspector asks about: scheduled checks from a QR poster in each room (12 ready-made, from fridge temperatures to fire doors and legionella flushes), fault reporting, incidents, contractor services and key dates, staff compliance (DBS, right to work, training expiry), and a signed monthly governance pack.\n\nIt holds **no resident records** and works alongside the care records system you already have. Open the [sample report](https://careops.protec-solutions.co.uk/sample-report) or read more on the [CareOps page](careops.html)."
    },
    {
      keys: ["carerota", "rota", "shift cover", "dropped shift", "timesheets", "clock in"],
      answer: "**CareRota** handles rotas, cover and timesheets for care homes. When a shift drops, it's offered first to eligible staff (right role, in-date training, 11 hours' rest, under the 48-hour weekly cap), then widens in timed tiers until someone claims it.\n\nAlso: swaps, availability, leave, clock in at the door with a PIN, and payroll-ready timesheets. It holds staff data only, no resident records. More on the [CareRota page](carerota.html)."
    },
    {
      keys: ["dobs", "body map", "observations", "news2", "vital signs"],
      answer: "**DOBS** is our separate clinical observation tool: digital body maps, vital signs with NEWS2 scoring, neurological, behaviour, food and fluid, and sleep observations.\n\nUnlike CareOps and CareRota, DOBS **does hold resident clinical data**. Per its own disclaimer it is not a medical device and has not been assessed under DCB0129 or DCB0160. It has its own site at [dobs.app](https://dobs.app/)."
    },
    {
      keys: ["care planning", "care plan", "replace our care", "care records", "replace"],
      answer: "No. CareOps and CareRota cover operations, compliance evidence and staffing. Keep your care records system for assessments, care plans and daily notes.\n\nThey hold no resident information, so there's no clinical data migration and nothing overlaps your care planning system. [More on how it fits](care.html)."
    },
    {
      keys: ["resident data", "resident information", "resident records", "hold resident", "patient data"],
      answer: "**CareOps and CareRota do not hold resident information.** Free-text fields even carry a \"no names\" prompt.\n\nDOBS, our separate clinical observation tool, does hold resident data, and is described on [its own site](https://dobs.app/)."
    },
    {
      keys: ["cqc approved", "cqc compliant", "cqc certified", "cqc", "approved"],
      answer: "CQC does not approve software, so no software is \"CQC approved\".\n\nWhat CareOps does is produce dated, attributable records and exports organised by the regulations inspectors work to (Regs 9 to 20A). See the [sample report](https://careops.protec-solutions.co.uk/sample-report) for what that looks like."
    },
    {
      keys: ["own phone", "login", "staff need", "shared tablet", "staff login"],
      answer: "No. Staff without a login use a shared tablet with a PIN, or scan the QR poster in the room. Managers sign in with Microsoft 365 or an email link, and it installs to a phone home screen."
    },
    {
      keys: ["ai on our data", "use ai on", "ai on", "our data", "customer data"],
      answer: "No. No AI is run over customer data in CareOps or CareRota. DOBS' alerts are fixed rules, not a model.\n\nThe only AI on this site is this assistant, and it answers from published product facts. [AI information](ai-information.html) has the detail."
    },
    {
      keys: ["hello", "hi", "hey", "help", "what can you do", "start"],
      answer: "I can help with three things:\n\n**Protection** — Goldshield products, coverage, cost, application and certification.\n\n**Software** — bespoke web apps, mobile apps, portals, AI features, timelines and budgets.\n\n**Care home software** — CareOps (checks, incidents, compliance evidence) and CareRota (rotas and cover).\n\nAsk me anything, or hit one of the quick prompts below. Every tool on this site runs live in your browser."
    }
  ],

  fallback: "I don't have a specific answer to that one, but a human will. Email **hello@protec-solutions.co.uk** or use the [contact form](contact.html#book).\n\nIn the meantime, try asking about Goldshield products, coverage and cost, application methods, app development timelines, tech stack, or which sectors we work in."
};
