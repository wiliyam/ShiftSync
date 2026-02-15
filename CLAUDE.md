# Claude Code Instructions for ShiftSync

**Project:** ShiftSync - Roster Management Application
**Enforcement Level:** STRICT
**TDD Required:** YES (Mandatory)

---

## 🚨 CRITICAL: Test-Driven Development is MANDATORY

This project uses **strict TDD**. You MUST follow the Red-Green-Refactor cycle for ALL code changes.

### The TDD Cycle (REQUIRED)

```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

**Before writing ANY production code:**
1. Write a failing test first
2. Run test and verify it fails
3. Commit test: `test(scope): add failing test for X`

**After test is failing:**
1. Write minimum code to make test pass
2. Run test and verify it passes
3. Commit implementation: `feat(scope): implement X`

**After test is passing:**
1. Refactor to improve code quality (if needed)
2. Verify all tests still pass
3. Commit refactor: `refactor(scope): improve X`

---

## 📖 Required Reading (Before ANY Work)

**Read these files in order:**

1. **`.ai/QUICKSTART.md`** - 5-minute onboarding (READ FIRST!)
2. **`.ai/AGENT_GUIDELINES.md`** - Comprehensive rules for agents
3. **`.ai/artifacts/wip/current-sprint.md`** - Current work status
4. **`.ai/TDD_WORKFLOW.md`** - Detailed TDD process
5. **`/README.md`** - Project overview
6. **`/docs/architecture_design.md`** - Technical architecture
7. **`/docs/product_requirements.md`** - Business requirements

---

## ✅ Before Starting Any Task

Run these commands:

```bash
# 1. Check current work
cat .ai/artifacts/wip/current-sprint.md

# 2. Check file locks
cat .ai/artifacts/wip/locks.json

# 3. Check recent activity
tail -20 .ai/artifacts/logs/development.jsonl

# 4. Verify tests pass
cd web-app && npm test

# 5. Create work session log
cp .ai/templates/work-session.md .ai/artifacts/wip/session-$(date +%Y%m%d-%H%M%S).md
```

---

## 🔒 File Locking Protocol

**Before modifying any file:**
1. Check `.ai/artifacts/wip/locks.json`
2. If locked by another agent (< 2 hours ago), work on different file
3. Acquire lock by adding entry to locks.json
4. Release lock when done

---

## 📝 Commit Message Format (ENFORCED)

**Required format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**TDD Types:**
- `test`: 🔴 RED - Writing failing test
- `feat`: 🟢 GREEN - Implementing feature
- `refactor`: 🔵 REFACTOR - Improving code

**Other types:**
- `fix`: Bug fixes
- `docs`: Documentation
- `chore`: Build/config changes

**Examples:**
```bash
git commit -m "test(employee): add failing test for skill validation"
git commit -m "feat(employee): implement skill validation logic"
git commit -m "refactor(employee): extract validation to utility"
```

---

## 🧪 Testing Requirements

### Coverage Minimum
- **Statements:** 80%
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%

### Test Types Required
- **Unit tests:** All business logic, utilities
- **Integration tests:** Database operations
- **E2E tests:** Critical user flows

### Test Commands
```bash
npm test                    # Run all tests
npm test:watch             # Watch mode
npm test -- --coverage     # With coverage
npm run test:e2e          # E2E tests
```

---

## 📊 Logging Requirements

### Update Development Log
After each significant action:

```bash
echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","agent":"claude-sonnet-4.5","action":"ACTION","details":"DETAILS","status":"STATUS"}' >> .ai/artifacts/logs/development.jsonl
```

**Actions:**
- `test_created` - Created failing test
- `test_passed` - Test now passing
- `refactored` - Code refactored
- `decision_made` - Architectural decision
- `blocked` - Encountered blocker

---

## 🚫 Prohibited Actions

**NEVER:**
- ❌ Write production code before writing a test
- ❌ Commit without running tests
- ❌ Skip tests to "save time"
- ❌ Use `git commit --no-verify` (except emergencies)
- ❌ Modify files locked by another agent
- ❌ Ignore coverage drops below 80%
- ❌ Commit failing tests (except RED phase)

---

## ✨ Allowed Actions (Pre-Approved)

**You are authorized to:**
- ✅ Read any file in the project
- ✅ Write tests (RED phase)
- ✅ Implement features (GREEN phase)
- ✅ Refactor code (REFACTOR phase)
- ✅ Run tests (`npm test`)
- ✅ Create branches (`feature/*`, `fix/*`)
- ✅ Commit with proper messages
- ✅ Update artifacts in `.ai/artifacts/`
- ✅ Create ADRs in `.ai/artifacts/decisions/`

**Ask permission for:**
- ⚠️ Modifying database schema
- ⚠️ Adding new dependencies
- ⚠️ Changing build configuration
- ⚠️ Modifying CI/CD pipelines
- ⚠️ Deleting files
- ⚠️ Force pushing to remote

---

## 🎯 Quality Standards

### Code Standards
- **TypeScript:** Strict mode, no `any`, no `@ts-ignore`
- **Testing:** Jest + React Testing Library + Playwright
- **Validation:** Zod schemas for all runtime validation
- **Error Handling:** Result<T, E> pattern
- **File Naming:**
  - Components: `PascalCase.tsx`
  - Utilities: `kebab-case.ts`
  - Tests: `*.test.ts`

### Test Standards
- Use AAA pattern (Arrange-Act-Assert)
- Descriptive test names
- Test edge cases and error paths
- Mock external dependencies
- Fast unit tests (milliseconds)

---

## 📁 Project Context

### Tech Stack
- **Framework:** Next.js 16
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth v5
- **Styling:** Tailwind CSS v4
- **Testing:** Jest + Playwright

### Key Directories
- `/web-app/app/lib/` - Business logic (unit test here)
- `/web-app/app/ui/` - React components (component test here)
- `/web-app/app/api/` - API routes
- `/web-app/tests/e2e/` - End-to-end tests
- `/web-app/prisma/` - Database schema

---

## 🔄 Workflow Summary

### For Each Feature

1. **RED Phase:**
   ```bash
   # Create test file
   vim web-app/app/lib/__tests__/my-feature.test.ts
   # Write failing test
   npm test -- my-feature.test.ts  # Should FAIL
   git commit -m "test(scope): add failing test for X"
   ```

2. **GREEN Phase:**
   ```bash
   # Create implementation
   vim web-app/app/lib/my-feature.ts
   # Write minimum code
   npm test -- my-feature.test.ts  # Should PASS
   git commit -m "feat(scope): implement X"
   ```

3. **REFACTOR Phase (if needed):**
   ```bash
   # Improve code
   vim web-app/app/lib/my-feature.ts
   npm test  # All should PASS
   git commit -m "refactor(scope): improve X"
   ```

4. **Update Artifacts:**
   ```bash
   # Update current sprint
   vim .ai/artifacts/wip/current-sprint.md
   # Log to development log
   echo '{"timestamp":"...", ...}' >> .ai/artifacts/logs/development.jsonl
   ```

---

## 🆘 When You Need Help

1. **Can't find information?**
   - Check `.ai/AGENT_GUIDELINES.md`
   - Review existing ADRs in `.ai/artifacts/decisions/`
   - Read similar implementations in codebase

2. **Encountered a blocker?**
   - Document in work session log
   - Log in development.jsonl with `action: "blocked"`
   - Work on different task or ask user

3. **Uncertain about approach?**
   - Write a test to clarify requirements
   - Create ADR to document decision
   - Proceed with best judgment and document reasoning

---

## 📈 Success Metrics

You're doing it right if:
- ✅ Every commit follows RED → GREEN → REFACTOR
- ✅ All commits have tests
- ✅ Coverage stays ≥ 80%
- ✅ Commit messages follow format
- ✅ Artifacts are updated
- ✅ Work is documented for next agent

---

## 🎓 TDD Mindset

**Remember:**
- Tests are specifications, not afterthoughts
- Write tests first = better design
- Red → Green → Refactor is non-negotiable
- Coverage is a minimum, not a target
- When in doubt, write a test

**Golden Rule:**
> Never write production code without a failing test first.

---

## 🔧 Git Hooks

Git hooks are installed automatically and will:
- Run tests before commit (pre-commit)
- Validate commit message (commit-msg)
- Log commits (post-commit)

**To install hooks:**
```bash
./.ai/setup-hooks.sh
```

---

## 📞 Quick Reference

**Most Important Files:**
- `.ai/QUICKSTART.md` - Fast onboarding
- `.ai/AGENT_GUIDELINES.md` - Detailed rules
- `.ai/TDD_WORKFLOW.md` - TDD process
- `.ai/artifacts/wip/current-sprint.md` - Current work

**Most Used Commands:**
```bash
npm test                              # Run tests
npm test -- --coverage                # Check coverage
git commit -m "type(scope): subject"  # Commit with format
cat .ai/artifacts/wip/current-sprint.md  # Check current work
```

---

## ⚡ Final Reminders

1. **TDD is MANDATORY** - No exceptions
2. **Read context first** - Check artifacts before starting
3. **Log your work** - Update development.jsonl
4. **Test coverage ≥ 80%** - Enforced by git hooks
5. **Conventional commits** - Required format
6. **Document decisions** - Create ADRs
7. **Coordinate with locks** - Check before modifying files
8. **Leave breadcrumbs** - Next agent should understand your work

---

**You are now ready to contribute to ShiftSync! 🚀**

**Start with:** `cat .ai/QUICKSTART.md`
