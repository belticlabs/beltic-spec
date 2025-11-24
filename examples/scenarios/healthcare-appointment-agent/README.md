# Healthcare Appointment Scheduling Agent (Scenario B)

## Developer Profile
- Entity: WellPoint Scheduling Inc. (established healthcare IT vendor)
- KYB Tier: tier_3_enhanced; all beneficial owners KYC'd; overall risk medium due to regulated data
- Contact: info@wellpointscheduling.example | security@wellpointscheduling.example

## Agent Overview
- Name: CareScheduler Agent v2.2.1 (`7c9f1f62-02c8-49e7-8dbd-b0c9a87d2ddf`)
- Function: Schedule/reschedule/cancel visits with consent checks; send reminders; enforce insurance/referral policies
- Model: GPT-4.1 with RAG over provider calendars and policy docs; tools for EMR reads, scheduling API, notifications
- Data: PHI + PII + auth data; 30-day retention max; US-only processing under BAA; field-level encryption for PHI
- Safety posture: Moderate risk; human pre-approval for schedule changes within 24h; strong monitoring for cross-tenant access

## Credentialing Experience
- Easy: KYB screening chain, PHI data handling, retention statements, tool risk mapping
- Ambiguous: No structured field for BAA/consent evidence; age restrictions are coarse (18+ only) and don’t capture guardian consent; systemConfigFingerprint optional vs required mismatch as in Scenario A
- Missing: Place to document patient communication consent sources and revocation handling; no field for “minimum necessary” enforcement proof
- Redundant/overlap: Monitoring/fail-safe narratives repeated across manifest and credential without structured checklists

## Files
- `developer-credential.json` — Completed DeveloperCredential draft
- `agent-manifest.json` — Developer-authored manifest
- `agent-credential.json` — Beltic-issued AgentCredential
- `evaluation-scorecard.json` — Safety metric rationale
