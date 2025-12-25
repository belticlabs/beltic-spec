# Schema Format Justification

## Comparison Snapshot

| Criterion             | JSON Schema         | Protobuf          | JSON-LD+SHACL | XML Schema   |
| --------------------- | ------------------- | ----------------- | ------------- | ------------ |
| Readability           | High                | Low               | Medium        | Low          |
| Tooling               | Excellent           | Excellent         | Limited       | Mature (XML) |
| Web-native            | Yes                 | Needs translation | Yes           | Legacy       |
| Developer familiarity | High                | Medium            | Low           | Low          |
| Signature support     | External (JWS/COSE) | Custom            | LD-Proofs     | XML-DSig     |
| Semantics             | Structural only     | Structural        | Semantic      | Structural   |

## Conclusion

- JSON Schema remains the right choice for structural validation and DX. Pair it with JWS/COSE for integrity. If VC/JSON-LD alignment is pursued, keep JSON Schema for validation while adding contexts for semantics.
