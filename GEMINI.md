# GEMINI.md - Campus Connect (CampusTales)

## Project Overview
**Campus Connect** is a full-stack platform for sharing and exploring campus interview experiences. It employs a modern micro-services architecture containerized with Docker, featuring a React-based frontend and a Node.js/Express backend with MongoDB as the data store.

### Key Technologies
- **Frontend:** React 19, Vite, Tailwind CSS 4, Axios, React Router 7.
- **Backend:** Node.js, Express 5, Mongoose (MongoDB), JWT, Express-Validator, Helmet, Morgan.
- **DevOps:** Docker, Docker Compose, GitHub Actions (CI/CD), Nginx (for production frontend).

---

## 🏗️ Architecture & Component Logic

### Backend (`/backend`)
- **Entry Point:** `server.js` initializes Express, connects to MongoDB via `config/db.js`, and sets up global middleware.
- **Middleware:**
    - `authMiddleware.js`: Validates JWT tokens and checks user roles (Student/Admin).
    - `errorHandler.js`: Centralized error handling for consistent API responses.
    - `rateLimiter.js`: Protects against brute-force (Auth) and DoS (API) attacks.
    - `validate.js`: Request body validation using `express-validator`.
- **Models:**
    - `User.js`: Schema for users (Student/Admin roles).
    - `Experience.js`: Schema for interview stories, including company, role, rounds, and difficulty.
- **Health Check:** `GET /health` returns status and timestamp.

### Frontend (`/frontend`)
- **Entry Point:** `main.jsx` and `App.jsx`.
- **API Communication:** `src/api.js` provides a centralized Axios instance that automatically attaches JWT tokens from `localStorage` and handles `401 Unauthorized` redirects.
- **Styling:** Uses Tailwind CSS 4 via `@tailwindcss/vite` plugin.
- **Routing:** Managed by `react-router-dom` with role-based route guards.

---

## 🚀 Building and Running

### Prerequisites
- Node.js 20+
- MongoDB (Local or Atlas)
- Docker & Docker Compose (optional)

### Local Development

#### 1. Backend
```bash
cd backend
cp .env.example .env  # Configure MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev           # Runs with --watch (Node.js 20+)
```

#### 2. Frontend
```bash
cd frontend
cp .env.example .env  # Configure VITE_API_URL
npm install
npm run dev           # Starts Vite server
```

### Docker Deployment
Builds and runs the entire stack (including Nginx for the frontend in production modes):
```bash
docker compose up --build
```

---

## 🛠️ Development Conventions

### Coding Style & Standards
- **Naming:** CamelCase for variables and functions; PascalCase for React components and Mongoose models.
- **Security:**
    - Always use `authMiddleware.protect` for routes requiring authentication.
    - Always use `authMiddleware.admin` for routes restricted to admins.
    - Validate inputs using `validate.js` logic in route definitions.
- **API Responses:** Use the centralized `errorHandler` for consistency. Successful responses should ideally follow a standard JSON structure.
- **Frontend State:** Use `localStorage` for JWT persistence.

### Project Structure Conventions
- **Controllers:** House the business logic for each route.
- **Routes:** Define endpoint paths and attach necessary middleware (auth, validation).
- **Components:** Modular UI elements.
- **Pages:** Top-level React components representing application routes.

---

## 📋 TODOs / Planned Improvements
- [ ] Add unit and integration tests (current `npm test` is a placeholder).
- [ ] Implement Refresh Token logic for enhanced security.
- [ ] Add Image upload support for user profiles or experience attachments.
- [ ] Enhance Admin Dashboard with more analytics.
