#!/bin/bash
# Script to update test coverage artifact after running tests

set -e

COVERAGE_FILE="web-app/coverage/coverage-summary.json"
ARTIFACT_FILE=".ai/artifacts/test-coverage.md"

if [ ! -f "$COVERAGE_FILE" ]; then
    echo "❌ Coverage file not found: $COVERAGE_FILE"
    echo "Run: npm test -- --coverage --coverageReporters=json-summary"
    exit 1
fi

# Extract coverage data
COVERAGE_DATA=$(node -e "
const fs = require('fs');
const coverage = JSON.parse(fs.readFileSync('$COVERAGE_FILE', 'utf8'));
const total = coverage.total;

const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
const overallPct = Math.round(
  (total.statements.pct + total.branches.pct + total.functions.pct + total.lines.pct) / 4
);

console.log(\`# Test Coverage Report

**Last Updated:** \${timestamp}
**Overall Coverage:** \${overallPct}%
**Status:** \${overallPct >= 80 ? '✅ Passing' : '❌ Below Threshold'}

---

## Coverage Summary

| Metric | Coverage | Status |
|--------|----------|--------|
| Statements | \${total.statements.pct.toFixed(2)}% | \${total.statements.pct >= 80 ? '✅' : '❌'} |
| Branches | \${total.branches.pct.toFixed(2)}% | \${total.branches.pct >= 80 ? '✅' : '❌'} |
| Functions | \${total.functions.pct.toFixed(2)}% | \${total.functions.pct >= 80 ? '✅' : '❌'} |
| Lines | \${total.lines.pct.toFixed(2)}% | \${total.lines.pct >= 80 ? '✅' : '❌'} |

**Covered:** \${total.statements.covered} / \${total.statements.total} statements

---

## Coverage by Module
(View detailed report: \`open web-app/coverage/lcov-report/index.html\`)

---

## Recent Changes
- \${timestamp}: Coverage updated to \${overallPct}%

---

## Actions Required
\${overallPct >= 80 ? 'None - coverage meets threshold! 🎉' : '⚠️ Coverage below 80% - add more tests'}
\`);
")

echo "$COVERAGE_DATA" > "$ARTIFACT_FILE"

echo "✅ Coverage artifact updated: $ARTIFACT_FILE"
echo ""
cat "$ARTIFACT_FILE"
