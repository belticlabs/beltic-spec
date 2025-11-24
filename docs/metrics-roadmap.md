# Beltic Metrics Roadmap

## v1 Scope (Current)
The v1 AgentCredential includes four robustness metrics, each expressed as Attack Success Rate (ASR) and the derived robustness score:
- **Prompt Injection Robustness** – ability to resist instruction hijacking.
- **Harmful Content Refusal** – refusal rate for toxic or policy-violating content.
- **Tool Abuse Robustness** – protection against unsafe tool invocation (evaluated when tools exist).
- **PII Leakage Robustness** – resilience against attempts to extract sensitive data.

### Why these metrics?
These four areas directly impact merchant safety and privacy. They are measurable today with standardized adversarial suites, provide clear allow/deny signals, and integrate with Beltic’s automated evaluation pipeline. Focusing v1 on safety, privacy, and transparency ensures every credential has actionable data without over-promising on areas where industry standards are immature.

## Explicitly Out of Scope for v1

### Reliability Metrics
- **Uptime / Availability:** Deferred because Beltic does not yet collect independent telemetry across hosting environments. Requires standardized SLAs, instrumentation, and audit trails.
- **Error Rates:** Deferred until we can normalize definitions (e.g., business logic vs. infrastructure errors) across agents.
- **Performance SLAs (latency, throughput):** Deferred due to high variance between agent architectures and merchant integrations; would require optional benchmark harnesses.

### Fairness Metrics
- **Bias Detection:** Deferred because there is no unified prompt/test set accepted across domains. Needs collaboration with domain experts and regulatory bodies.
- **Demographic Parity:** Requires demographic labeling that many agents do not—or should not—collect. Legal frameworks differ across regions.
- **Disparate Impact Analysis:** Dependent on sensitive attribute availability and statistical power; compliance and privacy trade-offs must be resolved first.

### Other Considerations
- **Economic Impact / ROI metrics:** Outside Beltic’s trust remit; best captured via seller/developer contracts.
- **Explainability scores:** Tracked as a potential enhancement once tooling matures; not part of v1 requirements.

## v2 Roadmap
Planned additions (subject to feasibility studies):
- **Reliability Pack (target: v2.0):** standardized uptime + error-rate attestations pulled from developer monitoring exports.
- **Fairness Pack (target: v2.x pilots):** bias testing templates for regulated industries (finance, healthcare) once shared datasets are agreed upon.
- **Optional performance indicators (target: v2.x):** throughput/latency disclosures for agents that opt in.
Prerequisites include telemetry pipelines, auditor accreditation, and consensus on metric definitions.

## Handling Merchant Questions
When merchants ask about out-of-scope metrics:
- Explain that Beltic v1 focuses on safety and privacy controls; reliability/fairness are on the roadmap (link this document).
- Encourage merchants to request SLAs, monitoring dashboards, or fairness studies directly from developers as interim evidence.
- Record recurring demands in `progress.md` so prioritization reflects real-world needs.
