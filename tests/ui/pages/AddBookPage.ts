import { Page, expect, Locator } from '@playwright/test';
import { bookData } from '../utils/testData';

export class AddBookPage {
    constructor(private page: Page) { }

    title = this.page.getByRole('textbox', { name: 'Title *' });
    author = this.page.getByRole('textbox', { name: 'Author *' });
    genre = this.page.locator('select[name="genre"]');
    year = this.page.getByRole('spinbutton', { name: 'Published Year' });
    pages = this.page.getByRole('spinbutton', { name: 'Pages' });
    isbn = this.page.getByRole('textbox', { name: 'ISBN' });
    rating = this.page.getByRole('spinbutton', { name: 'Rating (1-5)' });
    description = this.page.getByRole('textbox', { name: 'Description' });
    addNewBook = this.page.getByRole('link', { name: 'Add New Book' });
    submitBtn = this.page.getByRole('button', { name: 'Add Book' });
    successMessage = this.page.locator('text=Book Added Successfully!');
    redirectMessage = this.page.locator('text=Redirecting to book details...');

    async addBook(book: any) {
        await this.title.fill(book.title);
        await this.author.fill(book.author);
        if (book.genre) {
            await this.genre.selectOption(book.genre);
        }
        await this.year.fill(book.year);
        await this.pages.fill(book.pages);
        await this.isbn.fill(book.isbn);
        await this.rating.fill(book.rating);
        await this.description.fill(book.description);

        await this.submitBtn.click();
    }

    async validateErrorMessage(actual: string, expectedList: string[]) {
        const normalized = actual.toLowerCase();

        return expectedList.some(msg =>
            normalized.includes(msg.toLowerCase())
        );
    }

    async validateRequiredErrors() {
        // Verify Title validation message
        const titleValidationMessage = await this.title.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        console.log('Title validation message:', titleValidationMessage);
        expect(titleValidationMessage).toBeTruthy();
        expect(titleValidationMessage.toLowerCase()).toContain(bookData.required.fillOutThisField.toLowerCase());

        // Verify Author validation message
        const authorValidationMessage = await this.author.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        console.log('Author validation message:', authorValidationMessage);
        expect(authorValidationMessage).toBeTruthy();
        expect(authorValidationMessage.toLowerCase()).toContain(bookData.required.fillOutThisField.toLowerCase());

        // Verify the form is still visible (submission was blocked by validation)
        await expect(this.submitBtn).toBeVisible();
    }

    async validateRatingError() {
        // Verify validation message directly from the input element
        const ratingValidationMessage = await this.rating.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );

        console.log('Rating validation message:', ratingValidationMessage);
                expect(
            this.validateErrorMessage(ratingValidationMessage, bookData.rating.min)
        ).toBeTruthy();

        //Verify the form is still visible (submission was prevented)
        await expect(this.submitBtn).toBeVisible();
    }

    async validatePublishedYearError() {
        const yearValidationMessage = await this.year.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        console.log('Published Year validation message:', yearValidationMessage);
        expect(
            this.validateErrorMessage(yearValidationMessage, bookData.publishedYear.min)
        ).toBeTruthy();
        await expect(this.submitBtn).toBeVisible();
    }
}
