"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "rigis:querystate";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(EVENT, callback);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

/**
 * Keeps a filter value in the URL query string so filtered views can be
 * shared and survive back/forward, without a server. Uses replaceState to
 * avoid a navigation per keystroke.
 */
export function useQueryState(key: string, fallback = "") {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const value = new URLSearchParams(search).get(key) ?? fallback;

  const update = useCallback(
    (next: string) => {
      const url = new URL(window.location.href);
      if (next && next !== fallback) url.searchParams.set(key, next);
      else url.searchParams.delete(key);
      window.history.replaceState(window.history.state, "", url);
      window.dispatchEvent(new Event(EVENT));
    },
    [key, fallback],
  );

  return [value, update] as const;
}

const subscribeHover = (cb: () => void) => {
  const mq = window.matchMedia("(hover: none)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True on devices without hover (touch screens). */
export function useIsTouch() {
  return useSyncExternalStore(
    subscribeHover,
    () => window.matchMedia("(hover: none)").matches,
    () => false,
  );
}
