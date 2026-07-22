/* ============================================================
   PROTEC SOLUTIONS - Railway adapter
   A tiny dependency-free Node HTTP server exposing POST /protec-ai
   Deploy path: serverless/railway/server.js
   Start command: node server.js
   ============================================================
   Thin adapter only - all real logic lives in ../lib/handler.js so
   this behaves identically to the Netlify Functions deployment.
   ============================================================ */

"use strict";

const http = require("http");
const { handleChatRequest } = require("../lib/handler");

const PORT = process.env.PORT || 8787;
const ROUTE = "/protec-ai";
const MAX_BODY_BYTES = 8 * 1024 + 512; // small margin over the handler's own cap, so
// oversized bodies are cut off at the transport level too, not just re-checked later

function readBody(req) {
  return new Promise((resolve, reject) => {
    let received = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      received += chunk.length;
      if (received > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Body too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname !== ROUTE) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found." }));
    return;
  }

  let rawBody = "";
  if (req.method === "POST") {
    try {
      rawBody = await readBody(req);
    } catch (err) {
      res.writeHead(err.statusCode || 400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Request body too large or unreadable." }));
      return;
    }
  }

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    headers[key.toLowerCase()] = Array.isArray(value) ? value.join(",") : value;
  }

  const ip = (headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();

  try {
    const result = await handleChatRequest({
      method: req.method,
      headers,
      rawBody,
      ip
    });
    res.writeHead(result.statusCode, result.headers);
    res.end(result.body);
  } catch (err) {
    console.error("Unhandled error in protec-ai handler:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error." }));
  }
});

server.listen(PORT, () => {
  console.log(`ProTec AI proxy listening on port ${PORT}, route ${ROUTE}`);
});
