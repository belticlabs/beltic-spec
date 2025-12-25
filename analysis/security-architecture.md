# Security Architecture

## Threat Model (selected)

- Credential forgery/modification → mitigated by digital signatures (JWS/COSE/LD-Proof) and status checks.
- Replay → use `nbf`/`exp`, `jti`, audience scoping, freshness of status list.
- Key compromise → rotation, status list revocation, short-lived credentials for high risk, HSM/KMS storage.
- Impersonation → bind `sub` to subject DID/key; optional PoP (`cnf`) to prove possession.
- Privacy leakage → selective disclosure/SD-JWT (future), minimize sensitive fields in public presentations.

## Cryptographic Properties

- Integrity/authenticity via signatures.
- Non-repudiation via issuer-managed keys and audit trails.
- Confidentiality generally not required; if needed, use JWE/COSE_Encrypt for restricted sharing.

## Signature & Revocation

- Preferred algorithms: ES256 or EdDSA (Ed25519) for size/speed; RS256 optional for legacy.
- Sign the canonical JSON payload (or JWT claims). Embed `iss`, `sub`, `jti`, `nbf`, `exp`, `aud?`.
- Revocation via Status List 2021-style bitstring; host at HTTPS with caching; include `status` pointer in credential.

## Verification Flow

1. Parse envelope (JWT/JWS/VC).
2. Resolve issuer key (DID document or JWKS URL).
3. Verify signature and required claims (`nbf`/`exp`, `iss`/`sub` binding, `aud` if set).
4. Fetch status list and confirm non-revoked + credentialStatus.
5. Validate against JSON Schema.
6. Enforce policy (kybTierRequired, safety scores, data categories).

## Selective Disclosure

- Not in v1; consider SD-JWT for JWT profile or BBS+ for LD-Proofs in v2. Identify redacted fields: registeredAddress, businessPhone, systemConfigFingerprint.

## Key Management (brief)

- Issuer keys in HSM/KMS; rotation with overlapping validity and status updates.
- Developer/agent subject keys: recommend did:web/did:key; enable rotation via DID methods that support it.
- JWKS endpoints for Beltic/DID docs; pin algorithms; enforce key IDs.

## Recommendations

- Standardize on JWS (ES256/EdDSA) with JWT claims; status list revocation; publish JWKS. Plan SD-JWT/BBS+ for v2. Document threat model and verification steps in specs.
