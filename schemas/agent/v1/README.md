# AgentCredential v1 Schema

**Schema ID**: `https://schema.beltic.com/agent/v1/agent-credential-v1.schema.json`

**Version**: 1.0

**Status**: Stable

**Last Updated**: 2025-11-21

## Overview

The AgentCredential v1 schema defines the structure for verifiable credentials that document AI agent identity, capabilities, safety metrics, privacy practices, and operational details. This credential enables merchants, platforms, and users to make informed decisions about which agents to trust and deploy.

## Purpose

AgentCredential v1 serves multiple stakeholders:

- **Merchants/Platforms**: Verify agent safety, privacy practices, and operational readiness before granting access
- **Developers**: Document agent capabilities and safety metrics in a standardized format
- **Users**: Understand what an agent can do and how their data is handled
- **Regulators**: Audit agent safety, privacy compliance, and NIST AI RMF alignment
- **Beltic**: Issue verified credentials linking agents to trusted developers

## Schema Structure

> Status note: This README reflects the finalized v1 field names. The four safety metrics are `harmfulContentRefusalScore`, `promptInjectionRobustnessScore`, `toolAbuseRobustnessScore` (tools only), and `piiLeakageRobustnessScore` with accompanying benchmark metadata.

### Field Categories

1. **Identity & Provenance** – agentId/name/version/description, status, firstReleaseDate, link to DeveloperCredential
2. **Technical Profile** – model provider/family, context window, modalities, languages, architecture, systemConfigFingerprint/lastUpdated, deploymentEnvironment, dataLocationProfile, optional complianceCertifications
3. **Tools & Actions** – toolsList (risk taxonomy, auth + human approval flags) and toolsLastAudited
4. **Data Handling & Privacy** – dataCategoriesProcessed, retention (max + by category), trainingDataUsage, PII detection/redaction, encryption standards
5. **Safety & Robustness Metrics** – harmful content refusal, prompt injection robustness, tool abuse robustness (conditional), PII leakage robustness + benchmark name/version/date/assurance source
6. **Operations & Lifecycle** – incident response contact/SLO, deprecationPolicy, updateCadence, humanOversightMode, failSafeBehavior, monitoringCoverage, credential issuance/expiration
7. **Risk Summary & Assurance Metadata** – overallSafetyRating, approvedUseCases/prohibitedUseCases, ageRestrictions, regulatoryApprovals (optional), kybTierRequired, verificationLevel, lastSecurityAuditDate
8. **Cryptographic Identity & Verification** – credentialId, issuerDid, verificationMethod, credentialStatus, revocationListUrl, proof

## Required vs Optional Fields

### Always Required
- Identity & provenance: `schemaVersion`, `agentId`, `agentName`, `agentVersion`, `agentDescription`, `firstReleaseDate`, `currentStatus`, `developerCredentialId`, `developerCredentialVerified`
- Technical profile: `primaryModelProvider`, `primaryModelFamily`, `modelContextWindow`, `modalitySupport`, `languageCapabilities`, `architectureType`, `systemConfigFingerprint`, `systemConfigLastUpdated`, `deploymentEnvironment`, `dataLocationProfile`
- Data handling & privacy: `dataCategoriesProcessed`, `dataRetentionMaxPeriod`, `trainingDataUsage`, `piiDetectionEnabled`, `piiRedactionCapability`, `dataEncryptionStandards`
- Safety metrics: `harmfulContent*`, `promptInjection*`, `piiLeakage*` blocks (benchmark name/version/date/assuranceSource + score)
- Operations: `incidentResponseContact`, `incidentResponseSLO`, `deprecationPolicy`, `updateCadence`, `humanOversightMode`, `failSafeBehavior`, `monitoringCoverage`, `credentialIssuanceDate`, `credentialExpirationDate`
- Risk & assurance: `overallSafetyRating`, `ageRestrictions`, `kybTierRequired`, `verificationLevel`
- Cryptographic: `credentialId`, `issuerDid`, `verificationMethod`, `credentialStatus`, `revocationListUrl`, `proof`

### Conditionally Required
- When `toolsList` has entries: `toolsLastAudited` plus the full `toolAbuse*` metric block.
- Optional arrays (include only when populated): `approvedUseCases`, `prohibitedUseCases`, `regulatoryApprovals`, `complianceCertifications`.
- `dataRetentionByCategory` and `piiRedactionPipeline` are optional but recommended for clarity.

## Validation Examples

```json
{
  "$schema": "../../../schemas/agent/v1/agent-credential-v1.schema.json",
  "schemaVersion": "1.0",
  "agentId": "9d4c4d1e-5f35-4c5a-9e9a-58c2a0f52311",
  "agentName": "FlowRefund Agent",
  "agentVersion": "1.4.0",
  "agentDescription": "Autonomous refund helper that validates eligibility, issues refunds up to $500, and escalates edge cases.",
  "firstReleaseDate": "2023-08-01",
  "currentStatus": "production",
  "developerCredentialId": "0f6f1a4d-0c3d-4a5e-9d2b-992d9b7d8b70",
  "developerCredentialVerified": true,
  "primaryModelProvider": "Anthropic",
  "primaryModelFamily": "Claude-3 Sonnet",
  "modelContextWindow": 200000,
  "modalitySupport": ["text", "structured_data"],
  "languageCapabilities": ["en", "es"],
  "architectureType": "tool_using",
  "systemConfigFingerprint": "9f1c7e98e4d66274e8d9b9d9301f5b8eaf3a8b1df02f89a0bc613066b8c1d4fa",
  "systemConfigLastUpdated": "2025-01-20",
  "deploymentEnvironment": "AWS us-east-1 primary, eu-west-1 DR",
  "dataLocationProfile": { "storageRegions": ["US"], "processingRegions": ["US"] },
  "toolsList": [],
  "dataCategoriesProcessed": ["pii", "financial"],
  "dataRetentionMaxPeriod": "P90D",
  "trainingDataUsage": "never",
  "piiDetectionEnabled": true,
  "piiRedactionCapability": "advanced",
  "dataEncryptionStandards": ["AES-256 at rest", "TLS 1.3 in transit"],
  "harmfulContentRefusalScore": 95,
  "harmfulContentBenchmarkName": "Beltic Harmful Content Suite",
  "harmfulContentBenchmarkVersion": "2.0.1",
  "harmfulContentEvaluationDate": "2025-02-01",
  "harmfulContentAssuranceSource": "beltic",
  "promptInjectionRobustnessScore": 90,
  "promptInjectionBenchmarkName": "Beltic Prompt Injection Suite",
  "promptInjectionBenchmarkVersion": "1.3.0",
  "promptInjectionEvaluationDate": "2025-02-02",
  "promptInjectionAssuranceSource": "beltic",
  "piiLeakageRobustnessScore": 93,
  "piiLeakageBenchmarkName": "Beltic Privacy Leakage Suite",
  "piiLeakageBenchmarkVersion": "1.2.0",
  "piiLeakageEvaluationDate": "2025-02-02",
  "piiLeakageAssuranceSource": "beltic",
  "incidentResponseContact": "security@example.com",
  "incidentResponseSLO": "PT4H",
  "deprecationPolicy": "30-day notice with rollback path.",
  "updateCadence": "biweekly",
  "humanOversightMode": "human_review_pre_action",
  "failSafeBehavior": "Refuse ambiguous refunds and escalate to humans.",
  "monitoringCoverage": "Audit logs for tool calls; prompt injection detector.",
  "credentialIssuanceDate": "2025-02-10T11:00:00Z",
  "credentialExpirationDate": "2025-08-10T11:00:00Z",
  "overallSafetyRating": "moderate_risk",
  "ageRestrictions": "13+",
  "kybTierRequired": "tier_2",
  "verificationLevel": "beltic_verified",
  "credentialId": "c48a3e5a-92f5-4c92-a2d4-8b1639c4e3f0",
  "issuerDid": "did:web:beltic.test",
  "verificationMethod": "did:web:beltic.test#agent-key-1",
  "credentialStatus": "active",
  "revocationListUrl": "https://beltic.test/status/agents",
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2025-02-10T11:00:00Z",
    "verificationMethod": "did:web:beltic.test#agent-key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "zSignatureValueHere"
  }
}
```

### Common Validation Errors
- **Tool fields missing**: When `toolsList` is non-empty, the `toolAbuse*` metrics and `toolsLastAudited` must be present.
- **Fingerprint absent**: `systemConfigFingerprint` and `systemConfigLastUpdated` are required even for simple agents.
- **Data location**: `dataLocationProfile.storageRegions` and `processingRegions` must contain valid ISO 3166-1 country codes.
- **Age restriction values**: Must be one of `none`, `13+`, `16+`, `18+`, `21+`.
- **Date/UUID formats**: All dates use ISO 8601; IDs must be valid UUID strings.

## Safety Metrics Explained

- **harmfulContentRefusalScore** – % of harmful-content attempts refused (higher is safer). Derived from a benchmark run; see evaluation-metrics-v1.md for ASR calculation.
- **promptInjectionRobustnessScore** – 100 − Attack Success Rate for prompt injection attempts.
- **toolAbuseRobustnessScore** – 0–100 score for resisting unsafe tool usage (only required when toolsList is populated).
- **piiLeakageRobustnessScore** – 0–100 score for resisting PII/system prompt leakage.

Each metric includes benchmark name, version, evaluation date, and assurance source (`self`, `beltic`, or `third_party`).

## NIST AI RMF Alignment

| NIST Function | Mapped Fields (representative) |
|---------------|--------------------------------|
| **GOVERN** | agentId, agentName, developerCredentialId, credentialId, issuerDid, credentialStatus |
| **MAP** | agentDescription, toolsList, dataLocationProfile, approvedUseCases/prohibitedUseCases, kybTierRequired |
| **MEASURE** | harmfulContentRefusalScore block, promptInjectionRobustnessScore block, toolAbuseRobustnessScore block, piiLeakageRobustnessScore block |
| **MANAGE** | incidentResponseContact/SLO, humanOversightMode, failSafeBehavior, monitoringCoverage, deprecationPolicy, updateCadence |

## Example Usage

### Validate with AJV (JavaScript/Node.js)

```javascript
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('agent-credential-v1.schema.json'));
const validate = ajv.compile(schema);

const credential = JSON.parse(fs.readFileSync('../../examples/agent/v1/valid-simple-agent.json'));

if (validate(credential)) {
  console.log("✓ Valid AgentCredential");
} else {
  console.error("✗ Validation errors:", ajv.errorsText(validate.errors));
}
```

### Validate with Python (jsonschema)

```python
import json
from jsonschema import validate, Draft202012Validator, ValidationError

# Load schema
with open('agent-credential-v1.schema.json') as f:
    schema = json.load(f)

# Load credential
with open('../../examples/agent/v1/valid-simple-agent.json') as f:
    credential = json.load(f)

# Validate
try:
    Draft202012Validator(schema).validate(credential)
    print("✓ Valid AgentCredential")
except ValidationError as e:
    print(f"✗ Validation error: {e.message}")
```

### Validate with CLI (ajv-cli)

```bash
# Install AJV CLI
npm install -g ajv-cli ajv-formats

# Validate a single credential
ajv validate \
  -s agent-credential-v1.schema.json \
  -d ../../examples/agent/v1/valid-simple-agent.json

# Validate all examples
ajv validate \
  -s agent-credential-v1.schema.json \
  -d "../../examples/agent/v1/*.json"
```

## Migration & Compatibility

### From No Schema to v1

If you're creating agent credentials for the first time:

1. **Start with examples**: Copy and customize [valid-simple-agent.json](../../../examples/agent/v1/valid-simple-agent.json)
2. **Add $schema reference**: Include schema reference at top of JSON
3. **Fill required fields**: Complete all 18 required fields
4. **Add safety metrics**: Include ASR, robustness score, test dates
5. **Validate**: Run validation before deploying

### Future v1.x Versions

Minor version updates (v1.1, v1.2) will be backward-compatible:
- New fields will be **optional**
- Existing fields will not change structure
- Validation rules will not become stricter

## Related Documentation

- **Full Specification**: [agent-credential-v1.md](../../../docs/agent-credential-v1.md) - Complete field-by-field documentation
- **Examples**: [Agent Examples](../../../examples/agent/v1/) - Valid and invalid examples
- **Human-Readable Example**: [agent-example-v1.md](../../../examples/agent-example-v1.md) - Conceptual overview
- **Evaluation Metrics**: [evaluation-metrics-v1.md](../../../docs/evaluation-metrics-v1.md) - How safety metrics are calculated
- **NIST Mapping**: [nist-mapping-v1.md](../../../docs/nist-mapping-v1.md) - AI RMF alignment details
- **Validation Guide**: [validation-guide.md](../../../docs/validation-guide.md) - Complete validation instructions

## Support

- **Schema Issues**: [Report a bug](https://github.com/beltic/beltic-spec/issues)
- **Questions**: [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions)
- **Contributing**: [Contributing Guide](../../../docs/contributing-spec.md)

---

**Schema Version**: 1.0
**Maintained by**: [Beltic](https://beltic.com)
**License**: [Apache 2.0](../../../LICENSE)
