import { APIRequestContext } from '@playwright/test';
import { API_ENDPOINTS } from './endpoints';

// 🔧 Reusable API client with generic HTTP methods for get/post

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export class ApiClient {
  constructor(private context: APIRequestContext) {}

  // Generic HTTP GET method
  async get(endpoint: string) {
    return await this.context.get(`${BASE_URL}${endpoint}`);
  }

  // Generic HTTP POST method
  async post(endpoint: string, data?: any) {
    return await this.context.post(`${BASE_URL}${endpoint}`, {
      data: data || {}
    });
  }

  // Get all books
  async getAllBooks() {
    const response = await this.get(API_ENDPOINTS.BOOKS);
    if (response.status() === 200) {
      return response.json();
    }
    throw new Error(`Failed to get all books: ${response.status()}`);
  }

  // Get book by ID
  async getBookById(id: number) {
    const response = await this.get(API_ENDPOINTS.BOOK_BY_ID(id));
    if (response.status() === 200) {
      return response.json();
    }
    throw new Error(`Failed to get book ${id}: ${response.status()}`);
  }

  // Get book by title (search through all books)
  async getBookByTitle(title: string): Promise<any> {
    const books = await this.getAllBooks();
    const book = books.find((b: any) => b.title === title);
    if (book) return book;
    throw new Error(`Book with title "${title}" not found`);
  }
}
