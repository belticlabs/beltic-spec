# Developer Experience Analysis

## Authoring Options

- **JSON**: Current; great transparency; verbose; works with Schema validation. Time-to-first-credential low if examples exist.
- **YAML→JSON**: Better readability/comments; requires build step; good for manifests. Recommend supporting via CLI conversion.
- **TypeScript/Python/Go SDKs**: Strong DX with types/IDE help; requires SDK maintenance; best for CI and dynamic generation.
- **CLI**: Needed for init/validate/sign/verify/convert; scripts well in CI.
- **Web builder**: Nice for demos/onboarding; less critical for power users.

## Recommended v1 Stack

- Primary authoring: JSON + templates; optional YAML compile via CLI.
- Tooling priorities: (1) CLI with validate/sign/verify/convert, (2) JS/TS SDK, (3) VS Code extension for schema-driven linting. Python/Go SDKs in next phase.

## Error Handling

- Use JSON Schema errors enriched with friendly messages; CLI should show path + suggestion. For signatures, surface `iss/sub/exp/nbf` mismatches and status list errors clearly.

## Time to First Credential

- With template + CLI: <15 minutes (fill fields, validate, sign). Without tooling: higher due to verbosity; hence templates and examples are key.

## Version Control Friendliness

- Favor deterministic field ordering (canonical JSON) before signing. Encourage YAML source for easier diffs, compiled to JSON for signing. Provide `beltic format` command.
