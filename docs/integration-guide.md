# Beltic Integration Guide

**Complete guide for merchants, platforms, and organizations integrating Beltic credential verification.**

This guide shows you how to verify Beltic credentials, enforce access policies, and make trust decisions based on agent safety metrics and developer KYC/KYB status.

## Table of Contents

1. [Who This Guide Is For](#who-this-guide-is-for)
2. [Verification Workflow](#verification-workflow)
3. [Understanding Credentials](#understanding-credentials)
4. [Basic Verification](#basic-verification)
5. [Policy Enforcement](#policy-enforcement)
6. [Risk-Based Access Control](#risk-based-access-control)
7. [Assurance Levels](#assurance-levels)
8. [Security Considerations](#security-considerations)
9. [Production Checklist](#production-checklist)
10. [Common Integration Scenarios](#common-integration-scenarios)

---

## Who This Guide Is For

### Merchants & E-commerce Platforms

**Use Case:** Allow AI agents to act on behalf of users in your platform (e.g., process returns, book services, make purchases).

**What You'll Learn:**

- How to verify agent identity and safety metrics
- How to set risk thresholds (e.g., only allow agents with ASR ≤ 0.10)
- How to verify developer KYC/KYB before granting agent access

---

### API Platforms & SaaS Providers

**Use Case:** Control which agents can access your APIs and what they can do.

**What You'll Learn:**

- Policy-based access control (different tiers for different agent risk levels)
- Rate limiting based on agent robustness scores
- Tool permission mapping (restrict high-risk tools for low-assurance agents)

---

### Agent Marketplaces

**Use Case:** List agents with transparency about their safety, privacy, and developer legitimacy.

**What You'll Learn:**

- How to display agent safety metrics to users
- How to filter/sort agents by risk rating
- How to verify developer credentials before listing agents

---

### Regulators & Auditors

**Use Case:** Audit AI agent deployments for compliance.

**What You'll Learn:**

- How to interpret assurance metadata
- How to verify NIST AI RMF alignment
- How to check KYC/KYB compliance

---

## Verification Workflow

### High-Level Flow

```
┌──────────────┐
│ Agent Requests│
│  Access       │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Agent Presents       │
│ AgentCredential      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐     ┌──────────────────┐
│ Verify Credential    │────▶│ Check Signature  │
│ Structure & Schema   │     │ (future: DIDs)   │
└──────┬───────────────┘     └──────────────────┘
       │
       ▼
┌──────────────────────┐
│ Fetch Developer      │
│ Credential (by ID)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Apply Access Policy  │
│ - Check ASR          │
│ - Check KYB tier     │
│ - Check assurance    │
│ - Check expiration   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Grant/Deny Access    │
│ with Permissions     │
└──────────────────────┘
```

### Key Steps

1. **Agent presents credentials**: AgentCredential (and optionally DeveloperCredential reference)
2. **Validate structure**: Check JSON Schema compliance
3. **Verify signature** (future): Check cryptographic proof and revocation status
4. **Fetch developer info**: Get DeveloperCredential using `developerCredentialId`
5. **Check expiration**: Ensure credentials are not expired
6. **Evaluate against policy**: Apply your risk thresholds
7. **Grant access**: Provide appropriate permissions based on risk level

---

## Understanding Credentials

### AgentCredential

Documents the agent itself:

- **Identity**: name, version, description
- **Technical profile**: model, capabilities, tools
- **Safety metrics**: Attack Success Rate (ASR), Robustness Score
- **Privacy practices**: data retention, PII handling
- **Operations**: rate limits, SLA, deployment environment

**Key fields for access control:**

- `attackSuccessRate` (0.0-1.0): Lower is better (0.05 = 5% attack success)
- `robustnessScore` (0-100): Higher is better (95 = 95% defense rate)
- `currentStatus`: `development`, `beta`, `production`, `deprecated`
- `developerCredentialId`: Link to developer's identity
- `developerCredentialVerified`: Has Beltic verified the link?

### DeveloperCredential

Documents the developer/organization:

- **Identity**: Legal name, entity type, jurisdiction
- **KYC/KYB**: Tax ID verification, business registration
- **Risk assessment**: Sanctions, PEP, adverse media screening
- **Ownership**: Beneficial owner disclosure
- **Assurance**: Verification levels for each field

**Key fields for access control:**

- `kybTier`: `tier_0_unverified` to `tier_4_maximum_verification`
- `sanctionsScreeningStatus`: `clear`, `potential_match`, `confirmed_match`, `not_screened`
- `overallRiskRating`: `not_assessed`, `low`, `medium`, `high`, `prohibited`
- `credentialStatus`: `active`, `suspended`, `revoked`, `expired`

---

## Basic Verification

### Step 1: Validate JSON Schema

**JavaScript (Node.js):**

```javascript
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

class CredentialVerifier {
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);

    // Load schemas
    const agentSchema = JSON.parse(
      fs.readFileSync("schemas/agent/v1/agent-credential-v1.schema.json"),
    );
    const developerSchema = JSON.parse(
      fs.readFileSync(
        "schemas/developer/v1/developer-credential-v1.schema.json",
      ),
    );

    this.validateAgent = this.ajv.compile(agentSchema);
    this.validateDeveloper = this.ajv.compile(developerSchema);
  }

  verifyAgentCredential(credential) {
    // Schema validation
    if (!this.validateAgent(credential)) {
      return {
        valid: false,
        reason: "schema_invalid",
        errors: this.validateAgent.errors,
      };
    }

    // Expiration check
    if (new Date(credential.expirationDate) < new Date()) {
      return {
        valid: false,
        reason: "expired",
        expirationDate: credential.expirationDate,
      };
    }

    // Status check
    if (credential.credentialStatus !== "active") {
      return {
        valid: false,
        reason: "not_active",
        status: credential.credentialStatus,
      };
    }

    return { valid: true };
  }

  verifyDeveloperCredential(credential) {
    // Schema validation
    if (!this.validateDeveloper(credential)) {
      return {
        valid: false,
        reason: "schema_invalid",
        errors: this.validateDeveloper.errors,
      };
    }

    // Expiration check
    if (new Date(credential.expirationDate) < new Date()) {
      return {
        valid: false,
        reason: "expired",
        expirationDate: credential.expirationDate,
      };
    }

    // Status check
    if (credential.credentialStatus === "revoked") {
      return {
        valid: false,
        reason: "revoked",
      };
    }

    // Risk check
    if (credential.overallRiskRating === "prohibited") {
      return {
        valid: false,
        reason: "prohibited_risk",
      };
    }

    return { valid: true };
  }
}

module.exports = CredentialVerifier;
```

**Python:**

```python
import json
from jsonschema import Draft202012Validator, ValidationError
from datetime import datetime

class CredentialVerifier:
    def __init__(self):
        # Load schemas
        with open('schemas/agent/v1/agent-credential-v1.schema.json') as f:
            agent_schema = json.load(f)
        with open('schemas/developer/v1/developer-credential-v1.schema.json') as f:
            developer_schema = json.load(f)

        self.agent_validator = Draft202012Validator(agent_schema)
        self.developer_validator = Draft202012Validator(developer_schema)

    def verify_agent_credential(self, credential):
        # Schema validation
        errors = list(self.agent_validator.iter_errors(credential))
        if errors:
            return {
                'valid': False,
                'reason': 'schema_invalid',
                'errors': [e.message for e in errors]
            }

        # Expiration check
        expiration = datetime.fromisoformat(
            credential['expirationDate'].replace('Z', '+00:00')
        )
        if expiration < datetime.now(expiration.tzinfo):
            return {
                'valid': False,
                'reason': 'expired',
                'expiration_date': credential['expirationDate']
            }

        # Status check
        if credential['credentialStatus'] != 'active':
            return {
                'valid': False,
                'reason': 'not_active',
                'status': credential['credentialStatus']
            }

        return {'valid': True}

    def verify_developer_credential(self, credential):
        # (Similar to agent verification)
        return {'valid': True}
```

### Step 2: Check Revocation (Future)

When Beltic implements revocation lists:

```javascript
async function checkRevocationStatus(credential) {
  if (!credential.revocationListUrl) {
    return { revoked: false };
  }

  try {
    const response = await fetch(credential.revocationListUrl);
    const revocationList = await response.json();

    const isRevoked = revocationList.revokedCredentials.includes(
      credential.credentialId,
    );

    return {
      revoked: isRevoked,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    // Fail open or closed based on your policy
    return {
      revoked: false, // or true for fail-closed
      error: error.message,
    };
  }
}
```

---

## Policy Enforcement

### Define Access Policies

Create policies based on your risk tolerance:

```javascript
// policy.js
const AccessPolicy = {
  // Tier 1: Development/Testing (unrestricted)
  DEVELOPMENT: {
    minRobustnessScore: 0,
    maxAttackSuccessRate: 1.0,
    minKybTier: "tier_0_unverified",
    allowedAgentStatus: ["development", "beta", "production"],
    allowedDeveloperStatus: ["active", "suspended"],
    requireDeveloperVerified: false,
    allowedAssuranceLevels: [
      "self_attested",
      "beltic_verified",
      "third_party_verified",
    ],
  },

  // Tier 2: Low-Risk Production (FAQ bots, content generation)
  LOW_RISK_PRODUCTION: {
    minRobustnessScore: 80, // 80% defense rate
    maxAttackSuccessRate: 0.2, // 20% attack success
    minKybTier: "tier_1_basic",
    allowedAgentStatus: ["production"],
    allowedDeveloperStatus: ["active"],
    requireDeveloperVerified: true,
    allowedAssuranceLevels: ["beltic_verified", "third_party_verified"],
    allowSanctionsStatus: ["clear", "not_screened"],
  },

  // Tier 3: Medium-Risk Production (CRM editing, data updates)
  MEDIUM_RISK_PRODUCTION: {
    minRobustnessScore: 90, // 90% defense rate
    maxAttackSuccessRate: 0.1, // 10% attack success
    minKybTier: "tier_2_standard",
    allowedAgentStatus: ["production"],
    allowedDeveloperStatus: ["active"],
    requireDeveloperVerified: true,
    allowedAssuranceLevels: ["beltic_verified", "third_party_verified"],
    allowSanctionsStatus: ["clear"],
    maxOverallRisk: "low",
  },

  // Tier 4: High-Risk Production (financial transactions, PII access)
  HIGH_RISK_PRODUCTION: {
    minRobustnessScore: 95, // 95% defense rate
    maxAttackSuccessRate: 0.05, // 5% attack success
    minKybTier: "tier_3_enhanced",
    allowedAgentStatus: ["production"],
    allowedDeveloperStatus: ["active"],
    requireDeveloperVerified: true,
    allowedAssuranceLevels: ["third_party_verified"],
    allowSanctionsStatus: ["clear"],
    maxOverallRisk: "low",
    requireScreeningFreshness: 90, // days
    requirePiiProtection: true,
  },
};

module.exports = AccessPolicy;
```

### Enforce Policies

```javascript
// policy-enforcer.js
const AccessPolicy = require("./policy");

class PolicyEnforcer {
  constructor(verifier) {
    this.verifier = verifier;
  }

  async enforcePolicy(agentCredential, developerCredential, policyLevel) {
    const policy = AccessPolicy[policyLevel];

    if (!policy) {
      throw new Error(`Unknown policy level: ${policyLevel}`);
    }

    // Verify credentials are structurally valid
    const agentVerification =
      this.verifier.verifyAgentCredential(agentCredential);
    if (!agentVerification.valid) {
      return {
        allowed: false,
        reason: `Agent credential invalid: ${agentVerification.reason}`,
        details: agentVerification,
      };
    }

    const developerVerification =
      this.verifier.verifyDeveloperCredential(developerCredential);
    if (!developerVerification.valid) {
      return {
        allowed: false,
        reason: `Developer credential invalid: ${developerVerification.reason}`,
        details: developerVerification,
      };
    }

    // Check agent safety metrics
    if (agentCredential.robustnessScore < policy.minRobustnessScore) {
      return {
        allowed: false,
        reason: "insufficient_robustness",
        required: policy.minRobustnessScore,
        actual: agentCredential.robustnessScore,
      };
    }

    if (agentCredential.attackSuccessRate > policy.maxAttackSuccessRate) {
      return {
        allowed: false,
        reason: "attack_success_rate_too_high",
        required: `<= ${policy.maxAttackSuccessRate}`,
        actual: agentCredential.attackSuccessRate,
      };
    }

    // Check agent status
    if (!policy.allowedAgentStatus.includes(agentCredential.currentStatus)) {
      return {
        allowed: false,
        reason: "agent_status_not_allowed",
        required: policy.allowedAgentStatus,
        actual: agentCredential.currentStatus,
      };
    }

    // Check developer KYB tier
    if (this.compareTiers(developerCredential.kybTier, policy.minKybTier) < 0) {
      return {
        allowed: false,
        reason: "insufficient_kyb_tier",
        required: policy.minKybTier,
        actual: developerCredential.kybTier,
      };
    }

    // Check developer status
    if (
      !policy.allowedDeveloperStatus.includes(
        developerCredential.credentialStatus,
      )
    ) {
      return {
        allowed: false,
        reason: "developer_status_not_allowed",
        required: policy.allowedDeveloperStatus,
        actual: developerCredential.credentialStatus,
      };
    }

    // Check developer verification
    if (
      policy.requireDeveloperVerified &&
      !agentCredential.developerCredentialVerified
    ) {
      return {
        allowed: false,
        reason: "developer_not_verified",
        details: "Developer credential link has not been verified by Beltic",
      };
    }

    // Check sanctions
    if (
      policy.allowSanctionsStatus &&
      !policy.allowSanctionsStatus.includes(
        developerCredential.sanctionsScreeningStatus,
      )
    ) {
      return {
        allowed: false,
        reason: "sanctions_check_failed",
        actual: developerCredential.sanctionsScreeningStatus,
      };
    }

    // Check overall risk
    if (policy.maxOverallRisk) {
      if (
        this.compareRisk(
          developerCredential.overallRiskRating,
          policy.maxOverallRisk,
        ) > 0
      ) {
        return {
          allowed: false,
          reason: "risk_rating_too_high",
          required: `<= ${policy.maxOverallRisk}`,
          actual: developerCredential.overallRiskRating,
        };
      }
    }

    // Check screening freshness
    if (policy.requireScreeningFreshness) {
      const screeningAge = this.getDaysOld(
        developerCredential.sanctionsScreeningLastChecked,
      );
      if (screeningAge > policy.requireScreeningFreshness) {
        return {
          allowed: false,
          reason: "screening_stale",
          required: `<= ${policy.requireScreeningFreshness} days`,
          actual: `${screeningAge} days`,
        };
      }
    }

    // Check PII protection
    if (policy.requirePiiProtection) {
      if (
        !agentCredential.piiDetectionEnabled ||
        !agentCredential.piiRedactionEnabled
      ) {
        return {
          allowed: false,
          reason: "insufficient_pii_protection",
          details: "PII detection and redaction are required",
        };
      }
    }

    // All checks passed
    return {
      allowed: true,
      policyLevel,
      grantedPermissions: this.getPermissionsForPolicy(policy),
    };
  }

  compareTiers(actualTier, requiredTier) {
    const tierOrder = [
      "tier_0_unverified",
      "tier_1_basic",
      "tier_2_standard",
      "tier_3_enhanced",
      "tier_4_maximum_verification",
    ];
    return tierOrder.indexOf(actualTier) - tierOrder.indexOf(requiredTier);
  }

  compareRisk(actualRisk, maxRisk) {
    const riskOrder = ["not_assessed", "low", "medium", "high", "prohibited"];
    return riskOrder.indexOf(actualRisk) - riskOrder.indexOf(maxRisk);
  }

  getDaysOld(dateString) {
    if (!dateString) return Infinity;
    const date = new Date(dateString);
    return (new Date() - date) / (1000 * 60 * 60 * 24);
  }

  getPermissionsForPolicy(policy) {
    // Map policies to permissions
    if (policy === AccessPolicy.HIGH_RISK_PRODUCTION) {
      return {
        canAccessPII: true,
        canMakeFinancialTransactions: true,
        canModifyData: true,
        canReadData: true,
        rateLimitTier: "premium",
      };
    } else if (policy === AccessPolicy.MEDIUM_RISK_PRODUCTION) {
      return {
        canAccessPII: false,
        canMakeFinancialTransactions: false,
        canModifyData: true,
        canReadData: true,
        rateLimitTier: "standard",
      };
    } else if (policy === AccessPolicy.LOW_RISK_PRODUCTION) {
      return {
        canAccessPII: false,
        canMakeFinancialTransactions: false,
        canModifyData: false,
        canReadData: true,
        rateLimitTier: "standard",
      };
    } else {
      return {
        canAccessPII: false,
        canMakeFinancialTransactions: false,
        canModifyData: false,
        canReadData: false,
        rateLimitTier: "basic",
      };
    }
  }
}

module.exports = PolicyEnforcer;
```

### Usage Example

```javascript
const CredentialVerifier = require("./credential-verifier");
const PolicyEnforcer = require("./policy-enforcer");
const fs = require("fs");

// Initialize
const verifier = new CredentialVerifier();
const enforcer = new PolicyEnforcer(verifier);

// Load credentials
const agentCredential = JSON.parse(fs.readFileSync("agent-credential.json"));
const developerCredential = JSON.parse(
  fs.readFileSync("developer-credential.json"),
);

// Enforce policy
const result = await enforcer.enforcePolicy(
  agentCredential,
  developerCredential,
  "MEDIUM_RISK_PRODUCTION",
);

if (result.allowed) {
  console.log("✓ Access granted");
  console.log("Permissions:", result.grantedPermissions);

  // Proceed with agent access
  // e.g., issue JWT, create session, etc.
} else {
  console.log("✗ Access denied");
  console.log("Reason:", result.reason);
  console.log("Details:", result.details);

  // Return error to agent
}
```

---

## Risk-Based Access Control

### Dynamic Permission Assignment

Grant different permissions based on agent risk profile:

```javascript
class RiskBasedAccessControl {
  determinePermissions(agentCredential, developerCredential) {
    const permissions = {
      read: false,
      write: false,
      delete: false,
      piiAccess: false,
      financialActions: false,
      rateLimitMultiplier: 1.0,
    };

    // Base permissions on robustness score
    if (agentCredential.robustnessScore >= 90) {
      permissions.read = true;
      permissions.write = true;

      if (agentCredential.robustnessScore >= 95) {
        permissions.piiAccess = true;
        permissions.financialActions = true;
      }
    } else if (agentCredential.robustnessScore >= 80) {
      permissions.read = true;
    }

    // Adjust based on developer KYB tier
    if (
      developerCredential.kybTier === "tier_3_enhanced" ||
      developerCredential.kybTier === "tier_4_maximum_verification"
    ) {
      permissions.rateLimitMultiplier = 2.0; // Higher rate limits for verified developers
    }

    // Restrict if sanctions screening is unclear
    if (developerCredential.sanctionsScreeningStatus !== "clear") {
      permissions.financialActions = false;
      permissions.piiAccess = false;
    }

    // Restrict if overall risk is elevated
    if (developerCredential.overallRiskRating === "medium") {
      permissions.financialActions = false;
    } else if (
      developerCredential.overallRiskRating === "high" ||
      developerCredential.overallRiskRating === "prohibited"
    ) {
      // Deny all access
      return { allowed: false, reason: "high_risk_developer" };
    }

    // Check PII protection for PII access
    if (permissions.piiAccess) {
      if (
        !agentCredential.piiDetectionEnabled ||
        !agentCredential.piiRedactionEnabled
      ) {
        permissions.piiAccess = false;
      }
    }

    return {
      allowed: true,
      permissions,
      riskScore: this.calculateRiskScore(agentCredential, developerCredential),
    };
  }

  calculateRiskScore(agentCredential, developerCredential) {
    // Lower score = lower risk (0-100 scale)
    let score = 0;

    // Agent safety (40 points)
    score += agentCredential.attackSuccessRate * 40;

    // Developer risk (30 points)
    const riskMapping = {
      not_assessed: 30,
      low: 10,
      medium: 20,
      high: 30,
      prohibited: 30,
    };
    score += riskMapping[developerCredential.overallRiskRating] || 30;

    // KYB tier (20 points - inverse: higher tier = lower score)
    const tierMapping = {
      tier_0_unverified: 20,
      tier_1_basic: 15,
      tier_2_standard: 10,
      tier_3_enhanced: 5,
      tier_4_maximum_verification: 0,
    };
    score += tierMapping[developerCredential.kybTier] || 20;

    // Assurance level (10 points)
    if (agentCredential.developerCredentialVerified) {
      score += 0;
    } else {
      score += 10;
    }

    return Math.round(score);
  }
}
```

---

## Assurance Levels

### Understanding Assurance

Each field can have different assurance levels:

```json
{
  "assuranceMetadata": {
    "globalAssuranceLevel": "beltic_verified",
    "fieldAssurances": {
      "legalName": {
        "assuranceLevel": "beltic_verified",
        "verificationDate": "2025-11-20T14:00:00Z",
        "verificationSource": "Delaware Division of Corporations"
      },
      "taxIdVerified": {
        "assuranceLevel": "third_party_verified",
        "verificationDate": "2025-11-15T10:00:00Z",
        "verificationSource": "Persona KYC"
      }
    }
  }
}
```

### Checking Assurance

```javascript
class AssuranceChecker {
  checkFieldAssurance(credential, fieldPath, minimumLevel) {
    const assuranceMetadata = credential.assuranceMetadata;

    if (!assuranceMetadata) {
      // No assurance metadata - assume self-attested
      return {
        level: "self_attested",
        sufficient: minimumLevel === "self_attested",
      };
    }

    const fieldAssurance = assuranceMetadata.fieldAssurances?.[fieldPath];

    if (!fieldAssurance) {
      // Fall back to global assurance level
      return {
        level: assuranceMetadata.globalAssuranceLevel,
        sufficient:
          this.compareAssurance(
            assuranceMetadata.globalAssuranceLevel,
            minimumLevel,
          ) >= 0,
      };
    }

    return {
      level: fieldAssurance.assuranceLevel,
      verificationDate: fieldAssurance.verificationDate,
      verificationSource: fieldAssurance.verificationSource,
      sufficient:
        this.compareAssurance(fieldAssurance.assuranceLevel, minimumLevel) >= 0,
    };
  }

  compareAssurance(actual, required) {
    const levels = ["self_attested", "beltic_verified", "third_party_verified"];
    return levels.indexOf(actual) - levels.indexOf(required);
  }
}
```

**Usage:**

```javascript
const checker = new AssuranceChecker();

// Require third-party verification for sanctions screening
const sanctionsAssurance = checker.checkFieldAssurance(
  developerCredential,
  "sanctionsScreeningStatus",
  "third_party_verified",
);

if (!sanctionsAssurance.sufficient) {
  console.log("Sanctions screening assurance is insufficient");
  console.log(
    `Required: third_party_verified, Actual: ${sanctionsAssurance.level}`,
  );
  // Deny access or require additional verification
}
```

---

## Security Considerations

### 1. Cryptographic Verification (Future)

When Beltic implements DID-based signatures:

```javascript
async function verifySignature(credential) {
  // Fetch issuer's public key from DID document
  const issuerDid = credential.issuerDid;
  const didDocument = await resolveDid(issuerDid);
  const publicKey = didDocument.verificationMethod[0].publicKeyJwk;

  // Verify proof
  const proofVerified = await verifyJwtProof(
    credential.proof,
    publicKey,
    credential,
  );

  if (!proofVerified) {
    throw new Error("Credential signature verification failed");
  }

  return true;
}
```

### 2. Revocation Checking

Always check revocation status for production access:

```javascript
async function isCredentialValid(credential) {
  // Check revocation
  const revocationStatus = await checkRevocationStatus(credential);

  if (revocationStatus.revoked) {
    return {
      valid: false,
      reason: "revoked",
      revokedAt: revocationStatus.revokedAt,
    };
  }

  // Check expiration
  if (new Date(credential.expirationDate) < new Date()) {
    return {
      valid: false,
      reason: "expired",
    };
  }

  return { valid: true };
}
```

### 3. Credential Caching

Cache credentials but refresh regularly:

```javascript
class CredentialCache {
  constructor(ttlSeconds = 300) {
    // 5 minutes default
    this.cache = new Map();
    this.ttlSeconds = ttlSeconds;
  }

  set(credentialId, credential) {
    this.cache.set(credentialId, {
      credential,
      cachedAt: Date.now(),
    });
  }

  get(credentialId) {
    const entry = this.cache.get(credentialId);

    if (!entry) {
      return null;
    }

    const age = (Date.now() - entry.cachedAt) / 1000;

    if (age > this.ttlSeconds) {
      this.cache.delete(credentialId);
      return null;
    }

    return entry.credential;
  }

  invalidate(credentialId) {
    this.cache.delete(credentialId);
  }
}
```

### 4. Rate Limiting by Risk

Apply stricter rate limits to higher-risk agents:

```javascript
function getRateLimitForAgent(agentCredential, developerCredential) {
  let baseLimit = 100; // requests per minute

  // Adjust based on robustness
  if (agentCredential.robustnessScore >= 95) {
    baseLimit *= 2;
  } else if (agentCredential.robustnessScore >= 90) {
    baseLimit *= 1.5;
  } else if (agentCredential.robustnessScore < 80) {
    baseLimit *= 0.5;
  }

  // Adjust based on KYB tier
  if (
    developerCredential.kybTier === "tier_3_enhanced" ||
    developerCredential.kybTier === "tier_4_maximum_verification"
  ) {
    baseLimit *= 1.5;
  } else if (developerCredential.kybTier === "tier_0_unverified") {
    baseLimit *= 0.5;
  }

  return Math.round(baseLimit);
}
```

### 5. Audit Logging

Log all access decisions:

```javascript
function logAccessDecision(agentCredential, developerCredential, decision) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agentId: agentCredential.agentId,
    agentName: agentCredential.agentName,
    developerId: developerCredential.credentialId,
    developerName: developerCredential.legalName,
    decision: decision.allowed ? "granted" : "denied",
    reason: decision.reason,
    policyLevel: decision.policyLevel,
    agentRobustness: agentCredential.robustnessScore,
    developerKybTier: developerCredential.kybTier,
    developerRisk: developerCredential.overallRiskRating,
  };

  // Send to your logging system
  console.log("ACCESS_DECISION", JSON.stringify(logEntry));
  // Or: await logToDatastore(logEntry);
}
```

---

## Production Checklist

Before going live with Beltic credential verification:

### Infrastructure

- [ ] Schema validators initialized and compiled
- [ ] Credential cache configured with appropriate TTL
- [ ] Revocation checking enabled (when available)
- [ ] Rate limiting configured
- [ ] Audit logging in place

### Policies

- [ ] Access policies defined for each risk level
- [ ] Permission mappings documented
- [ ] Fallback policies for missing/invalid credentials
- [ ] Escalation procedures for edge cases

### Security

- [ ] Signature verification enabled (when available)
- [ ] Revocation list monitoring
- [ ] Credential expiration checks
- [ ] Assurance level requirements documented
- [ ] Security incident response plan

### Monitoring

- [ ] Access decision metrics tracked
- [ ] Credential validation failure alerts
- [ ] Policy enforcement metrics
- [ ] Unusual access pattern detection

### Documentation

- [ ] Integration documented for your team
- [ ] Error messages documented for agent developers
- [ ] Policy requirements published
- [ ] Support contact information provided

---

## Common Integration Scenarios

### Scenario 1: E-commerce Refund Processing

**Requirement:** Allow agents to process refunds up to $500.

**Policy:**

```javascript
const RefundPolicy = {
  minRobustnessScore: 90,
  maxAttackSuccessRate: 0.1,
  minKybTier: "tier_2_standard",
  maxRefundAmount: 500,
  requireHumanInTheLoop: (amount) => amount > 100,
};

function canProcessRefund(agentCredential, developerCredential, refundAmount) {
  // Check basic policy
  const policyResult = enforcer.enforcePolicy(
    agentCredential,
    developerCredential,
    "MEDIUM_RISK_PRODUCTION",
  );

  if (!policyResult.allowed) {
    return policyResult;
  }

  // Check refund-specific requirements
  if (refundAmount > RefundPolicy.maxRefundAmount) {
    return {
      allowed: false,
      reason: "refund_amount_exceeds_limit",
      maxAllowed: RefundPolicy.maxRefundAmount,
      requested: refundAmount,
    };
  }

  // Check if agent has refund tool declared
  const hasRefundTool = agentCredential.toolsAndActions?.some(
    (tool) => tool.toolName === "issue_refund",
  );

  if (!hasRefundTool) {
    return {
      allowed: false,
      reason: "refund_tool_not_declared",
    };
  }

  // Require human approval for high amounts
  const requiresApproval = RefundPolicy.requireHumanInTheLoop(refundAmount);

  return {
    allowed: true,
    requiresHumanApproval: requiresApproval,
  };
}
```

### Scenario 2: API Access with Tiered Limits

**Requirement:** Different API rate limits based on agent safety.

```javascript
function getApiAccessTier(agentCredential, developerCredential) {
  // Tier 1: Basic (low-assurance agents)
  if (
    agentCredential.robustnessScore < 85 ||
    developerCredential.kybTier === "tier_0_unverified"
  ) {
    return {
      tier: "basic",
      rateLimitPerMinute: 60,
      allowedEndpoints: ["GET /read-only/*"],
      quotaPerMonth: 10000,
    };
  }

  // Tier 2: Standard (verified agents)
  if (
    agentCredential.robustnessScore >= 85 &&
    developerCredential.kybTier >= "tier_2_standard"
  ) {
    return {
      tier: "standard",
      rateLimitPerMinute: 300,
      allowedEndpoints: ["GET /*", "POST /write/*"],
      quotaPerMonth: 100000,
    };
  }

  // Tier 3: Premium (high-assurance agents)
  if (
    agentCredential.robustnessScore >= 95 &&
    developerCredential.kybTier >= "tier_3_enhanced"
  ) {
    return {
      tier: "premium",
      rateLimitPerMinute: 1000,
      allowedEndpoints: ["*"],
      quotaPerMonth: 1000000,
      piiAccess: true,
    };
  }
}
```

### Scenario 3: Agent Marketplace Listing

**Requirement:** Display trust scores to users browsing agents.

```javascript
function generateMarketplaceListing(agentCredential, developerCredential) {
  return {
    agentId: agentCredential.agentId,
    name: agentCredential.agentName,
    description: agentCredential.agentDescription,
    version: agentCredential.agentVersion,

    // Trust indicators
    trustScore: {
      robustnessScore: agentCredential.robustnessScore,
      attackSuccessRate: agentCredential.attackSuccessRate,
      badge: getTrustBadge(agentCredential.robustnessScore),
      lastTested: agentCredential.safetyTestsLastRun,
    },

    // Developer info
    developer: {
      name: developerCredential.legalName,
      verified: agentCredential.developerCredentialVerified,
      kybTier: developerCredential.kybTier,
      kybTierLabel: getKybTierLabel(developerCredential.kybTier),
    },

    // Privacy info
    privacy: {
      dataRetentionDays: agentCredential.userDataRetentionDays,
      usedForTraining: agentCredential.userDataUsedForTraining,
      piiProtection:
        agentCredential.piiDetectionEnabled &&
        agentCredential.piiRedactionEnabled,
    },

    // Operations
    status: agentCredential.currentStatus,
    availabilitySLA: agentCredential.availabilitySLA,
  };
}

function getTrustBadge(robustnessScore) {
  if (robustnessScore >= 95) return "EXCELLENT";
  if (robustnessScore >= 90) return "VERY_GOOD";
  if (robustnessScore >= 85) return "GOOD";
  if (robustnessScore >= 80) return "FAIR";
  return "NEEDS_IMPROVEMENT";
}

function getKybTierLabel(kybTier) {
  const labels = {
    tier_0_unverified: "Unverified",
    tier_1_basic: "Basic Verification",
    tier_2_standard: "Standard KYB",
    tier_3_enhanced: "Enhanced KYB",
    tier_4_maximum_verification: "Maximum KYB",
  };
  return labels[kybTier] || "Unknown";
}
```

---

## Resources

### Documentation

- [Quickstart Guide](quickstart.md) - Get started with credentials
- [Validation Guide](validation-guide.md) - Complete validation reference
- [DeveloperCredential Spec](developer-credential-v1.md) - Full field reference
- [AgentCredential Spec](agent-credential-v1.md) - Full field reference
- [Evaluation Metrics](evaluation-metrics-v1.md) - How safety metrics are calculated

### Code Examples

- [Full Integration Example (GitHub)](https://github.com/beltic/beltic-integration-examples)
- [Python Integration](https://github.com/beltic/beltic-python)
- [Node.js SDK](https://github.com/beltic/beltic-js)

### Community

- [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions)
- [GitHub Issues](https://github.com/beltic/beltic-spec/issues)
- [Contributing Guide](contributing-spec.md)

---

**Integration Guide Version**: 1.0
**Last Updated**: 2025-11-21
**Maintained by**: [Beltic](https://beltic.com)
**License**: [Apache 2.0](../LICENSE)
