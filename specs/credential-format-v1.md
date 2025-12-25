# Credential Format v1 (Draft)

## Abstract

Defines the structural format for Beltic DeveloperCredential and AgentCredential JSON payloads prior to signing. Aligns with JSON Schema definitions and anticipates JWS/VC envelopes.

## Status

Draft

## Base Structure

- Top-level JSON object.
- Required keys shared: `schemaVersion`, `credentialId`, `issuanceDate`, `expirationDate`, `issuerDid`, `verificationMethod`, `credentialStatus`/`status`, `proof` (for unsigned JSON this is absent; added after signing), `$schema` (optional reference to JSON Schema).

## DeveloperCredential Fields (summary)

- Identity: `legalName`, `entityType`, `incorporationJurisdiction`, `businessRegistrationStatus`, optional/inc conditional fields per spec.
- Contact: `website`, `businessEmail`, `businessPhone`, `securityEmail`, `registeredAddress`.
- Tax/Risk: `taxIdExists`, `taxIdVerified`, `taxIdJurisdiction`, `kybTier`, screenings, `overallRiskRating`.
- Ownership: `beneficialOwnersKycStatus`, `beneficialOwnersCount`, `controlStructureComplexity`.
- Cryptographic: `subjectDid`, `publicKey`.
- Assurance: `assuranceMetadata`.

## AgentCredential Fields (summary)

- Identity: `agentId`, `agentName`, `agentVersion`, `agentDescription`, `firstReleaseDate`, `currentStatus`, `developerCredentialId`, `developerCredentialVerified`.
- Technical: model info, `systemConfigFingerprint`, `systemConfigLastUpdated`, `deploymentEnvironment`, `dataLocationProfile`, optional `complianceCertifications`.
- Tools: `toolsList`, `toolsLastAudited`.
- Data/Privacy: categories, retention, training, PII detection/redaction, encryption standards.
- Safety metrics: harmful content, prompt injection, tool abuse (conditional), PII leakage (scores + benchmark metadata).
- Operations: incident response, deprecation, update cadence, oversight, fail-safe, monitoring, issuance/expiration.
- Risk summary: `overallSafetyRating`, use case lists, age restrictions, regulatory approvals, `kybTierRequired`, `verificationLevel`, `lastSecurityAuditDate`.
- Cryptographic: `credentialId`, `issuerDid`, `verificationMethod`, `credentialStatus`, `revocationListUrl`/`status`, `proof`.

## Encoding and Canonicalization

- UTF-8 JSON; recommend stable key ordering for signature input (e.g., lexicographic) or using exact serialization bytes before JWS signing.
- All dates ISO 8601; UUIDs for IDs.

## Media Types

- Proposed: `application/beltic-developer+json`, `application/beltic-agent+json` for raw JSON; `application/beltic-developer+jwt` and `application/beltic-agent+jwt` for signed tokens.

## Validation

- JSON Schema Draft 2020-12; runtime checks for conditional date freshness; verifiers must apply both schema and runtime rules.

## Future Extensions

- VC envelope support (JWT-VC or JSON-LD VC) with `@context`, `type`, `credentialSubject`, `proof` and `status` per VC DM 2.0.
- Selective disclosure profiles (SD-JWT/BBS+).
