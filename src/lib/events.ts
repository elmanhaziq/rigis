/**
 * Lightweight cross-component events for the homepage story, so explorers
 * stay decoupled: e.g. choosing a research interest in a researcher panel
 * selects that area in the research explorer.
 */
export const SELECT_AREA_EVENT = "rigis:select-area";

export function requestAreaSelection(slug: string, scrollTo = "research") {
  window.dispatchEvent(new CustomEvent<string>(SELECT_AREA_EVENT, { detail: slug }));
  const target = document.getElementById(scrollTo);
  if (target) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
}

export const OPEN_RESEARCHER_EVENT = "rigis:open-researcher";

/**
 * Asks an on-page researcher explorer to open a profile panel. Returns true if
 * one handled it; otherwise the caller should fall back to the profile page.
 */
export function requestResearcherPanel(slug: string): boolean {
  const event = new CustomEvent<string>(OPEN_RESEARCHER_EVENT, { detail: slug, cancelable: true });
  return !window.dispatchEvent(event);
}
