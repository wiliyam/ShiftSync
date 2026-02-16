import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@shiftsync.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(page).toHaveURL(/\/admin/);
    });

    test('displays dashboard heading', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
    });

    test('displays stat cards', async ({ page }) => {
        await expect(page.getByText('Total Employees')).toBeVisible();
        await expect(page.getByText('Active Shifts')).toBeVisible();
        await expect(page.getByText('Locations')).toBeVisible();
    });

    test('displays quick actions section', async ({ page }) => {
        await expect(page.getByText('Quick Actions')).toBeVisible();
        await expect(page.getByRole('link', { name: /Add Employee/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Add Location/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Create Schedule/i })).toBeVisible();
    });

    test('quick action "Add Employee" navigates correctly', async ({ page }) => {
        await page.getByRole('link', { name: /Add Employee/i }).click();
        await expect(page).toHaveURL(/\/admin\/employees\/create/);
    });

    test('quick action "Add Location" navigates correctly', async ({ page }) => {
        await page.getByRole('link', { name: /Add Location/i }).click();
        await expect(page).toHaveURL(/\/admin\/locations\/create/);
    });

    test('quick action "Create Schedule" navigates correctly', async ({ page }) => {
        await page.getByRole('link', { name: /Create Schedule/i }).click();
        await expect(page).toHaveURL(/\/admin\/shifts\/create/);
    });
});

test.describe('Admin Sidebar Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@shiftsync.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(page).toHaveURL(/\/admin/);
    });

    test('desktop sidebar shows navigation links', async ({ page, isMobile }) => {
        test.skip(!!isMobile, 'Desktop-only test');

        await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Employees/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Shifts/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Locations/i })).toBeVisible();
    });

    test('sidebar "Employees" link navigates correctly', async ({ page, isMobile }) => {
        test.skip(!!isMobile, 'Desktop-only test');

        await page.getByRole('link', { name: /Employees/i }).first().click();
        await expect(page).toHaveURL(/\/admin\/employees/);
    });

    test('sidebar "Shifts" link navigates correctly', async ({ page, isMobile }) => {
        test.skip(!!isMobile, 'Desktop-only test');

        await page.getByRole('link', { name: /Shifts/i }).first().click();
        await expect(page).toHaveURL(/\/admin\/shifts/);
    });

    test('sidebar "Locations" link navigates correctly', async ({ page, isMobile }) => {
        test.skip(!!isMobile, 'Desktop-only test');

        await page.getByRole('link', { name: /Locations/i }).first().click();
        await expect(page).toHaveURL(/\/admin\/locations/);
    });

    test('mobile hamburger menu opens sidebar', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'Mobile-only test');

        // On mobile, the sidebar is hidden by default
        // Click the hamburger/menu button to open it
        const menuButton = page.getByRole('button', { name: /menu|toggle/i }).or(page.locator('button:has(svg)').first());
        await menuButton.click();

        // Sidebar sheet should be visible
        await expect(page.getByText('ShiftSync')).toBeVisible();
    });
});
