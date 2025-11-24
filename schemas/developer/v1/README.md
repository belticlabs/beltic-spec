# DeveloperCredential v1 Schema

**Schema ID**: `https://schema.beltic.com/developer/v1/developer-credential-v1.schema.json`

**Version**: 1.0

**Status**: Stable

**Last Updated**: 2025-11-21

## Overview

The DeveloperCredential v1 schema defines the structure for verifiable credentials that establish the identity and legitimacy of developers or organizations creating AI agents. This credential serves as the root of trust for all AgentCredentials issued by the entity.

## Purpose

DeveloperCredential v1 enables:

- **Identity Verification**: Establish legal identity of developers/organizations
- **KYC/KYB**: Know Your Customer / Know Your Business verification at multiple tiers
- **Risk Screening**: Sanctions, PEP, and adverse media assessment
- **Ownership Transparency**: Beneficial ownership disclosure for organizations
- **Trust Foundation**: Link agents back to verified, legitimate developers

## Key Features

### 1. Conditional Validation (27 Rules)

Unlike many schemas, DeveloperCredential v1 includes **sophisticated conditional logic**:

- **Tier 1 Critical (10 rules)**: MUST be satisfied for valid credentials
  - Tax ID verification chains
  - Entity-type-specific requirements
  - KYB tier screening mandates
  - Risk rating consistency
  - Date ordering constraints

- **Tier 2 High (17 rules)**: SHOULD be satisfied for data consistency
  - Field interdependencies
  - Date freshness requirements
  - Risk roll-up logic
  - Beneficial owner count consistency

See [Conditional Validation Summary](#conditional-validation-summary) below.

### 2. Assurance Metadata

Tracks **verification level** for each field:

- `self_attested`: Claimed by subject without verification
- `beltic_verified`: Verified by Beltic through direct checks
- `third_party_verified`: Verified by external KYC/KYB provider

Example:
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

### 3. Entity-Type-Specific Requirements

Different requirements based on entity type:

| Entity Type | Required Fields | Optional | Not Applicable |
|-------------|----------------|----------|----------------|
| **individual** | legalName, businessEmail | All optional | incorporationDate, businessRegistrationNumber, registeredAddress, beneficialOwnersKycStatus |
| **corporation** | + incorporationDate, businessRegistrationNumber, registeredAddress | All optional | None |
| **sole_proprietorship** | Similar to individual | incorporationDate, registeredAddress optional | beneficialOwnersKycStatus |
| **LLC / partnership / nonprofit / govt** | Same as corporation | All optional | None |

### 4. KYB Tier System

Progressive verification levels (tier_0 to tier_4):

| Tier | Requirements | Use Case |
|------|-------------|----------|
| **tier_0** | Self-attested only | Development/testing |
| **tier_1** | Basic identity + business registration | Low-risk agents |
| **tier_2** | + Sanctions/PEP/adverse media screening | Standard production agents |
| **tier_3** | + Enhanced due diligence, beneficial owners | High-value/regulated agents |
| **tier_4** | + Maximum verification, ongoing monitoring | Financial/healthcare agents |

## Schema Structure (35 Fields)

### 1. Core Identity (6 fields)
- `legalName`, `entityType`, `incorporationJurisdiction`
- `incorporationDate`, `businessRegistrationNumber`, `businessRegistrationStatus`

### 2. Contact Information (5 fields)
- `website`, `registeredAddress`, `businessEmail`
- `businessPhone`, `securityEmail`

### 3. Tax & Registration (4 fields)
- `taxIdExists`, `taxIdVerified`, `taxIdJurisdiction`, `taxIdLastVerifiedDate`

### 4. Risk & Compliance (9 fields)
- `kybTier`, `sanctionsScreeningStatus`, `sanctionsScreeningLastChecked`
- `pepRiskLevel`, `pepRiskLastAssessed`
- `adverseMediaRiskLevel`, `adverseMediaLastAssessed`
- `overallRiskRating`

### 5. Ownership & Control (3 fields)
- `beneficialOwnersKycStatus`, `beneficialOwnersCount`, `controlStructureComplexity`

### 6. Verification Metadata (8 fields)
- `credentialId`, `issuanceDate`, `expirationDate`
- `issuerDid`, `verificationMethod`, `credentialStatus`
- `revocationListUrl`, `lastUpdatedDate`

### 7. Cryptographic Identity (3 fields)
- `subjectDid`, `publicKey`, `proof`

### 8. Assurance Metadata (Optional)
- `assuranceMetadata` with `globalAssuranceLevel` and `fieldAssurances`

## Conditional Validation Summary

### Tier 1 Critical Rules (MUST Pass)

1. **Tax ID Chain**: `taxIdExists=true` → require `taxIdVerified`, `taxIdJurisdiction`
2. **Tax Verification Date**: `taxIdVerified="verified"` → require `taxIdLastVerifiedDate`
3. **Individual Restrictions**: `entityType="individual"` → prohibit organization fields
4. **Organization Requirements**: Organization types → require `incorporationDate`, `businessRegistrationNumber`, `registeredAddress`
5. **KYB Screening**: `kybTier ≥ tier_2` → require `sanctionsScreeningStatus`, `pepRiskLevel`, `adverseMediaRiskLevel`, `overallRiskRating`
6. **Screening Dates**: Active screening → require corresponding date fields
7. **Sanctions Match Risk**: `sanctionsScreeningStatus="confirmed_match"` → require `overallRiskRating ∈ {high, prohibited}`
8. **Date Ordering**: `issuanceDate < expirationDate` *(runtime check)*
9. **Update Window**: `issuanceDate ≤ lastUpdatedDate ≤ expirationDate` *(runtime check)*
10. **Prohibited Status**: `overallRiskRating="prohibited"` → require `credentialStatus ∈ {revoked, suspended}`

### Tier 2 High Rules (SHOULD Pass)

1. **Jurisdiction Consistency**: `taxIdJurisdiction` provided → require `taxIdExists=true`
2. **Registration Entity Match**: Active registration → organization entity type
3. **Beneficial Owners**: `beneficialOwnersCount > 0` → valid `beneficialOwnersKycStatus`
4-7. **Date Freshness**: Sanctions ≤90 days, PEP/adverse media ≤180 days, tax ≤2 years
8. **Expired Status**: `credentialStatus="expired"` → `expirationDate` in past
9-10. **Risk Roll-up**: High component risks → high overall rating
11. **Unknown Owners Risk**: Unable to identify owners → medium+ risk
12. **Sole Proprietor**: Sole proprietorship → `beneficialOwnersKycStatus="not_applicable"`
13. **Complex Structure**: Complex ownership → assess beneficial owners

See [Full Conditional Validation Rules](../../../docs/developer-credential-v1.md#8-conditional-validation-rules) for details.

## Common Validation Scenarios

### Scenario 1: Individual Developer (Minimal)

```json
{
  "$schema": "../../../schemas/developer/v1/developer-credential-v1.schema.json",
  "schemaVersion": "1.0",
  "legalName": "Alice Developer",
  "entityType": "individual",
  "incorporationJurisdiction": { "country": "US" },
  "businessRegistrationStatus": "not_applicable",
  "website": "https://alice.dev",
  "businessEmail": "alice@alice.dev",
  "taxIdExists": false,
  "kybTier": "tier_0_unverified",
  "sanctionsScreeningStatus": "not_screened",
  "overallRiskRating": "not_assessed",
  ... (credential metadata)
}
```

✅ **Valid**: No organization fields, tier_0 requires no screening

### Scenario 2: LLC with Standard KYB (Tier 2)

```json
{
  "$schema": "../../../schemas/developer/v1/developer-credential-v1.schema.json",
  "schemaVersion": "1.0",
  "legalName": "Acme AI Solutions LLC",
  "entityType": "limited_liability_company",
  "incorporationJurisdiction": { "country": "US", "region": "DE" },
  "incorporationDate": "2022-06-15",
  "businessRegistrationNumber": "hash_acme2022",
  "businessRegistrationStatus": "active_good_standing",
  "registeredAddress": {
    "streetAddress": "123 Main St",
    "city": "Wilmington",
    "region": "DE",
    "postalCode": "19801",
    "country": "US"
  },
  "businessEmail": "legal@acme.ai",
  "taxIdExists": true,
  "taxIdVerified": "verified",
  "taxIdJurisdiction": { "country": "US" },
  "taxIdLastVerifiedDate": "2025-10-01",
  "kybTier": "tier_2_standard",
  "sanctionsScreeningStatus": "clear",
  "sanctionsScreeningLastChecked": "2025-11-15",
  "pepRiskLevel": "none",
  "pepRiskLastAssessed": "2025-11-15",
  "adverseMediaRiskLevel": "low",
  "adverseMediaLastAssessed": "2025-11-15",
  "overallRiskRating": "low",
  ... (credential metadata)
}
```

✅ **Valid**: All organization fields present, tier_2 screening complete, dates fresh

### Common Validation Errors

**Individual with Organization Fields**:
```
Error: Individual entities cannot have incorporationDate
```
*Solution*: Remove `incorporationDate`, `businessRegistrationNumber`, `registeredAddress` for `entityType="individual"`

**Tax ID Without Verification**:
```
Error: taxIdVerified is required when taxIdExists is true
```
*Solution*: Add `taxIdVerified` field with value: `"verified"`, `"not_verified"`, `"verification_pending"`, `"verification_failed"`, or `"not_applicable"`

**Tier 2 Missing Screening**:
```
Error: pepRiskLevel is required when kybTier is tier_2_standard or higher
```
*Solution*: Add all screening fields: `sanctionsScreeningStatus`, `pepRiskLevel`, `adverseMediaRiskLevel`, `overallRiskRating`

**Sanctions Match with Low Risk**:
```
Error: overallRiskRating must be 'high' or 'prohibited' when sanctionsScreeningStatus is 'confirmed_match'
```
*Solution*: Update `overallRiskRating` to reflect the sanctions match severity

## Example Usage

### Validate with AJV (JavaScript)

```javascript
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('developer-credential-v1.schema.json'));
const validate = ajv.compile(schema);

const credential = JSON.parse(fs.readFileSync('../../examples/developer/v1/tests/valid-individual-minimal.json'));

if (validate(credential)) {
  console.log("✓ Valid DeveloperCredential");
} else {
  console.error("✗ Validation errors:", ajv.errorsText(validate.errors));
}
```

### Runtime Validation (Date Checks)

Some conditional rules require runtime checks beyond JSON Schema:

```javascript
// Rule #8: issuanceDate < expirationDate
if (new Date(cred.issuanceDate) >= new Date(cred.expirationDate)) {
  throw new Error("issuanceDate must be before expirationDate");
}

// Rule #9: lastUpdatedDate between issuance and expiration
const issuance = new Date(cred.issuanceDate);
const updated = new Date(cred.lastUpdatedDate);
const expiration = new Date(cred.expirationDate);

if (updated < issuance || updated > expiration) {
  throw new Error("lastUpdatedDate must be between issuanceDate and expirationDate");
}

// Tier 2 Rule #4: Sanctions freshness (≤90 days)
const daysOld = (dateStr) => (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);

if (cred.sanctionsScreeningLastChecked && daysOld(cred.sanctionsScreeningLastChecked) > 90) {
  console.warn("Warning: Sanctions screening is stale (>90 days old)");
}
```

## Test Suite

The DeveloperCredential v1 schema includes a **comprehensive test suite** with 26 test files:

- **10 Tier 1 Invalid Tests**: Critical rule violations (must reject)
- **10 Tier 2 Invalid Tests**: Data consistency issues (should warn)
- **6 Valid Tests**: Proper credentials covering all scenarios

Location: [`examples/developer/v1/tests/`](../../../examples/developer/v1/tests/)

Documentation: [`tests/README.md`](../../../examples/developer/v1/tests/README.md)

**Run All Tests**:
```bash
# Using AJV
for file in examples/developer/v1/tests/invalid-*.json; do
  ajv validate -s schemas/developer/v1/developer-credential-v1.schema.json -d "$file" \
    && echo "ERROR: $file should be invalid!" \
    || echo "✓ $file correctly rejected"
done

# Valid tests should pass
for file in examples/developer/v1/tests/valid-*.json; do
  ajv validate -s schemas/developer/v1/developer-credential-v1.schema.json -d "$file" \
    && echo "✓ $file correctly accepted" \
    || echo "ERROR: $file should be valid!"
done
```

## Entity Type Decision Matrix

| Field | individual | sole_proprietorship | corporation/LLC/partnership | nonprofit | government |
|-------|-----------|---------------------|---------------------------|-----------|------------|
| `incorporationDate` | ❌ NOT ALLOWED | ⚠️ Optional | ✅ Required | ✅ Required | ⚠️ Optional |
| `businessRegistrationNumber` | ❌ NOT ALLOWED | ⚠️ Optional | ✅ Required | ✅ Required | ⚠️ Optional |
| `registeredAddress` | ❌ NOT ALLOWED | ⚠️ Optional | ✅ Required | ✅ Required | ✅ Required |
| `beneficialOwnersKycStatus` | ❌ NOT APPLICABLE | ❌ NOT APPLICABLE | ✅ Required (tier_2+) | ⚠️ Optional | ❌ NOT APPLICABLE |
| `taxIdExists` | ⚠️ Typically false | ⚠️ May be true | ✅ Typically true | ⚠️ May be false (exempt) | ⚠️ Varies |

## Assurance Requirements by Field

Fields that **cannot be self-attested** for production credentials:

- `businessRegistrationNumber`
- `businessRegistrationStatus`
- `taxIdVerified` (if "verified")
- All risk screening fields (`sanctionsScreeningStatus`, `pepRiskLevel`, `adverseMediaRiskLevel`)
- `overallRiskRating`
- `beneficialOwnersKycStatus` (tier_2+)

See [Full Assurance Requirements](../../../docs/developer-credential-v1.md#9-assurance-metadata) for details.

## Migration & Compatibility

### Creating Your First DeveloperCredential

1. **Determine Entity Type**: Individual vs organization
2. **Choose KYB Tier**: Start with tier_0 or tier_1 for development
3. **Start with Example**: Copy the appropriate [example](../../../examples/developer/v1/tests/)
4. **Fill Required Fields**: Based on entity type and KYB tier
5. **Add Assurance Metadata**: Document verification levels
6. **Validate**: Run schema validation + runtime checks
7. **Test**: Use test suite as validation reference

### Future v1.x Versions

Minor updates will be backward-compatible:
- New fields will be optional
- Conditional rules may become stricter (warnings → errors)
- Assurance requirements may increase for higher tiers

## Related Documentation

- **Full Specification**: [developer-credential-v1.md](../../../docs/developer-credential-v1.md) - Complete 65KB specification
  - Section 8: Conditional Validation Rules
  - Section 9: Assurance Metadata
- **Test Suite**: [tests/README.md](../../../examples/developer/v1/tests/README.md) - 26 test files with documentation
- **Examples**: [Developer Examples](../../../examples/developer/v1/) - Individual and organization examples
- **Human-Readable Example**: [developer-example-v1.md](../../../examples/developer-example-v1.md) - Conceptual overview
- **Validation Guide**: [validation-guide.md](../../../docs/validation-guide.md) - Complete validation instructions

## Support

- **Schema Issues**: [Report a bug](https://github.com/beltic/beltic-spec/issues)
- **Questions**: [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions)
- **Contributing**: [Contributing Guide](../../../docs/contributing-spec.md)

---

**Schema Version**: 1.0
**Maintained by**: [Beltic](https://beltic.com)
**License**: [Apache 2.0](../../../LICENSE)
