const validateBook = (req, res, next) => {
  const { title, author, price, stock } = req.body;

  if (!title || !author || price === undefined || stock === undefined) {
    const error = new Error("Missing required fields!");
    error.status = 400;
    return next(error);
  }

  if (typeof price !== 'number' || typeof stock !== 'number') {
    const error = new Error("Price and stock must be numbers.");
    error.status = 400;
    return next(error);
  }

  next();
};

const validateId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id <= 0) {
    const error = new Error("Invalid book ID!");
    error.status = 400;
    return next(error);
  }
  next();
};

module.exports = {
  validateBook,
  validateId
};
