import { expect, test } from "@playwright/test"

test("renders the explorer at its direct route", async ({ page }) => {
  const response = await page.goto("/explore")

  expect(response?.status()).toBe(200)
  await expect(page.getByRole("heading", { name: "CompGrid" })).toBeVisible()
})

test("serves the marketing landing page at the root route", async ({ page }) => {
  const response = await page.goto("/")

  expect(response?.status()).toBe(200)
  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole("heading", { name: "Know what you’re really worth." }),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Explore compensation" }).first(),
  ).toHaveAttribute("href", "/explore")
})

test("links the CompGrid wordmark to the home route", async ({ page }) => {
  await page.goto("/explore")

  await expect(page.getByRole("link", { name: "CompGrid home" })).toHaveAttribute(
    "href",
    "/",
  )
})

test("explores the market and reaches the primary workflows", async ({ page }) => {
  await page.goto("/explore")
  await expect(page).toHaveURL(/\/explore$/)
  await expect(page.getByRole("heading", { name: "CompGrid" })).toBeVisible()
  await page.getByLabel("Role").selectOption("software-engineer")
  await page.getByLabel("Location").selectOption("bengaluru")
  await expect(page).toHaveURL(/role=software-engineer/)
  await expect(page.getByText("Compensation submissions")).toBeVisible()

  await page.getByLabel("Primary navigation").getByRole("link", { name: "Companies" }).click()
  await expect(page).toHaveURL(/companies$/)
  await expect(page.getByRole("heading", { name: "Compare the market by employer" })).toBeVisible()

  await page.goto("/compare")
  await expect(page).toHaveURL(/compare$/)
  await expect(page.getByRole("heading", { name: "Put offers on the same grid" })).toBeVisible()

  await page.goto("/submit")
  await expect(page).toHaveURL(/submit$/)
  await expect(page.getByRole("heading", { name: "Make the market more legible" })).toBeVisible()
})
