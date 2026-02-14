# Product Requirements Document: ShiftSync

## 1. Executive Summary
A web-based application to manage employee shifts and rosters, leveraging a custom scheduling engine.

## 2. User Roles
- **Admin**: Manage shifts, run auto-schedule, approve leaves.
- **Employee**: View roster, set availability, request trade.

## 3. Functional Requirements
### 3.1. Auth & Users
- Email/Password Login (NextAuth).
- Role-Based Access Control.

### 3.2. Roster Management
- Define Shifts (Time, Role, Location).
- Employee Attributes (Skills, Max Hours).

### 3.3. Custom Scheduling Engine
- **Goal**: Bespoke algorithm for roster optimization.
- **Constraints**:
    - *Hard*: Skills match, Availability, No overlaps.
    - *Soft*: Preferences, Fair distribution.

## 4. Technical Constraints
- Mobile-First UI.
- TypeScript codebase.
