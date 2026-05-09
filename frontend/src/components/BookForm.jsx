import React, { useState, useEffect } from 'react';
import './BookForm.css';

const BookForm = ({ onSubmit, editingBook, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        price: editingBook.price,
        stock: editingBook.stock
      });
    } else {
      setFormData({ title: '', author: '', price: '', stock: '' });
    }
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10)
    });
    if (!editingBook) {
      setFormData({ title: '', author: '', price: '', stock: '' });
    }
  };

  return (
    <div className="card form-card animate-fade-in" id="add-book">
      <h2 className="mb-3">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input 
              type="text" 
              name="title" 
              className="form-control" 
              placeholder="e.g. The Great Gatsby"
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Author</label>
            <input 
              type="text" 
              name="author" 
              className="form-control" 
              placeholder="e.g. F. Scott Fitzgerald"
              value={formData.author} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input 
              type="number" 
              name="price" 
              className="form-control" 
              placeholder="0.00"
              step="0.01" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Stock Quantity</label>
            <input 
              type="number" 
              name="stock" 
              className="form-control" 
              placeholder="0"
              value={formData.stock} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        <div className="form-actions mt-4 flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
          {editingBook && (
            <button type="button" className="btn btn-danger" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookForm;
