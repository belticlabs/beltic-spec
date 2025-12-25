# Merchant FAQ – v1 Credentials

## What if I need reliability guarantees before onboarding an agent?

Beltic v1 does not certify uptime or error-rate guarantees. Request SLAs and monitoring dashboards directly from the developer (e.g., pager escalation times, weekly availability reports). Track them in your vendor management system until Beltic offers audited reliability metrics (see `docs/metrics-roadmap.md`).

## Can Beltic prove fairness/bias controls today?

Not yet. Ask the developer for domain-specific bias audits or human review procedures. Beltic plans to add standardized fairness packs in v2; until then, evaluate fairness evidence the same way you would for traditional software vendors.

## How do I verify privacy practices beyond the credential?

Review the `dataLocationProfile`, `dataCategoriesProcessed`, and retention policies in the AgentCredential. For deeper diligence, request data flow diagrams or DPAs directly from the developer, and ensure contract terms align with your regulatory obligations.

## What actions should I take when reviewing credentials?

1. Verify the AgentCredential signature and check revocation.
2. Inspect the linked DeveloperCredential (KYB tier, sanctions status).
3. Confirm `toolsList`, `humanOversightMode`, `failSafeBehavior`, and safety scores meet your risk appetite.
4. Record any supplemental evidence (SLAs, fairness audits) in your vendor tracker.

## How will future metrics be delivered?

Beltic will publish updated specs/schemas (e.g., `docs/agent-credential-v2.md`) and announce them in `progress.md` and release notes. Merchants can then require developers to upgrade to the new schema for additional assurances.
