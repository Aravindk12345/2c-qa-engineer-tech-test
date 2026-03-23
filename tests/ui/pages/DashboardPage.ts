import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) { }

  addNewBookBtn = this.page.getByRole('link', { name: 'Add New Book' });

  // More specific selector: targets the h2 heading containing the book title
  bookCard = (title: string) => this.page.locator(`h2:has-text("${title}")`);

  // More robust: finds the link that contains the book title
  bookLink = (title: string) => this.page.locator(`a >> h2:has-text("${title}")`).locator('..');

  async goto() {
    await this.page.goto('/');
  }

  async clickAddNewBook() {
    await this.addNewBookBtn.click();
  }

  async verifyBookVisible(title: string) {
    // Wait for the book card with extended timeout
    await expect(this.bookCard(title)).toBeVisible({ timeout: 10000 });
  }

  async openBookDetails(title: string) {
    // Use the bookLink selector which targets the <a> tag containing the book
    const link = this.bookLink(title);
    await link.scrollIntoViewIfNeeded();
    await link.click({ timeout: 10000 });
  }
}