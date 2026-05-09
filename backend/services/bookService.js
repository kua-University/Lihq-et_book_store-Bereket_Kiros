const BookModel = require("../models/bookModel");

class BookService {
  static async getAllBooks() {
    return await BookModel.getAll();
  }

  static async getBookById(id) {
    const book = await BookModel.getById(id);
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }
    return book;
  }

  static async createBook(bookData) {
    const insertId = await BookModel.create(bookData);
    return { id: insertId, ...bookData };
  }

  static async updateBook(id, bookData) {
    const affectedRows = await BookModel.update(id, bookData);
    if (affectedRows === 0) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }
    return { id, ...bookData };
  }

  static async deleteBook(id) {
    const affectedRows = await BookModel.delete(id);
    if (affectedRows === 0) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }
    return true;
  }
}

module.exports = BookService;
