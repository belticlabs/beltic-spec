# IETF Compatibility

## Relevant WGs & RFCs

- **OAuth/OAuth2/gnap:** Credential presentation could reuse bearer or PoP semantics; not central unless we bind access tokens to credentials.
- **JOSE (RFC 7515 JWS, 7516 JWE, 7517 JWK, 7519 JWT):** Natural fit for signing credentials. Recommend JWS payload = credential JSON; optional JWT claims (`iss`, `sub`, `nbf`, `exp`, `jti`, `aud`).
- **RFC 8747 (PoP for JWT):** Useful if credentials need holder binding via `cnf` claim.
- **COSE (RFC 9052):** Binary alternative; good for constrained devices but lower DX priority.
- **RATS/SCITT:** Attestation models for software supply chain; potential inspiration for agent attestation of runtime, but out-of-scope for v1.
- **HTTPbis:** Credential transport over HTTPS; standard cache/ETag semantics if publishing status lists.

## JSON Practices

- RFC 8259 compliant today. Ensure stable ordering before signing or rely on JWS canonicalization by signing exact bytes of serialized payload.

## JWT/JWS Fit

- Our fields map to JWT claims: `iss` = issuerDid, `sub` = subjectDid, `jti` = credentialId, `nbf`/`exp` from issuance/expiration. Custom claims for credential body (`dev`, `agent`) or embed full credential as payload.
- Need clear `typ`/`cty` (e.g., `application/beltic-agent+json`).
- For revocation: pair `jti` with Status List or OCSP-like endpoint; JWT alone does not solve revocation.

## Internet-Draft Path

- Suggested venue: none dedicated; propose in JOSE or ART area via individual draft. Alternatively, BoF on “AI Agent Credentials”.
- Prereqs: 2+ independent implementations, interop results, security considerations, IANA considerations for media types, JOSE header parameters if custom.
- Draft shape: define media types, JWT profile, status mechanism reference, threat model.
- Timeline: 2–4 years with WG adoption; start as individual I-D.

## Gaps to Address

- Define canonical signing profile (JWS/COSE) and required headers/claims.
- Media types and registries (IANA) not defined.
- Status list format needs reference (could reuse W3C Status List 2021 with HTTP hosting).
- No conformance test vectors for JWS/COSE.

## Recommendation

- Short term: standardize on JWS (ES256/EdDSA) with JWT-style registered claims plus embedded credential JSON. Publish `application/beltic-agent+json` and `application/beltic-developer+json`. Explore COSE as optional profile for constrained environments. Begin drafting an individual I-D after producing two independent implementations and status list design.
