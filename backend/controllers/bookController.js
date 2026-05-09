const BookService = require("../services/bookService");

class BookController {
  static async getAllBooks(req, res, next) {
    try {
      const books = await BookService.getAllBooks();
      res.json(books);
    } catch (error) {
      next(error);
    }
  }

  static async getBookById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const book = await BookService.getBookById(id);
      res.json(book);
    } catch (error) {
      next(error);
    }
  }

  static async createBook(req, res, next) {
    try {
      const newBook = await BookService.createBook(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      next(error);
    }
  }

  static async updateBook(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await BookService.updateBook(id, req.body);
      res.json({ message: "Book updated successfully!" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBook(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await BookService.deleteBook(id);
      res.json({ message: "Book deleted successfully!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookController;
