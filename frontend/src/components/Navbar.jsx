import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <div className="navbar-brand">
          <span className="navbar-logo">📚</span>
          <h1>Lihq'et Bookstore</h1>
        </div>
        <ul className="navbar-nav">
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#inventory">Inventory</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
