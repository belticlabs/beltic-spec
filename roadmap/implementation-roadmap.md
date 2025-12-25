# Implementation Roadmap

## Phase 1: v1 Foundation (0-3 months)

- Deliver JSON Schemas (stabilize v1.0); add consent/BAA + tool-limit fields (P0).
- Define JWS profile + media types; publish test vectors.
- CLI (validate/sign/verify/convert) + JS/TS SDK.
- Publish 5+ example credentials and templates.

## Phase 2: Security Hardening (3-6 months)

- Multi-alg support (ES256, EdDSA, RS256 optional); key rotation guidance.
- Status List 2021 revocation for developer/agent creds; hosting + caching guidance.
- Threat model + security/privacy considerations docs; initial audit.
- Python and Go SDKs; CI actions for validation/signing.

## Phase 3: Standards Alignment (6-12 months)

- VC/JWT-VC compatible profile with contexts; optional JSON-LD contexts.
- Selective disclosure prototype (SD-JWT or BBS+ for restricted fields).
- Interop testing between two independent implementations; conformance suite.
- Publish draft Internet-Draft + W3C Community Group report.

## Phase 4: Standardization Submission (12-24 months)

- WG engagement (W3C VC WG, IETF JOSE/ART/BoF). Iterate drafts.
- 3+ independent implementations; public interop results.
- Complete revocation/status infra at scale.

## Phase 5: Adoption (24+ months)

- Reference implementation, test vectors, certification checklist.
- Case studies and merchant integration guides.
- Prepare for REC/RFC publication.
