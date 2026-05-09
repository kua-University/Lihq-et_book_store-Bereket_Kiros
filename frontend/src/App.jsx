import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddOrUpdateBook = async (bookData) => {
    try {
      if (editingBook) {
        // Update
        const response = await fetch(`/api/books/${editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
        if (!response.ok) throw new Error('Failed to update book');
      } else {
        // Add
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
        if (!response.ok) throw new Error('Failed to add book');
      }
      
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Operation failed. Please check the console.');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete book');
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    document.getElementById('add-book').scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="container mt-4">
        {loading ? (
          <div className="text-center py-4">Loading application...</div>
        ) : (
          <>
            <Dashboard books={books} />
            <BookForm 
              onSubmit={handleAddOrUpdateBook} 
              editingBook={editingBook} 
              onCancelEdit={handleCancelEdit} 
            />
            <BookList 
              books={books} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteBook} 
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
