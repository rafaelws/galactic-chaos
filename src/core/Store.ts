const localStorageKey = "galactic.chaos@store_";

export class Store {
  /**
   * stores a json object
   */
  public static set(key: string, value: unknown): void {
    window.localStorage.setItem(
      `${localStorageKey}${key}`,
      JSON.stringify(value)
    );
  }

  /**
   * returns a json object
   */
  public static get(key: string) {
    const value = window.localStorage.getItem(`${localStorageKey}${key}`);
    if (value) return JSON.parse(value);
  }
}
