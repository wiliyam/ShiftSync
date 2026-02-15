# Changelog

All notable changes to ShiftSync will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- TDD infrastructure with Red-Green-Refactor workflow
- AI agent collaboration framework in `.ai/` directory
- Comprehensive documentation automation system
- Git hooks for TDD enforcement (pre-commit, commit-msg, post-commit)
- Sandbox environment guide for agents
- Feature and API documentation templates
- Development feedback loop workflow
- Test coverage tracking (80% minimum)
- Conventional commit enforcement

### Changed
- Updated CONTRIBUTING.md with TDD requirements
- Enhanced README.md with AI agent collaboration section

### Documentation
- Created AGENT_GUIDELINES.md (comprehensive agent rules)
- Created TDD_WORKFLOW.md (test-driven development process)
- Created TEST_CONFIGURATION.md (Jest & Playwright setup)
- Created DOCUMENTATION_AUTOMATION.md (auto-doc system)
- Created SANDBOX_ENVIRONMENT.md (development sandbox guide)
- Created QUICKSTART.md (5-minute agent onboarding)
- Created CLAUDE.md (auto-read instructions)

## [1.0.0] - 2026-02-15

### Added
- Initial project setup
- Next.js 16 application structure
- PostgreSQL database with Prisma ORM
- NextAuth v5 authentication
- Admin and Employee roles
- Basic employee management
- Shift scheduling foundation
- Tailwind CSS v4 styling
- Docker Compose infrastructure
- Jest testing framework
- Playwright E2E testing

### Documentation
- Product Requirements Document (PRD)
- Architecture Design Document
- High-Level Design Compliance guide
- Basic README with quickstart

---

## How to Update This Changelog

### For Each Feature
Add entry under `## [Unreleased]` in the appropriate section:
- **Added** - for new features
- **Changed** - for changes in existing functionality
- **Deprecated** - for soon-to-be removed features
- **Removed** - for now removed features
- **Fixed** - for any bug fixes
- **Security** - in case of vulnerabilities

### Examples

```markdown
### Added
- Employee skill validation with duplicate detection (#123)
- API endpoint for bulk employee creation (#124)

### Fixed
- Employee creation now handles undefined skill arrays (#125)
- Shift overlap detection correctly identifies adjacent shifts (#126)

### Changed
- Updated employee validation to use Zod schemas (#127)
```

### Before Release
When cutting a new release:
1. Move all `[Unreleased]` items to a new version section
2. Add release date
3. Create git tag: `git tag -a v1.1.0 -m "Release version 1.1.0"`
4. Push tag: `git push origin v1.1.0`

---

## Versioning Guidelines

- **MAJOR** (X.0.0) - Breaking changes, major rewrites
- **MINOR** (x.X.0) - New features, backward compatible
- **PATCH** (x.x.X) - Bug fixes, minor improvements

**Current Version:** 1.0.0 (Initial Release)
