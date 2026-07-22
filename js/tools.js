/* ============================================================
   PROTEC SOLUTIONS — interactive tool suite
   Every tool runs entirely client-side. No API, no backend.
   Each initialiser exits quietly if its markup isn't on the page.
   ============================================================ */

(() => {
  "use strict";

  const KB = window.PROTEC_KB;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const gbp = (n) =>
    "£" + Math.round(n).toLocaleString("en-GB");
  const toast = (m) => window.protecToast && window.protecToast(m);

  /* helper: single-select chip group */
  function chipGroup(container, onChange) {
    $$(".chip", container).forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip", container).forEach((c) => c.classList.remove("selected"));
        chip.classList.add("selected");
        onChange(chip.dataset.value, chip);
      });
    });
  }

  /* helper: multi-select chip group */
  function chipMulti(container, onChange) {
    $$(".chip", container).forEach((chip) => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
        onChange($$(".chip.selected", container).map((c) => c.dataset.value));
      });
    });
  }

  /* ============================================================
     1. COVERAGE CALCULATOR  (goldshield.html#calculator)
     ============================================================ */
  function initCalculator() {
    const root = $("#calculator");
    if (!root) return;

    const area = $("#calc-area", root);
    const areaOut = $("#calc-area-out", root);
    const productSel = $("#calc-product", root);
    const trafficWrap = $("#calc-traffic", root);
    const result = $("#calc-result", root);
    let traffic = "medium";

    KB.products.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      productSel.appendChild(opt);
    });

    const TRAFFIC = { low: 1, medium: 1.25, high: 1.6 };

    function compute() {
      const sqm = parseInt(area.value, 10);
      const product = KB.products.find((p) => p.id === productSel.value) || KB.products[0];
      const factor = TRAFFIC[traffic];

      const litres = (sqm / product.coveragePerLitre) * factor;
      const materialCost = litres * product.pricePerLitre;
      const applicationCost = sqm * 1.85;
      const total = materialCost + applicationCost;
      const perYear = Math.ceil(365 / product.durabilityDays);
      const annual = total * perYear;
      const perSqmYear = annual / sqm;

      result.hidden = false;
      result.innerHTML = `
        <h4>${product.name}</h4>
        <div class="big">${gbp(total)} <span style="font-size:.4em;color:var(--text-faint)">per treatment</span></div>
        <table>
          <tr><td>Area treated</td><td>${sqm.toLocaleString("en-GB")} m²</td></tr>
          <tr><td>Product required</td><td>${litres.toFixed(1)} litres</td></tr>
          <tr><td>Material cost</td><td>${gbp(materialCost)}</td></tr>
          <tr><td>Application &amp; labour</td><td>${gbp(applicationCost)}</td></tr>
          <tr><td>Protection duration</td><td>up to ${product.durabilityDays} days</td></tr>
          <tr><td>Treatments per year</td><td>${perYear}</td></tr>
          <tr><td><strong>Annual programme</strong></td><td><strong>${gbp(annual)}</strong></td></tr>
          <tr><td>Cost per m² per year</td><td>£${perSqmYear.toFixed(2)}</td></tr>
        </table>
        <p style="margin-top:1rem;font-size:.84rem;color:var(--text-faint)">
          Indicative figures based on ${traffic} traffic loading. A site survey confirms the final quote —
          volume and multi-site agreements typically reduce this by 12–20%.
        </p>
        <a class="btn btn-gold" style="margin-top:1.2rem" href="contact.html#book">Get this quoted properly</a>`;
    }

    area.addEventListener("input", () => {
      areaOut.textContent = parseInt(area.value, 10).toLocaleString("en-GB") + " m²";
      compute();
    });
    productSel.addEventListener("change", compute);
    chipGroup(trafficWrap, (v) => { traffic = v; compute(); });

    areaOut.textContent = parseInt(area.value, 10).toLocaleString("en-GB") + " m²";
    compute();
  }

  /* ============================================================
     2. PROTECTION SIMULATOR  (goldshield.html#simulator)
     Canvas chart: microbial load over 30 days, treated vs not.
     ============================================================ */
  function initSimulator() {
    const root = $("#simulator");
    if (!root) return;

    const canvas = $("#sim-canvas", root);
    const ctx = canvas.getContext("2d");
    const touchInput = $("#sim-touch", root);
    const touchOut = $("#sim-touch-out", root);
    const cleanInput = $("#sim-clean", root);
    const cleanOut = $("#sim-clean-out", root);
    const stats = $("#sim-stats", root);
    const replay = $("#sim-replay", root);

    let progress = 0;
    let raf;

    function series() {
      const touches = parseInt(touchInput.value, 10);   // touches per hour
      const cleans = parseInt(cleanInput.value, 10);    // manual cleans per day
      const untreated = [];
      const treated = [];
      let u = 20, t = 20;

      for (let day = 0; day <= 30; day++) {
        // untreated: recontaminates fast, manual cleaning only resets at the moment of cleaning
        const growth = touches * 1.9;
        const cleanEffect = Math.max(0.25, 1 - cleans * 0.16);
        u = Math.min(100, (u + growth) * cleanEffect);

        // treated: residual barrier suppresses regrowth, decays slowly over 90 days
        const barrier = 0.94 - (day / 30) * 0.16;
        t = Math.min(100, (t + growth * (1 - barrier)) * cleanEffect * 0.82);

        untreated.push(u);
        treated.push(Math.max(2, t));
      }
      return { untreated, treated };
    }

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.clientWidth, H = 260;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const pad = { l: 38, r: 12, t: 14, b: 26 };
      const cw = W - pad.l - pad.r;
      const ch = H - pad.t - pad.b;
      const { untreated, treated } = series();

      // grid
      ctx.strokeStyle = "rgba(35,41,54,1)";
      ctx.lineWidth = 1;
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#626c7d";
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + (ch / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
        ctx.fillText(String(100 - i * 25), 8, y + 3);
      }
      for (let d = 0; d <= 30; d += 10) {
        const x = pad.l + (cw / 30) * d;
        ctx.fillText("d" + d, x - 6, H - 8);
      }

      const shown = Math.floor(progress * 30);

      function plot(data, colour, fill) {
        ctx.beginPath();
        for (let d = 0; d <= shown; d++) {
          const x = pad.l + (cw / 30) * d;
          const y = pad.t + ch - (data[d] / 100) * ch;
          d === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colour;
        ctx.lineWidth = 2.4;
        ctx.lineJoin = "round";
        ctx.stroke();

        ctx.lineTo(pad.l + (cw / 30) * shown, pad.t + ch);
        ctx.lineTo(pad.l, pad.t + ch);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();

        if (shown > 0) {
          const x = pad.l + (cw / 30) * shown;
          const y = pad.t + ch - (data[shown] / 100) * ch;
          ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = colour; ctx.fill();
        }
      }

      plot(untreated, "#ef6a5a", "rgba(239,106,90,0.10)");
      plot(treated, "#45db66", "rgba(69,219,102,0.12)");

      if (progress >= 1) {
        const finalU = untreated[30], finalT = treated[30];
        const reduction = ((finalU - finalT) / finalU) * 100;
        const avgU = untreated.reduce((a, b) => a + b) / 31;
        const avgT = treated.reduce((a, b) => a + b) / 31;
        stats.hidden = false;
        stats.innerHTML = `
          <h4>30-day result</h4>
          <table>
            <tr><td>Untreated surface load (day 30)</td><td style="color:var(--danger)">${finalU.toFixed(0)} index</td></tr>
            <tr><td>Goldshield protected (day 30)</td><td style="color:var(--teal)">${finalT.toFixed(0)} index</td></tr>
            <tr><td>Average load reduction</td><td>${(((avgU - avgT) / avgU) * 100).toFixed(1)}%</td></tr>
            <tr><td><strong>Peak reduction</strong></td><td><strong>${reduction.toFixed(1)}%</strong></td></tr>
          </table>
          <p style="margin-top:.9rem;font-size:.84rem;color:var(--text-faint)">
            Modelled curve for illustration. Independent surface swab testing on your own site gives the audited figure —
            we arrange that as part of the programme.
          </p>`;
      }
    }

    function animate() {
      progress = Math.min(progress + 0.018, 1);
      draw();
      if (progress < 1) raf = requestAnimationFrame(animate);
    }

    function restart() {
      cancelAnimationFrame(raf);
      progress = 0;
      stats.hidden = true;
      animate();
    }

    touchInput.addEventListener("input", () => {
      touchOut.textContent = touchInput.value + " touches/hour";
      restart();
    });
    cleanInput.addEventListener("input", () => {
      cleanOut.textContent = cleanInput.value + "× per day";
      restart();
    });
    replay.addEventListener("click", restart);
    window.addEventListener("resize", draw);

    touchOut.textContent = touchInput.value + " touches/hour";
    cleanOut.textContent = cleanInput.value + "× per day";

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) { restart(); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(canvas);
    } else restart();
  }

  /* ============================================================
     3. PRODUCT ADVISOR  (goldshield.html#advisor)
     Four-question wizard scoring the catalogue.
     ============================================================ */
  function initAdvisor() {
    const root = $("#advisor");
    if (!root) return;

    const steps = $("#adv-steps", root);
    const body = $("#adv-body", root);
    const back = $("#adv-back", root);

    const QUESTIONS = [
      {
        q: "What are you protecting?",
        key: "surface",
        options: [
          { label: "Hard surfaces & touch points", value: "hard" },
          { label: "Soft furnishings & fabric", value: "soft" },
          { label: "Whole rooms or vehicles", value: "space" },
          { label: "Air handling / HVAC", value: "air" },
          { label: "People & hands", value: "hands" }
        ]
      },
      {
        q: "Which best describes the site?",
        key: "sector",
        options: KB.sectors.slice(0, 6).map((s) => ({ label: s.name, value: s.id }))
      },
      {
        q: "How heavy is the footfall?",
        key: "traffic",
        options: [
          { label: "Light — under 100 people a day", value: "low" },
          { label: "Steady — 100 to 500 a day", value: "medium" },
          { label: "Heavy — 500+ a day", value: "high" }
        ]
      },
      {
        q: "What matters most?",
        key: "priority",
        options: [
          { label: "Longest possible protection", value: "duration" },
          { label: "Lowest running cost", value: "cost" },
          { label: "Speed of application", value: "speed" },
          { label: "Certification & audit evidence", value: "certs" }
        ]
      }
    ];

    const answers = {};
    let step = 0;

    function renderSteps() {
      steps.innerHTML = QUESTIONS.map((_, i) =>
        `<i class="${i < step ? "done" : ""}"></i>`
      ).join("") + `<i class="${step > QUESTIONS.length - 1 ? "done" : ""}"></i>`;
    }

    function renderQuestion() {
      const q = QUESTIONS[step];
      back.hidden = step === 0;
      body.innerHTML = `
        <p class="wiz-q">${step + 1}. ${q.q}</p>
        <div class="chips" id="adv-chips">
          ${q.options.map((o) => `<button class="chip" data-value="${o.value}">${o.label}</button>`).join("")}
        </div>`;
      chipGroup($("#adv-chips", body), (v) => {
        answers[q.key] = v;
        step++;
        renderSteps();
        setTimeout(() => (step < QUESTIONS.length ? renderQuestion() : renderResult()), 220);
      });
      renderSteps();
    }

    function renderResult() {
      back.hidden = false;
      const scores = KB.products.map((p) => {
        let s = 0;
        const map = { hard: "gs75", soft: "gs5", space: "gsfog", air: "gsair", hands: "gshand" };
        if (map[answers.surface] === p.id) s += 50;
        if (p.sectors.includes(answers.sector)) s += 18;
        if (answers.priority === "duration") s += p.durabilityDays / 8;
        if (answers.priority === "cost") s += (100 - p.pricePerLitre) / 3 + p.coveragePerLitre / 12;
        if (answers.priority === "speed" && p.id === "gsfog") s += 22;
        if (answers.priority === "certs") s += p.certs.length * 7;
        if (answers.traffic === "high") s += p.durabilityDays / 12;
        return { p, s };
      }).sort((a, b) => b.s - a.s);

      const top = scores[0].p;
      const second = scores[1].p;
      const sector = KB.sectors.find((s) => s.id === answers.sector);
      const trafficLabel = { low: "light", medium: "steady", high: "heavy" }[answers.traffic];

      body.innerHTML = `
        <div class="tool-result" style="margin-top:0">
          <h4>Recommended: ${top.name}</h4>
          <p style="color:var(--text-dim);margin-bottom:.8rem">${top.blurb}</p>
          <table>
            <tr><td>Coverage</td><td>${top.coveragePerLitre} m² per litre</td></tr>
            <tr><td>Protection window</td><td>up to ${top.durabilityDays} days</td></tr>
            <tr><td>Indicative price</td><td>£${top.pricePerLitre} per litre</td></tr>
            <tr><td>Certification</td><td>${top.certs.join(", ")}</td></tr>
          </table>
          <p style="margin-top:1rem;font-size:.9rem;color:var(--text-dim)">
            For a <strong>${sector ? sector.name.toLowerCase() : "commercial"}</strong> site with ${trafficLabel} footfall,
            pair it with <strong>${second.name}</strong> to cover the surfaces the primary product doesn't reach.
            ${sector ? `<br><span style="color:var(--gold)">Sector note —</span> ${sector.note}` : ""}
          </p>
          <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.4rem">
            <a class="btn btn-gold" href="#calculator">Cost it up</a>
            <button class="btn btn-ghost" id="adv-restart" type="button">Start again</button>
          </div>
        </div>`;
      $("#adv-restart", body).addEventListener("click", () => { step = 0; renderQuestion(); });
      steps.innerHTML = QUESTIONS.map(() => `<i class="done"></i>`).join("") + `<i class="done"></i>`;
    }

    back.addEventListener("click", () => {
      if (step > 0) { step--; renderQuestion(); }
    });

    renderQuestion();
  }

  /* ============================================================
     4. APP SCOPER  (apps.html#scoper)
     Live spec builder: type + add-ons + urgency -> cost & timeline
     ============================================================ */
  function initScoper() {
    const root = $("#scoper");
    if (!root) return;

    const typeWrap = $("#scope-type", root);
    const addonWrap = $("#scope-addons", root);
    const urgencyWrap = $("#scope-urgency", root);
    const usersInput = $("#scope-users", root);
    const usersOut = $("#scope-users-out", root);
    const out = $("#scope-result", root);

    let type = "portal";
    let addons = [];
    let urgency = "standard";

    typeWrap.innerHTML = KB.appTypes
      .map((t, i) => `<button class="chip ${i === 0 ? "selected" : ""}" data-value="${t.id}">${t.name}</button>`)
      .join("");
    addonWrap.innerHTML = KB.addOns
      .map((a) => `<button class="chip" data-value="${a.id}">${a.name}</button>`)
      .join("");

    const URGENCY = {
      relaxed: { weeks: 1.2, cost: 0.92, label: "Relaxed — take the time to get it right" },
      standard: { weeks: 1, cost: 1, label: "Standard — normal sprint cadence" },
      fast: { weeks: 0.75, cost: 1.28, label: "Accelerated — parallel workstreams" }
    };

    function compute() {
      const base = KB.appTypes.find((t) => t.id === type);
      const picked = KB.addOns.filter((a) => addons.includes(a.id));
      const users = parseInt(usersInput.value, 10);
      const u = URGENCY[urgency];

      const scaleFactor = users > 5000 ? 1.22 : users > 1000 ? 1.12 : users > 250 ? 1.04 : 1;
      const addonWeeks = picked.reduce((s, a) => s + a.weeks, 0);
      const addonCost = picked.reduce((s, a) => s + a.cost, 0);

      const weeks = Math.round((base.baseWeeks + addonWeeks) * u.weeks);
      const cost = (base.baseCost + addonCost) * scaleFactor * u.cost;
      const sprints = Math.ceil(weeks / 2);
      const monthly = cost * 0.012 + 180;

      const phases = [
        { name: "Discovery & spec", pct: 0.12 },
        { name: "Design & prototype", pct: 0.18 },
        { name: "Build sprints", pct: 0.48 },
        { name: "Test & harden", pct: 0.14 },
        { name: "Launch & handover", pct: 0.08 }
      ];

      out.hidden = false;
      out.innerHTML = `
        <h4>${base.name}</h4>
        <div class="big">${gbp(cost * 0.88)} – ${gbp(cost * 1.12)}</div>
        <p style="color:var(--text-dim);font-size:.9rem;margin:.5rem 0 1rem">
          ${base.blurb} Delivered in <strong style="color:var(--text)">${weeks} weeks</strong>
          across ${sprints} two-week sprints.
        </p>
        <table>
          <tr><td>Core build</td><td>${gbp(base.baseCost)}</td></tr>
          ${picked.map((a) => `<tr><td>+ ${a.name}</td><td>${gbp(a.cost)}</td></tr>`).join("")}
          <tr><td>Scale factor (${users.toLocaleString("en-GB")} users)</td><td>×${scaleFactor.toFixed(2)}</td></tr>
          <tr><td>Delivery pace</td><td>×${u.cost.toFixed(2)}</td></tr>
          <tr><td><strong>Estimated total</strong></td><td><strong>${gbp(cost)}</strong></td></tr>
          <tr><td>Ongoing hosting &amp; support</td><td>${gbp(monthly)} / month</td></tr>
        </table>

        <h4 style="margin-top:1.5rem">Delivery phases</h4>
        <div style="display:grid;gap:.7rem;margin-top:.6rem">
          ${phases.map((ph) => `
            <div>
              <div style="display:flex;justify-content:space-between;font-size:.84rem;color:var(--text-dim)">
                <span>${ph.name}</span><span>${Math.max(1, Math.round(weeks * ph.pct))} wk</span>
              </div>
              <div class="meter teal"><i style="width:${ph.pct * 100}%"></i></div>
            </div>`).join("")}
        </div>

        <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.6rem">
          <a class="btn btn-teal" href="contact.html#book">Turn this into a proposal</a>
          <button class="btn btn-ghost" type="button" id="scope-copy">Copy spec</button>
        </div>
        <p style="margin-top:1rem;font-size:.82rem;color:var(--text-faint)">
          Indicative range from real project data. Fixed price confirmed after a discovery session — no open-ended day rates.
        </p>`;

      $("#scope-copy", out).addEventListener("click", () => {
        const spec = [
          `PROTEC SOLUTIONS — indicative scope`,
          `Project type: ${base.name}`,
          `Add-ons: ${picked.length ? picked.map((a) => a.name).join(", ") : "none"}`,
          `Expected users: ${users.toLocaleString("en-GB")}`,
          `Delivery pace: ${u.label}`,
          `Timeline: ${weeks} weeks (${sprints} sprints)`,
          `Estimated total: ${gbp(cost * 0.88)} – ${gbp(cost * 1.12)}`,
          `Ongoing: ${gbp(monthly)} / month`,
          ``,
          `Generated at protec-solutions.co.uk/apps`
        ].join("\n");
        navigator.clipboard?.writeText(spec).then(
          () => toast("Spec copied to clipboard"),
          () => toast("Copy failed — select the text manually")
        );
      });
    }

    chipGroup(typeWrap, (v) => { type = v; compute(); });
    chipMulti(addonWrap, (v) => { addons = v; compute(); });
    chipGroup(urgencyWrap, (v) => { urgency = v; compute(); });
    usersInput.addEventListener("input", () => {
      usersOut.textContent = parseInt(usersInput.value, 10).toLocaleString("en-GB") + " users";
      compute();
    });

    usersOut.textContent = parseInt(usersInput.value, 10).toLocaleString("en-GB") + " users";
    compute();
  }

  /* ============================================================
     5. TECH STACK PICKER  (apps.html#stack)
     ============================================================ */
  function initStack() {
    const root = $("#stack");
    if (!root) return;
    const wrap = $("#stack-choices", root);
    const out = $("#stack-result", root);

    const STACKS = {
      web: {
        name: "Progressive web application",
        rows: [
          ["Front end", "React with Vite, TypeScript"],
          ["Styling", "Tailwind with a bespoke token layer"],
          ["Back end", "Node API on Railway"],
          ["Database", "Postgres via Supabase"],
          ["Auth", "Supabase Auth, SSO ready"],
          ["Hosting", "Netlify edge, global CDN"]
        ],
        note: "One codebase, installable on desktop and mobile, no app store review cycle."
      },
      native: {
        name: "Cross-platform mobile",
        rows: [
          ["Framework", "React Native with Expo"],
          ["State", "TanStack Query plus Zustand"],
          ["Back end", "Node API with typed contracts"],
          ["Database", "Postgres with offline sync layer"],
          ["Push", "Expo notifications"],
          ["Distribution", "App Store and Google Play"]
        ],
        note: "One build ships to both stores. Offline-first so the app works in a basement or a van."
      },
      internal: {
        name: "Internal operations tool",
        rows: [
          ["Front end", "Server-rendered, minimal JS"],
          ["Back end", "Python with Flask"],
          ["Database", "Postgres"],
          ["Reporting", "Excel export via xlwings"],
          ["Auth", "Microsoft 365 SSO"],
          ["Hosting", "Railway, private network"]
        ],
        note: "Boring by design. Fast to build, cheap to run, easy for the next person to maintain."
      },
      commerce: {
        name: "Commerce platform",
        rows: [
          ["Storefront", "Headless with static generation"],
          ["Commerce engine", "Shopify or bespoke depending on catalogue"],
          ["Payments", "Stripe with saved cards"],
          ["Search", "Client-side index, instant results"],
          ["CMS", "Editor-friendly, no developer needed"],
          ["Hosting", "Vercel with edge caching"]
        ],
        note: "Sub-second product pages. SEO structure built in from day one, not retrofitted."
      },
      ai: {
        name: "AI-native application",
        rows: [
          ["Model layer", "Claude API with tool use"],
          ["Orchestration", "Typed agent pipeline"],
          ["Vector store", "Postgres with pgvector"],
          ["Front end", "React with streaming responses"],
          ["Guardrails", "Structured output validation"],
          ["Hosting", "Railway with request queuing"]
        ],
        note: "The AI does real work against your data rather than answering trivia in a chat box."
      }
    };

    wrap.innerHTML = Object.entries(STACKS)
      .map(([k, v], i) => `<button class="chip ${i === 0 ? "selected" : ""}" data-value="${k}">${v.name}</button>`)
      .join("");

    function render(key) {
      const s = STACKS[key];
      out.hidden = false;
      out.innerHTML = `
        <h4>${s.name}</h4>
        <table>${s.rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>
        <p style="margin-top:1rem;font-size:.88rem;color:var(--text-dim)">${s.note}</p>`;
    }

    chipGroup(wrap, render);
    render("web");
  }

  /* ============================================================
     6. FEATURE PRIORITISER  (apps.html#prioritiser)
     Impact vs effort scatter, rendered live.
     ============================================================ */
  function initPrioritiser() {
    const root = $("#prioritiser");
    if (!root) return;

    const list = $("#prio-list", root);
    const form = $("#prio-form", root);
    const nameInput = $("#prio-name", root);
    const impact = $("#prio-impact", root);
    const effort = $("#prio-effort", root);
    const impactOut = $("#prio-impact-out", root);
    const effortOut = $("#prio-effort-out", root);
    const plot = $("#prio-plot", root);

    let features = [
      { name: "User login & roles", impact: 9, effort: 3 },
      { name: "Automated reporting", impact: 8, effort: 5 },
      { name: "Mobile offline mode", impact: 6, effort: 8 },
      { name: "AI assistant", impact: 9, effort: 6 }
    ];

    function verdict(f) {
      const ratio = f.impact / f.effort;
      if (ratio >= 2) return { label: "Do first", colour: "var(--teal)" };
      if (ratio >= 1) return { label: "Schedule", colour: "var(--gold)" };
      if (f.impact >= 7) return { label: "Phase two", colour: "var(--text-dim)" };
      return { label: "Cut it", colour: "var(--danger)" };
    }

    function render() {
      const sorted = [...features].sort((a, b) => b.impact / b.effort - a.impact / a.effort);
      list.innerHTML = sorted
        .map((f) => {
          const v = verdict(f);
          const i = features.indexOf(f);
          return `
            <div style="display:flex;align-items:center;gap:1rem;padding:.75rem 0;border-bottom:1px solid var(--line)">
              <span style="flex:1;font-weight:600;font-size:.95rem">${f.name}</span>
              <span style="font-family:var(--font-mono);font-size:.74rem;color:var(--text-faint)">I${f.impact} / E${f.effort}</span>
              <span style="font-size:.76rem;font-weight:700;color:${v.colour};white-space:nowrap">${v.label}</span>
              <button type="button" data-remove="${i}" aria-label="Remove ${f.name}"
                style="background:none;border:0;color:var(--text-faint);font-size:1.2rem;line-height:1;cursor:pointer">&times;</button>
            </div>`;
        })
        .join("");

      $$("[data-remove]", list).forEach((btn) =>
        btn.addEventListener("click", () => {
          features.splice(parseInt(btn.dataset.remove, 10), 1);
          render();
        })
      );

      plot.innerHTML = features
        .map((f) => {
          const v = verdict(f);
          const x = ((f.effort - 1) / 9) * 100;
          const y = 100 - ((f.impact - 1) / 9) * 100;
          return `<span title="${f.name}" style="position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);
            width:13px;height:13px;border-radius:50%;background:${v.colour};box-shadow:0 0 0 4px ${v.colour}22"></span>`;
        })
        .join("");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      if (!name) return;
      if (features.length >= 12) { toast("Twelve is plenty — cut something first"); return; }
      features.push({ name, impact: parseInt(impact.value, 10), effort: parseInt(effort.value, 10) });
      nameInput.value = "";
      render();
      toast("Added — check the quadrant");
    });

    impact.addEventListener("input", () => (impactOut.textContent = impact.value));
    effort.addEventListener("input", () => (effortOut.textContent = effort.value));
    impactOut.textContent = impact.value;
    effortOut.textContent = effort.value;
    render();
  }

  /* ============================================================
     7. AI READINESS SCORE  (ai-lab.html#readiness)
     ============================================================ */
  function initReadiness() {
    const root = $("#readiness");
    if (!root) return;

    const body = $("#ready-body", root);
    const steps = $("#ready-steps", root);

    const Q = [
      { q: "Where does your operational data live today?", opts: [["Spreadsheets and email", 1], ["Mix of systems, some manual", 2], ["Central system, some gaps", 3], ["Single source of truth, clean", 4]] },
      { q: "How much of your team's week is repetitive admin?", opts: [["More than half", 4], ["Around a third", 3], ["Maybe a fifth", 2], ["Very little", 1]] },
      { q: "Can your systems talk to each other?", opts: [["Not at all", 1], ["Manual export and import", 2], ["Some API links", 3], ["Fully integrated", 4]] },
      { q: "How is your team likely to react to AI tooling?", opts: [["Resistant", 1], ["Cautious", 2], ["Curious", 3], ["Already using it", 4]] },
      { q: "Is there a clear owner for a project like this?", opts: [["Nobody obvious", 1], ["Shared responsibility", 2], ["A named lead", 3], ["Lead plus budget", 4]] }
    ];

    let step = 0;
    let score = 0;

    function renderSteps() {
      steps.innerHTML = Q.map((_, i) => `<i class="${i < step ? "done" : ""}"></i>`).join("");
    }

    function renderQ() {
      const item = Q[step];
      body.innerHTML = `
        <p class="wiz-q">${step + 1} of ${Q.length}. ${item.q}</p>
        <div class="chips" id="ready-chips">
          ${item.opts.map(([label, val]) => `<button class="chip" data-value="${val}">${label}</button>`).join("")}
        </div>`;
      chipGroup($("#ready-chips", body), (v) => {
        score += parseInt(v, 10);
        step++;
        renderSteps();
        setTimeout(() => (step < Q.length ? renderQ() : renderResult()), 220);
      });
      renderSteps();
    }

    function renderResult() {
      const max = Q.length * 4;
      const pct = Math.round((score / max) * 100);
      let band, advice;
      if (pct >= 80) {
        band = "Ready to build";
        advice = "Your foundations are solid. Skip the pilot theatre and go straight to a production build — an AI copilot inside your existing workflow will pay back inside two quarters.";
      } else if (pct >= 60) {
        band = "Ready with groundwork";
        advice = "You are close. One integration layer and a clean data model stand between you and a genuinely useful AI feature. Budget two to three weeks for that groundwork, then build.";
      } else if (pct >= 40) {
        band = "Foundations first";
        advice = "AI on messy data produces confident nonsense. Consolidate the systems first — usually an internal ops tool — then layer AI on top of clean records. The tool pays for itself before the AI arrives.";
      } else {
        band = "Start with the basics";
        advice = "The win here is not AI, it is getting off spreadsheets. A straightforward internal tool would remove most of the repetitive admin. Revisit AI once the data has somewhere to live.";
      }

      body.innerHTML = `
        <div class="tool-result" style="margin-top:0">
          <h4>${band}</h4>
          <div class="big">${pct}<span style="font-size:.45em;color:var(--text-faint)">/100</span></div>
          <div class="meter" style="margin:1rem 0 1.4rem"><i style="width:${pct}%"></i></div>
          <p style="color:var(--text-dim);font-size:.95rem">${advice}</p>
          <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.5rem">
            <a class="btn btn-gold" href="contact.html#book">Discuss the result</a>
            <button class="btn btn-ghost" type="button" id="ready-again">Score again</button>
          </div>
        </div>`;
      $("#ready-again", body).addEventListener("click", () => { step = 0; score = 0; renderQ(); });
      steps.innerHTML = Q.map(() => `<i class="done"></i>`).join("");
    }

    renderQ();
  }

  /* ============================================================
     8. COPY GENERATOR  (ai-lab.html#copygen)
     Template engine with sector and tone variation.
     ============================================================ */
  function initCopyGen() {
    const root = $("#copygen");
    if (!root) return;

    const bizInput = $("#cg-biz", root);
    const toneWrap = $("#cg-tone", root);
    const typeWrap = $("#cg-type", root);
    const btn = $("#cg-run", root);
    const out = $("#cg-result", root);

    let tone = "direct";
    let type = "headline";

    const TONE_WORDS = {
      direct: { adj: ["No nonsense", "Straight", "Built properly", "Done right"], verb: ["fixes", "handles", "removes", "sorts"] },
      premium: { adj: ["Considered", "Precision-engineered", "Uncompromising", "Refined"], verb: ["elevates", "refines", "perfects", "transforms"] },
      warm: { adj: ["Friendly", "Genuinely helpful", "On your side", "Human"], verb: ["helps", "supports", "looks after", "takes care of"] },
      bold: { adj: ["Relentless", "Unfair advantage", "Category-defining", "Built to win"], verb: ["dominates", "outpaces", "obliterates", "rewrites"] }
    };

    function pick(arr, seed) { return arr[seed % arr.length]; }

    function generate() {
      const biz = bizInput.value.trim() || "your business";
      const t = TONE_WORDS[tone];
      const seed = biz.length + Date.now() % 97;
      const adj = pick(t.adj, seed);
      const verb = pick(t.verb, seed + 3);

      let blocks = [];

      if (type === "headline") {
        blocks = [
          { h: "Primary headline", b: `${adj}. ${biz.charAt(0).toUpperCase() + biz.slice(1)}, ${verb === "fixes" ? "finally working the way it should" : "built the way it should be"}.` },
          { h: "Alternative", b: `The ${biz} problem nobody wants to talk about. We ${verb} it.` },
          { h: "Short and sharp", b: `${biz.charAt(0).toUpperCase() + biz.slice(1)}. Sorted.` },
          { h: "Subheadline", b: `Purpose-built for teams who have outgrown the spreadsheet but refuse to pay enterprise prices for software that still doesn't fit.` }
        ];
      } else if (type === "about") {
        blocks = [
          { h: "About paragraph", b: `We work with ${biz} operators who know exactly what is broken and are tired of being sold a platform that solves something else. Our approach is simple: understand the process first, build to that process second, and hand over something your team actually wants to open on a Monday morning.` },
          { h: "Positioning line", b: `${adj} delivery for ${biz}. No day rates, no scope creep, no six-month discovery phase.` }
        ];
      } else if (type === "cta") {
        blocks = [
          { h: "Primary CTA", b: `See what this looks like for ${biz}` },
          { h: "Low-commitment CTA", b: `Fifteen minutes. No pitch deck.` },
          { h: "Urgency CTA", b: `Book the survey — sites are scheduled two weeks out` },
          { h: "Supporting line", b: `You will get a straight answer on fit, cost and timeline. If we are not right for it, we will say so.` }
        ];
      } else {
        blocks = [
          { h: "Meta title", b: `${biz.charAt(0).toUpperCase() + biz.slice(1)} Specialists | ProTec Solutions UK` },
          { h: "Meta description", b: `${adj} ${biz} services across the UK. Goldshield antimicrobial protection and bespoke software built around how you actually work. Free consultation.` },
          { h: "Open Graph title", b: `${biz.charAt(0).toUpperCase() + biz.slice(1)} — done properly | ProTec Solutions` }
        ];
      }

      out.hidden = false;
      out.innerHTML = `
        <h4>Generated copy</h4>
        <div style="display:grid;gap:1rem;margin-top:.8rem">
          ${blocks.map((b, i) => `
            <div style="border:1px solid var(--line);border-radius:10px;padding:1rem;background:var(--bg-raised)">
              <div style="font-family:var(--font-mono);font-size:.66rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem">${b.h}</div>
              <p style="font-size:.97rem;line-height:1.6">${b.b}</p>
              <button type="button" class="chip" data-copy="${i}" style="margin-top:.7rem;font-size:.74rem;padding:.3rem .8rem">Copy</button>
            </div>`).join("")}
        </div>
        <p style="margin-top:1.1rem;font-size:.82rem;color:var(--text-faint)">
          Generated from a structured template engine running in your browser. On a live project this runs against the
          Claude API with your brand guidelines loaded, and the output is considerably sharper.
        </p>`;

      $$("[data-copy]", out).forEach((b) =>
        b.addEventListener("click", () => {
          navigator.clipboard?.writeText(blocks[parseInt(b.dataset.copy, 10)].b)
            .then(() => toast("Copied"), () => toast("Copy failed"));
        })
      );
    }

    chipGroup(toneWrap, (v) => { tone = v; if (!out.hidden) generate(); });
    chipGroup(typeWrap, (v) => { type = v; if (!out.hidden) generate(); });
    btn.addEventListener("click", generate);
    bizInput.addEventListener("keydown", (e) => { if (e.key === "Enter") generate(); });
  }

  /* ============================================================
     9. ROI MODELLER  (ai-lab.html#roi)
     ============================================================ */
  function initROI() {
    const root = $("#roi");
    if (!root) return;

    const inputs = {
      staff: $("#roi-staff", root),
      hours: $("#roi-hours", root),
      rate: $("#roi-rate", root),
      build: $("#roi-build", root)
    };
    const outs = {
      staff: $("#roi-staff-out", root),
      hours: $("#roi-hours-out", root),
      rate: $("#roi-rate-out", root),
      build: $("#roi-build-out", root)
    };
    const result = $("#roi-result", root);

    function compute() {
      const staff = +inputs.staff.value;
      const hours = +inputs.hours.value;
      const rate = +inputs.rate.value;
      const build = +inputs.build.value;

      const weeklyHoursSaved = staff * hours * 0.68;   // realistic 68% automation of the identified admin
      const weeklySaving = weeklyHoursSaved * rate;
      const annualSaving = weeklySaving * 46;          // 46 working weeks
      const running = build * 0.012 * 12 + 2160;
      const netYearOne = annualSaving - build - running;
      const paybackMonths = annualSaving > running ? (build / ((annualSaving - running) / 12)) : Infinity;
      const threeYear = annualSaving * 3 - build - running * 3;

      outs.staff.textContent = staff + " people";
      outs.hours.textContent = hours + " hrs/week each";
      outs.rate.textContent = "£" + rate + "/hour";
      outs.build.textContent = gbp(build);

      const positive = netYearOne > 0;
      result.hidden = false;
      result.innerHTML = `
        <h4>Return model</h4>
        <div class="big" style="color:${positive ? "var(--teal)" : "var(--danger)"}">
          ${positive ? "+" : ""}${gbp(netYearOne)} <span style="font-size:.4em;color:var(--text-faint)">year one net</span>
        </div>
        <table>
          <tr><td>Hours reclaimed weekly</td><td>${weeklyHoursSaved.toFixed(0)} hrs</td></tr>
          <tr><td>Weekly saving</td><td>${gbp(weeklySaving)}</td></tr>
          <tr><td>Annual saving (46 weeks)</td><td>${gbp(annualSaving)}</td></tr>
          <tr><td>Build investment</td><td>${gbp(build)}</td></tr>
          <tr><td>Annual running cost</td><td>${gbp(running)}</td></tr>
          <tr><td>Payback period</td><td>${isFinite(paybackMonths) ? paybackMonths.toFixed(1) + " months" : "not within model"}</td></tr>
          <tr><td><strong>Three-year net</strong></td><td><strong style="color:${threeYear > 0 ? "var(--teal)" : "var(--danger)"}">${gbp(threeYear)}</strong></td></tr>
        </table>
        <div class="meter teal" style="margin-top:1.2rem">
          <i style="width:${Math.min(100, Math.max(2, (annualSaving / Math.max(build, 1)) * 50))}%"></i>
        </div>
        <p style="margin-top:.6rem;font-size:.82rem;color:var(--text-faint)">
          Assumes 68% of the identified admin is automated — deliberately conservative. Most builds land higher
          once the second and third workflow move across.
        </p>`;
    }

    Object.values(inputs).forEach((i) => i.addEventListener("input", compute));
    compute();
  }

  /* ============================================================
     10. SECTOR MATCHER  (sectors.html#matcher)
     ============================================================ */
  function initSectorMatcher() {
    const root = $("#matcher");
    if (!root) return;
    const wrap = $("#matcher-choices", root);
    const out = $("#matcher-result", root);

    wrap.innerHTML = KB.sectors
      .map((s) => `<button class="chip" data-value="${s.id}">${s.icon} ${s.name}</button>`)
      .join("");

    chipGroup(wrap, (id) => {
      const s = KB.sectors.find((x) => x.id === id);
      const products = KB.products.filter((p) => p.sectors.includes(id));
      out.hidden = false;
      out.innerHTML = `
        <h4>${s.icon} ${s.name}</h4>
        <table>
          <tr><td>Recommended protection</td><td>${s.protection}</td></tr>
          <tr><td>Software that fits</td><td>${s.software}</td></tr>
        </table>
        <p style="margin:1rem 0;font-size:.95rem;color:var(--text-dim)">
          <span style="color:var(--gold)">The honest bit —</span> ${s.note}
        </p>
        ${products.length ? `
          <div style="font-family:var(--font-mono);font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:var(--text-faint);margin:1.2rem 0 .6rem">
            Products used in this sector
          </div>
          <div class="chips">
            ${products.map((p) => `<span class="chip" style="cursor:default">${p.name}</span>`).join("")}
          </div>` : ""}
        <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.5rem">
          <a class="btn btn-gold" href="goldshield.html#calculator">Cost the protection</a>
          <a class="btn btn-ghost" href="apps.html#scoper">Scope the software</a>
        </div>`;
    });
  }

  /* ============================================================
     11. CONTACT FORM  (contact.html#book)
     Static-site safe: builds a mailto with everything captured.
     ============================================================ */
  function initContact() {
    const form = $("#contact-form");
    if (!form) return;
    const interestWrap = $("#contact-interest");
    let interests = [];

    if (interestWrap) chipMulti(interestWrap, (v) => (interests = v));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (!data.name || !data.email) { toast("Name and email please"); return; }

      const body = [
        `Name: ${data.name}`,
        `Company: ${data.company || "—"}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "—"}`,
        `Sector: ${data.sector || "—"}`,
        `Interested in: ${interests.length ? interests.join(", ") : "—"}`,
        `Budget: ${data.budget || "—"}`,
        ``,
        `Message:`,
        data.message || "—"
      ].join("\n");

      const url = `mailto:${KB.company.email}?subject=${encodeURIComponent(
        "Website enquiry — " + (data.company || data.name)
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = url;

      const status = $("#contact-status");
      if (status) {
        status.hidden = false;
        status.innerHTML = `
          <h4>Your email client is opening</h4>
          <p style="color:var(--text-dim);font-size:.93rem">
            Everything you entered has been packaged into a message to
            <strong>${KB.company.email}</strong>. If nothing opened, email us directly and paste the details below.
          </p>
          <pre style="margin-top:1rem;white-space:pre-wrap;font-family:var(--font-mono);font-size:.78rem;color:var(--text-dim);background:var(--bg-raised);padding:1rem;border-radius:10px;border:1px solid var(--line)">${body.replace(/[<>&]/g, "")}</pre>`;
        status.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast("Enquiry prepared");
    });
  }

  /* ---------- boot every tool present on the page ---------- */
  function boot() {
    [
      initCalculator, initSimulator, initAdvisor, initScoper, initStack,
      initPrioritiser, initReadiness, initCopyGen, initROI,
      initSectorMatcher, initContact
    ].forEach((fn) => {
      try { fn(); } catch (err) { console.error("[protec] tool failed:", fn.name, err); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
