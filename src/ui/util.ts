export const $ = (query: string) => document.querySelector(query);

export function changeDisplay(elId: string, visible = true): void {
  document.getElementById(elId)!.style.display = visible ? "block" : "none";
}

export const show = (elId: string) => changeDisplay(elId, true);

export const hide = (elId: string) => changeDisplay(elId, false);
