require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require('express');
const cors = require('cors');
const path = require("path");
const errorHandler = require('./middleware/errorMiddleware');
const booksRoute = require('./routes/books');

const app = express();

// --- CORS Configuration ---
// Allows the frontend to communicate with the backend when deployed on different domains.
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Serve static frontend files (production: serves the Vite build output)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Routes
app.use('/api/books', booksRoute);

// SPA Fallback — serve index.html for any non-API route (React Router support)
app.get('{*path}', (req, res) => {
  const indexPath = path.join(__dirname, "../frontend/dist/index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: "Not found" });
    }
  });
});

// Centralized error handling
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`[${process.env.NODE_ENV || 'development'}] Server is running on port ${port}.`);
});
