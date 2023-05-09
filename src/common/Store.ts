export namespace Store {
  const localStorageKey = "galactic.chaos@store_";

  /**
   * stores a json object
   */
  export function set(key: string, value: any): void {
    window.localStorage.setItem(
      `${localStorageKey}${key}`,
      JSON.stringify(value)
    );
  }

  /**
   * returns a json object
   */
  export function get(key: string) {
    const value = window.localStorage.getItem(`${localStorageKey}${key}`);
    if (!!value) return JSON.parse(value);
  }
}
