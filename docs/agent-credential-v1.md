# Agent Credential Specification v1

## Document Overview

This document specifies version 1 of the Beltic AgentCredential, which certifies a specific AI agent's identity, capabilities, safety characteristics, and operational parameters. AgentCredentials are always linked to a DeveloperCredential, creating a verifiable chain of accountability from agent behavior back to the responsible developer or organization.

**Version:** 1.0
**Status:** Draft
**Last Updated:** 2025-11-22

**Machine-Readable Schema:** `schemas/agent/v1/agent-credential-v1.schema.json`

---

## Field Categories

Fields are organized into the following categories:
1. Agent Identity & Provenance
2. Technical Profile
3. Tools & Actions
4. Data Handling & Privacy
5. Safety & Robustness Metrics
6. Operations & Lifecycle
7. Risk Summary & Assurance Metadata
8. Cryptographic Identity & Verification

---

## 1. Agent Identity & Provenance

### 1.1 Agent ID

**Field Name:** `agentId`

**Label:** Agent Identifier

**Description:** A globally unique, stable identifier for this specific AI agent. This ID remains constant across versions and updates of the agent, allowing merchants to track the agent's history and associate behaviors with a consistent identity over time.

**Type:** Text (UUID v4 recommended)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be globally unique
- Should be immutable once assigned
- Recommended format: UUID v4 (e.g., "a3f5b2c7-8d1e-4f9a-b2c3-d4e5f6a7b8c9")
- Must remain consistent across agent versions

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes agent identity for accountability)

---

### 1.2 Agent Name

**Field Name:** `agentName`

**Label:** Agent Name

**Description:** Human-readable name for the AI agent, used in user interfaces, logs, and communications. This should be descriptive and help users understand the agent's purpose or role.

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Minimum length: 2 characters
- Maximum length: 200 characters
- Should be unique within a developer's portfolio (recommended)
- May not contain offensive or misleading terms

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (reviewed for misleading claims)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes agent identity for users)

---

### 1.3 Agent Version

**Field Name:** `agentVersion`

**Label:** Agent Version

**Description:** Semantic version identifier for this specific release of the agent, following the format major.minor.patch (e.g., "2.1.3"). Version changes indicate updates to the agent's capabilities, model, system prompt, or safety measures.

**Type:** Text (semantic version string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must follow semantic versioning format (x.y.z)
- Major version increments for breaking changes or significant capability additions
- Minor version increments for backward-compatible functionality additions
- Patch version increments for bug fixes and minor improvements

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (tracks agent evolution and change management)

---

### 1.4 Agent Description

**Field Name:** `agentDescription`

**Label:** Agent Description

**Description:** A clear, concise description of the agent's purpose, intended use cases, and primary capabilities. This helps merchants and users understand what the agent is designed to do and whether it's appropriate for their needs.

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Minimum length: 50 characters
- Maximum length: 1000 characters
- Should describe intended use, not make exaggerated claims
- Must not contain misleading information about capabilities

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (reviewed for accuracy)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (establishes context and intended use)

---

### 1.5 First Release Date

**Field Name:** `firstReleaseDate`

**Label:** First Release Date

**Description:** The date when this agent was first released to production or made available to users. This helps establish the agent's maturity and track record. For agents that evolve significantly, this represents the initial production deployment.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be a valid date in the past
- Cannot be more than 10 years in the past (agents older than this should be re-certified)
- Cannot be in the future

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes agent history and maturity)

---

### 1.6 Current Status

**Field Name:** `currentStatus`

**Label:** Current Status

**Description:** The current operational status of the agent, indicating its stage in the lifecycle and whether it's appropriate for production use, testing, or has been deprecated.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `production` - Agent is production-ready and actively supported
- `beta` - Agent is in beta testing with limited availability
- `alpha` - Agent is in early alpha testing, expect instability
- `internal` - Agent is for internal use only, not public-facing
- `deprecated` - Agent is deprecated, users should migrate to newer version
- `retired` - Agent has been retired and is no longer operational

**Assurance Model:**
- Self-attested: Allowed for development/testing/internal status
- Beltic-verified: Required for production status
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (indicates lifecycle stage and support level)

---

### 1.7 Developer Credential ID

**Field Name:** `developerCredentialId`

**Label:** Developer Credential ID

**Description:** The unique identifier of the DeveloperCredential for the organization or individual that developed this agent. This creates a verifiable link in the trust chain, allowing merchants to verify both the agent and its developer.

**Type:** Text (UUID reference)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be a valid UUID format
- Must reference an existing, valid DeveloperCredential
- Referenced DeveloperCredential must not be revoked or expired

**Assurance Model:**
- Self-attested: Not allowed (must reference valid credential)
- Beltic-verified: Required
- Third-party-verified: Allowed

**NIST AI RMF Tag:** GOVERN (establishes accountability chain)

---

### 1.8 Developer Credential Verified

**Field Name:** `developerCredentialVerified`

**Label:** Developer Credential Verification Status

**Description:** Boolean indicator confirming that the referenced DeveloperCredential has been verified as valid, active, and properly linked to this agent at the time of AgentCredential issuance.

**Type:** Boolean

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `true` - DeveloperCredential verified and valid
- `false` - Verification pending or failed

**Assurance Model:**
- Self-attested: Not allowed (verification performed by issuer)
- Beltic-verified: Set by Beltic during issuance
- Third-party-verified: Set by third-party issuer

**NIST AI RMF Tag:** GOVERN (confirms trust chain integrity)

---

## 2. Technical Profile

### 2.1 Primary Model Provider

**Field Name:** `primaryModelProvider`

**Label:** Primary Model Provider

**Description:** The name of the organization or service that provides the primary large language model or AI model powering this agent (e.g., OpenAI, Anthropic, Google, Meta, open-source community).

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Maximum length: 200 characters
- Should be the official provider name
- For self-hosted open-source models, use "Self-hosted ({model family})"

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through API fingerprinting or attestation)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies underlying technology and associated risks)

---

### 2.2 Primary Model Family

**Field Name:** `primaryModelFamily`

**Label:** Primary Model Family

**Description:** The specific model family or series used (e.g., "GPT-4", "Claude-3", "Gemini", "Llama-3"). This helps verifiers understand the agent's capabilities and any known characteristics or limitations of the model family.

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Maximum length: 200 characters
- Should specify model generation/version when relevant
- May include size variants (e.g., "GPT-4 Turbo", "Claude-3 Opus")
- For hybrid stacks list the orchestrating LLM first and note major deterministic or specialty models in parentheses (e.g., "Claude-3 Opus (vision encoder + rules engine)")

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies model capabilities and known behaviors)

---

### 2.3 Model Context Window

**Field Name:** `modelContextWindow`

**Label:** Model Context Window Size

**Description:** The maximum number of tokens the model can process in a single context window. This affects the agent's ability to handle long conversations, documents, or complex tasks requiring extensive context.

**Type:** Integer

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be positive integer
- Typical range: 4,000 to 1,000,000+ tokens
- Should reflect effective context window, not theoretical maximum
- For hybrid agents, list the narrowest context limit that governs end-user prompts and note any wider retrieval context in description if materially different

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified against provider specifications)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (indicates agent's information processing capacity)

---

### 2.4 Modality Support

**Field Name:** `modalitySupport`

**Label:** Supported Modalities

**Description:** List of input and output modalities the agent can process. This indicates whether the agent is text-only, multimodal, or specialized for specific media types.

**Type:** Array of enums

**Required:** Yes

**Sensitivity:** Public

**Allowed Values (array can contain multiple):**
- `text` - Text input and output
- `image` - Image input and/or generation
- `audio` - Audio input and/or generation (speech, music)
- `video` - Video input and/or generation
- `code` - Specialized code understanding and generation
- `structured_data` - Structured data formats (JSON, CSV, XML)

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through capability testing)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies agent capabilities and use cases)

---

### 2.5 Language Capabilities

**Field Name:** `languageCapabilities`

**Label:** Supported Natural Languages

**Description:** List of natural languages the agent can understand and generate text in, specified using ISO 639-1 two-letter language codes. This helps merchants determine if the agent can serve their linguistic markets.

**Type:** Array of text (ISO 639-1 codes)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Each element must be valid ISO 639-1 two-letter code (e.g., "en", "es", "zh", "ar")
- Array must contain at least one language
- Order indicates relative proficiency (primary language first)

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through language capability testing)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies agent's linguistic capabilities and reach)

---

### 2.6 Architecture Type

**Field Name:** `architectureType`

**Label:** Agent Architecture Type

**Description:** The high-level architectural pattern used to implement this agent. Different architectures have different capabilities, reliability characteristics, and risk profiles.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `single_agent` - Single LLM with system prompt, no additional components
- `rag` - Retrieval-Augmented Generation with knowledge base
- `tool_using` - Agent with access to external tools/APIs
- `multi_agent` - Multiple specialized agents working together
- `agentic_workflow` - Complex workflow with planning, execution, reflection
- `fine_tuned` - Fine-tuned model for specific domain
- `hybrid` - Combination of multiple architectural patterns

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies architectural complexity and capabilities)

---

### 2.7 System Config Fingerprint

**Field Name:** `systemConfigFingerprint`

**Label:** System Configuration Fingerprint

**Description:** A cryptographic hash (SHA-256) of the agent's system prompt, configuration parameters, and any critical instructions that define its behavior. This allows verification that the agent's core behavior has not changed without corresponding credential updates.

**Type:** Text (SHA-256 hex string)

**Required:** Yes

**Sensitivity:** Restricted

**Constraints:**
- Must be valid SHA-256 hash (64 hexadecimal characters)
- Should be recomputed whenever system prompt or config changes
- Hash should include: system prompt, temperature, top-p, stop sequences, safety settings
- For multi-component or agentic workflows, include orchestrator logic, deterministic guard rails, and key tool routing policies so verifiers can detect meaningful behavior drift

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (hash verified against submitted config)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MEASURE (enables configuration integrity verification)

---

### 2.8 System Config Last Updated

**Field Name:** `systemConfigLastUpdated`

**Label:** System Configuration Last Updated

**Description:** The date when the agent's system prompt or configuration was last modified. Frequent changes may indicate an unstable agent, while very old configurations may indicate lack of maintenance.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be a valid date
- Must be at or before current date
- Must be at or after first release date

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (tracks configuration change management)

---

### 2.9 Deployment Environment

**Field Name:** `deploymentEnvironment`

**Label:** Deployment Environment

**Description:** General description of where and how the agent is deployed, including cloud provider and region at a high level. This provides transparency about infrastructure without exposing sensitive security details.

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Maximum length: 500 characters
- Should describe general infrastructure (e.g., "AWS US-East", "Azure Europe", "On-premises", "Hybrid cloud")
- Should NOT include specific IP addresses, subnets, or detailed architecture diagrams
- Should focus on geographic deployment and general platform

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies infrastructure context and jurisdiction)

---

### 2.10 Compliance Certifications

**Field Name:** `complianceCertifications`

**Label:** Infrastructure Compliance Certifications

**Description:** List of compliance certifications held by the infrastructure where the agent is deployed (e.g., SOC 2, ISO 27001, HIPAA). This helps merchants understand if the agent's infrastructure meets regulatory requirements.

**Type:** Array of enums

**Required:** No

**Sensitivity:** Public

**Allowed Values (array can contain multiple):**
- `soc2_type1` - SOC 2 Type I certification
- `soc2_type2` - SOC 2 Type II certification
- `iso27001` - ISO/IEC 27001 Information Security
- `iso27017` - ISO/IEC 27017 Cloud Security
- `iso27018` - ISO/IEC 27018 Cloud Privacy
- `hipaa` - HIPAA compliance for healthcare data
- `pci_dss` - PCI DSS for payment card data
- `fedramp` - FedRAMP authorization (specify level in description)
- `gdpr_compliant` - GDPR compliance measures in place
- `ccpa_compliant` - CCPA compliance measures in place

**Assurance Model:**
- Self-attested: Not allowed for certification claims
- Beltic-verified: Required (verification of valid certificates)
- Third-party-verified: Required for regulated industries

**NIST AI RMF Tag:** GOVERN (demonstrates infrastructure governance and compliance)

---

### 2.11 Data Location Profile

**Field Name:** `dataLocationProfile`

**Label:** Data Location & Sovereignty Profile

**Description:** Structured declaration of where agent data is stored, processed, and backed up. Consolidating this information helps merchants and regulators quickly evaluate localization, residency, and export-control requirements without juggling multiple fields.

**Type:** Object containing:
- `storageRegions` (array of ISO 3166-1 alpha-2 codes, required) – primary data-at-rest locations
- `processingRegions` (array of ISO 3166-1 alpha-2 codes, required) – compute/inference regions
- `backupRegions` (array of ISO 3166-1 codes, optional) – disaster-recovery or cold backups
- `notes` (text, optional, max 500 chars) – clarifications such as contractual residency guarantees or in-progress migrations

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Each array must contain at least one region and use valid ISO codes
- `storageRegions` must include every region storing user logs, caches, or persisted state
- `processingRegions` must enumerate all regions where inference or tool execution occurs, even transient burst capacity
- `backupRegions` may repeat entries from storage if backups never leave the same jurisdiction
- Notes should call out any jurisdictions with special access controls (e.g., “EU-only data plane under Schrems II SCCs”)

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (validated via infrastructure audit or attestation)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes data sovereignty and jurisdiction)

---

## 3. Tools & Actions

### 3.1 Tools List

**Field Name:** `toolsList`

**Label:** Agent Tools and Actions

**Description:** Comprehensive list of all tools, APIs, and actions the agent can invoke. Each tool is classified by risk category to help merchants assess potential impact. This field uses a hierarchical risk taxonomy with main categories and sub-categories for precise risk assessment.

**Type:** Array of objects, each containing:
- `toolId` (text, required) - Unique identifier for the tool
- `toolName` (text, required) - Human-readable tool name
- `toolDescription` (text, required) - What the tool does and why it exists
- `riskCategory` (enum, required) - Main risk category: `data` / `compute` / `financial` / `external`
- `riskSubcategory` (enum, required) - Specific sub-classification within category
- `requiresAuth` (boolean, required) - Whether tool requires authentication/authorization
- `requiresHumanApproval` (boolean, required) - Whether tool requires human confirmation before execution

**Required:** Yes (if agent has tools); Optional (if agent is tools-free)

**Sensitivity:** Public

**Risk Categories and Sub-categories:**

**Data:**
- `data_read_internal` - Read from internal databases or knowledge bases
- `data_read_external` - Read from external APIs or services
- `data_write_internal` - Write to internal databases
- `data_write_external` - Write to external services
- `data_delete` - Delete or modify existing data
- `data_export` - Export data to external systems

**Compute:**
- `compute_code_execution` - Execute code or scripts
- `compute_query_generation` - Generate database queries
- `compute_api_call` - Make API calls to services
- `compute_transformation` - Transform or process data
- `compute_analysis` - Perform analysis or calculations

**Financial:**
- `financial_read` - Read financial information
- `financial_transaction` - Initiate financial transactions
- `financial_account_access` - Access financial accounts
- `financial_payment_initiation` - Initiate payments

**External:**
- `external_internet_access` - General internet access
- `external_email` - Send emails
- `external_notification` - Send notifications (SMS, push, etc.)
- `external_authentication` - Authenticate with external services
- `external_file_access` - Access file systems

**Constraints:**
- Array can be empty if agent has no tools
- Each tool must have unique toolId
- Tool descriptions must be clear and accurate
- Risk classifications must be assigned by security review
- Derived counts (total tools, high-risk tools) are computed by Beltic verifiers directly from this list; developers do not need to maintain separate numeric fields

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through code review and testing)
- Third-party-verified: Required for high-risk tools (financial, data deletion)

**NIST AI RMF Tag:** MAP (identifies agent capabilities and associated risks)

---

### 3.2 Tools Last Audited

**Field Name:** `toolsLastAudited`

**Label:** Tools Last Audited Date

**Description:** The date when the agent's tools were last reviewed and audited for security, safety, and proper risk classification. Regular audits ensure tools haven't been modified or added without proper review.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes (if `toolsList` contains at least one tool)

**Sensitivity:** Public

**Constraints:**
- Must be a valid date in the past
- Should not be more than 180 days old for production agents
- Must be at or after system config last updated date

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Required for high-risk tools

**NIST AI RMF Tag:** MANAGE (tracks ongoing tool governance)

---

## 4. Data Handling & Privacy

### 4.1 Data Categories Processed

**Field Name:** `dataCategoriesProcessed`

**Label:** Data Categories Processed

**Description:** List of types of sensitive data that the agent may process, store, or transmit. This helps merchants understand privacy and compliance implications.

**Type:** Array of enums

**Required:** Yes

**Sensitivity:** Public

**Allowed Values (array can contain multiple):**
- `none` - Agent processes no sensitive data (mutually exclusive with other values)
- `pii` - Personally Identifiable Information (names, addresses, IDs)
- `phi` - Protected Health Information (medical records, health data)
- `financial` - Financial information (bank accounts, credit cards, transactions)
- `biometric` - Biometric data (fingerprints, facial recognition, voice)
- `behavioral` - Behavioral data (browsing history, usage patterns)
- `authentication` - Authentication credentials (passwords, tokens, keys)
- `proprietary` - Proprietary or confidential business information
- `government_id` - Government-issued identifiers (SSN, passport numbers)
- `children_data` - Data related to children under 13 (COPPA)

**Constraints:**
- Array must contain at least one value
- If `none` is selected it must be the only value present

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through data flow analysis)
- Third-party-verified: Required for regulated data types (PHI, financial)

**NIST AI RMF Tag:** MAP (identifies data-related risks and compliance requirements)

---

### 4.2 Data Retention Max Period

**Field Name:** `dataRetentionMaxPeriod`

**Label:** Maximum Data Retention Period

**Description:** The maximum duration that any user data (inputs, outputs, logs) is retained by the agent or its infrastructure. After this period, data must be deleted or anonymized.

**Type:** Text (ISO 8601 duration format)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid ISO 8601 duration (e.g., "P30D" for 30 days, "P1Y" for 1 year)
- Common values: "P0D" (no retention), "P30D" (30 days), "P90D" (90 days), "P1Y" (1 year)
- Shorter retention is generally lower risk

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through infrastructure audit)
- Third-party-verified: Required for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes data governance policy)

---

### 4.3 Data Retention By Category

**Field Name:** `dataRetentionByCategory`

**Label:** Data Retention by Category

**Description:** Detailed retention periods for specific data categories. Some data types may have shorter or longer retention requirements than the overall maximum.

**Type:** Object mapping data categories to ISO 8601 duration strings

**Required:** No (Recommended if processing multiple sensitive data types)

**Sensitivity:** Public

**Example:**
```json
{
  "pii": "P30D",
  "financial": "P90D",
  "behavioral": "P7D",
  "logs": "P1Y"
}
```

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Required for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes granular data governance)

---

### 4.4 Training Data Usage

**Field Name:** `trainingDataUsage`

**Label:** User Data Training Usage Policy

**Description:** Indicates whether and how user interaction data may be used for training, fine-tuning, or improving the agent's model. This is critical for privacy and intellectual property considerations.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `never` - User data is never used for training or model improvement
- `anonymized_only` - Only anonymized/de-identified data may be used
- `aggregated_only` - Only aggregated statistics, no individual data
- `with_explicit_consent` - Used only when user provides explicit opt-in consent
- `opt_out_available` - Used by default, but users can opt out
- `not_applicable` - Agent uses third-party model with no training access

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through data flow audit)
- Third-party-verified: Required for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes data use policy)

---

### 4.5 PII Detection Enabled

**Field Name:** `piiDetectionEnabled`

**Label:** PII Detection Enabled

**Description:** Boolean indicator of whether the agent has active PII detection capabilities to identify personally identifiable information in user inputs and agent outputs.

**Type:** Boolean

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `true` - PII detection is enabled
- `false` - No PII detection (higher risk)

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through testing)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MEASURE (indicates privacy protection capability)

---

### 4.6 PII Redaction Capability

**Field Name:** `piiRedactionCapability`

**Label:** PII Redaction Capability Level

**Description:** The sophistication level of the agent's PII redaction capabilities, indicating how effectively it can automatically redact or mask PII from logs, outputs, and stored data.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `none` - No PII redaction capability
- `basic` - Basic pattern matching (email addresses, phone numbers, credit cards)
- `advanced` - ML-based detection of names, addresses, and contextual PII
- `context_aware` - Advanced context-aware redaction with entity recognition

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through PII leakage testing)
- Third-party-verified: Required for regulated industries

**NIST AI RMF Tag:** MEASURE (quantifies privacy protection effectiveness)

---

### 4.7 PII Redaction Pipeline

**Field Name:** `piiRedactionPipeline`

**Label:** PII Redaction Pipeline Description

**Description:** Description of where and how PII redaction is applied in the agent's data processing pipeline (e.g., "Applied to all inputs before model processing and to all outputs before logging").

**Type:** Text (string)

**Required:** No (Recommended if piiDetectionEnabled is true)

**Sensitivity:** Public

**Constraints:**
- Maximum length: 1000 characters
- Should describe specific pipeline stages where redaction occurs
- Should note any exceptions or limitations

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (describes privacy control implementation)

---

### 4.8 Data Encryption Standards

**Field Name:** `dataEncryptionStandards`

**Label:** Data Encryption Standards

**Description:** List of encryption standards and methods used to protect data at rest and in transit. This indicates the cryptographic security posture of the agent's data handling.

**Type:** Array of text (descriptions of encryption standards)

**Required:** Yes

**Sensitivity:** Public

**Example values:**
- "AES-256 at rest"
- "TLS 1.3 in transit"
- "End-to-end encryption for user sessions"
- "Field-level encryption for PII"

**Constraints:**
- Array must contain at least one encryption standard
- Should specify both at-rest and in-transit encryption
- Should use industry-standard encryption (AES-256, TLS 1.2+, etc.)

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through infrastructure audit)
- Third-party-verified: Required for regulated industries

**NIST AI RMF Tag:** MANAGE (describes security controls)

---

## 5. Safety & Robustness Metrics

This section contains four primary safety metrics, each with five associated metadata fields (benchmark, version, evaluation date, assurance source, and additional context). These metrics are critical for merchants to assess the agent's resistance to various attack vectors and harmful behaviors.

### 5.1 Harmful Content Refusal Rate

**Field Name:** `harmfulContentRefusalScore`

**Label:** Harmful Content Refusal Score

**Description:** Percentage score (0-100) indicating the agent's success rate at refusing to generate harmful, dangerous, illegal, or unethical content when prompted. Higher scores indicate better safety. This measures resistance to jailbreaking and harmful content generation.

**Type:** Numeric (float, 0-100)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be numeric value between 0 and 100
- Higher values indicate better safety (100 = perfect refusal)
- Should be based on standardized benchmark evaluation

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through Beltic safety testing)
- Third-party-verified: Required for high-risk use cases

**NIST AI RMF Tag:** MEASURE (quantifies safety against harmful content generation)

---

### 5.2 Harmful Content Benchmark Name

**Field Name:** `harmfulContentBenchmarkName`

**Label:** Harmful Content Benchmark Name

**Description:** The name of the standardized test suite or benchmark used to evaluate harmful content refusal (e.g., "Beltic Harmful Content Suite v2", "HELM Safety Benchmark", "ToxicChat").

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Maximum length: 200 characters
- Should reference recognized safety benchmark
- Should be reproducible by verifiers

**Assurance Model:**
- Self-attested: Must specify benchmark used
- Beltic-verified: Uses Beltic-approved benchmarks
- Third-party-verified: Uses industry-standard benchmarks

**NIST AI RMF Tag:** MEASURE (establishes evaluation methodology)

---

### 5.3 Harmful Content Benchmark Version

**Field Name:** `harmfulContentBenchmarkVersion`

**Label:** Harmful Content Benchmark Version

**Description:** The specific version of the benchmark used, as benchmarks evolve over time to include new attack patterns and adversarial techniques.

**Type:** Text (version string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Should follow semantic versioning or benchmark's versioning scheme
- Enables comparison across time and between agents

**Assurance Model:**
- Self-attested: Must specify version
- Beltic-verified: Version verified by Beltic
- Third-party-verified: Version verified by third-party

**NIST AI RMF Tag:** MEASURE (establishes evaluation version for reproducibility)

---

### 5.4 Harmful Content Evaluation Date

**Field Name:** `harmfulContentEvaluationDate`

**Label:** Harmful Content Evaluation Date

**Description:** The date when the harmful content refusal evaluation was conducted. More recent evaluations provide more current safety assessments.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid date in the past
- Should not be more than 180 days old for production agents
- Must be at or after first release date

**Assurance Model:**
- Self-attested: Date of self-evaluation
- Beltic-verified: Date of Beltic evaluation
- Third-party-verified: Date of third-party evaluation

**NIST AI RMF Tag:** MEASURE (indicates evaluation currency)

---

### 5.5 Harmful Content Assurance Source

**Field Name:** `harmfulContentAssuranceSource`

**Label:** Harmful Content Assurance Source

**Description:** Indicates who performed the harmful content evaluation and at what assurance level.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `self` - Self-evaluation by developer
- `beltic` - Evaluation performed by Beltic
- `third_party` - Independent third-party evaluation (specify auditor in notes)

**Assurance Model:**
- Self-attested: Value must be "self"
- Beltic-verified: Value must be "beltic"
- Third-party-verified: Value must be "third_party"

**NIST AI RMF Tag:** GOVERN (establishes evaluation authority)

---

### 5.6 Prompt Injection Robustness Score

**Field Name:** `promptInjectionRobustnessScore`

**Label:** Prompt Injection Robustness Score (Attack Success Rate)

**Description:** Derived robustness score (0-100) based on Attack Success Rate (ASR) for prompt injection attacks. This measures the agent's ability to resist attempts to override its instructions, leak system prompts, or execute unauthorized actions. Score = 100 - ASR, so higher scores indicate better robustness.

**Type:** Numeric (float, 0-100)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be numeric value between 0 and 100
- Calculated as: Score = 100 - (Attack Success Rate %)
- Higher values indicate better robustness (100 = no successful attacks)
- Should be based on diverse prompt injection techniques

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through Beltic adversarial testing)
- Third-party-verified: Required for high-risk use cases

**NIST AI RMF Tag:** MEASURE (quantifies robustness against prompt injection)

---

### 5.7 Prompt Injection Benchmark Name

**Field Name:** `promptInjectionBenchmarkName`

**Label:** Prompt Injection Benchmark Name

**Description:** The name of the test suite used to evaluate prompt injection robustness (e.g., "Beltic Prompt Injection Suite", "TensorTrust", "Gandalf").

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Maximum length: 200 characters
- Should reference recognized adversarial testing benchmark

**Assurance Model:**
- Self-attested: Must specify benchmark used
- Beltic-verified: Uses Beltic-approved benchmarks
- Third-party-verified: Uses industry-standard benchmarks

**NIST AI RMF Tag:** MEASURE (establishes evaluation methodology)

---

### 5.8 Prompt Injection Benchmark Version

**Field Name:** `promptInjectionBenchmarkVersion`

**Label:** Prompt Injection Benchmark Version

**Description:** The specific version of the prompt injection benchmark, as attack techniques evolve rapidly.

**Type:** Text (version string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Should follow benchmark's versioning scheme
- Enables tracking of evaluation rigor over time

**Assurance Model:**
- Self-attested: Must specify version
- Beltic-verified: Version verified by Beltic
- Third-party-verified: Version verified by third-party

**NIST AI RMF Tag:** MEASURE (establishes evaluation version)

---

### 5.9 Prompt Injection Evaluation Date

**Field Name:** `promptInjectionEvaluationDate`

**Label:** Prompt Injection Evaluation Date

**Description:** The date when prompt injection testing was conducted. Prompt injection techniques evolve quickly, so recent evaluation is important.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid date in the past
- Should not be more than 90 days old for production agents (attacks evolve quickly)
- Must be at or after first release date

**Assurance Model:**
- Self-attested: Date of self-evaluation
- Beltic-verified: Date of Beltic evaluation
- Third-party-verified: Date of third-party evaluation

**NIST AI RMF Tag:** MEASURE (indicates evaluation currency)

---

### 5.10 Prompt Injection Assurance Source

**Field Name:** `promptInjectionAssuranceSource`

**Label:** Prompt Injection Assurance Source

**Description:** Indicates who performed the prompt injection evaluation.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `self` - Self-evaluation by developer
- `beltic` - Evaluation performed by Beltic
- `third_party` - Independent third-party evaluation

**Assurance Model:**
- Self-attested: Value must be "self"
- Beltic-verified: Value must be "beltic"
- Third-party-verified: Value must be "third_party"

**NIST AI RMF Tag:** GOVERN (establishes evaluation authority)

---

### 5.11 Tool Abuse Robustness Score

**Field Name:** `toolAbuseRobustnessScore`

**Label:** Tool Abuse Robustness Score

**Description:** Score (0-100) measuring the agent's resistance to being tricked into using tools inappropriately, outside their intended scope, or in ways that bypass authorization checks. Higher scores indicate better tool safety.

**Type:** Numeric (float, 0-100)

**Required:** Yes (if agent has tools); Optional (if agent is tools-free)

**Sensitivity:** Public

**Constraints:**
- Must be numeric value between 0 and 100
- Higher values indicate better tool safety
- Should test unauthorized tool use, privilege escalation, and tool chaining attacks

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through tool abuse testing)
- Third-party-verified: Required for high-risk tools

**NIST AI RMF Tag:** MEASURE (quantifies tool safety and authorization robustness)

---

### 5.12 Tool Abuse Benchmark Name

**Field Name:** `toolAbuseBenchmarkName`

**Label:** Tool Abuse Benchmark Name

**Description:** The name of the test suite used to evaluate tool abuse resistance (e.g., "Beltic Tool Safety Suite", "AgentBench Security").

**Type:** Text (string)

**Required:** Yes (if toolAbuseRobustnessScore is set)

**Sensitivity:** Public

**Constraints:**
- Maximum length: 200 characters
- Should test tool authorization, scope, and abuse scenarios

**Assurance Model:**
- Self-attested: Must specify benchmark used
- Beltic-verified: Uses Beltic-approved benchmarks
- Third-party-verified: Uses industry-standard benchmarks

**NIST AI RMF Tag:** MEASURE (establishes evaluation methodology)

---

### 5.13 Tool Abuse Benchmark Version

**Field Name:** `toolAbuseBenchmarkVersion`

**Label:** Tool Abuse Benchmark Version

**Description:** The specific version of the tool abuse testing benchmark.

**Type:** Text (version string)

**Required:** Yes (if toolAbuseRobustnessScore is set)

**Sensitivity:** Public

**Constraints:**
- Should follow benchmark's versioning scheme

**Assurance Model:**
- Self-attested: Must specify version
- Beltic-verified: Version verified by Beltic
- Third-party-verified: Version verified by third-party

**NIST AI RMF Tag:** MEASURE (establishes evaluation version)

---

### 5.14 Tool Abuse Evaluation Date

**Field Name:** `toolAbuseEvaluationDate`

**Label:** Tool Abuse Evaluation Date

**Description:** The date when tool abuse testing was conducted.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes (if toolAbuseRobustnessScore is set)

**Sensitivity:** Public

**Constraints:**
- Must be valid date in the past
- Should not be more than 180 days old for production agents
- Must be at or after first release date

**Assurance Model:**
- Self-attested: Date of self-evaluation
- Beltic-verified: Date of Beltic evaluation
- Third-party-verified: Date of third-party evaluation

**NIST AI RMF Tag:** MEASURE (indicates evaluation currency)

---

### 5.15 Tool Abuse Assurance Source

**Field Name:** `toolAbuseAssuranceSource`

**Label:** Tool Abuse Assurance Source

**Description:** Indicates who performed the tool abuse evaluation.

**Type:** Enum

**Required:** Yes (if toolAbuseRobustnessScore is set)

**Sensitivity:** Public

**Allowed Values:**
- `self` - Self-evaluation by developer
- `beltic` - Evaluation performed by Beltic
- `third_party` - Independent third-party evaluation

**Assurance Model:**
- Self-attested: Value must be "self"
- Beltic-verified: Value must be "beltic"
- Third-party-verified: Value must be "third_party"

**NIST AI RMF Tag:** GOVERN (establishes evaluation authority)

---

### 5.16 PII Leakage Robustness Score

**Field Name:** `piiLeakageRobustnessScore`

**Label:** PII Leakage Robustness Score

**Description:** Score (0-100) measuring the agent's resistance to leaking personally identifiable information, system prompts, or other sensitive data through adversarial prompting, extraction attacks, or unintended disclosure. Higher scores indicate better privacy protection.

**Type:** Numeric (float, 0-100)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be numeric value between 0 and 100
- Higher values indicate better privacy protection
- Should test PII extraction, system prompt leakage, and context leakage attacks

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through leakage testing)
- Third-party-verified: Required for agents processing sensitive data

**NIST AI RMF Tag:** MEASURE (quantifies privacy and confidentiality robustness)

---

### 5.17 PII Leakage Benchmark Name

**Field Name:** `piiLeakageBenchmarkName`

**Label:** PII Leakage Benchmark Name

**Description:** The name of the test suite used to evaluate PII leakage resistance (e.g., "Beltic Privacy Leakage Suite", "PIBench").

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Maximum length: 200 characters
- Should test extraction attacks, inference attacks, and unintended disclosure

**Assurance Model:**
- Self-attested: Must specify benchmark used
- Beltic-verified: Uses Beltic-approved benchmarks
- Third-party-verified: Uses industry-standard benchmarks

**NIST AI RMF Tag:** MEASURE (establishes evaluation methodology)

---

### 5.18 PII Leakage Benchmark Version

**Field Name:** `piiLeakageBenchmarkVersion`

**Label:** PII Leakage Benchmark Version

**Description:** The specific version of the PII leakage testing benchmark.

**Type:** Text (version string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Should follow benchmark's versioning scheme

**Assurance Model:**
- Self-attested: Must specify version
- Beltic-verified: Version verified by Beltic
- Third-party-verified: Version verified by third-party

**NIST AI RMF Tag:** MEASURE (establishes evaluation version)

---

### 5.19 PII Leakage Evaluation Date

**Field Name:** `piiLeakageEvaluationDate`

**Label:** PII Leakage Evaluation Date

**Description:** The date when PII leakage testing was conducted.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid date in the past
- Should not be more than 180 days old for production agents
- Must be at or after first release date

**Assurance Model:**
- Self-attested: Date of self-evaluation
- Beltic-verified: Date of Beltic evaluation
- Third-party-verified: Date of third-party evaluation

**NIST AI RMF Tag:** MEASURE (indicates evaluation currency)

---

### 5.20 PII Leakage Assurance Source

**Field Name:** `piiLeakageAssuranceSource`

**Label:** PII Leakage Assurance Source

**Description:** Indicates who performed the PII leakage evaluation.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `self` - Self-evaluation by developer
- `beltic` - Evaluation performed by Beltic
- `third_party` - Independent third-party evaluation

**Assurance Model:**
- Self-attested: Value must be "self"
- Beltic-verified: Value must be "beltic"
- Third-party-verified: Value must be "third_party"

**NIST AI RMF Tag:** GOVERN (establishes evaluation authority)

---

## 6. Operations & Lifecycle

### 6.1 Incident Response Contact

**Field Name:** `incidentResponseContact`

**Label:** Incident Response Contact Email

**Description:** Dedicated email address for reporting security incidents, safety issues, or urgent problems with the agent. This should be monitored 24/7 or have automated escalation.

**Type:** Email address (text)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid email format
- Should be dedicated security/incident response address
- Must be verified and actively monitored
- Maximum length: 254 characters

**Assurance Model:**
- Self-attested: Allowed for development/testing (with email verification)
- Beltic-verified: Required for production use (includes response time verification)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (enables incident response)

---

### 6.2 Incident Response SLO

**Field Name:** `incidentResponseSLO`

**Label:** Incident Response Service Level Objective

**Description:** Maximum time duration for initial response to reported security incidents or safety issues. This sets expectations for incident handling speed.

**Type:** Text (ISO 8601 duration format)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid ISO 8601 duration
- Common values: "PT1H" (1 hour), "PT4H" (4 hours), "PT24H" (24 hours)
- Shorter SLOs indicate better incident response capability

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (SLO adherence monitored)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (establishes incident response expectations)

---

### 6.3 Deprecation Policy

**Field Name:** `deprecationPolicy`

**Label:** Deprecation Policy Summary

**Description:** Summary of the developer's policy for deprecating and retiring agent versions, including notice periods and migration support.

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Maximum length: 1000 characters
- Should specify minimum notice period for deprecation
- Should describe migration support and backwards compatibility approach
- Should reference full policy document URL if available

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (policy reviewed for adequacy)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (establishes lifecycle management expectations)

---

### 6.4 Update Cadence

**Field Name:** `updateCadence`

**Label:** Agent Update Cadence

**Description:** How frequently the agent receives updates, improvements, or security patches. More frequent updates may indicate better maintenance but also more change risk.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `continuous` - Continuous deployment, multiple updates per week
- `weekly` - Weekly update cycle
- `biweekly` - Updates every two weeks
- `monthly` - Monthly update cycle
- `quarterly` - Quarterly updates
- `as_needed` - Updates on-demand for critical issues only
- `no_updates` - No updates planned (may indicate deprecated agent)

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through release history)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (indicates maintenance and support level)

---

### 6.5 Human Oversight Mode

**Field Name:** `humanOversightMode`

**Label:** Human Oversight Mode

**Description:** Declares how human operators supervise or approve the agent’s actions, especially when tools can change data, spend money, or impact safety-critical workflows. Makes clear to merchants whether the agent is autonomous or requires human checkpoints.

**Type:** Enum

**Required:** Yes (production)

**Sensitivity:** Public

**Allowed Values:**
- `autonomous_low_risk` – Fully autonomous, limited to read-only or low-impact tasks
- `human_review_pre_action` – Human approval required before high-risk tools execute
- `human_review_post_action` – Human reviews samples or audit logs after execution
- `human_initiated_only` – Agent cannot act until a human explicitly triggers each task
- `custom_handover` – Custom oversight model (details must be provided in failSafeBehavior)

**Constraints:**
- Value must align with per-tool `requiresHumanApproval` flags in `toolsList`
- High-risk or regulated use cases must use `human_review_pre_action`, `human_initiated_only`, or document compensating controls in `failSafeBehavior`

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (validated during safety review)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (establishes human oversight expectations)

---

### 6.6 Fail-Safe Behavior

**Field Name:** `failSafeBehavior`

**Label:** Fail-Safe / Shutdown Behavior

**Description:** Plain-language summary of how the agent safely degrades, pauses, or escalates when it encounters ambiguous intent, policy violations, or tooling failures. This is where developers explain refusal patterns, circuit-breakers, and how humans are paged.

**Type:** Text (string)

**Required:** Yes (for production); Optional for tools-free informational agents

**Sensitivity:** Public

**Constraints:**
- Minimum length: 50 characters; maximum length: 800 characters
- Must cover at least: (1) what triggers the fail-safe, (2) what the agent does (e.g., refuse, quarantine, notify), and (3) who is alerted
- Should align with `humanOversightMode` and tool risk classifications

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (validated via runbooks or demos)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (documents failure mode handling)

---

### 6.7 Monitoring Coverage

**Field Name:** `monitoringCoverage`

**Label:** Runtime Monitoring & Alerting Coverage

**Description:** Describes how the agent is monitored in production—what telemetry is collected, how often it is reviewed, and which anomalies trigger alerts. Provides confidence that safety issues will be detected quickly.

**Type:** Text (string)

**Required:** Yes (for production)

**Sensitivity:** Public

**Constraints:**
- Minimum length: 50 characters; maximum length: 800 characters
- Should cover log retention, automated detectors (e.g., prompt-injection catchers), and human review cadence
- Must list the channel or system that receives high-severity alerts (e.g., PagerDuty, SOC inbox)

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (Beltic may request evidence of alerting)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (establishes monitoring and response readiness)

---

### 6.8 Credential Issuance Date

**Field Name:** `credentialIssuanceDate`

**Label:** Credential Issuance Date

**Description:** The date and time when this AgentCredential was issued by Beltic or a third-party verifier.

**Type:** DateTime (ISO 8601 format with timezone: YYYY-MM-DDTHH:MM:SSZ)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid datetime
- Should be at or before current time (allowing small clock skew)
- Must be at or after first release date

**Assurance Model:**
- Self-attested: Not allowed (set by issuer)
- Beltic-verified: Set by Beltic
- Third-party-verified: Set by third-party issuer

**NIST AI RMF Tag:** GOVERN (establishes credential timeline)

---

### 6.9 Credential Expiration Date

**Field Name:** `credentialExpirationDate`

**Label:** Credential Expiration Date

**Description:** The date and time when this AgentCredential expires. Agents should be re-evaluated and re-certified periodically as capabilities and risks evolve.

**Type:** DateTime (ISO 8601 format with timezone: YYYY-MM-DDTHH:MM:SSZ)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be after issuance date
- Typical validity periods:
  - Self-attested: 30-90 days
  - Beltic-verified: 6 months to 1 year
  - Third-party-verified: 6 months to 2 years
- Should be shorter for agents with high-risk tools or capabilities

**Assurance Model:**
- Self-attested: Not allowed (set by issuer)
- Beltic-verified: Set by Beltic
- Third-party-verified: Set by third-party issuer

**NIST AI RMF Tag:** GOVERN (ensures periodic re-evaluation)

---

## 7. Risk Summary & Assurance Metadata

### 7.1 Overall Safety Rating

**Field Name:** `overallSafetyRating`

**Label:** Overall Safety Risk Rating

**Description:** Composite risk rating derived from all safety metrics, tools, data handling, and evaluation results. This provides a quick high-level assessment for merchants.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `minimal_risk` - Very low risk, suitable for most use cases
- `low_risk` - Low risk with appropriate safeguards
- `moderate_risk` - Moderate risk requiring oversight and monitoring
- `high_risk` - High risk requiring enhanced controls and human oversight
- `evaluation_pending` - Risk rating not yet determined

**Assurance Model:**
- Self-attested: Not allowed (must be derived from evaluations)
- Beltic-verified: Required (calculated by Beltic based on metrics)
- Third-party-verified: Calculated by third-party based on comprehensive audit

**NIST AI RMF Tag:** MAP (provides overall risk assessment)

---

### 7.2 Approved Use Cases

**Field Name:** `approvedUseCases`

**Label:** Approved Use Cases

**Description:** List of use case categories or domains where this agent has been evaluated and approved for deployment. This helps merchants determine if the agent is appropriate for their specific needs.

**Type:** Array of text (use case descriptions)

**Required:** No (Recommended)

**Sensitivity:** Public

**Example values:**
- "Customer service and support"
- "Content generation and editing"
- "Data analysis and reporting"
- "Software development assistance"
- "Educational tutoring"
- "Research assistance"

**Constraints:**
- Should be specific enough to be meaningful
- Should align with agent's evaluated capabilities and safety testing

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through use case testing)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (establishes appropriate use context)

---

### 7.3 Prohibited Use Cases

**Field Name:** `prohibitedUseCases`

**Label:** Prohibited Use Cases

**Description:** List of use cases or applications where this agent should NOT be deployed, either due to safety limitations, lack of evaluation, or ethical considerations.

**Type:** Array of text (prohibited use descriptions)

**Required:** No (Recommended)

**Sensitivity:** Public

**Example values:**
- "Medical diagnosis or treatment recommendations"
- "Legal advice"
- "Financial investment decisions"
- "Child care or supervision"
- "Critical infrastructure control"
- "Weapons development"

**Constraints:**
- Should be specific and clear
- Should include high-risk domains not covered by evaluations

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies inappropriate use cases)

---

### 7.4 Age Restrictions

**Field Name:** `ageRestrictions`

**Label:** Age Restrictions

**Description:** Minimum age requirement for users interacting with this agent, based on content, capabilities, or data handling considerations.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `none` - No age restrictions, suitable for all ages
- `13+` - Minimum age 13 (COPPA compliance)
- `16+` - Minimum age 16
- `18+` - Minimum age 18 (adult content or services)
- `21+` - Minimum age 21 (regulated substances, gambling)

**Assurance Model:**
- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified through content review)
- Third-party-verified: Required for regulated age-restricted services

**NIST AI RMF Tag:** GOVERN (establishes age-appropriate use policy)

---

### 7.5 Regulatory Approvals

**Field Name:** `regulatoryApprovals`

**Label:** Regulatory Approvals

**Description:** List of specific regulatory approvals, certifications, or compliance attestations the agent has received for use in regulated industries or jurisdictions.

**Type:** Array of text (approval descriptions)

**Required:** No

**Sensitivity:** Public

**Example values:**
- "HIPAA compliant for healthcare data"
- "SOC 2 Type II certified"
- "GDPR compliant"
- "FDA Class II medical device (pending)"
- "FINRA approved for financial services"

**Constraints:**
- Should specify jurisdiction and regulatory body
- Should include certification/approval number or reference

**Assurance Model:**
- Self-attested: Not allowed for regulatory claims
- Beltic-verified: Required (verification of valid certifications)
- Third-party-verified: Required for regulated industries

**NIST AI RMF Tag:** GOVERN (demonstrates regulatory compliance)

---

### 7.6 KYB Tier Required

**Field Name:** `kybTierRequired`

**Label:** Minimum Developer KYB Tier Required

**Description:** The minimum KYB verification tier that the linked DeveloperCredential must have for this AgentCredential to be considered valid. This ensures appropriate developer verification for the agent's risk level.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `tier_0` - No minimum requirement (for development/testing only)
- `tier_1` - Basic verification required
- `tier_2` - Standard KYB required
- `tier_3` - Enhanced due diligence required
- `tier_4` - Maximum due diligence required

**Constraints:**
- Higher risk agents should require higher KYB tiers
- Must not exceed the actual KYB tier of linked DeveloperCredential

**Assurance Model:**
- Self-attested: Not allowed (set by issuer based on risk assessment)
- Beltic-verified: Set by Beltic based on agent risk profile
- Third-party-verified: Set by third-party based on regulatory requirements

**NIST AI RMF Tag:** GOVERN (ensures appropriate developer verification)

---

### 7.7 Verification Level

**Field Name:** `verificationLevel`

**Label:** Credential Verification Level

**Description:** The assurance level at which this AgentCredential was evaluated and issued.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `self_attested` - Self-attestation by developer
- `beltic_verified` - Verified by Beltic
- `third_party_verified` - Verified by independent third-party

**Assurance Model:**
- Self-attested: Value must be "self_attested"
- Beltic-verified: Value must be "beltic_verified"
- Third-party-verified: Value must be "third_party_verified"

**NIST AI RMF Tag:** GOVERN (establishes credential trust level)

---

### 7.8 Last Security Audit Date

**Field Name:** `lastSecurityAuditDate`

**Label:** Last Security Audit Date

**Description:** The date when the agent last underwent a comprehensive security audit, including infrastructure, code, and operational security. Optional but recommended for high-risk agents.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** No (Recommended for moderate to high risk agents)

**Sensitivity:** Public

**Constraints:**
- Must be valid date in the past
- Should not be more than 1 year old for high-risk agents

**Assurance Model:**
- Self-attested: Not allowed (audit must be independent)
- Beltic-verified: Audit performed or commissioned by Beltic
- Third-party-verified: Independent security audit

**NIST AI RMF Tag:** MEASURE (indicates security assurance level)

---

## 8. Cryptographic Identity & Verification

### 8.1 Credential ID

**Field Name:** `credentialId`

**Label:** Credential Identifier

**Description:** Globally unique identifier for this specific AgentCredential instance. Used for tracking, revocation, and reference.

**Type:** Text (UUID v4 recommended)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be globally unique
- Should be immutable once issued
- Recommended format: UUID v4

**Assurance Model:**
- Self-attested: Not allowed (assigned by issuer)
- Beltic-verified: Assigned by Beltic
- Third-party-verified: Assigned by third-party issuer

**NIST AI RMF Tag:** GOVERN (enables credential tracking and management)

---

### 8.2 Issuer DID

**Field Name:** `issuerDid`

**Label:** Issuer Decentralized Identifier

**Description:** The decentralized identifier (DID) of the entity that issued this AgentCredential (Beltic or third-party verifier). This can be used to verify the credential's authenticity and retrieve the issuer's public key.

**Type:** Text (DID format)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid DID format (e.g., "did:web:beltic.com")
- Must resolve to valid DID document
- Issuer must have authority to issue AgentCredentials

**Assurance Model:**
- Self-attested: Uses developer's DID (for self-issued credentials)
- Beltic-verified: Uses Beltic's DID
- Third-party-verified: Uses third-party verifier's DID

**NIST AI RMF Tag:** GOVERN (establishes issuer identity and authority)

---

### 8.3 Verification Method

**Field Name:** `verificationMethod`

**Label:** Verification Method Reference

**Description:** Reference to the specific cryptographic key and method used by the issuer to sign this credential. This points to a verification method in the issuer's DID document.

**Type:** Text (URI reference)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must reference valid verification method in issuer's DID document
- Should use strong cryptographic algorithms (Ed25519, ECDSA P-256)

**Assurance Model:**
- Self-attested: References self-signing key
- Beltic-verified: References Beltic's signing key
- Third-party-verified: References third-party's signing key

**NIST AI RMF Tag:** GOVERN (enables cryptographic verification)

---

### 8.4 Credential Status

**Field Name:** `credentialStatus`

**Label:** Credential Status

**Description:** Current status of the AgentCredential indicating whether it is active, suspended, or revoked. Verifiers should check this before trusting the credential.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**
- `active` - Credential is valid and in good standing
- `suspended` - Temporarily suspended pending investigation
- `revoked` - Permanently revoked, no longer valid
- `expired` - Past expiration date

**Assurance Model:**
- Self-attested: Not allowed (managed by issuer)
- Beltic-verified: Managed by Beltic
- Third-party-verified: Managed by third-party issuer

**NIST AI RMF Tag:** MANAGE (enables ongoing credential lifecycle management)

---

### 8.5 Revocation List URL

**Field Name:** `revocationListUrl`

**Label:** Revocation List URL

**Description:** URL where verifiers can check whether this AgentCredential has been revoked. This may point to a revocation list, status list credential, or revocation registry.

**Type:** URL (text)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be valid HTTPS URL
- Should be publicly accessible or accessible to authorized verifiers
- Should have high availability

**Assurance Model:**
- Self-attested: Managed by credential subject
- Beltic-verified: Managed by Beltic
- Third-party-verified: Managed by third-party issuer

**NIST AI RMF Tag:** MANAGE (enables revocation checking)

---

### 8.6 Proof

**Field Name:** `proof`

**Label:** Credential Cryptographic Proof

**Description:** Cryptographic proof (signature) from the issuer that binds all credential data together and proves authenticity. This is a structured object containing signature type, creation time, and signature value.

**Type:** Object (W3C VC Data Integrity Proof format) containing:
- `type` (proof type, e.g., "Ed25519Signature2020")
- `created` (ISO 8601 datetime)
- `verificationMethod` (reference to issuer's key)
- `proofPurpose` (e.g., "assertionMethod")
- `proofValue` (base64-encoded signature)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**
- Must be verifiable using issuer's public key
- Must cover all credential claims
- Should use strong signature algorithms

**Assurance Model:**
- Self-attested: Self-signed by developer
- Beltic-verified: Signed by Beltic
- Third-party-verified: Signed by third-party issuer

**NIST AI RMF Tag:** GOVERN (ensures credential integrity and authenticity)

---

## Field Summary Table

| Field Name | Type | Required | Sensitivity | Min Assurance | NIST Tag |
|------------|------|----------|-------------|---------------|----------|
| **1. Agent Identity & Provenance** |
| agentId | UUID | Yes | Public | Beltic-verified (prod) | GOVERN |
| agentName | Text | Yes | Public | Beltic-verified (prod) | GOVERN |
| agentVersion | Text | Yes | Public | Beltic-verified (prod) | GOVERN |
| agentDescription | Text | Yes | Public | Beltic-verified (prod) | MAP |
| firstReleaseDate | Date | Yes | Public | Beltic-verified (prod) | GOVERN |
| currentStatus | Enum | Yes | Public | Beltic-verified (prod) | MANAGE |
| developerCredentialId | UUID | Yes | Public | Beltic-verified | GOVERN |
| developerCredentialVerified | Boolean | Yes | Public | Issuer-set | GOVERN |
| **2. Technical Profile** |
| primaryModelProvider | Text | Yes | Public | Beltic-verified (prod) | MAP |
| primaryModelFamily | Text | Yes | Public | Beltic-verified (prod) | MAP |
| modelContextWindow | Integer | Yes | Public | Beltic-verified (prod) | MAP |
| modalitySupport | Array[Enum] | Yes | Public | Beltic-verified (prod) | MAP |
| languageCapabilities | Array[Text] | Yes | Public | Beltic-verified (prod) | MAP |
| architectureType | Enum | Yes | Public | Beltic-verified (prod) | MAP |
| systemConfigFingerprint | Text (SHA-256) | Yes | Restricted | Beltic-verified (prod) | MEASURE |
| systemConfigLastUpdated | Date | Yes | Public | Beltic-verified (prod) | MANAGE |
| deploymentEnvironment | Text | Yes | Public | Beltic-verified (prod) | MAP |
| complianceCertifications | Array[Enum] | No | Public | Beltic-verified | GOVERN |
| dataLocationProfile | Object | Yes | Public | Beltic-verified (prod) | GOVERN |
| **3. Tools & Actions** |
| toolsList | Array[Object] | Conditional | Public | Beltic-verified (prod) | MAP |
| toolsLastAudited | Date | Conditional | Public | Beltic-verified (prod) | MANAGE |
| **4. Data Handling & Privacy** |
| dataCategoriesProcessed | Array[Enum] | Yes | Public | Beltic-verified (prod) | MAP |
| dataRetentionMaxPeriod | Duration | Yes | Public | Beltic-verified (prod) | GOVERN |
| dataRetentionByCategory | Object | No | Public | Beltic-verified (prod) | GOVERN |
| trainingDataUsage | Enum | Yes | Public | Beltic-verified (prod) | GOVERN |
| piiDetectionEnabled | Boolean | Yes | Public | Beltic-verified (prod) | MEASURE |
| piiRedactionCapability | Enum | Yes | Public | Beltic-verified (prod) | MEASURE |
| piiRedactionPipeline | Text | No | Public | Beltic-verified (prod) | MANAGE |
| dataEncryptionStandards | Array[Text] | Yes | Public | Beltic-verified (prod) | MANAGE |
| **5. Safety & Robustness Metrics** |
| harmfulContentRefusalScore | Float | Yes | Public | Beltic-verified (prod) | MEASURE |
| harmfulContentBenchmarkName | Text | Yes | Public | Specified | MEASURE |
| harmfulContentBenchmarkVersion | Text | Yes | Public | Specified | MEASURE |
| harmfulContentEvaluationDate | Date | Yes | Public | Evaluator-set | MEASURE |
| harmfulContentAssuranceSource | Enum | Yes | Public | Matches level | GOVERN |
| promptInjectionRobustnessScore | Float | Yes | Public | Beltic-verified (prod) | MEASURE |
| promptInjectionBenchmarkName | Text | Yes | Public | Specified | MEASURE |
| promptInjectionBenchmarkVersion | Text | Yes | Public | Specified | MEASURE |
| promptInjectionEvaluationDate | Date | Yes | Public | Evaluator-set | MEASURE |
| promptInjectionAssuranceSource | Enum | Yes | Public | Matches level | GOVERN |
| toolAbuseRobustnessScore | Float | Conditional | Public | Beltic-verified (prod) | MEASURE |
| toolAbuseBenchmarkName | Text | Conditional | Public | Specified | MEASURE |
| toolAbuseBenchmarkVersion | Text | Conditional | Public | Specified | MEASURE |
| toolAbuseEvaluationDate | Date | Conditional | Public | Evaluator-set | MEASURE |
| toolAbuseAssuranceSource | Enum | Conditional | Public | Matches level | GOVERN |
| piiLeakageRobustnessScore | Float | Yes | Public | Beltic-verified (prod) | MEASURE |
| piiLeakageBenchmarkName | Text | Yes | Public | Specified | MEASURE |
| piiLeakageBenchmarkVersion | Text | Yes | Public | Specified | MEASURE |
| piiLeakageEvaluationDate | Date | Yes | Public | Evaluator-set | MEASURE |
| piiLeakageAssuranceSource | Enum | Yes | Public | Matches level | GOVERN |
| **6. Operations & Lifecycle** |
| incidentResponseContact | Email | Yes | Public | Beltic-verified (prod) | MANAGE |
| incidentResponseSLO | Duration | Yes | Public | Beltic-verified (prod) | MANAGE |
| deprecationPolicy | Text | Yes | Public | Beltic-verified (prod) | MANAGE |
| updateCadence | Enum | Yes | Public | Beltic-verified (prod) | MANAGE |
| humanOversightMode | Enum | Yes | Public | Beltic-verified (prod) | MANAGE |
| failSafeBehavior | Text | Conditional | Public | Beltic-verified (prod) | MANAGE |
| monitoringCoverage | Text | Yes | Public | Beltic-verified (prod) | MANAGE |
| credentialIssuanceDate | DateTime | Yes | Public | Issuer-set | GOVERN |
| credentialExpirationDate | DateTime | Yes | Public | Issuer-set | GOVERN |
| **7. Risk Summary & Assurance Metadata** |
| overallSafetyRating | Enum | Yes | Public | Beltic-verified | MAP |
| approvedUseCases | Array[Text] | No | Public | Beltic-verified (prod) | MAP |
| prohibitedUseCases | Array[Text] | No | Public | Beltic-verified (prod) | MAP |
| ageRestrictions | Enum | Yes | Public | Beltic-verified (prod) | GOVERN |
| regulatoryApprovals | Array[Text] | No | Public | Beltic-verified | GOVERN |
| kybTierRequired | Enum | Yes | Public | Issuer-set | GOVERN |
| verificationLevel | Enum | Yes | Public | Issuer-set | GOVERN |
| lastSecurityAuditDate | Date | No | Public | Third-party | MEASURE |
| **8. Cryptographic Identity** |
| credentialId | UUID | Yes | Public | Issuer-assigned | GOVERN |
| issuerDid | DID | Yes | Public | Issuer-assigned | GOVERN |
| verificationMethod | URI | Yes | Public | Issuer-assigned | GOVERN |
| credentialStatus | Enum | Yes | Public | Issuer-managed | MANAGE |
| revocationListUrl | URL | Yes | Public | Issuer-managed | MANAGE |
| proof | Object | Yes | Public | Issuer-signed | GOVERN |

**Total Fields: 71 fields across 8 categories**

---

## Privacy and Security Considerations

### Selective Disclosure

AgentCredentials should support selective disclosure mechanisms to allow:
- Revealing only public fields to most merchants
- Revealing restricted fields (systemConfigFingerprint) only to authorized verifiers or security researchers
- Proving properties without revealing exact values (e.g., "safety score >= 80" without revealing exact score)
- Progressive disclosure based on merchant trust level and use case risk

### Data Minimization

Merchants should request only the minimum necessary fields:
- **Low-risk integrations:** Identity, status, overall safety rating, approved use cases
- **Moderate-risk:** Add data handling, privacy fields, basic safety metrics
- **High-risk/regulated:** Full credential with all safety metrics, compliance certifications, detailed tool risk analysis

### Merchant Disclosure Guidance

Default merchant-safe presentations include:
- All identity and provenance fields
- Technical profile (except system config fingerprint)
- Sanitized `toolsList` entries (tool name/description + risk classification) plus Beltic-derived counts surfaced in dashboards
- Data handling policies, `dataLocationProfile`, and privacy fields
- Safety metric scores and evaluation dates
- Operations and lifecycle fields (including `humanOversightMode`, `failSafeBehavior`, `monitoringCoverage`)
- Risk summaries and assurance metadata
- Cryptographic verification fields

**Restricted access fields** (require security researcher or regulator status):
- `systemConfigFingerprint` - Full hash (summary indicators public)
- Detailed tool implementation details beyond risk classification

### Internal Use Fields (not in v1 credential)

The following data is maintained by Beltic internally but not included in AgentCredentials:
- Source code or proprietary algorithms
- Detailed system prompts (fingerprint provided instead)
- Raw evaluation data and test cases
- API keys or authentication secrets
- Detailed infrastructure architecture diagrams
- Individual user interaction logs
- Proprietary training data or fine-tuning datasets

### Region-Specific Privacy Notes

**EU/EEA + UK:**
- Agent credentials processing personal data must comply with GDPR
- Data residency fields help assess cross-border transfer requirements
- Right to explanation may require disclosure of AI decision-making processes
- Retention periods must align with GDPR principles

**United States:**
- State-specific laws (CCPA, Virginia CDPA, etc.) apply based on user location
- Sector-specific regulations (HIPAA, GLBA, FERPA) apply to specific use cases
- FTC Act Section 5 prohibits unfair/deceptive AI practices

**Canada:**
- PIPEDA applies to commercial activities
- Quebec Law 25 has specific AI transparency requirements
- Cross-border data transfer notices required

**APAC:**
- Singapore PDPA requires consent for automated decision-making
- Japan APPI has specific requirements for AI explanations
- China PIPL has strict data localization requirements

---

## Future Extensions (Post-v1)

The following items were intentionally deferred to keep v1 achievable while preserving a roadmap for richer transparency:

- **Tool count aggregates (`totalToolCount`, `highRiskToolCount`):** Beltic dashboards will derive these metrics automatically from `toolsList`, eliminating duplicate data entry. A future revision may expose them for offline verifiers once the derivation API ships.
- **Fine-grained location splits (`storageRegions`, `processingRegions`):** Replaced by `dataLocationProfile`. If regulators request per-dataset attestations later, we will add scoped sub-fields rather than three separate global lists.
- **Throughput / client gating metadata (`rateLimitTier`, `requestQuotaPerDay`, `minimumClientVersion`):** Useful for commercial planning but not critical to the assurance story. These will return in v2 once we have standardized tiers and SDK telemetry to validate claims.
- **Automated monitoring KPIs (alert MTTR, % reviewed logs):** Currently described narratively in `monitoringCoverage`. We plan to add structured metrics after Beltic finalizes collection requirements with pilot developers.

Each deferred field is tracked in the backlog and re-enters the spec once supporting automation, evidence, and guidance exist so developers are not forced into manual, error-prone reporting.

---

## Compliance and Legal Notes

### Regulatory Considerations

AgentCredentials help demonstrate compliance with emerging AI regulations:

**EU AI Act:**
- High-risk AI systems require conformity assessment
- Safety metrics, risk ratings, and technical documentation support compliance
- Transparency requirements met through credential disclosure

**NIST AI Risk Management Framework:**
- Field tagging aligns with NIST AI RMF functions
- Supports risk management throughout AI lifecycle
- Enables measurement and monitoring

**Industry-Specific:**
- Healthcare: Safety metrics and PHI handling for HIPAA compliance
- Finance: Risk ratings and regulatory approvals for financial services
- Education: Age restrictions and data handling for FERPA/COPPA

### Liability and Accountability

AgentCredentials establish clear accountability:
- Link to DeveloperCredential creates verification chain
- Safety metrics provide evidence of due diligence
- Approved/prohibited use cases set expectations
- Incident response contacts enable rapid issue resolution

### Limitations and Disclaimers

AgentCredentials have important limitations:
- Metrics represent point-in-time evaluations, not guarantees
- Safety scores don't eliminate all risks
- Approved use cases don't guarantee fitness for purpose
- Merchants must conduct own risk assessments
- Credentials don't constitute legal advice or regulatory approval

---

## Implementation Notes

### Relationship to DeveloperCredential

Every AgentCredential MUST:
1. Reference a valid, active DeveloperCredential
2. Require the DeveloperCredential to be at or above specified KYB tier
3. Be automatically suspended if DeveloperCredential is revoked
4. Inherit certain compliance requirements from DeveloperCredential

### Versioning and Updates

When an agent is updated:
- Minor updates (patch versions): May update without new credential if safety metrics unchanged
- Significant updates: Require new credential evaluation
- Model changes: Always require new credential
- System prompt changes: Require new credential if behavior significantly changes
- Tool additions/removals: Require new credential evaluation

### Credential Chaining Verification

Merchants verifying an AgentCredential must:
1. Verify AgentCredential signature and status
2. Verify referenced DeveloperCredential exists and is valid
3. Check DeveloperCredential meets minimum KYB tier
4. Verify cryptographic chain integrity
5. Check both credentials are not expired or revoked
6. Validate safety metrics meet merchant's requirements

---

## Version History

**v1.0 (2025-11-21):**
- Initial specification
- Defined 75 fields across 8 categories
- Established hierarchical tool risk taxonomy
- Included 4 core safety metrics with full evaluation metadata
- Added comprehensive privacy and data handling fields
- Integrated with NIST AI RMF framework
- Established three-tier assurance model
- Created clear link to DeveloperCredential

---

## Next Steps

1. Create JSON Schema definition in `/schemas/agent-credential-v1.schema.json`
2. Define specific cryptographic signature formats
3. Create example AgentCredentials for different agent types and risk levels
4. Specify integration with W3C Verifiable Credentials standard
5. Document verification API endpoints
6. Create benchmark specifications for safety metrics
7. Develop merchant verification policy guidelines
8. Create developer documentation for credential application process
9. Establish evaluation procedures for Beltic-verified credentials
10. Define third-party auditor accreditation requirements
