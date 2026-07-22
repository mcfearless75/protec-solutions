# ProTec AI proxy - deployment guide

This folder is a standalone serverless proxy. It lets the AI assistant on
protec-solutions.co.uk call the real Claude API instead of matching
keywords against `js/knowledge.js`. It is **not deployed yet** - nothing
changes on the live site until you follow the steps below and set the
endpoint constant in `js/site.js`.

It is deliberately separate from the main site repo's static files. The
GitHub Pages site cannot run server code or hold a secret API key, so this
proxy has to live somewhere that can: Netlify Functions or Railway both
work, pick whichever you already use.

## 1. Get an API key

1. Go to [console.anthropic.com](https://console.anthropic.com) and sign in
   (or create an account).
2. Add a small amount of credit under **Billing** (see cost estimate
   below - a few pounds is plenty to start).
3. Go to **API Keys** and create a new key. Copy it once - you won't be
   shown it again.

Treat this key like a password. Never paste it into the site's HTML, JS,
CSS, or into any file inside the main `protec` repo. It only ever goes into
an environment variable on Netlify or Railway (or a local `.env` file that
never gets committed).

## 2. The one environment variable

Both deployment options need exactly one setting:

```
ANTHROPIC_API_KEY=<the key you just copied>
```

Nothing else is required. There is no other secret to configure.

## 3. Deploy - pick Netlify OR Railway

### Option A: Netlify Functions

1. Push this `serverless/` folder to its own small Git repository (or a
   separate branch) - it should NOT be mixed into the GitHub Pages repo,
   since Netlify will try to build whatever it's pointed at.
2. In Netlify: **Add new site → Import an existing project**, point it at
   that repo.
3. Build settings: leave the build command empty, set **Functions
   directory** to `netlify/functions` (already set in `netlify.toml`, so
   Netlify should pick it up automatically).
4. Go to **Site configuration → Environment variables** and add
   `ANTHROPIC_API_KEY` with your key.
5. Deploy. Your function will be live at:

   ```
   https://<your-site-name>.netlify.app/.netlify/functions/protec-ai
   ```

   That full URL is what goes into `js/site.js` in step 5 below.

### Option B: Railway

1. Push `serverless/` to its own Git repo (same reasoning as above).
2. In Railway: **New Project → Deploy from GitHub repo**, select it.
3. Railway will detect `package.json` and the `start` script
   (`node railway/server.js`) automatically. No build step needed.
4. Go to the service's **Variables** tab and add `ANTHROPIC_API_KEY` with
   your key.
5. Once deployed, Railway gives you a public URL, e.g.
   `https://protec-ai-proxy-production.up.railway.app`. Your endpoint is
   that URL plus `/protec-ai`:

   ```
   https://protec-ai-proxy-production.up.railway.app/protec-ai
   ```

   That full URL is what goes into `js/site.js` in step 5 below.

Either option costs nothing to host at ProTec's traffic levels - Netlify's
free tier and Railway's free/hobby tier both comfortably cover a single
low-traffic function like this.

## 4. Test it before wiring it up

From a terminal (replace the URL with yours):

```bash
curl -X POST "https://<your-endpoint>/protec-ai" \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.protec-solutions.co.uk" \
  -d '{"message":"What is Goldshield?","history":[]}'
```

You should get back `{"reply":"..."}`. If you get a 403, check the CORS
allow-list in `serverless/lib/cors.js` matches your live domain. If you get
a 500 saying the assistant isn't configured, the environment variable
isn't set correctly on Netlify/Railway.

## 5. Wire it into the site

Open `js/site.js` and find the constant near the top of the file:

```js
const PROTEC_AI_ENDPOINT = "";
```

Set it to your deployed URL, e.g.:

```js
const PROTEC_AI_ENDPOINT = "https://your-site.netlify.app/.netlify/functions/protec-ai";
```

With that constant empty (the default), the assistant behaves exactly as
it does today - pure keyword matching against `js/knowledge.js`, no
network calls, nothing to configure. Once you set the URL, the assistant
calls your proxy first and only falls back to keyword matching if the
call fails (network error, rate limit, proxy down). This means the site
never breaks even if the proxy has an outage.

Remember: this repo's `?v=` cache-busting query strings are managed
centrally, so after editing `js/site.js` don't touch the `?v=` value
yourself - that gets bumped separately when the change is deployed.

## 6. Roughly what it costs to run

Two separate costs:

- **Hosting** - £0/month on Netlify's or Railway's free tier at ProTec's
  likely traffic (a marketing site's chat widget, not a high-volume app).
  Railway's free tier has a small monthly credit; if that's ever
  exhausted, its hobby plan is $5/month.
- **Claude API usage** - billed per token, pay-as-you-go. A typical
  assistant exchange (system prompt plus a short question and a few
  sentences back) works out to roughly £0.001-£0.003 per message with
  `claude-sonnet-5`. Even a few hundred conversations a month is a few
  pounds, not a meaningful line item. Set a spending cap in the Anthropic
  console's billing settings so it can never run away on you.

## 7. What this proxy does and doesn't do

**Does:**
- Reads the API key from an environment variable only. Never hardcoded,
  never committed.
- Builds the system prompt from the real product data in
  `serverless/lib/knowledge-data.js` (a price-stripped mirror of
  `js/knowledge.js` - see the comment at the top of that file for why it's
  a separate copy, and keep the two in sync when you change a product).
- Tells the model to say "I don't know" and point to the contact form
  rather than invent facts, and to never quote a price.
- Caps request size (8kb), caps message length, keeps only the last 8
  turns of conversation history.
- Rate-limits by IP (20 requests per 10 minutes) as a first line of
  defence. This is a simple in-memory limiter, good enough to stop casual
  abuse, but not a hard guarantee under high concurrency - see the comment
  in `serverless/lib/rate-limit.js` if you want to harden this further
  with a shared store like Upstash Redis.
- Restricts CORS to `protec-solutions.co.uk` and `www.protec-solutions.co.uk`.
- Uses the standard Claude Messages API with model id `claude-sonnet-5`.

**Doesn't:**
- Doesn't touch the GitHub Pages deploy in any way until you paste the
  live URL into `js/site.js`.
- Doesn't store or log conversation content anywhere beyond normal
  Netlify/Railway request logs.
- Doesn't require any build step or bundler for the static site itself:
  this proxy is a wholly separate deployment.

## File map

```
serverless/
  README.md                    - this file
  package.json                 - Railway start script, zero dependencies
  netlify.toml                 - Netlify Functions config
  .env.example                 - copy to .env for local testing only
  lib/
    handler.js                 - the actual request handling logic (shared)
    knowledge-data.js           - price-stripped product/service facts
    system-prompt.js           - builds the grounding system prompt
    cors.js                    - origin allow-list
    rate-limit.js               - best-effort in-memory rate limiter
  netlify/functions/
    protec-ai.js                - thin Netlify Functions adapter
  railway/
    server.js                  - thin Railway/Node HTTP adapter
```
