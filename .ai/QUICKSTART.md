# Quick Start Guide for AI Agents

**Purpose:** Get started contributing to ShiftSync in 5 minutes

---

## ⚡ 5-Minute Onboarding

### Step 1: Read Context (2 minutes)
```bash
# Essential reading
cat README.md                                    # Project overview
cat .ai/AGENT_GUIDELINES.md | head -100         # First 100 lines (core principles)
cat .ai/artifacts/wip/current-sprint.md         # Current work
```

### Step 2: Check Current State (1 minute)
```bash
# What's being worked on?
tail -10 .ai/artifacts/logs/development.jsonl

# Any file locks?
cat .ai/artifacts/wip/locks.json

# Tests passing?
cd web-app && npm test
```

### Step 3: Start Work Session (1 minute)
```bash
# Create session log
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)"
cp .ai/templates/work-session.md .ai/artifacts/wip/$SESSION_ID.md

# Edit session file with your objectives
# Use your editor or echo key info
```

### Step 4: Follow TDD (ongoing)
```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

Every code change:
1. Write failing test
2. Make it pass
3. Refactor (if needed)

### Step 5: Log Your Work (30 seconds)
```bash
# Update development log
echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","agent":"YOUR_ID","action":"ACTION","details":"DETAILS","status":"STATUS"}' >> .ai/artifacts/logs/development.jsonl

# Update current sprint
# Edit .ai/artifacts/wip/current-sprint.md
```

---

## 🎯 Common Tasks

### Writing a New Feature
```bash
# 1. RED - Write failing test
vim web-app/app/lib/__tests__/my-feature.test.ts
npm test -- my-feature.test.ts  # Should FAIL
git add web-app/app/lib/__tests__/my-feature.test.ts
git commit -m "test(scope): add failing test for X"

# 2. GREEN - Implement minimum code
vim web-app/app/lib/my-feature.ts
npm test -- my-feature.test.ts  # Should PASS
git add web-app/app/lib/my-feature.ts
git commit -m "feat(scope): implement X"

# 3. REFACTOR - Improve code (if needed)
vim web-app/app/lib/my-feature.ts
npm test  # All tests should still PASS
git commit -m "refactor(scope): improve X"
```

### Fixing a Bug
```bash
# 1. Write test that reproduces the bug
vim web-app/app/lib/__tests__/buggy-module.test.ts
npm test -- buggy-module.test.ts  # Should FAIL (bug confirmed)
git commit -m "test(scope): add failing test exposing bug X"

# 2. Fix the bug
vim web-app/app/lib/buggy-module.ts
npm test -- buggy-module.test.ts  # Should PASS (bug fixed)
git commit -m "fix(scope): resolve bug X"
```

### Checking Test Coverage
```bash
cd web-app
npm test -- --coverage
open coverage/lcov-report/index.html

# Update artifact
cd ..
./.ai/scripts/update-coverage.sh
```

---

## 📋 Essential Commands

### Testing
```bash
npm test                           # Run all tests
npm test:watch                     # Watch mode
npm test -- --coverage             # With coverage
npm test -- file.test.ts           # Specific file
npm run test:e2e                   # E2E tests
```

### Development
```bash
npm run dev                        # Start dev server
npx prisma migrate dev             # Run migrations
npx prisma db seed                 # Seed database
npx prisma studio                  # Database GUI
```

### Git
```bash
git status                         # Check status
git add .                          # Stage changes
git commit -m "type(scope): msg"   # Commit (triggers hooks)
git push                           # Push changes
```

---

## 🚨 Red Flags - STOP if you see these!

❌ **Test passes before you write implementation**
   → Test is wrong, fix it!

❌ **Coverage drops below 80%**
   → Add more tests before committing

❌ **Committing without running tests**
   → Always run `npm test` first

❌ **Writing code without a test first**
   → STOP. Write test first (RED phase)

❌ **File locked by another agent**
   → Work on different file or coordinate

---

## 🎓 TDD Mindset

### Before writing any code, ask:
1. "What test would prove this works?"
2. "How do I know when I'm done?"
3. "What could go wrong?"

### Good test names tell a story:
```typescript
// ✅ Good
it('should reject employee with duplicate email')
it('should calculate overtime when hours exceed 40')
it('should send notification when shift is assigned')

// ❌ Bad
it('works')
it('test employee')
it('handles data')
```

### Tests should be:
- **Fast** - milliseconds, not seconds
- **Independent** - order doesn't matter
- **Repeatable** - same result every time
- **Self-validating** - pass or fail, no manual checks
- **Timely** - written before implementation (TDD!)

---

## 📚 Documentation Hierarchy

**When you need information:**

1. **Immediate context** → `.ai/artifacts/wip/current-sprint.md`
2. **How to do TDD** → `.ai/TDD_WORKFLOW.md`
3. **Agent rules** → `.ai/AGENT_GUIDELINES.md`
4. **Test setup** → `.ai/TEST_CONFIGURATION.md`
5. **Project overview** → `/README.md`
6. **Architecture** → `/docs/architecture_design.md`
7. **Requirements** → `/docs/product_requirements.md`

---

## 🤝 Multi-Agent Etiquette

### Before modifying a file:
```bash
# Check locks
cat .ai/artifacts/wip/locks.json

# If locked, check timestamp
# If > 2 hours old, consider stale
# If recent, work on something else
```

### Acquire lock:
```json
{
  "path/to/file.ts": {
    "agent": "your-agent-id",
    "session": "session-20260215-103000",
    "locked_at": "2026-02-15T10:30:00Z",
    "reason": "Implementing feature X"
  }
}
```

### Release lock:
```bash
# Remove your entry from locks.json when done
```

---

## ✅ Pre-Commit Checklist

Before every commit:
- [ ] Tests written FIRST (RED)
- [ ] Tests passing (GREEN)
- [ ] Code refactored (REFACTOR - if needed)
- [ ] All tests still passing (`npm test`)
- [ ] Coverage ≥ 80%
- [ ] Conventional commit message
- [ ] Development log updated

Git hooks will check most of this, but it's good to verify manually!

---

## 🆘 Need Help?

**Can't find something?**
```bash
# Search development log
cat .ai/artifacts/logs/development.jsonl | grep "search-term"

# Find test files
find web-app -name "*.test.*"

# Find recent work sessions
ls -lt .ai/artifacts/wip/session-*.md | head -5
```

**Confused about TDD?**
- Read `.ai/TDD_WORKFLOW.md`
- Look at existing tests in `web-app/app/**/__tests__/`
- Remember: RED → GREEN → REFACTOR

**Not sure what to work on?**
- Check `.ai/artifacts/wip/current-sprint.md`
- Look for `[ ]` pending tasks
- Avoid tasks marked `[IN PROGRESS]` by others

---

## 🎯 Success Criteria

You're doing it right if:
✅ Every commit has tests
✅ Tests are written before implementation
✅ Coverage stays above 80%
✅ Commit messages follow format
✅ Development log is updated
✅ Session logs document your work

---

## 💡 Pro Tips

1. **Use watch mode** while developing:
   ```bash
   npm test:watch -- my-feature.test.ts
   ```

2. **Commit frequently** in TDD cycles:
   - RED commit (test)
   - GREEN commit (implementation)
   - REFACTOR commit (improvement)

3. **Log as you go**, don't batch at the end

4. **Read recent session logs** to understand context

5. **When stuck, write a test** - it clarifies thinking!

---

**Remember:** TDD is not about testing, it's about **design**. Tests first = better design.

**Ready to start? Follow the 5-minute onboarding above!** 🚀
