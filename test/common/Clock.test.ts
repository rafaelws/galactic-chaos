import { Clock } from "../../src/common";

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
});
