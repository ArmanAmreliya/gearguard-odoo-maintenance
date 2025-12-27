# GearGuard - Maintenance & Asset Management System

A production-grade internal operations tool for managing equipment maintenance and assets with real-time kanban board, preventive scheduling, and role-based access control.

## Features

- **Kanban Board**: Drag-and-drop status management (New → In Progress → Repaired/Scrap)
- **Preventive Scheduling**: Calendar view for scheduled maintenance
- **Equipment Management**: Complete inventory tracking with maintenance history
- **Role-Based Access**: Admin, Technician, and User roles with data filtering
- **Business Rules**:
  - Auto-fill maintenance team from equipment
  - Team-specific technician assignment
  - Status workflow enforcement
  - Automatic equipment scrapping logic
  - Overdue detection with visual indicators

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite
- **Auth**: JWT-based session management with bcrypt password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment:
   ```bash
   cp .env.local.example .env.local
   ```

3. Create database and run migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Seed demo data:
   ```bash
   npx ts-node scripts/seed.ts
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

Visit http://localhost:3000 and login with demo credentials (see below).

## Demo Credentials

- **Admin**: admin@gearguard.com / admin123
- **Technician**: tech@gearguard.com / tech123
- **User**: user@gearguard.com / user123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Maintenance Requests
- `GET /api/requests` - List requests (filtered by role)
- `POST /api/requests` - Create new request
- `GET /api/requests/[id]` - Get request details
- `PATCH /api/requests/[id]` - Update request status

### Equipment
- `GET /api/equipment` - List all equipment
- `POST /api/equipment` - Create new equipment (Admin only)
- `GET /api/equipment/[id]` - Get equipment with maintenance history

### Teams
- `GET /api/teams` - List all teams with members

## Business Rules

1. **Auto-Fill Logic**: When selecting equipment, maintenance team is automatically assigned
2. **Team Assignment**: Only technicians from the assigned team can be selected
3. **Status Workflow**: New → In Progress → Repaired OR Scrap
4. **Scrap Logic**: Marking request as Scrap automatically sets equipment.isScrapped = true
5. **Overdue Detection**: Preventive requests past scheduled date (not Repaired/Scrap) show overdue indicator
6. **Real-Time Persistence**: All drag-and-drop updates immediately persist to database

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Main kanban board
│   ├── equipment/        # Equipment management
│   ├── admin/            # Admin dashboard
│   └── login/            # Authentication
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── kanban-board.tsx  # Kanban UI
│   └── ...               # Feature components
├── lib/
│   ├── auth.ts           # Auth utilities
│   └── service/          # Business logic
├── prisma/
│   └── schema.prisma     # Database schema
└── scripts/
    └── seed.ts           # Demo data seeding
```

## Development

- Add new components in `/components`
- Add API routes in `/app/api`
- Update database schema in `/prisma/schema.prisma`
- Run migrations: `npx prisma migrate dev`

## Production Deployment

1. Update `NEXTAUTH_SECRET` with a strong secret
2. Configure DATABASE_URL for production database
3. Build: `npm run build`
4. Deploy to Vercel or preferred hosting

## License

MIT
