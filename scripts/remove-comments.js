#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const pattern = 'examples/developer/v1/tests/*.json';
const files = glob.sync(pattern);

console.log(`Found ${files.length} files to process\n`);

let processedCount = 0;
let errorCount = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if ('$comment' in data) {
      delete data.$comment;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`✓ Removed $comment from ${path.basename(filePath)}`);
      processedCount++;
    } else {
      console.log(`- No $comment in ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
    errorCount++;
  }
});

console.log(`\nSummary: ${processedCount} files processed, ${errorCount} errors`);
process.exit(errorCount > 0 ? 1 : 0);
