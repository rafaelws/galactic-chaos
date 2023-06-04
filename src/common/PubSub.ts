export type Subscribers = {
  [topic: string]: SubFn;
}
export type UnsubFn = () => void;
export type SubFn = (data?: any) => void;

export class PubSub {
  private topics: Map<string, Map<string, SubFn>>;

  constructor() {
    this.topics = new Map<string, Map<string, SubFn>>();
  }

  private genToken(): string {
    return Math.random().toString(16).slice(2) + Date.now();
  }

  public pub(topic: string, message?: any) {
    const topics = this.topics.get(topic);
    if (!topics) return;

    topics.forEach(listener => {
      // setTimeout(() => listener(message), 0);
      listener(message);
    });
  }

  private unsub(topic: string, token: string) {
    this.topics.get(topic)?.delete(token);
  }

  public sub(topic: string, listener: SubFn) {
    const token = this.genToken();

    if (this.topics.get(topic) === undefined)
      this.topics.set(topic, new Map<string, SubFn>());

    this.topics.get(topic)?.set(token, listener);

    return () => this.unsub(topic, token);
  }

  public register(subscribers: Subscribers) {
    const unsubs: UnsubFn[] = [];

    for (const topic in subscribers)
      unsubs.push(this.sub(topic, subscribers[topic]));

    return () => unsubs.map(unsub => unsub());
  }
}