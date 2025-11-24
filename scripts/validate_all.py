#!/usr/bin/env python3

"""
validate_all.py

Python validation script for Beltic credentials.
Validates all agent and developer credentials using jsonschema.
"""

import json
import sys
import glob
from pathlib import Path
from typing import List, Tuple
from jsonschema import Draft202012Validator, ValidationError

# Colors for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'

def log(color: str, message: str):
    """Print colored log message."""
    print(f"{color}{message}{Colors.RESET}")

def validate_credential_set(
    schema_path: str,
    pattern: str,
    credential_type: str
) -> Tuple[int, int]:
    """
    Validate a set of credentials against a schema.

    Returns:
        Tuple of (passed, failed) counts
    """
    # Load schema
    try:
        with open(schema_path, 'r') as f:
            schema = json.load(f)
    except FileNotFoundError:
        log(Colors.RED, f"✗ Schema not found: {schema_path}")
        return (0, 1)
    except json.JSONDecodeError as e:
        log(Colors.RED, f"✗ Invalid JSON in schema: {e}")
        return (0, 1)

    # Create validator
    validator = Draft202012Validator(schema)

    # Find credential files
    files = glob.glob(pattern)

    if not files:
        log(Colors.YELLOW, f"  ⚠ No files found matching {pattern}")
        return (0, 0)

    log(Colors.BLUE, f"  Found {len(files)} {credential_type} credential(s)\n")

    passed = 0
    failed = 0

    for file_path in sorted(files):
        file_name = Path(file_path).name
        print(f"    {file_name}... ", end='', flush=True)

        try:
            # Load credential
            with open(file_path, 'r') as f:
                credential = json.load(f)

            # Validate
            errors = list(validator.iter_errors(credential))

            if not errors:
                log(Colors.GREEN, "✓")
                passed += 1
            else:
                log(Colors.RED, "✗")
                print("      Errors:")
                for error in errors[:5]:  # Show first 5 errors
                    path = '/'.join(str(p) for p in error.path) or '(root)'
                    print(f"        - {path}: {error.message}")
                if len(errors) > 5:
                    print(f"        ... and {len(errors) - 5} more")
                failed += 1

        except json.JSONDecodeError as e:
            log(Colors.RED, f"✗ Invalid JSON: {e}")
            failed += 1
        except Exception as e:
            log(Colors.RED, f"✗ Error: {e}")
            failed += 1

    return (passed, failed)

def main():
    """Main validation function."""
    print(f"{Colors.CYAN}╔════════════════════════════════════════════════════════════╗{Colors.RESET}")
    print(f"{Colors.CYAN}║  Beltic Credential Validation - All Credentials           ║{Colors.RESET}")
    print(f"{Colors.CYAN}╚════════════════════════════════════════════════════════════╝{Colors.RESET}\n")

    total_passed = 0
    total_failed = 0

    # Validate Agent Credentials
    log(Colors.CYAN, "═" * 60)
    log(Colors.CYAN, "  Agent Credentials")
    log(Colors.CYAN, "═" * 60)

    agent_passed, agent_failed = validate_credential_set(
        'schemas/agent/v1/agent-credential-v1.schema.json',
        'examples/agent/v1/*.json',
        'agent'
    )

    total_passed += agent_passed
    total_failed += agent_failed

    print(f"  Result: {agent_passed} passed, {agent_failed} failed\n")

    # Validate Developer Credentials (Valid)
    log(Colors.CYAN, "═" * 60)
    log(Colors.CYAN, "  Developer Credentials (Valid Examples)")
    log(Colors.CYAN, "═" * 60)

    dev_passed, dev_failed = validate_credential_set(
        'schemas/developer/v1/developer-credential-v1.schema.json',
        'examples/developer/v1/tests/valid-*.json',
        'developer (valid)'
    )

    total_passed += dev_passed
    total_failed += dev_failed

    print(f"  Result: {dev_passed} passed, {dev_failed} failed\n")

    # Final Summary
    print(f"{Colors.CYAN}╔════════════════════════════════════════════════════════════╗{Colors.RESET}")
    print(f"{Colors.CYAN}║  Validation Summary                                        ║{Colors.RESET}")
    print(f"{Colors.CYAN}╚════════════════════════════════════════════════════════════╝{Colors.RESET}")
    print()
    print(f"  Total Credentials: {total_passed + total_failed}")
    log(Colors.GREEN, f"  Passed:            {total_passed}")

    if total_failed > 0:
        log(Colors.RED, f"  Failed:            {total_failed}")
        print()
        log(Colors.RED, f"✗ {total_failed} credential(s) failed validation")
        sys.exit(1)
    else:
        print()
        log(Colors.GREEN, f"✓ All {total_passed} credentials are valid")
        print()
        sys.exit(0)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nValidation interrupted by user")
        sys.exit(130)
    except Exception as e:
        log(Colors.RED, f"\n✗ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
