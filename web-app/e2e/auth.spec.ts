import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('login page renders correctly', async ({ page }) => {
        await page.goto('/login');

        await expect(page).toHaveTitle(/ShiftSync/);
        await expect(page.getByText('Welcome Back')).toBeVisible();
        await expect(page.getByText('Please sign in to your account')).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
    });

    test('admin login redirects to /admin', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill('admin@shiftsync.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Log in' }).click();

        await expect(page).toHaveURL(/\/admin/);
        await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
    });

    test('invalid credentials shows error', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill('wrong@example.com');
        await page.getByLabel('Password').fill('wrongpassword');
        await page.getByRole('button', { name: 'Log in' }).click();

        // Should stay on login page and show error
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible();
    });

    test('unauthenticated user is redirected to login', async ({ page }) => {
        await page.goto('/admin');

        // Should redirect to login
        await expect(page).toHaveURL(/\/login/);
    });

    test('unauthenticated user cannot access admin employees', async ({ page }) => {
        await page.goto('/admin/employees');

        await expect(page).toHaveURL(/\/login/);
    });

    test('unauthenticated user cannot access admin locations', async ({ page }) => {
        await page.goto('/admin/locations');

        await expect(page).toHaveURL(/\/login/);
    });

    test('unauthenticated user cannot access admin shifts', async ({ page }) => {
        await page.goto('/admin/shifts');

        await expect(page).toHaveURL(/\/login/);
    });
});
