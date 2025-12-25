# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Philosophy & Guidelines

### Core Philosophy

- **Accuracy First**: Never guess schema requirements. Always verify against standards (W3C VC, RFC 9421). When in doubt, ask.
- **Incremental Progress**: Break schema changes into manageable stages.
- **Clear Intent**: Specifications should be unambiguous and implementable.
- **Standards Compliance**: Maintain compatibility with W3C Verifiable Credentials and IETF standards.

### Quality Standards

- **English Only**: All documentation and comments in English.
- **Schema Validation**: All schemas must validate against Draft 2020-12.
- **Example Coverage**: Provide both valid and invalid examples.
- **CHANGELOG Updates**: Always update CHANGELOG.md when making schema or spec changes.

## Project Identity

**Name**: Beltic Specification  
**Purpose**: Defines the Beltic credential framework through specifications, JSON schemas, and examples.  
**Core Value**: Accurate, clear, and standards-compliant credential specifications.

## Technology Stack

- **Schema Format**: JSON Schema Draft 2020-12
- **Validation**: AJV 8.12+ (ajv-cli for command-line)
- **Documentation**: Markdown
- **Formatting**: Prettier 3.1+
- **Runtime**: Node.js >= 18.0.0

## Repository Architecture

```
beltic-spec/
├── docs/                    # Human-readable specifications
├── schemas/                 # JSON Schema definitions
│   ├── developer/v1/, v2/
│   ├── agent/v1/, v2/
│   ├── delegation/v1/
│   └── directory/v1/
├── examples/                # Example credentials and test cases
├── scripts/                 # Validation and testing scripts
└── analysis/                # Standards compliance analysis
```

## Key Workflows

### Development

1. **Understand**: Read existing schemas to understand patterns
2. **Implement**: Follow JSON Schema Draft 2020-12 patterns
3. **Verify**: Use `npm run validate:all` to test
4. **Update**: Always update CHANGELOG.md for schema changes

### Commands

```bash
# Validate all credentials
npm run validate:all

# Validate specific type
npm run validate:agent
npm run validate:developer

# Test conditional rules
npm run test:conditional-rules

# Format files
npm run format:write
```

## Common AI Tasks

### Adding a New Schema Field

1. Update schema JSON: `schemas/*/v*/credential-v*.schema.json`
2. Add to `required` array if mandatory
3. Add conditional validation if needed
4. Create test cases: `examples/*/v*/tests/`
5. Validate: `npm run validate:all`
6. **Update CHANGELOG.md** under Added or Changed section

### Creating a New Schema Version

1. Create version directory: `schemas/type/v2/`
2. Copy v1 schema as starting point
3. Update `$id` and version references
4. Make schema changes
5. Create documentation: `docs/type-credential-v2.md`
6. Add examples: `examples/type/v2/`
7. **Update CHANGELOG.md** under Added section

### Fixing a Bug

1. Reproduce with test case
2. Add test if missing
3. Fix schema or validation logic
4. Verify: `npm run validate:all`
5. **Update CHANGELOG.md** under Fixed section

## Git Workflow

### Commits

- Use conventional commits: `feat:`, `fix:`, `docs:`
- Scope for schema types: `feat(developer): add new field`
- Keep commits focused
- **Always update CHANGELOG.md** for schema changes

### Releases

- Version follows semantic versioning
- **Update CHANGELOG.md** for each release with date

## Boundaries

### Never Commit

- **Generated files** (if any)
- **Temporary files** (use `temp/` directory)
- **Personal notes** (use `progress.md`)

### Security Rules

1. **Validate all schemas**: Use `npm run lint:schemas`
2. **Test examples**: Ensure valid examples pass, invalid fail
3. **Standards compliance**: Check against W3C VC and IETF standards
