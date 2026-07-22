/* ============================================================
   PROTEC SOLUTIONS - CORS allow-list
   Only the live ProTec domain (and www variant) may call this
   function from a browser. Everything else is rejected.
   ============================================================ */

"use strict";

const ALLOWED_ORIGINS = [
  "https://www.protec-solutions.co.uk",
  "https://protec-solutions.co.uk"
];

/**
 * @param {string | undefined} origin
 * @returns {Record<string, string>} headers to attach to the response
 */
function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    Vary: "Origin"
  };
}

/**
 * @param {string | undefined} origin
 * @returns {boolean}
 */
function isAllowedOrigin(origin) {
  return !!origin && ALLOWED_ORIGINS.includes(origin);
}

module.exports = { corsHeaders, isAllowedOrigin, ALLOWED_ORIGINS };
