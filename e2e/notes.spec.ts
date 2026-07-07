import { test, expect } from "@playwright/test";

function uniqueEmail() {
  return `e2e-notes-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

test("redirects to login when visiting /notes without a session", async ({
  page,
}) => {
  await page.goto("/notes");
  await expect(page).toHaveURL("/login");
});

test("create and delete a note", async ({ page }) => {
  const email = uniqueEmail();
  const password = "password123";

  await page.goto("/register");
  await page.getByLabel("Name").fill("Notes E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page).toHaveURL("/dashboard");

  await page.goto("/notes");
  await page.getByLabel("Title").fill("My first note");
  await page.getByLabel("Content").fill("Written by the E2E test.");
  await page.getByRole("button", { name: "Add note" }).click();

  await expect(page.getByText("My first note")).toBeVisible();

  await page.getByRole("button", { name: "Delete note" }).click();
  await expect(page.getByText("No notes yet.")).toBeVisible();

  await page.goto("/account");
  await page.locator("#delete-password").fill(password);
  await page.getByRole("button", { name: "Delete account" }).click();
});
