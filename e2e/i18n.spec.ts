import { test, expect } from "@playwright/test";

test("switches locale via the header and persists across navigation", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back" })
  ).toBeVisible();

  await page.getByRole("button", { name: "PT" }).click();
  await expect(page).toHaveURL("/pt/login");
  await expect(
    page.getByRole("heading", { name: "Bem-vindo de volta" })
  ).toBeVisible();

  await page
    .getByRole("main")
    .getByRole("link", { name: "Criar conta" })
    .click();
  await expect(page).toHaveURL("/pt/register");
  await expect(
    page.getByRole("heading", { name: "Criar uma conta" })
  ).toBeVisible();
});
