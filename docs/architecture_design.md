# Architectural Design Document: ShiftSync

## 1. High-Level Architecture
The system follows a modular 3-tier architecture:
- **Client**: Next.js 16 Web App (Mobile-First, Responsive)
- **API**: Next.js Server Actions + API Routes
- **Engine**: Custom Scheduling Algorithm (Planned)

## 2. Component Breakdown

### 2.1. Frontend (Client)
- **Framework:** Next.js 16 (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com) (Radix primitives + Tailwind CSS)
- **Styling:** Tailwind CSS v4 with CSS variables theming
- **Icons:** [Lucide React](https://lucide.dev)
- **Fonts:** Inter (body), Outfit (headings) via `next/font/google`
- **Design Philosophy:** Mobile-First, Responsive (mobile cards + desktop tables)

### 2.2. Backend (API / Server Actions)
- **Framework:** Next.js 16 Server Actions (`'use server'`)
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** NextAuth v5 (Credentials provider, JWT strategy)
- **Validation:** Zod schemas for all runtime validation

### 2.3. Custom Scheduling Engine (Planned)
- **Algorithm:** Genetic Algorithm / Heuristic Construction
- **Input:** JSON (Shifts, Employees, Constraints)
- **Output:** JSON (Assigned Roster)

### 2.4. Data Access Layer
- **ORM:** Prisma with singleton client pattern
- **Transactions:** `prisma.$transaction()` for multi-model ops

## 3. UI Component Architecture

### Design System: shadcn/ui
All UI components use [shadcn/ui](https://ui.shadcn.com) — a collection of accessible, composable components built on Radix UI primitives with Tailwind CSS styling.

**Installed Components:**
| Component | Purpose |
|-----------|---------|
| `Button` | Actions, links, submit buttons (variants: default, destructive, outline, secondary, ghost, link) |
| `Card` | Content containers (dashboard stats, location cards, forms) |
| `Input` | Text, email, password, number inputs |
| `Label` | Accessible form labels (Radix Label primitive) |
| `Select` | Dropdown selects (Radix Select primitive) |
| `Table` | Data tables (employee list, desktop view) |
| `Badge` | Status indicators, tags |
| `Separator` | Visual dividers |
| `Sheet` | Mobile slide-out navigation panel |
| `Textarea` | Multi-line text input |

**Component Location:** `web-app/components/ui/`
**Utility:** `web-app/lib/utils.ts` — `cn()` helper for conditional class merging

### Theming
- CSS variables defined in `app/globals.css`
- **Light mode:** Indigo primary (#4f46e5), Zinc neutrals
- **Dark mode:** Indigo-500 primary (#6366f1), Zinc-900+ neutrals
- Semantic tokens: `--primary`, `--secondary`, `--muted`, `--destructive`, `--accent`
- Sidebar-specific tokens for consistent navigation styling

### MCP Server (AI Tooling)
The project includes a [shadcn/ui MCP server](https://ui.shadcn.com/docs/mcp) for AI-assisted component management:
```json
// .mcp.json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```
This enables AI agents to browse, search, and install shadcn/ui components via natural language.

## 4. Page Architecture

### Authentication Flow
```
/login → NextAuth Credentials → JWT → Role-based redirect
  ├── ADMIN  → /admin/*
  └── EMPLOYEE → /dashboard/*
```

### Admin Routes (`/admin/*`)
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | Dashboard | Stats cards, quick actions |
| `/admin/employees` | Employee List | Table (desktop) / Cards (mobile) |
| `/admin/employees/create` | Create Employee | Form with Zod validation |
| `/admin/locations` | Location Grid | Cards with delete action |
| `/admin/locations/create` | Create Location | Name + address form |
| `/admin/shifts` | Week View | Calendar grid (24h × 7 days) |
| `/admin/shifts/create` | Create Shift | Location, employee, time pickers |

### Layout Structure
```
RootLayout (fonts, globals.css)
├── LoginPage (split layout: brand + form)
├── AdminLayout (sidebar + content)
│   ├── Sidebar (Sheet on mobile, fixed on desktop)
│   └── {children} (page content)
└── DashboardLayout (employee view - planned)
```

## 5. Data Flow: Server Actions
```
Client Form → useActionState() → Server Action → Zod Validation → Prisma → revalidatePath()
                                                        ↓
                                                  State { message, errors }
```

### Key Patterns:
- **Form State:** `useActionState()` from React 19 (replaces deprecated `useFormState`)
- **Validation:** Zod schemas with field-level error messages
- **Mutations:** Server Actions with `'use server'` directive
- **Cache:** `revalidatePath()` after mutations

## 6. Testing Architecture

### Test Stack
| Layer | Tool | Location |
|-------|------|----------|
| Unit | Jest + React Testing Library | `app/**/__tests__/*.test.ts` |
| Component | Jest + RTL | `app/ui/**/__tests__/*.test.tsx` |
| Validation | Jest | `app/lib/validations/__tests__/*.test.ts` |
| E2E | Playwright | `e2e/*.spec.ts` |

### Browser Coverage (Playwright)
- Desktop Chrome (Chromium)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Desktop Firefox (planned)

### Test Commands
```bash
npm test                    # Unit + component tests
npm test -- --coverage      # With coverage report
npm run test:e2e            # Playwright E2E tests
npx playwright test         # Alternative E2E command
```

## 7. Technology Stack Summary
| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.1.6 |
| Language | TypeScript | 5.x (strict) |
| React | React | 19.2.3 |
| UI Components | shadcn/ui | latest (new-york style) |
| Styling | Tailwind CSS | 4.x |
| Database | PostgreSQL | via Prisma 5.10 |
| Auth | NextAuth | v5 beta |
| Validation | Zod | 3.22+ |
| Icons | Lucide React | latest |
| Unit Testing | Jest | 29.7 |
| Component Testing | React Testing Library | 16.1 |
| E2E Testing | Playwright | 1.41+ |

## 8. Key Directories
```
web-app/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin pages (server components)
│   ├── dashboard/          # Employee pages (planned)
│   ├── login/              # Auth page
│   ├── lib/                # Server actions, business logic
│   │   ├── validations/    # Zod validation modules
│   │   └── __tests__/      # Unit tests
│   └── ui/                 # Client components
│       ├── admin/          # Admin-specific UI
│       └── login-form.tsx  # Login form
├── components/ui/          # shadcn/ui components (auto-generated)
├── lib/                    # Shared utilities (cn helper)
├── prisma/                 # Database schema + migrations
├── e2e/                    # Playwright E2E tests
├── public/                 # Static assets
└── types/                  # TypeScript type extensions
```
