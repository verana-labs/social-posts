# social-posts

Drafts and published social media content for **Verana**, **Mobiera**, and **2060.io**,
organized one folder per brand:

```text
social-posts/
├── 2060.io/
├── mobiera/
└── verana/
```

Posts are published through two MCP (Model Context Protocol) servers driven by
**Claude Code** or **Claude Desktop**:

| Server | Image | What it does |
| --- | --- | --- |
| **linkedin-mcp** | `io2060/linkedin-mcp:latest` | Publish + engage on LinkedIn as the authenticated member (posts, image posts, reshares, comments, reactions). |
| **x-autonomous-mcp** | `io2060/x-autonomous-mcp:latest` | Full X (Twitter) access — post, search, read timelines, like, retweet, upload media. |

Both servers run as **stdio** MCP servers inside Docker, with credentials supplied via
an `--env-file` and persistent state mounted on a host volume. This README explains how
to set that up locally.

> Source repos: [`2060-io/linkedin-mcp`](https://github.com/2060-io/linkedin-mcp) ·
> [`2060-io/x-autonomous-mcp`](https://github.com/2060-io/x-autonomous-mcp)

---

## Prerequisites

- **Docker** installed and running (the MCP servers run as containers — no Node toolchain
  needed locally).
- **Claude Code** (CLI) and/or **Claude Desktop** installed.
- A **LinkedIn developer app** (for linkedin-mcp) and **X developer app** (for
  x-autonomous-mcp). See [Getting credentials](#2-getting-credentials) below.

Pull the images once:

```bash
docker pull io2060/linkedin-mcp:latest
docker pull io2060/x-autonomous-mcp:latest
```

---

## 1. Create the config directory and env files

Both servers read their secrets from env files and persist tokens/budgets/dedup state to
a mounted data directory. Create them under `~/.mcp`:

```bash
mkdir -p ~/.mcp/linkedin-data ~/.mcp/x-data
```

### `~/.mcp/linkedin.env`

```bash
# --- LinkedIn OAuth app (from the LinkedIn Developer Portal) ---
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:8000/oauth/callback
LINKEDIN_API_VERSION=202506

# --- Basic-Auth protecting the OAuth callback routes ---
LI_MCP_ADMIN_USER=admin
LI_MCP_ADMIN_PASSWORD=choose_a_strong_password

# State file path INSIDE the container (maps to ~/.mcp/linkedin-data on the host)
LI_MCP_STATE_FILE=/data/linkedin-mcp-state.json

# --- Optional daily budget limits (defaults shown) ---
# LI_MCP_MAX_POSTS=5
# LI_MCP_MAX_COMMENTS=10
# LI_MCP_MAX_REACTIONS=30
# LI_MCP_MAX_DELETES=3
```

`LINKEDIN_REDIRECT_URI` **must exactly match** a Redirect URL configured on your LinkedIn
app. Set a budget value to `0` to disable that action entirely, or `-1` for unlimited.

### `~/.mcp/x.env`

```bash
# --- X (Twitter) API credentials (5 values from the X Developer Portal) ---
X_API_KEY=your_consumer_key
X_API_SECRET=your_secret_key
X_BEARER_TOKEN=your_bearer_token
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret

# --- Optional daily budget limits (defaults shown) ---
# X_MCP_MAX_REPLIES=8
# X_MCP_MAX_ORIGINALS=2
# X_MCP_MAX_LIKES=20
# X_MCP_MAX_RETWEETS=5
# X_MCP_MAX_FOLLOWS=10
# X_MCP_MAX_UNFOLLOWS=10
# X_MCP_MAX_DELETES=5
```

> **Keep these files private.** They contain live API secrets — never commit them. `~/.mcp`
> lives outside this repo on purpose.

---

## 2. Getting credentials

### LinkedIn (linkedin-mcp)

1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps) and
   create an app — it must be linked to a Company Page.
2. On the **Products** tab, request **Sign In with LinkedIn using OpenID Connect** and
   **Share on LinkedIn** (grants `openid`, `profile`, `email`, `w_member_social`).
3. On the **Auth** tab, copy the **Client ID** / **Client Secret**, and add
   `http://localhost:8000/oauth/callback` as a **Redirect URL** (must match
   `LINKEDIN_REDIRECT_URI`).

### X / Twitter (x-autonomous-mcp)

1. Go to the [X Developer Portal](https://developer.x.com/en/portal/dashboard) → **Apps** →
   **Create App**.
2. Under **User authentication settings** → **Set up**: set **App permissions** to
   **Read and write**, **Type of App** to **Web App, Automated App or Bot**, **Callback
   URI** to `https://localhost`, and any **Website URL**.
3. On **Keys and Tokens**, copy **API Key**, **API Secret**, and **Bearer Token**, then
   **Regenerate** the **Access Token** and **Access Token Secret** *after* enabling write
   permissions (otherwise tokens are read-only and posting fails with 403).

---

## 3. Authenticate LinkedIn (one-time OAuth)

X uses long-lived API tokens (already in `x.env` — nothing else to do). **LinkedIn needs a
one-time OAuth login** to obtain member tokens, which are then persisted to
`~/.mcp/linkedin-data/linkedin-mcp-state.json`.

Run the server in HTTP mode just for the login, complete the consent flow, then stop it:

```bash
docker run --rm -i \
  --env-file ~/.mcp/linkedin.env \
  -v ~/.mcp/linkedin-data:/data \
  -e MCP_TRANSPORT=http -e MCP_PORT=8000 \
  -p 8000:8000 \
  io2060/linkedin-mcp:latest
```

Then in a browser open <http://localhost:8000/oauth/start>, authenticate with the Basic-Auth
credentials from `linkedin.env` (`LI_MCP_ADMIN_USER` / `LI_MCP_ADMIN_PASSWORD`), approve on
LinkedIn, and you'll be redirected back. Check <http://localhost:8000/oauth/status> to confirm
a valid token is stored, then stop the container (`Ctrl-C`). The tokens now live on the
mounted volume and are reused by the stdio server below.

---

## 4. Configure Claude Code

The easiest way is `claude mcp add` (the `--` separates the `claude` flags from the command
Claude runs). Use `--scope user` to make the servers available in every project:

```bash
# LinkedIn
claude mcp add linkedin --scope user -- \
  docker run --rm -i \
  --env-file "$HOME/.mcp/linkedin.env" \
  -v "$HOME/.mcp/linkedin-data:/data" \
  -e MCP_TRANSPORT=stdio \
  io2060/linkedin-mcp:latest

# X (Twitter)
claude mcp add x-twitter --scope user -- \
  docker run --rm -i \
  --env-file "$HOME/.mcp/x.env" \
  -v "$HOME/.mcp/x-data:/data" \
  -e MCP_TRANSPORT=stdio \
  io2060/x-autonomous-mcp:latest
```

Verify and restart Claude Code afterwards:

```bash
claude mcp list   # both should show ✔ Connected
```

<details>
<summary>Equivalent manual config (<code>~/.claude.json</code> under <code>mcpServers</code>)</summary>

```json
{
  "mcpServers": {
    "linkedin": {
      "type": "stdio",
      "command": "/usr/local/bin/docker",
      "args": [
        "run", "--rm", "-i",
        "--env-file", "/Users/<you>/.mcp/linkedin.env",
        "-v", "/Users/<you>/.mcp/linkedin-data:/data",
        "-e", "MCP_TRANSPORT=stdio",
        "io2060/linkedin-mcp:latest"
      ],
      "env": {}
    },
    "x-twitter": {
      "type": "stdio",
      "command": "/usr/local/bin/docker",
      "args": [
        "run", "--rm", "-i",
        "--env-file", "/Users/<you>/.mcp/x.env",
        "-v", "/Users/<you>/.mcp/x-data:/data",
        "-e", "MCP_TRANSPORT=stdio",
        "io2060/x-autonomous-mcp:latest"
      ],
      "env": {}
    }
  }
}
```

Use **absolute paths** here — `~` and `$HOME` are not expanded inside `args`. Find your
Docker path with `which docker`.
</details>

---

## 5. Configure Claude Desktop

Claude Desktop reads MCP servers from its config file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

Edit it (create it if missing) and add the same two servers. Claude Desktop does **not**
inherit your shell `PATH`, so use the **absolute** Docker path and **absolute** env-file /
volume paths:

```json
{
  "mcpServers": {
    "linkedin": {
      "command": "/usr/local/bin/docker",
      "args": [
        "run", "--rm", "-i",
        "--env-file", "/Users/<you>/.mcp/linkedin.env",
        "-v", "/Users/<you>/.mcp/linkedin-data:/data",
        "-e", "MCP_TRANSPORT=stdio",
        "io2060/linkedin-mcp:latest"
      ]
    },
    "x-twitter": {
      "command": "/usr/local/bin/docker",
      "args": [
        "run", "--rm", "-i",
        "--env-file", "/Users/<you>/.mcp/x.env",
        "-v", "/Users/<you>/.mcp/x-data:/data",
        "-e", "MCP_TRANSPORT=stdio",
        "io2060/x-autonomous-mcp:latest"
      ]
    }
  }
}
```

Replace `/Users/<you>` with your home directory (`/Users/mj` here), and `/usr/local/bin/docker`
with the output of `which docker` if different. **Fully quit and reopen Claude Desktop** —
the servers appear under the 🔌 (MCP) icon when connected.

---

## 6. Verify it works

In either client, ask:

- **LinkedIn:** *"Who am I posting as on LinkedIn?"* → runs `get_me`, returns your profile
  and remaining daily budget.
- **X:** *"What's my X budget right now?"* → returns the budget counters.

Both servers report a daily budget in every response (e.g.
`li_budget: "0/5 posts used, ..."` / `x_budget: "0/8 replies used, ..."`), so the assistant
always sees its remaining limits.

---

## Daily budgets & safety rails

Both servers enforce **hard per-day limits** server-side — they refuse over-budget actions
even if the model is told to ignore them — plus **engagement deduplication** (never like /
comment / retweet the same post twice). Tune limits via the `*_MAX_*` env vars in the
respective env file (`0` = disabled, `-1` = unlimited). See each source repo's README for
the full option list.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `claude mcp list` shows the server but tools aren't available | Restart the client — tool lists load at startup. |
| Server won't connect | Confirm Docker is running and the image is pulled; run the `docker run …` command by hand to see the error. |
| Claude Desktop can't find `docker` | Use the **absolute** path from `which docker`; Desktop doesn't inherit your shell `PATH`. |
| LinkedIn calls fail with auth errors | Re-run the [one-time OAuth](#3-authenticate-linkedin-one-time-oauth); check `/oauth/status`. |
| X posting returns **403 oauth1-permissions** | Access Token was created before write perms were enabled — set the app to **Read and write** and **Regenerate** the token. |
| X returns **401 Unauthorized** | Re-check all 5 credentials in `x.env` for typos / stray spaces. |
| Action refused with a budget message | The daily limit is exhausted — raise the `*_MAX_*` value or wait for the daily reset. |

---

## Repository layout

```text
social-posts/
├── 2060.io/    # 2060.io brand posts
├── mobiera/    # Mobiera brand posts
├── verana/     # Verana brand posts
├── LICENSE
└── README.md
```
