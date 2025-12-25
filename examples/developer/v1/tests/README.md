# Developer Credential v1 - Conditional Validation Test Suite

This directory contains comprehensive test cases for validating the conditional validation rules implemented in the Developer Credential v1 schema.

## Overview

The test suite includes **26 test files** organized into three categories:

- **10 Tier 1 Invalid Tests**: Critical validation failures that must be rejected
- **10 Tier 2 Invalid Tests**: High-priority data consistency violations
- **6 Valid Tests**: Proper credential examples that should validate successfully

## Test Organization

### Tier 1 Critical Invalid Tests (MUST REJECT)

These test files violate critical conditional rules that prevent invalid credentials from being issued:

| Test File                                    | Rule Violated   | Description                                                            |
| -------------------------------------------- | --------------- | ---------------------------------------------------------------------- |
| `invalid-tax-id-missing-verification.json`   | Tier 1 Rule #1  | `taxIdExists=true` but `taxIdVerified` is missing                      |
| `invalid-individual-with-org-fields.json`    | Tier 1 Rule #3  | Individual has `incorporationDate` and `businessRegistrationNumber`    |
| `invalid-organization-missing-required.json` | Tier 1 Rule #4  | LLC missing required `registeredAddress`                               |
| `invalid-tier2-missing-screenings.json`      | Tier 1 Rule #5  | `kybTier=tier_2` but missing `pepRiskLevel`                            |
| `invalid-sanctions-match-low-risk.json`      | Tier 1 Rule #7  | `sanctionsScreeningStatus=confirmed_match` but `overallRiskRating=low` |
| `invalid-prohibited-active.json`             | Tier 1 Rule #10 | `overallRiskRating=prohibited` but `credentialStatus=active`           |
| `invalid-screening-missing-date.json`        | Tier 1 Rule #6b | `pepRiskLevel=low` but `pepRiskLastAssessed` is missing                |
| `invalid-verified-without-date.json`         | Tier 1 Rule #2  | `taxIdVerified=verified` but `taxIdLastVerifiedDate` is missing        |
| `invalid-dates-reversed.json`                | Tier 1 Rule #8  | `issuanceDate` is after `expirationDate`                               |
| `invalid-last-updated-out-of-range.json`     | Tier 1 Rule #9  | `lastUpdatedDate` is before `issuanceDate`                             |

### Tier 2 High-Priority Invalid Tests (SHOULD WARN/REJECT)

These test files violate data consistency rules that should trigger warnings or enhanced review:

| Test File                                             | Rule Violated     | Description                                                                   |
| ----------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------- |
| `tier2-invalid-jurisdiction-without-tax-id.json`      | Tier 2 Rule #1    | `taxIdJurisdiction` provided but `taxIdExists=false`                          |
| `tier2-invalid-registration-entity-mismatch.json`     | Tier 2 Rule #2    | `businessRegistrationStatus=active_good_standing` but `entityType=individual` |
| `tier2-invalid-beneficial-owners-inconsistent.json`   | Tier 2 Rule #3    | `beneficialOwnersCount=3` but `beneficialOwnersKycStatus=not_applicable`      |
| `tier2-invalid-screening-stale.json`                  | Tier 2 Rule #4    | `sanctionsScreeningLastChecked` is >90 days old (>180 days)                   |
| `tier2-invalid-high-risk-low-overall.json`            | Tier 2 Rule #9    | `pepRiskLevel=high` but `overallRiskRating=low`                               |
| `tier2-invalid-adverse-media-high-low-overall.json`   | Tier 2 Rule #10   | `adverseMediaRiskLevel=high` but `overallRiskRating=medium`                   |
| `tier2-invalid-unable-to-identify-low-risk.json`      | Tier 2 Rule #11   | `beneficialOwnersKycStatus=unable_to_identify` but `overallRiskRating=low`    |
| `tier2-invalid-sole-prop-with-beneficial-owners.json` | Tier 2 Rule #12   | Sole proprietorship has `beneficialOwnersKycStatus=all_identified_and_kycd`   |
| `tier2-invalid-expired-status-mismatch.json`          | Tier 2 Rule #8    | `credentialStatus=expired` but `expirationDate` is in future                  |
| `tier2-invalid-pep-assessment-stale.json`             | Tier 2 Rules #5-6 | PEP and adverse media assessments >180 days old (>300 days)                   |
| `tier2-invalid-tax-verification-old.json`             | Tier 2 Rule #7    | `taxIdLastVerifiedDate` is >2 years old (>2.8 years)                          |

### Valid Tests (SHOULD PASS)

These test files demonstrate proper credential structure with all conditional requirements satisfied:

| Test File                                | Scenario          | Description                                                            |
| ---------------------------------------- | ----------------- | ---------------------------------------------------------------------- |
| `valid-individual-minimal.json`          | Tier 0 Individual | Minimal self-attested individual developer, no tax ID                  |
| `valid-individual-complete.json`         | Tier 1 Individual | Complete individual with all optional fields and tax ID                |
| `valid-organization-tier1.json`          | Tier 1 LLC        | Basic verified LLC with all required organization fields               |
| `valid-organization-tier2-complete.json` | Tier 2 Corp       | Full screening with fresh dates, all tier 2 requirements met           |
| `valid-organization-tier3-complex.json`  | Tier 3 Corp       | Complex structure with enhanced due diligence, all fields populated    |
| `valid-high-risk-suspended.json`         | High-Risk Entity  | Properly handled prohibited entity (sanctions match, suspended status) |

## Validation Rules Summary

### Tier 1 Critical (10 Rules)

1. **Tax ID Chain**: `taxIdExists=true` → require `taxIdVerified`, `taxIdJurisdiction`
2. **Tax Verification Date**: `taxIdVerified=verified` → require `taxIdLastVerifiedDate`
3. **Individual Restrictions**: `entityType=individual` → prohibit organization-only fields
4. **Organization Requirements**: `entityType ∈ {corporation, LLC, ...}` → require organization fields
5. **KYB Tier Screening**: `kybTier ≥ tier_2` → require all risk screening fields
6. **Screening Dates**: Active screening → require corresponding date fields
7. **Sanctions Match Risk**: `sanctionsScreeningStatus=confirmed_match` → require `overallRiskRating ∈ {high, prohibited}`
8. **Date Ordering**: `issuanceDate < expirationDate` _(runtime check)_
9. **Update Window**: `issuanceDate ≤ lastUpdatedDate ≤ expirationDate` _(runtime check)_
10. **Prohibited Status**: `overallRiskRating=prohibited` → require `credentialStatus ∈ {revoked, suspended}`

### Tier 2 High (17 Rules)

1. **Jurisdiction Consistency**: `taxIdJurisdiction` provided → require `taxIdExists=true`
2. **Registration Entity Match**: Active registration → require organization entity type
3. **Beneficial Owners Count**: `beneficialOwnersCount > 0` → require valid `beneficialOwnersKycStatus`
4. **Sanctions Freshness**: Screening date should be ≤90 days old _(runtime check)_
5. **PEP Freshness**: Assessment date should be ≤180 days old _(runtime check)_
6. **Adverse Media Freshness**: Assessment date should be ≤180 days old _(runtime check)_
7. **Tax Verification Freshness**: Verification date should be ≤2 years old _(runtime check)_
8. **Expired Status**: `credentialStatus=expired` → `expirationDate` should be past _(runtime check)_
9. **PEP Risk Roll-up**: `pepRiskLevel=high` → require `overallRiskRating ≥ high`
10. **Adverse Media Roll-up**: `adverseMediaRiskLevel=high` → require `overallRiskRating ≥ high`
11. **Unknown Owners Risk**: `beneficialOwnersKycStatus=unable_to_identify` → require `overallRiskRating ≥ medium`
12. **Sole Proprietor Owners**: `entityType=sole_proprietorship` → `beneficialOwnersKycStatus ∈ {not_applicable, not_assessed}`
13. **Complex Structure Review**: `controlStructureComplexity=complex` → beneficial owners should be assessed _(recommendation)_
    14-17. **Date Freshness Checks**: Various runtime validations for date staleness

## Running Tests

### Using AJV (Recommended)

```bash
# Install AJV with Draft 2020-12 support
npm install -g ajv-cli ajv-formats

# Validate a single file
ajv validate -s ../../../schemas/developer/v1/developer-credential-v1.schema.json -d invalid-tax-id-missing-verification.json

# Validate all invalid tests (should fail)
for file in invalid-*.json tier2-invalid-*.json; do
  echo "Testing $file (expect: INVALID)"
  ajv validate -s ../../../schemas/developer/v1/developer-credential-v1.schema.json -d "$file" || echo "✓ Correctly rejected"
done

# Validate all valid tests (should pass)
for file in valid-*.json; do
  echo "Testing $file (expect: VALID)"
  ajv validate -s ../../../schemas/developer/v1/developer-credential-v1.schema.json -d "$file" && echo "✓ Correctly accepted"
done
```

### Using Python (jsonschema)

```python
import json
from jsonschema import validate, ValidationError, Draft202012Validator

# Load schema
with open('../../../schemas/developer/v1/developer-credential-v1.schema.json') as f:
    schema = json.load(f)

# Validate a test file
with open('invalid-tax-id-missing-verification.json') as f:
    instance = json.load(f)

try:
    Draft202012Validator(schema).validate(instance)
    print("✓ Valid")
except ValidationError as e:
    print(f"✗ Invalid: {e.message}")
```

### Using Node.js (Ajv)

```javascript
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const schema = JSON.parse(
  fs.readFileSync(
    "../../../schemas/developer/v1/developer-credential-v1.schema.json",
  ),
);
const validate = ajv.compile(schema);

const testFile = "invalid-tax-id-missing-verification.json";
const instance = JSON.parse(fs.readFileSync(testFile));

const valid = validate(instance);
if (!valid) {
  console.log(`✗ Invalid: ${ajv.errorsText(validate.errors)}`);
} else {
  console.log("✓ Valid");
}
```

## Runtime Validation

Some conditional rules require runtime validation beyond JSON Schema capabilities:

### Date Comparisons (Tier 1 Rules #8-9)

```javascript
// Rule #8: issuanceDate < expirationDate
if (new Date(credential.issuanceDate) >= new Date(credential.expirationDate)) {
  throw new ValidationError("issuanceDate must be before expirationDate");
}

// Rule #9: issuanceDate ≤ lastUpdatedDate ≤ expirationDate
const issuance = new Date(credential.issuanceDate);
const updated = new Date(credential.lastUpdatedDate);
const expiration = new Date(credential.expirationDate);

if (updated < issuance || updated > expiration) {
  throw new ValidationError(
    "lastUpdatedDate must be between issuanceDate and expirationDate",
  );
}
```

### Date Freshness (Tier 2 Rules #4-7)

```javascript
const now = new Date();
const daysOld = (dateStr) => (now - new Date(dateStr)) / (1000 * 60 * 60 * 24);

// Sanctions: ≤90 days
if (
  credential.sanctionsScreeningLastChecked &&
  daysOld(credential.sanctionsScreeningLastChecked) > 90
) {
  console.warn("Sanctions screening is stale (>90 days old)");
}

// PEP & Adverse Media: ≤180 days
if (
  credential.pepRiskLastAssessed &&
  daysOld(credential.pepRiskLastAssessed) > 180
) {
  console.warn("PEP assessment is stale (>180 days old)");
}

// Tax Verification: ≤2 years
if (
  credential.taxIdLastVerifiedDate &&
  daysOld(credential.taxIdLastVerifiedDate) > 730
) {
  console.warn("Tax ID verification is stale (>2 years old)");
}
```

## Expected Validation Results

### Tier 1 Invalid Tests

All 10 files should **FAIL** JSON Schema validation with specific error messages about missing required fields or enum mismatches.

### Tier 2 Invalid Tests

- 7 files should **FAIL** JSON Schema validation (rules expressible in schema)
- 4 files require **runtime checks** for date comparisons and should be flagged programmatically

### Valid Tests

All 6 files should **PASS** JSON Schema validation and runtime checks without errors.

## Test Coverage Matrix

| Rule Category   | Schema Validation | Runtime Validation | Test Files   |
| --------------- | ----------------- | ------------------ | ------------ |
| Tier 1 Critical | 8 rules           | 2 rules            | 10 invalid   |
| Tier 2 High     | 9 rules           | 8 rules            | 10 invalid   |
| Valid Scenarios | N/A               | N/A                | 6 valid      |
| **Total**       | **17 rules**      | **10 rules**       | **26 tests** |

## Maintenance

When updating the schema or conditional rules:

1. **Add new test files** for each new conditional rule
2. **Update this README** with the new rule description
3. **Run full test suite** to ensure no regressions
4. **Document runtime checks** if the rule requires them

## Related Documentation

- **Schema**: `../../../schemas/developer/v1/developer-credential-v1.schema.json`
- **Specification**: `../../../docs/developer-credential-v1.md`
  - Section 8: Conditional Validation Rules
  - Section 9: Assurance Metadata
- **Examples**: `../examples/developer-example-v1.md`

## License

These test files are part of the Beltic specification and follow the same license as the parent project.

---

**Last Updated**: 2025-11-21
**Schema Version**: 1.0
**Test Suite Version**: 1.0
