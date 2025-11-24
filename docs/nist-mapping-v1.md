# NIST AI RMF Mapping – Credential Specs v1

This reference summarizes how Beltic’s DeveloperCredential and AgentCredential v1 fields align with the NIST AI Risk Management Framework (AI RMF) functions. Each function description is followed by the major sections/fields that contribute to that function so teams can quickly confirm coverage and spot gaps when adding new data elements.

---

## GOVERN – Establish Accountability, Policies, and Compliance Baselines

The GOVERN function covers organizational identity, regulatory obligations, policy enforcement, and overall responsibility for AI systems.

### DeveloperCredential Fields
- **Core Identity & Registration:** `legalName`, `entityType`, `incorporationJurisdiction`, `incorporationDate`, `businessRegistrationNumber`, `businessRegistrationStatus`.
- **Tax & Compliance:** `taxIdExists`, `taxIdVerified`, `taxIdJurisdiction`, `taxIdLastVerifiedDate`.
- **Risk & KYB Posture:** `kybTier`, `sanctionsScreeningStatus`, `businessRegistrationStatus`.
- **Ownership Transparency:** `beneficialOwnersKycStatus`, `beneficialOwnersCount`, `controlStructureComplexity`.
- **Verification Metadata:** `credentialId`, `issuanceDate`, `expirationDate`, `issuerDid`, `verificationMethod`, `credentialStatus`, `revocationListUrl`, `lastUpdatedDate`.
- **Cryptographic Identity:** `subjectDid`, `publicKey`, `proof`.

### AgentCredential Fields
- **Agent Identity & Provenance:** `agentId`, `agentName`, `agentVersion`, `firstReleaseDate`, `currentStatus`, `developerCredentialId`, `developerCredentialVerified`.
- **Governed Technical Profile:** `systemConfigFingerprint` (restricted), `systemConfigLastUpdated`, `deploymentEnvironment`, `dataLocationProfile`.
- **Regulatory/Use Policies:** `ageRestrictions`, `regulatoryApprovals`, `kybTierRequired`, `verificationLevel`, `overallSafetyRating`.
- **Credential Lifecycle:** `credentialId`, `credentialIssuanceDate`, `credentialExpirationDate`, `issuerDid`, `verificationMethod`, `credentialStatus`, `revocationListUrl`, `proof`.

---

## MAP – Understand Context, Capabilities, and Risks

The MAP function focuses on scoping AI systems, understanding data/tooling exposure, and communicating where/why the system operates.

### DeveloperCredential Fields
- **Contextual Risk Signals:** `incorporationJurisdiction`, `registeredAddress` (restricted view), `businessEmail`, `website`.
- **Risk Screening Summaries:** `sanctionsScreeningStatus`, `overallRiskRating`.
- **Jurisdiction & Tax Mapping:** `taxIdJurisdiction`.

### AgentCredential Fields
- **Technical Context:** `primaryModelProvider`, `primaryModelFamily`, `modelContextWindow`, `modalitySupport`, `languageCapabilities`, `architectureType`, `deploymentEnvironment`.
- **Tool Surface Area:** `toolsList`, supported risk categories, `toolsLastAudited`.
- **Data Handling:** `dataCategoriesProcessed`, `dataRetentionMaxPeriod`, `dataRetentionByCategory`, `trainingDataUsage`, `piiRedactionPipeline`.
- **Use Case Guidance:** `agentDescription`, `approvedUseCases`, `prohibitedUseCases`.

---

## MEASURE – Quantify Safety, Robustness, and Privacy Performance

The MEASURE function ties to quantitative/qualitative evaluations, testing, and measurable controls.

### DeveloperCredential Fields
- **Verification Evidence:** `businessRegistrationNumber` (hashed), `taxIdLastVerifiedDate`, and other fields whose values are derived from verification processes (captured under GOVERN but supported by measurement artifacts internally). No standalone MEASURE-only developer fields exist in v1; the measurement evidence lives in Beltic’s verification logs.

### AgentCredential Fields
- **Safety & Robustness Metrics:**
  - Harmful content: `harmfulContentRefusalScore`, `harmfulContentBenchmarkName`, `harmfulContentBenchmarkVersion`, `harmfulContentEvaluationDate`, `harmfulContentAssuranceSource`.
  - Prompt injection: `promptInjectionRobustnessScore`, `promptInjectionBenchmarkName`, `promptInjectionBenchmarkVersion`, `promptInjectionEvaluationDate`, `promptInjectionAssuranceSource`.
  - Tool abuse (conditional): `toolAbuseRobustnessScore`, `toolAbuseBenchmarkName`, `toolAbuseBenchmarkVersion`, `toolAbuseEvaluationDate`, `toolAbuseAssuranceSource`.
  - PII leakage: `piiLeakageRobustnessScore`, `piiLeakageBenchmarkName`, `piiLeakageBenchmarkVersion`, `piiLeakageEvaluationDate`, `piiLeakageAssuranceSource`.
- **Privacy Controls:** `piiDetectionEnabled`, `piiRedactionCapability`, `dataEncryptionStandards`.
- **Third-Party Assurance:** `lastSecurityAuditDate` (when provided) reinforces independent measurements.

---

## MANAGE – Operate, Monitor, and Respond Safely

The MANAGE function covers lifecycle management, operations, monitoring, and incident response.

### DeveloperCredential Fields
- **Communications & Incident Readiness:** `businessEmail`, `businessPhone`, `securityEmail`.
- **Lifecycle Tracking:** `lastUpdatedDate`, `credentialStatus` (also in GOVERN but operationally managed).

### AgentCredential Fields
- **Operational Governance:** `currentStatus`, `incidentResponseContact`, `incidentResponseSLO`, `deprecationPolicy`, `updateCadence`.
- **Human Oversight & Fail Safes:** `humanOversightMode`, `failSafeBehavior`, `monitoringCoverage`.
- **Credential Operations:** `credentialStatus`, `revocationListUrl` (shared with GOVERN but crucial for runtime management).
- **Tool Operations:** `toolsLastAudited` (also MAP), ensuring tooling reviews stay current.

---

## Consistency Check

Both credential specifications embed the same NIST AI RMF function tags next to each field definition. This summary aggregates those per-function groupings so teams can validate that:
- GOVERN fields establish legal identity, KYB/KYC status, sanctions/PEP outputs, and credential lifecycle controls.
- MAP fields describe capabilities, models, tools, and data domains the agents interact with.
- MEASURE fields capture safety benchmarks, robustness scores, and privacy assurance data.
- MANAGE fields document operational readiness, incident response, deprecation/update practices, and monitoring hooks.

No field carries conflicting tags between documents; the same function is referenced wherever the field appears.
