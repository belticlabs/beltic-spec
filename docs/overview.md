# Beltic Overview

## What is Beltic?

Beltic is a certification and verification framework for AI agents that uses verifiable credentials to establish trust in agent-to-merchant interactions. By combining developer identity verification (KYC/KYB) with rigorous agent capability and safety evaluations, Beltic creates a cryptographically verifiable chain of trust that enables merchants to make informed decisions about which AI agents to allow access to their services, APIs, and platforms.

## Core Credential Types

Beltic defines two primary credential types that work together to establish comprehensive trust:

### 1. DeveloperCredential

The DeveloperCredential establishes the identity and legitimacy of the organization or individual developing AI agents.

**Purpose:**
- Verify the real-world identity of developers, companies, or organizations
- Establish accountability through Know Your Customer (KYC) and Know Your Business (KYB) processes
- Create a foundational trust anchor for all agents developed by the entity

**Key Characteristics:**
- Issued after successful identity verification process
- Contains verified information about the developer/organization
- Required prerequisite for obtaining AgentCredentials
- Can be revoked if trust is violated

**High-Level Sections:**
- Identity Information (legal name, registration details, jurisdiction)
- Contact Information (verified email, physical address, support channels)
- Verification Metadata (KYC/KYB completion status, verification date, expiry)
- Cryptographic Proofs (public keys, signatures, credential ID)

### 2. AgentCredential

The AgentCredential certifies a specific AI agent's capabilities, safety characteristics, and operational parameters.

**Purpose:**
- Certify what an agent can and cannot do
- Document safety evaluation results and compliance levels
- Specify privacy practices and data handling policies
- Link the agent to its developer via DeveloperCredential reference

**Key Characteristics:**
- Issued per agent after successful evaluation process
- Contains verifiable claims about agent capabilities and safety
- References the parent DeveloperCredential
- Can be updated as agent versions change

**High-Level Sections:**
- Agent Identity (name, version, unique identifier, description)
- Capability Declarations (supported actions, API interactions, tool usage)
- Safety & Compliance (evaluation results, safety level, guardrails)
- Privacy & Data Handling (data retention, storage locations, processing practices)
- Developer Link (reference to issuing DeveloperCredential)
- Operational Metadata (creation date, expiry, version history)

## Credential Flow

The Beltic ecosystem operates through a three-stage trust establishment process:

```
Stage 1: Developer Verification
┌──────────┐
│Developer │  Submits identity documents and company information
└────┬─────┘
     │
     ▼
┌──────────┐
│  Beltic  │  Performs KYC/KYB verification
│   (KYC)  │  - Validates identity documents
└────┬─────┘  - Checks business registration
     │        - Verifies contact information
     │
     ▼
┌──────────────────────┐
│ DeveloperCredential  │  Issued as verifiable credential
└──────────────────────┘  Contains verified identity claims


Stage 2: Agent Certification
┌──────────┐
│Developer │  Submits agent manifest and documentation
└────┬─────┘
     │
     ├─────► Agent Manifest (capabilities, intended use)
     ├─────► Safety Documentation
     └─────► Reference to DeveloperCredential
            │
            ▼
      ┌──────────┐
      │  Beltic  │  Performs agent evaluations
      │  (Eval)  │  - Capability verification
      └────┬─────┘  - Safety testing
           │        - Privacy audit
           │        - Compliance checks
           │
           ▼
    ┌─────────────────┐
    │ AgentCredential │  Issued as verifiable credential
    └─────────────────┘  Contains certified agent claims


Stage 3: Verification & Access
┌─────────────────┐
│     Agent       │  Presents credentials to merchant
│  (with creds)   │
└────┬────────────┘
     │
     ▼
┌──────────┐
│ Merchant │  Verifies credentials
│ Service  │  - Checks cryptographic signatures
└────┬─────┘  - Validates credential chains (Agent → Developer)
     │        - Evaluates capability claims against requirements
     │        - Checks revocation status
     │
     ├─────► ✓ Credentials valid → Allow access
     │
     └─────► ✗ Credentials invalid → Deny access
```

## Assurance Model

Beltic supports multiple levels of assurance to accommodate different trust requirements and use cases:

### Self-Attested

**Description:** Claims made directly by the developer without third-party verification.

**Use Cases:**
- Development and testing environments
- Low-risk interactions
- Initial agent prototyping

**Trust Level:** Lowest - relies entirely on developer honesty

**Verification:** None - claims are accepted as stated

### Beltic-Verified

**Description:** Claims verified by Beltic through automated evaluations, manual reviews, and testing.

**Use Cases:**
- Production deployments
- Moderate to high-risk interactions
- Commercial agent marketplaces

**Trust Level:** High - combines automated testing with human oversight

**Verification Process:**
- Automated capability testing
- Safety evaluation suites
- Privacy policy review
- Compliance checks against standards
- Cryptographic proof generation

### Third-Party Verified

**Description:** Claims verified by independent, accredited third-party auditors or certification bodies.

**Use Cases:**
- Regulated industries (healthcare, finance, legal)
- High-stakes applications
- Government or enterprise deployments requiring compliance

**Trust Level:** Highest - independent verification with auditor accountability

**Verification Process:**
- Formal audit by accredited organization
- Compliance with industry-specific standards
- Independent safety testing
- Legal and regulatory review
- Beltic co-signs credential with third-party signature

### Assurance Level Indicators

Each credential includes explicit indicators of its assurance level:
- Attestation metadata showing verification method
- Verifier signatures (self, Beltic, third-party)
- Audit trail references
- Expiration dates appropriate to assurance level
- Scope limitations based on verification depth

## Credential Lifecycle

Both credential types follow a similar lifecycle:

1. **Application:** Developer submits required information and documentation
2. **Verification:** Appropriate verification process based on desired assurance level
3. **Issuance:** Credential generated with cryptographic signatures
4. **Publication:** Credential made available for verification (public or permissioned)
5. **Usage:** Agent presents credential to merchants during interactions
6. **Renewal:** Credentials expire and must be renewed with re-verification
7. **Revocation:** Credentials can be revoked if trust is violated or circumstances change

## Trust Chain

The relationship between credentials creates a verifiable trust chain:

```
DeveloperCredential (Root of Trust)
        ↓
        ├── AgentCredential A
        ├── AgentCredential B
        └── AgentCredential C
```

A merchant verifying an AgentCredential must also verify:
1. The AgentCredential itself is valid and not revoked
2. The referenced DeveloperCredential exists and is valid
3. The cryptographic chain linking them is intact
4. Both credentials meet the merchant's trust requirements

This two-level hierarchy ensures accountability flows from individual agent behaviors back to the responsible developer or organization.

## Privacy Considerations

Beltic is designed with privacy-preserving principles:

- **Selective Disclosure:** Credentials can support zero-knowledge proofs allowing agents to prove properties without revealing all details
- **Minimization:** Only necessary information is included in credentials
- **Separation:** Developer identity and agent capabilities are separate credentials to limit exposure
- **Revocation Privacy:** Revocation checking methods preserve privacy where possible

## Documentation Guide

This overview provides the conceptual foundation for Beltic. Navigate to the appropriate resources based on your role and goals:

### 🚀 Getting Started

**New to Beltic? Start here:**

- **[Quickstart Guide](quickstart.md)** - Create and validate your first credential in 5 minutes
  - Choose between DeveloperCredential and AgentCredential
  - Step-by-step customization
  - Common pitfalls and troubleshooting

### 📚 Core Specifications

**Detailed field-by-field documentation:**

- **[DeveloperCredential Specification](developer-credential-v1.md)** - Complete developer/organization identity credential
  - 35 fields covering identity, KYC/KYB, risk assessment, ownership
  - 27 conditional validation rules (Tier 1 Critical + Tier 2 High)
  - Entity-type-specific requirements
  - KYB tier system (tier_0 to tier_4)
  - Assurance metadata tracking

- **[AgentCredential Specification](agent-credential-v1.md)** - Complete AI agent certification credential
  - 75+ fields covering identity, technical profile, safety, privacy, operations
  - Safety metrics explained (ASR, Robustness Score, Privacy Leakage Score)
  - NIST AI RMF alignment
  - Tool/action risk declarations

- **[Evaluation Metrics](evaluation-metrics-v1.md)** - How safety and privacy metrics are calculated
  - Attack Success Rate methodology
  - Robustness scoring
  - Privacy leakage testing
  - Benchmark references

### 🔍 Schema Registry

**Machine-readable schema definitions:**

- **[Schema Registry](../schemas/README.md)** - Central catalog of all schemas
  - Schema versions and status
  - Validation tool recommendations
  - Version history
  - CI/CD integration examples

- **[AgentCredential Schema v1](../schemas/agent/v1/README.md)** - Version-specific schema docs
  - Field categories and requirements
  - Validation examples (JavaScript, Python, CLI)
  - Common validation errors
  - NIST AI RMF mapping

- **[DeveloperCredential Schema v1](../schemas/developer/v1/README.md)** - Version-specific schema docs
  - Conditional validation rules summary
  - Entity type decision matrix
  - Runtime validation code examples
  - Test suite reference (26 test files)

### 📖 Examples & Templates

**Real-world credential examples:**

- **[Agent Examples](../examples/agent/v1/README.md)** - Simple and complex agent credentials
  - 3 example files (simple, complex, invalid)
  - Detailed scenario explanations
  - Template usage guide
  - Field completion checklist

- **[Developer Examples](../examples/developer/v1/README.md)** - Individual and organization credentials
  - 6 valid scenarios (individual minimal/complete, org tier1/tier2/tier3, high-risk)
  - Entity type decision matrix
  - KYB tier comparison
  - Common validation errors

- **[Test Suite](../examples/developer/v1/tests/README.md)** - Comprehensive validation test cases
  - 26 test files (6 valid, 20 invalid)
  - 10 Tier 1 critical violations
  - 10 Tier 2 data consistency issues
  - Validation instructions

### 🛠️ Integration & Validation

**For developers implementing Beltic:**

- **[Validation Guide](validation-guide.md)** - Complete validation reference
  - Validation tools setup (AJV, jsonschema, gojsonschema)
  - Schema validation vs runtime validation
  - Conditional validation testing
  - Batch validation
  - CI/CD integration (GitHub Actions, GitLab CI)
  - Troubleshooting common errors
  - Performance optimization

- **[Integration Guide](integration-guide.md)** - For merchants and platforms
  - Verification workflow
  - Policy enforcement examples
  - Risk-based access control
  - Assurance level checking
  - Security considerations
  - Production checklist
  - Common integration scenarios (e-commerce, API platforms, marketplaces)

### 👥 By Role

**Navigate by what you're trying to accomplish:**

#### For Agent Developers

1. Start: [Quickstart Guide](quickstart.md) → Create your first DeveloperCredential
2. Understand: [DeveloperCredential Spec](developer-credential-v1.md) → Learn all fields and requirements
3. Customize: [Developer Examples](../examples/developer/v1/README.md) → Choose a template
4. Validate: [Validation Guide](validation-guide.md) → Ensure your credential is correct
5. Test: [Test Suite](../examples/developer/v1/tests/README.md) → Understand validation rules

Then create your AgentCredential:

1. Learn: [AgentCredential Spec](agent-credential-v1.md) → Understand agent requirements
2. Understand Metrics: [Evaluation Metrics](evaluation-metrics-v1.md) → Learn how ASR is calculated
3. Customize: [Agent Examples](../examples/agent/v1/README.md) → Choose a template
4. Validate: [Validation Guide](validation-guide.md) → Check your agent credential

#### For Merchants & Platforms

1. Understand: This [Overview](overview.md) → Learn the trust model
2. Integration: [Integration Guide](integration-guide.md) → Implement credential verification
3. Policies: [Integration Guide - Policy Enforcement](integration-guide.md#policy-enforcement) → Define access rules
4. Validation: [Validation Guide](validation-guide.md) → Set up credential validation
5. Examples: [Agent Examples](../examples/agent/v1/README.md) → See what credentials look like

#### For Regulators & Auditors

1. Framework: This [Overview](overview.md) → Understand assurance levels
2. Standards: [AgentCredential Spec - NIST Mapping](agent-credential-v1.md#nist-ai-rmf-alignment) → AI RMF alignment
3. Verification: [DeveloperCredential Spec - Assurance](developer-credential-v1.md#assurance-metadata) → Verification tracking
4. Examples: [Developer Examples](../examples/developer/v1/README.md) → Review KYC/KYB scenarios
5. Testing: [Test Suite](../examples/developer/v1/tests/README.md) → Understand validation rigor

### 🔗 Quick Links

| Resource | Purpose |
|----------|---------|
| [Quickstart](quickstart.md) | Create your first credential (5 min) |
| [Validation Guide](validation-guide.md) | Complete validation reference |
| [Integration Guide](integration-guide.md) | Verify credentials in your app |
| [Schema Registry](../schemas/README.md) | All schemas and versions |
| [Examples](../examples/) | Templates and test cases |
| [GitHub Discussions](https://github.com/beltic/beltic-spec/discussions) | Ask questions |
| [GitHub Issues](https://github.com/beltic/beltic-spec/issues) | Report problems |
| [Contributing Guide](contributing-spec.md) | Propose changes |

## Version Scope and Limitations

- **v1 Focus:** Ensure every credential communicates developer identity, agent capabilities, data handling, and four safety/privacy robustness metrics. This version is intentionally foundational so developers and merchants can start building trust workflows quickly.
- **Out-of-Scope Items:** Reliability/uptime guarantees, fairness or bias testing, and performance SLAs are not part of v1. Merchants should request these directly from developers as supplemental evidence. See `docs/metrics-roadmap.md` for the detailed roadmap.
- **Future Versions:** v2+ artifacts will live alongside v1 (e.g., `docs/agent-credential-v2.md`, `schemas/*/v2/`). We will not break existing v1 integrations; instead, new capabilities will be additive. Progress toward these goals is tracked in `progress.md`.
