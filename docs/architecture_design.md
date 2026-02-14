# Architectural Design Document: ShiftSync

## 1. High-Level Architecture
The system follows a modular 3-tier architecture:
- **Client**: Next.js Web App (Mobile-First)
- **API**: Next.js API Routes
- **Engine**: Custom Scheduling Algorithm

## 2. Component Breakdown

### 2.1. Frontend (Client)
- **Tech Stack:** Next.js (React), TailwindCSS, TypeScript.
- **Design Philosophy:** **Mobile-First**.
- **State Management:** Zustand/Context.

### 2.2. Backend (API Server)
- **Tech Stack:** Next.js API Routes (Serverless).
- **Language:** TypeScript.
- **Database:** PostgreSQL via Prisma.

### 2.3. Custom Scheduling Engine
- **Algorithm:** Genetic Algorithm / Heuristic Construction.
- **Input:** JSON (Shifts, Employees, Constraints).
- **Output:** JSON (Assigned Roster).

### 2.4. Data Access Layer
- **Pattern:** Repository Pattern.
- **ORM:** Prisma.

## 3. Data Flow: Auto-Schedule
1.  **Trigger:** Admin clicks "Auto-Fill".
2.  **Gather:** API fetches unassigned shifts.
3.  **Compute:** Engine runs algorithm.
4.  **Persist:** API saves draft roster.

## 4. Technology Stack
- **Language:** TypeScript (End-to-End).
- **Framework:** Next.js.
- **Database:** PostgreSQL.
