import React from 'react';
import './Dashboard.css';

const Dashboard = ({ books }) => {
  const totalBooks = books.length;
  const totalValue = books.reduce((acc, book) => acc + (book.price * book.stock), 0);
  const lowStock = books.filter(book => book.stock < 5).length;

  return (
    <div className="dashboard-section animate-fade-in" id="dashboard">
      <h2 className="section-title">Store Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="card stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Titles</h3>
            <p className="stat-value">{totalBooks}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Inventory Value</h3>
            <p className="stat-value">${totalValue.toFixed(2)}</p>
          </div>
        </div>
        <div className="card stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Low Stock Alerts</h3>
            <p className="stat-value">{lowStock}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
