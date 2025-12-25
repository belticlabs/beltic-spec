# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Security: Fixed prototype pollution vulnerability in fast-json-patch by adding npm override to force version 3.1.1

### Added
- Initial changelog

## [1.0.0] - 2024-12-XX

### Added
- DeveloperCredential v1 specification and JSON Schema
- AgentCredential v1 specification and JSON Schema
- DeveloperCredential v2 specification and JSON Schema
- AgentCredential v2 specification and JSON Schema
- DelegationCredential v1 specification and JSON Schema
- HTTP Message Signatures Directory v1 schema
- Comprehensive validation guide with AJV and jsonschema examples
- Example credentials (valid and invalid test cases)
- Conditional validation rules testing (27 rules for DeveloperCredential)
- NIST AI RMF mapping documentation
- Evaluation metrics specification
- Agent manifest specification
- Trust model documentation
- Signature scheme documentation
- Schema versioning policy
- Integration guide for implementers
- Merchant FAQ documentation
- Standards compliance analysis (W3C VC, IETF compatibility)
- Progress tracking log for specification development

### Changed
- Improved schema validation with Draft 2020-12 support
- Enhanced conditional rule testing
- Updated examples with comprehensive test cases

### Fixed
- Schema validation edge cases
- Conditional rule logic improvements

