-- Lihq'et Bookstore Database Schema
-- This script is automatically executed by Docker on first container startup.

CREATE DATABASE IF NOT EXISTS lihqet_books;
USE lihqet_books;

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
