import debounce from "lodash.debounce";

import { ListenerMap, set, unset } from "./dom-events";
import { Boundaries, Destroyable } from "./meta";

export class CanvasManager implements Destroyable {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public listeners: ListenerMap = {};

  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);

    this.listeners = { resize: debounce(this.resize.bind(this)) };
    this.resize();

    set(this.listeners);
    this.context = this.canvas.getContext("2d")!;
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // context.setTransform(1, 0, 0, 1, 0, 0);
    // TODO think about this "motion blur" effect
    // this.context.fillStyle = "rgba(0,0,0,0.3)";
  }

  public getBoundaries(): Boundaries {
    return { width: this.canvas.width, height: this.canvas.height };
  }

  public destroy() {
    unset(this.listeners);
    this.canvas.remove();
  }
}
