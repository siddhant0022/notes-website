# GCETNotes

A production-ready MERN notes-sharing platform for GCET students. Upload, browse, preview, and download academic resources with role-based access control and an admin moderation queue.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Zustand, React Query, react-pdf |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | JWT (HttpOnly cookies + Bearer header), RBAC (`Student`, `Admin`) |

## Directory Structure

```
GcetNotes/
├── client/                          # React frontend (Vite)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance + global error interceptor
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx    # Shell with ambient depth layers
│   │   │   │   ├── Navbar.jsx       # Responsive nav with glassmorphism
│   │   │   │   └── ThemeToggle.jsx  # Dark/light mode switcher
│   │   │   ├── pdf/
│   │   │   │   └── PdfViewer.jsx    # Custom PDF viewer (zoom, nav, fullscreen)
│   │   │   ├── resources/
│   │   │   │   └── ResourceCard.jsx # Bento grid resource cards
│   │   │   └── ui/
│   │   │       ├── ErrorBoundary.jsx
│   │   │       └── Skeleton.jsx     # Loading skeletons
│   │   ├── pages/
│   │   │   └── HomePage.jsx         # Browse + viewer demo
│   │   ├── store/
│   │   │   └── index.js             # Zustand (theme, auth, filters)
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind + glass utilities
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection
│   │   ├── controllers/             # Route handlers (extend here)
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT validation + RBAC
│   │   │   └── errorHandler.js      # Centralized error responses
│   │   ├── models/
│   │   │   ├── User.js              # User schema (Student/Admin)
│   │   │   ├── Resource.js          # Resource schema + moderation
│   │   │   └── Subject.js           # Subject/branch/semester schema
│   │   ├── routes/                  # API route definitions (extend here)
│   │   ├── utils/
│   │   │   ├── AppError.js          # Custom error class
│   │   │   ├── asyncHandler.js      # Async route wrapper
│   │   │   └── jwt.js               # Token sign/verify/cookie helpers
│   │   └── index.js                 # Express app bootstrap
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a Atlas URI

### Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Error Format

All errors follow a standardized shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Please provide a valid email" }]
}
```

## Design System

- **Dark mode (default):** `#030712` pitch black, `#0b1329` navy, `#3b82f6` accent glow
- **Light mode:** `#f8fafc` / `#f1f5f9` surfaces, `#0f172a` navy text
- **Glass:** `backdrop-blur-md`, `bg-white/5`, `border-white/10`
- **Typography:** Syne (display) + DM Sans (body)

## License

MIT
