# Contributing to ShiftSync

Welcome! This project follows **strict Test-Driven Development (TDD)** practices. All code changes must follow the Red-Green-Refactor cycle.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+
- **Database**: PostgreSQL (via Docker)
- **Git**: For version control

### 2. Installation

1. **Clone and navigate to project:**
   ```bash
   git clone <repository-url>
   cd workplace-app
   ```

2. **Install git hooks for TDD enforcement:**
   ```bash
   ./.ai/setup-hooks.sh
   ```

3. **Navigate to application code:**
   ```bash
   cd web-app
   ```

4. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

5. **Start database (from project root):**
   ```bash
   cd ..
   docker-compose up db -d
   cd web-app
   ```

6. **Set up database:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

7. **Verify tests pass:**
   ```bash
   npm test
   ```

8. **Start development server:**
   ```bash
   npm run dev
   ```

---

## 🧪 Test-Driven Development (MANDATORY)

### The TDD Cycle

**ALL code changes MUST follow this sequence:**

```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

#### Phase 1: 🔴 RED - Write Failing Test First
1. Write a test that defines expected behavior
2. Run test and verify it fails for the right reason
3. Commit test: `git commit -m "test(scope): add failing test for X"`

#### Phase 2: 🟢 GREEN - Make Test Pass
1. Write MINIMUM code to make test pass
2. Run test and verify it passes
3. Commit implementation: `git commit -m "feat(scope): implement X"`

#### Phase 3: 🔵 REFACTOR - Improve Code
1. Improve code quality while keeping tests green
2. Run ALL tests to ensure nothing broke
3. Commit refactor: `git commit -m "refactor(scope): improve X"`

**📖 Detailed TDD Guide:** See [`.ai/TDD_WORKFLOW.md`](.ai/TDD_WORKFLOW.md)

---

## 📋 Coding Standards

### TypeScript
- **Strict Mode:** Enabled (no `any`, no `@ts-ignore`)
- **Type Exports:** All public interfaces must be exported
- **Validation:** Use Zod schemas for runtime validation

### Testing
- **Unit Tests:** Required for all business logic
- **Integration Tests:** Required for database operations
- **E2E Tests:** Required for critical user flows
- **Coverage Minimum:** 80% (enforced by pre-commit hook)

### Code Style
- **Mobile First:** Use Tailwind responsive classes
- **Database:** Use Prisma ORM exclusively
- **Error Handling:** Use Result<T, E> pattern (see `app/lib/types/result.ts`)
- **File Naming:**
  - Components: `PascalCase.tsx`
  - Utilities: `kebab-case.ts`
  - Tests: `*.test.ts` or `*.spec.ts`

---

## 🔀 Git Workflow

### Branching Strategy
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create fix branch
git checkout -b fix/bug-description
```

### Commit Message Format
**Required format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types (TDD workflow):**
- `test`: 🔴 Adding or modifying tests (RED phase)
- `feat`: 🟢 New feature implementation (GREEN phase)
- `refactor`: 🔵 Code improvements (REFACTOR phase)
- `fix`: Bug fixes
- `docs`: Documentation only
- `chore`: Build, configs, dependencies

**Examples:**
```bash
git commit -m "test(employee): add failing test for skill validation"
git commit -m "feat(employee): implement skill validation logic"
git commit -m "refactor(employee): extract validation to utility module"
```

### Pre-Commit Checks
Git hooks will automatically:
- ✅ Run all tests
- ✅ Check test coverage (min 80%)
- ✅ Enforce commit message format
- ✅ Log commits to development log

**To bypass (NOT recommended):**
```bash
git commit --no-verify
```

### Pull Requests
1. **Ensure all tests pass:** `npm test`
2. **Check coverage:** `npm test -- --coverage`
3. **Push to remote:**
   ```bash
   git push -u origin feature/your-feature-name
   ```
4. **Create PR to `main` branch**
5. **PR Requirements:**
   - All tests passing
   - Coverage ≥ 80%
   - Conventional commit messages
   - At least one approval

---

## 🤖 AI Agent Collaboration

This project is designed for multi-agent collaboration. If you're an AI agent:

### Required Reading (in order):
1. [`/README.md`](/README.md) - Project overview
2. [`/docs/product_requirements.md`](/docs/product_requirements.md) - Business requirements
3. [`/docs/architecture_design.md`](/docs/architecture_design.md) - Technical architecture
4. [`/.ai/AGENT_GUIDELINES.md`](.ai/AGENT_GUIDELINES.md) - **START HERE** for agent rules
5. [`/.ai/TDD_WORKFLOW.md`](.ai/TDD_WORKFLOW.md) - TDD process
6. [`/.ai/artifacts/wip/current-sprint.md`](.ai/artifacts/wip/current-sprint.md) - Current work

### Before Starting Work:
```bash
# Check current state
cat .ai/artifacts/wip/current-sprint.md
tail -20 .ai/artifacts/logs/development.jsonl
cat .ai/artifacts/wip/locks.json

# Create work session
cp .ai/templates/work-session.md .ai/artifacts/wip/session-$(date +%Y%m%d-%H%M%S).md
```

**📖 Complete Agent Guide:** See [`.ai/AGENT_GUIDELINES.md`](.ai/AGENT_GUIDELINES.md)

---

## 📁 Project Structure

```
workplace-app/
├── .ai/                          # AI agent collaboration framework
│   ├── AGENT_GUIDELINES.md       # Rules for AI agents
│   ├── TDD_WORKFLOW.md           # TDD process documentation
│   ├── README.md                 # .ai directory guide
│   ├── hooks/                    # Git hooks for TDD enforcement
│   ├── templates/                # Templates for agents
│   └── artifacts/                # Development artifacts
│       ├── wip/                  # Work-in-progress tracking
│       ├── completed/            # Completed work
│       ├── decisions/            # Architecture Decision Records
│       └── logs/                 # Development logs
├── web-app/                      # Next.js application
│   ├── app/                      # Application code
│   │   ├── lib/                  # Business logic & utilities
│   │   │   └── __tests__/        # Unit tests
│   │   ├── ui/                   # React components
│   │   │   └── __tests__/        # Component tests
│   │   └── api/                  # API routes
│   ├── tests/
│   │   └── e2e/                  # End-to-end tests
│   ├── prisma/                   # Database schema & migrations
│   └── package.json              # Dependencies & scripts
├── docs/                         # Project documentation
├── docker-compose.yml            # Infrastructure config
└── README.md                     # Project overview
```

---

## 🧪 Testing

### Run Tests
```bash
# All tests
npm test

# Watch mode
npm test:watch

# With coverage
npm test -- --coverage

# Specific test file
npm test -- employee-validation.test.ts

# E2E tests
npm run test:e2e
```

### Test Organization
```
web-app/
├── app/
│   └── lib/
│       ├── employee-actions.ts
│       └── __tests__/
│           └── employee-actions.test.ts  # Co-located with source
└── tests/
    └── e2e/
        └── employee-management.spec.ts    # E2E tests separate
```

### Coverage Requirements
| Metric | Minimum | Target |
|--------|---------|--------|
| Statements | 80% | 90% |
| Branches | 80% | 90% |
| Functions | 80% | 90% |
| Lines | 80% | 90% |

---

## 📊 Development Artifacts

All development activity is tracked in `.ai/artifacts/`:

- **Development Log:** `.ai/artifacts/logs/development.jsonl` (machine-readable)
- **Current Sprint:** `.ai/artifacts/wip/current-sprint.md`
- **Work Sessions:** `.ai/artifacts/wip/session-*.md`
- **Decisions:** `.ai/artifacts/decisions/adr-*.md`
- **Test Coverage:** `.ai/artifacts/test-coverage.md`

---

## ❓ FAQ

### Q: Do I really need to write tests first?
**A:** Yes. TDD is mandatory. Tests define behavior, improve design, and prevent regressions.

### Q: What if I'm just fixing a typo?
**A:** For documentation typos, TDD isn't required. For code changes, yes - write a test.

### Q: Can I skip the git hooks?
**A:** Hooks can be bypassed with `--no-verify`, but this is strongly discouraged. They maintain quality.

### Q: How do I handle a failing pre-commit hook?
**A:** Fix the issue (failing tests or low coverage) before committing. The hook protects code quality.

### Q: What if tests are too slow?
**A:** Write faster unit tests. Integration tests should only be used when necessary.

---

## 🆘 Getting Help

- **TDD Questions:** See [`.ai/TDD_WORKFLOW.md`](.ai/TDD_WORKFLOW.md)
- **Agent Questions:** See [`.ai/AGENT_GUIDELINES.md`](.ai/AGENT_GUIDELINES.md)
- **Technical Issues:** Check existing ADRs in `.ai/artifacts/decisions/`
- **Project Questions:** See [`/README.md`](/README.md) and `/docs/`

---

## ✅ Checklist Before Your First Commit

- [ ] Git hooks installed (`.ai/setup-hooks.sh`)
- [ ] Tests run successfully (`npm test`)
- [ ] Understand TDD cycle (Read `.ai/TDD_WORKFLOW.md`)
- [ ] Understand commit format (conventional commits)
- [ ] Read project documentation (`/README.md`, `/docs/`)

---

## 🎯 Summary

**The Golden Rule:**
> Never write production code without a failing test first.

**TDD ensures:**
- ✅ Code quality
- ✅ Design quality
- ✅ Regression prevention
- ✅ Living documentation
- ✅ Confidence in changes

**Thank you for contributing to ShiftSync!** 🚀
