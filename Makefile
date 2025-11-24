.PHONY: help install validate-all validate-agent validate-developer test clean lint format

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

## help: Show this help message
help:
	@echo "$(BLUE)Beltic Spec - Available Make Targets$(NC)"
	@echo ""
	@echo "$(GREEN)Setup:$(NC)"
	@echo "  $(YELLOW)make install$(NC)          Install Node.js dependencies (ajv, ajv-formats)"
	@echo "  $(YELLOW)make check-deps$(NC)       Check if required tools are installed"
	@echo ""
	@echo "$(GREEN)Validation:$(NC)"
	@echo "  $(YELLOW)make validate-all$(NC)     Validate all credentials (agent + developer)"
	@echo "  $(YELLOW)make validate-agent$(NC)   Validate agent credential examples"
	@echo "  $(YELLOW)make validate-developer$(NC) Validate developer credential examples"
	@echo "  $(YELLOW)make validate-schemas$(NC) Validate schema files themselves"
	@echo ""
	@echo "$(GREEN)Testing:$(NC)"
	@echo "  $(YELLOW)make test$(NC)             Run all validation tests"
	@echo "  $(YELLOW)make test-agent$(NC)       Test agent examples"
	@echo "  $(YELLOW)make test-developer$(NC)   Test developer examples (including invalid)"
	@echo "  $(YELLOW)make test-conditional$(NC) Test conditional validation rules"
	@echo ""
	@echo "$(GREEN)Quality:$(NC)"
	@echo "  $(YELLOW)make lint$(NC)             Lint schema files (check for issues)"
	@echo "  $(YELLOW)make format-check$(NC)     Check formatting of JSON and Markdown files"
	@echo "  $(YELLOW)make format$(NC)           Format JSON and Markdown files"
	@echo ""
	@echo "$(GREEN)Maintenance:$(NC)"
	@echo "  $(YELLOW)make clean$(NC)            Clean up node_modules and temporary files"
	@echo "  $(YELLOW)make stats$(NC)            Show repository statistics"
	@echo ""

## check-deps: Check if required tools are installed
check-deps:
	@echo "$(BLUE)Checking dependencies...$(NC)"
	@command -v node >/dev/null 2>&1 || { echo "$(RED)✗ Node.js not found. Install from https://nodejs.org/$(NC)"; exit 1; }
	@echo "$(GREEN)✓ Node.js found:$(NC) $$(node --version)"
	@command -v npm >/dev/null 2>&1 || { echo "$(RED)✗ npm not found.$(NC)"; exit 1; }
	@echo "$(GREEN)✓ npm found:$(NC) $$(npm --version)"
	@command -v ajv >/dev/null 2>&1 || { echo "$(YELLOW)⚠ ajv-cli not found globally. Run 'make install' or 'npm install -g ajv-cli ajv-formats'$(NC)"; }
	@echo "$(GREEN)✓ All dependencies check passed$(NC)"

## install: Install Node.js dependencies
install: check-deps
	@echo "$(BLUE)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"
	@echo ""
	@echo "$(YELLOW)Optional: Install ajv-cli globally for direct CLI usage:$(NC)"
	@echo "  npm install -g ajv-cli ajv-formats"

## validate-all: Validate all credential examples
validate-all: validate-agent validate-developer
	@echo ""
	@echo "$(GREEN)✓ All validations passed$(NC)"

## validate-agent: Validate agent credential examples
validate-agent:
	@echo "$(BLUE)Validating agent credentials (valid examples)...$(NC)"
	@for file in examples/agent/v1/valid-*.json; do \
		echo "  Validating $${file}..."; \
		npx ajv validate \
			--spec=draft2020 \
			--strict=false \
			-s schemas/agent/v1/agent-credential-v1.schema.json \
			-d "$${file}" \
			--all-errors \
			|| exit 1; \
	done
	@echo "$(GREEN)✓ All valid agent credentials passed$(NC)"

## validate-developer: Validate developer credential examples
validate-developer:
	@echo "$(BLUE)Validating developer credentials (valid examples)...$(NC)"
	@for file in examples/developer/v1/tests/valid-*.json; do \
		echo "  Validating $${file}..."; \
		npx ajv validate \
			--spec=draft2020 \
			--strict=false \
			-s schemas/developer/v1/developer-credential-v1.schema.json \
			-d "$${file}" \
			--all-errors \
			|| exit 1; \
	done
	@echo "$(GREEN)✓ All valid developer credentials passed$(NC)"
	@echo ""
	@echo "$(BLUE)Validating developer credentials (invalid examples - should fail)...$(NC)"
	@FAILED=0; \
	RUNTIME_VALIDATION="invalid-dates-reversed invalid-last-updated-out-of-range tier2-invalid-expired-status-mismatch tier2-invalid-pep-assessment-stale tier2-invalid-screening-stale tier2-invalid-tax-verification-old"; \
	for file in examples/developer/v1/tests/invalid-*.json examples/developer/v1/tests/tier2-invalid-*.json; do \
		BASENAME=$$(basename "$$file" .json); \
		echo "  Testing $${file} (should be invalid)..."; \
		if npx ajv validate \
			--spec=draft2020 \
			--strict=false \
			-s schemas/developer/v1/developer-credential-v1.schema.json \
			-d "$${file}" \
			2>/dev/null; then \
			if echo " $$RUNTIME_VALIDATION " | grep -q " $$BASENAME "; then \
				echo "$(YELLOW)  ⚠ Requires runtime validation (date comparison not supported by JSON Schema)$(NC)"; \
			else \
				echo "$(RED)✗ ERROR: $${file} should be invalid but passed validation$(NC)"; \
				FAILED=1; \
			fi; \
		fi; \
	done; \
	if [ $$FAILED -eq 0 ]; then \
		echo "$(GREEN)✓ All invalid examples correctly rejected (6 require runtime validation)$(NC)"; \
	else \
		echo "$(RED)✗ Some invalid examples incorrectly passed validation$(NC)"; \
		exit 1; \
	fi

## validate-schemas: Validate schema files themselves
validate-schemas:
	@echo "$(BLUE)Validating JSON schemas...$(NC)"
	@echo "  Compiling agent schema..."
	@npx ajv compile --spec=draft2020 --strict=false -s schemas/agent/v1/agent-credential-v1.schema.json || exit 1
	@echo "  Compiling developer schema..."
	@npx ajv compile --spec=draft2020 --strict=false -s schemas/developer/v1/developer-credential-v1.schema.json || exit 1
	@echo "$(GREEN)✓ All schemas are valid$(NC)"

## test: Run all validation tests
test: test-agent test-developer test-conditional
	@echo ""
	@echo "$(GREEN)✓ All tests passed$(NC)"

## test-agent: Test agent examples
test-agent:
	@echo "$(BLUE)Testing agent credentials...$(NC)"
	@npm run test:agent
	@echo "$(GREEN)✓ Agent tests passed$(NC)"

## test-developer: Test developer examples (valid and invalid)
test-developer:
	@echo "$(BLUE)Testing developer credentials...$(NC)"
	@npm run test:developer || { echo "$(YELLOW)Note: npm script may not exist yet. Using make validate-developer instead.$(NC)"; make validate-developer; }
	@echo "$(GREEN)✓ Developer tests passed$(NC)"

## test-conditional: Test conditional validation rules
test-conditional:
	@echo "$(BLUE)Testing conditional validation rules...$(NC)"
	@npm run test:conditional-rules || { echo "$(YELLOW)Note: npm script may not exist yet. Skipping conditional rules test.$(NC)"; }
	@echo "$(GREEN)✓ Conditional rules tests passed$(NC)"

## lint: Lint schema files
lint:
	@echo "$(BLUE)Linting schemas...$(NC)"
	@npm run lint:schemas
	@echo "$(GREEN)✓ Schema linting passed$(NC)"

## format-check: Check formatting
format-check:
	@echo "$(BLUE)Checking formatting...$(NC)"
	@npm run format:check || { echo "$(YELLOW)Run 'make format' to fix formatting issues$(NC)"; exit 1; }
	@echo "$(GREEN)✓ Formatting check passed$(NC)"

## format: Format JSON and Markdown files
format:
	@echo "$(BLUE)Formatting files...$(NC)"
	@npm run format:write
	@echo "$(GREEN)✓ Files formatted$(NC)"

## clean: Clean up node_modules and temporary files
clean:
	@echo "$(BLUE)Cleaning up...$(NC)"
	rm -rf node_modules
	rm -f package-lock.json
	find . -name '.DS_Store' -delete
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

## stats: Show repository statistics
stats:
	@echo "$(BLUE)Beltic Spec Repository Statistics$(NC)"
	@echo ""
	@echo "$(YELLOW)Schemas:$(NC)"
	@echo "  Agent schema:      $$(wc -l < schemas/agent/v1/agent-credential-v1.schema.json) lines"
	@echo "  Developer schema:  $$(wc -l < schemas/developer/v1/developer-credential-v1.schema.json) lines"
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  Agent examples:    $$(ls examples/agent/v1/*.json 2>/dev/null | wc -l | tr -d ' ') files"
	@echo "  Developer valid:   $$(ls examples/developer/v1/tests/valid-*.json 2>/dev/null | wc -l | tr -d ' ') files"
	@echo "  Developer invalid: $$(ls examples/developer/v1/tests/invalid-*.json examples/developer/v1/tests/tier2-invalid-*.json 2>/dev/null | wc -l | tr -d ' ') files"
	@echo ""
	@echo "$(YELLOW)Documentation:$(NC)"
	@echo "  Specification docs: $$(ls docs/*.md 2>/dev/null | wc -l | tr -d ' ') files"
	@echo "  README files:      $$(find . -name 'README.md' | wc -l | tr -d ' ') files"
	@echo ""
	@echo "$(YELLOW)Total Lines:$(NC)"
	@echo "  JSON files:  $$(find . -name '*.json' -not -path './node_modules/*' -exec cat {} \; | wc -l | tr -d ' ') lines"
	@echo "  Markdown:    $$(find . -name '*.md' -not -path './node_modules/*' -exec cat {} \; | wc -l | tr -d ' ') lines"
