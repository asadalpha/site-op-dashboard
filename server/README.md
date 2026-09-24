# Site Operations API

Layered Express REST API for sites, installations, and dashboard metrics.

## Setup

```bash
copy .env.example .env
npm install
```

For local development, copy `.env.example` to `.env` and use your local PostgreSQL connection. For production, configure the variables from `.env.production.example` in the hosting provider and use the Neon connection string with `?sslmode=require`.

```bash
npm run dev
```

Or use the database scripts from the project root:

```bash
npm run migrate
npm run seed
```

Example production configuration:

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-NEON-HOST/DBNAME?sslmode=require
CLIENT_URL=https://your-frontend-domain
```

The server detects Neon hosts and enables PostgreSQL SSL automatically. Do not commit the real connection string.

Endpoints:

- `GET/POST/PUT/DELETE /api/sites`
- `GET/POST/PUT/DELETE /api/installations`
- `GET /api/dashboard/summary`
- `GET /api/health`

The API returns `{ data: ... }` for successful JSON responses and `{ error: ... }` for failures.
