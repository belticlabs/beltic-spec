# E-commerce Refund Agent (Scenario A)

## Developer Profile

- Entity: Pioneer Refunds LLC (5-person startup, 2 years old)
- KYB Tier: tier_2_standard; sanctions/PEP/adverse media all clear; low overall risk
- Contact: support@pioneerrefunds.example | security@pioneerrefunds.example

## Agent Overview

- Name: FlowRefund Agent v1.4.0 (`9d4c4d1e-5f35-4c5a-9e9a-58c2a0f52311`)
- Function: Validate refund eligibility, issue refunds up to $500, notify customers, escalate edge cases
- Model: Claude-3 Sonnet; tool-using architecture with three tools (order lookup, refund, notifications)
- Data: PII + financial; max retention 90 days; no training on user data; US storage with EU DR backups
- Safety posture: Moderate risk; human pre-approval on refund tool; monitoring + injection detectors

## Credentialing Experience

- Easy: Core identity, contact, KYB tier, tool taxonomy, data location profile, retention periods
- Ambiguous: `systemConfigFingerprint` is required by schema but manifest spec marks it optional; clarified by treating as required
- Missing: Merchant-facing clarity on refund cap vs. issuer-approved cap (no dedicated field); no structured place to declare human approval thresholds beyond text fields
- Redundant/overlap: Both manifest and credential repeat long-form narratives for monitoring/fail-safes; could be more structured

## Files

- `developer-credential.json` — Completed DeveloperCredential draft
- `agent-manifest.json` — Developer-authored manifest
- `agent-credential.json` — Beltic-issued AgentCredential
- `evaluation-scorecard.json` — Safety metric rationale
