import { test, expect } from '@playwright/test';

test.describe('Employee Role: Access Control', () => {
    // Note: These tests require a seeded employee user in the database.
    // If no employee user exists, these tests verify the access control
    // logic from an unauthenticated perspective.

    test('unauthenticated user cannot access /dashboard', async ({ page }) => {
        await page.goto('/dashboard');

        // Should redirect to login
        await expect(page).toHaveURL(/\/login/);
    });

    test('admin user sees admin dashboard, not employee dashboard', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@shiftsync.com');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Log in' }).click();

        // Admin should be redirected to /admin, not /dashboard
        await expect(page).toHaveURL(/\/admin/);
        await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
    });
});
