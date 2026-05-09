const db = require("../config/db");

class BookModel {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM books");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(bookData) {
    const { title, author, price, stock } = bookData;
    const [result] = await db.query(
      "INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)",
      [title, author, price, stock]
    );
    return result.insertId;
  }

  static async update(id, bookData) {
    const { title, author, price, stock } = bookData;
    const [result] = await db.query(
      "UPDATE books SET title = ?, author = ?, price = ?, stock = ? WHERE id = ?",
      [title, author, price, stock, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM books WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

module.exports = BookModel;
