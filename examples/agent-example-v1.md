# AgentCredential v1 – Conceptual Example

**Agent:** Aurora Refund Guide  
**Developer:** Aurora Labs Inc. (DeveloperCredential ID d7aa92c7-8b07-4f35-8c9b-a2d02e26f012)  
**Assurance:** Beltic-verified (production)

---

## 1. Agent Identity & Provenance

- `agentId`: 3c9f4e9b-1a2b-4c9d-8f34-7e5c80f3d412
- `agentName`: Aurora Refund Guide
- `agentVersion`: 2.3.0
- `agentDescription`: Conversational assistant that helps e-commerce merchants process refunds, check policy eligibility, and generate customer communications.
- `firstReleaseDate`: 2022-03-10
- `currentStatus`: production
- `developerCredentialId`: d7aa92c7-8b07-4f35-8c9b-a2d02e26f012
- `developerCredentialVerified`: true

## 2. Technical Profile

- `primaryModelProvider`: Anthropic
- `primaryModelFamily`: Claude-3 Opus (rules engine + policy retriever)
- `modelContextWindow`: 200000
- `modalitySupport`: [text, structured_data]
- `languageCapabilities`: [en, es, fr]
- `architectureType`: rag
- `systemConfigFingerprint`: sha256 `f6d2...` (restricted; Beltic-verified)
- `systemConfigLastUpdated`: 2025-10-30
- `deploymentEnvironment`: AWS us-west-2, isolated VPC
- `complianceCertifications`: [soc2_type2, iso27001]
- `dataLocationProfile`: storage=[US], processing=[US], backup=[US, CA], notes="US primary, CA disaster recovery"
- `toolsList`:
  1. `refund_db_lookup` – riskCategory `data`, subcategory `data_read_internal`, requiresAuth=true, requiresHumanApproval=false
  2. `issue_refund` – riskCategory `financial`, subcategory `financial_payment_initiation`, requiresAuth=true, requiresHumanApproval=true
  3. `send_customer_email` – riskCategory `external`, subcategory `external_email`, requiresAuth=true, requiresHumanApproval=false
- `toolsLastAudited`: 2025-09-15

## 3. Data Handling & Privacy

- `dataCategoriesProcessed`: [pii, financial]
- `dataRetentionMaxPeriod`: P30D
- `dataRetentionByCategory`: {"pii":"P30D","financial":"P90D"}
- `trainingDataUsage`: with_explicit_consent
- `piiDetectionEnabled`: true
- `piiRedactionCapability`: advanced
- `piiRedactionPipeline`: Detects PII pre-inference and scrubs logs before storage.
- `dataEncryptionStandards`: ["AES-256-at-rest", "TLS 1.3 in transit"]

## 4. Safety & Robustness Metrics (Beltic-verified)

- `harmfulContentRefusalScore`: 96 (benchmark: Beltic Harmful Content Suite v2.1, evaluated 2025-11-05)
- `promptInjectionRobustnessScore`: 92 (Beltic Prompt Injection Suite v1.4, evaluated 2025-11-06)
- `toolAbuseRobustnessScore`: 88 (Beltic Tool Safety Suite v1.2, evaluated 2025-11-06)
- `piiLeakageRobustnessScore`: 94 (Beltic Privacy Leakage Suite v1.3, evaluated 2025-11-05)
- All assurance sources: `beltic`

## 5. Operations & Lifecycle

- `incidentResponseContact`: security@auroralabs.ai
- `incidentResponseSLO`: PT4H
- `deprecationPolicy`: 90-day notice, automatic migration script for merchants
- `updateCadence`: biweekly
- `humanOversightMode`: human_review_pre_action (refund tool requires approval)
- `failSafeBehavior`: Refuses requests exceeding $500 and escalates to finance queue; triggers PagerDuty when automation confidence <0.7 or tool error occurs.
- `monitoringCoverage`: PII detector alerts to SOC channel; monthly human log reviews; real-time anomaly detection on tool usage.
- `credentialIssuanceDate`: 2025-11-08T12:00:00Z
- `credentialExpirationDate`: 2026-05-08T12:00:00Z

## 6. Risk Summary & Assurance Metadata

- `overallSafetyRating`: low_risk
- `approvedUseCases`: ["E-commerce refund triage", "Customer refund status inquiries"]
- `prohibitedUseCases`: ["Financial investment advice", "Medical triage"]
- `ageRestrictions`: 16+
- `regulatoryApprovals`: ["SOC 2 Type II infrastructure alignment"]
- `kybTierRequired`: tier_2
- `verificationLevel`: belic_verified

## 7. Cryptographic Identity

- `credentialId`: a2a1f6a0-7f4f-4aa1-8f6b-5c33c6f9f7e2
- `issuerDid`: did:web:beltic.com
- `verificationMethod`: did:web:beltic.com#key-1
- `credentialStatus`: active
- `revocationListUrl`: https://beltic.com/status/agent-credentials.json
- `proof`: Ed25519Signature2020 (Beltic)
