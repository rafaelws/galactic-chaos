export function $<T extends Element>(query: string) {
  return document.querySelector<T>(query);
}

export function changeDisplay(elId: string, visible = true): void {
  document.getElementById(elId)!.style.display = visible ? "block" : "none";
}

export const show = (elId: string) => changeDisplay(elId, true);

export const hide = (elId: string) => changeDisplay(elId, false);

export const fadeIn = (query: string) => {
  const $el = $(query);
  $el?.classList.remove("fade-out");
  $el?.classList.add("fade-in");
};

export const fadeOut = (query: string) => {
  const $el = $(query);
  $el?.classList.remove("fade-in");
  $el?.classList.add("fade-out");
};
