
import { expect } from '@playwright/test';

// Validate complete book schema with all required fields
export function validateBookSchema(book: any) {
  expect(book).toMatchObject({
    id: expect.any(Number),
    title: expect.any(String),
    author: expect.any(String),
    genre: expect.any(String),
    isbn: expect.any(String),
    rating: expect.any(Number),
    pages: expect.any(Number),
    publishedYear: expect.any(Number),
  });
}

// Validate book has required fields (title, author, isbn)
export function validateBookRequiredFields(book: any) {
  expect(book).toHaveProperty('title');
  expect(book).toHaveProperty('author');
  expect(book).toHaveProperty('isbn');
}

// Validate book data types
export function validateBookDataTypes(book: any) {
  expect(typeof book.id).toBe('number');
  expect(typeof book.title).toBe('string');
  expect(typeof book.author).toBe('string');
  expect(typeof book.genre).toBe('string');
  expect(typeof book.isbn).toBe('string');
  expect(typeof book.rating).toBe('number');
  expect(typeof book.pages).toBe('number');
  expect(typeof book.publishedYear).toBe('number');
}

// Validate book has non-empty required fields
export function validateBookNonEmptyFields(book: any) {
  expect(book.title).toBeTruthy();
  expect(book.author).toBeTruthy();
  expect(book.id).toBeTruthy();
}

// Validate array of books
export function validateBooksArray(books: any[]) {
  expect(Array.isArray(books)).toBeTruthy();
  expect(books.length).toBeGreaterThan(0);
  books.forEach((book, index) => {
    expect(book.id).toBeDefined();
    expect(book.title).toBeDefined();
    expect(book.author).toBeDefined();
  });
}
