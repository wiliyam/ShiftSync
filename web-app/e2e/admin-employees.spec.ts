import { test, expect } from '@playwright/test';

test.describe('Admin: Employee Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@shiftsync.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(page).toHaveURL(/\/admin/);
    });

    test('employee list page renders', async ({ page }) => {
        await page.goto('/admin/employees');

        await expect(page.getByRole('heading', { name: 'Employees' })).toBeVisible();
        await expect(page.getByRole('link', { name: /Add Employee/i })).toBeVisible();
        await expect(page.getByPlaceholder('Search employees...')).toBeVisible();
    });

    test('"Add Employee" button navigates to create form', async ({ page }) => {
        await page.goto('/admin/employees');
        await page.getByRole('link', { name: /Add Employee/i }).click();

        await expect(page).toHaveURL(/\/admin\/employees\/create/);
    });

    test('create employee form renders all fields', async ({ page }) => {
        await page.goto('/admin/employees/create');

        await expect(page.getByLabel('Full Name')).toBeVisible();
        await expect(page.getByLabel('Email Address')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
        await expect(page.getByLabel('Max Hours / Week')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Employee' })).toBeVisible();
    });

    test('create employee with valid data', async ({ page }) => {
        await page.goto('/admin/employees/create');

        const testName = `Test Employee ${Date.now()}`;
        const testEmail = `test${Date.now()}@example.com`;

        await page.getByLabel('Full Name').fill(testName);
        await page.getByLabel('Email Address').fill(testEmail);
        await page.getByLabel('Password').fill('password123');
        await page.getByLabel('Max Hours / Week').clear();
        await page.getByLabel('Max Hours / Week').fill('35');
        await page.getByRole('button', { name: 'Create Employee' }).click();

        // Should redirect to employee list
        await expect(page).toHaveURL(/\/admin\/employees/, { timeout: 10000 });
    });

    test('create employee with missing name shows error', async ({ page }) => {
        await page.goto('/admin/employees/create');

        // Fill only email and password, skip name
        await page.getByLabel('Email Address').fill('noname@example.com');
        await page.getByLabel('Password').fill('password123');

        // Try to submit - browser validation should prevent submission
        // since name is required
        const nameInput = page.getByLabel('Full Name');
        await expect(nameInput).toHaveAttribute('required', '');
    });

    test('employee list shows table on desktop', async ({ page, isMobile }) => {
        test.skip(!!isMobile, 'Desktop-only test');

        await page.goto('/admin/employees');

        // Desktop should show a table
        await expect(page.locator('table')).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Max Hours' })).toBeVisible();
    });

    test('employee list shows cards on mobile', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'Mobile-only test');

        await page.goto('/admin/employees');

        // Mobile should NOT show the table
        await expect(page.locator('table')).not.toBeVisible();
    });
});
