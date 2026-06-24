# Post Rules

Rules for creating and saving social media posts in this repository. They exist so every
published post has a durable, reviewable source-of-truth file alongside its attachments.

## Where posts live

- Save each post inside its **brand folder**: [`2060.io/`](./2060.io), [`mobiera/`](./mobiera),
  or [`verana/`](./verana).
- One **Markdown file per post**, plus one file per **attachment** (image, etc.).

## Naming convention

```text
YYYYMMDD-NNN.md            ← the post
YYYYMMDD-NNN-AAA.<ext>     ← an attachment of that post
```

- **`YYYYMMDD`** — the date the post is created, e.g. `20260623`.
- **`NNN`** — the post number for that day, zero-padded to 3 digits, **starting at `001`**
  and incrementing per day (the first post of each day resets to `001`).
- **`AAA`** — the attachment number within a post, zero-padded to 3 digits, starting at
  `001`. The attachment filename **must share the post's `YYYYMMDD-NNN` prefix** so it
  sorts next to its post.
- **`<ext>`** — the attachment's real extension (`.png`, `.jpg`, `.mp4`, `.pdf`, …).

Example for the second post created on 2026-06-23, with two images:

```text
verana/
├── 20260623-002.md
├── 20260623-002-001.png
└── 20260623-002-002.png
```

## Required file contents

Every post `.md` file must contain these sections, in this order:

1. **Title** — a short H1 (`# …`) naming the post.
2. **Platform** — `LinkedIn`, `X`, or both (the post may be tailored per platform).
3. **Content** — the exact text to publish. If the wording differs per platform, use a
   subsection per platform.
4. **Attachments** — a list of the attachment files for this post. For each attachment,
   include the **prompt that generated it** (the image/media-generation prompt) so it can
   be reproduced or revised.
5. **Status** *(optional but recommended)* — `draft` / `published`, plus the published URL
   or post URN once live.

If a post has no attachments, keep the **Attachments** section and write `None`.

## Template

```markdown
# <Title>

## Platform
LinkedIn   <!-- LinkedIn | X | LinkedIn + X -->

## Content
<exact post text to publish>

<!-- If wording differs per platform, replace the block above with: -->
<!--
### LinkedIn
<linkedin text>

### X
<x text>
-->

## Attachments
- `YYYYMMDD-NNN-001.png` — prompt: "<image generation prompt used>"
- `YYYYMMDD-NNN-002.png` — prompt: "<image generation prompt used>"

<!-- or: None -->

## Status
draft
```

## Writing style

Applies to the published **Content** text (per platform):

- **At most one em dash (`—`) per post.** Overuse of `—` reads as AI-generated. Use no more
  than one; replace the rest with a period, comma, colon, or parentheses.
- **No Markdown in the body** — `**bold**` / `*italics*` render literally on LinkedIn and X.
- **Write "and", not "&"** — the publishing API HTML-escapes `&` to `&amp;`.

See [`scripts/PUBLISHING.md`](./scripts/PUBLISHING.md) for the full publishing playbook.

## Publishing

Posts are published through the **linkedin-mcp** and **x-autonomous-mcp** servers (see
[`README.md`](./README.md)). After a post is published:

- Update its **Status** to `published` and record the post URL / URN.
- Remember both servers enforce **daily budget limits** (e.g. LinkedIn defaults to 5
  posts/day) — plan the day's `NNN` sequence accordingly.

## Checklist

- [ ] File saved in the correct brand folder.
- [ ] Filename is `YYYYMMDD-NNN.md` with today's date and the next per-day number.
- [ ] Attachments share the `YYYYMMDD-NNN` prefix and are numbered `-001`, `-002`, …
- [ ] All required sections present (Title, Platform, Content, Attachments).
- [ ] Each attachment lists the prompt that generated it.
- [ ] No more than one em dash (`—`) in the post; no Markdown / `&` in the body.
