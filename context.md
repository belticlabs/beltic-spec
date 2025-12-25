# Beltic Specification Context

## Project Identity

**Name**: Beltic Specification  
**Purpose**: Defines the Beltic credential framework through human-readable specifications, machine-readable JSON schemas, and comprehensive examples. Ensures compatibility with standards like W3C Verifiable Credentials and RFC 9421.  
**Core Value**: Accurate, clear, and standards-compliant credential specifications.  
**Mechanism**:

- Specifications: Human-readable documentation for DeveloperCredential and AgentCredential
- Schemas: JSON Schema Draft 2020-12 definitions for validation
- Examples: Valid and invalid test cases for implementers
- Validation: Tools and guides for schema validation

## Quick Commands

```bash
# Validate all schemas and examples
npm run validate:all

# Validate agent credentials
npm run validate:agent

# Validate developer credentials
npm run validate:developer

# Test conditional validation rules
npm run test:conditional-rules

# Format all files
npm run format:write

# Check formatting
npm run format:check

# Lint schemas
npm run lint:schemas
```

## Stack

- **Language**: JSON Schema Draft 2020-12
- **Validation**: AJV 8.12+ (ajv-cli for command-line)
- **Documentation**: Markdown
- **Formatting**: Prettier 3.1+
- **Runtime**: Node.js >= 18.0.0
- **Python**: jsonschema library (for Python validation)

## Project Structure

```
beltic-spec/
├── docs/                    # Human-readable specifications
│   ├── developer-credential-v1.md
│   ├── agent-credential-v1.md
│   ├── validation-guide.md
│   ├── nist-mapping-v1.md
│   └── ...
├── schemas/                 # JSON Schema definitions
│   ├── developer/
│   │   ├── v1/
│   │   │   └── developer-credential-v1.schema.json
│   │   └── v2/
│   │       └── developer-credential-v2.schema.json
│   ├── agent/
│   │   ├── v1/
│   │   │   └── agent-credential-v1.schema.json
│   │   └── v2/
│   │       └── agent-credential-v2.schema.json
│   ├── delegation/
│   │   └── v1/
│   │       └── delegation-credential-v1.schema.json
│   └── directory/
│       └── v1/
│           └── http-message-signatures-directory.schema.json
├── examples/                # Example credentials and test cases
│   ├── developer/
│   │   ├── v1/
│   │   │   └── tests/       # Valid and invalid test cases
│   │   └── v2/
│   ├── agent/
│   │   ├── v1/
│   │   └── v2/
│   └── scenarios/           # Real-world scenario examples
├── scripts/                 # Validation and testing scripts
│   ├── validate-all.js
│   ├── validate-invalid.js
│   ├── test-conditional-rules.js
│   └── ...
├── analysis/                # Standards compliance analysis
├── specs/                   # Technical specifications
├── roadmap/                 # Future plans
├── progress.md              # Development progress log
└── Makefile                 # Build automation
```

## Commands

### Validation

```bash
# Validate all credentials
npm run validate:all

# Validate agent credentials only
npm run validate:agent

# Validate developer credentials only
npm run validate:developer

# Test conditional validation rules
npm run test:conditional-rules

# Validate specific schema
ajv validate --spec=draft2020 -s schemas/developer/v1/developer-credential-v1.schema.json -d examples/developer/v1/tests/valid-*.json
```

### Formatting

```bash
# Format all JSON and Markdown files
npm run format:write

# Check formatting without changes
npm run format:check
```

### Schema Linting

```bash
# Compile and validate all schemas
npm run lint:schemas
```

### Python Validation

```bash
# Using Python jsonschema
python3 scripts/validate_all.py
```

## Testing

### Test Structure

- **Valid examples**: `examples/*/v*/valid-*.json`
- **Invalid examples**: `examples/*/v*/tests/invalid-*.json`
- **Conditional rules**: Tested via `scripts/test-conditional-rules.js`
- **Scenarios**: Real-world examples in `examples/scenarios/`

### Running Tests

```bash
# Run all tests
npm test

# Test conditional rules (27 rules for DeveloperCredential)
npm run test:conditional-rules

# Validate specific credential type
npm run validate:developer
npm run validate:agent
```

### Test Examples

```bash
# Validate a single credential file
ajv validate --spec=draft2020 \
  -s schemas/developer/v1/developer-credential-v1.schema.json \
  -d examples/developer/v1/tests/valid-individual-minimal.json

# Validate all valid developer credentials
npm run validate:developer:valid

# Test invalid credentials (should fail)
npm run validate:developer:invalid
```

## Code Style

### JSON Schema Style

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Trailing commas**: Not allowed in JSON
- **Comments**: Use `$comment` field for schema documentation

### Schema Structure

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://beltic.dev/schemas/developer/v1/developer-credential-v1.schema.json",
  "title": "DeveloperCredential",
  "description": "Credential identifying a developer or organization",
  "type": "object",
  "required": ["credentialId", "legalName", "issuanceDate"],
  "properties": {
    "credentialId": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier for this credential"
    }
  }
}
```

### Markdown Style

- Use Prettier for formatting
- Headers: Use `#` for main sections, `##` for subsections
- Code blocks: Use language tags (`json, `bash)
- Links: Use relative paths for internal docs

## Git Workflow

### Commits

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Scope for schema types: `feat(developer): add new field`
- Keep commits focused on one schema or doc change

```bash
# Good commit messages
git commit -m "feat(developer): add taxId field to v2 schema"
git commit -m "docs: update validation guide with Python examples"
git commit -m "fix(agent): correct conditional rule for safety scores"
```

### Releases

- Version follows semantic versioning
- Major version changes for breaking schema changes
- Minor version for new fields (backward compatible)
- Patch version for documentation fixes

## Boundaries

### Never Commit

- **Generated files** (if any)
- **Temporary files** (use `temp/` directory, gitignored)
- **Personal notes** (use `progress.md` for project notes)

### What This Repo Does

- ✅ Defines JSON schemas for credentials
- ✅ Provides human-readable specifications
- ✅ Includes validation examples and test cases
- ✅ Documents standards compliance
- ✅ Tracks specification development progress

### What This Repo Doesn't Do

- ❌ Implement credential issuance (use KYA platform)
- ❌ Provide SDK code (use beltic-sdk)
- ❌ Handle credential signing (use beltic-cli)
- ❌ Store credentials (schemas only)

## Examples

### Adding a New Field to Schema

```json
// schemas/developer/v1/developer-credential-v1.schema.json
{
  "properties": {
    "existingField": { ... },
    "newField": {
      "type": "string",
      "description": "New field description",
      "$comment": "Added in v1.1.0"
    }
  },
  "required": ["existingField", "newField"]  // Add if required
}
```

### Creating a Test Case

```json
// examples/developer/v1/tests/valid-new-field.json
{
  "credentialId": "550e8400-e29b-41d4-a716-446655440000",
  "legalName": "Test Corp",
  "newField": "test value",
  "issuanceDate": "2024-01-01T00:00:00Z",
  "expirationDate": "2025-01-01T00:00:00Z"
}
```

### Adding Conditional Validation

```json
{
  "if": {
    "properties": {
      "entityType": { "const": "corporation" }
    }
  },
  "then": {
    "required": ["taxId", "businessRegistrationNumber"]
  }
}
```

### Updating Documentation

````markdown
# docs/developer-credential-v1.md

## New Field

The `newField` property identifies...

**Assurance Level**: `beltic_verified`

**Required**: Yes (for corporations)

**Example**:

```json
{
  "newField": "example value"
}
```
````

````

## Common Workflows

### Adding a New Schema Version

1. Create version directory: `schemas/developer/v2/`
2. Copy v1 schema as starting point
3. Update `$id` and version references
4. Make schema changes (add/remove/modify fields)
5. Create documentation: `docs/developer-credential-v2.md`
6. Add examples: `examples/developer/v2/`
7. Update validation scripts if needed
8. Test: `npm run validate:developer`

### Validating Schema Changes

```bash
# 1. Validate schema syntax
npm run lint:schemas

# 2. Validate all examples
npm run validate:all

# 3. Test conditional rules
npm run test:conditional-rules

# 4. Format files
npm run format:write
````

### Updating Progress Log

```markdown
# progress.md

## Job XX – Add New Field

**Date:** YYYY-MM-DD

**Summary:**
Added `newField` to DeveloperCredential v1 schema...

**Files Changed:**

- schemas/developer/v1/developer-credential-v1.schema.json
- docs/developer-credential-v1.md
- examples/developer/v1/tests/valid-new-field.json

**Known Issues:**

- None

**Next Steps:**

- Update SDK types
- Update CLI validation
```

### Standards Compliance

When making schema changes, ensure:

- W3C VC compatibility (see `analysis/w3c-vc-alignment.md`)
- IETF compatibility (see `analysis/ietf-compatibility.md`)
- NIST AI RMF mapping (see `docs/nist-mapping-v1.md`)

Update analysis documents if schema changes affect compliance.
