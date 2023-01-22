export function iterate<T>(
  items: T[],
  fn: (item: T, index: number) => void
): void {
  for (let i = 0; i < items.length; i++) {
    fn(items[i], i);
  }
}
