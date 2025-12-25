# DeveloperCredential v1 – Conceptual Example

**Subject:** Aurora Labs Inc. – AI commerce tooling startup  
**Assurance Level:** Beltic-verified (Tier 2 KYB)

---

## 1. Core Identity

- `legalName`: Aurora Labs Inc.
- `entityType`: corporation
- `incorporationJurisdiction`: country=US, region=CA
- `incorporationDate`: 2019-06-15
- `businessRegistrationNumber`: tokenized hash `hash_9f4a...` (restricted)
- `businessRegistrationStatus`: active_good_standing

## 2. Contact Information

- `website`: https://auroralabs.ai
- `registeredAddress` (restricted): 500 Market St, Suite 1200, San Francisco, CA 94105, US
- `businessEmail`: ops@auroralabs.ai
- `businessPhone` (restricted): +1-415-555-1200
- `securityEmail`: security@auroralabs.ai

## 3. Tax & Registration

- `taxIdExists`: true
- `taxIdVerified`: verified (Beltic-verified 2025-05-01)
- `taxIdJurisdiction`: country=US
- `taxIdLastVerifiedDate`: 2025-05-01

## 4. Risk & Compliance

- `kybTier`: tier_2_standard
- `sanctionsScreeningStatus`: clear (Beltic-verified)
- `sanctionsScreeningLastChecked`: 2025-10-05
- `pepRiskLevel`: low (restricted)
- `pepRiskLastAssessed`: 2025-09-30
- `adverseMediaRiskLevel`: low (restricted)
- `adverseMediaLastAssessed`: 2025-09-30
- `overallRiskRating`: low

## 5. Ownership & Control

- `beneficialOwnersKycStatus`: all_identified_and_kycd
- `beneficialOwnersCount`: 3
- `controlStructureComplexity`: moderate

## 6. Verification Metadata

- `credentialId`: d7aa92c7-8b07-4f35-8c9b-a2d02e26f012
- `issuanceDate`: 2025-11-10T18:22:00Z
- `expirationDate`: 2026-05-10T18:22:00Z
- `issuerDid`: did:web:beltic.com
- `verificationMethod`: did:web:beltic.com#key-1
- `credentialStatus`: active
- `revocationListUrl`: https://beltic.com/status/dev-credentials.json
- `lastUpdatedDate`: 2025-11-10T18:22:00Z

## 7. Cryptographic Identity

- `subjectDid`: did:web:auroralabs.ai
- `publicKey`: Ed25519 key reference
- `proof`: Ed25519Signature2020 (Beltic)
- `taxIdVerified`: verified (Beltic-verified)
