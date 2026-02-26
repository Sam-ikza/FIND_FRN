# Copilot Instructions for RoomSync

## Project Overview

RoomSync is a smart roommate-finding platform that matches users based on life intent, lifestyle compatibility, and personality. It uses a scoring algorithm with explainable results and conflict prediction.

## Repository Structure

```
FIND_FRN/
├── backend/          # Node.js + Express REST API
│   ├── config/       # Database and app configuration
│   ├── middleware/   # Auth and other Express middleware
│   ├── models/       # Mongoose schemas (User, Room, etc.)
│   ├── routes/       # Express route handlers
│   ├── services/     # Business logic (matching algorithm, etc.)
│   ├── server.js     # Entry point
│   └── seed.js       # Database seeding script
└── frontend/         # React 18 + TypeScript SPA
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Route-level page components
    │   ├── store/       # Zustand state management
    │   ├── types/       # TypeScript type definitions
    │   └── utils/       # Utility functions
    └── index.html
```

## Tech Stack

### Frontend
- **React 18** with **TypeScript** (strict mode)
- **Vite** for bundling
- **Tailwind CSS** with dark mode (`class` strategy)
- **Framer Motion** for animations
- **Zustand** for global state management
- **React Router v6** for routing
- **Axios** for HTTP requests
- **React Hot Toast** for notifications

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT** authentication (jsonwebtoken)
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **express-rate-limit** for rate limiting

## Development Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Fill in MONGO_URI, JWT_SECRET, etc.
npm run dev            # Starts with nodemon on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # Starts Vite dev server on port 5173
```

### Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/roommate_platform
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

## Build & Lint

```bash
# Frontend — type-check and build
cd frontend && npm run build    # runs tsc then vite build

# Backend — no separate build step (plain Node.js)
cd backend && npm start
```

There is currently no automated test suite. Manual API testing against `http://localhost:5000` and UI testing against `http://localhost:5173` are the primary verification methods.

## Coding Conventions

### TypeScript (Frontend)
- Use TypeScript for all new frontend files (`.tsx` / `.ts`).
- Define shared types/interfaces in `frontend/src/types/`.
- Prefer functional components with React hooks.
- Use Zustand stores (in `frontend/src/store/`) for cross-component state; keep component-local state with `useState`.

### JavaScript (Backend)
- CommonJS modules (`require` / `module.exports`).
- Validate all user input in routes using `express-validator`.
- Always authenticate protected routes with the `authMiddleware`.
- Keep business logic (e.g., matching algorithm) in `backend/services/`, not in route handlers.

### Styling
- Use Tailwind utility classes directly in JSX.
- Support both light and dark modes; use `dark:` variants.
- Follow mobile-first responsive design (smallest breakpoint first).

### API Design
- Base path: `/api`
- Respond with `{ success: true, data: ... }` on success and `{ success: false, message: '...' }` on error.
- Use appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500).

## Matching Algorithm

Located in `backend/services/`. Scores compatibility across 7 dimensions (see README for weights). Key rules:
- Apply **dealbreaker hard-filters first** before computing scores.
- Return `matchScore` (0–100), `matchTier`, `reasons[]`, and `conflicts[]` for every result.
- Do not alter weight constants without updating the README table.
