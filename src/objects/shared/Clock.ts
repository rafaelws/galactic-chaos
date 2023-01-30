export class Clock {
  private timePast: number;

  constructor(public targetTime: number, startFull = false) {
    this.timePast = startFull ? targetTime : 0;
  }

  public increment(time: number) {
    if (this.pending) {
      this.timePast += time;
    }
  }

  public get pending() {
    return this.timePast < this.targetTime;
  }

  public reset() {
    this.timePast = 0;
  }
}
