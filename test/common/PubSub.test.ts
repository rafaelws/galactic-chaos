import { PubSub } from "@/common/PubSub";

describe("PubSub", () => {
  it("should sub and pub", () => {
    const topic = "foo";
    const ps = new PubSub();

    const sub = (n: number) => expect(n).toBe(1);

    ps.sub(topic, sub);
    ps.pub(topic, 1);
  });

  it("should unsub", () => {
    const topic = "foo";
    const ps = new PubSub();

    const sub = (n: number) => expect(n).toBe(2);

    const unsub = ps.sub(topic, sub);
    ps.pub(topic, 2);

    unsub();
    ps.pub(topic, 3);
  });

  it("should register and unregister", () => {
    const topic1 = "foo";
    const topic2 = "bar";

    const sub = (n: number) => expect(n > 0).toBe(true);

    const ps = new PubSub();

    const unregister = ps.register({
      [topic1]: sub,
      [topic2]: sub,
    });

    ps.pub(topic1, 1);
    ps.pub(topic2, 2);
    ps.pub(topic2, 3);

    unregister();

    ps.pub(topic1, -1);
    ps.pub(topic2, -2);
  });

  // it('should register and unregister', () => {
  //   const topic1 = 'foo';
  //   const topic2 = 'bar';

  //   const sub = (n: number) => expect(n > 0).toBe(true);

  //   const unregister = register({
  //     [topic1]: sub,
  //     [topic2]: sub,
  //   })

  //   pub(topic1, 1);
  //   pub(topic2, 2);
  //   pub(topic2, 3);

  //   unregister();

  //   pub(topic1, -1);
  //   pub(topic2, -2);
  // });
});