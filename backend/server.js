const express = require('express');
const path = require("path");
const errorHandler = require('./middleware/errorMiddleware');
const booksRoute = require('./routes/books');

const app = express();

app.use(express.json());

// Serve static frontend files (will be updated to React build later)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Routes
app.use('/api/books', booksRoute);

// Centralized error handling
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running on port " + port + ".");
});
