"use client";

import { useSyncExternalStore } from "react";

const query = "(max-width: 700px)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// Same breakpoint as the mobile shell; the server renders the desktop fallback.
export function useMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
