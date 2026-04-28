# Campus Connect (CampusTales)

A full-stack web application where students can share and read interview experiences, helping peers prepare for campus placements.

## 🏗️ Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS      |
| Backend  | Node.js, Express 5, Mongoose      |
| Database | MongoDB (Atlas or local)          |
| DevOps   | Docker, Docker Compose, Nginx     |
| CI/CD    | GitHub Actions                    |

## 📁 Project Structure

```
Campus_Tales/
├── backend/
│   ├── config/          # DB connection, questions config
│   ├── controllers/     # Auth, Experience, Admin controllers
│   ├── middleware/       # Auth, validation, rate limiting, error handler
│   ├── models/           # User, Experience Mongoose models
│   ├── routes/           # Auth, Experience, Admin route definitions
│   ├── server.js         # Express app entry point
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api.js        # Centralized Axios instance (baseURL from env)
│   │   ├── components/   # AuthCard, Header, Footer
│   │   ├── pages/        # Login, Register, Dashboard, Profile, etc.
│   │   └── App.jsx       # React Router with auth guards
│   ├── nginx.conf        # Nginx config with API proxy
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Docker & Docker Compose (for containerized deployment)

### Local Development

#### Backend

```bash
cd backend
cp .env.example .env        # Edit with your MongoDB URI and secrets
npm install
npm run dev                  # Starts with --watch for auto-reload
```

#### Frontend

```bash
cd frontend
cp .env.example .env        # Edit VITE_API_URL if backend is not on localhost:5000
npm install
npm run dev                  # Starts Vite dev server on http://localhost:5173
```

### Docker Deployment

```bash
# Build and start all services (MongoDB, Backend, Frontend)
docker compose up --build -d

# Frontend: http://localhost:80
# Backend:  http://localhost:5000
# MongoDB:  localhost:27017
```

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable      | Description                          | Example                       |
| ------------- | ------------------------------------ | ----------------------------- |
| `PORT`        | Server port                          | `5000`                        |
| `MONGO_URI`   | MongoDB connection string            | `mongodb+srv://...`           |
| `JWT_SECRET`  | Secret key for JWT signing           | `my-super-secret-key`         |
| `ADMIN_EMAIL` | Email auto-assigned admin role       | `admin@example.com`           |
| `NODE_ENV`    | Environment mode                     | `development` / `production`  |
| `CORS_ORIGIN` | Comma-separated allowed origins      | `http://localhost:5173`       |

### Frontend (`frontend/.env`)

| Variable       | Description               | Example                        |
| -------------- | ------------------------- | ------------------------------ |
| `VITE_API_URL` | Backend API base URL      | `http://localhost:5000/api`    |

## 🔐 Security Features

- **JWT Authentication** — Token-based auth with role-based access (student/admin)
- **Helmet** — HTTP security headers
- **CORS Whitelist** — Only allowed origins can access the API
- **Rate Limiting** — Auth routes limited to 20 req/15min, API routes to 100 req/15min
- **Input Validation** — Server-side validation via express-validator
- **Centralized Error Handler** — No stack traces leaked in production
- **Non-root Docker User** — Backend container runs as unprivileged user

## 🧪 Testing

```bash
# Backend syntax check (requires MongoDB)
cd backend && node -e "require('./server.js')"

# Frontend build check
cd frontend && npm run build

# Docker build check
docker compose build
```

## 📝 License

ISC
