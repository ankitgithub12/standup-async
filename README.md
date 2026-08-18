# Standup

**Async daily standups, capped at 60 seconds.** Write what you shipped, what's next, and what's blocked — then get back to work. No calls. No threads. No video.

---

## Local Setup

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
# Edit .env → set VITE_API_URL=http://localhost:5000
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

## Deployment

### Client → Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Set the environment variable:
   - `VITE_API_URL` = your deployed server URL (e.g. `https://standup-api.onrender.com`)
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

> **Note on Render free tier:** The server spins down after ~15 minutes of inactivity. First request after idle takes **30–50 seconds** to cold-start. This is expected and not a bug.

### Database → MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write permissions.
3. Whitelist `0.0.0.0/0` for access from Render (or add Render's static IPs).
4. Copy the connection string into your server's `MONGO_URI` env var.

---

## Project Structure

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

## Tech Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React 19, Vite 6, Tailwind CSS 3 |
| Backend  | Express, Mongoose           |
| Database | MongoDB                     |
| Extras   | Framer Motion, @dnd-kit     |
