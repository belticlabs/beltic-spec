# Beltic Schema Registry

This directory contains all JSON Schema definitions for Beltic credentials. Schemas define the structure, validation rules, and field requirements for verifiable credentials in the Beltic ecosystem.

## Purpose

The Beltic Schema Registry serves as the single source of truth for:

- **Credential Structure**: Required and optional fields for each credential type
- **Validation Rules**: Data types, formats, conditional requirements, and constraints
- **Versioning**: Schema evolution with backward compatibility tracking
- **Integration**: Machine-readable definitions for automated validation

## Directory Structure

Schemas are organized by **credential type** and **version**:

```
schemas/
├── agent/
│   └── v1/
│       ├── agent-credential-v1.schema.json
│       └── README.md
└── developer/
    └── v1/
        ├── developer-credential-v1.schema.json
        └── README.md
```

## Available Schemas

| Schema Name             | Version | Status | Documentation                                       | Validation Tools | Last Updated |
| ----------------------- | ------- | ------ | --------------------------------------------------- | ---------------- | ------------ |
| **AgentCredential**     | v1.0    | Stable | [Specification](../docs/agent-credential-v1.md)     | AJV, jsonschema  | 2025-11-21   |
| **DeveloperCredential** | v1.0    | Stable | [Specification](../docs/developer-credential-v1.md) | AJV, jsonschema  | 2025-11-21   |

### AgentCredential v1

**Schema ID**: `https://schema.beltic.com/agent/v1/agent-credential-v1.schema.json`

**Purpose**: Verifiable credential for AI agents that documents identity, capabilities, safety metrics, privacy practices, and operational details.

**Key Features**:

- 75+ fields covering identity, technical profile, safety, privacy, and operations
- ML safety metrics (Attack Success Rate, Robustness Score, Privacy Leakage Score)
- NIST AI RMF alignment tags for governance and risk management
- Tool/action declarations with risk categories
- Data handling and privacy policy documentation

**Use Cases**:

- Agent registration and KYC
- Merchant agent verification
- Platform access control
- Audit and compliance reporting

**Documentation**: [Full Specification](../docs/agent-credential-v1.md) | [Schema README](agent/v1/README.md)

**Examples**: [Agent Examples](../examples/agent/v1/)

---

### DeveloperCredential v1

**Schema ID**: `https://schema.beltic.com/developer/v1/developer-credential-v1.schema.json`

**Purpose**: Verifiable credential for developers/organizations that establishes identity, legitimacy, and risk profile through KYC/KYB verification.

**Key Features**:

- 35 fields covering core identity, contact info, tax/registration, risk, ownership
- Conditional validation rules (27 rules across Tier 1 Critical + Tier 2 High)
- Assurance metadata tracking (self-attested, Beltic-verified, third-party-verified)
- Entity-type-specific requirements (individual, corporation, LLC, etc.)
- KYB tier system (tier_0 to tier_4) with progressive screening requirements

**Use Cases**:

- Developer identity verification
- KYC/KYB for agent issuers
- Sanctions/PEP/adverse media screening
- Beneficial ownership transparency

**Documentation**: [Full Specification](../docs/developer-credential-v1.md) | [Schema README](developer/v1/README.md)

**Examples**: [Developer Examples](../examples/developer/v1/) | [Test Suite](../examples/developer/v1/tests/)

---

## How to Use Schemas

### Referencing Schemas in JSON

Add a `$schema` field at the top of your credential JSON:

```json
{
  "$schema": "../../schemas/agent/v1/agent-credential-v1.schema.json",
  "schemaVersion": "1.0",
  "agentId": "...",
  ...
}
```

**Schema Reference Patterns**:

- **Relative Path**: `../../../schemas/agent/v1/agent-credential-v1.schema.json` (from examples/)
- **Absolute URL**: `https://schema.beltic.com/agent/v1/agent-credential-v1.schema.json` (for production)
- **Local File**: `/path/to/beltic-spec/schemas/agent/v1/agent-credential-v1.schema.json` (for development)

### Validating Credentials

See the [Validation Guide](../docs/validation-guide.md) for comprehensive instructions.

**Quick Validation with AJV**:

```bash
# Install AJV CLI
npm install -g ajv-cli ajv-formats

# Validate a credential
ajv validate \
  -s schemas/agent/v1/agent-credential-v1.schema.json \
  -d examples/agent/v1/valid-simple-agent.json

# Expected output: valid
```

**Quick Validation with Python**:

```python
import json
from jsonschema import validate, Draft202012Validator

# Load schema and credential
with open('schemas/agent/v1/agent-credential-v1.schema.json') as f:
    schema = json.load(f)

with open('examples/agent/v1/valid-simple-agent.json') as f:
    credential = json.load(f)

# Validate
Draft202012Validator(schema).validate(credential)
print("✓ Valid")
```

**Automated Validation**:

```bash
# Validate all examples using npm scripts (requires package.json)
npm run validate:all

# Or using Makefile
make validate-all
```

## Schema Features

### JSON Schema Draft 2020-12

All Beltic schemas use **JSON Schema Draft 2020-12**, which provides:

- Advanced conditional validation (`if/then/else`)
- Format validation (date, date-time, email, URI, UUID)
- String pattern matching (regex)
- Numeric constraints (minimum, maximum, multipleOf)
- Array and object validation
- Required field dependencies

### Conditional Validation

Some schemas (e.g., DeveloperCredential v1) include complex conditional logic:

**Example: Tax ID Verification Chain**

```json
{
  "if": {
    "properties": { "taxIdExists": { "const": true } }
  },
  "then": {
    "required": ["taxIdVerified", "taxIdJurisdiction"]
  }
}
```

This ensures that if a tax ID exists, its verification status and jurisdiction must be provided.

See [DeveloperCredential Conditional Validation](../docs/developer-credential-v1.md#8-conditional-validation-rules) for details.

### Assurance Metadata

DeveloperCredential v1 includes **assurance tracking** to document verification levels:

```json
{
  "assuranceMetadata": {
    "globalAssuranceLevel": "beltic_verified",
    "fieldAssurances": {
      "legalName": {
        "assuranceLevel": "beltic_verified",
        "verificationDate": "2025-11-20T14:00:00Z",
        "verificationSource": "Delaware Division of Corporations"
      }
    }
  }
}
```

See [Assurance Metadata Specification](../docs/developer-credential-v1.md#9-assurance-metadata) for details.

## Validation Tools

### Recommended Tools by Language

| Language               | Tool                                                                | Installation                             | Documentation                                                          |
| ---------------------- | ------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| **JavaScript/Node.js** | [AJV](https://ajv.js.org/)                                          | `npm install ajv ajv-formats`            | [AJV Docs](https://ajv.js.org/guide/getting-started.html)              |
| **Python**             | [jsonschema](https://python-jsonschema.readthedocs.io/)             | `pip install jsonschema`                 | [jsonschema Docs](https://python-jsonschema.readthedocs.io/en/stable/) |
| **Go**                 | [gojsonschema](https://github.com/xeipuuv/gojsonschema)             | `go get github.com/xeipuuv/gojsonschema` | [gojsonschema Docs](https://github.com/xeipuuv/gojsonschema)           |
| **Java**               | [everit-org/json-schema](https://github.com/everit-org/json-schema) | Maven/Gradle                             | [Everit Docs](https://github.com/everit-org/json-schema)               |
| **CLI**                | [ajv-cli](https://github.com/ajv-validator/ajv-cli)                 | `npm install -g ajv-cli ajv-formats`     | [CLI Docs](https://github.com/ajv-validator/ajv-cli)                   |

### Online Validators

For quick testing without installation:

- [JSON Schema Validator](https://www.jsonschemavalidator.net/) - Paste schema and JSON
- [AJV Online](https://ajv.js.org/) - Official AJV test environment

**Note**: Use local validation for production and sensitive data. Never paste credentials with real PII to online validators.

## Version History

### v1.0 (2025-11-21) - Initial Release

**AgentCredential v1.0**:

- 75+ fields covering full agent lifecycle
- Safety metrics (ASR, robustness, privacy leakage)
- NIST AI RMF alignment
- Tool/action risk declarations

**DeveloperCredential v1.0**:

- 35 fields for developer/organization identity
- 27 conditional validation rules
- Assurance metadata for verification tracking
- Entity-type-specific requirements
- KYB tier system (0-4)

**Schema Features**:

- JSON Schema Draft 2020-12
- Conditional validation with `if/then/else`
- Format validation (dates, emails, URIs, UUIDs)
- Comprehensive documentation

## Schema Evolution

### Versioning Strategy

Beltic uses **semantic versioning** for schemas:

- **Major version** (v1 → v2): Breaking changes, incompatible updates
- **Minor version** (v1.0 → v1.1): New optional fields, backward-compatible additions
- **Patch version** (v1.0.0 → v1.0.1): Bug fixes, clarifications, no structural changes

### Backward Compatibility

When schemas evolve:

- **Old credentials remain valid**: v1 credentials continue to work with v1 validators
- **Deprecation notices**: Schemas marked deprecated receive 6-month transition period
- **Migration guides**: Each new major version includes migration instructions
- **Parallel support**: Major versions are supported in parallel for at least 1 year

### Proposing Schema Changes

See [Contributing to Specifications](../docs/contributing-spec.md) for the proposal process.

## CI/CD Integration

### Automated Validation in GitHub Actions

```yaml
# .github/workflows/validate.yml
name: Validate Credentials

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install -g ajv-cli ajv-formats
      - run: ajv validate -s schemas/**/*.schema.json -d examples/**/*.json
```

See [CI/CD Validation Guide](../docs/validation-guide.md#cicd-integration) for complete setup.

## Support

### Documentation

- [Beltic Overview](../docs/overview.md) - High-level framework introduction
- [Validation Guide](../docs/validation-guide.md) - Complete validation instructions
- [Integration Guide](../docs/integration-guide.md) - For merchants and platforms
- [Quickstart](../docs/quickstart.md) - Get started in 5 minutes

### Examples

- [Agent Examples](../examples/agent/v1/) - Simple and complex agent credentials
- [Developer Examples](../examples/developer/v1/) - Individual and organization credentials
- [Test Suite](../examples/developer/v1/tests/) - 26 validation test cases

### Community

- **Issues**: [GitHub Issues](https://github.com/beltic/beltic-spec/issues)
- **Discussions**: [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions)
- **Contributing**: [Contributing Guide](../docs/contributing-spec.md)

## License

Beltic specifications and schemas are released under the [Apache 2.0 License](../LICENSE).

---

**Last Updated**: 2025-11-21
**Schema Registry Version**: 1.0
**Maintained by**: [Beltic](https://beltic.com)
