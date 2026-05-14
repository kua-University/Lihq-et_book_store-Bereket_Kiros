/**
 * Lihq'et Bookstore — Type Definitions
 * 
 * These types define the core data structures used throughout the application.
 * While the backend is currently JS, these definitions serve as a reference
 * for documentation and future TypeScript migration.
 */

export interface Book {
  id?: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  created_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserCredentials {
  db_host: string;
  db_user: string;
  db_name: string;
}
