# DeveloperCredential v1 Examples

This directory contains example DeveloperCredentials demonstrating various entity types, KYB tiers, and validation scenarios.

## Directory Structure

```
developer/v1/
├── README.md (this file)
└── tests/
    ├── README.md (comprehensive test suite documentation)
    ├── valid-individual-minimal.json
    ├── valid-individual-complete.json
    ├── valid-organization-tier1.json
    ├── valid-organization-tier2-complete.json
    ├── valid-organization-tier3-complex.json
    ├── valid-high-risk-suspended.json
    ├── invalid-*.json (10 Tier 1 critical violations)
    └── tier2-invalid-*.json (10 Tier 2 data consistency violations)
```

## Overview

DeveloperCredential v1 examples are organized into a **comprehensive test suite** located in the `tests/` directory. This test suite includes:

- **6 Valid Examples**: Covering different entity types and KYB tiers
- **10 Tier 1 Invalid Examples**: Critical validation rule violations
- **10 Tier 2 Invalid Examples**: Data consistency issues

## Quick Links

- **Test Suite Documentation**: [tests/README.md](tests/README.md) - Complete test suite guide
- **Schema**: [developer-credential-v1.schema.json](../../schemas/developer/v1/developer-credential-v1.schema.json)
- **Schema README**: [schemas/developer/v1/README.md](../../schemas/developer/v1/README.md)
- **Full Specification**: [docs/developer-credential-v1.md](../../docs/developer-credential-v1.md)
- **Human-Readable Example**: [developer-example-v1.md](../developer-example-v1.md)

## Valid Example Scenarios

### 1. Individual Developer (Minimal) - Tier 0

**File**: `tests/valid-individual-minimal.json`

**Profile**:

- **Entity Type**: individual
- **KYB Tier**: tier_0_unverified (self-attested only)
- **Tax ID**: No
- **Screening**: None
- **Use Case**: Development/testing, low-risk agents

**Key Features**:

- No organization fields (no incorporationDate, businessRegistrationNumber, registeredAddress)
- Minimal self-attested information
- No risk screening required
- 90-day credential validity

**Template For**: Hobby developers, open-source contributors, early-stage projects

---

### 2. Individual Developer (Complete) - Tier 1

**File**: `tests/valid-individual-complete.json`

**Profile**:

- **Entity Type**: individual
- **KYB Tier**: tier_1_basic
- **Tax ID**: Yes (verified)
- **Screening**: None (not required for tier_1)
- **Use Case**: Professional individual developers, freelancers

**Key Features**:

- All optional individual fields provided
- Tax ID verified
- Business phone and security email
- Beltic-verified assurance
- 2-year credential validity

**Template For**: Professional developers, sole practitioners, consultants

---

### 3. Organization (LLC) - Tier 1

**File**: `tests/valid-organization-tier1.json`

**Profile**:

- **Entity Type**: limited_liability_company
- **KYB Tier**: tier_1_basic
- **Tax ID**: Yes (verified)
- **Screening**: None (not required for tier_1)
- **Use Case**: Small startups, early-stage companies

**Key Features**:

- All required organization fields (incorporationDate, businessRegistrationNumber, registeredAddress)
- Company registration verified
- Tax ID verified
- 2-year credential validity

**Template For**: Small LLCs, startups, small businesses

---

### 4. Organization (Corp) - Tier 2 Complete

**File**: `tests/valid-organization-tier2-complete.json`

**Profile**:

- **Entity Type**: corporation
- **KYB Tier**: tier_2_standard
- **Tax ID**: Yes (third-party verified)
- **Screening**: Full (sanctions, PEP, adverse media - all clear)
- **Beneficial Owners**: All identified and KYC'd (2 owners)
- **Use Case**: Standard production agents, moderate-risk operations

**Key Features**:

- Complete tier_2 risk screening
- Fresh screening dates (within 90 days)
- Beneficial ownership transparency
- Third-party verified assurance
- 6-month credential validity
- Low overall risk rating

**Template For**: Established companies, mid-market businesses, standard production deployments

---

### 5. Organization (Corp) - Tier 3 Complex

**File**: `tests/valid-organization-tier3-complex.json`

**Profile**:

- **Entity Type**: corporation
- **KYB Tier**: tier_3_enhanced
- **Tax ID**: Yes (third-party verified)
- **Screening**: Enhanced (sanctions, PEP medium, adverse media low)
- **Beneficial Owners**: All identified and KYC'd (5 owners, complex structure)
- **Use Case**: High-value agents, regulated industries, financial services

**Key Features**:

- Enhanced due diligence
- Complex ownership structure documented
- Medium PEP risk (acceptable with proper documentation)
- Multiple verification sources
- 2-month credential validity (frequent re-verification)
- Medium overall risk rating

**Template For**: Financial services, healthcare, regulated industries, high-value deployments

---

### 6. High-Risk Entity (Properly Handled)

**File**: `tests/valid-high-risk-suspended.json`

**Profile**:

- **Entity Type**: corporation
- **KYB Tier**: tier_3_enhanced
- **Sanctions Status**: confirmed_match
- **Overall Risk**: prohibited
- **Credential Status**: suspended
- **Use Case**: Demonstrates proper handling of high-risk entities

**Key Features**:

- Sanctions match properly flagged
- Overall risk rating: prohibited
- Credential status: suspended (not active)
- All conditional validation rules satisfied
- Example of proper risk escalation

**Template For**: Understanding how high-risk entities are handled (reference only, not for use)

## Invalid Example Categories

The test suite includes **20 invalid examples** organized by severity:

### Tier 1 Critical Violations (10 files)

Examples that MUST be rejected:

1. **Tax ID Chain**: Missing tax ID verification when tax ID exists
2. **Entity Type Mismatch**: Individual with organization fields
3. **Organization Missing Required**: LLC without registered address
4. **Tier 2 Missing Screening**: Tier 2 credential missing risk assessment
5. **Sanctions Match Low Risk**: Sanctioned entity marked as low risk
6. **Prohibited Active**: Prohibited entity with active status
7. **Screening Missing Date**: Risk level set but no assessment date
8. **Verified Without Date**: Verified tax ID without verification date
9. **Dates Reversed**: Issuance after expiration
10. **Last Updated Out of Range**: Update date before issuance

### Tier 2 Data Consistency Issues (10 files)

Examples that SHOULD trigger warnings:

1. **Jurisdiction Without Tax ID**: Tax jurisdiction provided but no tax ID
2. **Registration Entity Mismatch**: Active registration for individual
3. **Beneficial Owners Inconsistent**: Owner count >0 but status "not_applicable"
4. **Screening Stale**: Sanctions screening >90 days old
5. **High Risk Low Overall**: High PEP risk but low overall rating
6. **Adverse Media High**: High adverse media but medium overall rating
7. **Unable to Identify Low Risk**: Unknown owners but low risk
8. **Sole Prop With Beneficial Owners**: Sole proprietorship with multiple owners
9. **Expired Status Mismatch**: Expired status but future expiration date
10. **Assessment Stale**: PEP/adverse media assessments >180 days old
11. **Tax Verification Old**: Tax verification >2 years old

See [Test Suite README](tests/README.md) for complete descriptions and validation instructions.

## Using Examples as Templates

### Step 1: Choose Your Entity Type

| You Are                               | Use This Template                        |
| ------------------------------------- | ---------------------------------------- |
| Individual developer (hobby/learning) | `valid-individual-minimal.json`          |
| Professional freelancer/consultant    | `valid-individual-complete.json`         |
| Small startup/LLC                     | `valid-organization-tier1.json`          |
| Established company (standard risk)   | `valid-organization-tier2-complete.json` |
| Enterprise/regulated industry         | `valid-organization-tier3-complex.json`  |

### Step 2: Copy and Customize

```bash
# Copy template
cp tests/valid-organization-tier1.json my-developer-credential.json

# Edit with your information
# Update: legalName, entityType, jurisdiction, contact info, etc.
```

### Step 3: Update Required Fields

**For All Entity Types**:

- `schemaVersion`: Keep as "1.0"
- `legalName`: Your legal name or company name
- `entityType`: Choose from: individual, corporation, limited_liability_company, etc.
- `incorporationJurisdiction.country`: ISO 3166-1 alpha-2 code (e.g., "US", "GB")
- `businessEmail`: Your contact email
- `credentialId`: Generate new UUID v4
- `issuanceDate`: Current datetime
- `expirationDate`: Future datetime (validity period based on tier)
- `subjectDid`: Your decentralized identifier

**For Organizations Only** (not individuals):

- `incorporationDate`: Date of incorporation
- `businessRegistrationNumber`: Hashed registration number
- `registeredAddress`: Full registered address

**For Tier 2+ (Standard KYB and above)**:

- `sanctionsScreeningStatus`, `sanctionsScreeningLastChecked`
- `pepRiskLevel`, `pepRiskLastAssessed`
- `adverseMediaRiskLevel`, `adverseMediaLastAssessed`
- `overallRiskRating`

### Step 4: Add Assurance Metadata (Optional but Recommended)

```json
{
  "assuranceMetadata": {
    "globalAssuranceLevel": "beltic_verified",
    "fieldAssurances": {
      "legalName": {
        "assuranceLevel": "beltic_verified",
        "verificationDate": "2025-11-20T14:00:00Z",
        "verificationSource": "State Business Registry"
      }
    }
  }
}
```

### Step 5: Validate

```bash
# Validate your credential
ajv validate \
  -s ../../schemas/developer/v1/developer-credential-v1.schema.json \
  -d my-developer-credential.json

# Expected output: my-developer-credential.json valid
```

### Step 6: Runtime Validation

Some rules require runtime checks:

```javascript
// Check date ordering
if (new Date(cred.issuanceDate) >= new Date(cred.expirationDate)) {
  throw new Error("Issuance must be before expiration");
}

// Check screening freshness (Tier 2 Rule #4)
const daysSince = (date) =>
  (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);

if (
  cred.sanctionsScreeningLastChecked &&
  daysSince(cred.sanctionsScreeningLastChecked) > 90
) {
  console.warn("Sanctions screening is stale (>90 days)");
}
```

## Validation Quick Reference

### Validate All Examples

```bash
# Valid examples should pass
for file in tests/valid-*.json; do
  ajv validate -s ../../schemas/developer/v1/developer-credential-v1.schema.json -d "$file" \
    && echo "✓ $file" \
    || echo "✗ $file SHOULD BE VALID"
done

# Invalid examples should fail
for file in tests/invalid-*.json tests/tier2-invalid-*.json; do
  ajv validate -s ../../schemas/developer/v1/developer-credential-v1.schema.json -d "$file" \
    && echo "✗ $file SHOULD BE INVALID" \
    || echo "✓ $file correctly rejected"
done
```

### Common Validation Errors

**Individual with Organization Fields**:

```
Error: Individual entities cannot have incorporationDate
```

_Fix_: Remove organization-only fields for individuals

**Missing Screening for Tier 2+**:

```
Error: pepRiskLevel is required when kybTier is tier_2_standard or higher
```

_Fix_: Add all required screening fields

**Tax ID Chain Broken**:

```
Error: taxIdVerified is required when taxIdExists is true
```

_Fix_: Add taxIdVerified and taxIdJurisdiction fields

**Stale Screening Dates**:

```
Warning: Sanctions screening is stale (>90 days old)
```

_Fix_: Update screening dates to be within freshness windows

## Entity Type Decision Matrix

| Field                        | Individual | Sole Prop   | Corp/LLC     | Nonprofit   | Government  |
| ---------------------------- | ---------- | ----------- | ------------ | ----------- | ----------- |
| `incorporationDate`          | ❌ No      | ⚠️ Optional | ✅ Required  | ✅ Required | ⚠️ Optional |
| `businessRegistrationNumber` | ❌ No      | ⚠️ Optional | ✅ Required  | ✅ Required | ⚠️ Optional |
| `registeredAddress`          | ❌ No      | ⚠️ Optional | ✅ Required  | ✅ Required | ✅ Required |
| `beneficialOwnersKycStatus`  | ❌ N/A     | ❌ N/A      | ✅ Req (T2+) | ⚠️ Optional | ❌ N/A      |

## KYB Tier Comparison

| Tier       | Screening Required                            | Validity Period | Use Case             |
| ---------- | --------------------------------------------- | --------------- | -------------------- |
| **tier_0** | None                                          | 90 days         | Development/testing  |
| **tier_1** | Identity + registration                       | 2 years         | Low-risk production  |
| **tier_2** | + Sanctions/PEP/adverse media                 | 6-12 months     | Standard production  |
| **tier_3** | + Enhanced DD, beneficial owners              | 2-6 months      | High-risk/regulated  |
| **tier_4** | + Maximum verification, continuous monitoring | 1-3 months      | Financial/healthcare |

## Related Documentation

- **Test Suite**: [tests/README.md](tests/README.md) - Comprehensive test documentation
- **Schema**: [developer-credential-v1.schema.json](../../schemas/developer/v1/developer-credential-v1.schema.json)
- **Schema README**: [schemas/developer/v1/README.md](../../schemas/developer/v1/README.md)
- **Full Specification**: [docs/developer-credential-v1.md](../../docs/developer-credential-v1.md)
  - Section 8: Conditional Validation Rules
  - Section 9: Assurance Metadata
- **Human-Readable Example**: [developer-example-v1.md](../developer-example-v1.md)
- **Validation Guide**: [docs/validation-guide.md](../../docs/validation-guide.md)

## Support

- **Questions**: [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions)
- **Issues**: [Report a problem](https://github.com/beltic/beltic-spec/issues)
- **Contributing**: [Contributing Guide](../../docs/contributing-spec.md)

---

**Examples Version**: 1.0
**Last Updated**: 2025-11-21
**Schema Version**: developer-credential-v1.0
**Test Suite**: 26 test files (6 valid, 20 invalid)
