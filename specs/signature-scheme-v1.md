# Signature Scheme v1 (Draft)

## Abstract
Defines the signing/verification profile for Beltic credentials using JWS (JWT-compatible) with ES256 or EdDSA. Provides claim mapping, header parameters, and verification steps suitable for independent implementations.

## Status
Draft

## Terminology
- Credential: DeveloperCredential or AgentCredential JSON payload.
- Issuer: Entity signing the credential.
- Subject: Credential holder (developer org or agent DID).
- Status List: Revocation bitstring document (W3C Status List 2021 style).

## Algorithm Choices
- Required: ES256
- Recommended: EdDSA (Ed25519)
- Optional: RS256 for legacy

## Envelope
- Use JWS Compact or Flattened JSON. Payload = UTF-8 JSON of credential (canonical ordering recommended). Alternatively, JWT claims with embedded `vc` object containing credential body.

### Headers
- `alg`: ES256 | EdDSA
- `kid`: Key identifier referencing issuer key (DID verification method ID or JWKS key ID)
- `typ`: `application/beltic-agent+jwt` or `application/beltic-developer+jwt`
- `cty`: `application/json`

### Payload Claims (JWT profile)
- `iss`: issuer DID
- `sub`: subject DID
- `jti`: credentialId
- `nbf`: issuanceDate
- `exp`: expirationDate
- `vc` or `beltic`: full credential claims (mirrors current JSON schema fields)
- Optional: `aud` (intended verifier), `cnf` (holder binding via JWK/thumbprint)

## Signing
1. Serialize payload JSON deterministically (UTF-8). For JWT profile, use standard base64url encoding of header/payload.
2. Sign with private key matching `kid` and `alg`.
3. Output compact JWS or JSON serialization.

## Verification
1. Parse JWS/JWT; ensure `typ` matches expected media type.
2. Resolve issuer key via DID document or JWKS `kid`.
3. Verify signature with `alg` and key.
4. Validate `nbf` ≤ now ≤ `exp`; enforce `aud` if present.
5. Fetch status list from credential `status` entry (or legacy `revocationListUrl`); ensure bit not revoked and `credentialStatus` not revoked/suspended.
6. Validate credential body against JSON Schema.
7. Enforce policy (kybTierRequired, safety thresholds, data categories).

## Revocation
- Use Status List 2021 (compressed bitstring). Credential carries `status` object: `{ "id": "https://status.beltic.io/agents/v1#list", "type": "StatusList2021Entry", "statusPurpose": "revocation", "statusListIndex": "1234", "statusListCredential": "https://status.beltic.io/agents/v1" }`.
- Legacy: `revocationListUrl` + `credentialStatus` retained for backward compatibility.

## Key Management
- Issuer keys in HSM/KMS; rotate by publishing new `kid` in JWKS/DID doc and overlapping validity. Maintain key history for signature verification of older credentials.
- Subject keys: recommend DIDs supporting rotation (did:web with rotated JWKS, did:ion for decentralized anchoring). If holder binding required, include PoP `cnf` claim.

## Test Vectors (outline)
- Provide sample JWS (ES256) over minimal AgentCredential with known keypair (to be published with actual keys in repo tests).
