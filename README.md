# 🏠 RoomSync — Find Your Ideal Roommate

RoomSync is a smart roommate-finding platform that matches you based on **life intent**, lifestyle compatibility, and personality — not just budget. It predicts conflicts before you move in and explains why a match works.

---

## ✨ Features

- **🎯 Intent Alignment**: Matches based on life mode (growth/chill/balanced), life goals, and energy levels
- **⚡ Conflict Prediction**: Identifies potential friction points before you commit
- **💡 Explainable Matching**: Every score comes with human-readable reasons
- **🔐 Dealbreaker System**: Hard filters (no smokers, gender preference, budget limits)
- **🏆 Match Tier System**: Perfect → Great → Good → Fair → Poor
- **🌙 Dark Mode**: Fully responsive dark theme with persistence
- **📱 Mobile-First**: Responsive design from 320px to 1440px+
- **🔑 Authentication**: JWT-based signup/login with password reset

---

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS (with dark mode)
- Framer Motion (animations)
- Zustand (state management)
- React Router v6
- Axios
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (jsonwebtoken)
- bcryptjs (password hashing)
- compression + express-rate-limit

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:5000`.

---

## 🔧 Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/roommate_platform
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register with name, email, password |
| POST | `/api/auth/login` | Login, returns JWT token |
| POST | `/api/auth/forgot-password` | Generate password reset token |
| POST | `/api/auth/reset-password/:token` | Reset password with token |
| GET | `/api/auth/me` | Get current user (requires token) |
| POST | `/api/auth/logout` | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user profile |
| PUT | `/api/users/:id` | Update user profile |
| DELETE | `/api/users/:id` | Delete user |

### Rooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | List all rooms |
| GET | `/api/rooms/:id` | Get room by ID |
| POST | `/api/rooms` | Create room listing |
| PUT | `/api/rooms/:id` | Update room |
| DELETE | `/api/rooms/:id` | Delete room |

### Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/match` | Find matches for a user (body: `{ userId }`) |
| POST | `/api/recommendations/:userId` | Get room & user recommendations |

### Utilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

---

## 🧠 How the Matching Algorithm Works

The algorithm scores compatibility across 7 dimensions:

| Factor | Weight | Description |
|--------|--------|-------------|
| Life Intent Alignment | 25% | Life mode, goals, energy, struggle/stability scale |
| Lifestyle Compatibility | 25% | Sleep, cleanliness, smoking, drinking, guests, noise |
| Social Compatibility | 20% | Introvert/extrovert + guests + noise combined metric |
| Budget Overlap | 15% | Overlap of budget ranges |
| Location Match | 10% | Same city > same state > different |
| Move-in Timing | 5% | Proximity of desired move-in dates |
| Hobby Compatibility | display | Category-based partial matching |

### Dealbreaker System (Hard Filters)
Before scoring, candidates are filtered out if they violate any dealbreaker:
- Smoker when seeker requires no smokers
- Zero budget overlap
- Gender preference mismatch
- Candidate budget exceeds max budget setting
- Different city when same city required

### Match Tiers
- 🏆 **Perfect Match** (85-100): Ideal roommate
- ✅ **Great Match** (70-84): Strong compatibility
- 🟡 **Good Match** (50-69): Works with adjustments
- 🟠 **Fair Match** (30-49): Significant differences
- 🔴 **Poor Match** (0-29): Not recommended

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend && npm run build
# Deploy the `dist` folder
```

### Backend (Railway/Render/Heroku)
```bash
cd backend && npm start
```

Set environment variables on your hosting platform as per `.env.example`.

---

## 📸 Screenshots

*(Add screenshots of the app here)*

---

## 📄 License

MIT
