/* ============================================================
   PROTEC SOLUTIONS — site engine
   Header, reveals, particle field, command palette, AI assistant.
   ============================================================ */

(() => {
  "use strict";

  /* ============================================================
     LIVE AI ENDPOINT — disabled by default
     ============================================================
     Leave this as an empty string and the assistant behaves exactly
     as it always has: pure client-side keyword matching against
     js/knowledge.js, no network calls, nothing to configure.

     To switch on the real Claude API, deploy the proxy in
     serverless/ (see serverless/README.md), then paste the deployed
     URL in here, e.g.:

       const PROTEC_AI_ENDPOINT = "https://your-site.netlify.app/.netlify/functions/protec-ai";

     When set, the assistant calls that endpoint first and only
     falls back to the existing keyword matcher if the call fails
     (network error, timeout, rate limit, proxy down) — so the
     widget can never appear broken to a visitor either way.
     ============================================================ */
  const PROTEC_AI_ENDPOINT = "https://protec-ai-proxy.netlify.app/.netlify/functions/protec-ai";

  const KB = window.PROTEC_KB;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // native CSS scroll-driven animations (animation-timeline: view()) --
  // see the "NATIVE SCROLL-DRIVEN REVEALS" block at the end of
  // css/style.css. When supported, that CSS handles .reveal entirely on
  // the compositor, so initReveal() below skips its own
  // IntersectionObserver loop rather than fighting the CSS for the same
  // element/class.
  const supportsScrollTimeline =
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline", "view()");
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(message) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }
  window.protecToast = toast;

  /* ---------- header ---------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = $(".nav-toggle");
    const nav = $(".nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        // drop the header's backdrop-filter blur while the full-screen mobile
        // nav is open — on some mobile GPU compositors, a blurred/translucent
        // ancestor behind a transform-based fixed overlay (sitting above the
        // constantly-animating background canvas) causes the overlay itself
        // to render translucent, letting page content bleed through the menu
        header.classList.toggle("nav-open", open);
        // swap hamburger -> close icon so it's visually obvious the same
        // button now dismisses the menu (see .nav-toggle z-index in
        // style.css for why this button must stay clickable while open)
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
      });
      nav.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          nav.classList.remove("open");
          header.classList.remove("nav-open");
          toggle.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    }
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    // Native CSS scroll-driven reveal takes over when supported, so we
    // skip the .in observer rather than fight it for the same opacity.
    // But we do NOT walk away entirely: a scroll-driven animation whose
    // range end is never reached holds a partial value forever, at a
    // cascade priority above any normal declaration, which would leave
    // content permanently invisible with no way to recover. The CSS
    // ranges are chosen to always be reachable; this watchdog exists so
    // that a wrong assumption degrades to "no animation" rather than
    // "no content". It should never fire in practice.
    if (supportsScrollTimeline) {
      const watch = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio < 0.5) return;
            const el = entry.target;
            // give the animation a moment, then check it actually resolved
            setTimeout(() => {
              if (!el.isConnected) return;
              const opacity = parseFloat(getComputedStyle(el).opacity);
              if (opacity < 0.9) el.classList.add("reveal-force");
            }, 700);
            watch.unobserve(el);
          });
        },
        { threshold: [0.5] }
      );
      items.forEach((el) => watch.observe(el));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- animated counters ---------- */
  function initCounters() {
    const nodes = $$("[data-count]");
    if (!nodes.length) return;
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((el) => (el.textContent = el.dataset.count));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nodes.forEach((el) => io.observe(el));
  }

  /* ---------- particle / molecular background ---------- */
  function initCanvas() {
    const canvas = $("#bg-canvas");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let w, h, dots, raf;
    const pointer = { x: -9999, y: -9999 };

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(1, 1);
      const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 22000), 90);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28 * dpr,
        vy: (Math.random() - 0.5) * 0.28 * dpr,
        r: (Math.random() * 1.6 + 0.7) * dpr
      }));
      canvas._dpr = dpr;
    }

    function frame() {
      const dpr = canvas._dpr;
      ctx.clearRect(0, 0, w, h);
      const linkDist = 130 * dpr;

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        const dx = d.x - pointer.x * dpr;
        const dy = d.y - pointer.y * dpr;
        const distToPointer = Math.hypot(dx, dy);
        const near = distToPointer < 160 * dpr;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = near ? "rgba(42,212,240,0.8)" : "rgba(154,163,178,0.30)";
        ctx.fill();
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(42,212,240,${alpha})`;
            ctx.lineWidth = 0.6 * dpr;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    frame();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      size();
      frame();
    });
    window.addEventListener("pointermove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else frame();
    });
  }

  /* ============================================================
     COMMAND PALETTE — fuzzy search across pages, tools, products
     ============================================================ */
  function initPalette() {
    const overlay = document.createElement("div");
    overlay.className = "palette-overlay";
    overlay.innerHTML = `
      <div class="palette" role="dialog" aria-modal="true" aria-label="Site search">
        <input type="text" placeholder="Search pages, tools, products…" aria-label="Search" autocomplete="off">
        <div class="palette-results"></div>
        <div class="palette-hint"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div>
      </div>`;
    document.body.appendChild(overlay);

    const input = $("input", overlay);
    const results = $(".palette-results", overlay);
    let items = [];
    let active = 0;

    const corpus = [
      ...KB.pages.map((p) => ({ ...p, group: "Page" })),
      ...KB.actions.map((a) => ({ ...a, group: "Tool" })),
      ...KB.products.map((p) => ({
        title: p.name, url: "goldshield.html#products", icon: "◈",
        desc: p.blurb, group: "Product"
      })),
      ...KB.sectors.map((s) => ({
        title: s.name, url: "sectors.html#" + s.id, icon: s.icon,
        desc: s.software, group: "Sector"
      }))
    ];

    function score(query, item) {
      const q = query.toLowerCase().trim();
      if (!q) return 1;
      const title = item.title.toLowerCase();
      const hay = (item.title + " " + item.desc + " " + item.group).toLowerCase();

      if (title.startsWith(q)) return 100;
      if (title.includes(q)) return 80;
      if (hay.includes(q)) return 55 - hay.indexOf(q) * 0.04;

      // every word of the query must appear somewhere
      const words = q.split(/\s+/);
      if (words.length > 1 && words.every((w) => hay.includes(w))) return 40;

      // subsequence fuzzy match against the title only, so a long
      // description can't accidentally satisfy every letter
      let idx = 0;
      for (const ch of q) {
        idx = title.indexOf(ch, idx);
        if (idx === -1) return 0;
        idx++;
      }
      return 18;
    }

    function render(query) {
      items = corpus
        .map((item) => ({ item, s: score(query, item) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 8)
        .map((r) => r.item);
      active = 0;

      if (!items.length) {
        results.innerHTML = `<div class="palette-empty">Nothing matched "${query.replace(/[<>&]/g, "")}". Try "coverage", "mobile app" or "healthcare".</div>`;
        return;
      }
      results.innerHTML = items
        .map((item, i) => `
          <button class="palette-item ${i === 0 ? "active" : ""}" data-url="${item.url}">
            <span class="pi-icon">${item.icon}</span>
            <span class="pi-txt"><strong>${item.title}</strong><span>${item.group} · ${item.desc}</span></span>
          </button>`)
        .join("");
      $$(".palette-item", results).forEach((btn, i) => {
        btn.addEventListener("click", () => go(i));
      });
    }

    function go(i) {
      const item = items[i];
      if (item) window.location.href = item.url;
    }

    function setActive(next) {
      const nodes = $$(".palette-item", results);
      if (!nodes.length) return;
      active = (next + nodes.length) % nodes.length;
      nodes.forEach((n, i) => n.classList.toggle("active", i === active));
      nodes[active].scrollIntoView({ block: "nearest" });
    }

    function open() {
      overlay.classList.add("open");
      input.value = "";
      render("");
      setTimeout(() => input.focus(), 30);
    }
    function close() { overlay.classList.remove("open"); }

    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") { e.preventDefault(); go(active); }
      else if (e.key === "Escape") close();
    });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        overlay.classList.contains("open") ? close() : open();
      }
    });
    $$(".search-trigger").forEach((btn) => btn.addEventListener("click", open));
    window.protecSearch = open;
  }

  /* ============================================================
     AI ASSISTANT — intent matching over the knowledge base
     ============================================================ */
  function initAssistant() {
    const fab = document.createElement("button");
    fab.className = "ai-fab";
    fab.setAttribute("aria-label", "Open the ProTec AI assistant");
    fab.innerHTML = `<span class="pulse" aria-hidden="true"></span>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>`;
    document.body.appendChild(fab);

    const panel = document.createElement("div");
    panel.className = "ai-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "ProTec AI assistant");
    panel.innerHTML = `
      <div class="ai-head">
        <div class="ai-avatar" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="12" cy="12" r="3.4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>
          </svg>
        </div>
        <div class="ai-head-txt"><strong>ProTec AI</strong><span>online · answers instantly</span></div>
        <button class="ai-close" aria-label="Close assistant">&times;</button>
      </div>
      <div class="ai-log" aria-live="polite"></div>
      <div class="ai-quick"></div>
      <form class="ai-input">
        <input type="text" placeholder="Ask about products, cost, apps…" aria-label="Message the assistant" autocomplete="off">
        <button type="button" class="ai-mic" aria-label="Voice input" title="Voice input">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>
          </svg>
        </button>
        <button type="submit" class="ai-send" aria-label="Send message">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </form>`;
    document.body.appendChild(panel);

    const log = $(".ai-log", panel);
    const form = $(".ai-input", panel);
    const input = $("input", form);
    const quick = $(".ai-quick", panel);
    let greeted = false;

    const PROMPTS = [
      "What is Goldshield?",
      "How much does an app cost?",
      "How long does protection last?",
      "Is it safe around children?",
      "What sectors do you cover?"
    ];

    function renderQuick(list) {
      quick.innerHTML = list.map((p) => `<button type="button">${p}</button>`).join("");
      $$("button", quick).forEach((btn) =>
        btn.addEventListener("click", () => ask(btn.textContent))
      );
    }

    function format(text) {
      return text
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/\n/g, "<br>");
    }

    function push(text, who) {
      const el = document.createElement("div");
      el.className = "msg msg-" + who;
      el.innerHTML = who === "bot" ? format(text) : text.replace(/[<>&]/g, "");
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    }

    function thinking() {
      const el = document.createElement("div");
      el.className = "msg msg-bot";
      el.innerHTML = `<span class="typing"><i></i><i></i><i></i></span>`;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    }

    /* intent resolution — weighted keyword overlap */
    function resolve(query) {
      const q = query.toLowerCase().replace(/[^\w\s]/g, " ");
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      let best = null;
      let bestScore = 0;

      for (const entry of KB.faq) {
        let s = 0;
        for (const key of entry.keys) {
          if (q.includes(key)) s += key.split(" ").length * 12;
          for (const w of words) {
            if (key.includes(w)) s += 3;
          }
        }
        if (s > bestScore) { bestScore = s; best = entry; }
      }

      // product name direct hit
      const product = KB.products.find((p) => {
        if (q.includes(p.id)) return true;
        // second word of the product name, e.g. "GS75" in "Goldshield GS75 ..."
        const distinctive = p.name.toLowerCase().split(" ")[1];
        return Boolean(distinctive) && q.includes(distinctive);
      });
      if (product && bestScore < 24) {
        return `**${product.name}**\n\n${product.blurb}\n\n• Coverage — ${product.coveragePerLitre} m² per litre\n• Durability — up to ${product.durabilityDays} days\n• Certification — ${product.certs.join(", ")}\n\nSuitable for: ${product.surfaces.join(", ")}.\n\n[Book a site survey](contact.html#book) for a firm quote against your floor area.`;
      }

      return bestScore >= 8 ? best.answer : KB.fallback;
    }

    function pickQuickPrompts() {
      return PROMPTS.filter(() => Math.random() > 0.35).slice(0, 3).length
        ? PROMPTS.sort(() => Math.random() - 0.5).slice(0, 3)
        : PROMPTS.slice(0, 3);
    }

    /* running transcript sent to the live endpoint for short-term context.
       Only used when PROTEC_AI_ENDPOINT is set — the default keyword-match
       path below ignores it entirely. */
    let liveHistory = [];
    const MAX_LIVE_HISTORY_TURNS = 8;

    /* calls the deployed serverless/ proxy — see serverless/README.md.
       Throws on any failure so the caller can fall back to resolve(). */
    async function fetchLiveReply(message, history) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      try {
        const res = await fetch(PROTEC_AI_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history }),
          signal: controller.signal
        });
        if (!res.ok) throw new Error("AI endpoint returned status " + res.status);
        const data = await res.json();
        if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
          throw new Error("AI endpoint returned an empty reply");
        }
        return data.reply;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    function ask(text) {
      if (!text.trim()) return;
      const submitted = text;
      push(submitted, "user");
      input.value = "";
      const bubble = thinking();

      /* ---------- live Claude API path (only when configured) ---------- */
      if (PROTEC_AI_ENDPOINT) {
        const historyForRequest = liveHistory.slice(-MAX_LIVE_HISTORY_TURNS * 2);
        fetchLiveReply(submitted, historyForRequest)
          .then((reply) => {
            bubble.innerHTML = format(reply);
            log.scrollTop = log.scrollHeight;
            liveHistory.push({ role: "user", content: submitted }, { role: "assistant", content: reply });
            liveHistory = liveHistory.slice(-MAX_LIVE_HISTORY_TURNS * 2);
            renderQuick(pickQuickPrompts());
          })
          .catch(() => {
            // live endpoint unreachable/erroring — fall back to the same
            // keyword matcher the site has always used, so the widget
            // never appears broken to a visitor
            bubble.innerHTML = format(resolve(submitted));
            log.scrollTop = log.scrollHeight;
            renderQuick(pickQuickPrompts());
          });
        return;
      }

      /* ---------- default path: unchanged client-side keyword matching ---------- */
      const delay = reduceMotion ? 120 : 420 + Math.random() * 380;
      setTimeout(() => {
        bubble.innerHTML = format(resolve(submitted));
        log.scrollTop = log.scrollHeight;
        renderQuick(pickQuickPrompts());
      }, delay);
    }
    window.protecAsk = (text) => { openPanel(); ask(text); };

    function openPanel() {
      panel.classList.add("open");
      fab.style.display = "none";
      if (!greeted) {
        greeted = true;
        setTimeout(() => {
          push(
            "Hello. I'm the ProTec assistant.\n\nI know our **Goldshield** protection range inside out, and I can scope a **bespoke app** build for you. What do you need?",
            "bot"
          );
          renderQuick(PROMPTS.slice(0, 3));
        }, 260);
      }
      setTimeout(() => input.focus(), 400);
    }
    function closePanel() {
      panel.classList.remove("open");
      fab.style.display = "grid";
    }

    fab.addEventListener("click", openPanel);
    $(".ai-close", panel).addEventListener("click", closePanel);
    form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
    });

    /* voice input where the browser supports it */
    const mic = $(".ai-mic", panel);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      mic.style.display = "none";
    } else {
      const recog = new SR();
      recog.lang = "en-GB";
      recog.interimResults = false;
      let listening = false;
      mic.addEventListener("click", () => {
        if (listening) { recog.stop(); return; }
        try { recog.start(); } catch (err) { toast("Voice input unavailable"); }
      });
      recog.addEventListener("start", () => { listening = true; mic.classList.add("listening"); });
      recog.addEventListener("end", () => { listening = false; mic.classList.remove("listening"); });
      recog.addEventListener("error", () => { listening = false; mic.classList.remove("listening"); toast("Could not hear that — try typing"); });
      recog.addEventListener("result", (e) => {
        const said = e.results[0][0].transcript;
        ask(said);
      });
    }

    // deep-link: open assistant with a preset question
    $$("[data-ask]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.protecAsk(el.dataset.ask);
      })
    );
  }

  /* ---------- stat band: cursor glow + staggered sweep ---------- */
  function initStatBand() {
    const bands = $$(".stat-band");
    if (!bands.length) return;
    bands.forEach((band) => {
      band.addEventListener("pointermove", (e) => {
        const stat = e.target.closest(".stat");
        if (!stat) return;
        const r = stat.getBoundingClientRect();
        stat.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        stat.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      }, { passive: true });

      if (reduceMotion || !("IntersectionObserver" in window)) {
        band.classList.add("in");
        return;
      }
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          band.classList.add("in");
          io.disconnect();
        }
      }, { threshold: 0.4 });
      io.observe(band);
    });
  }

  /* ---------- section dot-nav + back to top ---------- */
  function initSectionNav() {
    const sections = $$("main section").filter((s) => {
      // only sections with a real heading, and not hidden (e.g. the
      // Evidence section on goldshield.html stays hidden until real
      // citations exist — a hidden section must never appear as a
      // dot-nav target pointing at invisible content)
      return s.querySelector("h2, h1") && !s.hidden;
    });

    // back to top works on every page regardless of section count
    const toTop = document.createElement("button");
    toTop.className = "to-top";
    toTop.type = "button";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
    );
    document.body.appendChild(toTop);

    const onScrollTop = () => toTop.classList.toggle("show", window.scrollY > 600);
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });

    // dot-nav only earns its place when there are several sections
    if (sections.length < 3) return;

    const nav = document.createElement("nav");
    nav.className = "dotnav";
    nav.setAttribute("aria-label", "Page sections");

    sections.forEach((section, i) => {
      if (!section.id) section.id = "section-" + (i + 1);
      // prefer the short kicker ("The mechanism", "Live model") over the
      // long h2 headline — it reads far better in a compact tooltip
      const kicker = section.querySelector(".kicker");
      const heading = section.querySelector("h2, h1");
      let label;
      if (section.querySelector("h1")) {
        label = "Top"; // the hero — its kicker is a strapline, not a section name
      } else {
        label = (kicker?.textContent || heading?.textContent || "Section " + (i + 1)).trim();
        if (label.length > 28) label = label.slice(0, 26).trim() + "…";
      }

      const a = document.createElement("a");
      a.href = "#" + section.id;
      a.innerHTML = `<i aria-hidden="true"></i><span>${label.replace(/[<>&]/g, "")}</span>`;
      a.setAttribute("aria-label", label);
      nav.appendChild(a);
    });

    document.body.appendChild(nav);
    const dots = $$("a", nav);
    requestAnimationFrame(() => nav.classList.add("ready"));

    if (!("IntersectionObserver" in window)) return;

    // scroll-spy: mark whichever section currently owns the viewport
    const visible = new Map();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.intersectionRatio));
        let best = null, bestRatio = 0;
        visible.forEach((ratio, el) => {
          if (ratio > bestRatio) { bestRatio = ratio; best = el; }
        });
        if (!best) return;
        const idx = sections.indexOf(best);
        dots.forEach((d, i) => {
          d.classList.toggle("current", i === idx);
          if (i === idx) d.setAttribute("aria-current", "true");
          else d.removeAttribute("aria-current");
        });
      },
      { threshold: [0.15, 0.35, 0.6, 0.85], rootMargin: "-70px 0px 0px 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- smooth in-page anchors with header offset ---------- */
  function initAnchors() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", "#" + id);
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    initHeader();
    initReveal();
    initCounters();
    initCanvas();
    initPalette();
    initAssistant();
    initStatBand();
    initSectionNav();
    initAnchors();
    document.body.classList.add("grain");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
