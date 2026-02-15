# .ai Directory - AI Agent Collaboration Framework

This directory contains all artifacts, guidelines, and infrastructure for AI agent collaboration on the ShiftSync project.

---

## 📁 Directory Structure

```
.ai/
├── AGENT_GUIDELINES.md          # Comprehensive rules for AI agents
├── TDD_WORKFLOW.md              # Test-Driven Development process
├── README.md                    # This file
├── setup-hooks.sh               # Script to install git hooks
├── hooks/                       # Git hooks for TDD enforcement
│   ├── pre-commit              # Runs tests & checks coverage
│   ├── commit-msg              # Enforces commit message format
│   └── post-commit             # Logs commits to development.jsonl
├── templates/                   # Templates for agents to use
│   ├── work-session.md         # Work session log template
│   └── adr-template.md         # Architecture Decision Record template
└── artifacts/                   # All development artifacts
    ├── wip/                    # Work-in-progress tracking
    │   ├── current-sprint.md   # Current sprint status
    │   ├── locks.json          # File locks for multi-agent coordination
    │   └── session-*.md        # Individual work session logs
    ├── completed/              # Completed work artifacts
    │   └── test-*.md           # Completed test documentation
    ├── decisions/              # Architecture Decision Records
    │   └── adr-*.md            # Individual ADRs
    ├── logs/                   # Development logs
    │   └── development.jsonl   # Machine-readable development log
    └── test-coverage.md        # Test coverage tracking
```

---

## 🚀 Quick Start for AI Agents

### 1. Read Required Documents (in order)
1. `/README.md` - Project overview
2. `/docs/product_requirements.md` - Business requirements
3. `/docs/architecture_design.md` - Technical architecture
4. `/.ai/AGENT_GUIDELINES.md` - **START HERE** for agent rules
5. `/.ai/TDD_WORKFLOW.md` - Test-Driven Development process
6. `/.ai/artifacts/wip/current-sprint.md` - Current work status

### 2. Check Current State
```bash
# Check what's being worked on
cat .ai/artifacts/wip/current-sprint.md

# Check recent development activity
tail -20 .ai/artifacts/logs/development.jsonl

# Check for file locks (multi-agent coordination)
cat .ai/artifacts/wip/locks.json

# View test coverage
cat .ai/artifacts/test-coverage.md
```

### 3. Start Your Work Session
```bash
# Copy work session template
cp .ai/templates/work-session.md .ai/artifacts/wip/session-$(date +%Y%m%d-%H%M%S).md

# Edit with your objectives and progress
```

### 4. Follow TDD Workflow
Every code change MUST follow:
1. 🔴 **RED** - Write failing test first
2. 🟢 **GREEN** - Write minimum code to pass
3. 🔵 **REFACTOR** - Improve code quality

See [TDD_WORKFLOW.md](TDD_WORKFLOW.md) for details.

---

## 🔧 Setup for Human Developers

### Install Git Hooks
```bash
# Run the setup script
./.ai/setup-hooks.sh
```

This installs hooks that:
- ✅ Run tests before every commit
- ✅ Check test coverage (80% minimum)
- ✅ Enforce conventional commit messages
- ✅ Log all commits to development.jsonl

### Manual Hook Installation
```bash
# Create symlinks
ln -s ../../.ai/hooks/pre-commit .git/hooks/pre-commit
ln -s ../../.ai/hooks/commit-msg .git/hooks/commit-msg
ln -s ../../.ai/hooks/post-commit .git/hooks/post-commit
```

---

## 📋 Development Artifacts

### Development Log (development.jsonl)
**Format:** JSON Lines (one JSON object per line)
**Purpose:** Machine-readable log of all development activity

Each line represents an action:
```jsonl
{"timestamp":"2026-02-15T10:30:00Z","agent":"claude-sonnet-4.5","action":"test_created","details":"Created failing test for employee skill validation","file":"web-app/app/lib/__tests__/employee-validation.test.ts","status":"red"}
```

**How to use:**
```bash
# View recent activity
tail -50 .ai/artifacts/logs/development.jsonl

# View all test creation events
cat .ai/artifacts/logs/development.jsonl | grep "test_created"

# View activity by specific agent
cat .ai/artifacts/logs/development.jsonl | grep "claude-sonnet-4.5"

# Count commits by TDD phase
cat .ai/artifacts/logs/development.jsonl | jq -r '.tdd_phase' | sort | uniq -c
```

---

### Work Session Logs (session-*.md)
**Location:** `.ai/artifacts/wip/session-YYYYMMDD-HHMMSS.md`
**Purpose:** Detailed record of each work session

Contains:
- Objectives
- TDD cycles completed
- Files modified
- Tests added
- Commits made
- Decisions made
- Blockers encountered
- Next steps for following agent

---

### Architecture Decision Records (ADR)
**Location:** `.ai/artifacts/decisions/adr-XXXX-title.md`
**Purpose:** Document significant architectural decisions

Use template:
```bash
cp .ai/templates/adr-template.md .ai/artifacts/decisions/adr-0001-my-decision.md
```

---

### Current Sprint Status
**Location:** `.ai/artifacts/wip/current-sprint.md`
**Purpose:** Track sprint progress and current work

Update after each TDD cycle or significant milestone.

---

### File Locks (locks.json)
**Location:** `.ai/artifacts/wip/locks.json`
**Purpose:** Prevent multiple agents from modifying the same file

**Acquire lock:**
```json
{
  "path/to/file.ts": {
    "agent": "claude-sonnet-4.5",
    "session": "session-20260215-103000",
    "locked_at": "2026-02-15T10:30:00Z",
    "reason": "Implementing skill validation"
  }
}
```

**Release lock:** Remove your entry when done.

**Stale locks:** Locks older than 2 hours are considered stale and can be taken over.

---

## 🧪 Test-Driven Development

### The TDD Mantra
```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

### Commit Message Format
```
<type>(<scope>): <subject>

Examples:
- test(employee): add failing test for skill validation
- feat(employee): implement skill validation logic
- refactor(employee): extract validation to utility module
```

### Coverage Requirements
- **Minimum:** 80% for all metrics (statements, branches, functions, lines)
- **Target:** 90%+ for critical business logic
- **Enforcement:** Pre-commit hook blocks commits below threshold

---

## 🤖 Multi-Agent Collaboration

### Coordination Protocol

1. **Check locks** before modifying files
2. **Create session log** when starting work
3. **Update current-sprint.md** with progress
4. **Log actions** to development.jsonl
5. **Release locks** when done
6. **Document next steps** for following agents

### Parallel Work Guidelines

**Safe to work in parallel:**
- Different feature modules
- Different test files
- Different UI components
- Independent API routes

**Requires coordination:**
- Shared utilities
- Database schema changes
- Shared types/interfaces
- CI/CD configuration

---

## 📊 Monitoring & Metrics

### Test Coverage
```bash
cd web-app
npm test -- --coverage
open coverage/lcov-report/index.html
```

### Development Activity
```bash
# View recent commits with TDD phases
cat .ai/artifacts/logs/development.jsonl | jq -r '"\(.timestamp) | \(.tdd_phase) | \(.details)"' | tail -20

# Count actions by type
cat .ai/artifacts/logs/development.jsonl | jq -r '.action' | sort | uniq -c
```

### Sprint Progress
```bash
# View current sprint status
cat .ai/artifacts/wip/current-sprint.md

# List all work sessions
ls -la .ai/artifacts/wip/session-*.md
```

---

## 🛠️ Utilities & Scripts

### Update Coverage Report
```bash
cd web-app
npm test -- --coverage --coverageReporters=json-summary
# Then manually update .ai/artifacts/test-coverage.md
# TODO: Create automated script
```

### Clean Old Sessions
```bash
# Archive sessions older than 30 days
find .ai/artifacts/wip -name "session-*.md" -mtime +30 -exec mv {} .ai/artifacts/completed/ \;
```

### Validate JSONL Format
```bash
# Check if development.jsonl is valid
cat .ai/artifacts/logs/development.jsonl | jq -c . > /dev/null && echo "✅ Valid JSONL" || echo "❌ Invalid JSONL"
```

---

## 📚 Reference

### Essential Commands
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- employee-validation.test.ts

# Run E2E tests
npm run test:e2e

# Install git hooks
./.ai/setup-hooks.sh
```

### Key Files
- [AGENT_GUIDELINES.md](AGENT_GUIDELINES.md) - Comprehensive agent rules
- [TDD_WORKFLOW.md](TDD_WORKFLOW.md) - Test-driven development process
- [current-sprint.md](artifacts/wip/current-sprint.md) - Current work status
- [development.jsonl](artifacts/logs/development.jsonl) - Development activity log

---

## ❓ FAQ

### Q: Why JSONL format for logs?
**A:** JSONL (JSON Lines) is both machine-readable and human-readable. Each line is a valid JSON object, making it easy to parse with tools like `jq` while still being viewable in text editors.

### Q: Can I skip TDD for simple changes?
**A:** No. TDD is mandatory for ALL code changes. Even simple changes benefit from tests, and maintaining discipline ensures consistency.

### Q: What if tests are too slow?
**A:** Write faster unit tests. Integration tests should only be used when necessary. See [TDD_WORKFLOW.md](TDD_WORKFLOW.md) for guidance.

### Q: Can I bypass the pre-commit hook?
**A:** Technically yes with `git commit --no-verify`, but this is strongly discouraged. Hooks are there to maintain quality.

### Q: How do I handle a blocker?
**A:** Document it in your session log, create a blocker entry in development.jsonl, and work on a different task or notify the team.

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-15 | Initial framework created |

---

## 📞 Support

- **Issues:** Check existing ADRs and session logs
- **Ambiguity:** Document your decision and create an ADR
- **Blockers:** Log in development.jsonl and session notes
- **Questions:** Refer to AGENT_GUIDELINES.md

---

**Remember:** The goal of this framework is to enable seamless collaboration between multiple AI agents and human developers while maintaining code quality through strict TDD practices.

**When in doubt, write a test first.** 🧪
