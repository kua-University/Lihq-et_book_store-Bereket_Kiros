import React, { useState } from 'react';
import './BookList.css';

const BookList = ({ books, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'low') return matchesSearch && book.stock < 5;
    if (filter === 'out') return matchesSearch && book.stock === 0;
    return matchesSearch;
  });

  return (
    <div className="card list-card animate-fade-in" id="inventory">
      <div className="list-header flex justify-between items-center mb-3">
        <h2>Inventory Management</h2>
        <div className="controls flex gap-2">
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-control filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Books</option>
            <option value="low">Low Stock (&lt; 5)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <tr key={book.id}>
                  <td>#{book.id}</td>
                  <td className="font-medium">{book.title}</td>
                  <td>{book.author}</td>
                  <td>${Number(book.price).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${book.stock === 0 ? 'badge-danger' : book.stock < 5 ? 'badge-warning' : 'badge-success'}`}>
                      {book.stock}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => onEdit(book)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(book.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-secondary">
                  No books found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
