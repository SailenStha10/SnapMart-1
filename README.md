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
cp .env.sample .env
# If port 5000 is in use on macOS, the API falls back to the configured PORT
# in `.env` (default PORT=5002).
# Update `MONGODB_URI` and `JWT_SECRET` in `.env` before starting.
npm run dev
```



