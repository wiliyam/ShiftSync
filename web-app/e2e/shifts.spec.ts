import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@shiftsync.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
});

test('create shift', async ({ page }) => {
    // Navigate to Shifts
    await page.getByRole('link', { name: 'Shifts' }).click();
    await expect(page).toHaveURL(/\/dashboard\/shifts/);

    // Click Create
    await page.getByRole('link', { name: 'Create Shift' }).click();

    // Select Employee (Assuming seed data exists or created)
    // We'll select the first option that isn't disabled
    const employeeSelect = page.locator('select#employeeId');
    await employeeSelect.selectOption({ index: 1 }); // Index 0 is placeholder

    // Select Location
    const locationSelect = page.locator('select#locationId');
    await locationSelect.selectOption({ index: 1 });

    // Set Times (Future dates to avoid conflict logic with past seed data if any)
    // We'll just pick current time + 1 hour
    // Note: datetime-local input handling in Playwright can be tricky. 
    // We'll assume the browser handles it or simply fill the string.
    // Format: YYYY-MM-DDTHH:mm
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1); // Next year
    const iso = now.toISOString().slice(0, 16);

    await page.locator('input#start').fill(iso);

    now.setHours(now.getHours() + 4);
    const isoEnd = now.toISOString().slice(0, 16);
    await page.locator('input#end').fill(isoEnd);

    // Submit
    await page.getByRole('button', { name: 'Create Shift' }).click();

    // Verify Redirect
    await expect(page).toHaveURL(/\/dashboard\/shifts/);

    // Check if list has items (we can't easily check exact date without formatting logic, but we can check if a row exists)
    // We expect at least one row now
    await expect(page.getByRole('row')).toHaveCount(2); // Header + 1 Data Row (minimum)
});
