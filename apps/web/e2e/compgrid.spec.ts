import { expect, test } from "@playwright/test"

test("explores the market and reaches the primary workflows", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "CompGrid" })).toBeVisible()
  await page.getByLabel("Role").selectOption("software-engineer")
  await page.getByLabel("Location").selectOption("bengaluru")
  await expect(page).toHaveURL(/role=software-engineer/)
  await expect(page.getByText("Compensation submissions")).toBeVisible()

  await page.getByRole("link", { name: "Companies" }).click()
  await expect(page).toHaveURL(/companies$/)
  await expect(page.getByRole("heading", { name: "Compare the market by employer" })).toBeVisible()

  await page.goto("/compare")
  await expect(page).toHaveURL(/compare$/)
  await expect(page.getByRole("heading", { name: "Put offers on the same grid" })).toBeVisible()

  await page.goto("/submit")
  await expect(page).toHaveURL(/submit$/)
  await expect(page.getByRole("heading", { name: "Make the market more legible" })).toBeVisible()
})
