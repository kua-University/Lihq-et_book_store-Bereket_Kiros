# Lihq'et Bookstore - Advanced Architecture Project

This project demonstrates a professional full-stack software architecture upgrade from a basic CRUD application to a structured, layered architecture system suitable for a Software Architecture and Design course.

## Architecture

The project implements the following architectural patterns:

### 1. MVC Pattern (Backend)
- **Models** (`backend/models/`): Encapsulates database interactions and SQL queries.
- **Views** (`frontend/`): A decoupled React.js single-page application.
- **Controllers** (`backend/controllers/`): Handles HTTP requests, calls the Service Layer, and returns JSON responses.

### 2. Service Layer Pattern
- **Services** (`backend/services/`): Contains the core business logic. This decouples the business rules from the HTTP transport layer (controllers) and the data access layer (models), making the system highly testable and scalable.

### 3. Middleware
- Centralized Error Handling (`backend/middleware/errorMiddleware.js`).
- Request Validation (`backend/middleware/validationMiddleware.js`).

## Technologies Used

- **Frontend**: React.js, Vite, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL (via `mysql2/promise`)
- **DevOps**: Docker, Docker Compose, GitHub Actions CI

## Setup Instructions

### Local Setup (Without Docker)

1. **Database setup**: Ensure MySQL is running. Create a database (e.g., `lihqet_books`) and run the SQL script located in `backend/models/bookModel.sql` to create the table.
2. **Environment Variables**: Copy `.env.example` to `.env` and fill in your database credentials.
3. **Backend**:
   ```bash
   npm install
   npm run dev
   ```
4. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Setup

You can run the entire application using Docker Compose:

```bash
docker-compose up --build
```
This will start both the MySQL database and the Node.js/React application on port 3000.

## UI/UX

The frontend has been completely redesigned with a modern, premium aesthetic, featuring:
- A dashboard with statistics cards.
- Interactive book list with search and filtering.
- Smooth animations and professional color palette.
