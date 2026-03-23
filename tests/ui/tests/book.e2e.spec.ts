import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { AddBookPage } from '../pages/AddBookPage';
import { BookDetailsPage } from '../pages/BookDetailsPage';
import { ApiHelper } from '../utils/apiHelper';
import { bookData } from '../utils/testData';

test.describe('📚 Book Library E2E Flow', () => {

    test('✅ Add Book → Validate UI + API → View Details @sanity @smoke @regression', async ({ page, request }) => {

        const dashboard = new DashboardPage(page);
        const addBook = new AddBookPage(page);
        const details = new BookDetailsPage(page);
        const api = new ApiHelper(request);

        let createdBookId: any;

        // Generate unique book title using timestamp
        const uniqueTitle = `${bookData.validBook.title} - ${Date.now()}`;
        const uniqueBook = {
            ...bookData.validBook,
            title: uniqueTitle
        };

        // 🔥 Intercept API
        page.on('response', async (response) => {
            if (response.url().includes('/books') && response.request().method() === 'POST') {
                const data = await response.json();
                createdBookId = data.id;
                expect(response.status()).toBe(201);
            }
        });

        // Step 1: Open Dashboard
        await dashboard.goto();

        // Step 2: Go to Add Book Page
        await dashboard.clickAddNewBook();

        // Step 3: Add Book with Unique Title
        await addBook.addBook(uniqueBook);

        // Step 4: Assert Success Message
        await expect(addBook.successMessage).toBeVisible();
        await expect(addBook.redirectMessage).toBeVisible();

        // Step 5: Wait for automatic redirect to Book Details Page
        await page.waitForTimeout(2000);
        await page.waitForLoadState('networkidle');

        // Step 6: Validate Book Details on Details Page
        await details.verifyBookDetails(uniqueBook);

        // Step 7: Navigate back to Dashboard
        await dashboard.goto();

        // Wait extra for fresh book list to load
        await page.waitForTimeout(1500);

        // Step 8: Verify Book is visible on Dashboard
        await dashboard.verifyBookVisible(uniqueBook.title);

        // Step 9: Validate API (Backend Data)
        const apiBook = await api.getBookById(createdBookId);
        expect(apiBook.title).toBe(uniqueBook.title);
        expect(apiBook.author).toBe(uniqueBook.author);

        // Step 10: Cross-check by clicking on the book again from Dashboard
        await page.waitForLoadState('networkidle');
        await dashboard.openBookDetails(uniqueBook.title);

        // Step 11: Verify Details are still correct
        await details.verifyBookDetails(uniqueBook);
    });

    test('❌ Should show validation errors for empty fields @sanity @regression', async ({ page }) => {

        const dashboard = new DashboardPage(page);
        const addBook = new AddBookPage(page);

        await dashboard.goto();
        await dashboard.clickAddNewBook();

        await addBook.submitBtn.click();

        await addBook.validateRequiredErrors();
    });

    test('❌ Invalid rating should not be accepted @sanity @regression', async ({ page }) => {

        const addBook = new AddBookPage(page);

        await page.goto('/add-book');

        // Fill in Title and Author and Pages (required fields)
        await addBook.title.fill(bookData.validBook.title);
        await addBook.author.fill(bookData.validBook.author);
        await addBook.pages.fill(bookData.validBook.pages);

        // Fill in invalid rating
        await addBook.rating.fill('10'); // invalid - must be between 1-5

        await addBook.validateRatingError();
    });

    test('❌ Should show validation error when published year is less than 1000 @sanity @regression', async ({ page }) => {
        const addBook = new AddBookPage(page);

        await page.goto('/add-book');

        // Fill in Title and Author (required fields)
        await addBook.title.fill(bookData.validBook.title);
        await addBook.author.fill(bookData.validBook.author);
        await addBook.year.fill('10');

        await addBook.validatePublishedYearError();
    });

});