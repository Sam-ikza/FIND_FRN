# 🪺 NestBud

**Find your bud, find your nest.**

NestBud is an intelligent roommate-matching platform that goes beyond budget filters — matching people by life intent, lifestyle, and personality, with built-in conflict prediction and explainable scores.

## ✨ Features

- **🎯 Smart Matching** — Matches based on life intent, lifestyle, budget, location, and cultural compatibility
- **⚡ Conflict Prediction** — Simulates daily friction before you commit to living together
- **💡 Explainable Scores** — Every match comes with human-readable reasons
- **🗺️ Map View** — Browse available rooms on an interactive map
- **📷 Image Uploads** — Upload room photos via Cloudinary
- **❤️ Save Matches** — Bookmark your favorite roommate matches
- **💬 Real-Time Chat** — Socket.IO powered messaging between users
- **🔔 Notifications** — In-app notification bell for match requests, messages, etc.
- **📊 Dashboard** — Personal stats, saved matches, and your posted rooms
- **📱 PWA Support** — Installable as a Progressive Web App
- **📖 Swagger Docs** — Full API documentation at `/api/docs`
- **🔐 Dealbreaker System** — Hard filters for smokers, gender preference, budget

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite + Tailwind CSS
- Framer Motion
- Zustand (state management)
- React Router v6
- React Leaflet (map view)
- Embla Carousel (image gallery)
- Recharts (charts & radar)
- Socket.IO Client
- PWA via vite-plugin-pwa

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO (real-time chat)
- Multer + Cloudinary (image uploads)
- JWT Authentication
- Swagger / OpenAPI docs
- Rate limiting + compression

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) Cloudinary account for image uploads

### Installation

```bash
# Install all dependencies
npm run install:all

# Or separately:
cd backend && npm install
cd frontend && npm install
```

### Configuration

Copy and configure environment files:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nestbud
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Seed Data

```bash
npm run seed
# or: cd backend && node seed.js
```

### Development

```bash
# Run both frontend and backend
npm run dev

# Or separately:
cd backend && npm start        # http://localhost:5000
cd frontend && npm run dev     # http://localhost:3000
```

### API Documentation

Once the backend is running, visit: `http://localhost:5000/api/docs`

## 📁 Project Structure

```
nestbud/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── swagger.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── rooms.js
│   │   ├── match.js
│   │   ├── messages.js
│   │   ├── notifications.js
│   │   └── upload.js
│   ├── services/
│   │   ├── chat.js
│   │   ├── matching.js
│   │   └── explanation.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── MatchRadarChart.tsx
│   │   │   ├── RoomCard.tsx
│   │   │   ├── RoomForm.tsx
│   │   │   ├── RoomMap.tsx
│   │   │   ├── RoomFilters.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   └── NotificationBell.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── RoomsPage.tsx
│   │   │   ├── RoomDetailPage.tsx
│   │   │   ├── MatchPage.tsx
│   │   │   ├── SavedMatchesPage.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ...
│   │   ├── store/
│   │   ├── utils/
│   │   └── types/
│   └── index.html
├── Procfile
└── package.json
```

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/rooms` | List rooms (with filters) |
| GET | `/api/rooms/map` | Rooms with coordinates |
| POST | `/api/rooms` | Create room |
| POST | `/api/match` | Find roommate matches |
| POST | `/api/upload` | Upload image |
| GET | `/api/messages/:roomId` | Get chat messages |
| GET | `/api/notifications/:userId` | Get notifications |
| POST | `/api/users/:id/save-match` | Save a match |
| GET | `/api/docs` | Swagger UI |

## 🌐 Deployment

The app is configured for Heroku-style deployment via `Procfile`.

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📄 License

MIT © 2026 NestBud
