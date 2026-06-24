# veranafoundation.org — Blog content

This folder is the **source of truth** for the Blog on
[veranafoundation.org/blog](https://veranafoundation.org/blog). The website fetches these
files from GitHub at build time (ISR) and renders them; it does not store blog content
itself.

The repo, path, and branch the site reads from are **configurable via environment
variables** on the website (defaults shown):

```bash
BLOG_REPO=mjfelis/social-posts
BLOG_PATH=veranafoundation.org/blog
BLOG_BRANCH=main
# Auth reuses the minutes-repo token (raises the GitHub API rate limit):
# MINUTES_GITHUB_TOKEN=...
```

## Authoring a post

One Markdown file per post. **Filename** sets the URL slug:

```
YYYY-MM-DD-slug.md   ->   /blog/slug
```

Each file starts with **YAML front matter**, then the Markdown body:

```markdown
---
title: A short, human title
date: 2026-06-24            # YYYY-MM-DD; used for ordering and display
tag: Mission               # one short category label (shown on the card)
excerpt: One or two sentences shown on the blog index card.
author: Verana Foundation  # optional
---

The body, in Markdown.
```

### Front-matter fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Post title (used for `<h1>`, `<title>`, and OG). |
| `date` | yes | `YYYY-MM-DD`. Posts are listed newest first. |
| `tag` | yes | Single short category, e.g. `Mission`, `Specifications`, `Formation`. |
| `excerpt` | yes | Plain-text summary for the index card and meta description. |
| `author` | no | Defaults to "Verana Foundation". |
| `draft` | no | `true` hides the post from the published site. |

## Supported Markdown

The site renders full Markdown (GitHub-flavored): headings, paragraphs, **bold**/_italic_,
lists, tables, code blocks, blockquotes, links, **images**, and **video** (via standard
HTML `<video>` or a linked file). Put media files alongside the post and reference them by
relative path, or use absolute URLs.

## Writing style

Same house rules as the rest of this repo (see [`../../post-rules.md`](../../post-rules.md)):
mission-led and accurate; verify claims against the strategy `defs.md`. Long-form blog posts
may use more than one em dash (unlike social posts), but keep prose clean.
