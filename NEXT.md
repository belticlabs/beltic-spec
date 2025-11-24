# Next Steps: Cryptography & CLI Implementation

## 1. Cryptographic Implementation Plan (Rust)

We will use the Rust ecosystem to build a secure, high-performance implementation of the Beltic Signature Scheme (v1).

### Selected Stack
- **Language:** Rust (2021 edition)
- **JWT/JWS Library:** `jsonwebtoken` (Supports ES256 and EdDSA via `ring`)
- **Serialization:** `serde`, `serde_json`
- **CLI Framework:** `clap` (v4, with `derive` feature)
- **Error Handling:** `anyhow` (for application), `thiserror` (for library)
- **Async Runtime:** `tokio` (only if needed for network status checks later; strictly optional for core crypto)

### Algorithm Specifications

#### ES256 (Required)
- **Curve:** P-256 (secp256r1)
- **Hash:** SHA-256
- **Signature Format:** IEEE P1363 (R|S) as required by JWS, NOT ASN.1 DER.
- **Library Config:** `Algorithm::ES256` in `jsonwebtoken` handles the format conversion automatically.

#### EdDSA (Recommended)
- **Curve:** Ed25519
- **Signature:** Deterministic
- **Library Config:** `Algorithm::EdDSA` in `jsonwebtoken`.

### JWS Envelope Format
Beltic credentials will be wrapped in a standard JWS Compact Serialization:
`BASE64URL(Header) . BASE64URL(Payload) . BASE64URL(Signature)`

**Header:**
```json
{
  "alg": "ES256" | "EdDSA",
  "typ": "application/beltic-agent+jwt",
  "kid": "<key-id-or-did-verification-method>"
}
```

**Payload:**
The standard Beltic JSON credential, plus JWT specific claims:
```json
{
  "iss": "did:...",
  "sub": "did:...",
  "jti": "<credential-id>",
  "nbf": <timestamp>,
  "exp": <timestamp>,
  "vc": { ... full beltic credential object ... }
}
```

---

## 2. Official Test Vectors (v1)

Use these keypairs to validate your implementation. They are generated for testing purposes only. **DO NOT USE IN PRODUCTION.**

### Test Vector Set A: ES256 (Prime256v1)

**Private Key (PEM):**
```pem
-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIDGoJN83LITqdVM0gQkfNsTKd/XqUcd3f2IMpdHkTpV3oAoGCCqGSM49
AwEHoUQDQgAEqkAoBg7OgZwRXkjtOCIwSFzh/iqDrDhg4nxTX6ispLjaHC9Y6wm9
o2EpE1gcrkKffvCvuZF5fzEg4Nb3D67TOQ==
-----END EC PRIVATE KEY-----
```

**Public Key (PEM):**
```pem
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqkAoBg7OgZwRXkjtOCIwSFzh/iqD
rDhg4nxTX6ispLjaHC9Y6wm9o2EpE1gcrkKffvCvuZF5fzEg4Nb3D67TOQ==
-----END PUBLIC KEY-----
```

### Test Vector Set B: EdDSA (Ed25519)

**Private Key (PEM):**
```pem
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIPoRSmw90QobH8dba5qbBuU5wl0qClkf/13XimjMXAHE
-----END PRIVATE KEY-----
```

**Public Key (PEM):**
```pem
-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAFxINQgasPfpJkeFJjNcNIxE/QAFWkfb1BkJLVjS2IWg=
-----END PUBLIC KEY-----
```

### Test Payload (Canonical)

Use this JSON object as the payload for generating test signatures:

```json
{
  "sub": "did:web:example.com",
  "name": "Test Credential",
  "iat": 1516239022
}
```

---

## 3. Rust CLI Implementation Plan (`beltic-cli`)

The CLI will be a standalone binary that developers use to sign manifests and verify credentials.

### Architecture

```
beltic-cli/
├── Cargo.toml
└── src/
    ├── main.rs           # Entry point, CLI argument parsing (clap)
    ├── commands/         # Command logic
    │   ├── mod.rs
    │   ├── keygen.rs     # Key generation
    │   ├── sign.rs       # JWS signing
    │   └── verify.rs     # JWS verification & schema validation
    └── crypto/           # Core crypto wrappers
        ├── mod.rs
        ├── signer.rs     # Abstraction over ES256/EdDSA
        └── verifier.rs
```

### CLI Commands Design

1.  **`beltic keygen`**
    *   `--alg <ES256|EdDSA>` (default: EdDSA)
    *   `--out <path>` (output private key)
    *   `--pub <path>` (output public key)

2.  **`beltic sign`**
    *   `--key <private-key-path>`
    *   `--alg <ES256|EdDSA>` (infer from key if possible)
    *   `--payload <json-file>`
    *   `--out <file>` (outputs .jwt)

3.  **`beltic verify`**
    *   `--key <public-key-path>`
    *   `--token <jwt-file>`
    *   Outputs: `VALID` (exit code 0) or `INVALID` (exit code 1) + JSON payload

### Security & Performance Strategy

1.  **Zeroization:** Use `zeroize` crate to clear private keys from memory after use.
2.  **Strict Parsing:** `serde` with `deny_unknown_fields` where appropriate to prevent loose schema interpretation.
3.  **Release Profile:**
    ```toml
    [profile.release]
    lto = true
    codegen-units = 1
    strip = true
    ```
4.  **Audit:** Run `cargo audit` in CI.

---

## 4. Immediate Implementation Steps

1.  [ ] **Initialize Rust Project:** `cargo new beltic-cli`
2.  [ ] **Dependencies:** Add `clap`, `jsonwebtoken`, `serde`, `anyhow`.
3.  [ ] **Implement Crypto Module:**
    *   Write `signer.rs` to load PEM keys and produce JWS.
    *   Write tests using the **Test Vectors** above to verify the implementation works against standard tools (OpenSSL).
4.  [ ] **Implement CLI Logic:** Wire up `sign` and `verify` commands.
5.  [ ] **CI/CD:** Add GitHub Action to run `cargo test`.


