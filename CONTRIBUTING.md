# Contributing to ShiftSync

## 1. Getting Started
- **Node.js**: v18+
- **Database**: PostgreSQL

## 2. Installation
1.  Navigate to the application code:
    ```bash
    cd web-app
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up database:
    ```bash
    npx prisma migrate dev
    ```
4.  Start server:
    ```bash
    npm run dev
    ```

## 3. Coding Standards
- **Mobile First**: Use Tailwind responsive classes.
- **Type Safety**: Strict TypeScript.
- **Database**: Use Prisma ORM.

## 4. Workflow
- Branch: `feature/name`
- PR: Submit to `main`
