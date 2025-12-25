# Standardization Readiness

## Technical Gaps

- VC envelope absent (P0 for W3C alignment); status uses custom enum/url instead of Status List (P0).
- No signed format profile (JWS/COSE) defined (P0).
- No conformance tests/test vectors (P1).
- Missing consent/BAA/tenant-isolation fields for regulated data (P0 for global adoption).
- No selective disclosure support (P2, future).

## Implementation Gaps

- Single codebase; no independent implementations (P0). Need 2+ plus interop report.
- No CLI/SDK for signing/verifying (in progress roadmap).

## Documentation Gaps

- Threat model/security considerations not formalized (P0).
- No privacy considerations section in main specs (P1).
- No registries/media types defined (P1).

## Community Gaps

- No early adopter references; no WG engagement yet (P1).

## Prioritized Actions

- Define and publish signed profile (JWS + media types) with test vectors.
- Add VC/JWT profile and Status List for revocation.
- Add regulated-data evidence fields (consent/BAA) and tool approval limits.
- Produce conformance tests and second implementation.
- Engage W3C VC and IETF JOSE/ART communities with use cases and drafts.
