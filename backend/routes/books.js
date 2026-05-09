const express = require("express");
const router = express.Router();
const BookController = require("../controllers/bookController");
const { validateBook, validateId } = require("../middleware/validationMiddleware");

router.get("/", BookController.getAllBooks);
router.get("/:id", validateId, BookController.getBookById);
router.post("/", validateBook, BookController.createBook);
router.put("/:id", validateId, validateBook, BookController.updateBook);
router.delete("/:id", validateId, BookController.deleteBook);

module.exports = router;
