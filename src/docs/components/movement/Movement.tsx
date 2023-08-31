import { createEffect, createSignal, JSX, onMount } from "solid-js";

import { cssVar } from "@/core/dom";
import { clamp, lerp, pdivn, pfloor, plerp, PointM } from "@/core/math";
import { Boundaries, Point } from "@/core/meta";
import {
  MovementNature,
  MovementStep,
} from "@/core/objects/shared/movement/MovementParams";

import { Input, Radio, Slider } from "..";
import { Grid } from "./Grid";
import { LineWithHandles } from "./Line";

function pointsFromStep({ p0, p1, p2, p3 }: MovementStep) {
  return [p0, p1, p2, p3]
    .filter((p) => p !== undefined)
    .map((p) => PointM(p!).mtpn(100).trunc().value());
}

export interface StepParams {
  step: MovementStep;
  onUpdate: (step: Partial<MovementStep>) => void;
}

const MIN = 0;
const MAX = 100;

const enumNatures = [
  MovementNature.Linear,
  MovementNature.QuadraticBezier,
  MovementNature.CubicBezier,
];
const natures = ["Linear", "Quadratic", "Cubic"];
type Nature = (typeof natures)[number];

const toNatureString = (nature: MovementNature) => {
  return natures[enumNatures.indexOf(nature)];
};

const toNatureEnum = (nature: Nature) => {
  return enumNatures[natures.indexOf(nature)];
};

export function Movement({ step, onUpdate }: StepParams) {
  const [speed, setSpeed] = createSignal<number>(
    Math.trunc((step.speed || 1) * 10)
  );
  const [nature, setNature] = createSignal<Nature>(toNatureString(step.nature));
  const [pointIx, setPointIx] = createSignal<number>(0);
  const [points, setPoints] = createSignal<Point[]>(pointsFromStep(step));

  let svg: SVGSVGElement | undefined;
  let circleMouseOffsetRef: Point = { x: 0, y: 0 };

  const circleRadius = 5;
  const circleSizeOffset = circleRadius * 1.5;

  const [boundaries, setBoundaries] = createSignal<Boundaries>({
    width: 0,
    height: 0,
  });

  const hasIndex = () => pointIx() >= 0;

  const toAbsolute = (
    value: number,
    boundary: number,
    offset = circleSizeOffset
  ) => {
    return lerp(offset, boundary - offset, value * 0.01);
  };

  const toAbsolutePoint = ({ x, y }: Point) => ({
    x: toAbsolute(x, boundaries().width),
    y: toAbsolute(y, boundaries().height),
  });

  const absolutePoints = () => points().map(toAbsolutePoint);

  createEffect(() => {
    const [p0, p1, p2, p3] = points();
    if (!p0 && !p1) return;
    onUpdate({
      p0: pdivn(p0, 100),
      p1: pdivn(p1, 100),
      p2: p2 ? pdivn(p2, 100) : undefined,
      p3: p3 ? pdivn(p3, 100) : undefined,
    });
  });

  createEffect(() => {
    const curr = speed();
    if (curr > 0) onUpdate({ speed: curr / 10 });
  });

  createEffect(() => {
    if (nature()) onUpdate({ nature: toNatureEnum(nature()) });
  });

  onMount(() => {
    if (!svg) return;
    const { clientWidth, clientHeight } = svg;
    setBoundaries({ width: clientWidth, height: clientHeight });
  });

  function toRelativePoint(
    mousePoint: Point,
    rect: DOMRect,
    { width, height }: Boundaries = boundaries(),
    radius = circleRadius,
    offset = circleSizeOffset,
    mouseOffset = circleMouseOffsetRef
  ): Point {
    const x = mousePoint.x - rect.left - mouseOffset.x;
    const y = mousePoint.y - rect.top - mouseOffset.y;
    const relative = { x, y };

    if (x - radius < 0) relative.x = 0;
    else if (x + offset > width) relative.x = 1;
    else relative.x /= width - offset;

    if (y - radius < 0) relative.y = 0;
    else if (y + offset > height) relative.y = 1;
    else relative.y /= height - offset;

    return PointM(relative).mtpn(100).floor().value();
  }

  function moveTo(point: Point) {
    if (!hasIndex()) return;

    const rect = svg?.getBoundingClientRect();
    if (!rect) return;

    setPoints((prev) => {
      prev[pointIx()] = toRelativePoint(point, rect);
      return [...prev];
    });
  }

  function calculateMouseOffset(el: SVGElement, { x, y }: Point) {
    const { top, left } = el.getBoundingClientRect();
    circleMouseOffsetRef = { x: x - left, y: y - top };
  }

  function dragStart(ev: globalThis.MouseEvent) {
    if (!svg) return;

    const el = ev.target as SVGElement;
    const ix = Number(el.dataset.ix);

    if (el.tagName !== "circle" || isNaN(ix)) return;

    const drag = (ev: globalThis.MouseEvent) =>
      moveTo({ x: ev.clientX, y: ev.clientY });

    const dragEnd = () => {
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", dragEnd);
    };

    setPointIx(ix);
    calculateMouseOffset(el, { x: ev.clientX, y: ev.clientY });
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", dragEnd);
  }

  function handleNatureChange(newNature: Nature) {
    if (newNature === nature()) return;

    const first = points()[0];
    const last = points()[points().length - 1];

    const newPoints: Point[] = [first];

    if (newNature !== natures[0]) {
      if (newNature === natures[1])
        newPoints.push(pfloor(plerp(first, last, 0.5)));
      else
        newPoints.push(
          pfloor(plerp(first, last, 0.333)),
          pfloor(plerp(first, last, 0.666))
        );
    }
    newPoints.push(last);
    setPoints(newPoints);
    setNature(newNature);
  }

  function handleInputChange(
    ix: number,
    axis: "x" | "y"
  ): JSX.EventHandler<HTMLInputElement, InputEvent> {
    return (ev) => {
      let val = Number(ev.currentTarget.value);
      const currVal = points()[ix][axis];

      if (isNaN(val)) {
        ev.currentTarget.value = currVal.toString();
        return;
      }
      if (val === currVal) return;

      val = clamp(val, MIN, MAX);
      ev.currentTarget.value = val.toString();

      setPoints((prev) => {
        prev[ix][axis] = val;
        return [...prev];
      });
    };
  }

  function handleSliderUpdate(axis: "x" | "y") {
    return (value: number) => {
      if (!hasIndex()) return;
      setPoints((prev) => {
        prev[pointIx()][axis] = value;
        return [...prev];
      });
    };
  }

  function handleSpeedChange(speed: number) {
    const normalized = (110 - speed) * 10;
    cssVar("--trajectory-time", `${normalized}ms`, ".plot path.main");
    setSpeed(speed);
  }

  const isCurrent = (ix: number) => pointIx() === ix;
  const getAxis = (axis: "x" | "y") => points()[pointIx()][axis];

  return (
    <div class="movement-container">
      <Radio value={nature()} items={natures} onChange={handleNatureChange} />
      <div class="plot-container">
        <Slider
          min={MIN}
          max={MAX}
          orientation="vertical"
          disabled={!hasIndex()}
          value={getAxis("y")}
          onChange={handleSliderUpdate("y")}
        />
        <svg ref={svg} class="plot" onMouseDown={dragStart}>
          <Grid boundaries={boundaries()} />
          <LineWithHandles points={absolutePoints()} />
          {absolutePoints().map((point, ix) => (
            <circle
              classList={{ current: isCurrent(ix) }}
              cx={point.x}
              cy={point.y}
              r={circleRadius}
              data-ix={ix}
            />
          ))}
        </svg>
      </div>
      <Slider
        min={MIN}
        max={MAX}
        orientation="horizontal"
        disabled={!hasIndex()}
        value={getAxis("x")}
        onChange={handleSliderUpdate("x")}
        class="x-axis"
      />
      {points().map((point, ix) => (
        <label class="point" classList={{ current: isCurrent(ix) }}>
          P{ix}| x:
          <Input
            value={point.x}
            onFocus={() => setPointIx(ix)}
            onInput={handleInputChange(ix, "x")}
          />
          y:
          <Input
            value={point.y}
            onFocus={() => setPointIx(ix)}
            onInput={handleInputChange(ix, "y")}
          />
        </label>
      ))}
      <Slider
        label="Speed"
        class="speed"
        value={speed()}
        min={1}
        max={100}
        onChange={handleSpeedChange}
      />
    </div>
  );
}
