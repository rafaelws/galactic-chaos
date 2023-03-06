import { lerpCoordinate, shaper } from "@/common/math";
import { Boundaries, Concrete, Coordinate } from "@/common/meta";
import { Step, MovementNature, MovementParams } from "./MovementParams";

/**
4 params: starting x or y, length, amplitude, frequency
uma coordenada se move de forma linear, e.g: x += delta * speed;
a outra coordenada: y += Math.sin(x * length + frequency) * amplitude * delta * speed;
*/

export class Movement {
  private readonly defaults = {
    speed: 0.1,
    nature: MovementNature.LINEAR,
  };

  private steps: Step[];
  private stepIndex = -1;
  // private repeatable: boolean;
  // private reverseable: boolean;

  private current: Concrete<Step> | null = null;
  private next: Concrete<Step> | null = null;

  private from: Coordinate | null = null;
  private to: Coordinate | null = null;
  private deltaSum: number = 0;

  constructor(
    private readonly delta: number,
    private readonly world: Boundaries,
    private readonly object: Boundaries,
    params: MovementParams
  ) {
    this.steps = params.steps;
    // this.repeatable = params?.repeatable || false;
    // this.reverseable = params?.reverseable || false;
    this.step();
  }

  private step() {
    ++this.stepIndex;

    /*
    if (this.stepIndex >= this.steps.length)
      console.log("current step is out of bounds");

    if (this.stepIndex + 1 >= this.steps.length)
      console.log("next step is out of bounds");
    */

    this.current = null;
    this.next = null;

    const current = this.steps[this.stepIndex];
    if (!!current)
      this.current = {
        ...this.defaults,
        ...this.steps[this.stepIndex],
      };

    const nextIndex = this.stepIndex + 1;
    const next = this.steps[nextIndex];
    if (!!next)
      this.next = {
        ...this.defaults,
        ...this.steps[nextIndex],
      };

    // console.log({ steps: this.steps, current: this.current, next: this.next });
  }

  public startPosition(): Coordinate {
    const start = this.current?.position;
    let { x, y } = this.worldPosition(start);

    if (start?.x === 0) x -= this.object.width;
    if (start?.y === 0) y -= this.object.height;

    // console.log({ startPosition: { x, y } });

    return { x, y };
  }

  private worldPosition(target: Coordinate = { x: 0, y: 0 }) {
    return { x: target.x * this.world.width, y: target.y * this.world.height };
  }

  private factor() {
    this.deltaSum += this.delta;
    return this.deltaSum * 0.0001 * (this.current?.speed || 1);
  }

  public update(): Coordinate {
    if (this.from === null) {
      this.from = this.startPosition();
    }

    if (this.to === null) {
      this.to = this.worldPosition(this.next?.position);
    }

    // const t = shaper.easeInOutSine(this.factor());
    const t = this.factor();
    // console.log({ deltaSum: this.deltaSum, tFunction: t });
    const { x, y } = lerpCoordinate(this.from, this.to, t);

    // next movement
    if (t >= 1) {
      // console.log(">= 1");
      this.from = null;
      this.to = null;
      this.deltaSum = 0;
      this.step();
      // return this.update({ x, y }, world, delta);
    }
    // TODO handle repeatable and reversable
    return { x, y };
  }
}
