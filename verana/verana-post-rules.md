# Verana Post Rules

Brand-specific rules for writing **Verana** posts. Read these together with the repo-wide
[`../post-rules.md`](../post-rules.md) (file naming, required sections, attachments).

---

## 1. Read these sources first

Before drafting a Verana post, have a clear, current view of the relevant sources below.
**Precedence matters** — when sources disagree, the higher one wins.

### Canonical — always the source of truth

- **`solving/verana-strategy/2026/defs.md`** *(mjfelis/solving)* — **THE** content source of
  truth. All entity definitions (Foundation, Council, 2060, VNA token, Hologram) live here;
  every other doc is derived from it. **Verify every claim in a post against `defs.md`.**

### Specifications (the technical substance)

- **`verana-labs/verifiable-trust-spec/spec.md`** — Verifiable Trust (VT) specification.
- **`verana-labs/verifiable-trust-vpr-spec/spec.md`** — Verifiable Public Registry (VPR)
  specification.

### Websites (live messaging reference)

- **`verana-labs/veranafoundation.org-website`** — the **only up-to-date** Verana website;
  use it as the messaging/positioning reference.
- **`verana-labs/verana.io-website`** — secondary; check it's current before reusing copy.

### Adjacent context

- **`2060-io/2060.io-website`** — 2060's positioning (2060 is lead spec author and builds
  Hologram on top of Verana infra). Useful for the Foundation ↔ 2060 relationship.

### ⚠️ Outdated / do NOT cite

- **`verana-labs/veranacouncil.org-website`** — code, `spec.md`, and sitemap are **outdated
  and being reworked**. Do **not** lift copy from it.
- **`legal/Initial-Council-Member-MoU-v1.md`** — **abandoned**. Never reference or quote it.
- The current Council site copy is being rebuilt from `solving/verana-strategy/2026/council-website/spec.md`
  — treat Council messaging as in-flux and confirm against `defs.md`.

> If a post touches the **Council**, double-check the framing against `defs.md` — Council
> details have changed and a lot of older material is stale.

---

## 2. Voice & tone

Verana's voice is that of a **standards-body steward**, not a startup chasing hype. Think
"foundation rebuilding trust infrastructure for the internet" — credible, technical, and
mission-driven.

### The voice is

- **Mission-led & purposeful** — anchored in the mission: *rebuilding digital trust in an era
  where the web's original promise of openness, privacy, and decentralization has been
  undermined.* Lead with the why.
- **Authoritative, not promotional** — Verana stewards open standards. Speak with the
  calm authority of an institution, not the urgency of a sales pitch.
- **Technical but accessible** — precise about VCs, DIDs, trust registries, Agentic AI; but
  a policymaker or business reader should still follow. Define or contextualize jargon on
  first use.
- **Open & neutral** — open standards, open source (Apache 2.0), permissioned-but-open trust.
  Inclusive of the ecosystem; never positioned as a closed/proprietary play.
- **Forward-looking & sober** — name the real problems (identity theft, misinformation,
  Agentic AI risk, opaque governance) plainly, then position Verana's trust layer as the
  considered response. Confident, not breathless.

### The voice is NOT

- ❌ Hype-y or hard-selling ("revolutionary", "game-changer", "to the moon", price talk).
- ❌ Crypto-bro / speculative framing. **VNA is a utility token** — never investment advice,
  price prediction, or "buy now" energy.
- ❌ Vague buzzword soup. Every claim should map to something real in the specs or `defs.md`.
- ❌ Combative or dismissive of other projects. Differentiate on substance, respectfully.
- ❌ Em-dash overuse. **At most one `—` per post** — more reads as AI-generated (see
  [`../post-rules.md`](../post-rules.md) → Writing style).

### Reference phrasings (Verana's actual language)

- "rebuilding digital trust" · "a new trust layer for the internet"
- "secure, verifiable, interoperable, and privacy-respecting communication"
- "open standards and decentralized infrastructure"
- "Sovereign Trust Networks" (governments & industries framing)
- Built on **Verifiable Credentials (VCs)**, **decentralized identifiers (DIDs)**, and
  **permissioned trust registries**.

### Audience & platform

- **Audience:** digital-identity & decentralized-trust community, standards bodies, govern-
  ments/regulators, enterprises, and AI-agent builders.
- **LinkedIn:** the primary channel — slightly longer, professional, thought-leadership tone;
  tasteful hashtags (#DigitalIdentity #VerifiableCredentials #DecentralizedIdentity #AgenticAI).
- **X:** tighter and punchier within the same voice; no hype to win the algorithm.

---

## 3. Terminology guardrails

Get these right — they are easy to blur and matter to credibility (all per `defs.md`):

- **Verana Foundation** — nonprofit steward. **Owns** the specs; **hosts/stewards/maintains**
  the open-source software (Apache 2.0, copyright with contributors); **issues & administers**
  the VNA token. It does **not** govern, secure, or operate the live network, and does **not**
  own the token.
- **Verana Council** — governs/operates the network (details in flux — verify in `defs.md`).
- **2060 (2060 OÜ)** — lead author of the specs; builds **Hologram** (Agentic AI product line)
  on top of Verana infrastructure. A separate commercial entity, not the Foundation.
- **VNA token** — the protocol's **native, decentralized utility token, owned by no one**.
  Never frame as a security/investment.
- **Verifiable Trust (VT)** and **Verifiable Public Registry (VPR)** — the two flagship specs;
  use the full name on first mention, then the acronym.

When in doubt about who owns/does what, **quote `defs.md`**, don't paraphrase from memory.

---

## 4. Before publishing — checklist

- [ ] Read the relevant sources above; **claims verified against `defs.md`**.
- [ ] No content lifted from the outdated Council site or the abandoned MoU-v1.
- [ ] Voice check: mission-led, authoritative, no hype, no token/price talk.
- [ ] Terminology correct (Foundation vs Council vs 2060; VNA = utility token).
- [ ] Tailored per platform (LinkedIn vs X) per [`../post-rules.md`](../post-rules.md).
- [ ] Saved as `YYYYMMDD-NNN.md` in `verana/` with attachments + their generation prompts.
- [ ] Daily MCP budget allows it (LinkedIn defaults to 5 posts/day).
