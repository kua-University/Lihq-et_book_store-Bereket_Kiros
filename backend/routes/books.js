const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/", (req, res) => {
  const sql = "select * from books";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching books:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid book ID!" });
    return;
  }

  db.query("select * from books where id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching book by ID:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.json(results[0]);
  });
});

router.post("/", (req, res) => {
  const { title, author, price, stock } = req.body;

  if (!title || !author || !price || !stock) {
    res.status(400).json({ error: "Missing required fields!" });
    return;
  }

  db.query(
    "insert into books (title, author, price, stock) values (?,?,?,?)",
    [title, author, price, stock],
    (err, results) => {
      if (err) {
        console.error("Error inserting book:", err);
        res.status(500).json({ error: "Database error" });
        return;
      } else {

        console.log("Book added with ID:", results.insertId);

      const newBook = {
           id: results.insertId,
           title,
           author,
           price,
           stock,
         };

         res.status(201).json(newBook);

        // res.status(201).json({
        //     message: "Book added successfully! Book ID:" + results.insertId,
        //   });
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  const {title, author, price, stock}  = req.body;

  if(Number.isNaN(id) || id <= 0) {
    res.status(400).json({error: "Invalid book ID!"});
    return;
  }

  if (!title || !author || !price || !stock) {
    res.status(400).json({ error: "Missing required fields!" });
    return;
  }

  db.query(
    "update books set title = ?, author = ?, price = ?, stock = ? where id = ?",
    [title, author, price, stock, id], (err, results) => {
      if (err) {
        console.error("Error updating book:", err);
        res.status(500).json({ error: "Database error" });
        return;
      }

      if (results.affectedRows === 0) {
        console.log("Book not found with ID:", id);
        res.status(404).json({ error: "Book not found"});
      } else {
        console.log("Book updated with ID:", id);
        res.json({message: "Book updated successfully!"})
      }    
});
})

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if(Number.isNaN(id) || id <= 0) {
    res.status(400).json({error: "Invalid book ID!"});
    return;
  }
  db.query("delete from books where id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error when deleting book:", err);
      res.status(500).json({error: "Database error"});
      return;
    } else {
      if (results.affectedRows === 0) {
        console.log("Book not found with ID:", id);
        res.status(404).json({ error: "Book not found"});
      } else {
        console.log("Book deleted successfully with ID:", id);
        res.json({message: "Book deleted successfully!"})
      }
    }
  })
})


module.exports = router;
