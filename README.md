# Standup

**Async daily standups, capped at 60 seconds.** Write what you shipped, what's next, and what's blocked — then get back to work. No calls. No threads. No video.

---

## 🌐 Live URLs

- **Frontend App (Vercel):** [https://standup-async.vercel.app](https://standup-async.vercel.app)
- **Backend API (Render):** [https://standup-async-backend.onrender.com](https://standup-async-backend.onrender.com)
- **API Health Check:** [https://standup-async-backend.onrender.com/api/health](https://standup-async-backend.onrender.com/api/health)
- **Waitlist Count Endpoint:** [https://standup-async-backend.onrender.com/api/waitlist/count](https://standup-async-backend.onrender.com/api/waitlist/count)

> **Note on Render Free Tier:** The backend spins down after ~15 minutes of inactivity. The first request after idle takes **30–50 seconds** to cold-start.

---

## 🚀 API Documentation

Base URL: `https://standup-async-backend.onrender.com`

### 1. Root Status
* **Endpoint:** `GET /`
* **Description:** Returns API status and overview of available endpoints.
* **Response (200 OK):**
```json
{
  "name": "Standup Async Waitlist API",
  "status": "online",
  "endpoints": {
    "health": "/api/health",
    "waitlist_count": "/api/waitlist/count",
    "join_waitlist": "POST /api/waitlist"
  }
}
```

### 2. Health Check
* **Endpoint:** `GET /api/health`
* **Description:** Used by monitoring tools and Render to verify service health.
* **Response (200 OK):**
```json
{
  "status": "ok"
}
```

### 3. Get Waitlist Count
* **Endpoint:** `GET /api/waitlist/count`
* **Description:** Fetches total number of waitlist signups.
* **Response (200 OK):**
```json
{
  "count": 4
}
```

### 4. Join Waitlist
* **Endpoint:** `POST /api/waitlist`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "email": "user@example.com"
}
```
* **Success Response (201 Created):**
```json
{
  "message": "You're on the list"
}
```
* **Already Subscribed Response (200 OK):**
```json
{
  "message": "You've already joined"
}
```
* **Validation Error (400 Bad Request):**
```json
{
  "error": "Please enter a valid email address"
}
```

---

## 💻 Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas free tier](https://www.mongodb.com/atlas))

### 1. Clone and install

```bash
git clone <your-repo-url> standup
cd standup

# Server
cd server
npm install
cp .env.example .env
# Edit .env → add your MONGO_URI

# Client
cd ../client
npm install
cp .env.example .env
# Edit .env → set VITE_API_URL=http://localhost:5000 (or your deployed backend URL)
```

### 2. Start the server

```bash
cd server
npm run dev
```

Server starts on `http://localhost:5000` after connecting to MongoDB.

### 3. Start the client

```bash
cd client
npm run dev
```

Client starts on `http://localhost:5173` (Vite default).

---

## ☁️ Deployment

### Client → Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Set the environment variable:
   - `VITE_API_URL` = `https://standup-async-backend.onrender.com`
5. Deploy.

### Server → Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `PORT` = `5000`
6. Deploy.

### Database → MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write permissions.
3. Whitelist `0.0.0.0/0` for access from Render.
4. Copy the connection string into your server's `MONGO_URI` env var.

---

## 📁 Project Structure

```
standup/
├── client/          # React + Vite + Tailwind landing page
│   └── src/
│       ├── components/   # Hero, ProductBoard, HonestySection, WaitlistForm, DarkModeToggle, Footer
│       └── hooks/        # useKonamiCode (easter egg), useCountUp (scroll animation)
├── server/          # Express + Mongoose waitlist API
│   ├── models/      # Waitlist schema
│   └── routes/      # POST /api/waitlist, GET /api/waitlist/count
├── CHECKLIST.md     # Manual verification checklist
└── DECISIONS-template.md  # Assessment write-up skeleton
```

---

## 🛠️ Tech Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React 19, Vite 6, Tailwind CSS 3 |
| Backend  | Express, Mongoose           |
| Database | MongoDB                     |
| Extras   | Framer Motion, @dnd-kit     |
