// 📍 Centralized API endpoint definitions for books API

export const API_ENDPOINTS = {
  BOOKS: '/api/books',
  BOOK_BY_ID: (id: number | string) => `/api/books/${id}`,
} as const;

export default API_ENDPOINTS;
