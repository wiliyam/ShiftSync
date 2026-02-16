import { test, expect } from '@playwright/test';

test.describe('Admin: Location Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@shiftsync.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(page).toHaveURL(/\/admin/);
    });

    test('locations page renders', async ({ page }) => {
        await page.goto('/admin/locations');

        await expect(page.getByRole('heading', { name: 'Locations' })).toBeVisible();
        await expect(page.getByRole('link', { name: /Add Location/i })).toBeVisible();
    });

    test('"Add Location" button navigates to create form', async ({ page }) => {
        await page.goto('/admin/locations');
        await page.getByRole('link', { name: /Add Location/i }).click();

        await expect(page).toHaveURL(/\/admin\/locations\/create/);
    });

    test('create location form renders all fields', async ({ page }) => {
        await page.goto('/admin/locations/create');

        await expect(page.getByLabel('Location Name')).toBeVisible();
        await expect(page.getByLabel('Address (Optional)')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Location' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Cancel' })).toBeVisible();
    });

    test('create location with valid data', async ({ page }) => {
        await page.goto('/admin/locations/create');

        const locationName = `Test Location ${Date.now()}`;
        await page.getByLabel('Location Name').fill(locationName);
        await page.getByLabel('Address (Optional)').fill('123 Test St, Test City');
        await page.getByRole('button', { name: 'Create Location' }).click();

        // Should redirect to locations list
        await expect(page).toHaveURL(/\/admin\/locations/, { timeout: 10000 });
    });

    test('cancel button returns to locations list', async ({ page }) => {
        await page.goto('/admin/locations/create');
        await page.getByRole('link', { name: 'Cancel' }).click();

        await expect(page).toHaveURL(/\/admin\/locations/);
    });

    test('location cards display location info', async ({ page }) => {
        // First create a location to ensure one exists
        await page.goto('/admin/locations/create');
        const locationName = `Card Test ${Date.now()}`;
        await page.getByLabel('Location Name').fill(locationName);
        await page.getByLabel('Address (Optional)').fill('456 Card Ave');
        await page.getByRole('button', { name: 'Create Location' }).click();
        await expect(page).toHaveURL(/\/admin\/locations/, { timeout: 10000 });

        // Verify the created location appears
        await expect(page.getByText(locationName)).toBeVisible();
        await expect(page.getByText('456 Card Ave')).toBeVisible();
    });

    test('delete location removes it from the list', async ({ page }) => {
        // Create a location to delete
        await page.goto('/admin/locations/create');
        const locationName = `Delete Test ${Date.now()}`;
        await page.getByLabel('Location Name').fill(locationName);
        await page.getByRole('button', { name: 'Create Location' }).click();
        await expect(page).toHaveURL(/\/admin\/locations/, { timeout: 10000 });

        // Find and click delete button for this location
        const locationCard = page.locator('div').filter({ hasText: locationName }).first();
        await locationCard.getByTitle('Delete Location').click();

        // Location should be removed
        await expect(page.getByText(locationName)).not.toBeVisible({ timeout: 5000 });
    });
});
