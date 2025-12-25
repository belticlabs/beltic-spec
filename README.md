# Beltic Specification Repository

Beltic issues verifiable credentials that prove who built an AI agent and how safely it operates. This repository houses the human-readable specifications, machine-readable schemas, and working examples for Beltic’s DeveloperCredential (identifies the developer) and AgentCredential (describes each agent’s capabilities, safety, and privacy posture).

---

## Quick Start

### Credential Specs

- **DeveloperCredential v1:** `docs/developer-credential-v1.md`
- **AgentCredential v1:** `docs/agent-credential-v1.md`

Each document explains required fields, sensitivity levels, assurance expectations, and privacy guidance.

### Schemas

- **DeveloperCredential JSON Schema:** `schemas/developer/v1/developer-credential-v1.schema.json`
- **AgentCredential JSON Schema:** `schemas/agent/v1/agent-credential-v1.schema.json`

Schemas mirror the prose specs so tooling can validate submissions before they reach Beltic.

### Examples

- `examples/developer-example-v1.md`
- `examples/agent-example-v1.md`
- `examples/agent/v1/*.json` – machine-readable credential samples (valid/invalid)

These provide conceptual, human-readable credential snapshots so stakeholders can visualize what v1 data looks like.

### Validation

Validate credentials against JSON schemas before submission:

**Quick Start:**

```bash
# Install dependencies
npm install

# Validate all credentials
npm run validate:all

# Or use Make
make validate-all
```

**Individual Validation:**

```bash
# Validate agent examples
npm run validate:agent

# Validate developer examples
npm run validate:developer

# Test conditional rules (27 rules for DeveloperCredential)
npm run test:conditional-rules
```

**Python Validation:**

```bash
pip install jsonschema
python3 scripts/validate_all.py
```

See `docs/validation-guide.md` for comprehensive validation documentation, including:

- Setup instructions for AJV, jsonschema, and other validators
- Conditional validation testing (27 rules)
- Runtime validation (date checks, freshness requirements)
- CI/CD integration examples
- Troubleshooting common validation errors

### Evaluation & Mapping References

- **Evaluation Metrics:** `docs/evaluation-metrics-v1.md` (defines Attack Success Rate, robustness scores, required metadata)
- **NIST AI RMF Mapping:** `docs/nist-mapping-v1.md` (shows how each field maps to GOVERN/MAP/MEASURE/MANAGE)
- **Agent Manifest Spec:** `docs/agent-manifest-spec-v1.md` (developer-authored manifest that feeds AgentCredential issuance)

---

## Assurance Levels

Every credential field notes its minimum assurance level:

1. `self_attested` – Developer provides data without verification; useful for prototypes.
2. `beltic_verified` – Beltic validates documents, runs safety evaluations, and attests to the result (default for production partners).
3. `third_party_verified` – Independent auditors provide evidence that Beltic incorporates.

Example: `sanctionsScreeningStatus: clear (Beltic-verified)` indicates Beltic ran and attested the screening.

---

## Versioning Model

- v1 artifacts live in `docs/*-v1.md`, `schemas/*/v1/`, and `examples/*-v1.md`.
- Future versions (v2, v3, …) will live beside v1 (e.g., `docs/developer-credential-v2.md`, `schemas/developer/v2/`) so integrators can adopt new formats at their own pace.
- Each schema includes a `schemaVersion` field to assert compatibility.

---

## Repo Workflow & Progress Log

`progress.md` tracks every job performed in this repo (what changed, open questions, next steps). The coding agent and maintainers append to it so future contributors have a running history of decisions.

When in doubt:

1. Scan `README.md` (this file) for entry points.
2. Check `progress.md` to see the latest work and pending items.
3. Dive into the relevant docs/schemas/examples listed above.
