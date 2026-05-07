# Snapmart — Week 3 Project Scaffold

Professional MERN starter scaffold for Snapmart. This is Week 3 deliverable: project setup and architecture only.

Structure overview and team responsibilities are listed below.

Run client (frontend):

```bash
cd client
npm install
npm run dev
```

Run api (backend):

```bash
cd api
npm install
cp ../backend/.env.sample .env || cp .env.sample .env
# If port 5000 is in use on macOS, servers are configured to fall back
# to safer defaults. You can override ports by editing `.env` files:
# - `backend/.env` (default PORT=5001)
# - `api/.env` (default PORT=5002)
# update `.env` if needed (MONGODB_URI)
npm run dev
```

Team member responsibilities:
- Member 1: Frontend Project Setup (frontend folder, Vite, Tailwind)
- Member 2: Components Structure (components folders + placeholders)
- Member 3: Pages Structure (pages folder + placeholders)
- Member 4: Routing Structure (AppRoutes, MainLayout)
- Member 5: Backend Server Setup (server.js, middleware)
- Member 6: Database + Config Setup (config/db.js, .env.sample)
- Member 7: API Architecture (routes & controllers)
- Member 8: Models + Documentation (models + README + docs)

API plan and folder structure inside `docs/`.
