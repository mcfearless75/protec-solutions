/* ============================================================
   PROTEC SOLUTIONS - AI assistant proxy (core, framework-agnostic)
   ============================================================
   Wraps the Claude API call in one place so both the Netlify
   Functions adapter (netlify/functions/protec-ai.js) and the
   Railway adapter (railway/server.js) share identical behaviour.

   Requires: Node 18+ (for global fetch). No npm dependencies.
   ============================================================ */

"use strict";

const { corsHeaders, isAllowedOrigin } = require("./cors");
const { checkRateLimit } = require("./rate-limit");
const { buildSystemPrompt } = require("./system-prompt");

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MODEL_ID = "claude-sonnet-5";
const MAX_TOKENS = 700;

// abuse caps
const MAX_BODY_BYTES = 8 * 1024; // 8kb - this is a short-question widget, not a document upload
const MAX_MESSAGE_CHARS = 1500;
const MAX_HISTORY_TURNS = 8; // user+assistant turns kept, oldest dropped first

const JSON_HEADERS = { "Content-Type": "application/json" };

function jsonResponse(statusCode, origin, bodyObj, extraHeaders) {
  return {
    statusCode,
    headers: { ...JSON_HEADERS, ...corsHeaders(origin), ...(extraHeaders || {}) },
    body: JSON.stringify(bodyObj)
  };
}

function sanitiseText(value, maxChars) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxChars);
}

/**
 * @param {unknown} raw parsed JSON body from the client
 * @returns {{ ok: true, message: string, history: Array<{role: "user"|"assistant", content: string}> } | { ok: false, error: string }}
 */
function validatePayload(raw) {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Request body must be a JSON object." };

  const message = sanitiseText(raw.message, MAX_MESSAGE_CHARS);
  if (!message) return { ok: false, error: "A non-empty 'message' string is required." };

  let history = [];
  if (Array.isArray(raw.history)) {
    history = raw.history
      .filter((turn) => turn && (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string")
      .slice(-MAX_HISTORY_TURNS)
      .map((turn) => ({ role: turn.role, content: sanitiseText(turn.content, MAX_MESSAGE_CHARS) }))
      .filter((turn) => turn.content.length > 0);
  }

  return { ok: true, message, history };
}

/**
 * Core request handler, framework-agnostic.
 *
 * @param {object} req
 * @param {string} req.method
 * @param {Record<string, string | undefined>} req.headers lower-cased header names
 * @param {string} req.rawBody
 * @param {string} req.ip
 * @param {string} [req.apiKey] override for testing; defaults to process.env.ANTHROPIC_API_KEY
 * @returns {Promise<{ statusCode: number, headers: Record<string,string>, body: string }>}
 */
async function handleChatRequest(req) {
  const origin = req.headers.origin || req.headers.Origin;

  if (req.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin), body: "" };
  }

  if (req.method !== "POST") {
    return jsonResponse(405, origin, { error: "Method not allowed. Use POST." });
  }

  // Defence in depth on top of the browser's own CORS enforcement: if a
  // caller sends an Origin header at all, it must be on the allow-list.
  // Non-browser tools (curl, server-to-server testing) typically omit
  // Origin entirely, so we don't block requests that have none.
  if (origin && !isAllowedOrigin(origin)) {
    return jsonResponse(403, origin, { error: "Origin not allowed." });
  }

  const rawBody = req.rawBody || "";
  const bodyBytes = Buffer.byteLength(rawBody, "utf8");
  if (bodyBytes > MAX_BODY_BYTES) {
    return jsonResponse(413, origin, { error: "Request too large." });
  }
  if (bodyBytes === 0) {
    return jsonResponse(400, origin, { error: "Empty request body." });
  }

  const ip =
    req.ip ||
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown";

  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return jsonResponse(
      429,
      origin,
      { error: "Too many requests. Please try again shortly." },
      { "Retry-After": String(rate.retryAfterSeconds) }
    );
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, origin, { error: "Body must be valid JSON." });
  }

  const validated = validatePayload(parsedBody);
  if (!validated.ok) {
    return jsonResponse(400, origin, { error: validated.error });
  }

  const apiKey = req.apiKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Server misconfiguration, not a client error - logged, not leaked.
    console.error("ANTHROPIC_API_KEY is not set in the environment.");
    return jsonResponse(500, origin, { error: "The AI assistant is not configured yet. Please use the contact form instead." });
  }

  const messages = [
    ...validated.history.map((turn) => ({ role: turn.role, content: turn.content })),
    { role: "user", content: validated.message }
  ];

  let anthropicRes;
  try {
    anthropicRes = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION
      },
      body: JSON.stringify({
        model: MODEL_ID,
        max_tokens: MAX_TOKENS,
        system: buildSystemPrompt(),
        messages
      })
    });
  } catch (err) {
    console.error("Anthropic API request failed:", err);
    return jsonResponse(502, origin, { error: "Could not reach the AI service. Please try again in a moment." });
  }

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text().catch(() => "");
    console.error("Anthropic API returned an error:", anthropicRes.status, errText);
    if (anthropicRes.status === 429) {
      return jsonResponse(429, origin, { error: "The AI assistant is busy right now. Please try again shortly." });
    }
    return jsonResponse(502, origin, { error: "The AI assistant could not answer that just now. Please use the contact form." });
  }

  const data = await anthropicRes.json();
  const reply = (data.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!reply) {
    return jsonResponse(502, origin, { error: "The AI assistant returned an empty reply. Please try again." });
  }

  return jsonResponse(200, origin, { reply });
}

module.exports = { handleChatRequest, MODEL_ID };
