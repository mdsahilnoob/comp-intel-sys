import * as React from "react"

const MOBILE_BREAKPOINT = 768

function subscribeToViewport(callback: () => void) {
  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mediaQuery.addEventListener("change", callback)

  return () => mediaQuery.removeEventListener("change", callback)
}

function getIsMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeToViewport,
    getIsMobile,
    () => false,
  )
}
