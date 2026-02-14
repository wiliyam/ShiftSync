# ShiftSync: Intelligent Roster Management

**ShiftSync** is a modern, mobile-first employee scheduling application designed to automate roster creation using advanced constraints and heuristics.

## 🚀 Features
- **Mobile-First Design**: Fully responsive UI for employees and managers.
- **Automated Scheduling**: Custom engine to generate optimal rosters.
- **Role-Based Access**: Granular permissions for Admins and Staff.
- **Real-Time Updates**: Instant notifications for shift changes.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, TypeScript
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Engine**: Custom TypeScript Heuristic/Genetic Algorithm

## 📂 Documentation
- [Product Requirements](./docs/product_requirements.md)
- [Architecture Design](./docs/architecture_design.md)
- [Contributing Guide](./CONTRIBUTING.md)

## ⚡ Getting Started

1. **Navigate to App Directory**
   ```bash
   cd web-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   # Update .env with your DATABASE_URL
   npx prisma migrate dev
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
