import { Page, expect } from '@playwright/test';

export class BookDetailsPage {
    constructor(private page: Page) { }

    title = this.page.locator(`//h1[contains(@class, 'text-3xl')]`);;
    author = this.page.locator(`//p[contains(@class, 'text-xl')]`);

    async verifyBookDetails(book: any) {
        await this.page.waitForTimeout(15000);
        await expect(this.title).toContainText(book.title);
        await expect(this.page.locator(`text=${book.author}`)).toBeVisible();
        await expect(this.page.locator(`text=${book.genre}`)).toBeVisible();
    }
} 
