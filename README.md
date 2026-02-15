# ShiftSync - Roster Management App

ShiftSync is a modern, mobile-first Roster Management Application designed to streamline employee scheduling. It features role-based access, conflict detection, and a fluid "Glassmorphism" UI.

## 🚀 Quick Start (Recommended)

The easiest way to run the app is with Docker. This handles the database and application setup automatically.

```bash
# From the project root
docker-compose up --build
```

- **App**: [http://localhost:3000](http://localhost:3000)
- **Login**: `admin@shiftsync.com` / `password`

## 🛠️ Local Development

If you want to run the application locally (without Docker for the app):

### Prerequisites
- Node.js 18+
- Docker (for the PostgreSQL database)

### Setup Steps

1.  **Navigate to the App Directory**:
    The Next.js application lives in the `web-app` folder.
    ```bash
    cd web-app
    ```

2.  **Install Dependencies**:
    *Note: We use `--legacy-peer-deps` due to version mismatches between Next.js 16 and NextAuth v5 beta.*
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Start the Database**:
    Go back to the root and start the database container.
    ```bash
    cd ..
    docker-compose up db -d
    cd web-app
    ```

4.  **Database Migration & Seeding**:
    Apply the schema and populate initial data (Admin user, Locations).
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## ✨ Key Features
- **🔐 Authentication**: Admin & Employee roles (NextAuth.js v5).
- **👥 Employee Management**: Create, Edit, Delete, and Tag Skills.
- **📅 Shift Management**: Schedule shifts with automatic conflict detection.
- **🎨 Dynamic Theming**: Tailwind v4 with CSS variables for easy branding.
- **🧪 Testing**: Full suite of Unit (Jest) and E2E (Playwright) tests.
- **🤖 AI Agent Ready**: Complete TDD infrastructure for multi-agent collaboration.

## 🤖 For AI Agents & Contributors

This project follows **strict Test-Driven Development (TDD)** with comprehensive infrastructure for AI agent collaboration.

### Quick Start for AI Agents
1. **5-minute onboarding:** Read [`.ai/QUICKSTART.md`](.ai/QUICKSTART.md)
2. **Detailed guidelines:** Follow [`.ai/AGENT_GUIDELINES.md`](.ai/AGENT_GUIDELINES.md)
3. **Current work:** Check [`.ai/artifacts/wip/current-sprint.md`](.ai/artifacts/wip/current-sprint.md)
4. **TDD process:** See [`.ai/TDD_WORKFLOW.md`](.ai/TDD_WORKFLOW.md)

### For Human Developers
1. **Install git hooks:** Run `./.ai/setup-hooks.sh` (enforces TDD)
2. **Read guidelines:** See [`CONTRIBUTING.md`](CONTRIBUTING.md)
3. **Follow TDD:** All code changes require tests first

### TDD Workflow
```
🔴 RED: Write failing test
🟢 GREEN: Make test pass
🔵 REFACTOR: Improve code
```

**Minimum test coverage:** 80% (enforced by pre-commit hooks)

## 📁 Project Structure
- `/.ai`: AI agent collaboration framework & TDD infrastructure
  - `AGENT_GUIDELINES.md`: Rules for AI agents
  - `TDD_WORKFLOW.md`: Test-Driven Development process
  - `QUICKSTART.md`: 5-minute onboarding for agents
  - `artifacts/`: Development logs, work tracking, decisions
  - `hooks/`: Git hooks for TDD enforcement
- `/web-app`: Next.js application source code
- `/web-app/prisma`: Database schema and seeds
- `/docs`: Project documentation
- `/docker-compose.yml`: Infrastructure configuration
