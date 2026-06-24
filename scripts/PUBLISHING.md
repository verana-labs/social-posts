# Publishing Playbook (assistant reference)

How to actually get a post live on LinkedIn and X from this repo, including the failure
modes hit on the first post (2026-06-23) so they aren't relearned. Pair with
[`publish.mjs`](./publish.mjs) and the repo [`../post-rules.md`](../post-rules.md).

---

## TL;DR — the one command

Both servers already hold authenticated tokens (LinkedIn OAuth, X API keys) in `~/.mcp/`.
Publish via the script, which reads the image **from disk** and base64-encodes it *inside*
the script:

```bash
cd <repo>
# LinkedIn (image, public) + X (image), separate text files per platform
node scripts/publish.mjs --linkedin --image verana/PIC.jpg --visibility PUBLIC \
  --alt "…" --text-file verana/.li-text.txt
node scripts/publish.mjs --x --image verana/PIC.png --text-file verana/.x-text-280.txt
```

Run LinkedIn and X as **separate invocations** when their text differs (it usually does —
see X 280 rule).

---

## The core constraint (why the script exists)

**Never pass image bytes through an MCP tool-call argument.** A post image base64-encodes to
~150K–2.4M characters; that is too large to emit as a tool argument and gets truncated or
rejected. The MCP servers themselves are fine — the chat-tool transport is the bottleneck.

✅ **Solution:** `publish.mjs` spawns the Docker MCP servers and speaks **stdio JSON-RPC**
directly. The base64 lives in a local variable in the JSON-RPC request, never in a
tool-call arg. This reuses the servers' tested OAuth refresh, budgets, and dedup.

The linkedin-mcp HTTP mode exposes **only** `/mcp` and `/oauth/*` — there is no plain REST
publish endpoint, so stdio JSON-RPC (or the MCP tools) is the only programmatic path.

---

## Pre-flight checklist

1. **Verify identity & budget first** (non-destructive) — call `get_me` (LinkedIn) /
   `get_digest` or `get_user` (X). Confirm the right account and that budget remains
   (LinkedIn default 5 posts/day; X default 2 originals/day).
2. **Strip Markdown** from the text. `**bold**` and `*italics*` render **literally** on both
   LinkedIn and X. Remove them before posting.
3. **Avoid `&`** in body text — the API HTML-escapes it to `&amp;`, which can render
   literally. Write "and" instead.
4. **At most one em dash (`—`) per post.** Overuse of `—` reads as AI-generated. Use no more
   than one per post; replace the rest with a period, comma, colon, or parentheses. (Applies
   to the published body text, per platform.)
5. **Compress the image for upload** (keeps base64 small, faster, within limits). macOS has
   `sips` built in (no ImageMagick needed):

   ```bash
   sips -s format jpeg -s formatOptions 80 --resampleWidth 1200 SRC.png --out .upload.jpg
   ```

   Keep the original high-res PNG as the archived asset; upload the compressed JPEG.
6. **Confirm before posting** — publishing is public and as the user. Get an explicit go.

---

## Platform rules

### LinkedIn
- Image post works via `upload_media` → `create_image_post` (or pass `image_data` directly;
  the script handles both). Set `visibility: PUBLIC` for reach.
- Always provide **`alt_text`** for accessibility.
- Ideal image ratio **1.91:1** (e.g. 1200×627). Other ratios post fine but get cropped.
- Success looks like: result contains `id: "urn:li:share:…"` and the budget counter
  increments (e.g. `1/5 posts used`).

### X (Twitter)
- **280-character hard limit on the free tier.** A longer post is rejected with **HTTP 403
  "You are not permitted to perform this action"** — misleading, looks like a permissions
  error but it's **length**. (A true permissions/tier problem is also 403; a malformed
  request is 400.) **Always prepare a ≤280 variant for X.**
- **Weighted length, not raw:** every URL counts as **23 chars** (t.co), and each attached
  image adds a second t.co link (~23). Emoji can count as 2. Budget accordingly — aim
  ≤~255 of "real" text when a link + image are present.
- Upload via `upload_media` (needs `mime_type`, e.g. `image/png`) → pass the returned
  `media_id` to `post_tweet`.
- Success looks like: result contains `data.id` and budget shows `1/2 originals used`.

---

## Known failure modes & fixes

| Symptom | Real cause | Fix |
| --- | --- | --- |
| Image base64 too big to pass as a tool arg | Chat-tool transport limit | Use `publish.mjs` (reads file from disk). |
| X `post_tweet` → **HTTP 403 Forbidden**, budget *not* incremented | Post **>280 chars** on free tier | Post a ≤280-char variant. |
| X 403 even when short, budget not incremented | App lacks **write** perms / Free API tier | Set app to **Read+Write**, **regenerate** Access Token+Secret; or move to **Basic+** tier. |
| X `post_tweet` → **HTTP 401 Unauthorized**, budget *not* incremented, **right after editing/regenerating keys** | A **stale Docker container** is still running with the **old** env — stdio servers read the env file only at container start, and a live MCP connection keeps the container warm. Reads may still work (bearer token), only writes 401. | Reconnect the server (`/mcp` → reconnect) or kill the container so the next call re-reads the env: `docker kill $(docker ps -q --filter ancestor=io2060/x-autonomous-mcp:latest)`. Verify the env shape first (right account user-id in `X_ACCESS_TOKEN`, matching consumer/access pairs). |
| `&` shows as `&amp;` in the live post | API HTML-escapes ampersands | Use "and" in the source text. |
| `**bold**` / `*italic*` shows literally | Markdown not supported on socials | Strip emphasis before posting. |
| `billing_limit_user_error` from OpenAI image gen | OpenAI billing hard limit reached | Raise the limit / add credit at platform.openai.com → Billing. |

---

## After publishing

- Update the post file's **Status** section: per platform, `published <date>` + the URN /
  tweet ID + URL (and note anything imperfect, e.g. the `&amp;`).
- Delete temp working files (`.upload-*.jpg`, `.li-text.txt`, `.x-text-280.txt`).
- Keep the high-res source image (`YYYYMMDD-NNN-AAA.png`) committed; the compressed upload
  copy is disposable.

---

## Proven reference (first post, 2026-06-23)

- LinkedIn `urn:li:share:7475334056516435968` — full ~1170-char text + image, PUBLIC. ✅
- X `2069568885586616740` — **280-char** variant + image (the full-length version 403'd). ✅
- Image: OpenAI `gpt-image-2`, 1536×1024, then `sips`-compressed to a ~120KB JPEG for upload.
