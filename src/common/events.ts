export type Listener = (ev: globalThis.Event) => void;

export interface ListenerMap {
  [name: string]: Listener;
}

export function on(eventName: string, listener: Listener) {
  return window.addEventListener(eventName, listener);
}

export function off(eventName: string, listener: Listener) {
  return window.removeEventListener(eventName, listener);
}

export function trigger(eventName: string, eventDetailData?: any) {
  return window.dispatchEvent(
    new CustomEvent(eventName, { detail: eventDetailData || null })
  );
}

export function set(...listeners: ListenerMap[]) {
  for (let map of listeners) {
    for (let alias in map) {
      on(alias, map[alias]);
    }
  }
}

export function unset(...listeners: ListenerMap[]) {
  for (let map of listeners) {
    for (let alias in map) {
      off(alias, map[alias]);
    }
  }
}
