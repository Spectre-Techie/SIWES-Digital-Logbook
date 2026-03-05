# SIWES Digital Logbook

A full-stack web application for managing Student Industrial Work Experience Scheme (SIWES) logbooks. Students submit daily work logs and attendance, supervisors review and approve entries, and faculty administrators manage the entire programme — replacing traditional paper-based logbooks with a modern digital workflow.

## Features

### Students
- Submit daily work logs (tasks, hours, challenges, lessons)
- Mark daily attendance (today only — no backdating)
- View log history with status tracking (pending / approved / rejected)
- View supervisor feedback on reviewed logs
- Edit or delete pending logs
- Update SIWES profile (company, department, industry supervisor)
- Export logs as PDF

### Supervisors
- View assigned students and their logs
- Approve or reject logs with comments
- Monitor student attendance records
- Dashboard with review statistics

### Faculty Administrators
- Register and manage supervisors
- View all students across the programme
- Assign / reassign students to supervisors
- Programme-wide dashboard with statistics
- Export data (Excel / PDF)

## Tech Stack

| Layer       | Technology                                                                 |
|-------------|---------------------------------------------------------------------------|
| Frontend    | Next.js 14 (App Router), React 18, Tailwind CSS 3                        |
| Backend     | Node.js, Express 4                                                        |
| Database    | PostgreSQL (via Prisma ORM 5, Prisma Accelerate)                          |
| Auth        | JWT (jsonwebtoken + bcryptjs)                                              |
| Testing     | Jest 29, Supertest (server), Testing Library (client)                     |
| PWA         | Service Worker, Web App Manifest                                          |
| Design      | Outfit font, Phosphor Icons, violet/zinc colour palette, dark mode        |

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 (enforced via `only-allow`)
- **PostgreSQL** 14+ (or a Prisma Accelerate connection string)

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd siwes-digital-logbook
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

#### Server (`server/.env`)

Copy the example and fill in your values:

```bash
cp server/.env.example server/.env
```

| Variable         | Description                                      | Example                                                   |
|------------------|--------------------------------------------------|-----------------------------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string (Prisma Accelerate)  | `prisma://accelerate.prisma-data.net/?api_key=...`        |
| `DIRECT_URL`     | Direct PostgreSQL URL (for migrations)            | `postgresql://user:pass@host:5432/siwes_logbook`          |
| `JWT_SECRET`     | Secret key for signing JWTs (min 64 chars)        | Random string                                             |
| `PORT`           | Server port                                       | `5000`                                                    |
| `NODE_ENV`       | Environment                                       | `development` or `production`                             |
| `FRONTEND_URL`   | Allowed CORS origin                               | `http://localhost:3000`                                   |
| `BCRYPT_ROUNDS`  | Password hashing cost factor                      | `10`                                                      |
| `JWT_EXPIRES_IN` | Token lifetime                                    | `24h`                                                     |
| `LOG_LEVEL`      | Winston log level                                 | `debug`, `info`, `warn`, `error`                          |

#### Client (`client/.env.local`)

```bash
cp client/.env.example client/.env.local
```

| Variable                  | Description               | Example                             |
|---------------------------|---------------------------|-------------------------------------|
| `NEXT_PUBLIC_API_URL`     | Backend API base URL      | `http://localhost:5000/api/v1`      |
| `NEXT_PUBLIC_APP_NAME`    | App display name          | `SIWES Digital Logbook`             |
| `NEXT_PUBLIC_APP_VERSION` | App version               | `1.0.0`                             |

### 4. Set up the database

```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed          # seeds a default faculty_admin account
```

### 5. Start development servers

From the project root:

```bash
pnpm dev          # starts both client (:3000) and server (:5000)
```

Or individually:

```bash
pnpm dev:client   # Next.js on http://localhost:3000
pnpm dev:server   # Express on http://localhost:5000
```

## Scripts

| Command                | Scope   | Description                                       |
|------------------------|---------|---------------------------------------------------|
| `pnpm dev`             | Root    | Start both client and server in dev mode           |
| `pnpm build`           | Root    | Production build for both packages                 |
| `pnpm test`            | Root    | Run all tests (server + client)                    |
| `pnpm test:server`     | Root    | Run server tests only                              |
| `pnpm test:client`     | Root    | Run client tests only                              |
| `pnpm lint`            | Root    | Lint both packages                                 |
| `pnpm dev:client`      | Root    | Start Next.js dev server                           |
| `pnpm dev:server`      | Root    | Start Express dev server (nodemon)                 |

## Testing

**Server** — 69 integration tests across 5 suites (auth, logs, attendance, admin, supervisor):

```bash
cd server
pnpm test
pnpm test:coverage   # with coverage report
```

**Client** — 41 unit tests across 5 suites (Button, Input, ThemeToggle, Spinner, StatusBadge):

```bash
cd client
pnpm test
pnpm test:watch      # re-run on file changes
```

## Project Structure

```
siwes-digital-logbook/
├── client/                     # Next.js 14 frontend
│   ├── app/
│   │   ├── (auth)/             # Login & registration pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (student)/          # Student dashboard & pages
│   │   │   ├── dashboard/
│   │   │   ├── logs/           # Log list, create, detail
│   │   │   ├── attendance/
│   │   │   └── profile/
│   │   ├── (supervisor)/       # Supervisor dashboard & student review
│   │   │   └── supervisor/
│   │   ├── (admin)/            # Admin dashboard, user management
│   │   │   └── admin/
│   │   ├── page.jsx            # Landing page
│   │   ├── layout.jsx          # Root layout, fonts, metadata
│   │   └── globals.css         # Tailwind directives & custom styles
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Button, Input, etc.)
│   │   ├── layout/             # DashboardLayout, Sidebar, Navbar
│   │   └── logs/               # StatusBadge and log-specific components
│   ├── context/                # AuthContext (JWT + role-based routing)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Axios instance, helpers
│   └── public/                 # PWA manifest, service worker, icons
│
├── server/                     # Express API server
│   ├── prisma/
│   │   ├── schema.prisma       # Database models (User, Student, Log, Attendance)
│   │   ├── migrations/         # Prisma migrations
│   │   └── seed.js             # Database seed script
│   ├── src/
│   │   ├── config/             # Database & app configuration
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/          # Auth, error handling, validation
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # PDF/Excel generation, helpers
│   │   └── validators/         # Request validation schemas (Joi)
│   ├── __tests__/              # Jest + Supertest integration tests
│   └── server.js               # Entry point
│
├── package.json                # Workspace root scripts
├── pnpm-workspace.yaml         # pnpm workspace config
└── pnpm-lock.yaml
```

## Database Schema

Three roles (`student`, `supervisor`, `faculty_admin`) with these core models:

- **User** — authentication, name, email, role, optional matric number
- **Student** — SIWES profile (company, department, industry supervisor), linked to a User and optionally a Supervisor
- **Log** — daily work entry (date, tasks, hours, challenges, lessons), status workflow (`pending` → `approved` / `rejected`), supervisor comments
- **Attendance** — daily presence record (`present` / `absent` / `excused`), one entry per student per day

## Deployment

### Backend (Node.js)

1. Set `NODE_ENV=production` and all required env vars
2. Run database migrations: `npx prisma migrate deploy`
3. Start the server: `node server.js`

Recommended platforms: Railway, Render, Fly.io, or any Node.js host.

### Frontend (Next.js)

1. Set `NEXT_PUBLIC_API_URL` to your production API URL
2. Build: `pnpm --filter client build`
3. Start: `pnpm --filter client start`

Recommended platforms: Vercel (zero-config Next.js), Netlify, or any Node.js host.

### Database

Use a managed PostgreSQL provider (Neon, Supabase, Railway, or Prisma Accelerate) and set `DATABASE_URL` / `DIRECT_URL` accordingly.

## Colour Palette

| Token    | Light             | Dark              |
|----------|-------------------|-------------------|
| Primary  | Violet `#7C3AED`  | Violet `#7C3AED`  |
| Surface  | White `#FFFFFF`   | Zinc `#18181B`    |
| Text     | Zinc `#27272A`    | Zinc `#F4F4F5`    |
| Border   | Zinc `#E4E4E7`    | Zinc `#3F3F46`    |

## License

Private — all rights reserved.
