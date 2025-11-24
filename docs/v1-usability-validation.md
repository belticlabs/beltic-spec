# v1 Usability Validation

**Date:** 2025-11-22  
**Reviewer:** Beltic coding agent (Codex CLI)

This document records the end-to-end validation of the Beltic v1 specification suite, covering document review, scenario walkthroughs, and gaps discovered.

---

## Materials Reviewed
- `docs/overview.md`
- `docs/developer-credential-v1.md`
- `docs/agent-credential-v1.md`
- `docs/agent-manifest-spec-v1.md`
- `docs/nist-mapping-v1.md`
- `examples/developer-example-v1.md`
- `examples/agent-example-v1.md`
- `schemas/developer/v1/developer-credential-v1.schema.json`

*(AgentCredential schema is not yet available; noted in gap analysis.)*

---

## Scenario A – E-commerce Refund Assistant

**Description:** A refund bot (“Aurora Refund Guide”) that triages e-commerce refund requests, reads order/payment data, and issues refunds up to $500 automatically.

### DeveloperCredential Completion
- All required fields can be populated using standard KYC/KYB data (legal name, jurisdiction, hashed registration #, sanctions/PEP/adverse media statuses, contact channels).
- No ambiguous fields; need to gather business registration documents, tax ID verification proof, beneficial ownership attestations.
- **Completeness:** ✅ — Developer identity fully expressible.

### Agent Manifest & Credential
- Manifest covers model (`primaryModelFamily: Claude-3 Opus` w/ policies), tools (DB lookup, refund initiation, email), data handling (PII + financial, retention 30–90 days), oversight (`human_review_pre_action` for refunds beyond threshold), fail-safes (escalate >$500).
- AgentCredential mirrors manifest data plus Beltic-evaluated safety metrics and operational metadata. No missing fields for this use case.
- **Completeness:** ✅ — All behaviors, guardrails, thresholds described via `toolsList`, `failSafeBehavior`, `approvedUseCases`, and `humanOversightMode`.

### Evaluation Metrics
- Prompt injection, harmful content, tool abuse, PII leakage metrics all apply; definitions in `docs/evaluation-metrics-v1.md` are sufficient to build/run the suites.
- Outcome example: `promptInjectionRobustnessScore 92` with benchmark/version/date references – merchant sees test provenance.
- **Clarity:** ✅ — Scoring criteria and metadata expectations unambiguous.

### Credential Consumer Perspective
- Merchant sees: developer verified (Tier 2), sanctions clear, low overall risk, explicit refund tool definitions, privacy controls, safety scores, oversight mode.
- Remaining uncertainty: operational reliability (uptime) not covered; acceptable for v1 but noted for future metrics.
- **Decision:** ✅ — Enough info to allow agent with policy-specific checks.

### Developer Experience
- Effort: manageable—manifest + spec fields map to existing system documentation. No impossible fields.
- Felt meaningful: all disclosures (tools, oversight, privacy, metrics) affect merchant trust decisions (not security theater).

**Result:** **Pass** – v1 fields represent the simple scenario without workarounds.

---

## Scenario B – Healthcare Appointment Scheduler (HIPAA)

**Description:** “CareLink Scheduler” automates patient appointment booking, accesses EHR read APIs, and sends reminders. Must comply with HIPAA, log access, and escalate sensitive actions.

### DeveloperCredential Completion
- Requires standard KYB artifacts plus disclosure of HIPAA compliance posture (capture via `regulatoryApprovals` on the agent side). Developer credential needs no extra fields beyond existing risk/compliance entries.
- **Completeness:** ✅ — No missing developer fields.

### Agent Manifest & Credential
- Manifest entries:
  - `dataCategoriesProcessed`: [`phi`, `pii`, `authentication`]
  - `dataRetentionMaxPeriod`: `P7D` (short-lived), with per-category overrides.
  - `dataLocationProfile`: storage/processing in US-only regions to satisfy HIPAA.
  - Tools: `ehr_patient_lookup` (data_read_external), `schedule_appointment` (external_api_call + requiresHumanApproval), `send_secure_message`.
  - `humanOversightMode`: `human_initiated_only` (agent proposes slots; staff approves).
  - `failSafeBehavior`: escalate when patient identity mismatch, missing consent, or when booking surgery slots.
  - `regulatoryApprovals`: “HIPAA BAA with CareClinic Health Network”.
- AgentCredential reflects these plus safety metrics. Privacy requirements captured via data categories/retention/training usage.
- **Gaps:** Need to ensure `regulatoryApprovals` clarifies BAA reference (already allowed). No new fields required.

### Evaluation Metrics
- All four v1 metrics still applicable. Tool abuse suite focuses on preventing unauthorized EHR writes/PHI leakage.
- Might desire fairness or reliability metrics (missed slots) in future, but not blockers for v1.

### Credential Consumer Perspective
- Hospital verifies developer KYB, sees PHI processing declaration, data residency, training usage policy, oversight mode (human initiated), HIPAA approval reference, safety scores.
- Remaining uncertainty: service reliability/uptime not modeled; fairness/bias in scheduling not measured. These are candidates for v2 enhancements.
- **Decision:** ✅ (with awareness to monitor reliability via contract terms).

### Developer Experience
- Requires coordination with compliance team to document retention/data residency/human oversight. Fields map cleanly to existing HIPAA documentation.
- Nothing impossible; manifest encourages explicit articulation of safeguards.

**Result:** **Pass (with noted enhancements)** – AgentCredential v1 can represent the HIPAA scheduler, though future metrics (reliability/fairness) would improve trust.

---

## Gap Analysis

| Issue | Location | Severity | Impact | Proposed Resolution |
|-------|----------|----------|--------|---------------------|
| AgentCredential JSON Schema missing | `schemas/agent/` | **Critical blocker** | Automation cannot validate AgentCredential payloads; reduces interoperability confidence | Add `schemas/agent/v1/agent-credential-v1.schema.json` mirroring doc spec before declaring v1 final |
| `monitoringCoverage` listed twice in manifest spec | `docs/agent-manifest-spec-v1.md` | Usability issue (fixed) | Duplicate rows caused confusion about whether two different fields existed | Removed duplicate entry from “Intended Domains & Risk Posture”; retained single definition under Data & Privacy |
| Schema conditional rules absent (e.g., require tax fields when `taxIdExists=true`) | `schemas/developer/v1/...` | Enhancement | Validation currently relies on manual review; could allow inconsistent records | Add JSON Schema `if/then` constraints once validator supports them; track in TODO |
| Reliability/fairness metrics not modeled | `docs/evaluation-metrics-v1.md` & AgentCredential | Enhancement | Merchants may still ask for uptime/fairness data; currently deferred | Plan for v2 metric suite (not blocker for v1) |
| Agent schema and manifest-to-credential tooling references | repo-wide | Usability | README mentions agent schema “coming soon”; maintainers need tracking | Keep TODO visible in progress.md; prioritize implementation |

---

## TODOs

- [ ] Build and publish `schemas/agent/v1/agent-credential-v1.schema.json` aligned with the v1 spec.
- [ ] Extend JSON Schema with conditional validation (tax ID, registered address, etc.) once tooling supports it.
- [ ] Explore v2 metrics for reliability/fairness; capture requirements from merchants.

---

## v1 Readiness

With the exception of the missing AgentCredential schema, v1 documentation, manifest, evaluation guidance, and examples are coherent and sufficient to credential real agents (simple + HIPAA scenarios). Once the agent schema ships, the suite is ready for pilot implementations with medium confidence; ongoing work on reliability/fairness metrics is earmarked for v2.
