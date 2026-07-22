/* ============================================================
   PROTEC SOLUTIONS — Goldshield mechanism visualisation
   Raw WebGL, no dependencies, no build step. Renders the three
   stage antimicrobial mechanism ("How it works" on goldshield.html)
   as a scroll-scrubbed diagram: a treated surface grows a layer of
   charged spikes, microbes fall in and rupture on contact, then the
   layer settles into a steady, self-sustaining state.

   Contract with the page:
   - Lazy: does nothing until the panel scrolls near the viewport.
   - Falls back cleanly: if WebGL is unavailable, the whole panel
     is hidden and the existing static .card grid stands alone.
   - Reduced motion: draws one static frame per stage, never loops.
   - Pauses whenever the panel is offscreen or the tab is hidden.
   - Keyboard accessible stage buttons + a screen-reader text
     alternative are in the markup already (goldshield.html);
     this file only wires behaviour, it does not author copy.
   ============================================================ */

(() => {
  "use strict";

  const root = document.querySelector(".mech-viz");
  if (!root) return; // this page has no mechanism panel

  const canvas = document.getElementById("mech-canvas");
  const wrap = root.querySelector(".mech-canvas-wrap");
  const controls = root.querySelector(".mech-controls");
  const stageNumEl = root.querySelector(".mech-stage-num");
  const stageNameEl = root.querySelector(".mech-stage-name");
  const buttons = controls ? [...controls.querySelectorAll(".mech-btn")] : [];
  const section = root.closest("section") || root;

  if (!canvas || !wrap) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STAGES = [
    { name: "Bonds on application" },
    { name: "Attracts and ruptures" },
    { name: "Keeps working" }
  ];

  const COLOR_CYAN = [42 / 255, 212 / 255, 240 / 255];
  const COLOR_GREEN = [69 / 255, 219 / 255, 102 / 255];
  const COLOR_LINE = [28 / 255, 43 / 255, 69 / 255];

  /* ---------- tiny deterministic PRNG ----------
     Keeps the spike/microbe layout stable across re-renders and
     resizes instead of re-randomising (and visibly jumping) every
     time draw() runs. */
  function makeRng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  /* ---------- WebGL bootstrap ----------
     Nothing here touches the GPU at parse time. Context creation,
     shader compile/link and buffer setup all live in setupGL() below,
     which only runs from init() -- and init() only runs on first
     intersection (see the IntersectionObserver near the bottom of
     this file). A visitor who never scrolls the panel into view never
     causes a WebGL context, program or buffer to be created. */
  let gl = null;
  let shapeProgram = null;
  let pointProgram = null;
  let shapeBuffer = null;
  let pointBuffer = null;
  let shapeLoc = null;
  let pointLoc = null;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function link(vsSrc, fsSrc) {
    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    return prog;
  }

  /* Creates the GL context, compiles/links both programs and creates
     the GPU buffers. Returns true on success, false (without
     throwing) if WebGL is unavailable or compile/link fails, so the
     caller can fall back to hiding the panel. Also re-run from the
     webglcontextrestored handler to rebuild everything from scratch
     after a context loss. */
  function setupGL() {
    try {
      const opts = { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "low-power" };
      gl = canvas.getContext("webgl2", opts) ||
           canvas.getContext("webgl", opts) ||
           canvas.getContext("experimental-webgl", opts);
    } catch (e) {
      gl = null;
    }

    if (!gl) return false;

    // Two small programs, plain GLSL ES 1.00 (valid on both a webgl
    // and a webgl2 context, so one shader pair covers either).
    shapeProgram = link(
      "attribute vec2 aPosition; attribute vec4 aColor; varying vec4 vColor;" +
      "void main() { gl_Position = vec4(aPosition, 0.0, 1.0); vColor = aColor; }",
      "precision mediump float; varying vec4 vColor;" +
      "void main() { gl_FragColor = vec4(vColor.rgb * vColor.a, vColor.a); }"
    );
    pointProgram = link(
      "attribute vec2 aPosition; attribute float aSize; attribute vec4 aColor; varying vec4 vColor;" +
      "void main() { gl_Position = vec4(aPosition, 0.0, 1.0); gl_PointSize = aSize; vColor = aColor; }",
      "precision mediump float; varying vec4 vColor;" +
      "void main() {" +
      "  vec2 c = gl_PointCoord - vec2(0.5);" +
      "  float d = length(c);" +
      "  float a = smoothstep(0.5, 0.28, d);" +
      "  if (a <= 0.0) discard;" +
      "  float alpha = vColor.a * a;" +
      "  gl_FragColor = vec4(vColor.rgb * alpha, alpha);" +
      "}"
    );

    if (!shapeProgram || !pointProgram) {
      return false;
    }

    gl.enable(gl.BLEND);
    // premultiplied-alpha friendly blend, matches the fragment shaders above
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    shapeBuffer = gl.createBuffer();
    pointBuffer = gl.createBuffer();

    shapeLoc = {
      pos: gl.getAttribLocation(shapeProgram, "aPosition"),
      color: gl.getAttribLocation(shapeProgram, "aColor")
    };
    pointLoc = {
      pos: gl.getAttribLocation(pointProgram, "aPosition"),
      size: gl.getAttribLocation(pointProgram, "aSize"),
      color: gl.getAttribLocation(pointProgram, "aColor")
    };

    return true;
  }

  const STRIDE_SHAPE = 6; // x, y, r, g, b, a
  const STRIDE_POINT = 7; // x, y, size, r, g, b, a

  /* ---------- scene data ---------- */
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const SPIKE_COUNT = isMobile ? 16 : 28;
  const MICROBE_POOL = isMobile ? 16 : 34;
  const FLASH_POOL = 12;
  const SURFACE_Y = -0.35; // clip-space y of the treated surface line

  const rng = makeRng(20260722); // fixed seed: reproducible layout, not re-randomised

  const spikes = Array.from({ length: SPIKE_COUNT }, (_, i) => {
    const t = (i + 0.5) / SPIKE_COUNT;
    return {
      x: -0.94 + t * 1.88 + (rng() - 0.5) * 0.02,
      target: 0.16 + rng() * 0.09,
      height: 0,
      // roughly one spike in seven is marked to show gradual wear once
      // stage three (steady state) is reached -- illustrates "degrades
      // by abrasion, not by expiry" without implying failure
      wornCandidate: i % 7 === 3
    };
  });

  const microbes = Array.from({ length: MICROBE_POOL }, () => ({
    active: false, x: 0, y: 0, vy: 0, target: 0, phase: "fall", t: 0
  }));
  const flashes = Array.from({ length: FLASH_POOL }, () => ({ active: false, x: 0, y: 0, age: 0 }));

  /* ---------- render-frame scratch buffers ----------
     Allocated once (plain typed arrays, not a GPU resource -- safe
     to create regardless of WebGL availability) and refilled in
     place every frame instead of building a fresh plain array plus a
     fresh Float32Array on every call, which was generating sustained
     GC pressure at up to 60fps. Sized to the maximum this page can
     ever need: the surface strip (6 verts) plus one triangle per
     spike for shapeData, and one point per pooled microbe/flash for
     pointData. */
  const SHAPE_MAX_VERTS = 6 + SPIKE_COUNT * 3;
  const shapeData = new Float32Array(SHAPE_MAX_VERTS * STRIDE_SHAPE);
  const POINT_MAX_VERTS = MICROBE_POOL + FLASH_POOL;
  const pointData = new Float32Array(POINT_MAX_VERTS * STRIDE_POINT);

  function nearestSpikeIndex(x) {
    let best = 0, bestD = Infinity;
    for (let i = 0; i < spikes.length; i++) {
      const d = Math.abs(spikes[i].x - x);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  /* ---------- state ---------- */
  let stage = 0;
  let mountTime = 0;
  let running = false;
  let raf = null;
  let lastFrame = 0;
  let sectionVisible = false;
  let initialised = false;

  function desiredActiveMicrobes() {
    if (stage === 0) return 0;
    if (stage === 1) return microbes.length;
    return Math.round(microbes.length * 0.4); // stage 3: steady trickle, not a downpour
  }

  function spawnMicrobe(m) {
    m.x = (rng() - 0.5) * 1.7;
    m.y = 1.08 + rng() * 0.25;
    m.vy = (isMobile ? 0.32 : 0.4) + rng() * 0.18;
    m.target = nearestSpikeIndex(m.x + (rng() - 0.5) * 0.3);
    m.phase = "fall";
    m.t = 0;
    m.active = true;
  }

  function spawnFlash(x, y) {
    const f = flashes.find((fl) => !fl.active);
    if (!f) return;
    f.active = true;
    f.x = x;
    f.y = y;
    f.age = 0;
  }

  function updateSpikes(now) {
    const growP = reduceMotion ? 1 : Math.min(1, (now - mountTime) / 900);
    const eased = 1 - Math.pow(1 - growP, 3);
    const wornApplied = stage >= 2;
    for (const s of spikes) {
      const factor = wornApplied && s.wornCandidate ? 0.62 : 1;
      s.height = s.target * factor * eased;
    }
  }

  function updateMicrobes(dt) {
    let activeCount = 0;
    for (const m of microbes) if (m.active) activeCount++;
    const desired = desiredActiveMicrobes();

    for (const m of microbes) {
      if (!m.active) {
        if (activeCount < desired && rng() < dt * 1.4) {
          spawnMicrobe(m);
          activeCount++;
        }
        continue;
      }
      if (m.phase === "fall") {
        const spike = spikes[m.target];
        m.y -= m.vy * dt;
        m.x += (spike.x - m.x) * Math.min(1, dt * 1.6);
        const apexY = SURFACE_Y + spike.height;
        if (m.y <= apexY + 0.02) {
          m.phase = "flash";
          m.t = 0;
          spawnFlash(spike.x, apexY);
        }
      } else {
        m.t += dt;
        if (m.t > 0.3) m.active = false;
      }
    }
    for (const f of flashes) {
      if (!f.active) continue;
      f.age += dt;
      if (f.age > 0.5) f.active = false;
    }
  }

  /* deterministic single-frame layout used under prefers-reduced-motion,
     so the panel still shows something meaningful without looping */
  function layoutStaticFrame() {
    const activeForStage = stage === 0 ? 0 : stage === 1 ? microbes.length : Math.round(microbes.length * 0.5);
    microbes.forEach((m, i) => {
      if (i >= activeForStage) { m.active = false; return; }
      const spike = spikes[i % spikes.length];
      const frac = ((i * 37) % 100) / 100;
      m.active = true;
      m.phase = "fall";
      m.target = i % spikes.length;
      m.x = spike.x + (frac - 0.5) * 0.06;
      m.y = SURFACE_Y + spike.height + 0.05 + frac * 0.9;
    });
    flashes.forEach((f, i) => {
      if (stage === 0 || i >= 3) { f.active = false; return; }
      const spike = spikes[(i * 5) % spikes.length];
      f.active = true;
      f.x = spike.x;
      f.y = SURFACE_Y + spike.height;
      f.age = 0.15 + i * 0.1;
    });
  }

  /* ---------- render ----------
     Fills the preallocated shapeData/pointData typed arrays in place
     (no per-frame array literals, no per-frame `new Float32Array`)
     and uploads only the subrange actually used this frame. */
  function render() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // surface strip + spike triangles
    let si = 0;
    const sTop = SURFACE_Y, sBot = SURFACE_Y - 0.03;
    const lc = COLOR_LINE;
    shapeData[si++] = -1; shapeData[si++] = sTop; shapeData[si++] = lc[0]; shapeData[si++] = lc[1]; shapeData[si++] = lc[2]; shapeData[si++] = 0.9;
    shapeData[si++] = 1; shapeData[si++] = sTop; shapeData[si++] = lc[0]; shapeData[si++] = lc[1]; shapeData[si++] = lc[2]; shapeData[si++] = 0.9;
    shapeData[si++] = -1; shapeData[si++] = sBot; shapeData[si++] = lc[0]; shapeData[si++] = lc[1]; shapeData[si++] = lc[2]; shapeData[si++] = 0.9;
    shapeData[si++] = 1; shapeData[si++] = sTop; shapeData[si++] = lc[0]; shapeData[si++] = lc[1]; shapeData[si++] = lc[2]; shapeData[si++] = 0.9;
    shapeData[si++] = 1; shapeData[si++] = sBot; shapeData[si++] = lc[0]; shapeData[si++] = lc[1]; shapeData[si++] = lc[2]; shapeData[si++] = 0.9;
    shapeData[si++] = -1; shapeData[si++] = sBot; shapeData[si++] = lc[0]; shapeData[si++] = lc[1]; shapeData[si++] = lc[2]; shapeData[si++] = 0.9;

    const halfBase = (1.88 / spikes.length) * 0.42;
    const cc = COLOR_CYAN;
    for (const s of spikes) {
      const apexY = SURFACE_Y + s.height;
      const grown = s.target > 0 ? Math.min(1, s.height / s.target) : 0;
      const alpha = 0.5 + grown * 0.4;
      shapeData[si++] = s.x - halfBase; shapeData[si++] = SURFACE_Y; shapeData[si++] = cc[0]; shapeData[si++] = cc[1]; shapeData[si++] = cc[2]; shapeData[si++] = alpha * 0.5;
      shapeData[si++] = s.x + halfBase; shapeData[si++] = SURFACE_Y; shapeData[si++] = cc[0]; shapeData[si++] = cc[1]; shapeData[si++] = cc[2]; shapeData[si++] = alpha * 0.5;
      shapeData[si++] = s.x; shapeData[si++] = apexY; shapeData[si++] = cc[0]; shapeData[si++] = cc[1]; shapeData[si++] = cc[2]; shapeData[si++] = alpha;
    }

    gl.useProgram(shapeProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
    // si always equals shapeData.length (fixed vertex count: surface + one triangle per spike)
    gl.bufferData(gl.ARRAY_BUFFER, shapeData, gl.DYNAMIC_DRAW);
    const strideShape = STRIDE_SHAPE * 4;
    gl.enableVertexAttribArray(shapeLoc.pos);
    gl.vertexAttribPointer(shapeLoc.pos, 2, gl.FLOAT, false, strideShape, 0);
    gl.enableVertexAttribArray(shapeLoc.color);
    gl.vertexAttribPointer(shapeLoc.color, 4, gl.FLOAT, false, strideShape, 8);
    gl.drawArrays(gl.TRIANGLES, 0, si / STRIDE_SHAPE);

    // microbes + rupture flashes
    let pi = 0;
    const dprSize = Math.min(window.devicePixelRatio || 1, 2);
    const gc = COLOR_GREEN;
    for (const m of microbes) {
      if (!m.active || m.phase !== "fall") continue;
      pointData[pi++] = m.x; pointData[pi++] = m.y; pointData[pi++] = 7 * dprSize;
      pointData[pi++] = gc[0]; pointData[pi++] = gc[1]; pointData[pi++] = gc[2]; pointData[pi++] = 0.9;
    }
    for (const f of flashes) {
      if (!f.active) continue;
      const p = Math.min(1, f.age / 0.5);
      const size = (10 + p * 34) * dprSize;
      const alpha = (1 - p) * 0.9;
      pointData[pi++] = f.x; pointData[pi++] = f.y; pointData[pi++] = size;
      pointData[pi++] = Math.min(1, cc[0] + p * 0.3); pointData[pi++] = gc[1]; pointData[pi++] = gc[2]; pointData[pi++] = alpha;
    }

    if (pi > 0) {
      gl.useProgram(pointProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      // upload only the used prefix -- subarray is a zero-copy view, not a fresh allocation
      gl.bufferData(gl.ARRAY_BUFFER, pointData.subarray(0, pi), gl.DYNAMIC_DRAW);
      const strideP = STRIDE_POINT * 4;
      gl.enableVertexAttribArray(pointLoc.pos);
      gl.vertexAttribPointer(pointLoc.pos, 2, gl.FLOAT, false, strideP, 0);
      gl.enableVertexAttribArray(pointLoc.size);
      gl.vertexAttribPointer(pointLoc.size, 1, gl.FLOAT, false, strideP, 8);
      gl.enableVertexAttribArray(pointLoc.color);
      gl.vertexAttribPointer(pointLoc.color, 4, gl.FLOAT, false, strideP, 12);
      gl.drawArrays(gl.POINTS, 0, pi / STRIDE_POINT);
    }
  }

  function drawStatic() {
    // Guards a pre-init edge case: the stage buttons below attach
    // click handlers at module scope, so a click could in theory land
    // before first intersection has run setupGL(). Nothing to draw
    // yet in that case -- init() draws the first frame itself once
    // GPU setup completes.
    if (!gl) return;
    updateSpikes(performance.now());
    layoutStaticFrame();
    render();
  }

  function frame(now) {
    raf = null;
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    updateSpikes(now);
    updateMicrobes(dt);
    render();
    if (running) raf = requestAnimationFrame(frame);
  }

  function startLoop() {
    // `gl` guards the case where WebGL setup failed (or hasn't run
    // yet) but sectionVisible/visibilitychange still tries to resume
    // the loop -- e.g. the panel was hidden after a failed setupGL()
    // and the tab is later re-focused.
    if (reduceMotion || running || !gl) return;
    running = true;
    lastFrame = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stopLoop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  /* ---------- stage switching (scroll or buttons) ---------- */
  function setStage(i, opts) {
    opts = opts || {};
    i = Math.max(0, Math.min(2, i));
    if (i === stage && !opts.force) return;
    stage = i;
    if (stageNumEl) stageNumEl.textContent = "0" + (i + 1);
    if (stageNameEl) stageNameEl.textContent = STAGES[i].name;
    buttons.forEach((b, bi) => {
      const on = bi === i;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    section.querySelectorAll(".grid-3 .card").forEach((card, ci) => {
      card.classList.toggle("mech-active", ci === i);
    });
    if (reduceMotion) drawStatic();
  }

  /* how far the surrounding <section> has scrolled through the
     viewport, 0 at first entry from the bottom, 1 as it leaves the
     top -- this is scroll position only, so it behaves identically
     for mouse-wheel, trackpad and touch scrolling */
  function progressFromScroll() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const total = rect.height + vh;
    if (total <= 0) return 0;
    return Math.max(0, Math.min(1, (vh - rect.top) / total));
  }

  /* Scroll position is the single source of truth for which stage is
     shown (see onScroll below) -- a button click that only called
     setStage() directly would get silently overwritten by the very
     next scroll event (even a sub-pixel one from the click itself
     moving focus). So a button click instead scrolls the viewport to
     the position that naturally corresponds to that stage; the
     resulting scroll (instant, or smooth when motion is allowed)
     drives setStage() itself, and the two mechanisms never disagree. */
  function scrollToStage(i) {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const total = rect.height + vh;
    const targetProgress = (i + 0.5) / 3;
    const targetTop = vh - targetProgress * total;
    const docTop = window.scrollY + rect.top;
    const targetScrollY = Math.max(0, docTop - targetTop);
    window.scrollTo({ top: targetScrollY, behavior: reduceMotion ? "auto" : "smooth" });
  }

  buttons.forEach((b, i) => {
    b.addEventListener("click", () => {
      setStage(i, { force: true }); // instant feedback
      scrollToStage(i); // then bring scroll position into agreement
    });
  });

  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollTicking = false;
      if (!sectionVisible) return;
      const p = progressFromScroll();
      setStage(Math.min(2, Math.floor(p * 3)));
    });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth || wrap.clientWidth || 1;
    const ch = canvas.clientHeight || wrap.clientHeight || 1;
    canvas.width = Math.max(1, Math.round(cw * dpr));
    canvas.height = Math.max(1, Math.round(ch * dpr));
    if (!running) drawStatic();
  }

  function init() {
    if (initialised) return;
    initialised = true;

    if (!setupGL()) {
      // No WebGL support (or compile/link failed): remove this panel
      // entirely rather than show a broken or empty canvas. The
      // static .card grid underneath already carries the full
      // explanation on its own. This is the same fallback the module
      // used to trigger at parse time -- it just runs at first
      // intersection now, since GPU setup is deferred to here.
      root.hidden = true;
      return;
    }

    mountTime = performance.now();
    resize();
    wrap.classList.add("is-ready");
    setStage(0, { force: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (reduceMotion) drawStatic();
    else startLoop();
  }

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    stopLoop();
  });

  /* iOS Safari (and other browsers under memory pressure) can discard
     a live WebGL context without warning. Without this handler the
     diagram would stay dead until a full page reload; instead, rebuild
     the programs/buffers and resume exactly as if this were the first
     intersection, but only if the panel has actually been set up
     before and is still on screen. */
  canvas.addEventListener("webglcontextrestored", () => {
    if (!initialised) return;
    if (!setupGL()) {
      root.hidden = true;
      return;
    }
    resize();
    if (sectionVisible) {
      if (reduceMotion) drawStatic();
      else if (!document.hidden) startLoop();
    }
  });

  /* lazy-init + pause-when-offscreen, mirroring the visibilitychange
     pattern already used for #bg-canvas in js/site.js */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      sectionVisible = entries[0].isIntersecting;
      if (sectionVisible) {
        init();
        if (!gl) return; // WebGL unavailable -- panel is hidden, nothing to run
        if (!document.hidden) startLoop();
        else stopLoop();
      } else {
        stopLoop();
      }
    }, { threshold: 0.05 });
    io.observe(section);
  } else {
    // no IntersectionObserver: init immediately, reduced motion still respected
    sectionVisible = true;
    init();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopLoop();
    else if (sectionVisible) startLoop();
  });
})();
