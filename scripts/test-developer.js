#!/usr/bin/env node

/**
 * test-developer.js
 *
 * Comprehensive test suite for DeveloperCredential validation.
 * Tests both valid and invalid examples.
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

async function main() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  DeveloperCredential v1 - Comprehensive Test Suite        ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Initialize AJV
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  // Load schema
  const schemaPath = 'schemas/developer/v1/developer-credential-v1.schema.json';
  if (!fs.existsSync(schemaPath)) {
    log('red', `✗ Schema not found: ${schemaPath}`);
    process.exit(1);
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const validate = ajv.compile(schema);

  log('green', `✓ Schema compiled successfully`);
  log('blue', `  Schema: ${schema.$id || 'developer-credential-v1'}\n`);

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  // Test Suite 1: Valid Examples
  log('cyan', '═'.repeat(60));
  log('cyan', '  Test Suite 1: Valid Examples');
  log('cyan', '═'.repeat(60));

  const validFiles = glob.sync('examples/developer/v1/tests/valid-*.json');
  log('blue', `Found ${validFiles.length} valid example(s)\n`);

  for (const filePath of validFiles) {
    totalTests++;
    const fileName = path.basename(filePath);
    process.stdout.write(`  ${fileName}... `);

    try {
      const credential = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const isValid = validate(credential);

      if (isValid) {
        log('green', '✓ PASSED');
        totalPassed++;
      } else {
        log('red', '✗ FAILED (should be valid)');
        console.log('    Errors:');
        validate.errors.forEach(err => {
          console.log(`      - ${err.instancePath || '(root)'}: ${err.message}`);
        });
        totalFailed++;
      }
    } catch (error) {
      log('red', `✗ ERROR: ${error.message}`);
      totalFailed++;
    }
  }

  // Test Suite 2: Tier 1 Invalid Examples
  console.log('');
  log('cyan', '═'.repeat(60));
  log('cyan', '  Test Suite 2: Tier 1 Invalid Examples (Critical Rules)');
  log('cyan', '═'.repeat(60));

  const tier1InvalidFiles = glob.sync('examples/developer/v1/tests/invalid-*.json');
  log('blue', `Found ${tier1InvalidFiles.length} Tier 1 invalid example(s)\n`);

  for (const filePath of tier1InvalidFiles) {
    totalTests++;
    const fileName = path.basename(filePath);
    process.stdout.write(`  ${fileName}... `);

    try {
      const credential = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const isValid = validate(credential);

      if (!isValid) {
        log('green', '✓ PASSED (correctly rejected)');
        totalPassed++;
      } else {
        log('red', '✗ FAILED (should be invalid)');
        totalFailed++;
      }
    } catch (error) {
      log('red', `✗ ERROR: ${error.message}`);
      totalFailed++;
    }
  }

  // Test Suite 3: Tier 2 Invalid Examples
  console.log('');
  log('cyan', '═'.repeat(60));
  log('cyan', '  Test Suite 3: Tier 2 Invalid Examples (Data Consistency)');
  log('cyan', '═'.repeat(60));

  const tier2InvalidFiles = glob.sync('examples/developer/v1/tests/tier2-invalid-*.json');
  log('blue', `Found ${tier2InvalidFiles.length} Tier 2 invalid example(s)\n`);

  for (const filePath of tier2InvalidFiles) {
    totalTests++;
    const fileName = path.basename(filePath);
    process.stdout.write(`  ${fileName}... `);

    try {
      const credential = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const isValid = validate(credential);

      if (!isValid) {
        log('green', '✓ PASSED (correctly rejected)');
        totalPassed++;
      } else {
        log('red', '✗ FAILED (should be invalid)');
        totalFailed++;
      }
    } catch (error) {
      log('red', `✗ ERROR: ${error.message}`);
      totalFailed++;
    }
  }

  // Final Summary
  console.log('');
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  Test Results                                              ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  console.log(`  Total Tests:    ${totalTests}`);
  log('green', `  Passed:         ${totalPassed}`);

  if (totalFailed > 0) {
    log('red', `  Failed:         ${totalFailed}`);
    console.log('');
    log('red', `✗ ${totalFailed} test(s) failed`);
    process.exit(1);
  } else {
    console.log('');
    log('green', `✓ All ${totalTests} tests passed`);
    console.log('');
    log('cyan', '══════════════════════════════════════════════════════════════');
    console.log('');
    process.exit(0);
  }
}

main().catch(error => {
  log('red', `\n✗ Fatal error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
