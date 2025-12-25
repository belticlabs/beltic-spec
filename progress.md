# Progress Log

## Purpose

This file serves as the central tracking document for all work done on the Beltic specification project.

**Key guidelines:**

- Each job/task should append its own summary entry to this file
- Include what was done, files touched, and any known issues or open questions
- When confused about the project state or what's been done, consult this file first
- This is a living document that grows with the project

---

## Job 01 – Initialize Repository Structure

**Date:** 2025-11-21

**Summary:**
Initialized the basic repository structure for the Beltic spec project. Created the foundational directory layout to organize specification documents, schemas, and examples.

**Directories Created:**

- `docs/` – For human-readable specification documents
- `schemas/` – For machine-readable schema definitions (JSON Schema, etc.)
- `examples/` – For example credentials and manifests

**Files Created:**

- `progress.md` – This tracking file

**Assumptions Made:**

- The repository will use a standard documentation structure with separate concerns
- Schema format(s) will be defined in later jobs (JSON Schema, YAML, etc.)
- No implementation code is needed at this stage; focus is on spec definition
- Git repository is already initialized (confirmed as working directory)

**Known Issues / Open Questions:**

- Specific schema format(s) to be determined (JSON Schema, OpenAPI, custom DSL, etc.)
- Documentation format and structure to be defined in subsequent jobs
- Example credential formats and structures pending specification work
- Versioning strategy for the spec needs to be established

**Next Steps:**

- Define the core concepts and terminology for Beltic
- Create initial specification documents in the `docs/` directory
- Define schema structure and format

---

## Job 02 – Create Beltic Overview Documentation

**Date:** 2025-11-21

**Summary:**
Created comprehensive overview documentation explaining Beltic's purpose, credential types, trust model, and operational flow. This document serves as the primary introduction to Beltic for new stakeholders, developers, and merchants.

**Files Created:**

- `docs/overview.md` – High-level explanation of Beltic framework

**Content Included:**

- One-paragraph description of Beltic's purpose (certifying AI agents via verifiable credentials)
- Detailed explanation of DeveloperCredential (KYC/KYB for developer identity)
- Detailed explanation of AgentCredential (agent capabilities, safety, privacy)
- Text-based flow diagram showing three stages:
  - Stage 1: Developer → Beltic KYC → DeveloperCredential
  - Stage 2: Developer + Agent manifest → Beltic evals → AgentCredential
  - Stage 3: Merchant → verifies credentials → allows/denies access
- Assurance model documentation:
  - Self-attested (lowest trust, no verification)
  - Beltic-verified (high trust, automated + manual review)
  - Third-party verified (highest trust, independent auditors)
- High-level sections outline for both credential types
- Trust chain explanation showing DeveloperCredential as root
- Credential lifecycle overview
- Privacy considerations

**Assumptions Made:**

- The three-tier assurance model (self/Beltic/third-party) is appropriate for diverse use cases
- DeveloperCredential serves as the root of trust for all agent credentials
- Merchants will verify both AgentCredential and its parent DeveloperCredential
- Privacy-preserving techniques like selective disclosure will be important
- Credentials will have expiration dates and renewal processes

**Known Issues / Open Questions:**

- Specific cryptographic standards and signature formats to be detailed later
- Exact KYC/KYB requirements and processes need human review and legal input
- Agent evaluation methodologies need to be defined in detail
- Revocation mechanisms and privacy considerations need technical specification
- Selective disclosure and zero-knowledge proof implementations to be detailed
- Wording around regulatory compliance may need legal review
- Integration points with existing verifiable credential standards (W3C VC, DIF) to be specified

**Next Steps:**

- Define detailed schemas for DeveloperCredential in `/schemas`
- Define detailed schemas for AgentCredential in `/schemas`
- Create example credentials in `/examples`
- Document cryptographic requirements and signature formats
- Specify API endpoints for credential issuance and verification
- Detail the agent evaluation process and safety criteria

---

## Job 03 – Define DeveloperCredential v1 Field Specification

**Date:** 2025-11-21

**Summary:**
Created comprehensive field-level specification for DeveloperCredential v1, defining 37 fields across 7 categories with detailed metadata including types, sensitivity levels, assurance requirements, and NIST AI RMF alignment.

**Files Created:**

- `docs/developer-credential-v1.md` – Complete field specification for DeveloperCredential v1

**Key Field Categories:**

1. **Core Identity Information (6 fields):**
   - Legal name, entity type, incorporation jurisdiction/date
   - Business registration number (hashed) and status

2. **Contact Information (5 fields):**
   - Website, registered address, business email/phone
   - Security contact email for incident response

3. **Tax and Registration (5 fields):**
   - Tax ID existence indicator (not the actual TIN)
   - Tax ID verification status and jurisdiction
   - Last verification date

4. **Risk and Compliance (8 fields):**
   - KYB tier (0-4 verification levels)
   - Sanctions screening status and last checked date
   - PEP (Politically Exposed Person) risk level and assessment date
   - Adverse media risk level and assessment date
   - Overall risk rating composite

5. **Ownership and Control (3 fields):**
   - Beneficial owners KYC status (summary, no individual PII)
   - Beneficial owners count
   - Control structure complexity assessment

6. **Verification Metadata (8 fields):**
   - Credential ID, issuance/expiration dates
   - Issuer DID and verification method
   - Credential status and revocation list URL
   - Last updated date

7. **Cryptographic Identity (3 fields):**
   - Subject DID and public key
   - Credential proof/signature

**Sensitivity Level Distribution:**

- Public fields: 26 (suitable for most verifiers)
- Restricted fields: 11 (only for authorized verifiers)
- Internal fields: Documented but not included in v1 (raw PII, documents)

**Assurance Model Implementation:**

- Self-attested: Allowed only for tier 0 and development/testing
- Beltic-verified: Required for production use (tiers 1-4)
- Third-party-verified: Allowed for regulated industries (tiers 3-4)

**NIST AI RMF Mapping:**

- GOVERN: 22 fields (accountability, policies, identity)
- MAP: 7 fields (risk assessment and identification)
- MEASURE: 0 fields (evaluation happens at agent level)
- MANAGE: 8 fields (incident response, lifecycle management)

**Privacy and Security Features:**

- No raw PII fields (SSN, full DOB, passport numbers) in public or restricted fields
- Tax IDs stored as hashes/tokens, not plaintext
- Risk assessments are summary levels, not raw screening data
- Beneficial owner information is aggregate, not individual identities
- Support for selective disclosure mechanisms
- Clear sensitivity marking for all fields

**Assumptions Made:**

- Three-tier assurance model (self/Beltic/third-party) is sufficient
- KYB tiers 0-4 provide appropriate granularity for verification levels
- Hash/token approach for business registration numbers balances privacy and verification
- 25% ownership threshold for beneficial owner identification (following FATF guidance)
- Risk screening (sanctions, PEP, adverse media) frequencies appropriate (90-180 days)
- W3C Verifiable Credentials standard will be used for implementation
- DIDs (Decentralized Identifiers) will be primary identity mechanism

**Known Issues / Open Questions:**

- **AML Provider Selection:** Specific sanctions screening, PEP, and adverse media providers not yet determined (e.g., Dow Jones, LexisNexis, ComplyAdvantage, etc.)
- **Jurisdiction Nuances:** Different jurisdictions have varying KYC/KYB requirements; field set may need jurisdiction-specific extensions
- **Beneficial Ownership Thresholds:** 25% threshold assumed but varies by jurisdiction (10% in some EU countries, 25% in US)
- **Tax ID Verification Methods:** Integration with IRS (US), HMRC (UK), and other tax authorities' verification APIs needs specification
- **Cryptographic Standards:** Specific signature algorithms and key types need formal specification (Ed25519, ECDSA P-256, etc.)
- **Revocation Mechanisms:** Technical details of revocation lists vs. status list credentials vs. blockchain-based revocation
- **Cross-Border Data:** GDPR, CCPA, and other privacy law implications for international credentials
- **Selective Disclosure Implementation:** Zero-knowledge proof methods (BBS+, JSON-LD with ZKP) need technical specification
- **Legal Review Needed:** Compliance language, regulatory claims, and AML terminology should be reviewed by legal counsel
- **Entity Type Coverage:** "Other" entity type may be too broad; additional specific types may be needed
- **PEP Definition:** PEP screening scope and definitions vary internationally; may need jurisdiction-specific guidance
- **Data Retention:** How long issuers must retain verification evidence not yet specified
- **Appeal Process:** No field for dispute resolution or credential challenge process

**Next Steps:**

- Create JSON Schema definition in `/schemas/developer-credential-v1.schema.json`
- Define specific cryptographic signature formats and algorithms
- Create example DeveloperCredentials for different tiers and entity types
- Specify integration with W3C VC and DID standards
- Document verification API endpoints for credential issuance and status checking
- Create merchant verification policy guidelines
- Define AgentCredential v1 specification with reference to DeveloperCredential

---

## Job 04 – Harden DeveloperCredential Privacy Controls

**Date:** 2025-11-22

**Summary:**
Reviewed the DeveloperCredential v1 spec for unnecessary PII exposure, clarified which data is merchant-safe versus AML/KYC-only, and documented regional privacy nuances so that the credential can satisfy KYC/AML obligations without oversharing sensitive data.

**Files Updated:**

- `docs/developer-credential-v1.md` – Added privacy guidance, selective disclosure rules, and contact-field safeguards
- `progress.md` – Logged this job

**Changes Made:**

- Annotated `incorporationDate`, `businessRegistrationNumber`, `registeredAddress`, `businessEmail`, and `businessPhone` to prevent public disclosure of birthdates, registration numbers, or personal contact info and to describe Beltic relays/hash handling.
- Introduced Merchant Disclosure Guidance, AML/KYC Internal Use Fields, and Region-Specific Privacy Notes sections outlining which fields may be exposed to merchants, which remain restricted, and how GDPR/FinCEN/PIPEDA-style rules affect processing.
- Documented that restricted fields are served only through audited, regulator-justified requests and that merchants should rely on KYB tier and risk summaries rather than raw screening data.

**Unresolved Legal / Needs Counsel:**

- Confirm the legitimate-interest template and SCC approach for storing EU/UK sole-proprietor addresses (`registeredAddress`) and contact numbers.
- Determine final ownership thresholds per jurisdiction (e.g., EU 10% vs US 25%) and whether `beneficialOwnersKycStatus` needs region-specific enumerations.
- Validate cross-border transfer and data-residency strategy for Canadian (PIPEDA, Quebec Law 25) and APAC (Singapore PDPA, Japan APPI) customers when restricted fields are stored in Beltic infrastructure.
- Define the retention/destruction schedule for restricted AML/KYC evidence so the spec can reference a concrete policy instead of general guidance.

---

## Job 05 – Define AgentCredential v1 Field Specification

**Date:** 2025-11-21

**Summary:**
Created comprehensive field-level specification for AgentCredential v1, defining 75 fields across 8 categories covering agent identity, technical capabilities, tools, data handling, safety metrics, operations, risk assessment, and cryptographic verification. Specification includes detailed safety evaluation framework with Attack Success Rate (ASR) metrics and hierarchical tool risk taxonomy.

**Files Created:**

- `docs/agent-credential-v1.md` – Complete field specification for AgentCredential v1

**Key Field Categories and Counts:**

1. **Agent Identity & Provenance (8 fields):**
   - Stable agent ID, name, version, description
   - First release date and current status
   - Developer credential linkage and verification

2. **Technical Profile (11 fields):**
   - Model provider, family, context window, modality support, languages
   - Architecture type (single-agent, RAG, tool-using, multi-agent, agentic-workflow)
   - System config fingerprint (SHA-256 hash) and last updated date
   - Deployment environment (general description and compliance-focused)
   - Compliance certifications (SOC2, ISO 27001, HIPAA, etc.)
   - Data residency regions

3. **Tools & Actions (4 fields with hierarchical taxonomy):**
   - Tools list with hierarchical risk classification:
     - **Data category:** read/write internal/external, delete, export
     - **Compute category:** code execution, query generation, API calls, transformation, analysis
     - **Financial category:** read, transaction, account access, payment initiation
     - **External category:** internet access, email, notifications, authentication, file access
   - Total tool count and high-risk tool count
   - Tools last audited date

4. **Data Handling & Privacy (10 fields):**
   - Data categories processed (PII, PHI, financial, biometric, behavioral, etc.)
   - Data retention max period and by-category retention
   - Training data usage policy (never, anonymized, with consent, etc.)
   - PII detection enabled, redaction capability level, and pipeline description
   - Storage and processing regions
   - Data encryption standards

5. **Safety & Robustness Metrics (20 fields - 4 metrics × 5 metadata fields each):**
   - **Harmful Content Refusal:** Score, benchmark, version, eval date, assurance source
   - **Prompt Injection Robustness:** Score (100 - ASR), benchmark, version, eval date, assurance source
   - **Tool Abuse Robustness:** Score, benchmark, version, eval date, assurance source
   - **PII Leakage Robustness:** Score, benchmark, version, eval date, assurance source
   - Each metric includes full evaluation provenance and reproducibility metadata

6. **Operations & Lifecycle (9 fields):**
   - Incident response contact and SLO
   - Deprecation policy and update cadence
   - Rate limit tier and request quota per day
   - Credential issuance and expiration dates
   - Minimum client version

7. **Risk Summary & Assurance Metadata (8 fields):**
   - Overall safety rating (minimal/low/moderate/high risk)
   - Approved and prohibited use cases
   - Age restrictions and regulatory approvals
   - Minimum developer KYB tier required
   - Verification level and last security audit date

8. **Cryptographic Identity & Verification (6 fields):**
   - Credential ID, issuer DID, verification method
   - Credential status and revocation list URL
   - W3C VC proof object (signature)

**Design Decisions:**

1. **Hierarchical Tool Risk Taxonomy:**
   - Two-level structure: main category (data/compute/financial/external) + sub-category
   - Provides precise risk classification without excessive complexity
   - Enables risk-based access control and merchant filtering
   - Each tool includes authentication and human approval requirements

2. **Comprehensive Safety Metrics:**
   - Four core safety dimensions covering major attack vectors
   - Each metric includes full evaluation metadata (benchmark, version, date, source)
   - Attack Success Rate (ASR) explicitly converted to robustness score (100 - ASR)
   - Supports reproducibility and verification of safety claims

3. **Privacy-First Data Handling:**
   - Detailed data categorization and retention policies
   - PII detection and redaction capabilities as first-class fields
   - Storage and processing regions for compliance
   - Training data usage policy explicitly stated

4. **Multi-Region Compliance:**
   - Compliance certifications field supports SOC2, ISO, HIPAA, GDPR, etc.
   - Data residency and processing regions for sovereignty requirements
   - Age restrictions for COPPA and similar regulations
   - Region-specific privacy notes for GDPR, CCPA, PIPEDA, APAC

5. **Developer Accountability:**
   - Strong linkage to DeveloperCredential (ID + verification status)
   - Minimum KYB tier requirement based on agent risk
   - Automatic suspension if DeveloperCredential revoked
   - Incident response contact with SLO

**Sensitivity Level Distribution:**

- Public fields: 74 (suitable for merchant verification)
- Restricted fields: 1 (systemConfigFingerprint - full hash only for security researchers)
- Internal fields: Documented but not included in v1 (source code, raw prompts, detailed logs)

**Assurance Model Implementation:**

- Self-attested: Allowed only for development/testing and low-assurance fields
- Beltic-verified: Required for production use and all safety metrics
- Third-party-verified: Required for regulated industries and high-risk agents

**NIST AI RMF Mapping:**

- GOVERN: 23 fields (identity, policies, lifecycle, accountability)
- MAP: 15 fields (capabilities, risks, use cases, context)
- MEASURE: 27 fields (safety scores, evaluations, PII detection, security audits)
- MANAGE: 10 fields (incident response, operations, rate limits, status)

**Privacy and Security Features:**

- System config fingerprint instead of exposing full prompts
- Tool risk classifications without exposing implementation details
- Safety scores with evaluation provenance
- Selective disclosure support for sensitive fields
- Clear merchant vs. security researcher access levels
- Data minimization guidance for verifiers

**Assumptions Made:**

- Four core safety metrics (harmful content, prompt injection, tool abuse, PII leakage) are sufficient for v1
- Hierarchical tool taxonomy with 4 main categories provides adequate granularity
- 6-12 month validity periods appropriate for Beltic-verified agent credentials
- W3C Verifiable Credentials standard will be implementation format
- Merchant-facing presentations should show all public fields by default
- Safety benchmarks will be standardized and versioned by Beltic
- Agent updates may or may not require new credentials depending on nature of change

**Known Issues / Open Questions:**

1. **Safety Benchmark Standardization:**
   - Specific benchmark suites need to be developed or adopted for each safety metric
   - Benchmark versioning and evolution strategy needs definition
   - Minimum passing scores for each metric need to be established per risk category
   - Cross-benchmark comparability and normalization methods needed

2. **Tool Taxonomy Finalization:**
   - Sub-categories within each main category may need expansion based on real-world usage
   - Risk level assignment criteria for tools need formal definition
   - Whether certain tool combinations constitute elevated risk (e.g., code execution + external internet)
   - How to handle emerging tool types not in current taxonomy

3. **Safety Metric Thresholds:**
   - What scores constitute acceptable safety for production use?
   - Should thresholds vary by use case or merchant risk tolerance?
   - How to weight different metrics in overall safety rating calculation?
   - Minimum evaluation frequency for continuous deployment agents

4. **Model Capability Fields:**
   - Whether to add fields for model capabilities like reasoning, planning, memory
   - How to classify and measure agent autonomy levels
   - Whether to track model performance metrics (accuracy, latency) in credential

5. **Versioning and Re-Certification:**
   - Precise rules for when agent updates require new credential evaluation
   - Whether to support credential amendments vs. full re-issuance
   - How to handle continuous deployment with frequent updates
   - Backwards compatibility and migration paths for credential versions

6. **Privacy and Compliance:**
   - Specific PII detection accuracy requirements for different capability levels
   - Cross-border data transfer documentation for restricted fields
   - GDPR Article 22 (automated decision-making) applicability and disclosure requirements
   - Sector-specific requirements (HIPAA, GLBA, FERPA) integration

7. **Tool Authorization Framework:**
   - Detailed specification of requiresAuth and requiresHumanApproval implementation
   - OAuth/API key management for tool authentication
   - Audit logging requirements for high-risk tool invocations
   - Rate limiting per tool vs. per agent

8. **Cryptographic Standards:**
   - Specific signature algorithms and key types for proof objects
   - Key rotation procedures for long-lived agents
   - Quantum-resistant cryptography considerations
   - Revocation mechanism details (list-based, accumulator-based, blockchain)

9. **Evaluation Vendor Ecosystem:**
   - Accreditation process for third-party safety evaluators
   - Mutual recognition of evaluations across jurisdictions
   - Dispute resolution when evaluations differ
   - Cost models for different evaluation depths

10. **Merchant Verification Policies:**
    - Recommended credential requirements per merchant risk tier
    - How merchants should handle expired but recently-valid credentials
    - Incident reporting obligations for merchants who detect credential violations
    - Insurance or liability considerations for relying on credentials

**Next Steps:**

- Create JSON Schema definition in `/schemas/agent-credential-v1.schema.json`
- Develop safety benchmark specifications for each of the 4 core metrics
- Create example AgentCredentials for different agent types:
  - Simple single-agent (chatbot)
  - RAG-based agent (knowledge assistant)
  - Tool-using agent (automation assistant)
  - Multi-agent system (complex workflow)
- Define detailed tool risk assessment methodology
- Specify verification procedures and checklists for Beltic evaluators
- Document credential update and re-certification workflows
- Create merchant integration guide with verification examples
- Establish third-party evaluator accreditation program
- Define cryptographic signature and revocation specifications

---

## Job 06 – Rationalize AgentCredential v1 Specification

**Date:** 2025-11-22

**Summary:**
Reviewed AgentCredential v1 end-to-end, removed redundant or non-essential fields, added missing oversight/monitoring disclosures, and ensured the remaining required data is both achievable for v1 launch partners and meaningful for merchants verifying safety/privacy assurances.

**Files Updated:**

- `docs/agent-credential-v1.md` – Field adjustments, new Future Extensions section, refreshed privacy/operational guidance
- `docs/agent-credential-v1-review-summary.md` – Change log, deferred-field rationale, scenario validation results
- `progress.md` – This entry

**Key Changes:**

- Replaced three separate residency/location fields with a single `dataLocationProfile` object to prevent drift and over-collection.
- Removed manual-derived metrics (`totalToolCount`, `highRiskToolCount`, throughput fields) and introduced `humanOversightMode`, `failSafeBehavior`, and `monitoringCoverage` to keep focus on safety control evidence.
- Clarified how hybrid/multi-modal agents should report `primaryModelFamily`, `modelContextWindow`, and `systemConfigFingerprint`.
- Added a Future Extensions backlog to capture deferred commercial/telemetry items for v2 without muddying v1 requirements.
- Documented scenario validation for a refund bot, a wealth/medical advisor, and a multi-modal tool-using agent; all could satisfy v1 with the tightened field set.

**Open Questions / Needs Legal or Product Input:**

- Telemetry and attestation model for reintroducing throughput/rate limit disclosures once enforcement is possible.
- Whether regulators will require per-data-category residency attestations beyond the consolidated `dataLocationProfile`.
- Desired format for structured monitoring KPIs (MTTR, % of tool calls reviewed) in v2; needs Ops + Security buy-in.
- Benchmark catalog governance (naming/versioning) as new safety suites are added.

**Next Steps:**

- Finalize schema updates mirroring the documentation changes (`schemas/agent-credential-v1.schema.json`).
- Align Beltic evaluation tooling with the clarified safety metric requirements and publish benchmark references.
- Define telemetry exports needed to support future throughput/monitoring KPIs before re-introducing those fields.

---

## Job 07 – Complete NIST AI RMF Mapping

**Date:** 2025-11-22

**Summary:**
Verified that every DeveloperCredential and AgentCredential field lists a NIST AI RMF function tag, ensured the tagging is consistent across both documents, and created a consolidated mapping reference for stakeholders.

**Files Updated:**

- `docs/nist-mapping-v1.md` – New summary of NIST functions and associated fields
- `progress.md` – This entry

**Details:**

- Re-reviewed both credential specs to confirm no fields were missing tags after the recent privacy/oversight edits (no changes required in the spec files).
- Authored a mapping guide that briefly explains each RMF function and groups the major sections/fields contributing to GOVERN, MAP, MEASURE, and MANAGE.
- Confirmed no field is tagged differently across documents; GOVERN still covers identity/KYC/KYB, MAP handles capabilities/data, MEASURE concentrates on safety metrics, and MANAGE captures operational controls.

**Tricky Classifications:**

- DeveloperCredential incident-response contact fields (`businessEmail`, `businessPhone`, `securityEmail`) straddle GOVERN and MANAGE responsibilities; kept MANAGE in the summary because they reflect operational readiness.
- AgentCredential credential lifecycle fields (`credentialStatus`, `revocationListUrl`) support both GOVERN and MANAGE; highlighted them in both narrative sections but maintained their single tag from the spec tables.

**Next Steps:**

- Mirror the mapping in future schema metadata so automated tooling can enforce correct tagging.
- Extend the mapping document once AgentCredential schema work introduces telemetry-backed MEASURE artifacts.

---

## Job 08 – Define Evaluation Metrics Semantics

**Date:** 2025-11-22

**Summary:**
Documented the exact meaning of the safety/privacy metrics (ASR and robustness scores) used in AgentCredential v1 so engineers and merchants share a mental model of how results are produced and interpreted.

**Files Updated:**

- `docs/evaluation-metrics-v1.md` – New reference describing attack attempts, success criteria, formulas, required metadata, and third-party ingestion steps
- `progress.md` – This entry

**Details:**

- Clarified how to compute ASR (successes ÷ attempts) and robustness ((1 – ASR) × 100) for prompt injection, harmful content, tool abuse, and privacy leakage evaluations.
- Specified the metadata bundle every run must provide (suite name/version, evaluation date, assurance source, environment details, attempt counts, lab report IDs).
- Explained how external lab results are normalized into the existing AgentCredential fields (`...RobustnessScore`, `...BenchmarkName`, etc.) without losing provenance.

**Planned Future Metrics:**

- Reliability metrics (uptime, request success rate, latency SLO adherence) and fairness/bias measurements are candidates for v2 once instrumentation and benchmark suites mature.

**Next Steps:**

- Integrate these definitions into the evaluator tooling and schema validations so submissions lacking required metadata are rejected automatically.
- Prototype reliability metric collection to validate feasibility for the next release.

---

## Job 09 – Specify Agent Manifest Format

**Date:** 2025-11-22

**Summary:**
Defined the developer-facing agent manifest spec so teams know exactly which fields they must maintain in-repo and how those values map into AgentCredential issuance.

**Files Updated:**

- `docs/agent-manifest-spec-v1.md` – New document covering manifest purpose, sections, field mapping, and update workflows
- `progress.md` – This entry

**Key Sections:**

- Versioning metadata (`manifestSchemaVersion`, `manifestRevision`, `agentVersion`)
- Agent identity and developer linkage fields
- Technical profile (model/provider/context window, architecture, tools array with risk metadata)
- Data/privacy declarations including retention, training data usage, and monitoring coverage
- Intended domains/risk posture, incident response, lifecycle policies
- Explicit callouts for Beltic-managed fields (safety metrics, assurance data)

**Open Questions:**

- Final file naming convention (`agent-manifest.json` vs customizable) – currently suggested but not enforced
- Whether future revisions should support machine-readable mitigation policies (e.g., tool allowlists) that feed directly into Beltic’s tooling

**Next Steps:**

- Publish JSON Schema for the manifest to enable pre-validation in CI
- Wire the manifest ingestion service to reject outdated `manifestSchemaVersion` entries and prompt developers for updates

---

## Job 10 – Create Conceptual Credential Examples

**Date:** 2025-11-22

**Summary:**
Added human-readable examples that illustrate what DeveloperCredential and AgentCredential v1 objects look like so stakeholders can quickly visualize the required data without diving into schema files.

**Files Created:**

- `examples/developer-example-v1.md` – Aurora Labs developer profile with KYB/KYC fields, contact info, risk assessments, and cryptographic metadata
- `examples/agent-example-v1.md` – Aurora Refund Guide agent profile showing technical context, tool list, data/privacy declarations, safety metrics, and operational commitments

**Notes / Observations:**

- Listing every required field surfaced the need for concise annotations (e.g., “Beltic-verified”) next to compliance statuses so readers know which values are self-attested vs. verified.
- Safety metric presentation feels readable with the “score + benchmark name/version + date” tuple; we should ensure UI aligns with this layout.
- Future usability idea: provide a compact “merchant view” subset to avoid overwhelming readers who only need high-level trust signals.

**Next Steps:**

- Use these markdown examples in onboarding decks and update them whenever the spec fields change.
- Consider adding JSON snippets later once the schema stabilizes, but keep the conceptual versions as the first touchpoint.

---

## Job 11 – Publish DeveloperCredential v1 Schema

**Date:** 2025-11-22

**Summary:**
Created the first machine-readable JSON Schema for DeveloperCredential v1 so tooling can validate submissions against the same rules documented in `docs/developer-credential-v1.md`.

**Files Added:**

- `schemas/developer/v1/developer-credential-v1.schema.json`

**Highlights / Decisions:**

- Schema declares Draft 2020-12 compliance and fixes the version via `schemaVersion: "1.0"`.
- Captures field-level constraints: enums for entity types/KYB tiers/risk statuses, ISO country codes for jurisdictions, date/date-time formats for temporal fields.
- Optional fields from the prose spec remain optional (e.g., `incorporationDate`, `businessPhone`, `registeredAddress`), with descriptions noting when they are required for organizations even if not strictly enforced via conditional logic yet.
- Hash/token fields (e.g., `businessRegistrationNumber`) are typed as strings without exposing raw IDs, aligning with the restricted handling described in the doc.

**Open Questions:**

- Conditional requirements (e.g., `taxIdVerified` required when `taxIdExists=true`, `registeredAddress` required when `entityType != individual`) are called out in descriptions but not yet formalized via JSON Schema `if/then`. Need to decide whether to encode those rules or enforce them in application logic.
- Need to define canonical structure for `publicKey` and `proof` objects (currently left as generic objects pending cryptographic spec).

**Next Steps:**

- Mirror these constraints in ingestion tooling and add automated tests to ensure doc/spec drift is caught early.
- Extend the schema with conditional validation once the repo adopts a JSON Schema validator that supports the necessary keywords.

---

## Job 13 – Author Repo README

**Date:** 2025-11-22

**Summary:**
Created a top-level README that orients new contributors to Beltic’s spec repo, highlights where v1 docs/schemas/examples live, and explains assurance levels, NIST mapping, versioning, and the purpose of `progress.md`.

**File Added:**

- `README.md`

**Highlights:**

- Quick Start section with links to DeveloperCredential/AgentCredential specs, schemas, and examples.
- References to evaluation metrics, NIST mapping, and agent manifest documentation.
- Brief explanation of assurance tiers (self-attested, Beltic-verified, third-party) and how versioning will handle future v2+ artifacts.
- Callout to `progress.md` so contributors know where decisions and open questions are logged.

**Open Items Noted in README:**

- AgentCredential machine-readable schema is “coming soon” (tracked separately) — README points readers to progress.md for status.

**Next Steps:**

- Update README whenever new schema versions or docs land so entry points stay accurate.
- Add additional onboarding links (API reference, intake tooling) once those assets exist.

---

## Job 14 – Document Spec Contribution Process

**Date:** 2025-11-22

**Summary:**
Created `docs/contributing-spec.md` so future contributors know how to add fields, metrics, or new versions while keeping the prose specs, schemas, NIST mapping, and examples in sync.

**Key Guidance:**

- Always update the human-readable spec and the corresponding schema together.
- Keep PII out of public fields and preserve accurate assurance labeling.
- Versioning flow: duplicate docs/schemas/examples into `vX` folders for breaking changes and mark deprecated fields instead of deleting.
- Evaluation metrics workflow: update `evaluation-metrics-*.md`, AgentCredential spec, schema, manifest (if needed), and examples.

**Governance Notes:**

- Conditional logic (e.g., PII restrictions, tax ID requirements) should ideally be enforced via schema `if/then` once we adopt a validator that supports it.
- Major version bumps require Beltic product/legal/security approval before merging; document approvals in PRs or design artifacts.

**Next Steps:**

- Reference the new guide from README/PR templates so contributors see it early.
- Automate schema validation to catch drift as contributors follow the process.

---

## Job 15: End-to-End v1 Usability Validation

**Date:** 2025-11-22  
**Status:** Needs refinement (agent schema outstanding)

**Scenarios tested:**

- **Aurora Refund Guide (E-commerce refunds):** Pass – all developer/agent fields, manifest, and metrics filled without gaps; merchants can make an allow decision.
- **CareLink Scheduler (HIPAA appointments):** Pass with notes – privacy/compliance fields cover requirements, but lack of reliability metrics noted for future iteration.

**Key findings:**

- **Critical blocker:** AgentCredential JSON Schema not yet published; required before pilot integrations.
- **Usability improvement:** Removed duplicate `monitoringCoverage` entry in agent manifest spec.
- **Future enhancements:** Reliability/fairness metrics deferred to v2; schema conditional rules (tax ID dependencies) to be enforced later.

**v1 readiness assessment:** Documentation, manifest guidance, evaluation metrics, and examples form a coherent suite capable of certifying both simple and HIPAA-grade agents. Once the agent schema lands, v1 is ready for pilot use with medium-to-high confidence; ongoing enhancements (reliability metrics, conditional schemas) can follow in v1.1/v2.

**Follow-up actions:**

- [ ] Publish `schemas/agent/v1/agent-credential-v1.schema.json`.
- [ ] Add conditional logic to schemas (tax ID → jurisdiction/date, registeredAddress for orgs).
- [ ] Scope reliability/fairness metric additions for next release.

---

## Job 16 – Close v1 Schema & Guidance Gaps

**Date:** 2025-11-22

**Summary:**
Implemented the follow-ups from Job 15 by adding the AgentCredential JSON Schema, sample JSON payloads, and clarifying documentation around evaluation scope and schema references.

**Files Added/Updated:**

- `schemas/agent/v1/agent-credential-v1.schema.json` – Full Draft 2020-12 schema with conditionals for tool abuse metrics
- `examples/agent/v1/valid-simple-agent.json` – Refund bot sample
- `examples/agent/v1/valid-complex-agent.json` – Wealth management sample
- `examples/agent/v1/invalid-missing-required.json` – Negative test case
- `docs/agent-credential-v1.md` – Now references the schema path
- `docs/evaluation-metrics-v1.md` – Explicitly calls out reliability/fairness as out-of-scope for v1
- `README.md` – Updated schema/example pointers
- `AGENTS.md` – Contributor guide (repo-wide instructions)

**Open Notes:**

- Could not run `npx ajv` locally due to restricted network access; schema validation should be executed in CI or a network-enabled environment.
- Developer schema still lacks `if/then` conditional enforcement (tracked TODO).

**Next Steps:**

- Add CI job to validate both developer and agent schemas against example payloads once tooling can fetch dependencies.
- Implement conditional validation in schemas when a compatible validator is available in the repo.

---

## Job 17 – Document Metrics Scope & Merchant Guidance

**Date:** 2025-11-22

**Summary:**
Clarified the boundaries of v1 metrics, published the future roadmap, and provided merchant-facing guidance so stakeholders know how to handle reliability/fairness questions until v2.

**Files Added/Updated:**

- `docs/metrics-roadmap.md` – Lists current metrics, explicitly out-of-scope items, roadmap, and guidance for handling requests.
- `docs/evaluation-metrics-v1.md` – Scope notice + FAQ referencing the roadmap.
- `docs/overview.md` – New “Version Scope and Limitations” section linking to the roadmap.
- `docs/merchant-faq.md` – Answers common merchant questions (reliability, fairness, privacy diligence).
- `README.md` – Already pointed to evaluation docs; no change required beyond earlier schema pointer.

**Open Questions:**

- Need a distribution plan for merchant FAQ (e.g., include in onboarding packet?).
- Reliability/fairness metric design still requires telemetry + domain input; tracked in roadmap “v2” bucket.

**Next Steps:**

- Reference the merchant FAQ in partner enablement materials.
- Begin feasibility study for reliability metric collection before v2 scoping.

---

## Job 15: End-to-End v1 Usability Validation

**Date:** 2025-02-10  
**Status:** Conditional

### Scenarios Tested

1. **E-commerce Refund Agent** — Pass (conditional)
   - Developer credential: Complete (tier_2_standard, low risk)
   - Agent credential: Complete with toolAbuse metrics; guardrails documented in prose
   - Merchant decision: Conditional (approve with refund cap enforcement + audit hooks)

2. **Healthcare Appointment Scheduling Agent** — Conditional/Hold
   - Developer credential: Complete (tier_3_enhanced, medium risk)
   - Agent credential: Complete; PHI handling documented but consent/BAA evidence missing
   - Merchant decision: Conditional/Hold (pending BAA + consent provenance + tenant isolation proof)

### Key Findings

**Critical Blockers (P0):**

- Lack of structured fields for consent/BAA evidence in AgentCredential for regulated data handlers; forces bespoke contracts (docs/agent-credential-v1.md, schemas/agent/v1/agent-credential-v1.schema.json).

**Usability Issues (P1):**

- Human approval thresholds and monetary/tool caps only captured in prose, not structured fields (docs/agent-credential-v1.md, docs/agent-manifest-spec-v1.md).
- Evaluation score coverage (attempt counts/categories) not surfaced in credentials, limiting comparability (docs/evaluation-metrics-v1.md).
- No place to attest tenant isolation/compliance controls for multi-tenant/PHI agents (docs/agent-credential-v1.md).

**Future Enhancements (P2):**

- Consolidate repeated narrative fields into structured checklists across manifest/credential.
- Add optional consent preference handling (opt-out/opt-in timestamps) and per-dataset retention/region exceptions.

### v1 Readiness Assessment

**Overall status:** Conditional  
**Rationale:** Two realistic agents were credentialed end-to-end, but regulated scenarios still require structured consent/BAA and oversight-limit fields for confident merchant decisions. Remaining issues are usability, not schema breakage, yet materially impact pilot readiness in PHI/financial contexts.  
**Confidence level:** Medium  
**Recommended path forward:** Ship limited pilots where contractual controls can cover the missing structured fields; prioritize P0/P1 TODOs before broad launch.

### Follow-up Actions

- [ ] Define and add consent/BAA evidence fields to AgentCredential schema and docs (P0)
- [ ] Add structured human-approval/limit fields for tools and monetary actions (P1)
- [ ] Include evaluation coverage metadata (attempt counts/categories) in credentials or referenced artifacts (P1)

### Lessons Learned

- Schema/docs drift (manifest vs schema, agent README) caused friction; aligning single source of truth avoids onboarding delays.
- Text-only guardrails make merchant evaluation slower; structured limits are the biggest DX win for v1.1.

---

## Job 18: Standards Compliance & Publication Readiness Assessment

**Date:** 2025-02-10  
**Status:** Complete

### Objectives

Comprehensive standards review of Beltic credentials (W3C VC, IETF JOSE/COSE, ISO/industry), with format/security/DX recommendations and roadmap to standardization.

### Key Findings

**Standards Alignment:**

- W3C VC: Medium alignment; need VC envelope (JWT-VC), contexts, and Status List 2021.
- IETF: Medium-high; ready for JWS/JWT profile but missing media types/status definition/test vectors.
- Gaps: Critical (signed profile, status list, regulated-data evidence fields), Important (coverage metadata, tool limits, conformance tests, second implementation), Minor (contexts/semantics, optional selective disclosure).

**Format Recommendation:**

- Primary: Hybrid JSON + JWS (JWT-compatible) with media types; retain JSON Schema.
- Compatibility: VC/JWT-VC profile with contexts; COSE optional.
- Migration impact: Medium (add envelope/status/context; keep schemas/data model).

**Security Architecture:**

- Signatures: ES256 required, EdDSA recommended; RS256 optional.
- Revocation: Status List 2021 hosted over HTTPS; include status object in credentials.
- Key management: Issuer keys in HSM/KMS with rotation; DIDs + JWKS for discovery; PoP via `cnf` optional.

**Developer Experience:**

- Authoring: JSON templates + optional YAML; SDKs for typed authoring.
- Tooling priorities: CLI, JS/TS SDK, VS Code extension, GitHub Action; Python/Go SDKs next.
- Time-to-first-credential: ~15 minutes with template + CLI.

**Standardization Readiness:**

- State: Preparation phase (not WG-ready).
- Path: W3C VC alignment first (JWT-VC + contexts/status list), parallel IETF I-D for envelope/media types.
- Timeline: 6–12 months to interop-ready drafts; 12–24 months to REC/RFC track with ≥2 implementations and conformance suite.
- Critical blockers: No signed profile/status list, no consent/BAA/tool-limit fields, no conformance tests/second implementation.

### Deliverables Produced

- analysis/standards-compliance-report.md
- analysis/w3c-vc-alignment.md
- analysis/ietf-compatibility.md
- analysis/other-standards.md
- analysis/format-comparison.md
- analysis/security-architecture.md
- analysis/developer-experience.md
- analysis/schema-format-justification.md
- analysis/standardization-readiness.md
- specs/signature-scheme-v1.md
- specs/credential-format-v1.md
- specs/schema-versioning-policy.md
- specs/trust-model-v1.md
- specs/developer-guide-v1.md
- roadmap/implementation-roadmap.md
- roadmap/tooling-roadmap.md
- roadmap/w3c-standardization-plan.md
- roadmap/ietf-standardization-plan.md
- recommendations/credential-system-design.md

### Recommendations Summary

**Immediate actions (v1):**

1. Ship JWS profile + media types + status list with test vectors.
2. Add consent/BAA evidence, tool-limit fields, and evaluation coverage metadata to schemas/docs.
3. Deliver CLI + JS SDK + VS Code validation/signing; publish immutable schemas/contexts.

**Medium-term (3–12 months):**

1. VC/JWT-VC compatibility with contexts; prototype selective disclosure (SD-JWT/BBS+).
2. Python/Go SDKs and conformance suite; second independent implementation + interop run.
3. Draft W3C CG report and IETF Internet-Draft.

**Long-term:**

1. WG adoption (W3C VC WG and IETF ART/JOSE or BoF); iterate drafts.
2. 3+ implementations, status infra at scale, reference implementation and test vectors for REC/RFC.

### Next Steps

- [ ] Implement JWS profile, media types, and status list with test vectors.
- [ ] Extend schemas/docs with consent/BAA, tool limits, and coverage metadata.
- [ ] Build tooling stack (CLI/SDK/VS Code/GitHub Action) and conformance tests; recruit second implementation partner.
- [ ] Prepare VC/JWT-VC profile + contexts; draft W3C CG report and IETF I-D.

### Lessons Learned

- Schema-only artifacts are insufficient for standardization; envelopes, status, and evidence fields are mandatory.
- VC compatibility is achievable via JWT-VC without forcing JSON-LD complexity on all developers.
- Structured safety/consent/limit fields are as important as signatures for merchant trust in regulated scenarios.

---

## Job 19 – Build beltic-cli Signing & Verification Tool

**Date:** 2025-11-22  
**Status:** Complete

### Objectives

- Ship the initial Rust-based Beltic CLI to generate keys, sign credentials as JWS, and verify tokens using the documented ES256/EdDSA profile.

### Work Done

- Added `beltic-cli` crate dependencies and release profile tuned for secure builds (LTO/strip, zeroization).
- Implemented commands: `keygen` (P-256 or Ed25519 PKCS#8 PEM output), `sign` (JWS with Beltic media type header, optional kid), and `verify` (auto-detect alg from header, print payload).
- Built crypto helpers with strict algorithm mapping and SEC1-to-PKCS#8 fallback for P-256 keys; zeroized private key material in memory.
- Added integration tests using the official ES256 and Ed25519 test vectors to validate sign/verify behavior.

### Files Touched

- `beltic-cli/Cargo.toml`
- `beltic-cli/src/main.rs`
- `beltic-cli/src/lib.rs`
- `beltic-cli/src/commands/keygen.rs`
- `beltic-cli/src/commands/sign.rs`
- `beltic-cli/src/commands/verify.rs`
- `beltic-cli/src/crypto/mod.rs`
- `beltic-cli/src/crypto/signer.rs`
- `beltic-cli/src/crypto/verifier.rs`
- `beltic-cli/tests/jws_vectors.rs`

### Tests

- `cargo test` (beltic-cli)

### Open Questions / Next Steps

- Add schema validation to `verify` for Beltic credential payloads.
- Support optional `kid` inference from keys/JWKS and emit status list handling when available.
