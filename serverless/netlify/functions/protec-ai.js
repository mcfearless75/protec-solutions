/* ============================================================
   PROTEC SOLUTIONS - Netlify Functions adapter
   Deploy path: serverless/netlify/functions/protec-ai.js
   Live URL once deployed: https://<your-site>.netlify.app/.netlify/functions/protec-ai
   ============================================================
   Thin adapter only - all real logic lives in ../../lib/handler.js
   so the same behaviour is shared with the Railway deployment.
   ============================================================ */

"use strict";

const { handleChatRequest } = require("../../lib/handler");

exports.handler = async (event) => {
  const headers = {};
  for (const [key, value] of Object.entries(event.headers || {})) {
    headers[key.toLowerCase()] = value;
  }

  const ip =
    (event.headers && (event.headers["x-nf-client-connection-ip"] || event.headers["client-ip"])) ||
    headers["x-forwarded-for"] ||
    "";

  const result = await handleChatRequest({
    method: event.httpMethod,
    headers,
    rawBody: event.body || "",
    ip: String(ip).split(",")[0].trim()
  });

  return result;
};
