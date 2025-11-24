# W3C VC Alignment

## Overview
- Beltic credentials are JSON + JSON Schema today with embedded issuer/subject DIDs but not wrapped in VC Data Model structures (no `@context`, `type`, `credentialSubject`, `issuanceDate`/`expirationDate` semantics, or VC proof objects).
- VC 2.0 brings clearer status lists and JSON-LD contexts; aligning would unlock selective disclosure, existing wallets, and verifier tooling.

## Mapping to VC Data Model 2.0
- **Issuer:** Beltic (or third-party auditor). VC `issuer` → our `issuerDid` today; would map directly.
- **Holder:** Developer for DeveloperCredential; Agent operator for AgentCredential. VC `holder` can be the developer DID; for agents, either the runtime operator or the developer acting as presenter.
- **Subject:** DeveloperCredential subject = developer org/individual DID. AgentCredential subject = agent DID. VC `credentialSubject` would carry our claims.
- **Claims:** Our field sets (identity, risk, safety metrics, tools) map into `credentialSubject` properties; would need a JSON-LD context to define terms.
- **Proof:** VC uses Linked Data Proofs or JWS proofs; we currently have an ad-hoc `proof` object. Migration would adopt `proof` per VC 2.0 with a defined `type`, `created`, `verificationMethod`, `proofPurpose`.
- **Status/Revocation:** VC Status List 2021 can replace our `credentialStatus` + `revocationListUrl` pattern and provide bitstring revocation.
- **Contexts/Types:** Need Beltic contexts (e.g., `https://schema.beltic.com/contexts/agent-credential-v1.jsonld`) and types (`BelticAgentCredential`, `BelticDeveloperCredential`).

## DID Considerations
- Developer and Agent DIDs recommended. did:web easiest for organizations; did:key for lightweight self-issued; did:ion/indy if decentralized anchoring is desired. Resolution flows map cleanly to verifier lookup of signing keys.
- Trade-offs: did:web is simple but DNS-bound; did:key lacks rotation; did:ion adds operational complexity but enables anchoring and rotation with fewer central dependencies.

## VC Implementations & Tooling Insights
- Wallets/issuers: Microsoft Entra Verified ID (JWS-based VCs), Spruce, Dock, Trinsic. Patterns: JWT VC and JSON-LD VC coexist; most production issuers use JWS proofs for performance.
- Tooling we can leverage: vc.js (JavaScript), DIF `did-jwt-vc` (JWT-based), `vc-data-model` contexts. Status List 2021 libraries available.

## Gap Table
| Beltic Feature | VC Equivalent | Gap/Difference | Migration Path |
|----------------|---------------|----------------|----------------|
| `issuerDid` | `issuer` | Naming only | Map field + align proof format |
| `subjectDid` | `credentialSubject.id` | Structural difference | Move to `credentialSubject.id` |
| Field claims | `credentialSubject` | Same data, needs context | Define JSON-LD context with term IRIs |
| `proof` (custom) | VC `proof` | Align structure/allowed types | Adopt VC JWS/LD-Proof; drop custom keys |
| `credentialStatus` + `revocationListUrl` | Status List 2021 | Currently ad-hoc URL + enum | Publish status list credential; embed `status` object |
| `schemaVersion` | `@context` + `type` | Schema vs semantic versioning | Use context version for semantics; keep `$schema` for validation |
| Selective disclosure (none) | SD-JWT/LD-Proofs | Missing | Support SD-JWT or BBS+ for ZK/SD |

## Feasibility
- High: Data already structured; main work is wrapping in VC envelope, defining contexts, and adopting standard proof/status mechanisms.
- Cost: Authoring complexity rises (JSON-LD contexts), but can offer JWT-VC profile to keep DX reasonable.

## Recommendation
- Adopt VC-compatible envelope with JWS proofs first (JWT-VC profile) to balance DX and interoperability. Add JSON-LD contexts for semantic clarity; keep JSON Schema for validation. Plan Status List 2021 for revocation and optional SD-JWT/BBS+ for selective disclosure.
