const fallbackSiteUrl = "http://localhost:3000"

function normalizeSiteUrl(value: string | undefined) {
  if (!value?.trim()) return fallbackSiteUrl

  try {
    return new URL(value.trim()).toString().replace(/\/$/, "")
  } catch {
    return fallbackSiteUrl
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL)
