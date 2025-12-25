# Developer Credential Specification v1

## Document Overview

This document specifies version 1 of the Beltic DeveloperCredential, which establishes the identity and legitimacy of organizations or individuals developing AI agents. This credential serves as the root of trust for all AgentCredentials issued to agents developed by this entity.

**Version:** 1.0
**Status:** Draft
**Last Updated:** 2025-11-21

---

## Field Categories

Fields are organized into the following categories:

1. Core Identity Information
2. Contact Information
3. Tax and Registration
4. Risk and Compliance
5. Ownership and Control
6. Verification Metadata
7. Cryptographic Identity

---

## 1. Core Identity Information

### 1.1 Legal Name

**Field Name:** `legalName`

**Label:** Legal Name

**Description:** The full legal name of the organization or individual as registered with the relevant government authority. This is the official name that appears on incorporation documents, business licenses, or individual identity documents. This field establishes the legal identity of the credential subject.

**Type:** Text (string)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Minimum length: 2 characters
- Maximum length: 500 characters
- Must match official registration documents

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes accountability)

---

### 1.2 Entity Type

**Field Name:** `entityType`

**Label:** Entity Type

**Description:** Categorizes whether the credential holder is a corporation, individual, partnership, or other legal entity type. This helps verifiers understand the legal structure and associated regulatory requirements.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**

- `corporation` - Incorporated company (Inc, Corp, Ltd)
- `limited_liability_company` - LLC or equivalent
- `partnership` - General or limited partnership
- `sole_proprietorship` - Individual doing business
- `individual` - Personal developer account
- `nonprofit_organization` - Registered nonprofit/NGO
- `government_entity` - Government agency or department
- `other` - Other legal structures

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes organizational context)

---

### 1.3 Jurisdiction of Incorporation

**Field Name:** `incorporationJurisdiction`

**Label:** Jurisdiction of Incorporation

**Description:** The country (and optionally state/province) where the entity is legally registered or incorporated. This determines which regulatory frameworks apply and helps verifiers assess jurisdictional risks.

**Type:** Object containing:

- `country` (ISO 3166-1 alpha-2 country code, required)
- `region` (state/province/territory code, optional)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Country must be valid ISO 3166-1 alpha-2 code (e.g., "US", "GB", "DE")
- Region should use ISO 3166-2 subdivision codes where applicable

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified against registration documents)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes legal jurisdiction and applicable regulations)

---

### 1.4 Incorporation Date

**Field Name:** `incorporationDate`

**Label:** Date of Incorporation

**Description:** The date when the entity was officially registered or incorporated. This helps establish the entity's history and maturity. For individuals, this may represent the date they registered as a business entity or the date of their first developer credential application and **must not** be a personal birthdate; Beltic truncates the value to year-month in merchant-facing views when the subject is a natural person.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes (for organizations); Optional (for individuals)

**Sensitivity:** Public

**Constraints:**

- Must be a valid date in the past
- Cannot be more than 200 years in the past
- Cannot be in the future
- Day-level precision is reserved for internal AML/KYC logs; public presentations surface only year-month to avoid exposing personal birthdates

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use (verified against registration documents)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes organizational maturity and historical context)

---

### 1.5 Business Registration Number

**Field Name:** `businessRegistrationNumber`

**Label:** Business Registration Number

**Description:** The official registration number assigned by the government authority (e.g., Companies House number in UK, EIN in US, etc.). This is stored in hashed or tokenized form to enable verification without exposing the full number publicly; merchants only receive an attestation that the number was verified, never the plaintext or hash.

**Type:** Text (hashed identifier)

**Required:** Yes (for organizations); Optional (for individuals)

**Sensitivity:** Restricted

**Constraints:**

- Stored as hash or verification token, not plaintext
- Format varies by jurisdiction
- Verifiable through Beltic verification API
- Restricted view is available only to Beltic compliance teams and regulators when legally mandated; merchant verifications consume a yes/no proof that the credential maps to a valid registration number

**Assurance Model:**

- Self-attested: Not allowed
- Beltic-verified: Required
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (enables verification of legal existence)

---

### 1.6 Business Registration Status

**Field Name:** `businessRegistrationStatus`

**Label:** Business Registration Status

**Description:** Indicates whether the entity's business registration is currently active and in good standing with the relevant authority. This is a summary status derived from verification checks.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**

- `active_good_standing` - Registered and in good standing
- `active_requires_attention` - Registered but may have minor compliance issues
- `inactive` - Registration expired or voluntarily dissolved
- `suspended` - Registration suspended by authority
- `not_applicable` - For individuals without business registration
- `verification_pending` - Status not yet confirmed

**Assurance Model:**

- Self-attested: Not allowed
- Beltic-verified: Required
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (ensures ongoing legal compliance)

---

## 2. Contact Information

### 2.1 Primary Website

**Field Name:** `website`

**Label:** Primary Website

**Description:** The official website URL for the organization or individual developer. This provides a public point of reference and may be used for domain verification.

**Type:** URL (text)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must be valid URL format
- Must use HTTPS protocol (HTTP allowed only for development/testing)
- Maximum length: 500 characters

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Recommended (includes domain ownership verification)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (provides public accountability and transparency)

---

### 2.2 Registered Address

**Field Name:** `registeredAddress`

**Label:** Registered Business Address

**Description:** The official registered address of the organization as filed with government authorities. This may differ from operational addresses. For individuals, this field should be kept internal unless a regulator explicitly requests it; merchant-facing presentations only expose country/region level data so the full street address is never broadly disclosed.

**Type:** Object containing:

- `streetAddress` (text, required)
- `addressLine2` (text, optional - suite, floor, etc.)
- `city` (text, required)
- `region` (text, optional - state/province)
- `postalCode` (text, required)
- `country` (ISO 3166-1 alpha-2 code, required)

**Required:** Yes (for organizations); Optional (for individuals)

**Sensitivity:** Restricted

**Constraints:**

- Country must be valid ISO 3166-1 alpha-2 code
- All components must match official registration documents
- Default selective-disclosure profile includes only `country` and `region` for merchants; Beltic/regulators may access the full object for AML/KYC reviews
- EU/EEA and UK issuers must capture explicit legitimate-interest documentation before storing a home address for sole proprietors, as it qualifies as personal data under GDPR/UK GDPR

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes physical presence and jurisdiction)

---

### 2.3 Business Contact Email

**Field Name:** `businessEmail`

**Label:** Business Contact Email

**Description:** Official email address for business inquiries related to the developer's AI agents. This should be monitored regularly for security notifications and compliance issues. Use role- or domain-based aliases whenever possible so merchants do not see personal inboxes; Beltic can provide an email relay for sole proprietors who cannot publish a dedicated address.

**Type:** Email address (text)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must be valid email format
- Should use organizational domain (preferred, not required)
- Must be verified through email confirmation
- Maximum length: 254 characters
- Sole proprietors should either provision an alias mailbox or opt into Beltic's relay service to avoid exposing personal email addresses in merchant-facing credentials

**Assurance Model:**

- Self-attested: Allowed for development/testing (with email verification)
- Beltic-verified: Required for production use (includes email verification)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (enables incident response and communications)

---

### 2.4 Business Phone Number

**Field Name:** `businessPhone`

**Label:** Business Phone Number

**Description:** Primary phone number for the organization. Used for verification purposes and urgent communications. Should be a number that can receive voice calls or SMS. This field is never included in default merchant presentations and is only surfaced to Beltic personnel, regulators, or under an explicit incident-response escalation.

**Type:** Text (E.164 format preferred)

**Required:** Yes

**Sensitivity:** Restricted

**Constraints:**

- Should use E.164 international format (e.g., +1-555-123-4567)
- Must be verified through phone verification process
- Maximum length: 20 characters
- Merchant disclosures may only include a yes/no indicator that a phone contact exists; the actual number remains restricted to Beltic

**Assurance Model:**

- Self-attested: Allowed for development/testing (with phone verification)
- Beltic-verified: Required for production use (includes phone verification)
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MANAGE (enables emergency communications and verification)

---

### 2.5 Security Contact Email

**Field Name:** `securityEmail`

**Label:** Security Contact Email

**Description:** Dedicated email address for security researchers, incident reports, and vulnerability disclosures. This should be monitored by the security team.

**Type:** Email address (text)

**Required:** No (Recommended)

**Sensitivity:** Public

**Constraints:**

- Must be valid email format
- Should use organizational domain (preferred, not required)
- Must be verified through email confirmation
- Maximum length: 254 characters

**Assurance Model:**

- Self-attested: Allowed (with email verification)
- Beltic-verified: Allowed
- Third-party-verified: Allowed

**NIST AI RMF Tag:** MANAGE (enables security incident response)

---

## 3. Tax and Registration

### 3.1 Tax ID Exists

**Field Name:** `taxIdExists`

**Label:** Tax ID Exists

**Description:** Boolean indicator of whether the entity has a valid tax identification number (TIN, VAT, GST, etc.) in their jurisdiction. This does not expose the actual tax ID.

**Type:** Boolean

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**

- `true` - Entity has a tax ID
- `false` - Entity does not have a tax ID (e.g., new entity, exempt status)

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (indicates tax compliance status)

---

### 3.2 Tax ID Verified

**Field Name:** `taxIdVerified`

**Label:** Tax ID Verification Status

**Description:** Indicates whether Beltic or a third-party has successfully verified the entity's tax identification number with the relevant tax authority. This is a verification status, not the ID itself.

**Type:** Enum

**Required:** Yes (if taxIdExists is true)

**Sensitivity:** Public

**Allowed Values:**

- `verified` - Tax ID verified with authority
- `not_verified` - Tax ID provided but not verified
- `verification_pending` - Verification in progress
- `verification_failed` - Verification attempted but failed
- `not_applicable` - No tax ID exists

**Assurance Model:**

- Self-attested: Not allowed (verification status must be determined by verifier)
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (confirms tax compliance verification)

---

### 3.3 Tax ID Jurisdiction

**Field Name:** `taxIdJurisdiction`

**Label:** Tax ID Jurisdiction

**Description:** The country (and optionally region) where the tax ID was issued. This helps verifiers understand which tax authority's verification was performed.

**Type:** Object containing:

- `country` (ISO 3166-1 alpha-2 country code, required)
- `region` (state/province code, optional)

**Required:** Yes (if taxIdExists is true)

**Sensitivity:** Public

**Constraints:**

- Country must be valid ISO 3166-1 alpha-2 code
- Should match or be related to incorporation jurisdiction

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (establishes tax compliance jurisdiction)

---

### 3.4 Tax ID Last Verified Date

**Field Name:** `taxIdLastVerifiedDate`

**Label:** Tax ID Last Verified Date

**Description:** The date when the tax ID verification was last performed. Helps verifiers assess recency of verification.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes (if taxIdVerified is "verified")

**Sensitivity:** Public

**Constraints:**

- Must be a valid date in the past
- Should not be more than 2 years old for current credentials

**Assurance Model:**

- Self-attested: Not allowed (set by verification system)
- Beltic-verified: Required
- Third-party-verified: Allowed

**NIST AI RMF Tag:** GOVERN (indicates verification currency)

---

## 4. Risk and Compliance

### 4.1 KYB Tier

**Field Name:** `kybTier`

**Label:** KYB Verification Tier

**Description:** The level of Know Your Business verification that has been completed for this entity. Higher tiers involve more comprehensive checks and documentation requirements.

**Type:** Enum

**Required:** Yes

**Sensitivity:** Public

**Allowed Values:**

- `tier_0_unverified` - No verification performed (self-attested only)
- `tier_1_basic` - Basic identity and business registration verification
- `tier_2_standard` - Standard KYB including business verification, address verification, and basic risk screening
- `tier_3_enhanced` - Enhanced due diligence with comprehensive risk screening
- `tier_4_maximum` - Maximum due diligence for high-risk or regulated use cases

**Assurance Model:**

- Self-attested: Only for tier_0
- Beltic-verified: Required for tiers 1-4
- Third-party-verified: Allowed for tiers 3-4

**NIST AI RMF Tag:** GOVERN (establishes verification thoroughness level)

---

### 4.2 Sanctions Screening Status

**Field Name:** `sanctionsScreeningStatus`

**Label:** Sanctions Screening Status

**Description:** Result of screening the entity and its principals against international sanctions lists (OFAC, UN, EU, etc.). This is a summary status, not raw screening data.

**Type:** Enum

**Required:** Yes (for tier_2 and above)

**Sensitivity:** Public

**Allowed Values:**

- `clear` - No matches found on sanctions lists
- `potential_match` - Possible match requires manual review
- `confirmed_match` - Entity or principals are on sanctions lists
- `not_screened` - Screening not yet performed
- `screening_error` - Technical error during screening

**Assurance Model:**

- Self-attested: Not allowed
- Beltic-verified: Required for tier_2 and above
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies regulatory and legal risks)

---

### 4.3 Sanctions Screening Last Checked

**Field Name:** `sanctionsScreeningLastChecked`

**Label:** Sanctions Screening Last Checked Date

**Description:** The date when sanctions screening was last performed. Screening should be refreshed periodically as sanctions lists change.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes (if sanctionsScreeningStatus is set)

**Sensitivity:** Public

**Constraints:**

- Must be a valid date in the past
- Should not be more than 90 days old for current credentials

**Assurance Model:**

- Self-attested: Not allowed (set by screening system)
- Beltic-verified: Required
- Third-party-verified: Allowed

**NIST AI RMF Tag:** MAP (indicates risk assessment currency)

---

### 4.4 PEP Risk Level

**Field Name:** `pepRiskLevel`

**Label:** Politically Exposed Person Risk Level

**Description:** Assessment of whether the entity's principals, beneficial owners, or key personnel are politically exposed persons (PEPs) or have close associations with PEPs. This is a summary risk level, not individual PII.

**Type:** Enum

**Required:** Yes (for tier_2 and above)

**Sensitivity:** Restricted

**Allowed Values:**

- `none` - No PEP connections identified
- `low` - Minor indirect PEP connections (e.g., distant family, former minor officials)
- `medium` - Moderate PEP connections (e.g., close family of local officials)
- `high` - Direct PEPs or close connections to senior officials
- `not_assessed` - PEP screening not yet performed

**Assurance Model:**

- Self-attested: Not allowed
- Beltic-verified: Required for tier_2 and above
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies political and regulatory risks)

---

### 4.5 PEP Risk Last Assessed

**Field Name:** `pepRiskLastAssessed`

**Label:** PEP Risk Last Assessed Date

**Description:** The date when PEP risk assessment was last performed. PEP status can change over time as individuals enter or leave political positions.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes (if pepRiskLevel is set)

**Sensitivity:** Restricted

**Constraints:**

- Must be a valid date in the past
- Should not be more than 180 days old for current credentials

**Assurance Model:**

- Self-attested: Not allowed (set by assessment system)
- Beltic-verified: Required
- Third-party-verified: Allowed

**NIST AI RMF Tag:** MAP (indicates risk assessment currency)

---

### 4.6 Adverse Media Risk Level

**Field Name:** `adverseMediaRiskLevel`

**Label:** Adverse Media Risk Level

**Description:** Assessment of negative media coverage related to the entity, its principals, or beneficial owners. This includes news about fraud, corruption, financial crimes, regulatory violations, or other reputational risks. This is a summary assessment, not raw media articles.

**Type:** Enum

**Required:** Yes (for tier_2 and above)

**Sensitivity:** Restricted

**Allowed Values:**

- `none` - No significant adverse media found
- `low` - Minor negative mentions or resolved historical issues
- `medium` - Moderate adverse media indicating potential concerns
- `high` - Significant adverse media suggesting serious risks
- `not_assessed` - Media screening not yet performed

**Assurance Model:**

- Self-attested: Not allowed
- Beltic-verified: Required for tier_2 and above
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies reputational and conduct risks)

---

### 4.7 Adverse Media Last Assessed

**Field Name:** `adverseMediaLastAssessed`

**Label:** Adverse Media Last Assessed Date

**Description:** The date when adverse media screening was last performed. Media landscape changes over time, so periodic re-screening is important.

**Type:** Date (ISO 8601 format: YYYY-MM-DD)

**Required:** Yes (if adverseMediaRiskLevel is set)

**Sensitivity:** Restricted

**Constraints:**

- Must be a valid date in the past
- Should not be more than 180 days old for current credentials

**Assurance Model:**

- Self-attested: Not allowed (set by screening system)
- Beltic-verified: Required
- Third-party-verified: Allowed

**NIST AI RMF Tag:** MAP (indicates risk assessment currency)

---

### 4.8 Overall Risk Rating

**Field Name:** `overallRiskRating`

**Label:** Overall Risk Rating

**Description:** Composite risk assessment based on all risk factors including sanctions, PEP, adverse media, jurisdiction, business type, and other considerations. This helps verifiers make quick risk-based decisions.

**Type:** Enum

**Required:** Yes (for tier_2 and above)

**Sensitivity:** Public

**Allowed Values:**

- `low` - Low risk entity suitable for most use cases
- `medium` - Moderate risk requiring standard monitoring
- `high` - High risk requiring enhanced due diligence and monitoring
- `prohibited` - Entity should not be issued credentials due to extreme risk
- `not_assessed` - Risk rating not yet determined

**Assurance Model:**

- Self-attested: Not allowed
- Beltic-verified: Required for tier_2 and above
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (provides overall risk assessment for verifiers)

---

## 5. Ownership and Control

### 5.1 Beneficial Owners KYC Status

**Field Name:** `beneficialOwnersKycStatus`

**Label:** Beneficial Owners KYC Status

**Description:** Summary indicator of whether beneficial owners (individuals with >25% ownership or control) have been identified and KYC'd. This is a summary field that does not contain individual owner PII.

**Type:** Enum

**Required:** Yes (for tier_2 and above; not applicable for individuals)

**Sensitivity:** Restricted

**Allowed Values:**

- `all_identified_and_kycd` - All beneficial owners identified and passed KYC
- `partially_identified` - Some but not all beneficial owners identified
- `identified_not_kycd` - Beneficial owners identified but KYC not completed
- `unable_to_identify` - Unable to determine beneficial owners
- `not_applicable` - Entity type has no beneficial owners (e.g., individual)
- `not_assessed` - Assessment not yet performed

**Assurance Model:**

- Self-attested: Not allowed
- Beltic-verified: Required for tier_2 and above
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (ensures ownership transparency and accountability)

---

### 5.2 Beneficial Owners Count

**Field Name:** `beneficialOwnersCount`

**Label:** Number of Beneficial Owners

**Description:** The total number of beneficial owners (individuals with >25% ownership or control) that have been identified for this entity. This provides transparency about ownership concentration without revealing identities.

**Type:** Integer

**Required:** No (Recommended for tier_2 and above; not applicable for individuals)

**Sensitivity:** Restricted

**Constraints:**

- Must be non-negative integer
- Typical range: 0-10 (larger numbers may indicate complex structures)

**Assurance Model:**

- Self-attested: Allowed for development/testing
- Beltic-verified: Required for production use
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** GOVERN (indicates ownership structure complexity)

---

### 5.3 Control Structure Complexity

**Field Name:** `controlStructureComplexity`

**Label:** Control Structure Complexity

**Description:** Assessment of how complex the entity's ownership and control structure is. Complex structures (multiple layers, offshore entities) may indicate higher risk or require enhanced due diligence.

**Type:** Enum

**Required:** No (Recommended for tier_2 and above)

**Sensitivity:** Restricted

**Allowed Values:**

- `simple` - Direct ownership, minimal layers
- `moderate` - Some corporate layers or multiple owners
- `complex` - Multiple layers, offshore entities, or intricate structures
- `not_assessed` - Assessment not performed

**Assurance Model:**

- Self-attested: Not allowed
- Beltic-verified: Required for tier_2 and above
- Third-party-verified: Allowed for regulated industries

**NIST AI RMF Tag:** MAP (identifies structural risks and transparency issues)

---

## 6. Verification Metadata

### 6.1 Credential ID

**Field Name:** `credentialId`

**Label:** Credential Identifier

**Description:** Globally unique identifier for this specific credential instance. Used for tracking, revocation, and reference from AgentCredentials.

**Type:** Text (UUID v4 recommended)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must be globally unique
- Should be immutable once issued
- Recommended format: UUID v4 (e.g., "550e8400-e29b-41d4-a716-446655440000")

**Assurance Model:**

- Self-attested: Not allowed (assigned by issuer)
- Beltic-verified: Assigned by Beltic
- Third-party-verified: Assigned by third-party issuer

**NIST AI RMF Tag:** GOVERN (enables credential tracking and management)

---

### 6.2 Issuance Date

**Field Name:** `issuanceDate`

**Label:** Date of Issuance

**Description:** The date and time when this credential was issued by Beltic or a third-party verifier.

**Type:** DateTime (ISO 8601 format with timezone: YYYY-MM-DDTHH:MM:SSZ)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must be a valid datetime
- Should be at or before current time (allowing small clock skew)

**Assurance Model:**

- Self-attested: Not allowed (set by issuer)
- Beltic-verified: Set by Beltic
- Third-party-verified: Set by third-party issuer

**NIST AI RMF Tag:** GOVERN (establishes credential creation timeline)

---

### 6.3 Expiration Date

**Field Name:** `expirationDate`

**Label:** Date of Expiration

**Description:** The date and time when this credential expires and is no longer considered valid. After this date, the credential should be renewed with updated verification.

**Type:** DateTime (ISO 8601 format with timezone: YYYY-MM-DDTHH:MM:SSZ)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must be after issuance date
- Typical validity periods:
  - Tier 0-1: 2 years
  - Tier 2: 1 year
  - Tier 3-4: 6 months to 1 year
  - Self-attested: 90 days maximum

**Assurance Model:**

- Self-attested: Not allowed (set by issuer)
- Beltic-verified: Set by Beltic
- Third-party-verified: Set by third-party issuer

**NIST AI RMF Tag:** GOVERN (ensures verification remains current)

---

### 6.4 Issuer DID

**Field Name:** `issuerDid`

**Label:** Issuer Decentralized Identifier

**Description:** The decentralized identifier (DID) of the entity that issued this credential (Beltic or third-party verifier). This can be used to verify the credential's authenticity and retrieve the issuer's public key.

**Type:** Text (DID format)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must be valid DID format (e.g., "did:web:beltic.com" or "did:key:...")
- Must resolve to a valid DID document
- Issuer must have authority to issue DeveloperCredentials

**Assurance Model:**

- Self-attested: Uses subject's own DID (for self-issued credentials)
- Beltic-verified: Uses Beltic's DID
- Third-party-verified: Uses third-party verifier's DID

**NIST AI RMF Tag:** GOVERN (establishes issuer identity and authority)

---

### 6.5 Verification Method

**Field Name:** `verificationMethod`

**Label:** Verification Method Used

**Description:** Reference to the specific cryptographic key and method used by the issuer to sign this credential. This points to a verification method in the issuer's DID document.

**Type:** Text (URI reference)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must reference a valid verification method in issuer's DID document
- Should use strong cryptographic algorithms (e.g., Ed25519, ECDSA with P-256)

**Assurance Model:**

- Self-attested: References self-signing key
- Beltic-verified: References Beltic's signing key
- Third-party-verified: References third-party's signing key

**NIST AI RMF Tag:** GOVERN (enables cryptographic verification)

---

### 6.6 Credential Status

**Field Name:** `credentialStatus`

**Label:** Credential Status

**Description:** Current status of the credential indicating whether it is active, suspended, or revoked. This should be checked by verifiers before trusting the credential.

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

### 6.7 Revocation List URL

**Field Name:** `revocationListUrl`

**Label:** Revocation List URL

**Description:** URL where verifiers can check whether this credential has been revoked. This may point to a revocation list, status list credential, or revocation registry.

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

### 6.8 Last Updated Date

**Field Name:** `lastUpdatedDate`

**Label:** Last Updated Date

**Description:** The date when any information in this credential was last updated or re-verified. Helps verifiers assess data currency.

**Type:** DateTime (ISO 8601 format with timezone)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must be between issuance date and expiration date
- Should not be in the future

**Assurance Model:**

- Self-attested: Not allowed (managed by issuer)
- Beltic-verified: Set by Beltic
- Third-party-verified: Set by third-party issuer

**NIST AI RMF Tag:** GOVERN (indicates data currency)

---

## 7. Cryptographic Identity

### 7.1 Subject DID

**Field Name:** `subjectDid`

**Label:** Subject Decentralized Identifier

**Description:** The decentralized identifier (DID) of the credential subject (the developer/organization). This DID is controlled by the subject and used to prove ownership of the credential.

**Type:** Text (DID format)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must be valid DID format
- Must resolve to a valid DID document
- Subject must control the corresponding private key

**Assurance Model:**

- Self-attested: Subject creates their own DID
- Beltic-verified: DID ownership verified by Beltic
- Third-party-verified: DID ownership verified by third-party

**NIST AI RMF Tag:** GOVERN (establishes cryptographic identity)

---

### 7.2 Public Key

**Field Name:** `publicKey`

**Label:** Subject Public Key

**Description:** The public key corresponding to the subject's DID, used for verifying signatures and encrypting communications to the subject. This is typically extracted from the DID document.

**Type:** Object containing:

- `type` (key type, e.g., "Ed25519VerificationKey2020")
- `publicKeyMultibase` (encoded public key)

**Required:** Yes

**Sensitivity:** Public

**Constraints:**

- Must correspond to subject DID
- Must use strong cryptographic algorithms
- Should support signature verification and optionally encryption

**Assurance Model:**

- Self-attested: Subject provides their public key
- Beltic-verified: Public key verified as controlled by subject
- Third-party-verified: Public key verified by third-party

**NIST AI RMF Tag:** GOVERN (enables cryptographic verification)

---

### 7.3 Credential Signature

**Field Name:** `proof`

**Label:** Credential Proof/Signature

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

- Self-attested: Self-signed by subject
- Beltic-verified: Signed by Beltic
- Third-party-verified: Signed by third-party issuer

**NIST AI RMF Tag:** GOVERN (ensures credential integrity and authenticity)

---

## Field Summary Table

| Field Name                    | Type          | Required    | Sensitivity | Min Assurance          | NIST Tag |
| ----------------------------- | ------------- | ----------- | ----------- | ---------------------- | -------- |
| legalName                     | Text          | Yes         | Public      | Beltic-verified (prod) | GOVERN   |
| entityType                    | Enum          | Yes         | Public      | Beltic-verified (prod) | GOVERN   |
| incorporationJurisdiction     | Object        | Yes         | Public      | Beltic-verified (prod) | GOVERN   |
| incorporationDate             | Date          | Conditional | Public      | Beltic-verified (prod) | GOVERN   |
| businessRegistrationNumber    | Text (hashed) | Conditional | Restricted  | Beltic-verified        | GOVERN   |
| businessRegistrationStatus    | Enum          | Yes         | Public      | Beltic-verified        | GOVERN   |
| website                       | URL           | Yes         | Public      | Self-attested          | GOVERN   |
| registeredAddress             | Object        | Conditional | Restricted  | Beltic-verified (prod) | GOVERN   |
| businessEmail                 | Email         | Yes         | Public      | Beltic-verified (prod) | MANAGE   |
| businessPhone                 | Text          | Yes         | Restricted  | Beltic-verified (prod) | MANAGE   |
| securityEmail                 | Email         | No          | Public      | Self-attested          | MANAGE   |
| taxIdExists                   | Boolean       | Yes         | Public      | Beltic-verified (prod) | GOVERN   |
| taxIdVerified                 | Enum          | Conditional | Public      | Beltic-verified        | GOVERN   |
| taxIdJurisdiction             | Object        | Conditional | Public      | Beltic-verified (prod) | GOVERN   |
| taxIdLastVerifiedDate         | Date          | Conditional | Public      | Beltic-verified        | GOVERN   |
| kybTier                       | Enum          | Yes         | Public      | Beltic-verified        | GOVERN   |
| sanctionsScreeningStatus      | Enum          | Conditional | Public      | Beltic-verified        | MAP      |
| sanctionsScreeningLastChecked | Date          | Conditional | Public      | Beltic-verified        | MAP      |
| pepRiskLevel                  | Enum          | Conditional | Restricted  | Beltic-verified        | MAP      |
| pepRiskLastAssessed           | Date          | Conditional | Restricted  | Beltic-verified        | MAP      |
| adverseMediaRiskLevel         | Enum          | Conditional | Restricted  | Beltic-verified        | MAP      |
| adverseMediaLastAssessed      | Date          | Conditional | Restricted  | Beltic-verified        | MAP      |
| overallRiskRating             | Enum          | Conditional | Public      | Beltic-verified        | MAP      |
| beneficialOwnersKycStatus     | Enum          | Conditional | Restricted  | Beltic-verified        | GOVERN   |
| beneficialOwnersCount         | Integer       | No          | Restricted  | Beltic-verified (prod) | GOVERN   |
| controlStructureComplexity    | Enum          | No          | Restricted  | Beltic-verified        | MAP      |
| credentialId                  | Text (UUID)   | Yes         | Public      | Issuer-assigned        | GOVERN   |
| issuanceDate                  | DateTime      | Yes         | Public      | Issuer-assigned        | GOVERN   |
| expirationDate                | DateTime      | Yes         | Public      | Issuer-assigned        | GOVERN   |
| issuerDid                     | Text (DID)    | Yes         | Public      | Issuer-assigned        | GOVERN   |
| verificationMethod            | Text (URI)    | Yes         | Public      | Issuer-assigned        | GOVERN   |
| credentialStatus              | Enum          | Yes         | Public      | Issuer-managed         | MANAGE   |
| revocationListUrl             | URL           | Yes         | Public      | Issuer-managed         | MANAGE   |
| lastUpdatedDate               | DateTime      | Yes         | Public      | Issuer-assigned        | GOVERN   |
| subjectDid                    | Text (DID)    | Yes         | Public      | Subject-created        | GOVERN   |
| publicKey                     | Object        | Yes         | Public      | Subject-provided       | GOVERN   |
| proof                         | Object        | Yes         | Public      | Issuer-signed          | GOVERN   |

---

## 8. Conditional Validation Rules

The Developer Credential schema enforces **27 conditional validation rules** organized into two priority tiers:

- **Tier 1 - Critical (10 rules)**: Prevent invalid credentials; violations will cause credential issuance to fail
- **Tier 2 - High (17 rules)**: Ensure data consistency; violations may result in warnings or enhanced review

### 8.1 Tier 1 Critical Conditionals

These rules must be satisfied for a credential to be valid. Violations will cause immediate rejection during issuance or verification.

| Rule # | Condition                                                                                                                          | Required Fields / Constraints                                                                                                                             | Example                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **1**  | `taxIdExists = true`                                                                                                               | `taxIdVerified` and `taxIdJurisdiction` are **required**                                                                                                  | If company has tax ID, must specify verification status and jurisdiction |
| **2**  | `taxIdVerified = "verified"`                                                                                                       | `taxIdLastVerifiedDate` is **required**                                                                                                                   | Verified tax IDs must have verification date                             |
| **3**  | `entityType = "individual"`                                                                                                        | `incorporationDate`, `businessRegistrationNumber`, `registeredAddress` must be **absent or null**; `beneficialOwnersKycStatus` must be `"not_applicable"` | Individuals cannot have incorporation dates or beneficial owners         |
| **4**  | `entityType` ∈ {`corporation`, `limited_liability_company`, `partnership`, `nonprofit_organization`, `government_entity`, `other`} | `incorporationDate`, `businessRegistrationNumber`, `registeredAddress` are **required**                                                                   | Organizations must have incorporation details and registered address     |
| **5**  | `kybTier` ∈ {`tier_2_standard`, `tier_3_enhanced`, `tier_4_maximum`}                                                               | `sanctionsScreeningStatus`, `pepRiskLevel`, `adverseMediaRiskLevel`, `overallRiskRating` are **required**                                                 | Tier 2+ requires comprehensive risk screening                            |
| **6a** | `sanctionsScreeningStatus` ∈ {`clear`, `potential_match`, `confirmed_match`, `screening_error`}                                    | `sanctionsScreeningLastChecked` is **required**                                                                                                           | Active sanctions screening requires date                                 |
| **6b** | `pepRiskLevel` ∈ {`none`, `low`, `medium`, `high`}                                                                                 | `pepRiskLastAssessed` is **required**                                                                                                                     | Active PEP assessments require date                                      |
| **6c** | `adverseMediaRiskLevel` ∈ {`none`, `low`, `medium`, `high`}                                                                        | `adverseMediaLastAssessed` is **required**                                                                                                                | Active adverse media screening requires date                             |
| **7**  | `sanctionsScreeningStatus = "confirmed_match"`                                                                                     | `overallRiskRating` must be `"high"` or `"prohibited"`                                                                                                    | Sanctioned entities must have high/prohibited risk                       |
| **8**  | Always                                                                                                                             | `issuanceDate` < `expirationDate` _(runtime check)_                                                                                                       | Credential cannot expire before issuance                                 |
| **9**  | Always                                                                                                                             | `issuanceDate` ≤ `lastUpdatedDate` ≤ `expirationDate` _(runtime check)_                                                                                   | Updates must occur during credential lifetime                            |
| **10** | `overallRiskRating = "prohibited"`                                                                                                 | `credentialStatus` must be `"revoked"` or `"suspended"`                                                                                                   | Prohibited entities cannot have active credentials                       |

### 8.2 Tier 2 High Conditionals

These rules ensure data consistency and quality. Violations should trigger warnings and may require manual review before credential issuance.

| Rule #    | Condition                                                                                                                             | Required Constraints                                                         | Rationale                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| **1**     | `taxIdJurisdiction` is provided                                                                                                       | `taxIdExists` must be `true`                                                 | Cannot have jurisdiction without tax ID       |
| **2**     | `businessRegistrationStatus` ∈ {`active_good_standing`, `active_requires_attention`, `inactive`, `suspended`, `verification_pending`} | `entityType` must be organization type (not `individual`)                    | Only organizations have business registration |
| **3**     | `beneficialOwnersCount > 0`                                                                                                           | `beneficialOwnersKycStatus` must NOT be `"not_applicable"`                   | Count > 0 implies owners exist                |
| **4**     | `sanctionsScreeningLastChecked` exists                                                                                                | Should be within **90 days** _(runtime check)_                               | Sanctions lists change frequently             |
| **5**     | `pepRiskLastAssessed` exists                                                                                                          | Should be within **180 days** _(runtime check)_                              | PEP status changes over time                  |
| **6**     | `adverseMediaLastAssessed` exists                                                                                                     | Should be within **180 days** _(runtime check)_                              | Media landscape evolves                       |
| **7**     | `taxIdLastVerifiedDate` exists                                                                                                        | Should be within **2 years** _(runtime check)_                               | Tax verification should be current            |
| **8**     | `credentialStatus = "expired"`                                                                                                        | `expirationDate` should be in past _(runtime check)_                         | Status must match expiration                  |
| **9**     | `pepRiskLevel = "high"`                                                                                                               | `overallRiskRating` must be `"high"` or `"prohibited"`                       | High component risk → high overall risk       |
| **10**    | `adverseMediaRiskLevel = "high"`                                                                                                      | `overallRiskRating` must be `"high"` or `"prohibited"`                       | High adverse media → high overall risk        |
| **11**    | `beneficialOwnersKycStatus = "unable_to_identify"`                                                                                    | `overallRiskRating` should be ≥ `"medium"`                                   | Unknown ownership is a risk flag              |
| **12**    | `entityType = "sole_proprietorship"`                                                                                                  | `beneficialOwnersKycStatus` should be `"not_applicable"` or `"not_assessed"` | Sole proprietors are single-owner             |
| **13**    | `controlStructureComplexity = "complex"`                                                                                              | `beneficialOwnersKycStatus` should be assessed _(recommendation)_            | Complex structures need thorough review       |
| **14-17** | Various date fields                                                                                                                   | Freshness checks per rules #4-7                                              | Ensures current risk assessment data          |

### 8.3 Entity Type Decision Tree

Use this decision tree to determine which fields are required based on entity type:

```
Is entityType = "individual"?
├─ YES → incorporationDate: NOT ALLOWED
│        businessRegistrationNumber: NOT ALLOWED
│        registeredAddress: null or omitted
│        beneficialOwnersKycStatus: "not_applicable"
│
└─ NO → Is entityType = "sole_proprietorship"?
        ├─ YES → incorporationDate: OPTIONAL
        │        businessRegistrationNumber: OPTIONAL
        │        registeredAddress: OPTIONAL
        │        beneficialOwnersKycStatus: "not_applicable"
        │
        └─ NO → (corporation, LLC, partnership, nonprofit, govt, other)
                incorporationDate: REQUIRED
                businessRegistrationNumber: REQUIRED
                registeredAddress: REQUIRED
                beneficialOwnersKycStatus: REQUIRED if kybTier ≥ tier_2
```

### 8.4 KYB Tier Requirements Matrix

| Field                       | tier_0   | tier_1   | tier_2              | tier_3              | tier_4              |
| --------------------------- | -------- | -------- | ------------------- | ------------------- | ------------------- |
| `sanctionsScreeningStatus`  | Optional | Optional | **Required**        | **Required**        | **Required**        |
| `pepRiskLevel`              | Optional | Optional | **Required**        | **Required**        | **Required**        |
| `adverseMediaRiskLevel`     | Optional | Optional | **Required**        | **Required**        | **Required**        |
| `overallRiskRating`         | Optional | Optional | **Required**        | **Required**        | **Required**        |
| `beneficialOwnersKycStatus` | N/A      | N/A      | **Required** (orgs) | **Required** (orgs) | **Required** (orgs) |
| Screening freshness         | N/A      | N/A      | 90 days             | 90 days             | 30 days             |

### 8.5 Risk Roll-Up Logic

The `overallRiskRating` must be consistent with component risk assessments:

**Minimum Overall Risk Requirements:**

- If `sanctionsScreeningStatus = "confirmed_match"` → Overall must be `"high"` or `"prohibited"`
- If `pepRiskLevel = "high"` → Overall must be ≥ `"high"`
- If `adverseMediaRiskLevel = "high"` → Overall must be ≥ `"high"`
- If `beneficialOwnersKycStatus = "unable_to_identify"` → Overall should be ≥ `"medium"`

**Special Cases:**

- `overallRiskRating = "prohibited"` → `credentialStatus` MUST be `"revoked"` or `"suspended"`
- Multiple high-risk indicators → Overall risk should be escalated accordingly

### 8.6 Date Validation Requirements

**Date Format:**

- All date fields use ISO 8601 format:
  - Dates: `YYYY-MM-DD` (e.g., `2025-11-21`)
  - DateTimes: `YYYY-MM-DDTHH:MM:SSZ` (e.g., `2025-11-21T18:30:00Z`)

**Temporal Constraints:**

1. `issuanceDate < expirationDate` (always)
2. `issuanceDate ≤ lastUpdatedDate ≤ expirationDate` (always)
3. All dates must be in the past or present (not future), except `expirationDate`

**Freshness Requirements:**

- Sanctions screening: ≤ 90 days old (tier 2+)
- PEP assessment: ≤ 180 days old (tier 2+)
- Adverse media: ≤ 180 days old (tier 2+)
- Tax verification: ≤ 2 years old (all tiers)

### 8.7 Common Validation Scenarios

#### Scenario 1: Individual Developer (Minimal KYB)

```json
{
  "entityType": "individual",
  "kybTier": "tier_0_unverified",
  "taxIdExists": false,
  "businessRegistrationStatus": "not_applicable",
  "sanctionsScreeningStatus": "not_screened",
  "overallRiskRating": "not_assessed"
}
```

✅ **Valid**: No organization fields, minimal screening

---

#### Scenario 2: Small LLC with Tax ID (Standard KYB)

```json
{
  "entityType": "limited_liability_company",
  "incorporationDate": "2020-03-15",
  "businessRegistrationNumber": "hash_abc123...",
  "registeredAddress": {...},
  "taxIdExists": true,
  "taxIdVerified": "verified",
  "taxIdJurisdiction": {"country": "US"},
  "taxIdLastVerifiedDate": "2025-10-01",
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

✅ **Valid**: All required organization and tier 2 fields present

---

#### Scenario 3: High-Risk Entity (Sanctions Match)

```json
{
  "sanctionsScreeningStatus": "confirmed_match",
  "overallRiskRating": "prohibited",
  "credentialStatus": "revoked"
}
```

✅ **Valid**: Sanctioned entity properly marked as prohibited and revoked

---

#### Scenario 4: INVALID - Individual with Organization Fields

```json
{
  "entityType": "individual",
  "incorporationDate": "1985-06-20",  ❌ NOT ALLOWED
  "businessRegistrationNumber": "12345"  ❌ NOT ALLOWED
}
```

❌ **Invalid**: Individuals cannot have incorporation data

---

#### Scenario 5: INVALID - Verified Tax ID Without Date

```json
{
  "taxIdExists": true,
  "taxIdVerified": "verified",
  "taxIdLastVerifiedDate": null  ❌ REQUIRED when verified
}
```

❌ **Invalid**: Verified tax IDs must have verification date

---

### 8.8 Implementation Notes

**JSON Schema Limitations:**
Some conditional rules (particularly date comparisons and freshness checks) cannot be fully expressed in JSON Schema and require **runtime validation**:

- Rules #8, #9 (Tier 1): Date ordering comparisons
- Rules #4-8 (Tier 2): Date freshness relative to current date

**Validation Strategy:**

1. **Schema validation**: Enforce all conditionals expressible in JSON Schema
2. **Runtime validation**: Check date comparisons, freshness, and complex business rules
3. **Warning vs Error**: Tier 1 violations = hard errors; Tier 2 violations = warnings with manual review option

**Recommended Validators:**

- Use JSON Schema validator with Draft 2020-12 support (e.g., AJV with `allErrors: true`)
- Implement custom date comparison logic in credential issuance pipeline
- Log all validation warnings for audit trail

---

## 9. Assurance Metadata

The Developer Credential includes an **assurance metadata structure** that tracks the verification level and source for each field in the credential. This transparency mechanism ensures that verifiers understand which data points are self-attested versus independently verified.

### 9.1 Overview

**Assurance metadata serves three key purposes:**

1. **Transparency**: Makes verification status explicit for every field
2. **Trust calibration**: Helps verifiers assess reliability of credential data
3. **Compliance**: Meets regulatory requirements for documenting verification methods

### 9.2 Assurance Levels

| Level                      | Description                                                                       | Use Case                                                          | Example Fields                                                           |
| -------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **`self_attested`**        | Claimed by credential subject without independent verification                    | Development/testing, low-risk scenarios, optional fields          | `website`, `securityEmail`, initial registration                         |
| **`beltic_verified`**      | Verified by Beltic through direct checks, API integrations, or document review    | Production use, standard risk scenarios, required for most fields | `legalName`, `incorporationDate`, `taxIdVerified`, risk screenings       |
| **`third_party_verified`** | Verified by external KYC/KYB provider, government registry, or accredited auditor | High-risk scenarios, regulated industries, enhanced due diligence | Sanctions screening, beneficial owner KYC, specialized compliance checks |

### 9.3 Schema Structure

The `assuranceMetadata` field is an object containing:

```json
{
  "assuranceMetadata": {
    "globalAssuranceLevel": "beltic_verified",
    "fieldAssurances": {
      "legalName": {
        "assuranceLevel": "beltic_verified",
        "verificationDate": "2025-11-10T18:22:00Z",
        "verificationSource": "Companies House UK API"
      },
      "taxIdVerified": {
        "assuranceLevel": "third_party_verified",
        "verificationDate": "2025-11-10T17:45:00Z",
        "verificationSource": "TaxBit KYC Provider"
      },
      "website": {
        "assuranceLevel": "self_attested"
      }
    }
  }
}
```

**Field Definitions:**

- **`globalAssuranceLevel`** (required): Highest assurance level that applies to the credential as a whole
  - Typically the level of the issuer (e.g., if Beltic issues it, at least `beltic_verified`)

- **`fieldAssurances`** (optional): Per-field assurance tracking
  - Key: Field name from the credential
  - Value: Object with:
    - `assuranceLevel` (required): One of `self_attested`, `beltic_verified`, `third_party_verified`
    - `verificationDate` (optional): ISO 8601 datetime when verification occurred
    - `verificationSource` (optional): Name/identifier of verifying system or entity

### 9.4 Field-Level Assurance Requirements

Based on CLAUDE.md guidance: "never pretend that something is verified if it isn't"

| Field                           | Minimum Assurance (Production)                | Notes                                    |
| ------------------------------- | --------------------------------------------- | ---------------------------------------- |
| **Core Identity**               |                                               |                                          |
| `legalName`                     | `beltic_verified`                             | Must match official registration         |
| `entityType`                    | `beltic_verified`                             | Derived from registration documents      |
| `incorporationJurisdiction`     | `beltic_verified`                             | From official records                    |
| `incorporationDate`             | `beltic_verified`                             | From registration documents              |
| `businessRegistrationNumber`    | `beltic_verified`                             | **Never self-attested**                  |
| `businessRegistrationStatus`    | `beltic_verified`                             | **Never self-attested**                  |
| **Contact Information**         |                                               |                                          |
| `website`                       | `self_attested` (acceptable)                  | Recommended: domain verification         |
| `registeredAddress`             | `beltic_verified`                             | Must match official records              |
| `businessEmail`                 | `beltic_verified`                             | With email confirmation                  |
| `businessPhone`                 | `beltic_verified`                             | With phone verification                  |
| `securityEmail`                 | `self_attested` (acceptable)                  | With email confirmation                  |
| **Tax & Registration**          |                                               |                                          |
| `taxIdExists`                   | `beltic_verified`                             | Indicates presence, not value            |
| `taxIdVerified`                 | `beltic_verified` or `third_party_verified`   | **Never self-attested**                  |
| `taxIdJurisdiction`             | `beltic_verified`                             | Matches tax authority records            |
| `taxIdLastVerifiedDate`         | `beltic_verified` or `third_party_verified`   | Set by verification system               |
| **Risk & Compliance**           |                                               |                                          |
| `kybTier`                       | `beltic_verified`                             | Tier assignment is issuer responsibility |
| `sanctionsScreeningStatus`      | `beltic_verified` or `third_party_verified`   | **Never self-attested** for tier 2+      |
| `sanctionsScreeningLastChecked` | `beltic_verified` or `third_party_verified`   | Set by screening system                  |
| `pepRiskLevel`                  | `beltic_verified` or `third_party_verified`   | **Never self-attested** for tier 2+      |
| `pepRiskLastAssessed`           | `beltic_verified` or `third_party_verified`   | Set by assessment system                 |
| `adverseMediaRiskLevel`         | `beltic_verified` or `third_party_verified`   | **Never self-attested** for tier 2+      |
| `adverseMediaLastAssessed`      | `beltic_verified` or `third_party_verified`   | Set by screening system                  |
| `overallRiskRating`             | `beltic_verified`                             | Composite assessment by issuer           |
| **Ownership**                   |                                               |                                          |
| `beneficialOwnersKycStatus`     | `beltic_verified` or `third_party_verified`   | **Never self-attested** for tier 2+      |
| `beneficialOwnersCount`         | `beltic_verified`                             | From KYC/KYB review                      |
| `controlStructureComplexity`    | `beltic_verified`                             | From ownership analysis                  |
| **Verification Metadata**       |                                               |                                          |
| All verification metadata       | Issuer-assigned                               | Set by credential issuer                 |
| **Cryptographic Identity**      |                                               |                                          |
| `subjectDid`                    | Subject-created                               | Subject controls private key             |
| `publicKey`                     | Subject-provided, `beltic_verified` ownership | Beltic verifies subject controls key     |
| `proof`                         | Issuer-signed                                 | Cryptographic signature by issuer        |

### 9.5 Assurance Level Progression

Credentials can be upgraded over time as more verification is completed:

**Example Progression:**

```
Tier 0 (Self-Attested) → Tier 1 (Basic Verified) → Tier 2 (Standard Verified) → Tier 3 (Enhanced Verified)
```

**Upgrade Triggers:**

- KYC/KYB vendor integration
- Government registry checks
- Beneficial owner verification
- Enhanced risk screening

**Downgrade Triggers:**

- Verification expiration (data becomes stale)
- Failed re-verification attempts
- Contradictory information discovered

### 9.6 Verification Source Examples

Common verification sources by field type:

| Field Type            | Verification Source Examples                                              |
| --------------------- | ------------------------------------------------------------------------- |
| Business Registration | Companies House (UK), Secretary of State (US), Corporate Registry (CA)    |
| Tax ID                | IRS EIN Verification (US), VIES (EU VAT), CRA (CA)                        |
| Address               | Utility bills, government-issued documents, address verification services |
| Sanctions             | OFAC SDN List, UN Sanctions, EU Sanctions, WorldCheck                     |
| PEP                   | Dow Jones PEP Database, LexisNexis, Refinitiv                             |
| Adverse Media         | LexisNexis, Dow Jones Factiva, Google News API with ML classification     |
| Beneficial Owners     | UBO registry, corporate filings, KYC provider interviews                  |

### 9.7 Assurance in Merchant Presentations

When presenting credentials to merchants or other verifiers:

**Default Disclosure:**

- `globalAssuranceLevel` is always visible
- Field-level assurance is visible for public-sensitivity fields
- Restricted fields may hide assurance details to avoid leaking metadata about PII

**Selective Disclosure:**

- High-assurance verifiers can request full `fieldAssurances` object
- Low-assurance fields can be hidden entirely in merchant-safe views
- Zero-knowledge proofs can prove assurance level without revealing verification source

**Policy Example:**

```
Merchant Policy: "Only accept credentials where:
  - globalAssuranceLevel >= beltic_verified
  - taxIdVerified has assuranceLevel = beltic_verified or third_party_verified
  - overallRiskRating has assuranceLevel = beltic_verified
  - credentialStatus = active"
```

### 9.8 Assurance vs. Accuracy

**Important Distinction:**

- **Assurance level** = _who verified_ and _how recently_
- **Accuracy** = _correctness of the data_

A field can be `beltic_verified` but still inaccurate if:

- Source data was wrong
- Information changed after verification
- Verification process had gaps

**Best Practices:**

- Combine assurance level with freshness checks (verification date)
- Re-verify periodically based on risk tier
- Flag fields for re-verification when contradictions arise

### 9.9 Implementation Example

**Complete Developer Credential with Assurance Metadata:**

```json
{
  "schemaVersion": "1.0",
  "assuranceMetadata": {
    "globalAssuranceLevel": "beltic_verified",
    "fieldAssurances": {
      "legalName": {
        "assuranceLevel": "beltic_verified",
        "verificationDate": "2025-11-10T18:22:00Z",
        "verificationSource": "Delaware Division of Corporations"
      },
      "incorporationDate": {
        "assuranceLevel": "beltic_verified",
        "verificationDate": "2025-11-10T18:22:00Z",
        "verificationSource": "Delaware Division of Corporations"
      },
      "taxIdVerified": {
        "assuranceLevel": "third_party_verified",
        "verificationDate": "2025-11-10T17:45:00Z",
        "verificationSource": "Stripe Identity KYB"
      },
      "sanctionsScreeningStatus": {
        "assuranceLevel": "third_party_verified",
        "verificationDate": "2025-11-15T10:30:00Z",
        "verificationSource": "ComplyAdvantage Sanctions API"
      },
      "pepRiskLevel": {
        "assuranceLevel": "third_party_verified",
        "verificationDate": "2025-11-15T10:30:00Z",
        "verificationSource": "Dow Jones Risk & Compliance"
      },
      "website": {
        "assuranceLevel": "self_attested"
      },
      "securityEmail": {
        "assuranceLevel": "self_attested"
      }
    }
  },
  "legalName": "Acme AI Solutions Inc.",
  "entityType": "corporation",
  "...(rest of credential fields)"
}
```

### 9.10 Assurance and NIST AI RMF

Assurance metadata directly supports **NIST AI RMF GOVERN** function:

- **Accountability**: Clear attribution of verification responsibility
- **Transparency**: Explicit documentation of verification methods
- **Auditability**: Timestamped verification trail

This alignment ensures that Beltic credentials meet enterprise and regulatory expectations for AI system governance.

---

## Privacy and Security Considerations

### Sensitive Data Handling

The following fields contain sensitive information and have special handling requirements:

**Restricted Sensitivity:**

- `businessRegistrationNumber` - Stored as hash/token
- `registeredAddress` - Full address may reveal personal information
- `businessPhone` - Can be used for harassment or spam
- `pepRiskLevel` - May reveal political associations
- `pepRiskLastAssessed` - Timing information
- `adverseMediaRiskLevel` - Reputational information
- `adverseMediaLastAssessed` - Timing information
- `beneficialOwnersKycStatus` - Ownership structure information
- `beneficialOwnersCount` - Ownership concentration
- `controlStructureComplexity` - Structural information

**Internal Only (Not included in v1):**

- Full tax identification numbers (TIN, SSN, VAT, etc.)
- Individual beneficial owner names, addresses, or DOB
- Raw documents (passport scans, incorporation certificates, etc.)
- Detailed sanctions screening results
- Specific PEP identities or relationships
- Raw adverse media articles or sources
- Bank account information
- Credit scores or financial data

### Selective Disclosure

DeveloperCredentials should support selective disclosure mechanisms to allow:

- Revealing only public fields to most verifiers
- Revealing restricted fields only to authorized verifiers
- Proving properties without revealing exact values (e.g., "KYB tier >= 2" without revealing exact tier)

### Data Minimization

Verifiers should only request the minimum necessary fields for their use case:

- Low-risk interactions: Public fields only
- Moderate-risk: Public + basic restricted fields
- High-risk/regulated: Full credential with all fields

### Merchant Disclosure Guidance

- Default merchant-safe presentations only include fields labeled `Sensitivity: Public`, namely core identity data, alias contact channels (`businessEmail` or Beltic relay), KYB tier, sanctions summary status, overall risk rating, verification metadata, and cryptographic identifiers; `incorporationDate` is truncated to year-month for natural persons.
- Sanctions, risk, and tax statuses are conveyed as enums (e.g., `sanctionsScreeningStatus`, `overallRiskRating`, `taxIdVerified`) so merchants learn the outcome of compliance checks without seeing full screening datasets or identifiers.
- Restricted fields (registeredAddress, businessPhone, beneficial ownership summaries, PEP/adverse media assessments, hashed registration numbers) require an explicit access request tied to a regulatory obligation and are logged for audit.
- Merchants that simply need a trust signal are encouraged to rely on `kybTier` plus `overallRiskRating` to avoid requesting additional personal data.

### AML/KYC Internal Use Fields

- Beltic stores restricted data such as the full `registeredAddress`, `businessPhone`, hashed `businessRegistrationNumber`, beneficial ownership summaries, and detailed PEP/adverse media assessments solely inside regulated compliance systems.
- Access to these fields is limited to Beltic compliance staff, approved auditors, or authorities responding to subpoenas/regulatory exams; merchants only see aggregated indicators (e.g., `beneficialOwnersKycStatus`).
- Day-level timestamps for verification checks (e.g., `taxIdLastVerifiedDate`, `pepRiskLastAssessed`, `adverseMediaLastAssessed`) remain internal logs; merchant views expose only the recency window (“verified within last 12 months”).
- Zero-knowledge or selective-disclosure proofs should be used wherever possible so verifiers can confirm compliance outcomes without ingesting raw PII.

### Region-Specific Privacy Notes

- **EU/EEA + UK:** Treat `registeredAddress`, `businessPhone`, beneficial ownership summaries, and any individual contact data as personal data under GDPR/UK GDPR. Capture a legitimate-interest assessment (LIA) before storing home addresses, honor erasure/rectification requests, and use Standard Contractual Clauses (SCCs) before transferring restricted fields outside the EU/UK.
- **United States:** The FinCEN Beneficial Ownership Information (BOI) rule may require lowering the material ownership threshold to 25% (or 10% for certain state regimes); update `beneficialOwnersKycStatus` policies accordingly and retain evidence for five years. California’s CCPA/CPRA treats business contact information for sole proprietors as personal data, so rely on alias contact channels where possible.
- **Canada & APAC (PIPEDA, Quebec Law 25, Singapore PDPA, Japan APPI):** Cross-border transfers of restricted fields require express notice and, in some jurisdictions, consent. For these regions, consider hosting restricted-field storage in-region and default merchant presentations to only the public compliance statuses.

---

## Compliance and Legal Notes

### Regulatory Considerations

Different jurisdictions may have specific requirements for:

- KYC/KYB verification depth
- Data retention periods
- Cross-border data transfer restrictions
- Right to be forgotten / data deletion
- Beneficial ownership disclosure thresholds

### GDPR Compliance

For entities subject to GDPR:

- Personal data (even in hashed form) requires legal basis
- Data subjects have rights to access, correction, and erasure
- International transfers require appropriate safeguards
- Purpose limitation applies to credential use

### Anti-Money Laundering (AML)

For regulated verifiers:

- KYB tier requirements vary by jurisdiction
- Enhanced due diligence required for high-risk entities
- Ongoing monitoring and periodic re-verification required
- Suspicious activity reporting obligations may apply

---

## Version History

**v1.0 (2025-11-21):**

- Initial specification
- Defined 35 core fields across 7 categories
- Established three-tier assurance model
- Added NIST AI RMF tagging
- Defined sensitivity levels and privacy controls

---

## Next Steps

1. Create JSON Schema definition in `/schemas/developer-credential-v1.schema.json`
2. Create example credentials in `/examples/developer-credential-*.json`
3. Define verification API endpoints
4. Specify cryptographic signature formats
5. Document integration with W3C Verifiable Credentials standard
6. Create verification policy guidelines for merchants
