# Beltic Validation Guide

**Comprehensive guide to validating Beltic credentials using JSON Schema validators and runtime checks.**

This guide covers everything from basic validation to advanced CI/CD integration, troubleshooting, and performance optimization.

## Table of Contents

1. [Overview](#overview)
2. [Validation Tools Setup](#validation-tools-setup)
3. [Basic Validation](#basic-validation)
4. [Programmatic Validation](#programmatic-validation)
5. [Conditional Validation Testing](#conditional-validation-testing)
6. [Runtime Validation](#runtime-validation)
7. [Batch Validation](#batch-validation)
8. [CI/CD Integration](#cicd-integration)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Topics](#advanced-topics)
11. [Performance](#performance)

---

## Overview

### What is Validation?

Validation ensures that a credential:
- Contains all required fields
- Uses correct data types and formats
- Satisfies conditional logic rules
- Meets date ordering constraints
- Passes data freshness requirements

### Two Types of Validation

#### 1. Schema Validation (JSON Schema)

Validates structure, types, formats, and some conditional logic.

**What it checks:**
- Required fields present
- Correct data types (string, number, boolean, object, array)
- Format constraints (date-time, email, URI, UUID)
- Enum values
- Range constraints (min/max)
- String patterns (regex)
- Conditional rules (if/then/else)

**What it cannot check:**
- Date ordering (issuance < expiration)
- Relative date freshness (screening within 90 days)
- Cross-credential references
- External data consistency

#### 2. Runtime Validation (Application Logic)

Validates business logic that JSON Schema cannot express.

**What it checks:**
- Date comparisons (`issuanceDate < expirationDate`)
- Time-based constraints (screening age, credential expiration)
- External lookups (DID resolution, revocation list checks)
- Cross-credential validation (developer credential exists)
- Custom business rules

**Best Practice:** Use both schema and runtime validation for complete coverage.

---

## Validation Tools Setup

### JavaScript/Node.js: AJV

**Install:**
```bash
npm install ajv ajv-formats

# For CLI usage
npm install -g ajv-cli ajv-formats
```

**Features:**
- ✅ Full JSON Schema Draft 2020-12 support
- ✅ Fast (compiles schemas)
- ✅ Excellent error messages
- ✅ Supports custom keywords
- ✅ Format validation (dates, emails, URIs, UUIDs)

**Recommended for:** Production applications, CI/CD, Node.js backends

---

### Python: jsonschema

**Install:**
```bash
pip install jsonschema
```

**Features:**
- ✅ Full JSON Schema Draft 2020-12 support
- ✅ Easy to use
- ✅ Good error messages
- ✅ Built-in format validation

**Recommended for:** Python applications, data science workflows, Django/Flask backends

---

### Go: gojsonschema

**Install:**
```bash
go get github.com/xeipuuv/gojsonschema
```

**Features:**
- ✅ JSON Schema Draft 7 support (Draft 2020-12 partial)
- ✅ Fast
- ✅ Native Go types

**Recommended for:** Go services, high-performance applications

---

### Java: everit-org/json-schema

**Maven:**
```xml
<dependency>
    <groupId>com.github.erosb</groupId>
    <artifactId>everit-json-schema</artifactId>
    <version>1.14.2</version>
</dependency>
```

**Gradle:**
```gradle
implementation 'com.github.erosb:everit-json-schema:1.14.2'
```

**Recommended for:** Enterprise Java applications, Spring Boot services

---

### CLI Tools

#### AJV CLI

**Best for:** Command-line validation, shell scripts, Makefiles

```bash
npm install -g ajv-cli ajv-formats

# Validate single file
ajv validate -s schema.json -d credential.json

# Validate multiple files
ajv validate -s schema.json -d "credentials/*.json"
```

#### Online Validators (Development Only)

**⚠️ WARNING:** Never paste credentials with real PII into online validators.

- [JSON Schema Validator](https://www.jsonschemavalidator.net/)
- [AJV Online](https://ajv.js.org/)

**Use for:** Testing schema syntax, learning JSON Schema, quick checks with synthetic data

---

## Basic Validation

### Command Line

#### Validate a DeveloperCredential

```bash
ajv validate \
  -s schemas/developer/v1/developer-credential-v1.schema.json \
  -d examples/developer/v1/tests/valid-individual-minimal.json
```

**Expected output:**
```
examples/developer/v1/tests/valid-individual-minimal.json valid
```

#### Validate an AgentCredential

```bash
ajv validate \
  -s schemas/agent/v1/agent-credential-v1.schema.json \
  -d examples/agent/v1/valid-simple-agent.json
```

#### Validate Multiple Files

```bash
# All developer examples
ajv validate \
  -s schemas/developer/v1/developer-credential-v1.schema.json \
  -d "examples/developer/v1/tests/*.json"

# All agent examples
ajv validate \
  -s schemas/agent/v1/agent-credential-v1.schema.json \
  -d "examples/agent/v1/*.json"
```

#### Get Detailed Error Messages

```bash
# Show all errors (not just first)
ajv validate \
  -s schemas/developer/v1/developer-credential-v1.schema.json \
  -d my-credential.json \
  --all-errors

# Verbose output
ajv validate \
  -s schemas/developer/v1/developer-credential-v1.schema.json \
  -d my-credential.json \
  --verbose
```

---

## Programmatic Validation

### JavaScript/Node.js with AJV

#### Basic Validation

```javascript
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

// Initialize AJV with JSON Schema Draft 2020-12
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

// Load schema
const schema = JSON.parse(
  fs.readFileSync('schemas/agent/v1/agent-credential-v1.schema.json')
);

// Compile schema (done once, reused for multiple validations)
const validate = ajv.compile(schema);

// Load credential
const credential = JSON.parse(
  fs.readFileSync('examples/agent/v1/valid-simple-agent.json')
);

// Validate
if (validate(credential)) {
  console.log("✓ Valid AgentCredential");
} else {
  console.error("✗ Validation errors:");
  validate.errors.forEach(err => {
    console.error(`  - ${err.instancePath}: ${err.message}`);
    if (err.params) {
      console.error(`    Params: ${JSON.stringify(err.params)}`);
    }
  });
}
```

#### Validation with Detailed Errors

```javascript
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

const ajv = new Ajv({
  allErrors: true,  // Report all errors, not just first
  verbose: true,     // Include schema and data in errors
  strict: true       // Strict mode for schema validation
});
addFormats(ajv);

const schema = JSON.parse(
  fs.readFileSync('schemas/developer/v1/developer-credential-v1.schema.json')
);
const validate = ajv.compile(schema);

const credential = JSON.parse(fs.readFileSync('my-developer-credential.json'));

if (!validate(credential)) {
  console.error("Validation failed with the following errors:\n");

  validate.errors.forEach((err, index) => {
    console.error(`Error ${index + 1}:`);
    console.error(`  Path: ${err.instancePath || '(root)'}`);
    console.error(`  Message: ${err.message}`);
    console.error(`  Schema path: ${err.schemaPath}`);

    if (err.params) {
      console.error(`  Additional info: ${JSON.stringify(err.params, null, 2)}`);
    }
    console.error("");
  });

  process.exit(1);
}

console.log("✓ Credential is valid");
```

#### Validation Function for Reuse

```javascript
// validator.js
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

class BelticValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: true });
    addFormats(this.ajv);

    // Preload and compile schemas
    this.agentSchema = this.loadSchema(
      'schemas/agent/v1/agent-credential-v1.schema.json'
    );
    this.developerSchema = this.loadSchema(
      'schemas/developer/v1/developer-credential-v1.schema.json'
    );

    this.validateAgent = this.ajv.compile(this.agentSchema);
    this.validateDeveloper = this.ajv.compile(this.developerSchema);
  }

  loadSchema(path) {
    return JSON.parse(fs.readFileSync(path));
  }

  validate(credential, type) {
    const validator = type === 'agent' ? this.validateAgent : this.validateDeveloper;

    const valid = validator(credential);

    return {
      valid,
      errors: valid ? null : validator.errors
    };
  }

  formatErrors(errors) {
    return errors.map(err => ({
      path: err.instancePath || '(root)',
      message: err.message,
      params: err.params
    }));
  }
}

module.exports = BelticValidator;
```

**Usage:**
```javascript
const BelticValidator = require('./validator');
const fs = require('fs');

const validator = new BelticValidator();

const credential = JSON.parse(fs.readFileSync('my-agent.json'));
const result = validator.validate(credential, 'agent');

if (result.valid) {
  console.log("✓ Valid credential");
} else {
  console.error("✗ Validation errors:");
  console.error(JSON.stringify(validator.formatErrors(result.errors), null, 2));
}
```

---

### Python with jsonschema

#### Basic Validation

```python
import json
from jsonschema import validate, Draft202012Validator, ValidationError

# Load schema
with open('schemas/agent/v1/agent-credential-v1.schema.json') as f:
    schema = json.load(f)

# Load credential
with open('examples/agent/v1/valid-simple-agent.json') as f:
    credential = json.load(f)

# Validate
try:
    Draft202012Validator(schema).validate(credential)
    print("✓ Valid AgentCredential")
except ValidationError as e:
    print(f"✗ Validation error: {e.message}")
    print(f"  Path: {'/'.join(str(p) for p in e.path)}")
```

#### Validation with All Errors

```python
import json
from jsonschema import Draft202012Validator

# Load schema and credential
with open('schemas/developer/v1/developer-credential-v1.schema.json') as f:
    schema = json.load(f)

with open('my-developer-credential.json') as f:
    credential = json.load(f)

# Create validator
validator = Draft202012Validator(schema)

# Get all errors
errors = list(validator.iter_errors(credential))

if not errors:
    print("✓ Valid DeveloperCredential")
else:
    print(f"✗ Validation failed with {len(errors)} error(s):\n")

    for i, error in enumerate(errors, 1):
        print(f"Error {i}:")
        print(f"  Path: {'/'.join(str(p) for p in error.path) or '(root)'}")
        print(f"  Message: {error.message}")
        print(f"  Schema path: {'/'.join(str(p) for p in error.schema_path)}")
        print()
```

#### Reusable Validator Class

```python
# validator.py
import json
from jsonschema import Draft202012Validator, ValidationError
from typing import Dict, List, Tuple

class BelticValidator:
    def __init__(self, schema_base_path='schemas'):
        self.schema_base_path = schema_base_path

        # Load and compile schemas
        self.agent_schema = self._load_schema('agent/v1/agent-credential-v1.schema.json')
        self.developer_schema = self._load_schema('developer/v1/developer-credential-v1.schema.json')

        self.agent_validator = Draft202012Validator(self.agent_schema)
        self.developer_validator = Draft202012Validator(self.developer_schema)

    def _load_schema(self, path):
        with open(f'{self.schema_base_path}/{path}') as f:
            return json.load(f)

    def validate(self, credential: Dict, credential_type: str) -> Tuple[bool, List[Dict]]:
        """
        Validate a credential.

        Returns:
            (is_valid, errors_list)
        """
        validator = (
            self.agent_validator if credential_type == 'agent'
            else self.developer_validator
        )

        errors = list(validator.iter_errors(credential))

        if not errors:
            return True, []

        return False, self._format_errors(errors)

    def _format_errors(self, errors):
        return [
            {
                'path': '/'.join(str(p) for p in error.path) or '(root)',
                'message': error.message,
                'schema_path': '/'.join(str(p) for p in error.schema_path)
            }
            for error in errors
        ]

# Usage
if __name__ == '__main__':
    import sys

    validator = BelticValidator()

    with open(sys.argv[1]) as f:
        credential = json.load(f)

    valid, errors = validator.validate(credential, 'agent')

    if valid:
        print("✓ Valid credential")
    else:
        print(f"✗ Validation failed with {len(errors)} error(s):")
        for error in errors:
            print(f"  - {error['path']}: {error['message']}")
```

**Usage:**
```bash
python validator.py my-agent-credential.json
```

---

### Go with gojsonschema

```go
package main

import (
    "fmt"
    "github.com/xeipuuv/gojsonschema"
)

func main() {
    schemaLoader := gojsonschema.NewReferenceLoader(
        "file://./schemas/agent/v1/agent-credential-v1.schema.json",
    )
    documentLoader := gojsonschema.NewReferenceLoader(
        "file://./examples/agent/v1/valid-simple-agent.json",
    )

    result, err := gojsonschema.Validate(schemaLoader, documentLoader)
    if err != nil {
        panic(err.Error())
    }

    if result.Valid() {
        fmt.Printf("✓ Valid AgentCredential\n")
    } else {
        fmt.Printf("✗ Validation errors:\n")
        for _, desc := range result.Errors() {
            fmt.Printf("  - %s: %s\n", desc.Field(), desc.Description())
        }
    }
}
```

---

## Conditional Validation Testing

DeveloperCredential v1 has **27 conditional validation rules** that require specific test scenarios.

### Understanding Conditional Rules

#### Tier 1 Critical Rules (MUST pass)

1. **Tax ID Chain**: If `taxIdExists=true`, then `taxIdVerified` and `taxIdJurisdiction` are required
2. **Tax Verification Date**: If `taxIdVerified="verified"`, then `taxIdLastVerifiedDate` is required
3. **Individual Restrictions**: If `entityType="individual"`, then `incorporationDate`, `businessRegistrationNumber`, `registeredAddress` are **prohibited**
4. **Organization Requirements**: If `entityType` is organization type, then `incorporationDate`, `businessRegistrationNumber`, `registeredAddress` are **required**
5-10. Additional critical rules (see [full list](developer-credential-v1.md#8-conditional-validation-rules))

#### Tier 2 High Rules (SHOULD pass)

Data consistency warnings that don't invalidate credentials but indicate potential issues.

### Testing Conditional Rules

#### Test Suite Structure

The `examples/developer/v1/tests/` directory contains 26 test files:

**Valid Examples (6 files):**
- `valid-individual-minimal.json`
- `valid-individual-complete.json`
- `valid-organization-tier1.json`
- `valid-organization-tier2-complete.json`
- `valid-organization-tier3-complex.json`
- `valid-high-risk-suspended.json`

**Tier 1 Invalid Examples (10 files):**
- `invalid-tax-id-chain.json` - Tax ID exists but no verification
- `invalid-entity-type-mismatch.json` - Individual with organization fields
- `invalid-organization-missing-required.json` - LLC without registered address
- `invalid-tier2-missing-screening.json` - Tier 2 without risk assessment
- `invalid-sanctions-match-low-risk.json` - Sanctioned entity marked low risk
- `invalid-prohibited-active.json` - Prohibited entity with active status
- `invalid-screening-missing-date.json` - Risk level but no assessment date
- `invalid-verified-without-date.json` - Verified tax ID without date
- `invalid-dates-reversed.json` - Issuance after expiration
- `invalid-last-updated-out-of-range.json` - Update before issuance

**Tier 2 Invalid Examples (10 files):**
- `tier2-invalid-jurisdiction-without-tax-id.json`
- `tier2-invalid-registration-entity-mismatch.json`
- `tier2-invalid-beneficial-owners-inconsistent.json`
- `tier2-invalid-screening-stale.json`
- And 6 more...

#### Running the Test Suite

**Validate All Valid Examples (should pass):**
```bash
for file in examples/developer/v1/tests/valid-*.json; do
  ajv validate \
    -s schemas/developer/v1/developer-credential-v1.schema.json \
    -d "$file" \
    && echo "✓ $file" \
    || echo "✗ $file SHOULD BE VALID"
done
```

**Validate All Invalid Examples (should fail):**
```bash
for file in examples/developer/v1/tests/invalid-*.json examples/developer/v1/tests/tier2-invalid-*.json; do
  ajv validate \
    -s schemas/developer/v1/developer-credential-v1.schema.json \
    -d "$file" \
    && echo "✗ $file SHOULD BE INVALID" \
    || echo "✓ $file correctly rejected"
done
```

#### Automated Test Suite

**JavaScript (Node.js):**
```javascript
// test-conditional-rules.js
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = JSON.parse(
  fs.readFileSync('schemas/developer/v1/developer-credential-v1.schema.json')
);
const validate = ajv.compile(schema);

const testDir = 'examples/developer/v1/tests';
const files = fs.readdirSync(testDir);

let passCount = 0;
let failCount = 0;

files.forEach(file => {
  if (!file.endsWith('.json')) return;

  const filePath = path.join(testDir, file);
  const credential = JSON.parse(fs.readFileSync(filePath));
  const isValid = validate(credential);

  const shouldBeValid = file.startsWith('valid-');
  const testPassed = (isValid && shouldBeValid) || (!isValid && !shouldBeValid);

  if (testPassed) {
    console.log(`✓ ${file}`);
    passCount++;
  } else {
    console.log(`✗ ${file} - Expected ${shouldBeValid ? 'valid' : 'invalid'}, got ${isValid ? 'valid' : 'invalid'}`);
    if (!isValid && shouldBeValid) {
      validate.errors.forEach(err => {
        console.log(`    - ${err.instancePath}: ${err.message}`);
      });
    }
    failCount++;
  }
});

console.log(`\nResults: ${passCount} passed, ${failCount} failed`);
process.exit(failCount > 0 ? 1 : 0);
```

**Run:**
```bash
node test-conditional-rules.js
```

---

## Runtime Validation

Some validation rules cannot be expressed in JSON Schema and require runtime checks.

### Date Ordering Validation

```javascript
function validateDateOrdering(credential) {
  const issuance = new Date(credential.issuanceDate);
  const expiration = new Date(credential.expirationDate);
  const updated = new Date(credential.lastUpdatedDate);

  // Rule #8: issuanceDate < expirationDate
  if (issuance >= expiration) {
    throw new Error(
      `issuanceDate (${credential.issuanceDate}) must be before expirationDate (${credential.expirationDate})`
    );
  }

  // Rule #9: issuanceDate <= lastUpdatedDate <= expirationDate
  if (updated < issuance || updated > expiration) {
    throw new Error(
      `lastUpdatedDate (${credential.lastUpdatedDate}) must be between issuanceDate and expirationDate`
    );
  }

  return true;
}
```

### Date Freshness Validation

```javascript
function validateScreeningFreshness(credential) {
  const warnings = [];

  const daysOld = (dateStr) => {
    return (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
  };

  // Tier 2 Rule #4: Sanctions screening ≤90 days
  if (credential.sanctionsScreeningLastChecked) {
    const age = daysOld(credential.sanctionsScreeningLastChecked);
    if (age > 90) {
      warnings.push({
        severity: 'high',
        field: 'sanctionsScreeningLastChecked',
        message: `Sanctions screening is stale (${Math.round(age)} days old, should be ≤90 days)`
      });
    }
  }

  // Tier 2 Rule #5-6: PEP/adverse media ≤180 days
  if (credential.pepRiskLastAssessed) {
    const age = daysOld(credential.pepRiskLastAssessed);
    if (age > 180) {
      warnings.push({
        severity: 'medium',
        field: 'pepRiskLastAssessed',
        message: `PEP risk assessment is stale (${Math.round(age)} days old, should be ≤180 days)`
      });
    }
  }

  if (credential.adverseMediaLastAssessed) {
    const age = daysOld(credential.adverseMediaLastAssessed);
    if (age > 180) {
      warnings.push({
        severity: 'medium',
        field: 'adverseMediaLastAssessed',
        message: `Adverse media assessment is stale (${Math.round(age)} days old, should be ≤180 days)`
      });
    }
  }

  // Tier 2 Rule #11: Tax verification ≤2 years
  if (credential.taxIdLastVerifiedDate) {
    const age = daysOld(credential.taxIdLastVerifiedDate);
    if (age > 730) { // 2 years
      warnings.push({
        severity: 'medium',
        field: 'taxIdLastVerifiedDate',
        message: `Tax verification is old (${Math.round(age)} days old, should be ≤730 days)`
      });
    }
  }

  return warnings;
}
```

### Complete Runtime Validator

```javascript
// runtime-validator.js
class RuntimeValidator {
  validateDeveloperCredential(credential) {
    const errors = [];
    const warnings = [];

    // Date ordering (critical)
    try {
      this.validateDateOrdering(credential);
    } catch (e) {
      errors.push({ severity: 'critical', message: e.message });
    }

    // Screening freshness (warnings)
    warnings.push(...this.validateScreeningFreshness(credential));

    // Credential expiration (critical if expired)
    if (this.isExpired(credential)) {
      errors.push({
        severity: 'critical',
        field: 'expirationDate',
        message: `Credential expired on ${credential.expirationDate}`
      });
    }

    return { errors, warnings };
  }

  validateDateOrdering(credential) {
    const issuance = new Date(credential.issuanceDate);
    const expiration = new Date(credential.expirationDate);
    const updated = new Date(credential.lastUpdatedDate);

    if (issuance >= expiration) {
      throw new Error(
        `issuanceDate must be before expirationDate`
      );
    }

    if (updated < issuance || updated > expiration) {
      throw new Error(
        `lastUpdatedDate must be between issuanceDate and expirationDate`
      );
    }
  }

  validateScreeningFreshness(credential) {
    // (implementation from above)
    return [];
  }

  isExpired(credential) {
    return new Date(credential.expirationDate) < new Date();
  }
}

module.exports = RuntimeValidator;
```

**Usage:**
```javascript
const BelticValidator = require('./validator');
const RuntimeValidator = require('./runtime-validator');

const schemaValidator = new BelticValidator();
const runtimeValidator = new RuntimeValidator();

// Schema validation
const schemaResult = schemaValidator.validate(credential, 'developer');

if (!schemaResult.valid) {
  console.error("Schema validation failed");
  console.error(schemaValidator.formatErrors(schemaResult.errors));
  process.exit(1);
}

// Runtime validation
const runtimeResult = runtimeValidator.validateDeveloperCredential(credential);

if (runtimeResult.errors.length > 0) {
  console.error("Runtime validation failed:");
  runtimeResult.errors.forEach(err => {
    console.error(`  - ${err.field || '(general)'}: ${err.message}`);
  });
  process.exit(1);
}

if (runtimeResult.warnings.length > 0) {
  console.warn("Runtime validation warnings:");
  runtimeResult.warnings.forEach(warn => {
    console.warn(`  - [${warn.severity}] ${warn.field}: ${warn.message}`);
  });
}

console.log("✓ Credential is valid (schema + runtime)");
```

---

## Batch Validation

### Validate All Examples

**Bash script:**
```bash
#!/bin/bash
# validate-all.sh

SCHEMA_AGENT="schemas/agent/v1/agent-credential-v1.schema.json"
SCHEMA_DEVELOPER="schemas/developer/v1/developer-credential-v1.schema.json"

PASS=0
FAIL=0

echo "=== Validating Agent Credentials ==="
for file in examples/agent/v1/*.json; do
  if ajv validate -s "$SCHEMA_AGENT" -d "$file" 2>/dev/null; then
    echo "✓ $file"
    ((PASS++))
  else
    echo "✗ $file"
    ((FAIL++))
  fi
done

echo ""
echo "=== Validating Developer Credentials ==="
for file in examples/developer/v1/tests/*.json; do
  EXPECTED_VALID=false
  [[ "$file" == *"valid-"* ]] && EXPECTED_VALID=true

  if ajv validate -s "$SCHEMA_DEVELOPER" -d "$file" 2>/dev/null; then
    ACTUAL_VALID=true
  else
    ACTUAL_VALID=false
  fi

  if [[ "$EXPECTED_VALID" == "$ACTUAL_VALID" ]]; then
    echo "✓ $file"
    ((PASS++))
  else
    echo "✗ $file (expected $([ "$EXPECTED_VALID" == true ] && echo "valid" || echo "invalid"))"
    ((FAIL++))
  fi
done

echo ""
echo "=== Results ==="
echo "Passed: $PASS"
echo "Failed: $FAIL"

exit $FAIL
```

**Make it executable:**
```bash
chmod +x validate-all.sh
./validate-all.sh
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/validate.yml`:

```yaml
name: Validate Credentials

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install AJV CLI
        run: npm install -g ajv-cli ajv-formats

      - name: Validate Agent Credentials
        run: |
          ajv validate \
            -s schemas/agent/v1/agent-credential-v1.schema.json \
            -d "examples/agent/v1/*.json"

      - name: Validate Developer Credentials (Valid)
        run: |
          for file in examples/developer/v1/tests/valid-*.json; do
            ajv validate \
              -s schemas/developer/v1/developer-credential-v1.schema.json \
              -d "$file" \
              || exit 1
          done

      - name: Validate Developer Credentials (Invalid - should fail)
        run: |
          for file in examples/developer/v1/tests/invalid-*.json examples/developer/v1/tests/tier2-invalid-*.json; do
            if ajv validate \
              -s schemas/developer/v1/developer-credential-v1.schema.json \
              -d "$file" 2>/dev/null; then
              echo "ERROR: $file should be invalid but passed validation"
              exit 1
            fi
          done
          echo "All invalid examples correctly rejected"

      - name: Run Custom Validation Script
        run: |
          npm install ajv ajv-formats
          node scripts/validate-all.js
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
validate-credentials:
  image: node:18
  stage: test
  script:
    - npm install -g ajv-cli ajv-formats
    - ajv validate -s schemas/agent/v1/agent-credential-v1.schema.json -d "examples/agent/v1/*.json"
    - ajv validate -s schemas/developer/v1/developer-credential-v1.schema.json -d "examples/developer/v1/tests/valid-*.json"
  only:
    - main
    - merge_requests
```

### Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Pre-commit hook to validate credentials before committing

echo "Running credential validation..."

# Check if AJV is installed
if ! command -v ajv &> /dev/null; then
    echo "Error: ajv-cli not found. Install with: npm install -g ajv-cli ajv-formats"
    exit 1
fi

# Validate any changed JSON files in examples/
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep 'examples/.*\.json$')

if [ -z "$CHANGED_FILES" ]; then
    echo "No credential files to validate"
    exit 0
fi

ERRORS=0

for file in $CHANGED_FILES; do
    if [[ "$file" == examples/agent/* ]]; then
        SCHEMA="schemas/agent/v1/agent-credential-v1.schema.json"
    elif [[ "$file" == examples/developer/* ]]; then
        SCHEMA="schemas/developer/v1/developer-credential-v1.schema.json"
    else
        continue
    fi

    echo "Validating $file..."
    if ! ajv validate -s "$SCHEMA" -d "$file" 2>/dev/null; then
        echo "✗ $file failed validation"
        ((ERRORS++))
    else
        echo "✓ $file is valid"
    fi
done

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo "Commit rejected: $ERRORS file(s) failed validation"
    echo "Fix validation errors and try again"
    exit 1
fi

echo "All credentials validated successfully"
exit 0
```

**Make it executable:**
```bash
chmod +x .git/hooks/pre-commit
```

---

## Troubleshooting

### Common Validation Errors

#### 1. Missing Required Property

**Error:**
```
Error: must have required property 'attackSuccessRate'
```

**Cause:** Required field is missing from the credential.

**Fix:** Add the field with a valid value:
```json
{
  "attackSuccessRate": 0.05
}
```

#### 2. Invalid Format

**Error:**
```
Error: issuanceDate must match format "date-time"
```

**Cause:** Date is not in ISO 8601 format.

**Fix:** Use proper format:
```json
{
  "issuanceDate": "2025-11-21T10:00:00Z"
}
```

**Common format issues:**
- ❌ `"2025-11-21"` (missing time)
- ❌ `"11/21/2025"` (wrong format)
- ✅ `"2025-11-21T10:00:00Z"` (correct)

#### 3. Invalid UUID

**Error:**
```
Error: credentialId must match format "uuid"
```

**Cause:** String is not a valid UUID v4.

**Fix:** Generate a proper UUID:
```bash
# Mac/Linux
uuidgen | tr '[:upper:]' '[:lower:]'

# Or use online generator
# https://www.uuidgenerator.net/version4
```

#### 4. Value Out of Range

**Error:**
```
Error: attackSuccessRate must be <= 1
```

**Cause:** ASR is provided as percentage (15) instead of ratio (0.15).

**Fix:**
```json
{
  "attackSuccessRate": 0.15,  // 15% as decimal
  "robustnessScore": 85        // 85% as integer
}
```

#### 5. Invalid Enum Value

**Error:**
```
Error: currentStatus must be equal to one of the allowed values
```

**Cause:** Value doesn't match any allowed enum value.

**Fix:** Check schema for allowed values:
```json
{
  "currentStatus": "production"  // Must be: development, beta, production, or deprecated
}
```

#### 6. Conditional Validation Failed

**Error:**
```
Error: must have required property 'taxIdVerified' when taxIdExists is true
```

**Cause:** Conditional rule not satisfied (Tax ID Chain rule).

**Fix:** Add required conditional fields:
```json
{
  "taxIdExists": true,
  "taxIdVerified": "verified",
  "taxIdJurisdiction": { "country": "US" },
  "taxIdLastVerifiedDate": "2025-10-01"
}
```

#### 7. Entity Type Mismatch

**Error:**
```
Error: individual entities cannot have incorporationDate
```

**Cause:** Individual developer has organization-only fields.

**Fix:** Remove organization fields or change entity type:
```json
{
  "entityType": "individual"
  // Remove: incorporationDate, businessRegistrationNumber, registeredAddress
}
```

---

### Debugging Validation Issues

#### Enable Verbose Errors

**AJV CLI:**
```bash
ajv validate \
  -s schema.json \
  -d credential.json \
  --all-errors \
  --verbose
```

**AJV Programmatic:**
```javascript
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  logger: console  // Log schema compilation errors
});
```

#### Validate Schema Itself

```bash
# Check if schema is valid JSON Schema
ajv compile -s schemas/agent/v1/agent-credential-v1.schema.json
```

#### Test Individual Fields

Create minimal test credentials to isolate issues:

```json
{
  "$schema": "../../schemas/developer/v1/developer-credential-v1.schema.json",
  "schemaVersion": "1.0",
  "legalName": "Test",
  "entityType": "individual",
  "incorporationJurisdiction": { "country": "US" },
  "businessEmail": "test@example.com",
  "taxIdExists": true,
  "taxIdVerified": "verified",
  "taxIdJurisdiction": { "country": "US" },
  "taxIdLastVerifiedDate": "2025-10-01"
  // ... minimal required fields only
}
```

---

## Advanced Topics

### Custom Validators

Add custom validation logic:

```javascript
const Ajv = require("ajv/dist/2020");

const ajv = new Ajv();

// Add custom keyword for ASR/robustness consistency
ajv.addKeyword({
  keyword: "validateRobustness",
  validate: function(schema, data) {
    const expectedRobustness = Math.round(100 * (1 - data.attackSuccessRate));
    const actualRobustness = data.robustnessScore;

    if (expectedRobustness !== actualRobustness) {
      validate.errors = [{
        keyword: 'validateRobustness',
        message: `robustnessScore should be ${expectedRobustness} (100 × (1 - ${data.attackSuccessRate}))`
      }];
      return false;
    }

    return true;
  }
});
```

### Schema Composition

Reuse common structures across schemas:

```json
{
  "$defs": {
    "jurisdiction": {
      "type": "object",
      "properties": {
        "country": { "type": "string", "minLength": 2, "maxLength": 2 },
        "region": { "type": "string" }
      },
      "required": ["country"]
    }
  },
  "properties": {
    "incorporationJurisdiction": { "$ref": "#/$defs/jurisdiction" },
    "taxIdJurisdiction": { "$ref": "#/$defs/jurisdiction" }
  }
}
```

### Performance Optimization

For high-volume validation:

```javascript
// Precompile schemas once
const agentValidate = ajv.compile(agentSchema);
const developerValidate = ajv.compile(developerSchema);

// Reuse compiled validators
function validateMany(credentials) {
  return credentials.map(cred => ({
    id: cred.credentialId,
    valid: agentValidate(cred),
    errors: agentValidate.errors
  }));
}
```

---

## Performance

### Benchmarks

Typical validation times (M1 Mac, Node.js 18):

| Operation | Time | Throughput |
|-----------|------|------------|
| Schema compilation | ~5ms | - |
| Single validation | ~0.5ms | 2000/sec |
| Batch (100 credentials) | ~50ms | 2000/sec |
| Runtime checks | ~0.1ms | 10000/sec |

### Optimization Tips

1. **Compile Once**: Compile schemas at startup, not per validation
2. **Batch Operations**: Process multiple credentials in parallel
3. **Cache Results**: Cache validation results for unchanged credentials
4. **Selective Runtime Checks**: Only run runtime checks on schema-valid credentials
5. **Parallel Validation**: Use worker threads for large batches

```javascript
const { Worker } = require('worker_threads');

function validateInParallel(credentials, workerCount = 4) {
  const chunkSize = Math.ceil(credentials.length / workerCount);
  const chunks = [];

  for (let i = 0; i < credentials.length; i += chunkSize) {
    chunks.push(credentials.slice(i, i + chunkSize));
  }

  return Promise.all(
    chunks.map(chunk =>
      new Promise((resolve, reject) => {
        const worker = new Worker('./validator-worker.js');
        worker.postMessage(chunk);
        worker.on('message', resolve);
        worker.on('error', reject);
      })
    )
  );
}
```

---

## Resources

### Documentation
- [DeveloperCredential Spec](developer-credential-v1.md) - Conditional validation rules (Section 8)
- [AgentCredential Spec](agent-credential-v1.md) - Complete field reference
- [Quickstart Guide](quickstart.md) - Get started in 5 minutes
- [Integration Guide](integration-guide.md) - For merchants/platforms

### Examples
- [Test Suite](../examples/developer/v1/tests/README.md) - 26 validation test cases
- [Agent Examples](../examples/agent/v1/) - Valid and invalid examples
- [Developer Examples](../examples/developer/v1/) - All entity types and tiers

### Tools
- [AJV Documentation](https://ajv.js.org/)
- [JSON Schema Specification](https://json-schema.org/)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/) (for development only)

---

**Validation Guide Version**: 1.0
**Last Updated**: 2025-11-21
**Maintained by**: [Beltic](https://beltic.com)
**License**: [Apache 2.0](../LICENSE)
