# Snapmart — Week 3 Project Scaffold

This is Week 3 deliverable: project setup and structure1 only.

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



