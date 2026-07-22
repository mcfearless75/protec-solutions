/* ============================================================
   PROTEC SOLUTIONS - best-effort in-memory rate limiter
   ============================================================
   This is a simple fixed-window limiter keyed by caller IP. It is
   NOT a substitute for a real store (Upstash Redis, Netlify Rate
   Limiting, Railway + a shared cache, etc) because serverless
   functions are ephemeral and often run as multiple concurrent
   instances that do not share memory - a determined abuser can get
   more than the stated limit by hitting different instances.

   It is still worth having as a first line of defence against
   accidental loops and casual abuse, and it costs nothing to run.
   For real production traffic, see serverless/README.md for the
   recommended upgrade path.
   ============================================================ */

"use strict";

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 20;

/** @type {Map<string, { count: number, windowStart: number }>} */
const buckets = new Map();

// keep the map from growing forever on a long-lived warm instance
function sweep(now) {
  for (const [key, entry] of buckets) {
    if (now - entry.windowStart > WINDOW_MS) buckets.delete(key);
  }
}

/**
 * @param {string} ip
 * @returns {{ allowed: boolean, remaining: number, retryAfterSeconds: number }}
 */
function checkRateLimit(ip) {
  const now = Date.now();
  sweep(now);

  const key = ip || "unknown";
  const entry = buckets.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count, retryAfterSeconds: 0 };
}

module.exports = { checkRateLimit, WINDOW_MS, MAX_REQUESTS_PER_WINDOW };
