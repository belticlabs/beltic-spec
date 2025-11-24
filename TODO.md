# TODOs

- TODO(P0): Add structured consent/BAA evidence fields for regulated data handlers so merchants can gate PHI/financial access without bespoke contracts (docs/agent-credential-v1.md, schemas/agent/v1/agent-credential-v1.schema.json).
- TODO(P1): Capture structured human-approval thresholds and monetary/tool caps instead of only prose (docs/agent-credential-v1.md, docs/agent-manifest-spec-v1.md).
- TODO(P1): Expose evaluation coverage metadata (attempt counts and categories) in credentials or a referenced artifact for comparability (docs/evaluation-metrics-v1.md, schemas/agent/v1/agent-credential-v1.schema.json).
- TODO(P1): Provide a field or reference for tenant-isolation/compliance attestations for multi-tenant or PHI agents (docs/agent-credential-v1.md).
- TODO(P2): Consolidate repeated narrative fields (failSafeBehavior, monitoringCoverage) into structured checklists across manifest/credential (docs/agent-credential-v1.md, docs/agent-manifest-spec-v1.md).
- TODO(P2): Add optional structured consent preference handling (opt-out/opt-in timestamps) for reminders/notifications (docs/agent-credential-v1.md).
- TODO(P2): Consider a merchant-facing summary of retention/region exceptions per dataset beyond global `dataLocationProfile` notes (docs/agent-credential-v1.md).
