export function dice() {
  return rir(0, 2) > 1;
}

/**
 * Random number In Range
 *
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function rir(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Random Integer In Range
 *
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function riir(min: number, max: number) {
  return Math.floor(rir(min, max));
}
