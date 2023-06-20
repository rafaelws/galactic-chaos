import { Clock } from "@/common/Clock";

describe("Clock", () => {
  it("should not be pending", () => {
    const clock = new Clock(200);
    clock.increment(200);
    expect(clock.pending).toBe(false);
  });

  it("should be pending", () => {
    const clock = new Clock(200);
    clock.increment(100);
    expect(clock.pending).toBe(true);
  });

  it("should reset", () => {
    const clock = new Clock(200);
    clock.increment(100);
    expect(clock.pending).toBe(true);

    clock.increment(100);
    expect(clock.pending).toBe(false);

    clock.reset();
    expect(clock.pending).toBe(true);

    clock.increment(200);
    expect(clock.pending).toBe(false);

    clock.increment(200);
    expect(clock.pending).toBe(false);
  });

  it("should change target time", () => {
    const clock = new Clock(100);

    clock.increment(100);
    expect(clock.pending).toBe(false);

    clock.reset();
    clock.targetTime = 500;
    clock.increment(100);
    expect(clock.pending).toBe(true);
  });

  it("should reset and change target time", () => {
    const clock = new Clock(500);
    clock.increment(200);
    expect(clock.pending).toBe(true);

    clock.reset();
    expect(clock.pending).toBe(true);

    clock.increment(500);
    expect(clock.pending).toBe(false);

    clock.increment(6000);
    expect(clock.pending).toBe(false);

    clock.reset();
    expect(clock.pending).toBe(true);

    clock.targetTime = 50;
    clock.increment(1);
    expect(clock.pending).toBe(true);

    clock.increment(-1);
    expect(clock.pending).toBe(true);

    clock.increment(51);
    expect(clock.pending).toBe(false);
  });
});
