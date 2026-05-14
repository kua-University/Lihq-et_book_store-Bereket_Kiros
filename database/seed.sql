-- Lihq'et Bookstore — Seed Data
-- Run this script to populate the database with sample books.

USE lihqet_books;

INSERT INTO books (title, author, price, stock) VALUES
('The Alchemist', 'Paulo Coelho', 9.99, 10),
('Clean Code', 'Robert C. Martin', 35.50, 5),
('Fikir Eske Mekabir', 'Haddis Alemayehu', 15.00, 12),
('Oromay', 'Baalu Girma', 18.00, 8),
('The Great Gatsby', 'F. Scott Fitzgerald', 12.99, 20),
('Clean Architecture', 'Robert C. Martin', 40.00, 3),
('Dertogada', 'Yismake Worku', 22.00, 15),
('1984', 'George Orwell', 14.50, 30);
