#!/usr/bin/env node

/**
 * validate-all.js
 *
 * Validates all credentials in the repository (agent + developer).
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

  // Validate Agent Credentials
  log('cyan', '═'.repeat(60));
  log('cyan', '  Agent Credentials');
  log('cyan', '═'.repeat(60));

  const agentResults = await validateCredentialSet(
    'schemas/agent/v1/agent-credential-v1.schema.json',
    'examples/agent/v1/*.json',
    'agent'
  );

  totalPassed += agentResults.passed;
  totalFailed += agentResults.failed;

  console.log(`  Result: ${agentResults.passed} passed, ${agentResults.failed} failed\n`);

  // Validate Developer Credentials (Valid)
  log('cyan', '═'.repeat(60));
  log('cyan', '  Developer Credentials (Valid Examples)');
  log('cyan', '═'.repeat(60));

  const developerValidResults = await validateCredentialSet(
    'schemas/developer/v1/developer-credential-v1.schema.json',
    'examples/developer/v1/tests/valid-*.json',
    'developer (valid)'
  );

  totalPassed += developerValidResults.passed;
  totalFailed += developerValidResults.failed;

  console.log(`  Result: ${developerValidResults.passed} passed, ${developerValidResults.failed} failed\n`);

  // Final Summary
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  Validation Summary                                        ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  console.log(`  Total Credentials: ${totalPassed + totalFailed}`);
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
