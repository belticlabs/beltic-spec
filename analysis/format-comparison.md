# Format Comparison

## Profiles Compared

- Plain JSON + JSON Schema (current)
- JWT (JWS-secured)
- W3C VC (JSON-LD with LD/JWS proofs)
- Hybrid JSON + JWS (non-JWT detached JWS over JSON)
- CBOR + COSE

## Summary Matrix

| Format          | DX  | Security | Standards | Interop | Notes                                                          |
| --------------- | --- | -------- | --------- | ------- | -------------------------------------------------------------- |
| JSON + Schema   | 9   | 3        | 5         | 6       | Great for editing/validation; no tamper-proofing               |
| JWT (JWS)       | 7   | 9        | 10        | 10      | Strong libraries; compact; base64 hides readability            |
| VC (JSON-LD)    | 4   | 9        | 10        | 8       | Semantic; higher complexity; SD possible                       |
| Hybrid JSON+JWS | 7   | 9        | 9         | 9       | Human-readable JSON plus standard JWS; minimal envelope change |
| CBOR+COSE       | 5   | 9        | 8         | 6       | Efficient binary; fewer tools; less human-friendly             |

## Examples (sketch)

- **Hybrid JWS over JSON:** Serialize credential JSON canonically (e.g., UTF-8, no reordering), sign with detached JWS header `{alg:"EdDSA", typ:"application/beltic-agent+json"}`.
- **JWT:** Payload embeds credential claims (`iss`, `sub`, `jti`, `nbf`, `exp`, `vc` or `agent` object).
- **VC JSON-LD:** Wrap credential in VC envelope with `@context`, `type`, `issuer`, `issuanceDate`, `credentialSubject`, `proof` (LD-Proof or JWS proof).

## Library Availability (JS/Py/Go)

- **JWS/JWT:** node-jose/jose, PyJWT/josepy, Go jose (`github.com/square/go-jose/v4`).
- **COSE:** `cose-js`, `cose` (Python), `github.com/fxamacker/cose` (Go).
- **VC:** `did-jwt-vc`, `vc-js`, `vc-http-api`; fewer Go/Python libs but JWT-VC interoperates.

## Performance Considerations

- JWT/JWS: Slight base64 expansion (~33%); fast parsing; streaming-friendly.
- JSON-LD: Larger payloads; context resolution overhead; signing requires canonicalization (URDNA2015) if LD-Proofs.
- CBOR/COSE: Smaller binary size; faster parse; not human-readable.

## Migration Paths

- Short-term: Hybrid JSON+JWS (or JWT profile) keeping existing schemas; add media types and signing envelope.
- Mid-term: VC-compatible profile (JWT-VC) to bridge to wallets; optional JSON-LD contexts for semantics.
- Long-term: Add SD-JWT/BBS+ proofs for selective disclosure.

## Recommendation

- Adopt Hybrid JSON + JWS (JWT-compatible) as primary; maintain schemas; define media types. Plan VC compatibility via JWT-VC profile with contexts to enable wallets. Leave COSE as optional profile for constrained environments.
