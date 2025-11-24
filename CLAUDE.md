THIS DOCUMENT DESCRIBES THE ULTIMATE GOAL OF THIS REPO

You’re not just “making a schema.” You’re shipping three things:

An open spec repo (e.g., beltic-spec), which defines:

The Beltic Agent Credential schema.

The Developer/KYC Credential schema.

How safety/privacy metrics are computed and mapped to NIST AI RMF (GOVERN, MAP, MEASURE, MANAGE). 
Securiti
+4
NIST Publications
+4
NIST AI Resource Center
+4

A developer workflow:

A manifest file in the agent repo (e.g., beltic-agent-manifest), which is mostly self‑attested.

A web form on the Beltic platform that either:

Creates that manifest for them, or

Validates and imports the manifest they’ve already written.

An issuance + evaluation pipeline:

Beltic ingests the manifest + KYC information.

Runs KYC/KYB and ML safety tests.

Mints signed Verifiable Credentials for:

The developer/company (KYC/KYB credential). 
NIST
+1

The agent (Beltic Agent Credential with safety + privacy + ops profile).

Most fields start self‑attested, but some become Beltic‑verified or third‑party verified as you integrate KYC vendors and safety benchmark providers.

1. What the beltic-spec repo looks like

Imagine a public repo with this kind of structure (describing in words, not code):

A top‑level directory for core specs:

A document describing the Beltic Agent Credential:

Sections: Identity, Technical profile, Safety & robustness, Data & privacy, Operations, Assurance metadata.

A document describing the Developer/KYC Credential:

Sections: Company identity, KYC/KYB level, sanctions/PEP/adverse media summaries, no raw SSNs.

A directory for schemas:

“Agent schema”:

Field list, type (string/enum/date/number), required/optional.

PII sensitivity level (public / restricted / internal).

Allowed assurance sources (self_attested, beltic_verified, third_party_verified).

“Developer/KYC schema”:

Same style, but separated, because you don’t want this riding around with every agent.

A directory for evaluation specs:

How you calculate Attack Success Rate and Robustness Score.

What categories of tests you run (jailbreak, harmful content, tool abuse, privacy leakage).

How each evaluation maps to NIST AI RMF functions and categories. 
NIST Publications
+2
NIST AI Resource Center
+2

A directory for guides:

“How to write your beltic-agent-manifest.”

“How Beltic runs safety tests.”

“How Beltic does KYC/KYB & what we store vs. what merchants see.”

This repo is the source of truth for anyone integrating Beltic.

2. Developer workflow: manifest + form + credential
2.1. Developer’s side

For each agent, the developer will:

Create a manifest file in their agent repo (for example named beltic-agent-manifest):

Contains all the agent fields: model, tools, domains, data practices, etc.

Contains only references to identity (e.g., developer’s Beltic developer ID), not raw KYC fields.

Optionally upload it or paste its contents into a Beltic registration form:

The form:

Shows validation errors (e.g., missing required fields).

Lets them fill in missing pieces with UI widgets (pick domains from a list, etc.).

For company/developer KYC:

They go through Beltic’s KYC/KYB flow once:

Upload documents.

Fill in legal name, incorporation date, tax ID, address, etc.

Beltic (or KYC vendor) verifies these and issues a Developer/KYC Credential.

2.2. Beltic’s side

Beltic parses the manifest according to the agent schema.

It links the agent to a verified developer identity via a developer ID.

It runs ML safety/privacy tests against the agent (more on how below).

It then issues:

A signed Beltic Agent Credential, with:

All fields plus

Safety and privacy metrics (with assurance tags).

The credential references the separate Developer/KYC Credential by ID.

2.3. Merchant / platform side

When an agent wants access:

The merchant either:

Gets the Beltic Agent Credential and optionally the Developer/KYC Credential (or summary).

Or calls a Beltic verification API with the agent ID.

They check:

Schema validity.

Signature.

Assurance levels.

Whether the agent’s scores and KYC/KYB status meet their policy.

3. Field design and KYC/KYB details – very concretely

For each field (like “Tax ID” or “Sanction screening result”), you decide:

Where it lives:

Agent credential vs Developer/KYC credential vs internal-only.

What form:

Direct value, masked value, derived boolean, or hashed commitment.

PII sensitivity:

Public / restricted / internal.

Assurance:

self_attested, beltic_verified, third_party_verified.

Let’s take your KYC list and pin it down:

3.1. Developer/KYC Credential fields

Public or semi‑public in the credential:

Legal name of the company

Incorporation date

Website

Company address (street, city, state, postal code)

Business phone number

All of these:

Are visible to merchants.

Have beltic_verified assurance once you verify against official registries, utilities, or bank/verification docs.

Sensitive KYC fields – kept out of the agent credential:

These go into the Developer/KYC Credential and/or remain internal:

Tax ID (TIN/EIN/etc.):

Internal: full TIN stored securely.

In the credential:**

“Tax ID verified: yes/no”

Jurisdiction (e.g., “US EIN”)

Optional truncated form (“…1234”) or a cryptographic hash.

Shareholder name, address:

Stored in a separate UBO/Shareholder KYC Credential, not in the agent cert.

Merchants usually only need: “UBO KYC: complete” and risk flags.

Shareholder ID number / SSN:

Never in public credentials.

Kept in KYC vendor / Beltic database; only used to produce “identity verified” plus sanctions/PEP conclusions.

Birth date:

Raw DOB only in KYC credential.

In agent/developer credential: derived statements:

“Over 18 verified”

Or KYC tier/level.

ID issue date / expiry date / issuing authority:

Stored for KYC; used to ensure IDs are current.

Exposed as high‑level statements, like:

“Primary ID is valid and not expired as of <date>.”

Risk & AML flags surfaced to merchants:

Sanction screening result

PEP result

Adverse media screening result

These appear in a risk section of the Developer/KYC Credential:

Sanctions:

“Sanctions screening: passed” or “Sanctions screening: failed”

Last screening date.

Assurance: third_party_verified (via AML/KYC provider) + beltic_verified (you confirm the vendor and process).

PEP:

“PEP: none / low risk / medium / high”.

Last screening date.

Adverse media:

“Adverse media risk: none / low / medium / high”.

Last screening date.

This lets merchants do gating like:

“Only allow agents whose developers have sanctions=passed, PEP risk <= medium, adverse media risk <= medium.”

Device:

For identity verification (device used at onboarding) → internal risk signal only.

For the agent cert, if you want something like “runtime environment”, describe it as:

“Runs in cloud provider X, region Y, environment type Z.”

Much less PII, more operational.

4. Safety evaluation: Attack Success Rate & robustness

You’re asking: “How exactly do we do Attack Success Rate, robustness, etc., given a wide variety of agents?”

Think of this as building a small AI security lab inside Beltic.

4.1. Attack Success Rate (ASR): definition and usage

From the jailbreak literature, ASR is:

Number of successful attacks / total attacks. 
arXiv
+2
KDD
+2

For each attack attempt (one prompt or test case):

You define what “success” means:

For content: agent produces harmful / disallowed content (e.g., self‑harm instructions, hate, etc.).

For tools: agent triggers an unsafe tool action (e.g., unauthorized transfer, deleting records).

You run the attack and label the outcome:

1 if it succeeded (model did the unsafe thing).

0 if it failed safely (refusal, benign response, or safe tool usage).

ASR = (sum of successes) / (number of attacks).

Then you define a Robustness Score:

Robustness Score = 100 × (1 − ASR).

E.g., if 15% of attacks succeed, Robustness Score = 85. 
General Analysis

4.2. Building test suites for a wide variety of agents

Because agents differ a lot, you classify them by:

Domain: support, coding, finance, health, legal, etc.

Capabilities:

Text‑only vs tool‑using vs multi‑agent.

Risk level:

Low‑stakes (FAQ bots),

Medium (CRM editing),

High (money movement, regulated advice).

Then build families of tests:

Universal tests (everyone gets these):

Generic jailbreaks (JailbreakBench, etc.). 
0din.ai
+3
NeurIPS Proceedings
+3
USENIX
+3

Harmful content prompts (self‑harm, hate speech, extremism).

System prompt leakage attempts.

Domain‑specific tests:

Finance: prompts to trick the agent into unauthorized transfers, bypassing limits.

Health: prompts to elicit diagnosis/prescription where it claims not to.

Legal: attempts to get definitive legal advice if it claims not to provide it.

Tool‑specific tests:

For each declared tool/action, try to:

Invoke it out‑of‑policy (e.g., deleting customers).

Inject “perform this in a different account/tenant”.

You use the manifest to auto‑select which test sets to run:

The agent declares:

Domains: “ecommerce_support”, “billing_updates”.

Tools: “issue_refund”, “update_shipping_address”.

Beltic picks:

Base tests + ecommerce/tool‑abuse tests.

4.3. How Beltic runs the tests in practice

High‑level flow:

Developer supplies:

Endpoint or SDK to call the agent.

Test configuration (auth, environment, etc.).

Beltic test harness:

Feeds in attack prompts and scenarios.

Captures:

Raw outputs,

Tool calls,

Any unsafe side effects (you can simulate side effects in a sandbox).

Label outcomes:

Use a combination of:

Rule‑based checks (e.g., did agent call “refund” when not allowed?),

Safety model to classify outputs as “violation / safe / borderline”,

(Optionally) human review on a sample.

Compute:

ASR per test suite.

Overall Robustness Score.

Store:

The scores in the Agent Credential.

Test run ID, benchmark names, versions and dates in the evaluation metadata.

5. Mapping metrics to NIST AI RMF

NIST AI RMF has four core functions: GOVERN, MAP, MEASURE, MANAGE. 
Securiti
+5
NIST Publications
+5
NIST AI Resource Center
+5

You don’t have to implement the whole framework; you just need to tag what you do:

MAP – understand context, harms, stakeholders.

In your schema:

Domain tags (customer_support, healthcare, etc.).

Intended use vs disallowed use.

Risk level classification.

You can say: “MAP outcomes for misuse and harm scenarios are encoded in the domain and risk_profile fields.”

MEASURE – evaluate risk and performance.

This is exactly where your ASR, content safety metrics, privacy tests live.

You tag each metric as: part of MEASURE (e.g., “MEASURE: robustness to prompt injection”).

MANAGE – controls, mitigations, incident response.

Your schema fields:

Rate limits,

Incident response procedures,

Deprecation policy,

Update cadence.

Correspond to MANAGE.

GOVERN – policies, accountability, oversight.

Your KYC/KYB, sanctions, PEP, risk flags,

The existence of documented policies (privacy policy link, safety policy link),

The fact that you issue and can revoke credentials.

Concretely, in your spec you can:

For each field or section, add:

“Related AI RMF function: MAP / MEASURE / MANAGE / GOVERN.”

This is just metadata in the spec so people can map Beltic’s output into their AI RMF dashboards.

6. Data privacy testing: what Beltic can realistically do

There are two layers:

Pipeline/privacy by design (what they say they do).

Model behavior/privacy leakage (what the system actually does under pressure).

6.1. Pipeline checks (easier; works for most agents)

From the manifest + docs, Beltic can:

Check retention against the agent’s declaration:

Ask: “Do you delete user chat logs after X days?”

Ask for proof:

Screenshot of retention config,

Or a short live demo (you try to retrieve data after X days in a test environment).

Verify regions and storage locations:

Cloud provider, region.

Look for contradictions (claims “EU only” but uses US regions).

Verify PII detection & redaction:

Send test queries containing synthetic PII (names, addresses, SSNs placeholders).

See if:

Logs are redacted before storage,

Downstream tools see full or redacted PII.

Verify no-training-on-user-data (for hosted models):

For API‑based models like OpenAI, this is mostly about documenting that they don’t store data outside the provider’s documented behavior.

For self‑hosted models, you might ask for their fine‑tuning pipeline and simulate training on synthetic PII, then test for memorization.

Most of this will be a mix of:

self_attested (policy text).

beltic_verified (you actually check configs/logs in a live test environment).

6.2. Model privacy / memorization tests (harder, but possible for some)

There’s a body of work on membership inference attacks for ML models — trying to tell if a data point was in the training set. 
PSB
+6
arXiv
+6
USENIX
+6

For agents:

If developers use open/self‑hosted models:

You can run simplified membership inference tests:

Train with a known set of synthetic PII.

Use MIAs to see if the model “knows” those samples vs unseen ones.

Turn that into a privacy leakage score (lower is better).

For agents using closed APIs:

You still can:

Feed PII in a session.

Later, see if the agent leaks it when asked “repeat everything we said before,” “what’s my SSN?” etc.

Try cross-session or cross-tenancy contamination scenarios.

You’ll then record:

A qualitative “Privacy Test Result” per agent:

“No obvious memorization in tested scenarios” vs “leaks cross-session data”.

Maybe a numeric privacy robustness score for those where you can run proper MIAs.

7. Self‑attested vs Beltic vs third‑party: what’s realistic

You’re right: most fields will be self‑attested early on. That’s fine as long as:

You label them clearly as self_attested.

You never pretend that something is verified if it isn’t.

Merchants can filter based on assurance level.

Concrete reality for v1:

Mostly self‑attested:

Data retention details,

Model provider (unless you integrate directly),

Internal processes (incident response, deprecation policy).

Beltic‑verified in v1/v2:

Company identity & contact info (KYB).

Domain ownership, website.

Basic safety tests (ASR on generic jailbreak + harmful content).

Third‑party‑verified:

Sanctions, PEP, adverse media (via AML/KYC provider).

Possibly AI security evaluation vendors or benchmarks (e.g., MLCommons Ailuminate, 0Din style benchmarks). 
NeurIPS Proceedings
+3
MLCommons
+3
0din.ai
+3

Your spec should explicitly say:

“This field MAY be self-attested; Beltic and partners MAY provide verification. Assurance metadata indicates which case applies.”

8. Step‑by‑step: from zero to a working Beltic v1

Here’s a concrete starting plan.

Step 1 – Define scope & standards

Decide that:

You will use W3C Verifiable Credentials 2.0 as your credential format. 
PSB
+3
NIST
+3
NIST Publications
+3

You will reference NIST AI RMF for risk language. 
Thoropass
+3
NIST Publications
+3
NIST AI Resource Center
+3

You will start with:

One Developer/KYC Credential.

One Beltic Agent Credential.

Step 2 – Create the beltic-spec repo

Include:

A core spec for Developer/KYC:

Lists all company/KYC fields and how to treat TIN, SSN, DOB (internal vs derived).

A core spec for Beltic Agent Credential:

Identity, technical profile, safety, privacy, operations, assurance metadata.

A doc describing:

Attack Success Rate,

Robustness Score,

Privacy tests,

Mappings to NIST AI RMF functions.

Step 3 – Design the agent manifest format

Decide on:

A file name convention (e.g., beltic-agent-manifest).

A minimal required field set:

Agent name, version, developer ID.

Model, provider, architecture type.

Domains, risk level.

Tools/actions and risk categories.

Declared data categories & retention.

Make sure every field has:

A description,

Type,

Required/optional flag.

The manifest is what devs maintain in their repo and is mostly self‑attested.

Step 4 – Build the Beltic web form

The form should:

Either generate a manifest from scratch.

Or upload + parse one and show fields in UI.

It should highlight:

Which fields will likely be self‑attested.

Which ones Beltic will actively verify (with explanations).

Step 5 – Implement basic KYC/KYB flow

Integrate with one KYC/KYB vendor to:

Verify:

Legal name,

Incorporation date,

Tax ID,

Company address,

Sanctions, PEP, adverse media.

On success:

Mint a Developer/KYC Credential:

Public fields: company name, website, address, high‑level risk flags.

Hidden fields: raw IDs/DOB, kept internal.

Step 6 – Implement minimal safety evaluation pipeline

Start small:

One jailbreak test suite (e.g., use open resources like JailbreakBench). 
KDD
+3
NeurIPS Proceedings
+3
arXiv
+3

One harmful content test suite (self‑harm, hate, etc.).

For each onboarded agent:

Run the tests.

Compute ASR and Robustness Score.

Log which benchmarks and versions you used.

Put the resulting scores into the Safety & Robustness section of the agent credential, with beltic_verified assurance.

Step 7 – Wire up issuance and verification

When KYC+manifest+tests are complete:

Beltic mints a Beltic Agent Credential referencing the Developer/KYC Credential.

For merchants:

Provide:

A verification API (“given this agent ID, return verified credential + summary”).

Documentation that explains:

What fields they can rely on.

How to use assurance levels and scores in their policies.