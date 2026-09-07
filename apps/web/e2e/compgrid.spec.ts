import { expect, test } from "@playwright/test";

test("renders the explorer at its direct route", async ({ page }) => {
  const response = await page.goto("/explore");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "CompGrid" })).toBeVisible();
});

test("serves the marketing landing page at the root route", async ({
  page,
}) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Know what you’re really worth." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore compensation" }).first(),
  ).toHaveAttribute("href", "/explore");
});

test("links the CompGrid wordmark to the home route", async ({ page }) => {
  await page.goto("/explore");

  await expect(
    page.locator("header").getByRole("link", { name: "CompGrid home" }),
  ).toHaveAttribute("href", "/");
});

test("keeps the comparison story readable and synchronized on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });

  const steps = page.locator("#story .story-step");
  await expect(steps).toHaveCount(3);
  await expect(page.locator("#story .story-mobile-visual")).toHaveCount(3);

  for (let index = 0; index < 3; index += 1) {
    await page.evaluate((stepIndex) => {
      const element =
        document.querySelectorAll("#story .story-step")[stepIndex];
      if (!element) return;

      window.scrollTo(
        0,
        window.scrollY +
          element.getBoundingClientRect().top -
          window.innerHeight * 0.28,
      );
    }, index);

    await expect(steps.nth(index)).toHaveClass(/is-active/);
    await expect(
      steps.nth(index).locator(".story-mobile-visual"),
    ).toBeVisible();
    await expect(
      steps.nth(index).locator(".story-mobile-visual"),
    ).toBeInViewport();
  }
});

test("keeps the desktop story visualization visible for every step", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });

  const steps = page.locator("#story .story-step");
  const visual = page.locator("#story .story-visual");

  for (let index = 0; index < 3; index += 1) {
    await page.evaluate((stepIndex) => {
      const element =
        document.querySelectorAll("#story .story-step")[stepIndex];
      if (!element) return;

      window.scrollTo(
        0,
        window.scrollY +
          element.getBoundingClientRect().top -
          window.innerHeight * 0.28,
      );
    }, index);

    await expect(steps.nth(index)).toHaveClass(/is-active/);
    await expect(visual).toBeVisible();
    await expect(visual).toBeInViewport();
    await expect(page.locator("#story .story-visual-index")).toHaveText(
      `${String(index + 1).padStart(2, "0")} / 03`,
    );
  }
});

test("presents the comparison story as a stable data module", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("#story").scrollIntoViewIfNeeded();

  await expect(page.locator("#story .story-visual-chrome")).toBeVisible();
  await expect(page.locator("#story .story-visual-index")).toHaveText(
    "01 / 03",
  );
  await expect(page.locator("#story .story-step-status")).toHaveCount(3);
});

test("explores the market and reaches the primary workflows", async ({
  page,
}) => {
  await page.goto("/explore");
  await expect(page).toHaveURL(/\/explore$/);
  await expect(page.getByRole("heading", { name: "CompGrid" })).toBeVisible();
  await page.getByLabel("Role").selectOption("software-engineer");
  await page.getByLabel("Location").selectOption("bengaluru");
  await expect(page).toHaveURL(/role=software-engineer/);
  await expect(page.getByText("Compensation submissions")).toBeVisible();

  await page
    .getByLabel("Primary navigation")
    .getByRole("link", { name: "Companies" })
    .click();
  await expect(page).toHaveURL(/companies$/);
  await expect(
    page.getByRole("heading", { name: "Compare the market by employer" }),
  ).toBeVisible();

  await page.goto("/compare");
  await expect(page).toHaveURL(/compare$/);
  await expect(
    page.getByRole("heading", { name: "Put offers on the same grid" }),
  ).toBeVisible();

  await page.goto("/submit");
  await expect(page).toHaveURL(/submit$/);
  await expect(
    page.getByRole("heading", { name: "Make the market more legible" }),
  ).toBeVisible();
});

test("discovers AI companies from the searchable directory", async ({
  page,
}) => {
  await page.goto("/companies");

  await expect(
    page.getByRole("heading", {
      name: "Discover companies shaping artificial intelligence.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Demo ecosystem catalog")).toBeVisible();

  await page.getByLabel("Search companies").fill("openai");
  await page.getByRole("button", { name: "Apply" }).click();

  await expect(page).toHaveURL(/search=openai/);
  await expect(page.getByRole("heading", { name: "OpenAI" })).toBeVisible();
  await expect(page.getByText("1 company")).toBeVisible();
  await expect(page.getByRole("link", { name: "View company" })).toHaveCount(1);
  await page.getByRole("link", { name: "View company" }).click();

  await expect(page).toHaveURL(/\/companies\/openai$/);
  await expect(
    page.getByRole("heading", { name: "Products & tools" }),
  ).toBeVisible();
  await expect(page.getByText("ChatGPT")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Related companies" }),
  ).toBeVisible();
});

test("keeps the AI companies directory usable on a narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/companies?category=robotics");

  await expect(
    page.getByRole("heading", {
      name: "Discover companies shaping artificial intelligence.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Robotics/ }).first(),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
});
