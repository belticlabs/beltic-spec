# Trust Model v1 (Draft)

## Abstract
Defines how trust is established across DeveloperCredential and AgentCredential using DIDs, signed credentials, and status lists.

## Roles
- **Issuer:** Beltic or third-party auditor signing credentials.
- **Subject:** Developer (for DeveloperCredential) or Agent (for AgentCredential).
- **Holder/Presenter:** Entity presenting credential (developer or agent operator).
- **Verifier:** Merchant/platform evaluating credentials.

## Trust Chain
1. Verify AgentCredential signature and status.
2. Follow `developerCredentialId` → fetch DeveloperCredential; verify signature/status.
3. Check `kybTierRequired` ≤ developer KYB tier and `developerCredentialVerified=true`.
4. Enforce safety/privacy thresholds per verifier policy.

## Identifiers
- Use DIDs for issuer/subject; resolver fetches public keys. did:web for simplicity; did:key for lightweight; did:ion for rotation/decentralization.

## Revocation
- Status List 2021 style lists for developer and agent credentials; verifier checks both.
- AgentCredential auto-invalid if linked DeveloperCredential revoked/expired.

## Evidence & Assurance
- Assurance metadata per field; verifiers may require `globalAssuranceLevel` ≥ `beltic_verified` and specific field assurances.
- For regulated data, require consent/BAA evidence (future fields) and tool approval thresholds.

## Presentation
- Holder presents JWS/VC with optional audience restriction. Verifier validates signature, status, schema, policies.

## Privacy
- Public/default view excludes restricted fields; selective disclosure to be added (SD-JWT/BBS+).

## Security Considerations
- Replay mitigated via `nbf`/`exp` and status list checks.
- Impersonation mitigated via DIDs and PoP (`cnf` claim) if holder binding required.
- Key compromise handled via revocation and rotation.
