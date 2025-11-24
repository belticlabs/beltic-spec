# v1 End-to-End Validation

## Phase 1 Reading Notes
- Cross-doc terminology is mostly consistent, but prior drift between the manifest spec and schema on `systemConfigFingerprint` (optional vs required) and outdated agent schema README were the only contradictions; both were corrected in this pass (docs/agent-manifest-spec-v1.md, schemas/agent/v1/README.md).
- Agent examples largely align with the schema; merchant-facing guidance still relies on prose for guardrails (failSafeBehavior, monitoringCoverage) with no structured levers.
- Evaluation metrics doc is clear about ASR → robustness, but credential fields only surface scores; attempt counts and coverage stay off-credential, which reduces comparability for merchants.
- Privacy posture is documented, yet there is no explicit place to record consent/BAA evidence or minimum-necessary enforcement—critical for PHI/financial flows.

## Scenario A — E-commerce Refund Agent
- Artifacts: developer-credential (`examples/scenarios/ecommerce-refund-agent/developer-credential.json`), manifest (`.../agent-manifest.json`), agent-credential (`.../agent-credential.json`), scorecard (`.../evaluation-scorecard.json`).
- Completeness: All required fields populated; toolAbuse metrics present; data location/retention and encryption declared. Prose used for refund caps and human approval thresholds.
- Clarity: Developer credential straightforward (tier_2_standard, low risk). Manifest → credential mapping clean; only friction was discovering the fingerprint requirement due to spec/schema mismatch.
- Coverage: Safety metrics cover harmful content, prompt injection, tool abuse, PII leakage; no load/perf data as expected for v1.
- Merchant decision (simulation): **Conditional Yes** — approve with a $500 cap and requirement for PSP dual-signature verification + periodic audit log export. Would reject if refund cap not enforced in tooling.

## Scenario B — Healthcare Appointment Scheduling Agent
- Artifacts: developer-credential (`examples/scenarios/healthcare-appointment-agent/developer-credential.json`), manifest (`.../agent-manifest.json`), agent-credential (`.../agent-credential.json`), scorecard (`.../evaluation-scorecard.json`).
- Completeness: All required fields populated; PHI data handling, retention, and HIPAA eligibility declared; toolAbuse metrics included. No structured fields for BAA/consent provenance or patient opt-out handling.
- Clarity: Developer KYB tier_3_enhanced with medium risk; agent risk documented as moderate. Merchant-readable, but regulators would need proof of consent flows.
- Coverage: Safety metrics and data location captured; tenant isolation, consent source, and emergency workflows are only implied in prose.
- Merchant decision (simulation): **Conditional / Hold** — access only after BAA executed, evidence of consent capture + opt-out handling, and demonstration of cross-tenant isolation controls. Without that, default to deny for PHI.

## Evaluation Metrics Application
- Scoring ran cleanly for both scenarios with Beltic assurance sources; the scorecards document benchmark name/version/date and rationale.
- Ambiguities: Metric coverage/attempt counts are not disclosed in credentials, so two evaluators could disagree on whether a 90 score came from 10 or 1,000 attempts. ToolAbuse freshness expectations are implicit (180 days in doc) but not encoded in schema.

## Merchant Decision Simulation — Key Questions
- Trust in developer: Yes for both (KYB tiers met, active credentials).
- Trust in agent behavior: Conditional; confidence tied to missing structured proofs (refund cap enforcement, BAA/consent evidence, tenant isolation tests).
- Risks: Scenario A — financial leakage via mis-issued refunds; Scenario B — PHI exposure or consent violations. Likelihood reduced by stated guardrails but hard to quantify without evidence fields.
- Access outcomes: Scenario A conditional yes with spending caps + audit hooks; Scenario B conditional pending BAA/consent + isolation proof.

## Gap Analysis
**Category 1: Critical Blockers (P0)**
- TODO(P0): Add structured consent/BAA evidence fields for regulated data handlers so merchants can gate PHI/financial access without bespoke contracts (docs/agent-credential-v1.md, schemas/agent/v1/agent-credential-v1.schema.json).

**Category 2: Usability Issues (P1)**
- TODO(P1): Capture structured human-approval thresholds and monetary/tool caps (e.g., refund limits) instead of only prose (docs/agent-credential-v1.md, docs/agent-manifest-spec-v1.md).
- TODO(P1): Expose evaluation coverage metadata (attempt counts and categories) in credentials or a referenced artifact so scores are comparable (docs/evaluation-metrics-v1.md, schemas/agent/v1/agent-credential-v1.schema.json).
- TODO(P1): Provide a field or reference for tenant-isolation/compliance attestations for multi-tenant or PHI agents (docs/agent-credential-v1.md).

**Category 3: Redundancy / Over-engineering (P2)**
- TODO(P2): Consolidate repeated narrative fields (failSafeBehavior, monitoringCoverage) into structured checklists to reduce duplicate prose between manifest and credential (docs/agent-credential-v1.md, docs/agent-manifest-spec-v1.md).

**Category 4: Future Enhancements (P2)**
- TODO(P2): Add optional structured consent preference handling (opt-out/opt-in timestamps) for reminders/notifications (docs/agent-credential-v1.md).
- TODO(P2): Consider a merchant-facing summary of retention/region exceptions per dataset, not just global `dataLocationProfile` notes (docs/agent-credential-v1.md).

## Readiness Determination
**Status:** ⚠️ CONDITIONAL

- v1 supports end-to-end credentialing for both scenarios, but regulated deployments (PHI/financial) need structured consent/BAA and oversight limit fields before broad pilot access.
- Merchant decisions are achievable with caveats; current friction is primarily missing structured evidence rather than schema errors.
- Proceed with pilot only where contractual controls can temporarily cover the missing structured fields; prioritize P0/P1 fixes for general availability.
