---
title: "Vesta Appliances: from impostors to Proof-of-Trust"
date: 2026-08-17
tag: Use cases
excerpt: The Vesta use case is now published in the FIDES Use Case Catalog. A fictional manufacturer, a real trust chain, and an impostor whose perfect uniform is not enough — all running live on the Verana testnet.
author: Fabrice Rochette
authorAvatar: https://2060.io/assets/illustrations/fabrice.jpeg
authorSocial: https://www.linkedin.com/in/fabricerochette/
---

![Vesta Appliances (demo) factory floor: workers in purple uniforms assembling washing machines](https://playground.testnet.verana.network/images/factory-fides.jpg)

A repair technician rings your doorbell. The badge looks right. The uniform looks right. And nothing about either can be checked.

That moment — a stranger at your door, asking to be let in on the strength of a logo — is where the Vesta use case begins. It is now published in the [FIDES Use Case Catalog](https://fides.community/ecosystem-explorer/use-cases/?usecase=vesta-appliances-from-impostors-to-proof-of-trust-ATYNCN), and every step of it runs live on the Verana testnet, where you can play it end to end with a real wallet.

## One company, one trust chain

Vesta Appliances (demo) is a fictional Swiss manufacturer — quality home appliances since 1985 — with a problem every real brand shares: customers cannot tell the difference between Vesta and anyone dressed as Vesta.

In the story, Vesta becomes verifiable, and then makes its whole network verifiable:

- **Vesta proves itself first.** An accredited issuer runs Know-Your-Business once and issues Vesta's organization credential. From that moment, Vesta's services — its support portal, its repair-network registry — carry credentials that chain back to an accountable company.
- **Vesta's ecosystem accredits the network.** The Vesta Repair Network is Vesta's own ecosystem on the public registry. Regional subsidiaries are accredited to issue the Authorized Repairer credential, and they accredit independent repair companies like Zenith Repairs (demo).
- **Repairers issue badges to people.** An authorized repairer issues technician badges to its own staff. When a technician rings your doorbell, your wallet verifies the badge, the company behind it, its authorization in the Vesta Repair Network, and Vesta itself — the whole chain, in one scan.

## The impostor is the point

The story's antagonist, Umbra Repairs (demo), is not a crude fake. It is a real, verifiable company: it holds a genuine organization credential, runs a genuine verifiable service, and issues very real-looking badges.

And its badges still fail. Umbra was never accredited by the Vesta Repair Network, so its technicians earn no seal at the door and its logins are refused at Vesta's portal. That is the lesson the use case is built around: **verifiable is not the same as authorized.** Identity can be proven and still not be enough — authorization lives in the ecosystem's registry, where it can be checked by anyone and revoked the day it ends.

## Three questions, answered before anything is shared

Throughout the demos, the wallet answers the same three questions at the right moments:

1. **Before you connect** — is this service trusted, and who operates it?
2. **Before you accept** — is this issuer accredited to issue this credential?
3. **Before you share** — is this verifier authorized to ask for it?

Green means the chain holds. Red means the interaction stops before any of your data moves.

## Run it yourself

Everything above runs on the Verana testnet: one open-source business wallet ([VS Agent](https://github.com/verana-labs/vs-agent)) per participant, real registries, real credentials. The same demos work across every open-source personal wallet integrated in the playground — one trust layer, many wallets.

- Explore the use case on FIDES: [Vesta Appliances: from impostors to Proof-of-Trust](https://fides.community/ecosystem-explorer/use-cases/?usecase=vesta-appliances-from-impostors-to-proof-of-trust-ATYNCN)
- Play it on the Verana Playground: [playground.testnet.verana.network/usecases/vesta](https://playground.testnet.verana.network/usecases/vesta)
