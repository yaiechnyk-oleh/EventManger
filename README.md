# Event Management System (EMS)

A small but full-featured **Event Management System** built as a monorepo:

- **Backend** – NestJS + Prisma + PostgreSQL  
- **Frontend** – Next.js (App Router) + Redux Toolkit + Material UI  
- **Bonus** – Simple recommendation engine + interactive map view (Leaflet)

The app lets you **create, list, view, edit, delete and explore events**, with basic recommendations and a map view of event locations.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Prerequisites](#prerequisites)  
5. [Quick Start (TL;DR)](#quick-start-tldr)  
6. [Backend Setup (NestJS + Prisma)](#backend-setup-nestjs--prisma)  
7. [Frontend Setup (Nextjs)](#frontend-setup-nextjs)  
8. [API Overview](#api-overview)  
9. [Frontend Pages & UX](#frontend-pages--ux)  
10. [Recommendation Algorithm](#recommendation-algorithm)  
11. [Development & Useful Scripts](#development--useful-scripts)  
12. [Troubleshooting](#troubleshooting)

---

## Features

### Core functionality

- **Event CRUD**
  - Create, view, update, and delete events.
  - Fields: `title`, `description`, `date`, `location`, `category`, optional `latitude` / `longitude`.

- **Event List View**
  - Paginated list of events.
  - Shows title, date, location, category, and a short description.
  - Sorting (date/title, asc/desc).
  - Filtering by category.

- **Event Details View**
  - Full event information.
  - “Similar events” section powered by the recommendation algorithm.

- **Event Creation & Editing**
  - Shared form component.
  - Required fields validated on client and server.
  - Editing pre-populates existing data.

- **Event Deletion**
  - Delete from details page with confirmation dialog.

### Recommendation & Map

- **Recommendations**
  - For a given event, recommends similar events based on:
    - Same category
    - Close dates
    - Similar location (city substring match)
  - Available via both API and UI.

- **Map View (Bonus)**
  - Leaflet-based interactive map (no paid API keys needed).
  - Uses browser geolocation:
    - If permission granted → centers on user and shows “You are here”.
    - Otherwise centers on events or falls back to Lviv (Ukraine).
  - Clicking markers opens a popup with event details and a link to the event page.

---

## Tech Stack

**Backend**

- NestJS  
- Prisma  
- PostgreSQL  
- class-validator, class-transformer  
- Jest

**Frontend**

- Next.js (App Router)  
- React  
- Redux Toolkit + RTK Query  
- Material UI  
- React Leaflet + Leaflet

**Dev / Infra**

- Node.js (tested with Node 20)  
- Docker / Docker Compose (for Postgres)  
- TypeScript, ESLint, Prettier

---

## Project Structure

```text
EventManager/
  docker-compose.yml
  README.md

  backend/
    .env
    package.json
    prisma/
      schema.prisma
      migrations/
      seed.ts
    src/
      main.ts
      app.module.ts
      common/
        filters/http-exception.filter.ts
        middleware/logger.middleware.ts
      prisma/
        prisma.module.ts
        prisma.service.ts
      events/
        events.module.ts
        events.service.ts
        events.controller.ts
        dto/
          create-event.dto.ts
          update-event.dto.ts
          query-events.dto.ts
    test/
    ...

  frontend/
    .env.local
    package.json
    next.config.ts
    tsconfig.json
    src/
      app/
        layout.tsx
        page.tsx              // redirects to /events
        events/
          page.tsx            // events list
          map/page.tsx        // map view
          new/page.tsx        // create event
          [id]/page.tsx       // event details
          [id]/edit/page.tsx  // edit event
      components/
        events/
          EventForm.tsx
          EventsMap.tsx
      store/
        store.ts
        eventApi.ts           // RTK Query API definitions
        uiSlice.ts            // filters, sorting
        hooks.ts              // typed hooks
      Providers.tsx           // Redux + MUI theme + layout shell
    ...
```

---

## Prerequisites

- **Node.js**: ≥ 18.17 (recommended Node 20 LTS)  
- **npm** or **yarn** (examples use `npm`)  
- **Docker + Docker Compose** (recommended for running Postgres)  
- **Git**

---

## Quick Start (TL;DR)

This assumes you use Docker **only for Postgres**, and run backend & frontend locally.

```bash
# 1. Clone repo
git clone <this-repo-url> EventManager
cd EventManager

# 2. Start Postgres (via Docker)
docker compose up -d db

# 3. Backend: install deps, run migrations, seed, start
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
# Backend is now on http://localhost:3001

# 4. Frontend: install deps & start
cd ../frontend
npm install
# .env.local already points at http://localhost:3001/
npm run dev
# Frontend is now on http://localhost:3000
```

Then open: **http://localhost:3000** in your browser.

---

## Backend Setup (NestJS + Prisma)

### 1. Configure environment

Backend uses a `.env` file in `backend/` to configure the DB:

```env
# backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/event_manager?schema=public"
```

This assumes:

- Postgres is reachable at `localhost:5433`  
- Username: `postgres`  
- Password: `postgres`  
- Database name: `event_manager`  

If you run Postgres elsewhere, update `DATABASE_URL` accordingly.

> **Tip:** The provided `docker-compose.yml` starts a `db` service exposing port `5433` on the host.

### 2. Start Postgres

Using Docker (recommended):

```bash
cd EventManager
docker compose up -d db
```

Or use your own Postgres instance and create a database named `event_manager`.

### 3. Install dependencies

```bash
cd backend
npm install
```

### 4. Run Prisma migrations

Apply the existing migrations to create the `Event` table:

```bash
npx prisma migrate dev
# or for non-dev environments:
# npx prisma migrate deploy
```

You can also generate the Prisma client explicitly:

```bash
npx prisma generate
```

### 5. Seed the database (optional but recommended)

The seed script populates several sample events with categories and coordinates.

```bash
npm run seed
```

### 6. Start the backend

Development mode (watch):

```bash
npm run start:dev
```

The backend will listen on:

- **http://localhost:3001**

CORS is configured to allow **http://localhost:3000** (the Next.js dev server).

---

## Frontend Setup (Next.js)

### 1. Configure environment

The frontend uses `NEXT_PUBLIC_API_URL` to know where the backend lives.

`frontend/.env.local` (already present):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/
```

Change this if your backend runs elsewhere (e.g. Docker, different port, remote host).

### 2. Install dependencies

```bash
cd frontend
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

By default, Next.js runs on:

- **http://localhost:3000**

### 4. Production build (optional)

```bash
npm run build
npm start
```

---

## API Overview

Base URL (local dev):

```text
http://localhost:3001
```

### Event model

```ts
Event {
  id: string;
  title: string;
  description?: string | null;
  date: string;         // ISO datetime
  location: string;
  category: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
}
```

### Endpoints

#### `GET /events`

List events with optional filters & pagination.

**Query params:**

- `category?: string`  
- `dateFrom?: string` (ISO date)  
- `dateTo?: string` (ISO date)  
- `sortBy?: 'dateAsc' | 'dateDesc' | 'titleAsc' | 'titleDesc'`  
- `page?: number` (defaults to 1)  
- `limit?: number` (defaults to 10)  

**Response:**

```json
{
  "items": [ /* Event[] */ ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

#### `GET /events/:id`

Get a single event by ID.

- Returns **404** if not found.

#### `POST /events`

Create a new event.

**Body (CreateEventDto):**

```json
{
  "title": "React Conference Lviv",
  "description": "A meetup for React and front-end developers.",
  "date": "2025-12-31T18:00:00.000Z",
  "location": "Lviv, Ukraine",
  "category": "Tech",
  "latitude": 49.8397,
  "longitude": 24.0297
}
```

**Validation:**

- Required: `title`, `date`, `location`, `category`.  
- `date` must be a valid date string.  
- `latitude` / `longitude` must be numbers if provided.

#### `PUT /events/:id`

Update an existing event (partial update).

**Body (UpdateEventDto):** same fields as `CreateEventDto`, all optional.

- Returns **404** if event does not exist.

#### `DELETE /events/:id`

Delete an event.

- Returns **404** if event does not exist.

#### `GET /events/:id/recommendations`

Get recommended events similar to the event with given `id`.

**Query params:**

- `limit?: number` (defaults to 5)

**Response:**

```json
[
  { "id": "...", "title": "...", /* Event */ },
  ...
]
```

---

## Frontend Pages & UX

### `/events` – Event List

- Fetches events from `GET /events`.
- Supports:
  - Sorting (date/title, asc/desc).
  - Category filter (Tech, Music, Sport, All).
- Shows:
  - Event title.
  - Human-readable date/time.
  - Location and category.
  - Short, truncated description.
- Cards link to the event details page.

### `/events/new` – Create Event

- Uses shared `<EventForm />`.
- Required fields: `title`, `date`, `location`, `category`.
- Optional: `description`, `latitude`, `longitude`.
- On success → redirects to `/events`.

### `/events/[id]` – Event Details

- Shows all fields of the event.

**Actions:**

- **Edit** → `/events/[id]/edit`  
- **Delete** with confirmation dialog.

**“Similar events” section:**

- Uses `GET /events/:id/recommendations`.
- Renders recommended events as cards.

### `/events/[id]/edit` – Edit Event

- Pre-populates form with existing event data.
- On submit, calls `PUT /events/:id`.
- On success → redirects back to `/events/[id]`.

### `/events/map` – Map View

- Dynamically imports a client-only `EventsMap` component.
- Fetches up to 100 events, reusing the same category filter as the list.

**Map behavior:**

- Attempts browser geolocation (if allowed):
  - Adds a “You are here” marker.
  - Centers map on user location.
- If no permission:
  - Centers on average position of events with coordinates.
- If still nothing:
  - Centers on Lviv as a sensible default.

**Event markers:**

- Popup shows title, date, location, category.
- Includes a “View” button linking to `/events/[id]`.

---

## Recommendation Algorithm

The recommendation logic lives in the backend `EventsService.getRecommendations(id)`:

1. **Base event** – load event `E` by ID.  
2. **Candidate pool** – events where:
   - Category matches `E`, **OR**
   - Date is within ±7 days of `E`, **OR**
   - Location contains the same city substring as `E` (based on text before the first comma).
3. **Scoring:**
   - `+3` if same category.
   - `+0..2` based on date proximity (closer dates → higher score).
   - `+2` if location text contains the base city (case-insensitive).
4. **Sorting:**
   - Sort candidates by score descending.
   - Return top `N` (default 5).

The frontend uses a dedicated RTK Query endpoint to display these in the event details page.

---

## Development & Useful Scripts

### Backend

From `backend/`:

**Start dev server (watch mode):**

```bash
npm run start:dev
```

**Run tests:**

```bash
npm test         # unit tests
npm run test:e2e # e2e tests (uses Nest default setup)
```

**Lint & format:**

```bash
npm run lint
npm run format
```

**Prisma & DB:**

```bash
npx prisma migrate dev
npx prisma studio      # optional: web UI for DB
npm run seed           # run seed script
```

### Frontend

From `frontend/`:

**Dev server:**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

**Lint:**

```bash
npm run lint
```

---

## Troubleshooting

### 1. Backend cannot connect to database

Error like: `P1001: Can't reach database server at ...`

Check:

- Is Postgres running? (`docker compose ps`, `docker ps`)  
- Does `backend/.env` point to the correct host/port?  
- Are ports matching? (Docker compose exposes **5433**).

### 2. Frontend API requests fail (CORS / Network error)

Check the browser console and Network tab.

Verify:

- `frontend/.env.local` → `NEXT_PUBLIC_API_URL` matches backend URL (e.g. `http://localhost:3001/`).  
- Backend is running and reachable.  
- Backend CORS is set to allow `http://localhost:3000` (default config already does this).

### 3. Map view is blank or errors in console

- Leaflet requires client-side rendering.
  - The map page uses `dynamic(..., { ssr: false })`, so make sure JS is enabled.
- Geolocation:
  - If you block location access, the map will fall back to centering on events or Lviv.
  - Some browsers require HTTPS for geolocation.

### 4. Ports already in use

If port `3000` or `3001` is taken:

- Adjust Next.js dev port:

  ```bash
  npm run dev -- -p 3002
  ```

- Or adjust backend port in `src/main.ts` and update `NEXT_PUBLIC_API_URL` accordingly.

---

Happy hacking! 🎉
