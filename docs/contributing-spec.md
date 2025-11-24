# Contributing to Beltic Specifications

This guide describes how to extend Beltic’s credential specifications and schemas safely. Follow these steps whether you are adding new fields, introducing evaluation metrics, or versioning the spec.

---

## General Principles

1. **PII Hygiene:** Never introduce public fields that expose raw sensitive data (SSNs, full tax IDs, home addresses). If a regulator requires belt-and-braces tracking, use hashed/tokenized identifiers and mark the field as restricted/internal in the spec.
2. **Assurance Integrity:** Do not label self-attested data as Beltic-verified or third-party-verified. When in doubt, leave the assurance tier at the lowest level and flag it for reviewer follow-up.
3. **Spec ⇄ Schema Parity:** Every change to the prose spec must be mirrored in the machine-readable schema and vice versa. Specs explain intent, schemas enforce structure.
4. **Version Stability:** Once published, v1 artifacts remain immutable except for clarifications. Breaking changes require a new version directory.

---

## Adding or Modifying Fields

1. **Update Human-Readable Spec:**
   - Edit `docs/developer-credential-v1.md` or `docs/agent-credential-v1.md`.
   - Document the field name, description, data type, required/optional status, sensitivity, assurance model, and NIST AI RMF tag.
   - Call out if the field is restricted/internal only.

2. **Update Machine-Readable Schema:**
   - Modify the corresponding JSON Schema (`schemas/developer/v1/...` or upcoming `schemas/agent/v1/...`).
   - Add field definitions (type, enums, constraints, formats). Prefer JSON Schema keywords such as `pattern`, `format`, `enum`, and `if/then` for conditional logic.

3. **Update Supporting Docs:**
   - If the field maps to a new concept in the Agent Manifest, update `docs/agent-manifest-spec-v1.md`.
   - If it affects evaluation or NIST coverage, update `docs/evaluation-metrics-v1.md` or `docs/nist-mapping-v1.md`.
   - Consider adding/changing example entries in `examples/*-example-v1.md`.

4. **Log the Work:**
   - Append a new job entry to `progress.md` summarizing the change, open questions, and next steps.

---

## Introducing a New Spec Version

1. **Clone the Existing Version:**
   - Copy the current spec doc to `docs/*-credential-v2.md` (or higher version) and update headings/metadata accordingly.
   - Duplicate schemas into `schemas/developer/v2/` and `schemas/agent/v2/`.
   - Carry over example files if needed, renaming them to `*-example-v2.md`.

2. **Mark Deprecations:**
   - In the older version’s doc, mark superseded fields as “deprecated in vX” but keep them documented for backward compatibility.
   - Do not remove v1 artifacts unless there is a critical security/privacy issue approved by Beltic leadership.

3. **Update README & Mapping:**
   - Add new version pointers to `README.md` and `docs/nist-mapping-*.md`.
   - Note in `progress.md` which version is considered “current” so integrators stay aligned.

4. **Governance & Approval:**
   - Major version bumps should be reviewed by Beltic’s governance committee (product + legal + security). Capture approvals in the PR or design doc.

---

## Adding Evaluation Metrics

1. **Define the Metric:**
   - Update `docs/evaluation-metrics-v1.md` (or create `evaluation-metrics-v2.md` for new releases) with attack definitions, success criteria, ASR/robustness formulas, required metadata, and ingestion steps.

2. **Reference in AgentCredential:**
   - Add new fields to `docs/agent-credential-v1.md` with clear naming (`<metric>Score`, `<metric>BenchmarkName`, etc.) and assurance descriptions.
   - Update/introduce the corresponding schema fields (once the agent schema lands).

3. **Supply Manifest Hooks (if needed):**
   - If developers must provide context for the new metric (e.g., fairness test coverage), update `docs/agent-manifest-spec-v1.md`.

4. **Refresh Examples & Mapping:**
   - Show the new metric in `examples/agent-example-v1.md`.
   - Map the field in `docs/nist-mapping-v1.md` under the appropriate NIST function (likely MEASURE).

---

## Submitting Changes

1. Fork or branch, make your edits, run lint/validation scripts if available.
2. Verify that documentation, schema, and examples stay consistent.
3. Update `progress.md` with a new job entry.
4. Open a PR describing the change, rationale, and testing. Highlight any governance approvals needed (e.g., introducing new sensitive fields or switching assurance requirements).

Questions? Start by checking `progress.md` for prior discussions, or open an issue outlining your proposal before coding. Maintaining alignment between human-readable specs, schemas, and examples keeps merchants, developers, and auditors on the same page.
