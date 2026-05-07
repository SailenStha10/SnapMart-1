# Monorepo Refactor Notes

This document explains the move from `frontend/` + `backend/` to a monorepo layout with `client/` and `api/`.

- `api/` contains an Express API under `src/` and `config/` for environment config.
- `client/` contains the Vite React app.
- The dev server in `client` proxies `/api` to `http://localhost:5000`.
- Backend entry is `api/src/server.js` and runs with `npm run dev` inside `api`.

If you want, I can now delete the old `frontend/` and `backend/` folders. I left them intact for safety.
