"use client"

import * as React from "react"

type Theme = "light" | "dark"

const themeStorageKey = "compgrid-theme"

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(themeStorageKey)
    return stored === "dark" || stored === "light" ? stored : null
  } catch {
    return null
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function persistTheme(theme: Theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme)
  } catch {
    // Storage can be unavailable in privacy-restricted browsers.
  }
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return "light"
    return readStoredTheme() ?? getSystemTheme()
  })

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    applyTheme(theme)

    const onSystemThemeChange = () => {
      if (!readStoredTheme()) {
        const nextTheme = getSystemTheme()
        setTheme(nextTheme)
        applyTheme(nextTheme)
      }
    }

    media.addEventListener?.("change", onSystemThemeChange)

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "d") return
      if (isTypingTarget(event.target)) return

      setTheme((currentTheme) => {
        const nextTheme = currentTheme === "dark" ? "light" : "dark"
        applyTheme(nextTheme)
        persistTheme(nextTheme)
        return nextTheme
      })
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      media.removeEventListener?.("change", onSystemThemeChange)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [theme])

  return <>{children}</>
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

export { ThemeProvider }
