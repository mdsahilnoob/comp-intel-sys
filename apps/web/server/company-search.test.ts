import { describe, expect, it } from "vitest";

import { isCompanySearchShortcut } from "@/lib/company-search";

describe("company search keyboard shortcut", () => {
  it("opens for Ctrl+K and Cmd+K without matching other keys", () => {
    expect(
      isCompanySearchShortcut({ key: "k", ctrlKey: true, metaKey: false }),
    ).toBe(true);
    expect(
      isCompanySearchShortcut({ key: "K", ctrlKey: false, metaKey: true }),
    ).toBe(true);
    expect(
      isCompanySearchShortcut({ key: "p", ctrlKey: true, metaKey: false }),
    ).toBe(false);
    expect(
      isCompanySearchShortcut({ key: "k", ctrlKey: false, metaKey: false }),
    ).toBe(false);
  });
});
