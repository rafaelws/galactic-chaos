export function iterate<T>(
  items: T[],
  fn: (item: T, index: number) => boolean | void
): void {
  for (let i = 0; i < items.length; i++) {
    if (fn(items[i], i) === false) {
      break;
    }
  }
}

/* eslint-disable */
export function throttle(fn: (...args: any) => void, time = 200) {
  let lastCallTime = Date.now() + time;
  return (...args: any) => {
    const now = Date.now();
    if (now - lastCallTime >= time) {
      fn(...args);
      lastCallTime = now;
    }
  };
}
