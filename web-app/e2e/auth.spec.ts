import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/login');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ShiftSync/);
});

test('can login as admin', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('admin@shiftsync.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    // Expect to see "Dashboard" heading
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
