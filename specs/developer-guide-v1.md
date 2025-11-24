# Developer Guide v1 (Draft)

## Abstract
Step-by-step guide for creating, validating, and signing Beltic credentials.

## Status
Draft

## Workflow
1. **Choose format**: Start with JSON template (or YAML source) matching schema version.
2. **Populate fields**: Use examples for your entity type; ensure conditional requirements (KYB tier, screenings, tool lists) are met.
3. **Validate schema**: `beltic validate --schema schemas/... --data my-credential.json` (CLI planned) or `ajv`.
4. **Sign**: Use JWS profile with ES256/EdDSA. Provide issuer key (`kid`), set `iss`, `sub`, `nbf`, `exp`, `jti`.
5. **Publish/Store**: Host signed credential or provide to relying parties; ensure `status` endpoint reachable.
6. **Rotate/Update**: For material changes (model, tools, safety metrics), re-issue AgentCredential; for KYB changes, re-issue DeveloperCredential.

## Best Practices
- Keep issuance/expiration short for high-risk agents (6–12 months).
- Use did:web with TLS + DNSSEC for organizational DIDs; rotate keys via JWKS.
- Maintain audit logs of verification evidence (screenings, test results).
- Avoid embedding sensitive PII; rely on selective disclosure (future) or restricted presentations.
- Provide OpenAPI references for tools where possible.

## Integration Patterns
- **CI/CD**: Validate and sign on release; attach credential to agent artifact.
- **Runtime presentation**: Agent presents JWT/VC to merchant; merchant verifies signature + status list.
- **Revocation**: Update status list promptly if key compromise or policy violation.

## Security Considerations
- Protect signing keys in HSM/KMS.
- Enforce `aud` when issuing credential for a specific relying party.
- Monitor for reuse of revoked credentials.

## Privacy Considerations
- Minimize restricted data in public payloads; prepare for SD-JWT/BBS+ adoption for sensitive fields.
