# 📚 Lihq'et Bookstore

A professionally architected full-stack bookstore management system built for the **Software Architecture and Design** course. Features a modern React frontend, a layered Node.js backend (MVC + Service Layer), MySQL persistence, and production-ready Docker/CI-CD infrastructure.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP
┌────────────────────────────▼────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│  Components: Navbar │ Dashboard │ BookForm │ BookList            │
│  Config:     config.js (API_BASE_URL)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ /api/*
┌────────────────────────────▼────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                    │
│                                                                  │
│  ┌──────────┐   ┌──────────────┐   ┌──────────┐   ┌─────────┐  │
│  │  Routes   │──▶│ Controllers  │──▶│ Services │──▶│ Models  │  │
│  └──────────┘   └──────────────┘   └──────────┘   └────┬────┘  │
│                                                         │       │
│  Middleware: CORS │ Validation │ Error Handling          │       │
└─────────────────────────────────────────────────────────┼───────┘
                                                          │ SQL
┌─────────────────────────────────────────────────────────▼───────┐
│                      DATABASE (MySQL 8.0)                        │
│  Table: books (id, title, author, price, stock, created_at)     │
└─────────────────────────────────────────────────────────────────┘
```

### Design Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| **MVC** | `backend/` | Separates routes, controllers, and models |
| **Service Layer** | `backend/services/` | Isolates business logic from HTTP transport |
| **Repository** | `backend/models/` | Encapsulates all SQL/database access |
| **Middleware Pipeline** | `backend/middleware/` | Cross-cutting concerns (validation, errors) |
| **Component-Based UI** | `frontend/src/components/` | Reusable, self-contained React components |

---

## 📁 Project Structure

```
lihqet-bookstore/
├── backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool + retry logic
│   ├── controllers/
│   │   └── bookController.js      # HTTP request handlers
│   ├── middleware/
│   │   ├── errorMiddleware.js     # Centralized error handling
│   │   └── validationMiddleware.js # Request validation
│   ├── models/
│   │   ├── bookModel.js           # Data access layer (SQL queries)
│   │   └── bookModel.sql          # Database schema (Docker init script)
│   ├── routes/
│   │   └── books.js               # API route definitions
│   ├── services/
│   │   └── bookService.js         # Business logic layer
│   ├── Dockerfile                 # Standalone backend image
│   └── server.js                  # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/            # React components (Navbar, Dashboard, etc.)
│   │   ├── config.js              # API base URL configuration
│   │   ├── App.jsx                # Main application component
│   │   └── main.jsx               # React entry point
│   ├── Dockerfile                 # Multi-stage build (Node → Nginx)
│   ├── nginx.conf                 # Nginx SPA routing + API proxy
│   ├── vercel.json                # Vercel deployment config
│   ├── netlify.toml               # Netlify deployment config
│   └── .env.example               # Frontend environment template
├── scripts/
│   ├── setup.sh                   # Project setup automation
│   ├── deploy.sh                  # Multi-platform deployment script
│   ├── db-backup.sh               # Database backup & rotation
│   └── healthcheck.sh             # Service health monitoring
├── database/
│   └── seed.sql                   # Sample data for development
├── Makefile                       # Automation shortcuts (setup, build, docker)
├── .github/workflows/
│   └── ci.yml                     # GitHub Actions CI pipeline
├── docker-compose.yml             # 3-service orchestration
├── Dockerfile                     # Combined single-container build
├── railway.json                   # Railway deployment config
├── render.yaml                    # Render Blueprint
├── .env.example                   # Backend environment template
├── .dockerignore                  # Docker build exclusions
├── package.json                   # Backend dependencies + scripts
└── README.md                      # This file
```

---

## 🛠️ Automation & Professional Tools

This project includes several professional-grade automation tools:

- **Makefile**: Provides simple shortcuts for complex commands (`make setup`, `make docker-up`, `make backup`).
- **Shell Scripts**: Custom DevOps scripts for database management, health monitoring, and multi-platform deployment.
- **TypeScript Definitions**: Located in `backend/types/`, providing formal data structures for the system architecture.
- **Database Migrations**: Initial schema in `backend/models/bookModel.sql` and seed data in `database/seed.sql`.

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

Run the entire stack with one command:

```bash
# Clone the repository
git clone https://github.com/your-username/lihqet-bookstore.git
cd lihqet-bookstore

# Create environment file
cp .env.example .env

# Start all services (frontend + backend + MySQL)
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api/books |
| MySQL | localhost:3306 |

```bash
# Other Docker commands
docker-compose up --build -d     # Start in background
docker-compose logs -f            # Follow logs
docker-compose down               # Stop all services
docker-compose down -v            # Stop + delete database volume
```

### Option 2: Local Development (Without Docker)

**Prerequisites:** Node.js 20+, MySQL 8.0+

#### 1. Database Setup

```bash
# Log into MySQL
mysql -u root -p

# Create the database and table
CREATE DATABASE lihqet_books;
USE lihqet_books;

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

#### 3. Start Backend

```bash
npm install
npm run dev          # Starts with nodemon (auto-reload)
```

#### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server on port 5173
```

The Vite dev server proxies `/api/*` requests to the backend automatically.

---

## 🔑 Environment Variables

### Backend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Backend server port |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |
| `DB_HOST` | `localhost` | MySQL host (`db` when using Docker Compose) |
| `DB_PORT` | `3306` | MySQL port (varies on cloud providers) |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | — | MySQL password |
| `DB_NAME` | `lihqet_books` | MySQL database name |
| `CORS_ORIGIN` | `*` | Allowed frontend origins (comma-separated) |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | _(empty)_ | Backend API URL. Leave empty for same-origin. Set when deploying frontend separately. |

---

## 📡 API Reference

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/books` | Get all books |
| `GET` | `/books/:id` | Get a single book by ID |
| `POST` | `/books` | Create a new book |
| `PUT` | `/books/:id` | Update a book |
| `DELETE` | `/books/:id` | Delete a book |

### Request Body (POST / PUT)

```json
{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "price": 29.99,
  "stock": 15
}
```

---

## 🐳 Docker Architecture

The project provides **two Docker strategies**:

### Strategy 1: Docker Compose (Development & Testing)

Runs 3 separate services connected via a bridge network:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │───▶│   Backend    │───▶│    MySQL     │
│  (Nginx:80)  │    │ (Node:3000)  │    │   (:3306)    │
│  Port: 5173  │    │  Port: 3000  │    │  Port: 3306  │
└──────────────┘    └──────────────┘    └──────────────┘
      Nginx proxies /api/* to backend
```

### Strategy 2: Single Container (Cloud Deployment)

The root `Dockerfile` builds everything into one image:
- Stage 1: Builds React frontend with Vite
- Stage 2: Runs Express server that serves both API and static frontend

Ideal for: Railway, Render, Fly.io, etc.

---

## ☁️ Deployment

### Railway

1. Push code to GitHub
2. Connect repo in [Railway Dashboard](https://railway.app)
3. Railway auto-detects `railway.json` and `Dockerfile`
4. Add a MySQL plugin and set environment variables:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` from MySQL plugin

### Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://render.com) → **New Blueprint**
3. Connect repo — Render reads `render.yaml` automatically
4. Database credentials are injected automatically

### Vercel / Netlify (Frontend Only)

Deploy the frontend separately and point it to your hosted backend:

```bash
cd frontend

# Set the backend URL
echo "VITE_API_URL=https://your-backend.railway.app" > .env

# Deploy
npx vercel            # or: npx netlify deploy --prod
```

The `vercel.json` and `netlify.toml` configs handle SPA routing automatically.

---

## 🔄 CI/CD Pipeline

GitHub Actions runs automatically on every push to `main`/`master`:

```
┌─────────────┐   ┌──────────────┐   ┌───────────────┐   ┌──────────────┐
│  Checkout   │──▶│Install Deps  │──▶│ Backend Check │──▶│Frontend Build│
│  & Setup    │   │ (npm ci)     │   │  (startup)    │   │  (vite)      │
└─────────────┘   └──────────────┘   └───────────────┘   └──────────────┘
```

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for details.

---

## 🛠️ Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19, Vite 8 | Modern SPA with hot reload |
| Backend | Node.js, Express 5 | REST API server |
| Database | MySQL 8.0 | Relational data persistence |
| Containerization | Docker, Docker Compose | Consistent environments |
| CI/CD | GitHub Actions | Automated testing & builds |
| Web Server | Nginx | Production frontend serving |
| Deployment | Railway, Render, Vercel | Cloud hosting |

---

## 📜 License

ISC
