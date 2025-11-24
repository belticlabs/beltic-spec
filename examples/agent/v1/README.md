# AgentCredential v1 Examples

This directory contains example AgentCredentials demonstrating various agent types, safety profiles, and credential structures.

## Example Files

| File | Description | Validation Status | Use Case |
|------|-------------|------------------|----------|
| **valid-simple-agent.json** | Simple production agent with basic safety metrics | ✅ Valid | E-commerce refund handling, low-risk operations |
| **valid-complex-agent.json** | Complex multi-modal agent with extensive documentation | ✅ Valid | Financial advisory, high-risk regulated use case |
| **invalid-missing-required.json** | Minimal credential missing required fields | ❌ Invalid | Demonstrates validation errors |

## Example Scenarios

### 1. Simple Production Agent

**File**: `valid-simple-agent.json`

**Agent**: Aurora Refund Guide

**Profile**:
- **Model**: Anthropic Claude-3 Opus
- **Domain**: E-commerce support (refund processing)
- **Safety**: ASR = 0.03 (97% robustness score)
- **Privacy**: 90-day retention, no training on user data
- **Tools**: 3 tools (issue_refund, check_policy, send_email)
- **Risk**: Low complexity, standard safety controls

**Key Features**:
- Text-only modality
- Multi-language support (English, Spanish)
- Human-in-the-loop for refunds >$100
- Rate limits: 10 requests/minute
- No PII logging

**Use Case**: Demonstrates a typical production agent with clear safety metrics, reasonable tool restrictions, and standard privacy practices.

**Validation**: ✅ Passes all schema validation rules

---

### 2. Complex Multi-Modal Agent

**File**: `valid-complex-agent.json`

**Agent**: Atlas Wealth Copilot

**Profile**:
- **Model**: Anthropic Claude-3 Opus (fine-tuned)
- **Domain**: Financial advisory, wealth management
- **Safety**: ASR = 0.015 (98.5% robustness score)
- **Privacy**: 180-day retention, enhanced PII protection
- **Tools**: 7 tools including data analysis, report generation, transaction simulation
- **Risk**: High complexity, extensive audit trail

**Key Features**:
- Multi-modal: text, structured_data, limited_vision
- Multi-language: English, Spanish, Mandarin
- Fine-tuned on proprietary financial advisory data
- Human-in-the-loop required for all recommendations
- Comprehensive audit logs with 365-day retention
- Privacy leakage score: 0.008 (excellent)

**Use Case**: Demonstrates a high-value, regulated agent with:
- Enhanced safety testing
- Strict privacy controls
- Complex tool ecosystem
- Compliance documentation (SOC 2, GDPR)

**Validation**: ✅ Passes all schema validation rules

---

### 3. Invalid Example (Missing Required Fields)

**File**: `invalid-missing-required.json`

**Agent**: Broken Agent

**Profile**:
- Minimal credential with only 3 fields
- Missing 15+ required fields

**Validation**: ❌ Fails schema validation

**Expected Errors**:
```
Error: must have required property 'firstReleaseDate'
Error: must have required property 'currentStatus'
Error: must have required property 'developerCredentialId'
Error: must have required property 'developerCredentialVerified'
Error: must have required property 'primaryModelProvider'
Error: must have required property 'primaryModelFamily'
Error: must have required property 'attackSuccessRate'
Error: must have required property 'robustnessScore'
Error: must have required property 'safetyTestsLastRun'
Error: must have required property 'userDataRetentionDays'
Error: must have required property 'userDataUsedForTraining'
Error: must have required property 'credentialId'
Error: must have required property 'issuanceDate'
Error: must have required property 'expirationDate'
Error: must have required property 'issuerDid'
Error: must have required property 'credentialStatus'
```

**Use Case**: Demonstrates what happens when required fields are missing. Useful for testing validation error handling.

## Validation Instructions

### Validate All Examples

```bash
# Using AJV CLI
ajv validate \
  -s ../../schemas/agent/v1/agent-credential-v1.schema.json \
  -d "*.json"

# Expected output:
# ✅ valid-simple-agent.json - valid
# ✅ valid-complex-agent.json - valid
# ❌ invalid-missing-required.json - invalid (16 errors)
```

### Validate Individual File

```bash
# Validate the simple agent
ajv validate \
  -s ../../schemas/agent/v1/agent-credential-v1.schema.json \
  -d valid-simple-agent.json

# Expected output: valid-simple-agent.json valid
```

### Programmatic Validation (JavaScript)

```javascript
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load schema
const schema = JSON.parse(
  fs.readFileSync('../../schemas/agent/v1/agent-credential-v1.schema.json')
);
const validate = ajv.compile(schema);

// Validate example
const agent = JSON.parse(fs.readFileSync('valid-simple-agent.json'));

if (validate(agent)) {
  console.log("✓ Valid AgentCredential");
} else {
  console.error("✗ Validation errors:");
  validate.errors.forEach(err => {
    console.error(`  - ${err.instancePath}: ${err.message}`);
  });
}
```

### Programmatic Validation (Python)

```python
import json
from jsonschema import validate, Draft202012Validator, ValidationError

# Load schema
with open('../../schemas/agent/v1/agent-credential-v1.schema.json') as f:
    schema = json.load(f)

# Load and validate example
with open('valid-simple-agent.json') as f:
    agent = json.load(f)

try:
    Draft202012Validator(schema).validate(agent)
    print("✓ Valid AgentCredential")
except ValidationError as e:
    print(f"✗ Validation error: {e.message}")
    print(f"  Path: {'/'.join(str(p) for p in e.path)}")
```

## Using Examples as Templates

### 1. Copy an Example

```bash
# For low-risk agents
cp valid-simple-agent.json my-agent.json

# For high-risk/regulated agents
cp valid-complex-agent.json my-agent.json
```

### 2. Customize the Credential

Update the following required fields:
- `agentId`: Generate a new UUID v4
- `agentName`: Your agent's name
- `agentVersion`: Your version (semantic versioning)
- `agentDescription`: Clear description of purpose
- `developerCredentialId`: Your developer credential ID
- `primaryModelProvider` and `primaryModelFamily`: Your model details
- `attackSuccessRate` and `robustnessScore`: Your safety test results
- `safetyTestsLastRun`: Recent date
- Tool and action declarations
- Privacy practices

### 3. Validate Your Credential

```bash
ajv validate \
  -s ../../schemas/agent/v1/agent-credential-v1.schema.json \
  -d my-agent.json
```

### 4. Fix Validation Errors

Common issues:
- **Date format**: Use ISO 8601 format (`2025-11-20T10:00:00Z`)
- **UUID format**: Use proper UUID v4
- **ASR range**: Must be 0.0 to 1.0 (e.g., 0.15 = 15%)
- **Enum values**: Must exactly match allowed values (e.g., `"production"` not `"prod"`)

## Field Completion Checklist

When customizing an example, ensure you update:

### Identity & Metadata
- [ ] `agentId` - New UUID v4
- [ ] `agentName` - Clear, unique name
- [ ] `agentVersion` - Semantic version
- [ ] `agentDescription` - Detailed purpose
- [ ] `firstReleaseDate` - Actual release date
- [ ] `currentStatus` - development/beta/production
- [ ] `developerCredentialId` - Link to your developer credential

### Technical Profile
- [ ] `primaryModelProvider` - Your model provider
- [ ] `primaryModelFamily` - Specific model
- [ ] `modelContextWindow` - Actual context size
- [ ] `modalitySupport` - Supported modalities
- [ ] `languageCapabilities` - Supported languages

### Safety & Robustness
- [ ] `attackSuccessRate` - Real test results (0.0-1.0)
- [ ] `robustnessScore` - Calculated as 100 × (1 - ASR)
- [ ] `safetyTestsLastRun` - Recent date
- [ ] Test coverage breakdowns (optional but recommended)

### Data & Privacy
- [ ] `userDataRetentionDays` - Your retention policy
- [ ] `userDataUsedForTraining` - true/false
- [ ] `userDataLoggingScope` - What you log
- [ ] `piiDetectionEnabled` and `piiRedactionEnabled` - PII handling

### Operations
- [ ] `deploymentEnvironment` - Where agent runs
- [ ] `rateLimits` - Actual rate limits
- [ ] `availabilitySLA` - Your SLA commitment

### Tools & Actions
- [ ] `toolsAndActions` - All tools with risk categories
- [ ] `humanInTheLoopRequired` - When required

### Verification Metadata
- [ ] `credentialId` - New UUID v4
- [ ] `issuanceDate` - Current datetime
- [ ] `expirationDate` - Future datetime (6-12 months)
- [ ] `credentialStatus` - Usually "active"

## Related Documentation

- **Schema**: [agent-credential-v1.schema.json](../../schemas/agent/v1/agent-credential-v1.schema.json)
- **Schema README**: [schemas/agent/v1/README.md](../../schemas/agent/v1/README.md)
- **Full Specification**: [docs/agent-credential-v1.md](../../docs/agent-credential-v1.md)
- **Human-Readable Example**: [agent-example-v1.md](../agent-example-v1.md)
- **Validation Guide**: [docs/validation-guide.md](../../docs/validation-guide.md)
- **Evaluation Metrics**: [docs/evaluation-metrics-v1.md](../../docs/evaluation-metrics-v1.md)

## Support

- **Questions**: [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions)
- **Issues**: [Report a problem](https://github.com/beltic/beltic-spec/issues)
- **Contributing**: [Contributing Guide](../../docs/contributing-spec.md)

---

**Examples Version**: 1.0
**Last Updated**: 2025-11-21
**Schema Version**: agent-credential-v1.0
