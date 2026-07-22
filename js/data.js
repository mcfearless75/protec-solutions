/* PROTEC SOLUTIONS — shared data: knowledge base, products, search index */

const PROTEC = {
  company: {
    name: "Protec Solutions",
    domain: "protec-solutions.co.uk",
    email: "hello@protec-solutions.co.uk",
    strapline: "Protection engineered twice over: certified Goldshield antimicrobial technology and bespoke software built for your sector."
  },

  products: [
    {
      id: "gs75",
      name: "Goldshield GS75",
      type: "Surface Protectant Concentrate",
      blurb: "Water-based antimicrobial surface treatment forming a covalently bonded shield that keeps working long after application.",
      duration: "Up to 90 days per application",
      coveragePerLitre: 60, // m² per diluted litre
      dilution: "1:64 concentrate",
      bestFor: ["healthcare", "education", "transport", "offices", "leisure"],
      surfaces: ["hard surfaces", "touch points", "fabrics", "flooring"],
      priceBand: "££"
    },
    {
      id: "gs5",
      name: "Goldshield GS5",
      type: "Ready-To-Use Surface Shield",
      blurb: "Ready-to-use spray for rapid deployment on high-touch surfaces. No dilution, no downtime — spray, wipe, protected.",
      duration: "Up to 30 days per application",
      coveragePerLitre: 25,
      dilution: "Ready to use",
      bestFor: ["hospitality", "retail", "gyms", "vehicles", "food service"],
      surfaces: ["touch points", "equipment", "counters", "vehicle interiors"],
      priceBand: "£"
    },
    {
      id: "gs20",
      name: "Goldshield Hand Sanitiser",
      type: "Persistent Hand Protection",
      blurb: "Alcohol-free foaming hand sanitiser that bonds to skin and continues protecting between washes — kind to skin, hard on microbes.",
      duration: "Up to 4 hours per application",
      coveragePerLitre: 0,
      dilution: "Ready to use",
      bestFor: ["healthcare", "education", "food service", "public venues"],
      surfaces: ["skin"],
      priceBand: "£"
    },
    {
      id: "gslaundry",
      name: "Goldshield Textile Shield",
      type: "Fabric & Laundry Additive",
      blurb: "Laundry-stage antimicrobial treatment for uniforms, linens and soft furnishings. Survives repeated wash cycles.",
      duration: "Up to 25 wash cycles",
      coveragePerLitre: 0,
      dilution: "Dose per load",
      bestFor: ["healthcare", "hospitality", "care homes", "sports"],
      surfaces: ["textiles", "uniforms", "linens", "upholstery"],
      priceBand: "££"
    }
  ],

  sectors: [
    { id: "healthcare", name: "Healthcare & Care Homes", icon: "✚", pain: "Infection control targets, CQC scrutiny, high-dependency residents", fit: "GS75 scheduled treatments + Textile Shield laundry programme + compliance reporting app" },
    { id: "education", name: "Education", icon: "◉", pain: "Absence rates, shared touch points, tight budgets", fit: "Termly GS75 treatment cycles with per-site coverage dashboards" },
    { id: "hospitality", name: "Hospitality & Leisure", icon: "▣", pain: "Guest confidence, review scores, fast room turnaround", fit: "GS5 rapid protocols + guest-facing certification badge" },
    { id: "transport", name: "Transport & Fleet", icon: "➤", pain: "Shared vehicles, driver welfare, downtime costs", fit: "GS5 cab treatments on service intervals, fleet tracking app" },
    { id: "facilities", name: "Facilities Management", icon: "⬢", pain: "Proving value to clients, SLA evidence, multi-site logistics", fit: "White-label Goldshield programmes + client evidence portals" },
    { id: "food", name: "Food Production & Service", icon: "◈", pain: "Audit trails, HACCP, allergen and hygiene management", fit: "Zoned GS75 programmes with digital audit trail software" }
  ],

  appServices: [
    { id: "webapps", name: "Bespoke Web Apps", blurb: "Portals, dashboards, booking engines, compliance systems — built around your workflow, not squeezed into someone else's template." },
    { id: "mobile", name: "Mobile Apps", blurb: "iOS and Android apps for field teams, customers and operations. Offline-first where the job demands it." },
    { id: "ai", name: "AI Integration", blurb: "Assistants, document intelligence, prediction and automation wired into the tools you already use." },
    { id: "portals", name: "Client & Compliance Portals", blurb: "Give your customers and auditors a live window into the work — evidence, certificates, schedules, sign-offs." }
  ],

  // ---------- searchable site index for the command palette ----------
  searchIndex: [
    { title: "Home", desc: "Protec Solutions — protection, engineered twice over", url: "index.html", icon: "⌂", keywords: "home main start protec" },
    { title: "Goldshield Products", desc: "Official Goldshield antimicrobial distribution", url: "goldshield.html", icon: "◆", keywords: "goldshield antimicrobial surface protection sanitiser biocide gs75 gs5 clean hygiene" },
    { title: "GS75 Surface Protectant", desc: "90-day bonded antimicrobial shield", url: "goldshield.html#products", icon: "◆", keywords: "gs75 concentrate 90 day surface long lasting" },
    { title: "GS5 Ready-To-Use", desc: "30-day rapid deployment spray", url: "goldshield.html#products", icon: "◆", keywords: "gs5 spray ready rtu quick" },
    { title: "Coverage Calculator", desc: "AI-assisted dosing, coverage & cost estimate", url: "goldshield.html#calculator", icon: "∑", keywords: "calculator coverage cost estimate quote litres m2 area price" },
    { title: "Product Recommender", desc: "Answer 3 questions, get the right product", url: "goldshield.html#recommender", icon: "✦", keywords: "recommend which product quiz choose help pick" },
    { title: "App Studio", desc: "Bespoke web & mobile app development", url: "apps.html", icon: "▦", keywords: "apps development software web mobile bespoke custom build" },
    { title: "AI Project Scoper", desc: "Generate a project brief & estimate in 60 seconds", url: "apps.html#scoper", icon: "✦", keywords: "scope brief estimate project cost app quote wizard" },
    { title: "Sectors", desc: "Healthcare, education, hospitality, transport & more", url: "sectors.html", icon: "⬢", keywords: "sectors industries healthcare education hospitality transport facilities food care" },
    { title: "AI Lab", desc: "Live demos of the AI we build into client projects", url: "ai-lab.html", icon: "◉", keywords: "ai lab demo voice assistant intelligence machine learning demos" },
    { title: "Contact", desc: "Start a conversation with the team", url: "contact.html", icon: "✉", keywords: "contact email enquiry quote call talk phone" }
  ],

  // ---------- assistant knowledge base ----------
  kb: [
    {
      k: ["hello", "hi", "hey", "morning", "afternoon", "start"],
      a: "Hello! I'm <strong>Shield</strong>, the Protec Solutions AI assistant. I can help with <strong>Goldshield antimicrobial products</strong>, our <strong>bespoke app development</strong>, pricing, coverage calculations, or finding the right solution for your sector. What would you like to know?"
    },
    {
      k: ["goldshield", "antimicrobial", "surface", "protect", "germ", "bacteria", "virus", "microbe", "hygiene", "clean"],
      a: "We're an <strong>official Goldshield distributor</strong>. Goldshield technology forms a covalently bonded antimicrobial layer on surfaces — a physical mechanism, not a chemical kill-and-fade, so protection persists for <strong>up to 90 days</strong> per application. The range covers surfaces (GS75, GS5), skin (persistent hand sanitiser) and textiles. Want me to point you at the <a href='goldshield.html#recommender'>product recommender</a> or the <a href='goldshield.html#calculator'>coverage calculator</a>?"
    },
    {
      k: ["gs75", "concentrate", "90", "long lasting", "dilution"],
      a: "<strong>GS75</strong> is our flagship concentrate: diluted 1:64, water-based, and it bonds to surfaces for <strong>up to 90 days of continuous antimicrobial protection</strong>. One diluted litre covers roughly 60m². It's the go-to for healthcare, education and scheduled facilities programmes. Try the <a href='goldshield.html#calculator'>coverage calculator</a> for your site."
    },
    {
      k: ["gs5", "spray", "ready", "rtu", "quick"],
      a: "<strong>GS5</strong> is the ready-to-use option — no dilution, no downtime. Spray, wipe, protected for <strong>up to 30 days</strong>. Ideal for hospitality turnarounds, fleet vehicles, gyms and retail counters. Roughly 25m² per litre."
    },
    {
      k: ["hand", "sanitiser", "sanitizer", "skin"],
      a: "The <strong>Goldshield Hand Sanitiser</strong> is alcohol-free and bonds to skin, so it keeps protecting for <strong>up to 4 hours</strong> — not just the few seconds of an alcohol gel. Kind to skin with repeated use, which matters in healthcare and food service."
    },
    {
      k: ["textile", "fabric", "laundry", "uniform", "linen", "wash"],
      a: "<strong>Goldshield Textile Shield</strong> is dosed at the laundry stage and survives <strong>up to 25 wash cycles</strong>. Used for uniforms, bed linens and soft furnishings in care homes, hotels and sports clubs."
    },
    {
      k: ["price", "cost", "quote", "much", "pricing", "expensive"],
      a: "Pricing depends on site size, product mix and treatment schedule. Two fast routes: run the <a href='goldshield.html#calculator'>coverage calculator</a> for an instant Goldshield estimate, or the <a href='apps.html#scoper'>AI project scoper</a> for app development budgets. For a formal quote, <a href='contact.html'>drop the team a message</a> — we respond within one working day."
    },
    {
      k: ["app", "software", "web", "mobile", "develop", "build", "bespoke", "portal", "dashboard", "system"],
      a: "Our <strong>App Studio</strong> builds bespoke web apps, mobile apps, client portals and AI-powered systems for every sector we serve — from compliance platforms to booking engines. Everything is built around your workflow, not a template. The <a href='apps.html#scoper'>AI project scoper</a> can generate a tailored brief and budget band in about 60 seconds."
    },
    {
      k: ["ai", "artificial", "intelligence", "machine learning", "chatbot", "assistant", "automation"],
      a: "AI is baked into what we build: assistants like me, document intelligence, predictive maintenance, smart scheduling and automation. The <a href='ai-lab.html'>AI Lab</a> has live demos you can play with right now — including voice control and instant analysis tools."
    },
    {
      k: ["healthcare", "care home", "hospital", "cqc", "nhs", "clinic"],
      a: "For <strong>healthcare and care homes</strong> we combine scheduled GS75 treatments, Textile Shield laundry programmes and hand hygiene — plus bespoke compliance apps that give you CQC-ready evidence trails. See <a href='sectors.html'>sectors</a> for the full picture."
    },
    {
      k: ["school", "education", "college", "nursery", "university"],
      a: "In <strong>education</strong>, termly GS75 treatment cycles cut the shared-touch-point transmission that drives absence. We pair it with per-site coverage dashboards so budget holders can see exactly what's protected and when it's due for renewal."
    },
    {
      k: ["hotel", "hospitality", "restaurant", "leisure", "gym", "pub"],
      a: "For <strong>hospitality and leisure</strong>: GS5 rapid protocols fit room-turnaround windows, and we provide guest-facing certification so protection becomes a visible selling point, not an invisible cost."
    },
    {
      k: ["transport", "fleet", "vehicle", "taxi", "bus", "van", "lorry"],
      a: "For <strong>transport and fleet</strong>: GS5 cab and interior treatments aligned to service intervals, with an optional fleet app tracking which vehicles are protected and when they're due."
    },
    {
      k: ["contact", "email", "phone", "call", "talk", "human", "person", "speak"],
      a: "You can reach the team via the <a href='contact.html'>contact page</a> — the smart enquiry form routes your message to the right specialist. We respond within <strong>one working day</strong>."
    },
    {
      k: ["how", "work", "science", "technology", "mechanism", "bond"],
      a: "The science, briefly: Goldshield molecules <strong>covalently bond</strong> to surfaces and form a layer of microscopic charged 'spikes'. Microbes landing on the surface are physically ruptured — a mechanical kill, so there's no chemical depletion and no contribution to antimicrobial resistance. That's why protection lasts weeks, not minutes. Full detail on the <a href='goldshield.html#science'>science section