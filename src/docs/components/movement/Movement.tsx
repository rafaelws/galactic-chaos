import "./styles.css";

import debounce from "lodash.debounce";
import { createSignal, For, JSX, onMount } from "solid-js";

import { cssVar } from "@/core/dom";
import { clamp, lerp, pfloor, plerp, PointM } from "@/core/math";
import { Boundaries, Point } from "@/core/meta";

import { Checkbox, Input, Slider, Toggle } from "..";
import { Grid } from "./Grid";
import { LineWithHandles } from "./Line";

const MIN = 0;
const MAX = 100;

const natures = ["Linear", "Quadratic", "Cubic"] as const;
type Nature = (typeof natures)[number];

export function Movement() {
  const [nature, setNature] = createSignal<Nature>(natures[0]);
  const [pointIx, setPointIx] = createSignal<number>(0);
  const [points, setPoints] = createSignal<Point[]>([
    { x: MIN, y: MIN },
    { x: MAX, y: MAX },
  ]);

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
      // transform: 0 <= x,y <= 1 (divide by 100)
      // TODO onUpdate(transform(points))
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
  }

  const isCurrent = (ix: number) => pointIx() === ix;
  const getAxis = (axis: "x" | "y") => points()[pointIx()][axis];

  return (
    <div class="movement-container">
      <Toggle value={nature()} items={natures} onChange={handleNatureChange} />
      <div class="plot-container">
        <Slider
          min={MIN}
          max={MAX}
          orientation="vertical"
          disabled={!hasIndex()}
          value={getAxis("y")}
          onValue={handleSliderUpdate("y")}
        />
        <svg ref={svg} class="plot" onMouseDown={dragStart}>
          <Grid boundaries={boundaries()} />
          <LineWithHandles points={absolutePoints()} />
          <For each={absolutePoints()}>
            {(point, ix) => (
              <circle
                classList={{ current: isCurrent(ix()) }}
                cx={point.x}
                cy={point.y}
                r={circleRadius}
                data-ix={ix()}
              />
            )}
          </For>
        </svg>
      </div>
      <Slider
        min={MIN}
        max={MAX}
        orientation="horizontal"
        disabled={!hasIndex()}
        value={getAxis("x")}
        onValue={handleSliderUpdate("x")}
        class="x-axis"
      />
      <For each={points()}>
        {(point, ix) => (
          <label class="point" classList={{ current: isCurrent(ix()) }}>
            P{ix()}| x:
            <Input
              value={point.x}
              onFocus={() => setPointIx(ix())}
              onInput={handleInputChange(ix(), "x")}
            />
            y:
            <Input
              value={point.y}
              onFocus={() => setPointIx(ix())}
              onInput={handleInputChange(ix(), "y")}
            />
          </label>
        )}
      </For>
      <Slider
        label="Speed"
        class="speed"
        value={10}
        min={1}
        max={100}
        onValue={debounce(handleSpeedChange, 50)}
      />
      <Checkbox id="repeatable" label="Repeatable" />
    </div>
  );
}
