export type Listener = (ev: globalThis.Event) => void;

export type ListenerMap = Record<string, Listener>;

export function on(eventName: string, listener: Listener) {
  return window.addEventListener(eventName, listener);
}

export function off(eventName: string, listener: Listener) {
  return window.removeEventListener(eventName, listener);
}

export function set(...listeners: ListenerMap[]) {
  for (const map of listeners) {
    for (const alias in map) {
      on(alias, map[alias]);
    }
  }
}

export function unset(...listeners: ListenerMap[]) {
  for (const map of listeners) {
    for (const alias in map) {
      off(alias, map[alias]);
    }
  }
}

// export function trigger(eventName: string, eventDetailData?: any) {
//   return window.dispatchEvent(
//     new globalThis.CustomEvent(eventName, {
//       detail: eventDetailData,
//     })
//   );
// }

// export function readEvent<T>(ev: globalThis.Event): T {
//   return (ev as globalThis.CustomEvent).detail as T;
// }
