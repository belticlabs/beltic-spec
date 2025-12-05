#!/usr/bin/env node

/**
 * validate-all.js
 *
 * Validates all credentials in the repository (agent + developer, v1 + v2).
 * Used for CI/CD and comprehensive validation checks.
 */

const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function validateCredentialSet(schemaPath, pattern, credentialType) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  // Load schema
  if (!fs.existsSync(schemaPath)) {
    log('red', `✗ Schema not found: ${schemaPath}`);
    return { passed: 0, failed: 1 };
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const validate = ajv.compile(schema);

  // Find files
  const files = glob.sync(pattern);

  if (files.length === 0) {
    log('yellow', `  ⚠ No files found matching ${pattern}`);
    return { passed: 0, failed: 0 };
  }

  log('blue', `  Found ${files.length} ${credentialType} credential(s)\n`);

  let passed = 0;
  let failed = 0;

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    process.stdout.write(`    ${fileName}... `);

    try {
      const credential = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const isValid = validate(credential);

      if (isValid) {
        log('green', '✓');
        passed++;
      } else {
        log('red', '✗');
        console.log(`      Errors:`);
        validate.errors.slice(0, 5).forEach(err => {
          console.log(`        - ${err.instancePath || '(root)'}: ${err.message}`);
        });
        if (validate.errors.length > 5) {
          console.log(`        ... and ${validate.errors.length - 5} more`);
        }
        failed++;
      }
    } catch (error) {
      log('red', `✗ ERROR: ${error.message}`);
      failed++;
    }
  }

  return { passed, failed };
}

async function main() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  Beltic Credential Validation - All Credentials           ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  let totalPassed = 0;
  let totalFailed = 0;

  // ==========================================================================
  // v1 Schemas (Legacy)
  // ==========================================================================

  log('magenta', '══════════════════════════════════════════════════════════════');
  log('magenta', '  SCHEMA VERSION 1 (Legacy)');
  log('magenta', '══════════════════════════════════════════════════════════════\n');

  // Validate Agent Credentials v1
  log('cyan', '═'.repeat(60));
  log('cyan', '  Agent Credentials v1');
  log('cyan', '═'.repeat(60));

  const agentResultsV1 = await validateCredentialSet(
    'schemas/agent/v1/agent-credential-v1.schema.json',
    'examples/agent/v1/valid-*.json',
    'agent v1'
  );

  totalPassed += agentResultsV1.passed;
  totalFailed += agentResultsV1.failed;

  console.log(`  Result: ${agentResultsV1.passed} passed, ${agentResultsV1.failed} failed\n`);

  // Validate Developer Credentials v1 (Valid)
  log('cyan', '═'.repeat(60));
  log('cyan', '  Developer Credentials v1 (Valid Examples)');
  log('cyan', '═'.repeat(60));

  const developerValidResultsV1 = await validateCredentialSet(
    'schemas/developer/v1/developer-credential-v1.schema.json',
    'examples/developer/v1/tests/valid-*.json',
    'developer v1 (valid)'
  );

  totalPassed += developerValidResultsV1.passed;
  totalFailed += developerValidResultsV1.failed;

  console.log(`  Result: ${developerValidResultsV1.passed} passed, ${developerValidResultsV1.failed} failed\n`);

  // ==========================================================================
  // v2 Schemas (W3C VC 2.0 aligned)
  // ==========================================================================

  log('magenta', '══════════════════════════════════════════════════════════════');
  log('magenta', '  SCHEMA VERSION 2 (W3C VC 2.0 aligned)');
  log('magenta', '══════════════════════════════════════════════════════════════\n');

  // Validate Agent Credentials v2
  log('cyan', '═'.repeat(60));
  log('cyan', '  Agent Credentials v2');
  log('cyan', '═'.repeat(60));

  const agentResultsV2 = await validateCredentialSet(
    'schemas/agent/v2/agent-credential-v2.schema.json',
    'examples/agent/v2/valid-*.json',
    'agent v2'
  );

  totalPassed += agentResultsV2.passed;
  totalFailed += agentResultsV2.failed;

  console.log(`  Result: ${agentResultsV2.passed} passed, ${agentResultsV2.failed} failed\n`);

  // Validate Developer Credentials v2 (Valid)
  log('cyan', '═'.repeat(60));
  log('cyan', '  Developer Credentials v2 (Valid Examples)');
  log('cyan', '═'.repeat(60));

  const developerValidResultsV2 = await validateCredentialSet(
    'schemas/developer/v2/developer-credential-v2.schema.json',
    'examples/developer/v2/tests/valid-*.json',
    'developer v2 (valid)'
  );

  totalPassed += developerValidResultsV2.passed;
  totalFailed += developerValidResultsV2.failed;

  console.log(`  Result: ${developerValidResultsV2.passed} passed, ${developerValidResultsV2.failed} failed\n`);

  // ==========================================================================
  // Final Summary
  // ==========================================================================

  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  Validation Summary                                        ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  console.log(`  Total Credentials: ${totalPassed + totalFailed}`);
  console.log(`    v1: ${agentResultsV1.passed + developerValidResultsV1.passed} passed, ${agentResultsV1.failed + developerValidResultsV1.failed} failed`);
  console.log(`    v2: ${agentResultsV2.passed + developerValidResultsV2.passed} passed, ${agentResultsV2.failed + developerValidResultsV2.failed} failed`);
  log('green', `  Passed:            ${totalPassed}`);

  if (totalFailed > 0) {
    log('red', `  Failed:            ${totalFailed}`);
    console.log('');
    log('red', `✗ ${totalFailed} credential(s) failed validation`);
    process.exit(1);
  } else {
    console.log('');
    log('green', `✓ All ${totalPassed} credentials are valid`);
    console.log('');
    process.exit(0);
  }
}

main().catch(error => {
  log('red', `\n✗ Fatal error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
