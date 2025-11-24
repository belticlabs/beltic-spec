# Beltic Quickstart Guide

**Get your first Beltic credential validated in 5 minutes.**

This guide walks you through creating and validating your first verifiable credential using the Beltic framework.

## What You'll Achieve

By the end of this guide, you'll have:
- ✅ Created a DeveloperCredential or AgentCredential from a template
- ✅ Customized it with your information
- ✅ Validated it against the JSON Schema
- ✅ Understood what the validation results mean

## Prerequisites

### Install a JSON Schema Validator

**Option 1: AJV CLI (JavaScript/Node.js)**
```bash
npm install -g ajv-cli ajv-formats
```

**Option 2: Python jsonschema**
```bash
pip install jsonschema
```

**Option 3: Clone this repository**
```bash
git clone https://github.com/beltic/beltic-spec.git
cd beltic-spec
```

## Step 1: Choose Your Credential Type

Beltic has two credential types:

| Credential Type | Who Needs It | Purpose |
|-----------------|--------------|---------|
| **DeveloperCredential** | Individuals or organizations creating agents | Establishes developer identity, KYC/KYB verification, risk profile |
| **AgentCredential** | AI agents | Documents agent capabilities, safety metrics, privacy practices |

**Which should you start with?**

- **Creating your first AI agent?** Start with DeveloperCredential (you need this first).
- **Already have a developer identity?** Create an AgentCredential for your agent.
- **Just exploring?** Try DeveloperCredential — it's simpler.

## Quick Start: DeveloperCredential

### Step 1: Choose a Template

Pick the template that matches your situation:

| You Are | Template File |
|---------|--------------|
| Individual developer (hobby/learning) | `examples/developer/v1/tests/valid-individual-minimal.json` |
| Professional freelancer | `examples/developer/v1/tests/valid-individual-complete.json` |
| Small startup/LLC | `examples/developer/v1/tests/valid-organization-tier1.json` |
| Established company | `examples/developer/v1/tests/valid-organization-tier2-complete.json` |

### Step 2: Copy the Template

```bash
# Example: Individual developer
cp examples/developer/v1/tests/valid-individual-minimal.json my-developer-credential.json
```

### Step 3: Customize Key Fields

Open `my-developer-credential.json` and update these fields:

```json
{
  "$schema": "../../schemas/developer/v1/developer-credential-v1.schema.json",
  "schemaVersion": "1.0",

  // 1. YOUR IDENTITY
  "legalName": "Your Name",  // ← Change this
  "entityType": "individual",  // ← individual, corporation, limited_liability_company, etc.
  "incorporationJurisdiction": {
    "country": "US"  // ← ISO 3166-1 alpha-2 code
  },

  // 2. CONTACT INFO
  "businessEmail": "you@example.com",  // ← Your email
  "website": "https://yourwebsite.com",  // ← Optional

  // 3. UNIQUE IDENTIFIERS (generate new values)
  "credentialId": "NEW-UUID-HERE",  // ← Generate: uuidgen (Mac/Linux) or online
  "subjectDid": "did:web:yourwebsite.com",  // ← Your DID

  // 4. DATES
  "issuanceDate": "2025-11-21T10:00:00Z",  // ← Current date/time (ISO 8601)
  "expirationDate": "2026-02-21T10:00:00Z",  // ← 90 days later (tier_0)
  "lastUpdatedDate": "2025-11-21T10:00:00Z",  // ← Same as issuance

  // Leave other fields as-is for now
  ...
}
```

**Quick Tips:**
- **UUIDs**: Generate with `uuidgen` (Mac/Linux) or https://www.uuidgenerator.net/
- **Dates**: Use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- **DIDs**: For testing, use `did:web:yourwebsite.com` or `did:key:...`

### Step 4: Validate

**Using AJV CLI:**
```bash
ajv validate \
  -s schemas/developer/v1/developer-credential-v1.schema.json \
  -d my-developer-credential.json
```

**Using Python:**
```python
import json
from jsonschema import validate, Draft202012Validator

# Load schema
with open('schemas/developer/v1/developer-credential-v1.schema.json') as f:
    schema = json.load(f)

# Load your credential
with open('my-developer-credential.json') as f:
    credential = json.load(f)

# Validate
try:
    Draft202012Validator(schema).validate(credential)
    print("✓ Valid DeveloperCredential!")
except Exception as e:
    print(f"✗ Validation error: {e.message}")
```

**Expected Output:**
```
my-developer-credential.json valid
```

🎉 **Success!** You've created your first validated DeveloperCredential.

---

## Quick Start: AgentCredential

### Step 1: Choose a Template

| Your Agent | Template File |
|------------|--------------|
| Low-risk agent (e-commerce support, FAQ bot) | `examples/agent/v1/valid-simple-agent.json` |
| High-risk agent (financial, healthcare, regulated) | `examples/agent/v1/valid-complex-agent.json` |

### Step 2: Copy the Template

```bash
# Example: Simple agent
cp examples/agent/v1/valid-simple-agent.json my-agent-credential.json
```

### Step 3: Customize Key Fields

Open `my-agent-credential.json` and update:

```json
{
  "$schema": "../../schemas/agent/v1/agent-credential-v1.schema.json",
  "schemaVersion": "1.0",

  // 1. AGENT IDENTITY
  "agentId": "NEW-UUID-HERE",  // ← Generate new UUID
  "agentName": "My Agent Name",  // ← Your agent's name
  "agentVersion": "1.0.0",  // ← Semantic version
  "agentDescription": "Clear description of what your agent does",  // ← Be specific

  // 2. DEVELOPER LINK
  "developerCredentialId": "YOUR-DEVELOPER-CREDENTIAL-ID",  // ← From your DeveloperCredential
  "developerCredentialVerified": false,  // ← false until Beltic verifies

  // 3. MODEL DETAILS
  "primaryModelProvider": "Anthropic",  // ← OpenAI, Anthropic, Google, etc.
  "primaryModelFamily": "Claude-3.5 Sonnet",  // ← Specific model

  // 4. SAFETY METRICS (from testing)
  "attackSuccessRate": 0.05,  // ← 0.0 to 1.0 (5% = 0.05)
  "robustnessScore": 95,  // ← 100 × (1 - ASR)
  "safetyTestsLastRun": "2025-11-21",  // ← ISO date

  // 5. PRIVACY PRACTICES
  "userDataRetentionDays": 90,  // ← How long you keep user data
  "userDataUsedForTraining": false,  // ← true or false

  // 6. OPERATIONAL STATUS
  "currentStatus": "development",  // ← development, beta, production
  "firstReleaseDate": "2025-11-21",  // ← When agent was first deployed

  // 7. CREDENTIAL METADATA
  "credentialId": "NEW-UUID-HERE",  // ← Different from agentId
  "issuanceDate": "2025-11-21T10:00:00Z",
  "expirationDate": "2026-05-21T10:00:00Z",  // ← 6 months for production agents
  "issuerDid": "did:web:beltic.com",  // ← Keep as-is (Beltic's DID)
  "credentialStatus": "active",

  ...
}
```

### Step 4: Validate

```bash
ajv validate \
  -s schemas/agent/v1/agent-credential-v1.schema.json \
  -d my-agent-credential.json
```

**Expected Output:**
```
my-agent-credential.json valid
```

🎉 **Success!** You've created your first validated AgentCredential.

---

## Understanding Validation Results

### ✅ Valid Credential

```
my-credential.json valid
```

**What this means:**
- All required fields are present
- All fields have correct data types
- All format constraints are satisfied (dates, emails, UUIDs)
- All conditional validation rules passed

**Next steps:**
1. Review [assurance levels](developer-credential-v1.md#9-assurance-metadata) (most fields start as `self_attested`)
2. Consider which fields need verification (KYC/KYB, safety testing)
3. Integrate with Beltic platform for credential signing

### ❌ Validation Errors

Common errors and how to fix them:

#### Error: Missing Required Property

```
Error: must have required property 'agentDescription'
```

**Fix:** Add the missing field to your JSON.

#### Error: Invalid Date Format

```
Error: issuanceDate must match format "date-time"
```

**Fix:** Use ISO 8601 format: `2025-11-21T10:00:00Z`

#### Error: Invalid UUID Format

```
Error: credentialId must match format "uuid"
```

**Fix:** Generate a valid UUID v4. Use `uuidgen` or an online generator.

#### Error: Value Out of Range

```
Error: attackSuccessRate must be <= 1
```

**Fix:** ASR is a ratio (0.0 to 1.0). If your attack success rate is 15%, use `0.15`.

#### Error: Invalid Enum Value

```
Error: currentStatus must be equal to one of the allowed values
```

**Fix:** Check the [schema documentation](../schemas/agent/v1/README.md) for allowed values. For `currentStatus`, use: `"development"`, `"beta"`, `"production"`, or `"deprecated"`.

#### Error: Conditional Validation Failed (DeveloperCredential)

```
Error: taxIdVerified is required when taxIdExists is true
```

**Fix:** DeveloperCredential has 27 conditional rules. See [Conditional Validation Rules](developer-credential-v1.md#8-conditional-validation-rules) for the full list.

**Common conditional rules:**
- `taxIdExists=true` → require `taxIdVerified`, `taxIdJurisdiction`
- `entityType="individual"` → **prohibit** `incorporationDate`, `businessRegistrationNumber`, `registeredAddress`
- `entityType="corporation"` → **require** `incorporationDate`, `businessRegistrationNumber`, `registeredAddress`
- `kybTier >= tier_2` → require `sanctionsScreeningStatus`, `pepRiskLevel`, `adverseMediaRiskLevel`, `overallRiskRating`

---

## Common Pitfalls

### 1. **Using the Wrong Entity Type**

❌ **Don't do this:**
```json
{
  "entityType": "individual",
  "incorporationDate": "2020-01-01"  // ← Error: individuals can't have incorporation dates
}
```

✅ **Do this:**
```json
{
  "entityType": "corporation",  // ← Organizations need incorporation dates
  "incorporationDate": "2020-01-01",
  "businessRegistrationNumber": "hash_abc123",
  "registeredAddress": { ... }
}
```

### 2. **Incomplete Tax ID Chain**

❌ **Don't do this:**
```json
{
  "taxIdExists": true
  // Missing: taxIdVerified, taxIdJurisdiction
}
```

✅ **Do this:**
```json
{
  "taxIdExists": true,
  "taxIdVerified": "verified",
  "taxIdJurisdiction": { "country": "US" },
  "taxIdLastVerifiedDate": "2025-10-01"
}
```

### 3. **Wrong ASR / Robustness Score**

❌ **Don't do this:**
```json
{
  "attackSuccessRate": 15,  // ← Should be 0.15 (ratio, not percentage)
  "robustnessScore": 0.85   // ← Should be 85 (percentage, not ratio)
}
```

✅ **Do this:**
```json
{
  "attackSuccessRate": 0.15,  // ← 15% as a ratio
  "robustnessScore": 85        // ← 85% as a whole number
}
```

**Formula:** `robustnessScore = 100 × (1 - attackSuccessRate)`

### 4. **Date Ordering**

❌ **Don't do this:**
```json
{
  "issuanceDate": "2025-11-21T10:00:00Z",
  "expirationDate": "2025-10-21T10:00:00Z"  // ← Expires before issuance!
}
```

✅ **Do this:**
```json
{
  "issuanceDate": "2025-11-21T10:00:00Z",
  "expirationDate": "2026-11-21T10:00:00Z"  // ← Expires after issuance
}
```

**Runtime check:** Some validators won't catch this. Always verify `issuanceDate < expirationDate` in your application.

### 5. **Tier 2+ KYB Without Screening**

❌ **Don't do this:**
```json
{
  "kybTier": "tier_2_standard"
  // Missing: sanctionsScreeningStatus, pepRiskLevel, adverseMediaRiskLevel, overallRiskRating
}
```

✅ **Do this:**
```json
{
  "kybTier": "tier_2_standard",
  "sanctionsScreeningStatus": "clear",
  "sanctionsScreeningLastChecked": "2025-11-15",
  "pepRiskLevel": "none",
  "pepRiskLastAssessed": "2025-11-15",
  "adverseMediaRiskLevel": "low",
  "adverseMediaLastAssessed": "2025-11-15",
  "overallRiskRating": "low"
}
```

---

## Next Steps

### 1. Understand Assurance Levels

Most fields in your credential start as **self-attested**. To increase trust:

- **Beltic-verified**: Submit your credential to Beltic for verification (KYC/KYB, domain ownership, safety testing)
- **Third-party-verified**: Integrate with KYC providers (Persona, Onfido) or safety evaluation vendors

See [Assurance Metadata](developer-credential-v1.md#9-assurance-metadata) for details.

### 2. Deep Dive: Conditional Validation

DeveloperCredential has **27 conditional validation rules** that enforce complex business logic:

- **Tier 1 Critical (10 rules)**: MUST pass for valid credentials
- **Tier 2 High (17 rules)**: SHOULD pass for data consistency

Read the full guide: [Conditional Validation Rules](developer-credential-v1.md#8-conditional-validation-rules)

Test your understanding with: [Test Suite](../examples/developer/v1/tests/README.md) (26 test cases)

### 3. Integrate with Your Application

**Merchants/Platforms:**
- Read the [Integration Guide](integration-guide.md) to verify credentials in your application
- Implement policy checks (e.g., "only allow agents with ASR ≤ 0.10 and developer KYB tier ≥ tier_2")

**Developers:**
- Automate credential generation in your CI/CD pipeline
- Use validation scripts: [Validation Guide](validation-guide.md)

### 4. Explore Advanced Features

**AgentCredential:**
- [Safety Metrics](evaluation-metrics-v1.md): How to measure ASR, Robustness Score, Privacy Leakage Score
- [NIST AI RMF Mapping](nist-mapping-v1.md): How Beltic aligns with AI Risk Management Framework
- [Tool Risk Categories](agent-credential-v1.md#tools-and-actions): Declaring tools and their risk levels

**DeveloperCredential:**
- [Entity Type Matrix](../examples/developer/v1/README.md#entity-type-decision-matrix): Required fields per entity type
- [KYB Tier Comparison](../examples/developer/v1/README.md#kyb-tier-comparison): Choosing the right verification level
- [Runtime Validation](../schemas/developer/v1/README.md#runtime-validation): Date freshness checks beyond JSON Schema

### 5. Production Checklist

Before deploying to production:

- [ ] All required fields filled with real data (no placeholders)
- [ ] Valid UUIDs generated for all ID fields
- [ ] Dates in ISO 8601 format and properly ordered
- [ ] Conditional validation rules satisfied
- [ ] Safety metrics from actual testing (for AgentCredential)
- [ ] KYC/KYB completed (for production credentials)
- [ ] Credential signed by Beltic or your own DID infrastructure
- [ ] Revocation endpoint configured
- [ ] Monitoring and renewal process in place

---

## Resources

### Documentation
- [Beltic Overview](overview.md) - Framework introduction
- [DeveloperCredential Spec](developer-credential-v1.md) - Complete field reference
- [AgentCredential Spec](agent-credential-v1.md) - Complete field reference
- [Validation Guide](validation-guide.md) - Comprehensive validation instructions
- [Integration Guide](integration-guide.md) - For merchants and platforms

### Examples
- [Agent Examples](../examples/agent/v1/) - Simple and complex agents
- [Developer Examples](../examples/developer/v1/) - Individuals and organizations
- [Test Suite](../examples/developer/v1/tests/) - 26 validation test cases

### Schemas
- [Schema Registry](../schemas/README.md) - All schemas and versions
- [Agent Schema v1](../schemas/agent/v1/README.md) - Version-specific docs
- [Developer Schema v1](../schemas/developer/v1/README.md) - Version-specific docs

### Community
- [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions) - Ask questions
- [GitHub Issues](https://github.com/beltic/beltic-spec/issues) - Report problems
- [Contributing Guide](contributing-spec.md) - Propose changes

---

## Troubleshooting

**Problem: Validator not found**
```bash
# Install AJV
npm install -g ajv-cli ajv-formats

# Or install Python jsonschema
pip install jsonschema
```

**Problem: Schema file not found**
```bash
# Make sure you're in the beltic-spec directory
cd /path/to/beltic-spec

# Verify the schema exists
ls schemas/agent/v1/agent-credential-v1.schema.json
```

**Problem: "Cannot read property" errors**
- **Cause:** Malformed JSON (missing comma, bracket, etc.)
- **Fix:** Use a JSON linter like https://jsonlint.com/ or your editor's JSON validation

**Problem: Too many validation errors**
- **Start fresh:** Copy a working example again and make minimal changes
- **Validate incrementally:** Change one field, validate, repeat

**Problem: Validation passes but credential seems wrong**
- **Check runtime rules:** Some rules (date ordering, screening freshness) require application-level checks
- **Review conditional rules:** Read [Section 8](developer-credential-v1.md#8-conditional-validation-rules) carefully

**Still stuck?**
- Check [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions)
- Review [examples](../examples/) for similar use cases
- Consult the [Validation Guide](validation-guide.md) for detailed troubleshooting

---

**Quickstart Version**: 1.0
**Last Updated**: 2025-11-21
**Maintained by**: [Beltic](https://beltic.com)
**License**: [Apache 2.0](../LICENSE)
