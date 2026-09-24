# Site Operations Dashboard

Full-stack site operations dashboard using React, Vite, Node.js, Express, and PostgreSQL.

## Project structure

- `client/` — React + Vite frontend
- `server/` — Node.js + Express REST API

## Run locally

Install dependencies:

```bash
npm install --prefix client
npm install --prefix server
```

Copy `server/.env.example` to `server/.env` for local development. This file uses local PostgreSQL. Apply the SQL files in `server/migrations/` in order, then start the applications in separate terminals:

```bash
npm run dev:server
npm run dev:client
```

Database commands:

```bash
npm run migrate
npm run seed
```

For production, configure these environment variables in the hosting provider rather than committing `.env` files. Use `server/.env.production.example` as the template:

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-NEON-HOST/DBNAME?sslmode=require
CLIENT_URL=https://your-frontend-domain
```

Neon connections use SSL automatically when the hostname ends in `.neon.tech`. Local PostgreSQL connections continue to work without SSL in development.

Quality checks:

```bash
npm run build
npm test
```

## Docker

Start a PostgreSQL instance outside Compose, then build and run the API and frontend containers:

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@host.docker.internal:5432/site_operations \
  docker compose up --build
```

The API runs on `http://localhost:5000` and the containerized frontend runs on `http://localhost:8080`. Set `DATABASE_URL` in the shell or an ignored root `.env` file before starting Compose. Set `VITE_API_URL` only if the frontend must reach the API at a different host.

For Azure, deploy the `server/` image to App Service and deploy `client/` to Azure Static Web Apps. Pass `VITE_API_URL` as the client image build argument or use the Static Web Apps build configuration. Store the database connection string in App Service application settings, not in the image or repository.

The API is available at `http://localhost:5000` and the frontend at `http://localhost:5173`.

Health check: `GET http://localhost:5000/api/health`
