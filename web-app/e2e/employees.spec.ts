import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@shiftsync.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
});

test('create and delete employee', async ({ page }) => {
    // Navigate to Employees
    await page.getByRole('link', { name: 'Employees' }).click();
    await expect(page).toHaveURL(/\/dashboard\/employees/);

    // Click Create
    await page.getByRole('link', { name: 'Create Employee' }).click();

    // Fill Form
    const testName = `Test User ${Date.now()}`;
    await page.getByLabel('Name').fill(testName);
    await page.getByLabel('Email').fill(`test${Date.now()}@example.com`);
    await page.getByLabel('Max Hours').fill('20');
    await page.getByLabel('Skills').fill('Cook');

    // Submit
    await page.getByRole('button', { name: 'Create Employee' }).click();

    // Verify Redirect and List
    await expect(page).toHaveURL(/\/dashboard\/employees/);
    await expect(page.getByText(testName)).toBeVisible();

    // Delete (Find row with name, then find delete button)
    // We look for the row content and then the delete button within that scope or relative to it.
    // For simplicity, we just delete the first one that matches or relies on the fact it's arguably the last added.
    // Better: Filter by text.

    // Locate the row containing the text
    const row = page.getByRole('row').filter({ hasText: testName });
    await row.getByRole('button', { name: 'Delete' }).click();

    // Verify deletion (it might take a moment, so we wait for it to detach)
    await expect(page.getByText(testName)).not.toBeVisible();
});
