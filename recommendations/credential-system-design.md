# Credential System Design Recommendations

## Format

- Primary: Hybrid JSON + JWS (JWT-compatible) with media types. Keeps current schemas, adds tamper-proofing and standard tooling.
- Secondary: VC/JWT-VC profile with contexts to interoperate with wallets; optional JSON-LD when semantic alignment needed.
- Optional: COSE/CBOR profile for constrained environments.

## Signature Scheme

- Algorithms: ES256 required; EdDSA recommended; RS256 optional.
- Envelope: JWS/JWT with `iss`, `sub`, `jti`, `nbf`, `exp`, optional `aud`, `cnf`; payload contains credential JSON.
- Revocation: Status List 2021; include `status` object. Host lists at stable HTTPS.

## Authoring & Tooling

- Authoring: JSON templates + YAML option compiled via CLI; SDKs for JS/TS (v1), Python/Go (v1.1).
- Tooling priorities: CLI (init/validate/sign/verify/convert), JS SDK, VS Code extension, GitHub Action.

## Standardization Strategy

- Sequence: implement JWS profile + status list → produce VC/JWT-VC compatibility → two independent implementations → publish W3C CG report and IETF I-D in parallel.
- Focus first on W3C VC alignment for credential semantics; use IETF path for envelope/media types.

## Schema Management

- Semantic versioning; immutable published schemas/contexts. Allow `x_` extensions. Maintain migration guides and N-1 support.

## Critical Additions for v1.1

- Structured consent/BAA evidence and tool-limit fields.
- Evaluation coverage metadata (attempt counts/categories).
- Tenant isolation/compliance attestation field for multi-tenant/regulated agents.
