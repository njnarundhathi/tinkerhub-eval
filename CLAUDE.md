# CLAUDE.md - TinkerHub Master Workspace

This is a **workspace directory** containing multiple TinkerHub-related projects. Each subdirectory is an independent project with its own tech stack, dependencies, and configuration.

## Projects Overview

| Project | Purpose | Tech Stack | Entry Point |
|---------|---------|------------|-------------|
| [TinkerHub-App-Backend](./TinkerHub-App-Backend/) | Backend API for mobile app | Go 1.22, Echo, PostgreSQL | `cmd/api/main.go` |
| [TinkerHub-App](./TinkerHub-App/) | Flutter mobile app | Flutter 3.5.3+, Dart, Riverpod | `lib/main.dart` |
| [TH-Resources](./TH-Resources/) | Resources Dashboard | React 19, Vite, TypeScript, Tailwind v4 | `src/main.tsx` |
| [Tinkerhub-Koottam](./Tinkerhub-Koottam/) | Admin Dashboard | React 18, TypeScript, Vite, Radix UI | `src/main.tsx` |
| [hub-comms](./hub-comms/) | Communication Engine | Bun, Elysia, TypeScript, Prisma, PostgreSQL | `src/index.ts` |

## Cross-Project Relationships

```
┌─────────────────────┐
│  TinkerHub-App      │ ◄──── Flutter mobile app (iOS/Android)
│  (Flutter Client)   │
└─────────┬───────────┘
          │ HTTP/WebSocket
          ▼
┌─────────────────────┐
│ TinkerHub-App-      │ ◄──── Main API server
│ Backend (Go API)    │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌────────┐  ┌────────────┐
│PostgreSQL│ │Firebase/S3 │
└────────┘  └────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│  TH-Resources       │     │  Tinkerhub-Koottam  │
│  (React Dashboard)  │     │  (Admin Dashboard)  │
└─────────┬───────────┘     └─────────┬───────────┘
          │                           │
          └─────────┬─────────────────┘
                    ▼
          TinkerHub-App-Backend API

┌─────────────────────┐
│ hub-comms           │ ◄──── Multi-channel notification service
│ (Bun/Elysia)        │
└─────────────────────┘
```

## Common Patterns

### Go Services (Backend)
- Use Echo web framework
- Build with `make build`, run with `make run`
- Live reload with `make watch` (requires Air)
- Entry point at `cmd/api/main.go`
- Environment variables loaded via godotenv

### Bun/Elysia Services (hub-comms)
- Use Elysia web framework with Bun runtime
- `bun run dev` for development with watch mode
- `bun run build` for production build
- `npm run start` to run app + cron jobs concurrently
- Entry point at `src/index.ts`

### React Frontends (TH-Resources, Koottam)
- Built with Vite
- `npm run dev` for development
- `npm run build` for production
- TanStack Query for data fetching
- Zustand for state management

## Database Infrastructure

| Project | Database | Setup |
|---------|----------|-------|
| TinkerHub-App-Backend | PostgreSQL | `make docker-run` |
| hub-comms | PostgreSQL | Prisma ORM |
| TinkerHub-App | Firebase | Cloud-hosted |

## Working in Subprojects

When working on a specific project:
1. Navigate to that project's directory
2. Read the project-specific CLAUDE.md for detailed guidance
3. Install dependencies from within that directory
4. Run commands from within that directory

## Quick Start Commands

```bash
# Backend API
cd TinkerHub-App-Backend && make docker-run && make run

# Flutter App
cd TinkerHub-App && flutter pub get && flutter run

# Resources Dashboard
cd TH-Resources && npm install && npm run dev

# Admin Dashboard
cd Tinkerhub-Koottam && pnpm install && npm run dev

# Comms Engine
cd hub-comms && bun install && bun run dev
```

## Data Dictionary

See [DATA_DICTIONARY.md](./DATA_DICTIONARY.md) for comprehensive database schema documentation including all tables, fields, types, and enum values.

### Quick Reference: Common Enum Values

| Field | Values |
|-------|--------|
| `events.type` | `Talk_Session`, `Meetup`, `Core_Team_Meeting`, `Learning_Program`, `Workshop`, `Hackathon`, `Project_Building_Program` |
| `events.status` | `draft`, `published`, `paused`, `cancelled` |
| `attendees.registration_status` | `registered`, `applied` |
| `roles.name` | `SuperAdmin`, `Admin`, `CampusAdmin`, `Staff`, `Maker` |
| `membership_categories.title` | `Kutty Makers`, `Young Makers`, `Friends of TinkerHub` |
| `opportunity_applications.status` | `pending`, `shortlisted`, `accepted`, `rejected` |
| `projects.status` | `Review Pending`, `Accepted` |
| `sub_orgs.state` | `unknown`, `active` |
| `event_groups.status` | `draft`, `active` |
| `event_groups.access_level` | `public`, `private` |
| `invitations.status` | `pending`, `accepted` |
| `tshirt_size` (memberships, prize_claims) | `S`, `M`, `L`, `XL`, `XXL` |
| `memberships.sex` | `Male`, `Female` |

### Cross-Project Database Usage

- **TinkerHub-App-Backend**: Primary database owner, uses raw SQL via sqlc
- **hub-comms**: Read-only access for notifications, uses Prisma ORM
- **TH-Resources / Tinkerhub-Koottam**: Access via Backend API only

### Domain Terminology

| Business Term | Database Table / Concept |
|---------------|--------------------------|
| College / Campus | `sub_orgs` — each row is a college campus chapter |
| Leadership Team | `sub_org_admins` — the leadership/admin team of a college; has roles like Outreach Lead, Technical Lead, etc. |
