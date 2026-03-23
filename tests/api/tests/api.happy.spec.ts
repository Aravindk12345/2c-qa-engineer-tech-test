import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/endpoints';
import {
  validateBookSchema,
  validateBookDataTypes,
  validateBooksArray,
  validateBookNonEmptyFields
} from '../utils/schema.validator';

// 🔌 Happy Flow: Retrieve, Validate, Create books with valid data

test.describe('✅ GET Books - Happy Flow', () => {
  
  test('@sanity @smoke [CRITICAL] should return array of books with correct schema', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const response = await api.get(API_ENDPOINTS.BOOKS);

    expect(response.status()).toBe(200);

    const books = await response.json();
    validateBooksArray(books);
    validateBookSchema(books[0]);
  });

  test('@smoke @regression should return books with correct data types', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const books = await api.getAllBooks();

    validateBookDataTypes(books[0]);
  });

  test('@regression should return consistent data across multiple requests', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    
    const books1 = await api.getAllBooks();
    const books2 = await api.getAllBooks();

    expect(books1.length).toBe(books2.length);
    expect(books1[0].id).toBe(books2[0].id);
    expect(books1[0].title).toBe(books2[0].title);
  });

  test('@smoke @regression should have valid book data (no empty required fields)', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const books = await api.getAllBooks();

    books.forEach((book: any) => {
      validateBookNonEmptyFields(book);
    });
  });
});

test.describe('✅ VALIDATE - Happy Flow (Single Book)', () => {
  
  let bookId: number;

  test.beforeAll(async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const books = await api.getAllBooks();
    bookId = books[0].id;
  });

  test('@sanity @smoke [CRITICAL] should return correct book by ID', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const response = await api.get(API_ENDPOINTS.BOOK_BY_ID(bookId));

    expect(response.status()).toBe(200);

    const book = await response.json();
    expect(book.id).toBe(bookId);
    validateBookSchema(book);
  });

  test('@smoke @regression should return book details matching /api/books list data', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    
    const allBooks = await api.getAllBooks();
    const expectedBook = allBooks.find((b: any) => b.id === bookId);
    const detailBook = await api.getBookById(bookId);

    expect(detailBook.title).toBe(expectedBook.title);
    expect(detailBook.author).toBe(expectedBook.author);
    expect(detailBook.isbn).toBe(expectedBook.isbn);
    expect(detailBook.rating).toBe(expectedBook.rating);
  });

  test('@regression should have complete data for single book', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const book = await api.getBookById(bookId);

    validateBookSchema(book);
  });
});

test.describe('✅ ADD NEW BOOK - Happy Flow', () => {
  
  test('@sanity @smoke [CRITICAL] should create book with required fields only', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const newBook = {
      title: `API Test Book ${Date.now()}`,
      author: 'Test Author API'
    };

    const response = await api.post(API_ENDPOINTS.BOOKS, newBook);

    expect(response.status()).toBe(201);

    const createdBook = await response.json();
    expect(createdBook.id).toBeDefined();
    expect(createdBook.title).toBe(newBook.title);
    expect(createdBook.author).toBe(newBook.author);
  });

  test('@smoke @regression should create book with all optional fields', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const newBook = {
      title: `Full Book ${Date.now()}`,
      author: 'Complete Author',
      genre: 'Science Fiction',
      publishedYear: 2024,
      isbn: '978-0-1234567-89',
      pages: 450,
      rating: 4.8,
      description: 'An amazing sci-fi novel'
    };

    const response = await api.post(API_ENDPOINTS.BOOKS, newBook);
    const created = await response.json();

    expect(created.title).toBe(newBook.title);
    expect(created.genre).toBe(newBook.genre);
    expect(created.pages).toBe(newBook.pages);
    expect(created.isbn).toBe(newBook.isbn);
  });

  test('@regression should create new book with unique ID', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    
    const response1 = await api.post(API_ENDPOINTS.BOOKS, { 
      title: `Book1 ${Date.now()}`, 
      author: 'Author1' 
    });
    const created1 = await response1.json();

    const response2 = await api.post(API_ENDPOINTS.BOOKS, { 
      title: `Book2 ${Date.now()}`, 
      author: 'Author2' 
    });
    const created2 = await response2.json();

    expect(created1.id).not.toBe(created2.id);
  });

  test('@smoke @regression should persist newly created book in GET /api/books', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);
    const uniqueTitle = `Persistence Test ${Date.now()}`;
    const newBook = {
      title: uniqueTitle,
      author: 'Persistence Author'
    };

    // Create book
    const createResponse = await api.post(API_ENDPOINTS.BOOKS, newBook);
    const created = await createResponse.json();

    // Verify it appears in list
    const allBooks = await api.getAllBooks();
    
    const found = allBooks.find((b: any) => b.id === created.id);
    expect(found).toBeDefined();
    expect(found.title).toBe(uniqueTitle);
  });
});
