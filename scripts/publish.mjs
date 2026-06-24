#!/usr/bin/env node
// publish.mjs — publish a saved post (text + optional image) to LinkedIn and/or X
// by driving the linkedin-mcp / x-autonomous-mcp Docker servers over stdio JSON-RPC.
//
// The image is read from disk and base64-encoded *inside this script*, so the large
// payload never has to pass through an MCP tool-call argument in a chat client.
//
// Usage:
//   node scripts/publish.mjs --linkedin --image verana/20260623-001-001.png \
//        --text-file verana/.li-text.txt --visibility PUBLIC
//   node scripts/publish.mjs --x --image verana/...jpg --text-file verana/.x-text.txt
//
// Env files (same ones the MCP servers use):
//   ~/.mcp/linkedin.env , ~/.mcp/x.env  (+ their data volumes)

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const HOME = homedir();
const DOCKER = "/usr/local/bin/docker";

// --- tiny arg parser ---
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };

const doLinkedIn = flag("--linkedin");
const doX = flag("--x");
const imagePath = val("--image");
const textFile = val("--text-file");
const text = val("--text") ?? (textFile ? readFileSync(textFile, "utf8").trimEnd() : undefined);
const visibility = val("--visibility") ?? "PUBLIC";
const altText = val("--alt") ?? "";

if (!text) { console.error("ERROR: provide --text or --text-file"); process.exit(2); }
if (!doLinkedIn && !doX) { console.error("ERROR: pass --linkedin and/or --x"); process.exit(2); }

const imageB64 = imagePath ? readFileSync(path.resolve(imagePath)).toString("base64") : undefined;
const imageMime = imagePath && imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

// --- minimal MCP stdio JSON-RPC client over a Docker container ---
function mcpClient(dockerArgs) {
  const child = spawn(DOCKER, dockerArgs, { stdio: ["pipe", "pipe", "pipe"] });
  let buf = "";
  const pending = new Map();
  child.stdout.on("data", (d) => {
    buf += d.toString();
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl); buf = buf.slice(nl + 1);
      if (!line.trim()) continue;
      let msg; try { msg = JSON.parse(line); } catch { continue; }
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id); pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    }
  });
  child.stderr.on("data", (d) => process.stderr.write(`[server] ${d}`));
  let idc = 0;
  const send = (method, params) => new Promise((resolve, reject) => {
    const id = ++idc;
    pending.set(id, { resolve, reject });
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    setTimeout(() => { if (pending.has(id)) { pending.delete(id); reject(new Error(`timeout: ${method}`)); } }, 120000);
  });
  return {
    async init() {
      await send("initialize", {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "social-posts-publish", version: "1.0.0" },
      });
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
    },
    call: (name, a) => send("tools/call", { name, arguments: a }),
    close: () => child.stdin.end(),
  };
}

const liArgs = ["run", "--rm", "-i", "--env-file", `${HOME}/.mcp/linkedin.env`,
  "-v", `${HOME}/.mcp/linkedin-data:/data`, "-e", "MCP_TRANSPORT=stdio", "io2060/linkedin-mcp:latest"];
const xArgs = ["run", "--rm", "-i", "--env-file", `${HOME}/.mcp/x.env`,
  "-v", `${HOME}/.mcp/x-data:/data`, "-e", "MCP_TRANSPORT=stdio", "io2060/x-autonomous-mcp:latest"];

const show = (r) => (r?.content?.map?.((c) => c.text).join("\n") ?? JSON.stringify(r));

if (doLinkedIn) {
  console.error("== LinkedIn ==");
  const li = mcpClient(liArgs);
  await li.init();
  let imageUrn;
  if (imageB64) {
    const up = await li.call("upload_media", { image_data: imageB64 });
    console.error("upload_media:", show(up));
    const m = show(up).match(/urn:li:(?:image|digitalmediaAsset):[A-Za-z0-9_-]+/);
    imageUrn = m && m[0];
  }
  const post = imageUrn
    ? await li.call("create_image_post", { text, image_urn: imageUrn, alt_text: altText, visibility })
    : imageB64
      ? await li.call("create_image_post", { text, image_data: imageB64, alt_text: altText, visibility })
      : await li.call("create_post", { text, visibility });
  console.log("LINKEDIN_RESULT:\n" + show(post));
  li.close();
}

if (doX) {
  console.error("== X ==");
  const x = mcpClient(xArgs);
  await x.init();
  let mediaIds;
  if (imageB64) {
    const up = await x.call("upload_media", { media_data: imageB64, mime_type: imageMime, media_category: "tweet_image" });
    console.error("upload_media:", show(up));
    const m = show(up).match(/"?media_id"?\s*[:=]\s*"?(\d+)"?/) || show(up).match(/\b(\d{15,25})\b/);
    if (m) mediaIds = [m[1]];
  }
  const post = await x.call("post_tweet", mediaIds ? { text, media_ids: mediaIds } : { text });
  console.log("X_RESULT:\n" + show(post));
  x.close();
}

process.exit(0);
