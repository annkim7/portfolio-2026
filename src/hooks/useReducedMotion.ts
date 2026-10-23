"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

let live = false;

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(QUERY);
  const notify = () => {
    live = true;
    onStoreChange();
  };
  media.addEventListener("change", notify);
  const frame = window.requestAnimationFrame(notify);
  return () => {
    media.removeEventListener("change", notify);
    window.cancelAnimationFrame(frame);
  };
}

function getSnapshot() {
  return live && window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
