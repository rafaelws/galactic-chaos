export function iterate<T>(
  items: T[],
  fn: (item: T, index: number) => void
): void {
  for (let i = 0; i < items.length; i++) {
    fn(items[i], i);
  }
}

export function throttle(fn: Function, time = 200) {
  let lastCallTime = Date.now() + time;
  return () => {
    const now = Date.now();
    if (now - lastCallTime >= time) {
      fn(arguments);
      lastCallTime = now;
    }
  };
}
