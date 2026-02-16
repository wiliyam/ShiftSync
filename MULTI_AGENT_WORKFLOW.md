# Multi-Agent Workflow Guide

**Version:** 1.0.0
**Last Updated:** 2026-02-15
**Purpose:** Coordinate multiple AI agents working in parallel on the ShiftSync project

---

## 🤖 Overview

This project supports **parallel multi-agent development** where multiple AI agents can work simultaneously on different tasks while maintaining code quality and avoiding conflicts.

---

## 🎯 Agent Roles

### 1. **Development Agent** (Primary)
**Responsibilities:**
- Implement features following TDD workflow
- Write tests first (RED phase)
- Implement features (GREEN phase)
- Refactor code (REFACTOR phase)
- Run app in sandbox and verify behavior
- Document features and APIs

**Spawning Command:**
```bash
# This agent focuses on implementing specific features
# Example: Employee validation, shift scheduling, etc.
```

### 2. **Sprint Planning Agent** (Coordinator)
**Responsibilities:**
- Create sprint plans in `.ai/artifacts/wip/current-sprint.md`
- Break down features into tasks
- Prioritize work based on dependencies
- Update sprint status as work progresses
- Create Architecture Decision Records (ADRs)
- Coordinate multi-agent work assignments

**Spawning Command:**
```bash
# This agent plans work and creates structured tasks
```

### 3. **Documentation Agent** (Specialized)
**Responsibilities:**
- Create feature documentation from templates
- Create API documentation for endpoints
- Update CHANGELOG.md
- Generate test documentation
- Review and update README and guides
- Ensure all docs are current

**Spawning Command:**
```bash
# This agent focuses purely on documentation
```

### 4. **Testing Agent** (Quality Assurance)
**Responsibilities:**
- Review test coverage
- Add missing tests for uncovered code
- Run E2E test suite
- Update test documentation
- Verify 80%+ coverage maintained
- Report coverage gaps

**Spawning Command:**
```bash
# This agent ensures quality and coverage
```

---

## 🔄 Multi-Agent Coordination Workflow

### Phase 1: Sprint Planning (Sprint Planning Agent)

**Agent 1 Task:** Create sprint and task breakdown

```bash
# Sprint Planning Agent actions:
1. Read current codebase state
2. Review product requirements
3. Create sprint plan in current-sprint.md
4. Break down features into testable tasks
5. Assign priority to each task
6. Document dependencies between tasks
7. Create initial ADRs for architectural decisions
```

**Deliverables:**
- Updated `current-sprint.md` with all tasks
- ADRs for major architectural decisions
- Task dependencies documented
- Priority ordering established

---

### Phase 2: Parallel Development (Multiple Development Agents)

**Agent 2 Task:** Implement Feature A (e.g., Employee Validation)

**Agent 3 Task:** Implement Feature B (e.g., Shift Conflict Detection)

**Coordination Protocol:**

1. **Before Starting:**
   ```bash
   # Each agent checks:
   - Read .ai/QUICKSTART.md
   - Check .ai/artifacts/wip/current-sprint.md for available tasks
   - Check .ai/artifacts/wip/locks.json for locked files
   - Create session log: session-YYYYMMDD-HHMMSS.md
   ```

2. **Acquire File Locks:**
   ```json
   // Agent 2 locks employee-validation.ts
   {
     "web-app/app/lib/employee-validation.ts": {
       "agent": "development-agent-2",
       "session": "session-20260215-143000",
       "locked_at": "2026-02-15T14:30:00Z",
       "reason": "Implementing employee skill validation"
     }
   }

   // Agent 3 locks shift-conflict.ts (different file, no conflict!)
   {
     "web-app/app/lib/shift-conflict.ts": {
       "agent": "development-agent-3",
       "session": "session-20260215-143000",
       "locked_at": "2026-02-15T14:30:00Z",
       "reason": "Implementing shift overlap detection"
     }
   }
   ```

3. **Follow TDD Workflow:**
   ```bash
   # Each agent independently:
   RED:    Write failing test
   GREEN:  Implement feature
   REFACTOR: Improve code
   DOCUMENT: Create docs
   COMMIT:  With conventional format
   LOG:    Update development.jsonl
   ```

4. **Release Locks:**
   ```bash
   # When done, remove lock entry from locks.json
   ```

---

### Phase 3: Documentation (Documentation Agent)

**Agent 4 Task:** Document all completed features

```bash
# Documentation Agent actions:
1. Read all commits since last sprint
2. For each new feature:
   - Create feature-doc.md from template
   - Create api-endpoint-doc.md if API added
   - Update CHANGELOG.md with entries
   - Add JSDoc examples
3. Generate test documentation
4. Update README if needed
5. Commit all documentation
```

---

### Phase 4: Quality Assurance (Testing Agent)

**Agent 5 Task:** Verify quality and coverage

```bash
# Testing Agent actions:
1. Run full test suite: npm test
2. Check coverage: npm test -- --coverage
3. Identify gaps below 80%
4. Write missing tests for uncovered code
5. Run E2E tests: npm run test:e2e
6. Update test-coverage.md
7. Report findings in development.jsonl
```

---

## 📋 Coordination Rules

### Rule 1: File Locking (MANDATORY)
- **Check locks.json before modifying any file**
- Locks expire after 2 hours (considered stale)
- Never modify a file locked by another agent
- Work on different files to avoid conflicts

### Rule 2: Communication via Artifacts
- **Read** `current-sprint.md` to see what needs doing
- **Update** `current-sprint.md` when completing tasks
- **Log** all actions to `development.jsonl`
- **Create** session logs for your work

### Rule 3: Git Coordination
- **Pull** latest changes before starting work
- **Commit** frequently with conventional format
- **Push** after completing each TDD cycle
- **Never** force push

### Rule 4: Test Independence
- **Ensure** your tests don't depend on other tests
- **Clean up** test data after each test
- **Mock** external dependencies
- **Verify** all tests pass before committing

---

## 🚀 Quick Start for Each Agent Type

### Development Agent
```bash
# 1. Read onboarding
cat .ai/QUICKSTART.md

# 2. Check available tasks
cat .ai/artifacts/wip/current-sprint.md

# 3. Pick a task that's not locked
cat .ai/artifacts/wip/locks.json

# 4. Create session log
cp .ai/templates/work-session.md .ai/artifacts/wip/session-$(date +%Y%m%d-%H%M%S).md

# 5. Acquire lock for your files
# (Add to locks.json)

# 6. Follow TDD workflow
# RED → GREEN → REFACTOR → DOCUMENT

# 7. Release lock when done
# (Remove from locks.json)
```

### Sprint Planning Agent
```bash
# 1. Read project requirements
cat docs/product_requirements.md
cat docs/architecture_design.md

# 2. Review current state
cat .ai/artifacts/wip/current-sprint.md
tail -50 .ai/artifacts/logs/development.jsonl

# 3. Create next sprint plan
vim .ai/artifacts/wip/current-sprint.md

# 4. Break down features into tasks
# - List all tasks
# - Mark dependencies
# - Set priorities
# - Estimate complexity

# 5. Create ADRs for decisions
cp .ai/templates/adr-template.md .ai/artifacts/decisions/adr-XXXX-title.md

# 6. Commit sprint plan
git add .ai/artifacts/wip/current-sprint.md
git commit -m "docs(sprint): create sprint plan for [sprint name]"
```

### Documentation Agent
```bash
# 1. Review recent commits
git log --oneline -20

# 2. Find features needing docs
git diff main --name-only | grep -E 'app/lib|app/api'

# 3. Create feature docs
cp .ai/templates/feature-doc.md .ai/artifacts/docs/features/FEATURE-XXX.md

# 4. Create API docs
cp .ai/templates/api-endpoint-doc.md .ai/artifacts/docs/api/POST-endpoint.md

# 5. Update CHANGELOG
vim CHANGELOG.md

# 6. Commit documentation
git commit -m "docs(feature): document [feature name]"
```

### Testing Agent
```bash
# 1. Run full test suite
cd web-app
npm test -- --coverage

# 2. Identify coverage gaps
open coverage/lcov-report/index.html

# 3. Write missing tests
# Focus on files below 80%

# 4. Run E2E tests
npm run test:e2e

# 5. Update coverage artifact
cd ..
./.ai/scripts/update-coverage.sh

# 6. Commit new tests
git commit -m "test(coverage): add tests for uncovered code"
```

---

## 🔍 Example: Parallel Development Scenario

### Scenario: Two agents working simultaneously

**Agent A:** Implementing employee skill validation
**Agent B:** Implementing shift conflict detection

#### Timeline:

**10:00 AM - Both agents start**

**Agent A:**
```bash
# Locks: web-app/app/lib/employee-validation.ts
# Task: Employee skill validation (RED phase)
```

**Agent B:**
```bash
# Locks: web-app/app/lib/shift-conflict.ts
# Task: Shift overlap detection (RED phase)
```

✅ **No conflict** - Different files

---

**10:15 AM - Both agents implement**

**Agent A:**
```bash
# GREEN phase: employee-validation.ts
# Commits: "feat(employee): implement skill validation"
```

**Agent B:**
```bash
# GREEN phase: shift-conflict.ts
# Commits: "feat(shift): implement conflict detection"
```

✅ **No conflict** - Independent features

---

**10:30 AM - Both agents refactor**

**Agent A:**
```bash
# REFACTOR phase: extract to utility
# Commits: "refactor(employee): extract validation logic"
```

**Agent B:**
```bash
# REFACTOR phase: optimize algorithm
# Commits: "refactor(shift): optimize overlap detection"
```

✅ **No conflict** - Separate commits

---

**10:45 AM - Both agents document**

**Agent A:**
```bash
# Creates: .ai/artifacts/docs/features/FEATURE-001-employee-validation.md
# Updates: CHANGELOG.md (section: Employee Management)
```

**Agent B:**
```bash
# Creates: .ai/artifacts/docs/features/FEATURE-002-shift-conflict.md
# Updates: CHANGELOG.md (section: Shift Management)
```

⚠️ **Potential conflict** - Same CHANGELOG.md file!

**Solution:**
- Agent A commits first
- Agent B pulls changes, merges CHANGELOG.md
- Agent B commits merged version

---

**11:00 AM - Both agents complete**

**Agent A:**
```bash
# Releases lock: employee-validation.ts
# Updates: current-sprint.md (marks task complete)
# Final commit: "docs(employee): document skill validation"
```

**Agent B:**
```bash
# Releases lock: shift-conflict.ts
# Updates: current-sprint.md (marks task complete)
# Final commit: "docs(shift): document conflict detection"
```

✅ **Success** - Two features completed in parallel!

---

## 🎯 Best Practices for Multi-Agent Work

### DO:
✅ **Coordinate via artifacts** (current-sprint.md, locks.json, development.jsonl)
✅ **Work on different files** to avoid conflicts
✅ **Commit frequently** with clear messages
✅ **Update sprint status** after completing tasks
✅ **Log all actions** to development.jsonl
✅ **Pull before starting** new work
✅ **Communicate through files** not external channels

### DON'T:
❌ **Modify locked files** from another agent
❌ **Skip file locking** even for "quick changes"
❌ **Work on the same module** simultaneously
❌ **Force push** ever
❌ **Leave stale locks** (clean up when done)
❌ **Batch commits** (commit after each TDD phase)
❌ **Ignore sprint plan** (coordinate through it)

---

## 📊 Monitoring Multi-Agent Activity

### View All Agent Activity
```bash
# See all recent actions
tail -50 .ai/artifacts/logs/development.jsonl | jq -r '"\(.timestamp) | \(.agent) | \(.action) | \(.details)"'

# See who's working on what
cat .ai/artifacts/wip/locks.json | jq .

# See sprint progress
cat .ai/artifacts/wip/current-sprint.md
```

### Track Agent Performance
```bash
# Count commits by agent
git log --pretty=format:"%an" | sort | uniq -c

# See test additions by agent
cat .ai/artifacts/logs/development.jsonl | jq 'select(.action=="tests_modified") | .agent' | sort | uniq -c

# Check coverage trends
cat .ai/artifacts/test-coverage.md
```

---

## 🆘 Conflict Resolution

### If Two Agents Lock Same File

**Detection:**
```bash
# Agent B tries to lock already-locked file
cat .ai/artifacts/wip/locks.json
# Shows: employee-validation.ts locked by Agent A
```

**Resolution:**
```bash
# Option 1: Work on different task
# Check current-sprint.md for other pending tasks

# Option 2: If lock is stale (>2 hours old)
# Check timestamp, if stale, take over and document in session log

# Option 3: Coordinate via development.jsonl
echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","agent":"agent-b","action":"blocked","details":"Waiting for employee-validation.ts lock release","blocking_agent":"agent-a"}' >> .ai/artifacts/logs/development.jsonl
```

---

## ✅ Success Metrics

Multi-agent coordination is successful when:
- ✅ Multiple features completed simultaneously
- ✅ No merge conflicts in code
- ✅ All tests passing
- ✅ Coverage maintained >80%
- ✅ Documentation complete for all features
- ✅ Clean git history
- ✅ All agents logged work in development.jsonl

---

## 🎓 Example Commands for Agent Spawning

### Spawn Development Agent
```bash
# Agent focused on implementing employee validation
# Reads: current-sprint.md, locks.json, QUICKSTART.md
# Implements: Following TDD workflow
# Logs: All actions to development.jsonl
```

### Spawn Sprint Planning Agent
```bash
# Agent focused on planning next sprint
# Reads: product requirements, current state
# Creates: Sprint plan with all tasks
# Documents: Architectural decisions (ADRs)
```

### Spawn Documentation Agent
```bash
# Agent focused on documentation only
# Reads: Recent commits, existing code
# Creates: Feature docs, API docs
# Updates: CHANGELOG.md, README.md
```

### Spawn Testing Agent
```bash
# Agent focused on test coverage
# Runs: Full test suite with coverage
# Identifies: Gaps below 80%
# Writes: Missing tests
# Reports: Coverage status
```

---

## 📝 Summary

**Multi-agent workflow enables:**
- Parallel feature development
- Specialized agent roles
- Conflict-free collaboration
- Coordinated through file-based artifacts
- Complete audit trail
- Scalable to N agents

**Key to success:**
- File locking prevents conflicts
- Conventional commits enable tracking
- Artifacts preserve context
- TDD ensures quality
- Documentation stays current

**Ready to scale development with multiple AI agents!** 🚀

---

**Related Documentation:**
- [AGENT_GUIDELINES.md](.ai/AGENT_GUIDELINES.md) - Rules for all agents
- [TDD_WORKFLOW.md](.ai/TDD_WORKFLOW.md) - Test-driven development
- [QUICKSTART.md](.ai/QUICKSTART.md) - Quick onboarding
- [current-sprint.md](.ai/artifacts/wip/current-sprint.md) - Current work
