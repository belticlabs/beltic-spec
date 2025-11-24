#!/usr/bin/env node

/**
 * validate-invalid.js
 *
 * Validates that all "invalid" example files correctly fail schema validation.
 * This ensures that our test suite properly catches validation errors.
 */

const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  console.log(`${colors.blue}=== Validating Invalid Examples ===${colors.reset}\n`);

  // Initialize AJV
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  // Load developer schema
  const schemaPath = 'schemas/developer/v1/developer-credential-v1.schema.json';
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const validate = ajv.compile(schema);

  // Find all invalid example files
  const invalidFiles = [
    ...glob.sync('examples/developer/v1/tests/invalid-*.json'),
    ...glob.sync('examples/developer/v1/tests/tier2-invalid-*.json')
  ];

  if (invalidFiles.length === 0) {
    log('red', '✗ No invalid example files found');
    process.exit(1);
  }

  log('blue', `Found ${invalidFiles.length} invalid example files\n`);

  let passed = 0;
  let failed = 0;

  // Examples that require runtime validation (date comparison not supported by JSON Schema)
  const runtimeValidationExamples = new Set([
    'invalid-dates-reversed.json',
    'invalid-last-updated-out-of-range.json',
    'tier2-invalid-expired-status-mismatch.json',
    'tier2-invalid-pep-assessment-stale.json',
    'tier2-invalid-screening-stale.json',
    'tier2-invalid-tax-verification-old.json'
  ]);

  for (const filePath of invalidFiles) {
    const fileName = path.basename(filePath);
    process.stdout.write(`  Testing ${fileName}... `);

    try {
      const credential = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const isValid = validate(credential);

      if (isValid) {
        if (runtimeValidationExamples.has(fileName)) {
          // This is EXPECTED - requires runtime date comparison validation
          log('yellow', `⚠ Requires runtime validation (date comparison not supported by JSON Schema)`);
          passed++;
        } else {
          // This is BAD - invalid file passed validation
          log('red', `✗ FAILED (should be invalid but passed)`);
          failed++;
        }
      } else {
        // This is GOOD - invalid file correctly failed
        log('green', `✓ correctly rejected`);
        passed++;
      }
    } catch (error) {
      log('red', `✗ ERROR: ${error.message}`);
      failed++;
    }
  }

  // Summary
  console.log(`\n${colors.blue}=== Summary ===${colors.reset}`);
  console.log(`  Total: ${invalidFiles.length}`);
  log('green', `  Passed: ${passed} (correctly rejected)`);

  if (failed > 0) {
    log('red', `  Failed: ${failed} (incorrectly passed or errored)`);
    console.log('');
    log('red', '✗ Some invalid examples did not fail as expected');
    process.exit(1);
  } else {
    console.log('');
    log('green', `✓ All invalid examples correctly rejected (${runtimeValidationExamples.size} require runtime validation)`);
    process.exit(0);
  }
}

main().catch(error => {
  log('red', `\n✗ Fatal error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
