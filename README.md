# Doraemon Movies Wiki

**Bách khoa phim điện ảnh Doraemon** — Glassmorphism Dark UI · Node.js REST API · SQLite · Session Auth.

> Fan-made project · Không có bản quyền thương mại

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, Vanilla CSS, Vanilla JS (modular) |
| Backend | Node.js 20+, Express 4 |
| Database | SQLite (`better-sqlite3`) |
| Auth | express-session + bcrypt + RBAC |
| Logging | pino + request IDs |

---

## Project Structure

```
Wiki/
├── frontend/                  # Static HTML/CSS/JS
│   ├── index.html             # Home — featured movies
│   ├── movies.html            # Full catalog
│   ├── detail.html            # Movie detail + comments
│   ├── favorites.html         # User favorites (localStorage)
│   ├── login.html / register.html
│   └── assets/js/             # Modular frontend
│       ├── api.js             # HTTP client (credentials: include)
│       ├── auth.js, comments.js, editor.js
│       └── pages/             # Per-page init scripts
├── backend-node/
│   ├── src/
│   │   ├── server.js          # Express entry point
│   │   ├── config/            # Environment config
│   │   ├── db/                # SQLite, migrations, seeds
│   │   ├── repositories/      # Data access layer
│   │   ├── services/          # Business logic
│   │   ├── routes/            # HTTP handlers
│   │   ├── middleware/        # Auth, rate limit, request ID
│   │   └── scripts/           # bootstrap-admin.js
│   ├── data/                  # SQLite files (gitignored)
│   └── tests/                 # Integration tests
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm

No PostgreSQL or external database required.

### 1. Install

```bash
cd backend-node
npm install
cp .env.example .env   # optional — defaults work for dev
```

### 2. Initialize database

```bash
npm run db:init        # migrate + seed 43 movies
npm run db:bootstrap   # create first admin account (interactive)
```

### 3. Run

```bash
npm run dev
```

Open **http://localhost:3000**

---

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Production start |
| `npm run db:init` | Run migrations + seed |
| `npm run db:seed` | Re-seed movie data |
| `npm run db:migrate` | Run pending migrations only |
| `npm run db:bootstrap` | Create admin/editor account |
| `npm test` | Integration tests |
| `npm run lint` | Syntax check |

---

## Environment Variables

See `backend-node/.env.example`:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` / `production` / `test` |
| `PORT` | Server port (default 3000) |
| `DATABASE_PATH` | SQLite file path |
| `SESSION_SECRET` | **Required in production** (min 32 chars) |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `LOG_LEVEL` | pino log level |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/movies` | — | List all movies |
| GET | `/api/movies?featured=true` | — | Featured movies |
| GET | `/api/movies?page=1&limit=20` | — | Paginated list |
| GET | `/api/movies?q=keyword` | — | Search |
| GET | `/api/movies/:id` | — | Movie detail |
| PATCH | `/api/movies/:id/update` | Editor+ | Update trailer/wiki/streaming |
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/auth/me` | — | Current user |
| GET | `/api/comments?movie_id=X` | — | List comments |
| POST | `/api/comments` | User | Create comment |
| DELETE | `/api/comments/:id` | Owner/Admin | Delete comment |
| POST | `/api/upload` | Editor+ | Upload poster |

---

## Database

### Schema

- **movies** — 43 theatrical films with plot, box_office, image_url
- **users** — accounts with roles: `user`, `editor`, `admin`
- **comments** — per-movie user comments

### Migrations

SQL files in `backend-node/src/db/migrations/` tracked by `schema_migrations` table.

### Backup & Restore

```bash
# Backup
cp backend-node/data/database.sqlite backup/database-$(date +%Y%m%d).sqlite

# Restore
cp backup/database-20240608.sqlite backend-node/data/database.sqlite
```

Also backup `data/sessions.sqlite` and `uploads/` if needed.

---

## Docker

```bash
export SESSION_SECRET="your_production_secret_at_least_32_characters_long"
docker compose up --build
```

App available at http://localhost:3000

---

## Security Features

- bcrypt password hashing (cost 12)
- Session regeneration on login
- Rate limiting on auth routes
- Helmet security headers
- HTTPS-only external URL validation
- Magic-byte upload validation
- Production cookie: `secure` + `sameSite: lax`
- Strong `SESSION_SECRET` enforced in production

---

## Architecture Notes

The backend uses a **repository → service → route** pattern. The `db/connection.js` adapter exposes a pg-compatible `query()` interface so SQLite can be swapped for PostgreSQL later by replacing the adapter implementation.

---

## License

Fan-made · Non-commercial · Doraemon © Fujiko Pro / Shogakukan / TV Asahi
# Wiki
