# AgentCredential v1 Review Summary

## What Changed and Why

- **Trimmed redundant reporting fields** by removing manual tool count and throughput entries; Beltic derives these metrics automatically so developers focus on safety/assurance data that only they can attest to.
- **Consolidated data residency disclosures** into the new `dataLocationProfile` object, which simultaneously covers storage, processing, and backup regions, reducing dual-entry mistakes while keeping regulators satisfied.
- **Tightened operations transparency** with three new required disclosures (`humanOversightMode`, `failSafeBehavior`, `monitoringCoverage`) so merchants understand how risky actions are supervised, how the agent shuts itself down, and how issues are detected in production.
- **Clarified hybrid / multi-modal expectations** in `primaryModelFamily`, `modelContextWindow`, and `systemConfigFingerprint` so complex agents know how to describe orchestrators, deterministic guard rails, and hashed prompts.
- **Refined merchant guidance and privacy posture** to emphasize that sanitized tool info plus Beltic dashboards expose the insights merchants need without dumping raw PII or configuration hashes.

## Fields Moved to Future Extensions

| Field / Concept | Rationale for Deferment |
|-----------------|-------------------------|
| `totalToolCount`, `highRiskToolCount` | Counts are auto-derived from `toolsList` inside Beltic’s verifier UI; keeping manual numbers risked drift. |
| `storageRegions`, `processingRegions` | Replaced by `dataLocationProfile` so developers describe storage/processing/backup once; per-dataset granularity can return later if regulators ask. |
| `rateLimitTier`, `requestQuotaPerDay`, `minimumClientVersion` | Useful for commercial discussions but not part of the minimum assurance story; they also lacked a way to validate claims today. Will return in v2 once telemetry-backed tiers exist. |
| Structured monitoring KPIs | Narratively captured inside `monitoringCoverage` for now. We plan to add MTTR/alert-rate fields later once collection requirements are standardized. |

## New or Clarified Fields

- `dataLocationProfile` (object) replaces three overlapping residency fields and makes localization promises explicit.
- `humanOversightMode`, `failSafeBehavior`, `monitoringCoverage` anchor the operations section in supervision, failure modes, and runtime observability—the biggest gaps spotted during review.
- `toolsList` constraints now spell out that Beltic will compute counts automatically, eliminating double entry.
- Clarifications to `primaryModelFamily`, `modelContextWindow`, and `systemConfigFingerprint` explain how to document hybrid/multi-modal stacks so merchants know what orchestrator actually governs behavior.

## Scenario Validation Results

| Scenario | Result | Notes |
|----------|--------|-------|
| Refund / customer-service bot with two tools | ✅ All required fields were straightforward. Developer supplies a short `failSafeBehavior` (“refuse + page analyst if refund > $200”), lists `dataCategoriesProcessed = ["pii","financial"]`, and relies on Beltic’s default tool-abuse test suite for the safety metrics. |
| Wealth-management or medical advisory agent | ✅ Fields captured the needed rigor: `humanOversightMode = human_review_pre_action`, `dataLocationProfile` lists US + EU storage plus Canadian backups, and privacy knobs (training usage, retention by category) make HIPAA/FINRA compliance defensible. Only lift is running all four safety evaluations, which is expected for this risk class. |
| Multi-modal LLM + deterministic workflow (vision intake, planning LLM, rule engine) | ✅ Clarifications allowed the developer to describe “Claude-3 Opus (vision encoder + deterministic adjudicator)” as the model family, hash the combined prompts/rules, and enumerate `modalitySupport = ["text","image","video","structured_data"]`. The new oversight/monitoring fields make it obvious how the deterministic layer intervenes. |

In each scenario the spec was demanding but practical; no field was impossible to fill, and developers knew why a piece of data mattered.

## Recommended v2 Priorities

1. Re-introduce structured throughput/client fields once telemetry-backed rate-tier attestations are ready, so merchants can size integrations without separate product sheets.
2. Add machine-readable monitoring KPIs (alert MTTR, % human-reviewed tool invocations) to complement the narrative `monitoringCoverage` field.
3. Provide optional per-dataset residency attestations for regulators that require proof each data category stays in-region.
4. Expand the safety section with adaptive testing metadata (e.g., jailbreak regression trend) after Beltic finalizes the benchmarking pipeline.
