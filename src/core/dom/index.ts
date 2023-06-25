export type StringMap = Record<string, string>;
export type Listener = (ev: globalThis.Event) => void;
export type ListenerMap = Record<string, Listener>;

export * from "./events";
export * from "./util";
