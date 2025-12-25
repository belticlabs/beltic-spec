# Other Standards

## ISO/IEC

- **ISO/IEC 27001:** Aligns with operational controls; map `dataEncryptionStandards`, `incidentResponseSLO`, `monitoringCoverage`, `complianceCertifications` to Annex A controls. Credentials could cite certification IDs.
- **ISO/IEC 29100:** Privacy principles → reinforce `dataCategoriesProcessed`, `dataRetentionMaxPeriod`, training data usage; missing explicit purpose/consent evidence fields.

## Industry-specific

- **PCI DSS:** Payment tools → declare PCI scope in `complianceCertifications`; need structured field for cardholder data handling and key management (future extension).
- **HIPAA:** PHI agents need BAA evidence and minimum-necessary controls; current schema lacks dedicated consent/BAA/segregation claims.
- **SOC 2:** Can be referenced via `complianceCertifications`; might include report date/ID fields.

## OpenAPI / AsyncAPI

- Agent capabilities could reference OpenAPI specs for tools; today only prose fields (`toolsList.toolDescription`). Consider optional `specUrl`/`operationId` to ground tool actions.

## Schema.org / Linked Data

- Could map identity fields to Schema.org (`Organization`, `Person`) and risk/safety via custom terms. Benefit: semantic interoperability if pursuing JSON-LD/VC; cost: context maintenance.

## Recommendation

- Add optional compliance evidence references (report IDs/urls) and consent/BAA fields. Offer optional OpenAPI binding fields for tools. Keep Schema.org mapping as VC-context exercise post v1.
