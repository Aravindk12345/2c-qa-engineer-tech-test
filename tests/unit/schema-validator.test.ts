import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateBookSchema } from '../api/utils/schema.validator';

/**
 * Unit Tests for Book Schema Validator
 * 
 * Demonstrates:
 * ✓ Testing utility functions in isolation
 * ✓ Edge case coverage
 * ✓ Error handling
 * ✓ Clear test organization
 */

describe('📋 Schema Validator - validateBookSchema', () => {
  
  let validBook: any;

  beforeEach(() => {
    // Setup: Valid book object for baseline testing
    validBook = {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic',
      publishedYear: 1925,
      isbn: '978-0743273565',
      pages: 180,
      rating: 4.2,
      description: 'A classic novel'
    };
  });

  describe('Happy Path - Valid Books', () => {
    
    it('[CRITICAL] should validate a complete valid book without throwing', () => {
      // Should not throw
      expect(() => validateBookSchema(validBook)).not.toThrow();
    });

    it('should work with books containing all required properties', () => {
      expect(() => validateBookSchema(validBook)).not.toThrow();
    });

    it('should accept various valid rating values', () => {
      const books = [
        { ...validBook, rating: 1.0 },
        { ...validBook, rating: 2.5 },
        { ...validBook, rating: 4.9 },
        { ...validBook, rating: 5.0 }
      ];

      books.forEach(book => {
        expect(() => validateBookSchema(book)).not.toThrow();
      });
    });

    it('should accept different genres', () => {
      const genres = ['Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Classic'];
      
      genres.forEach(genre => {
        expect(() => validateBookSchema({ ...validBook, genre })).not.toThrow();
      });
    });
  });

  describe('Validation - Missing Required Fields', () => {
    
    it('should detect missing title field', () => {
      const bookWithoutTitle = { ...validBook };
      delete bookWithoutTitle.title;

      expect(() => validateBookSchema(bookWithoutTitle)).toThrow();
    });

    it('should detect missing author field', () => {
      const bookWithoutAuthor = { ...validBook };
      delete bookWithoutAuthor.author;

      expect(() => validateBookSchema(bookWithoutAuthor)).toThrow();
    });

    it('should detect missing isbn field', () => {
      const bookWithoutIsbn = { ...validBook };
      delete bookWithoutIsbn.isbn;

      expect(() => validateBookSchema(bookWithoutIsbn)).toThrow();
    });

    it('should detect when multiple required fields are missing', () => {
      const incompletebook = {
        title: 'Some Title',
        // Missing author, isbn, etc.
      };

      expect(() => validateBookSchema(incompletebook)).toThrow();
    });
  });

  describe('Edge Cases - Invalid Data Types', () => {
    
    it('should handle null book object', () => {
      expect(() => validateBookSchema(null)).toThrow();
    });

    it('should handle undefined book object', () => {
      expect(() => validateBookSchema(undefined)).toThrow();
    });

    it('should handle empty object', () => {
      expect(() => validateBookSchema({})).toThrow();
    });

    it('should handle book with empty string title', () => {
      const bookWithEmptyTitle = { ...validBook, title: '' };
      // Might fail validation depending on implementation
      expect(() => validateBookSchema(bookWithEmptyTitle)).toThrow();
    });

    it('should handle book with null title', () => {
      const bookWithNullTitle = { ...validBook, title: null };
      expect(() => validateBookSchema(bookWithNullTitle)).toThrow();
    });

    it('should handle string instead of number for id', () => {
      const bookWithStringId = { ...validBook, id: '1' };
      // Behavior depends on implementation - might coerce or throw
      // Test documents actual behavior
      expect(() => validateBookSchema(bookWithStringId)).not.toThrow();
    });
  });

  describe('Data Integrity - Field Values', () => {
    
    it('should accept very long book title', () => {
      const longTitle = 'A'.repeat(500);
      expect(() => validateBookSchema({ ...validBook, title: longTitle })).not.toThrow();
    });

    it('should accept special characters in title and author', () => {
      const specialCharBook = {
        ...validBook,
        title: 'Book: "The Test" & Dreams (2024)',
        author: 'José García-López (PhD)'
      };
      
      expect(() => validateBookSchema(specialCharBook)).not.toThrow();
    });

    it('should accept unicode characters', () => {
      const unicodeBook = {
        ...validBook,
        title: '本を読む - The Book 📚',
        author: 'Автор'
      };
      
      expect(() => validateBookSchema(unicodeBook)).not.toThrow();
    });

    it('should validate isbn format (basic check)', () => {
      const validIsbns = [
        '978-0743273565',
        '978-3-16-148410-0',
        '978-0-1234567-89'
      ];

      validIsbns.forEach(isbn => {
        expect(() => validateBookSchema({ ...validBook, isbn })).not.toThrow();
      });
    });

    it('should accept various valid page counts', () => {
      const pageCounts = [1, 50, 100, 500, 1000, 5000];

      pageCounts.forEach(pages => {
        expect(() => validateBookSchema({ ...validBook, pages })).not.toThrow();
      });
    });
  });

  describe('Robustness - Unexpected Data', () => {
    
    it('should ignore extra unknown properties', () => {
      const bookWithExtra = {
        ...validBook,
        unknownField: 'unexpected',
        anotherExtra: 12345
      };

      expect(() => validateBookSchema(bookWithExtra)).not.toThrow();
    });

    it('should validate even with property order variations', () => {
      const reorderedBook = {
        author: validBook.author,
        title: validBook.title,
        isbn: validBook.isbn,
        genre: validBook.genre,
        id: validBook.id,
        publishedYear: validBook.publishedYear,
        pages: validBook.pages,
        rating: validBook.rating,
        description: validBook.description
      };

      expect(() => validateBookSchema(reorderedBook)).not.toThrow();
    });

    it('should handle book object with methods', () => {
      const bookWithMethod = {
        ...validBook,
        toString: () => 'Book'
      };

      expect(() => validateBookSchema(bookWithMethod)).not.toThrow();
    });
  });
});

/**
 * API Response Validation Example
 * Tests the validator against realistic API responses
 */
describe('📡 Schema Validator - API Response Integration', () => {
  
  it('should validate books from API /api/books response', () => {
    // Simulated API response
    const apiResponse = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
        publishedYear: 1925,
        description: "A story of decadence and excess",
        isbn: "978-0743273565",
        pages: 180,
        rating: 4.2
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
        publishedYear: 1960,
        description: "A story about racial injustice",
        isbn: "978-0446310789",
        pages: 281,
        rating: 4.3
      }
    ];

    // All books should validate successfully
    expect(() => {
      apiResponse.forEach(book => validateBookSchema(book));
    }).not.toThrow();
  });

  it('should validate a single book from API /api/books/[id] response', () => {
    const singleBookResponse = {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      publishedYear: 1925,
      description: "A story of decadence and excess",
      isbn: "978-0743273565",
      pages: 180,
      rating: 4.2
    };

    expect(() => validateBookSchema(singleBookResponse)).not.toThrow();
  });

  it('should validate newly created book from POST /api/books', () => {
    const newBookResponse = {
      id: 6,
      title: "New Book Title",
      author: "New Author",
      genre: "Fiction",
      publishedYear: 2024,
      description: "A newly added book",
      isbn: "978-0-1234567-89",
      pages: 350,
      rating: 0
    };

    expect(() => validateBookSchema(newBookResponse)).not.toThrow();
  });
});
