const db = require('./db');

const express = require('express');
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const booksRoute = require('./routes/books');
app.use('/books', booksRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running on port " + port + " .");
})

