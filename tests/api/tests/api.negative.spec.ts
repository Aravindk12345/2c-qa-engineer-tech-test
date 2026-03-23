import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../utils/endpoints';

// ❌ Negative Flow: Error handling, invalid data, edge cases

// 📋 Test Data - RETRIEVE
const retrieveTestCases = [
  { id: 99999, expectedStatus: 404, tags: '@sanity @smoke', desc: 'non-existent book ID' },
  { id: 'invalid', expectedStatus: [400, 404], tags: '@smoke @regression', desc: 'invalid ID format' },
  { id: -1, expectedStatus: [400, 404], tags: '@regression', desc: 'negative book ID' },
  { id: 999999999999999, expectedStatus: [400, 404], tags: '@regression', desc: 'very large book ID' },
];

// 📋 Test Data - CREATE (Missing/Empty Fields)
const createTestCases = [
  { payload: { author: 'Some Author' }, expectedStatus: 400, tags: '@sanity @smoke', desc: 'title missing' },
  { payload: { title: 'Some Title' }, expectedStatus: 400, tags: '@sanity @smoke', desc: 'author missing' },
  { payload: { genre: 'Fiction' }, expectedStatus: 400, tags: '@regression', desc: 'both title and author missing' },
  { payload: { title: '', author: 'Valid Author' }, expectedStatus: 400, tags: '@smoke @regression', desc: 'empty title string' },
  { payload: { title: 'Valid Title', author: '' }, expectedStatus: 400, tags: '@regression', desc: 'empty author string' },
  { payload: 'not valid json', expectedStatus: 400, tags: '@smoke @regression', desc: 'malformed JSON' },
  { payload: { title: null, author: 'Some Author' }, expectedStatus: 400, tags: '@regression', desc: 'null in required field' },
];

// 📋 Test Data - VALIDATE (Edge Cases)
const validateTestCases = [
  { payload: { title: 'A'.repeat(300), author: 'Author' }, expectedStatus: [201, 400], tags: '@regression', desc: 'very long title (300 chars)' },
  { payload: { title: 'Book: "Test" & Author\'s Dream 🎓', author: 'José García-López' }, expectedStatus: 201, tags: '@smoke @regression', desc: 'special characters and Unicode' },
  { payload: { title: 'Numeric String Test', author: 'Test Author', pages: '350', rating: '4.5' }, expectedStatus: [201, 400], tags: '@regression', desc: 'numeric strings in numeric fields' },
  { payload: { title: 'High Rating', author: 'Test Author', rating: 10 }, expectedStatus: [201, 400], tags: '@regression', desc: 'rating out of range (0-5)' },
  { payload: { title: 'Negative Pages', author: 'Test Author', pages: -100 }, expectedStatus: [201, 400], tags: '@regression', desc: 'negative pages value' },
];

test.describe('❌ RETRIEVE - Negative Flow', () => {
  retrieveTestCases.forEach(({ id, expectedStatus, tags, desc }) => {
    test(`${tags} should handle ${desc}`, async () => {
      const context = await request.newContext();
      const api = new ApiClient(context);
      const response = await api.get(API_ENDPOINTS.BOOK_BY_ID(id));

      if (Array.isArray(expectedStatus)) {
        expect(expectedStatus).toContain(response.status());
      } else {
        expect(response.status()).toBe(expectedStatus);
      }
    });
  });
});

test.describe('❌ CREATE - Negative Flow', () => {
  createTestCases.forEach(({ payload, expectedStatus, tags, desc }) => {
    test(`${tags} should return 400 when ${desc}`, async () => {
      const context = await request.newContext();
      const api = new ApiClient(context);
      const response = await api.post(API_ENDPOINTS.BOOKS, payload);

      expect(response.status()).toBe(expectedStatus);
      
      if (response.status() === 400) {
        const errorData = await response.json();
        expect(errorData).toHaveProperty('error');
      }
    });
  });
});

test.describe('❌ VALIDATE - Negative Flow (Edge Cases)', () => {
  validateTestCases.forEach(({ payload, expectedStatus, tags, desc }) => {
    test(`${tags} should handle ${desc}`, async () => {
      const context = await request.newContext();
      const api = new ApiClient(context);
      const response = await api.post(API_ENDPOINTS.BOOKS, payload);

      if (Array.isArray(expectedStatus)) {
        expect(expectedStatus).toContain(response.status());
      } else {
        expect(response.status()).toBe(expectedStatus);
        if (response.status() === 201) {
          const created = await response.json();
          expect(created).toHaveProperty('id');
        }
      }
    });
  });
});

test.describe('❌ HTTP Status Code Verification', () => {
  test('@smoke @regression should maintain HTTP status codes correctly across operations', async () => {
    const context = await request.newContext();
    const api = new ApiClient(context);

    const getResponse = await api.get(API_ENDPOINTS.BOOKS);
    expect(getResponse.status()).toBe(200);

    const postResponse = await api.post(API_ENDPOINTS.BOOKS, { title: 'Test', author: 'Test' });
    expect([201, 200]).toContain(postResponse.status());

    const notFoundResponse = await api.get(API_ENDPOINTS.BOOK_BY_ID(99999));
    expect(notFoundResponse.status()).toBe(404);
  });
});
