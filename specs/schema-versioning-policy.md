# Schema Versioning Policy

## Versioning Scheme
- Semantic versioning: MAJOR.MINOR.PATCH for schemas and contexts.
- `schemaVersion` in credentials references MAJOR.MINOR (e.g., `1.0`); PATCH reserved for backward-compatible fixes without changing `schemaVersion`.
- `$id` URLs include full semver: `https://schema.beltic.com/agent/v1.0/agent-credential.schema.json`.

## Publication
- Schemas hosted at `schema.beltic.com` with immutable versions; GitHub release mirror.
- DO NOT mutate published versions; publish new versions for any change.

## Compatibility
- MINOR: backward compatible additions (new optional fields, new enums). MAJOR: breaking changes (field removals/renames, stricter required fields).
- Provide migration notes per release.

## Extensions
- Custom fields under `x_` namespace; validators allow `additionalProperties` only within `x_*` objects to prevent collisions.
- Plan a `beltic-extension-registry.md` for shared extensions.

## Deprecation
- Support N-1 MAJOR in verifiers; publish EOL dates. Provide migration scripts/templates when breaking changes occur.

## Registry Resolution
- Tools fetch schemas via `$id` or local cache (bundled in SDK/CLI). Support offline validation by packaging schemas with releases.
