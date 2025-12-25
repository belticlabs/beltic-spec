# Signature Scheme v1 (Draft)

## Abstract

Defines the signing/verification profile for Beltic credentials using JWS (JWT-compatible) with ES256 or EdDSA. Provides claim mapping, header parameters, security requirements, and verification steps suitable for independent implementations.

## Status

Draft

## Terminology

- **Credential**: DeveloperCredential or AgentCredential JSON payload.
- **Issuer**: Entity signing the credential (Beltic or authorized third-party).
- **Subject**: Credential holder (developer org or agent DID).
- **Verifier**: Entity validating and consuming credentials.
- **Status List**: Revocation bitstring document (W3C Status List 2021 style).
- **JWS**: JSON Web Signature (RFC 7515).
- **JWT**: JSON Web Token (RFC 7519).

---

## Algorithm Policy

### Supported Algorithms

| Algorithm | Status          | Key Type          | Use Case               |
| --------- | --------------- | ----------------- | ---------------------- |
| `ES256`   | **Required**    | P-256 (secp256r1) | Default for production |
| `EdDSA`   | **Recommended** | Ed25519           | High-security contexts |
| `ES384`   | Optional        | P-384             | Enhanced security      |
| `ES512`   | Optional        | P-521             | Maximum security       |

### Prohibited Algorithms

The following algorithms MUST be rejected by all verifiers:

| Algorithm                 | Reason                                      |
| ------------------------- | ------------------------------------------- |
| `none`                    | No signature - critical vulnerability       |
| `HS256`, `HS384`, `HS512` | Symmetric - unsuitable for credentials      |
| `RS256`, `RS384`, `RS512` | Legacy RSA - deprecated for new credentials |
| `PS256`, `PS384`, `PS512` | RSA-PSS - deprecated for new credentials    |

### Algorithm Validation Rules

```
RULE ALG-001: Verifiers MUST reject JWS with alg="none"
RULE ALG-002: Verifiers MUST reject symmetric algorithms (HS*)
RULE ALG-003: Verifiers SHOULD reject RSA algorithms for credentials issued after 2025-01-01
RULE ALG-004: Issuers MUST use ES256 or EdDSA for new credentials
RULE ALG-005: Key size MUST match algorithm requirements (P-256 for ES256, Ed25519 for EdDSA)
```

### Algorithm Agility

To support future algorithm migration:

1. Verifiers SHOULD maintain an allowlist of accepted algorithms per credential type
2. Issuers MUST NOT downgrade algorithms without explicit policy change
3. Algorithm preference is: EdDSA > ES512 > ES384 > ES256

---

## JWS Header Requirements

### Required Headers

| Header | Type   | Description       | Validation                |
| ------ | ------ | ----------------- | ------------------------- |
| `alg`  | string | Signing algorithm | MUST be in allowed list   |
| `kid`  | string | Key identifier    | MUST resolve to valid key |
| `typ`  | string | Media type        | MUST match expected type  |

### Optional Headers

| Header     | Type   | Description             | Validation                             |
| ---------- | ------ | ----------------------- | -------------------------------------- |
| `cty`      | string | Content type            | If present, MUST be `application/json` |
| `crit`     | array  | Critical headers        | Extensions requiring processing        |
| `x5c`      | array  | X.509 certificate chain | For PKI integration                    |
| `x5t#S256` | string | X.509 thumbprint        | Certificate binding                    |

### Header Validation Rules

```
RULE HDR-001: alg header MUST be present and non-empty
RULE HDR-002: kid header MUST be present and resolve to a valid public key
RULE HDR-003: typ header MUST be one of:
              - "application/beltic-agent+jwt"
              - "application/beltic-developer+jwt"
              - "JWT" (legacy, deprecated)
RULE HDR-004: If crit header present, all listed headers MUST be understood
RULE HDR-005: Unrecognized critical headers MUST cause rejection
RULE HDR-006: kid MUST match pattern: ^did:(web|key|ion|pkh|ethr):[a-zA-Z0-9._%-]+#[a-zA-Z0-9._%-]+$
              OR JWKS key ID pattern for non-DID issuers
```

### Media Type Values

| Credential Type      | typ Value                          |
| -------------------- | ---------------------------------- |
| Agent Credential     | `application/beltic-agent+jwt`     |
| Developer Credential | `application/beltic-developer+jwt` |

---

## JWT Claims Mapping

### Standard Claims

| JWT Claim | Credential Field            | Type           | Required    |
| --------- | --------------------------- | -------------- | ----------- |
| `iss`     | `issuerDid`                 | DID string     | Yes         |
| `sub`     | `subjectDid`                | DID string     | Yes         |
| `jti`     | `credentialId`              | UUID           | Yes         |
| `nbf`     | `issuanceDate`              | Unix timestamp | Yes         |
| `exp`     | `expirationDate`            | Unix timestamp | Yes         |
| `iat`     | (derived from issuanceDate) | Unix timestamp | Recommended |

### Extended Claims

| JWT Claim        | Description               | Type         | Required    |
| ---------------- | ------------------------- | ------------ | ----------- |
| `vc` or `beltic` | Full credential body      | object       | Yes         |
| `aud`            | Intended verifier(s)      | string/array | Optional    |
| `cnf`            | Holder confirmation (PoP) | object       | Optional    |
| `nonce`          | Replay protection         | string       | Conditional |

### Claims Mapping Rules

```
RULE CLM-001: iss MUST equal credential.issuerDid
RULE CLM-002: sub MUST equal credential.subjectDid
RULE CLM-003: jti MUST equal credential.credentialId (UUID format)
RULE CLM-004: nbf MUST be Unix timestamp of credential.issuanceDate
RULE CLM-005: exp MUST be Unix timestamp of credential.expirationDate
RULE CLM-006: exp MUST be greater than nbf
RULE CLM-007: vc.schemaVersion MUST match outer credential schema version
RULE CLM-008: If aud present, verifier MUST be in audience list
```

### Date/Time Handling

```
RULE TIME-001: All timestamps MUST be Unix epoch seconds (not milliseconds)
RULE TIME-002: nbf and exp MUST NOT be in the distant future (>10 years)
RULE TIME-003: Clock skew tolerance MUST NOT exceed 5 minutes (300 seconds)
RULE TIME-004: Verifiers SHOULD reject credentials with exp - nbf > 2 years
```

---

## Replay Protection

### Mechanisms

1. **Temporal Validation**: `nbf` ≤ current_time ≤ `exp`
2. **Unique Identifier**: `jti` (credentialId) uniqueness
3. **Nonce Challenge**: For presentation requests
4. **Audience Restriction**: `aud` claim binding

### Replay Protection Rules

```
RULE RPL-001: Verifiers MUST validate nbf ≤ now ≤ exp (with clock skew tolerance)
RULE RPL-002: Verifiers SHOULD cache seen jti values during credential validity period
RULE RPL-003: Duplicate jti within same issuer namespace SHOULD be rejected
RULE RPL-004: Presentation requests SHOULD include unique nonce
RULE RPL-005: Presentations MUST echo nonce if provided in request
RULE RPL-006: Nonce MUST be cryptographically random (min 128 bits entropy)
RULE RPL-007: Nonce validity window SHOULD NOT exceed 10 minutes
```

### jti Uniqueness Requirements

| Context             | Uniqueness Scope     | Cache Duration      |
| ------------------- | -------------------- | ------------------- |
| Credential Issuance | Global (per issuer)  | Credential lifetime |
| Presentation        | Per verifier session | Session duration    |
| Status Check        | N/A                  | N/A                 |

### Implementation Recommendations

```typescript
interface ReplayProtection {
  // Cache for tracking seen credential IDs
  seenCredentials: Map<
    string,
    {
      jti: string;
      iss: string;
      exp: number;
      firstSeen: number;
    }
  >;

  // Check if credential was already processed
  checkReplay(jti: string, iss: string): boolean;

  // Record credential as seen
  recordSeen(jti: string, iss: string, exp: number): void;

  // Cleanup expired entries
  pruneExpired(): void;
}
```

---

## Signing Process

### Step-by-Step Signing

1. **Prepare Credential**
   - Validate all required fields are present
   - Ensure schema compliance
   - Generate `credentialId` (UUID v4) if not present
   - Set `issuanceDate` to current time
   - Calculate `expirationDate` based on policy

2. **Build JWT Header**

   ```json
   {
     "alg": "ES256",
     "kid": "did:web:beltic.com#key-1",
     "typ": "application/beltic-agent+jwt"
   }
   ```

3. **Build JWT Payload**

   ```json
   {
     "iss": "did:web:beltic.com",
     "sub": "did:web:example-agent.com",
     "jti": "550e8400-e29b-41d4-a716-446655440000",
     "nbf": 1700000000,
     "exp": 1731536000,
     "iat": 1700000000,
     "vc": {
       /* full credential object */
     }
   }
   ```

4. **Canonicalize and Encode**
   - Serialize header as UTF-8 JSON
   - Serialize payload as UTF-8 JSON
   - Base64url encode both without padding

5. **Sign**
   - Create signing input: `base64url(header) + "." + base64url(payload)`
   - Sign with private key matching `kid`
   - Base64url encode signature

6. **Assemble**
   - Output: `header.payload.signature` (compact serialization)

### Deterministic Serialization

For reproducible signatures:

- Sort object keys lexicographically
- No whitespace between tokens
- UTF-8 encoding
- No trailing commas or comments

---

## Verification Process

### Step-by-Step Verification

1. **Parse JWS/JWT**

   ```
   CHECK VER-001: Token has exactly 3 parts separated by "."
   CHECK VER-002: Each part is valid base64url
   CHECK VER-003: Header and payload are valid JSON
   ```

2. **Validate Header**

   ```
   CHECK VER-004: alg is in allowed algorithm list
   CHECK VER-005: alg is NOT "none" or symmetric
   CHECK VER-006: kid is present and non-empty
   CHECK VER-007: typ matches expected credential type
   ```

3. **Resolve Issuer Key**

   ```
   CHECK VER-008: Resolve DID document for issuer
   CHECK VER-009: Find verification method matching kid
   CHECK VER-010: Key type matches alg requirements
   CHECK VER-011: Key is not revoked or expired
   ```

4. **Verify Signature**

   ```
   CHECK VER-012: Signature is valid for header.payload
   CHECK VER-013: Signature uses key from kid
   ```

5. **Validate Temporal Claims**

   ```
   CHECK VER-014: nbf ≤ current_time + clock_skew
   CHECK VER-015: exp ≥ current_time - clock_skew
   CHECK VER-016: exp > nbf
   ```

6. **Validate Audience (if present)**

   ```
   CHECK VER-017: If aud present, verifier identity in aud list
   ```

7. **Check Revocation Status**

   ```
   CHECK VER-018: Fetch status list from credential.status or revocationListUrl
   CHECK VER-019: Decode and check bit at statusListIndex
   CHECK VER-020: credentialStatus is not "revoked" or "suspended"
   ```

8. **Validate Credential Body**

   ```
   CHECK VER-021: vc object validates against JSON Schema
   CHECK VER-022: Claims mapping consistency (iss = vc.issuerDid, etc.)
   ```

9. **Enforce Policy**
   ```
   CHECK VER-023: kybTier meets minimum requirement
   CHECK VER-024: Safety scores meet thresholds
   CHECK VER-025: Data categories are acceptable
   ```

### Verification Result

```typescript
interface VerificationResult {
  valid: boolean;
  credential?: DecodedCredential;
  errors: VerificationError[];
  warnings: VerificationWarning[];
  metadata: {
    algorithm: string;
    issuer: string;
    subject: string;
    issuedAt: Date;
    expiresAt: Date;
    revocationChecked: boolean;
    schemaValidated: boolean;
  };
}

interface VerificationError {
  code: string; // e.g., "VER-004"
  message: string;
  fatal: boolean;
}
```

---

## Revocation

### Status List 2021 (Recommended)

Credential carries status entry:

```json
{
  "status": {
    "id": "https://status.beltic.io/agents/v1#list",
    "type": "StatusList2021Entry",
    "statusPurpose": "revocation",
    "statusListIndex": "1234",
    "statusListCredential": "https://status.beltic.io/agents/v1"
  }
}
```

### Revocation Check Process

1. Fetch status list credential from `statusListCredential` URL
2. Verify status list credential signature
3. Decode compressed bitstring
4. Check bit at `statusListIndex`
5. Bit = 0: Not revoked; Bit = 1: Revoked

### Legacy Support

For backward compatibility, credentials MAY include:

```json
{
  "revocationListUrl": "https://beltic.com/status/credentials.json",
  "credentialStatus": "active"
}
```

Verifiers SHOULD prefer Status List 2021 when both are present.

---

## Key Management

### Issuer Key Requirements

| Requirement | Description                                                |
| ----------- | ---------------------------------------------------------- |
| Storage     | HSM or cloud KMS (AWS KMS, GCP Cloud HSM, Azure Key Vault) |
| Access      | Role-based access control with audit logging               |
| Rotation    | Regular rotation (recommended: 1 year)                     |
| Backup      | Secure backup with geographic redundancy                   |
| History     | Maintain history for verifying older credentials           |

### Key Rotation Process

1. Generate new key pair in HSM/KMS
2. Publish new `kid` in JWKS/DID document
3. Overlap validity period (old key valid for verification only)
4. Issue new credentials with new key
5. After transition period, archive old key

### Subject Key Binding

For holder confirmation (Proof of Possession):

```json
{
  "cnf": {
    "jwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "...",
      "y": "..."
    }
  }
}
```

Or using key thumbprint:

```json
{
  "cnf": {
    "jkt": "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I"
  }
}
```

---

## Security Considerations

### Attack Mitigations

| Attack                  | Mitigation                                |
| ----------------------- | ----------------------------------------- |
| Algorithm confusion     | Strict algorithm allowlist; reject `none` |
| Key substitution        | Bind `kid` to specific issuer DID         |
| Replay attacks          | `jti` uniqueness + temporal validation    |
| Token substitution      | Verify `aud` if present                   |
| Signature stripping     | Always require signature verification     |
| Clock skew exploitation | Maximum 5-minute tolerance                |

### Implementation Requirements

```
REQ SEC-001: MUST validate alg before processing signature
REQ SEC-002: MUST NOT accept tokens with missing or empty signatures
REQ SEC-003: MUST verify kid matches expected issuer
REQ SEC-004: MUST use constant-time signature comparison
REQ SEC-005: MUST validate all claims before trusting credential
REQ SEC-006: SHOULD implement rate limiting on verification endpoints
REQ SEC-007: SHOULD log verification failures for security monitoring
```

### Error Handling

Verifiers SHOULD NOT leak information about:

- Which specific validation step failed (to external parties)
- Internal key management details
- Status list implementation details

Log detailed errors internally but return generic failure to untrusted callers.

---

## Test Vectors

### Minimal Agent Credential (ES256)

```
Header:
{
  "alg": "ES256",
  "kid": "did:web:beltic.com#key-test-1",
  "typ": "application/beltic-agent+jwt"
}

Payload:
{
  "iss": "did:web:beltic.com",
  "sub": "did:web:test-agent.example",
  "jti": "550e8400-e29b-41d4-a716-446655440000",
  "nbf": 1700000000,
  "exp": 1731536000,
  "vc": {
    "schemaVersion": "1.0",
    "agentName": "Test Agent",
    "agentVersion": "1.0.0",
    "primaryModelProvider": "anthropic",
    "primaryModelFamily": "claude-3-sonnet",
    ...
  }
}

Test Key (P-256):
  Private: (published in test fixtures)
  Public x: (published in test fixtures)
  Public y: (published in test fixtures)

Expected JWS:
  (to be generated with actual test keys)
```

### Invalid Token Examples

Test vectors for rejection:

1. **alg=none**: Must reject
2. **alg=HS256**: Must reject (symmetric)
3. **Missing kid**: Must reject
4. **Expired token**: Must reject
5. **Future nbf**: Must reject
6. **Invalid signature**: Must reject
7. **Wrong typ**: Must reject

---

## Appendix A: Error Codes

| Code    | Description                   |
| ------- | ----------------------------- |
| SIG-001 | Invalid JWS structure         |
| SIG-002 | Unsupported algorithm         |
| SIG-003 | Algorithm "none" not allowed  |
| SIG-004 | Missing kid header            |
| SIG-005 | Invalid kid format            |
| SIG-006 | Key not found for kid         |
| SIG-007 | Key type mismatch             |
| SIG-008 | Signature verification failed |
| SIG-009 | Token expired                 |
| SIG-010 | Token not yet valid           |
| SIG-011 | Invalid audience              |
| SIG-012 | Credential revoked            |
| SIG-013 | Status list unavailable       |
| SIG-014 | Schema validation failed      |
| SIG-015 | Claims mapping inconsistent   |
| SIG-016 | Replay detected               |

## Appendix B: References

- [RFC 7515](https://tools.ietf.org/html/rfc7515) - JSON Web Signature (JWS)
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JSON Web Token (JWT)
- [RFC 7517](https://tools.ietf.org/html/rfc7517) - JSON Web Key (JWK)
- [W3C VC Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/) - Verifiable Credentials
- [W3C Status List 2021](https://w3c-ccg.github.io/vc-status-list-2021/) - Credential Status
- [DID Core](https://www.w3.org/TR/did-core/) - Decentralized Identifiers
