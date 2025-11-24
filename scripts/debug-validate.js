const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");

const ajv = new Ajv({ allErrors: true, strict: false, verbose: true });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('schemas/agent/v1/agent-credential-v1.schema.json'));
const validate = ajv.compile(schema);

const credential = JSON.parse(fs.readFileSync('examples/agent/v1/valid-simple-agent.json'));
const isValid = validate(credential);

console.log("Is valid:", isValid);

if (!isValid) {
  console.log("\nValidation errors:");
  validate.errors.forEach((err, i) => {
    console.log(`\n${i+1}. ${err.instancePath || '(root)'}`);
    console.log(`   Message: ${err.message}`);
    console.log(`   Keyword: ${err.keyword}`);
    if (err.params) {
      console.log(`   Params: ${JSON.stringify(err.params, null, 2)}`);
    }
  });
} else {
  console.log("No errors - credential is valid!");
}
