# Repository Guidelines

## Project Structure & Module Organization
- `docs/` – Human-readable specifications (overview, credential specs, manifest, evaluation metrics, NIST mapping, contributing guide, validation notes).
- `schemas/` – JSON Schemas, currently `schemas/developer/v1/` for DeveloperCredential; agent schemas will mirror this layout.
- `examples/` – Conceptual Developer/Agent credential samples for quick reference.
- `progress.md` – Chronological job log documenting every change.
- `README.md` – Entry point for locating specs, schemas, and examples.

## Build, Test, and Development Commands
This repo is documentation-first. No build chain is required. Recommended validations:
- `npx ajv validate -s schemas/developer/v1/developer-credential-v1.schema.json -d <file>` to sanity-check sample payloads.
- Run Markdown linting (e.g., `npx markdownlint docs/**/*.md`) if available in your environment.

## Coding Style & Naming Conventions
- Markdown: use `#`/`##` headings, bullet lists, and fenced code blocks with language hints.
- JSON Schema: Draft 2020-12, snake_case field names matching the spec (e.g., `businessRegistrationStatus`).
- Examples/manifests: camelCase field names as defined in the specs; keep sensitive example data fictional.
- Indentation: two spaces for Markdown bullets, two spaces in JSON snippets (no tabs).

## Testing Guidelines
- Validate schemas with AJV or similar validators before committing.
- When updating specs, add or adjust conceptual examples to cover new fields.
- Scenario walkthroughs should be recorded in `docs/v1-usability-validation.md` (or successor) to demonstrate end-to-end coverage.

## Commit & Pull Request Guidelines
- Keep commits focused (e.g., “Add AgentCredential manifest guidance”).
- Reference the job number in the commit or PR description when applicable.
- Pull requests should summarize:
  - Which docs/schemas/examples changed
  - Any new TODOs or follow-up items
  - Validation steps (schema lint, markdown lint, scenario walkthroughs)
- Always append a new entry to `progress.md` describing what changed, remaining questions, and next steps.

## Security & Data Handling Notes
- Never introduce real PII; use hashed tokens or fictional data in examples.
- Mark restricted/internal fields clearly in specs and ensure schemas do not expose raw identifiers.
