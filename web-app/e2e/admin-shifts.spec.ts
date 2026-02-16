import { test, expect } from '@playwright/test';

test.describe('Admin: Shift Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@shiftsync.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(page).toHaveURL(/\/admin/);
    });

    test('shifts page renders with week view', async ({ page }) => {
        await page.goto('/admin/shifts');

        await expect(page.getByRole('heading', { name: 'Shift Schedule' })).toBeVisible();
        await expect(page.getByRole('link', { name: /Add Shift/i })).toBeVisible();
    });

    test('week navigation buttons are visible', async ({ page }) => {
        await page.goto('/admin/shifts');

        await expect(page.getByRole('link', { name: /Prev/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Next/i })).toBeVisible();
    });

    test('navigate to previous week', async ({ page }) => {
        await page.goto('/admin/shifts');

        const currentUrl = page.url();
        await page.getByRole('link', { name: /Prev/i }).click();

        // URL should change with a date parameter
        await expect(page).toHaveURL(/date=/);
    });

    test('navigate to next week', async ({ page }) => {
        await page.goto('/admin/shifts');

        await page.getByRole('link', { name: /Next/i }).click();

        await expect(page).toHaveURL(/date=/);
    });

    test('"Add Shift" button navigates to create form', async ({ page }) => {
        await page.goto('/admin/shifts');
        await page.getByRole('link', { name: /Add Shift/i }).click();

        await expect(page).toHaveURL(/\/admin\/shifts\/create/);
    });

    test('create shift form renders all fields', async ({ page }) => {
        await page.goto('/admin/shifts/create');

        await expect(page.getByLabel('Location')).toBeVisible();
        await expect(page.getByLabel('Employee (Optional)')).toBeVisible();
        await expect(page.getByLabel('Start Time')).toBeVisible();
        await expect(page.getByLabel('End Time')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Shift' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Cancel' })).toBeVisible();
    });

    test('cancel button returns to shifts page', async ({ page }) => {
        await page.goto('/admin/shifts/create');
        await page.getByRole('link', { name: 'Cancel' }).click();

        await expect(page).toHaveURL(/\/admin\/shifts/);
    });

    test('week view displays day headers', async ({ page }) => {
        await page.goto('/admin/shifts');

        // Check for day abbreviations in the week view
        const dayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (const day of dayAbbreviations) {
            await expect(page.getByText(day, { exact: true }).first()).toBeVisible();
        }
    });

    test('create shift with valid data', async ({ page }) => {
        await page.goto('/admin/shifts/create');

        // Select location (first available)
        const locationSelect = page.locator('select#locationId');
        const locationOptions = locationSelect.locator('option');
        const optionCount = await locationOptions.count();

        // Skip if no locations available (need seed data)
        if (optionCount <= 1) {
            test.skip(true, 'No locations available for shift creation');
            return;
        }

        await locationSelect.selectOption({ index: 1 });

        // Set times
        const now = new Date();
        now.setDate(now.getDate() + 7); // Next week
        now.setHours(9, 0, 0, 0);
        const startTime = now.toISOString().slice(0, 16);

        now.setHours(17, 0, 0, 0);
        const endTime = now.toISOString().slice(0, 16);

        await page.locator('input#start').fill(startTime);
        await page.locator('input#end').fill(endTime);

        await page.getByRole('button', { name: 'Create Shift' }).click();

        // Should redirect to shifts list
        await expect(page).toHaveURL(/\/admin\/shifts/, { timeout: 10000 });
    });
});
