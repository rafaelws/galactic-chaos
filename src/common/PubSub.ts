type Subscribers = {
  [topic: string]: Listener;
}

type Listener = (data?: any) => void;

type UnsubFn = () => void;

export class PubSub {
  private topics: Map<string, Map<string, Listener>>;

  constructor() {
    this.topics = new Map<string, Map<string, Listener>>();
  }

  private genToken(): string {
    return Math.random().toString(16).slice(2) + Date.now();
  }

  public pub(topic: string, message?: any) {
    const topics = this.topics.get(topic);
    if (!topics) return;

    for (const [, listener] of topics) {
      setTimeout(() => listener(message), 0);
    }
  }

  private unsub(topic: string, token: string) {
    this.topics.get(topic)?.delete(token);
  }

  public sub(topic: string, listener: Listener) {
    const token = this.genToken();

    if (this.topics.get(topic) === undefined)
      this.topics.set(topic, new Map<string, Listener>());

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