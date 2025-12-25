# Agent Manifest Specification v1

## Overview

The agent manifest is a developer-authored file (JSON or YAML) checked into the agent repository. Beltic ingests it during credential issuance to populate the developer-managed portions of an AgentCredential. Fields that require Beltic verification (safety metrics, assurance sources, credential identifiers) are excluded or marked as read-only so the manifest stays focused on developer inputs.

## Versioning

- **Manifest Schema Version (`manifestSchemaVersion`)** – Required. Indicates which version of this spec the file follows (e.g., `"1.0"`). Enables backward compatibility as the spec evolves.
- **Manifest Revision (`manifestRevision`)** – Required. Developer-controlled semantic version reflecting manifest updates (e.g., `"2.1.0"`). Increment whenever models, tools, data handling, or use-case declarations change.
- **Agent Version (`agentVersion`)** – Required. Mirrors the field in AgentCredential; update whenever the actual agent release changes.

When the manifest changes:

1. Bump `manifestRevision` (and `agentVersion` if the agent itself changed).
2. Update the sections affected (e.g., model info, tools, privacy).
3. Submit the new manifest to Beltic for re-evaluation if required.

## Field Mapping

### 1. Agent Identity

| Manifest Field     | Required | Maps To                   | Notes                                                                                           |
| ------------------ | -------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| `agentId`          | Yes      | `agentId`                 | Developer-generated UUID; must remain stable.                                                   |
| `agentName`        | Yes      | `agentName`               | Human-readable name.                                                                            |
| `agentVersion`     | Yes      | `agentVersion`            | Semantic version.                                                                               |
| `agentDescription` | Yes      | `agentDescription`        | Purpose and capabilities summary.                                                               |
| `firstReleaseDate` | Yes      | `firstReleaseDate`        | ISO date; developer supplies earliest production release.                                       |
| `currentStatus`    | Yes      | `currentStatus` (initial) | Developer proposes status (`alpha`, `beta`, etc.). Beltic may override (e.g., to `production`). |

### 2. Developer Linkage

| Manifest Field          | Required | Maps To                              | Notes                                                                    |
| ----------------------- | -------- | ------------------------------------ | ------------------------------------------------------------------------ |
| `developerCredentialId` | Yes      | `developerCredentialId`              | Beltic-issued UUID referencing the developer.                            |
| `developerContactEmail` | Optional | `incidentResponseContact` (fallback) | Used if a dedicated incident response contact is not provided elsewhere. |

### 3. Technical Profile

| Manifest Field            | Required    | Maps To                                                         | Notes                                                                                                                                  |
| ------------------------- | ----------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `primaryModelProvider`    | Yes         | `primaryModelProvider`                                          | Self-attested; Beltic may verify via attestations.                                                                                     |
| `primaryModelFamily`      | Yes         | `primaryModelFamily`                                            | Include hybrid components in parentheses.                                                                                              |
| `modelContextWindow`      | Yes         | `modelContextWindow`                                            | Token limit for user-facing context.                                                                                                   |
| `modalitySupport`         | Yes         | `modalitySupport`                                               | Array of enums (`text`, `image`, etc.).                                                                                                |
| `languageCapabilities`    | Yes         | `languageCapabilities`                                          | Array of ISO 639-1 codes.                                                                                                              |
| `architectureType`        | Yes         | `architectureType`                                              | Enum describing orchestrator pattern.                                                                                                  |
| `systemConfigFingerprint` | Required    | `systemConfigFingerprint`                                       | SHA-256 hash of prompts/config. Beltic recomputes and may override; manifests must supply one to align with the v1 schema requirement. |
| `deploymentEnvironment`   | Yes         | `deploymentEnvironment`                                         | High-level infra description.                                                                                                          |
| `dataLocationProfile`     | Yes         | `dataLocationProfile`                                           | Storage/processing/backup regions + notes.                                                                                             |
| `tools`                   | Conditional | `toolsList`, `humanOversightMode`, `failSafeBehavior` (context) | Array of tool definitions (see below).                                                                                                 |

**Tool Object (for each entry in `tools`):**

- `toolId` (required) → `toolsList[].toolId`
- `toolName` (required) → `toolsList[].toolName`
- `toolDescription` (required) → `toolsList[].toolDescription`
- `riskCategory` (required) → `toolsList[].riskCategory`
- `riskSubcategory` (required) → `toolsList[].riskSubcategory`
- `requiresAuth` (required) → `toolsList[].requiresAuth`
- `requiresHumanApproval` (required) → `toolsList[].requiresHumanApproval`
- `mitigations` (optional) → Manifests only; can describe allowlists, throttles, or custom safeguards. Beltic may reference this when reviewing `failSafeBehavior`.

### 4. Data & Privacy Declarations

| Manifest Field            | Required               | Maps To                   | Notes                                                                        |
| ------------------------- | ---------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `dataCategoriesProcessed` | Yes                    | `dataCategoriesProcessed` | Array of enums (PII, PHI, etc.).                                             |
| `dataRetentionMaxPeriod`  | Yes                    | `dataRetentionMaxPeriod`  | ISO 8601 duration.                                                           |
| `dataRetentionByCategory` | Optional               | `dataRetentionByCategory` | Object mapping data types to durations.                                      |
| `trainingDataUsage`       | Yes                    | `trainingDataUsage`       | Enum describing how user data is used.                                       |
| `piiDetectionEnabled`     | Yes                    | `piiDetectionEnabled`     | Boolean.                                                                     |
| `piiRedactionCapability`  | Yes                    | `piiRedactionCapability`  | Enum (none/basic/advanced/context_aware).                                    |
| `piiRedactionPipeline`    | Optional               | `piiRedactionPipeline`    | Text description.                                                            |
| `dataEncryptionStandards` | Yes                    | `dataEncryptionStandards` | List of encryption schemes.                                                  |
| `monitoringCoverage`      | Optional (Recommended) | `monitoringCoverage`      | Runtime telemetry/alerting summary focusing on privacy/data loss monitoring. |

### 5. Intended Domains & Risk Posture

| Manifest Field       | Required | Maps To                                    | Notes                                                          |
| -------------------- | -------- | ------------------------------------------ | -------------------------------------------------------------- |
| `approvedUseCases`   | Optional | `approvedUseCases`                         | List of use-case strings.                                      |
| `prohibitedUseCases` | Optional | `prohibitedUseCases`                       | List of disallowed contexts.                                   |
| `ageRestrictions`    | Yes      | `ageRestrictions`                          | Enum (`none`, `13+`, `16+`, `18+`, `21+`).                     |
| `riskSummary`        | Optional | `overallSafetyRating` (initial suggestion) | Developer’s self-assessment; Beltic recalculates final rating. |
| `humanOversightMode` | Yes      | `humanOversightMode`                       | Enum describing review model.                                  |
| `failSafeBehavior`   | Yes      | `failSafeBehavior`                         | Text describing fallback mechanisms.                           |

### 6. Incident Response & Lifecycle

| Manifest Field            | Required | Maps To                   | Notes                                  |
| ------------------------- | -------- | ------------------------- | -------------------------------------- |
| `incidentResponseContact` | Yes      | `incidentResponseContact` | Email or alias for urgent issues.      |
| `incidentResponseSLO`     | Yes      | `incidentResponseSLO`     | ISO 8601 duration (e.g., `PT4H`).      |
| `deprecationPolicy`       | Yes      | `deprecationPolicy`       | Text summary of notice/migration plan. |
| `updateCadence`           | Yes      | `updateCadence`           | Enum (`continuous`, `weekly`, etc.).   |

---

## Fields Managed by Beltic

The manifest does **not** contain:

- Safety/robustness metrics (`harmfulContentRefusalScore`, `promptInjectionRobustnessScore`, etc.). Beltic or approved labs compute these; developers only provide data needed to run tests.
- Assurance metadata (`verificationLevel`, `credentialIssuanceDate`, `credentialStatus`, etc.).
- Third-party audit data (`lastSecurityAuditDate`) unless Beltic requests supporting documents separately.

If developers wish to suggest values (e.g., provide recent lab results), they can attach them as supplemental evidence, but Beltic writes the authoritative values into the credential.

---

## Optional Mitigation Metadata

- `toolAllowlist` (optional): Explicit list of partner systems/accounts a tool may touch. Not directly mapped, but referenced during tool review.
- `privacyControlsNotes` (optional): Additional details for Beltic reviewers (e.g., “CCPA opt-out honored via support ticket”). Informational only.

---

## Updating the Manifest

- **Model Changes:** Update `primaryModelFamily`, `primaryModelProvider`, `systemConfigFingerprint`, and `manifestRevision`. Re-run relevant evaluations if changes impact safety.
- **Tool Additions/Removals:** Update the `tools` array, adjust `humanOversightMode`/`failSafeBehavior` if risk profile changes, and notify Beltic (likely requires re-issuance).
- **Privacy Policy Changes:** Modify `dataCategoriesProcessed`, retention fields, or `trainingDataUsage` and trigger review before rolling out to production.
- **Use Case Updates:** Revise `approvedUseCases`/`prohibitedUseCases` so merchants receive accurate guidance.

---

## Self-Attested vs Verified

- **Self-Attested Fields:** All manifest entries are initially self-attested. Beltic marks them as self-attested in internal tracking until verification (domain checks, data flow audits, tool demos) confirms accuracy.
- **Beltic-Verified / Overridden Fields:** Beltic may override `currentStatus`, `riskSummary`, `toolsList` classification details, or any data discovered to be inaccurate. Safety metrics and assurance metadata are always Beltic-verified.

---

## Example Workflow

1. Developer maintains `agent-manifest.json` with the fields above.
2. Before releasing a new agent version, developer updates the manifest, increments `manifestRevision`, and runs internal tests.
3. Developer submits manifest to Beltic via the intake API.
4. Beltic validates schema version, compares fields against prior submissions, and runs/requests safety evaluations.
5. Beltic issues an updated AgentCredential based on manifest data (developer-managed fields) plus verified metrics/metadata.
