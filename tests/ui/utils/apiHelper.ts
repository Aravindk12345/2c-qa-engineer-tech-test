import { expect, APIRequestContext } from '@playwright/test';

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  async getBookById(id: string) {
    const response = await this.request.get(`/api/books/${id}`);
    expect(response.status()).toBe(200);
    return response.json();
  }

  async getAllBooks() {
    const response = await this.request.get(`/api/books`);
    expect(response.status()).toBe(200);
    return response.json();
  }
}