import "./styles.css";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { clamp, lerp, pfloor, plerp, PointM } from "@/core/math";
import { Boundaries, Point } from "@/core/meta";
import { classNames } from "@/docs/util";

import { Slider, Toggle } from "..";
import { Grid } from "./Grid";
import { Lines } from "./Line";

// interface Props { params: MovementParams; }

const natures = ["Linear", "Quadratic", "Cubic"] as const;
type Nature = (typeof natures)[number];

export function Movement() {
  const svg = useRef<SVGSVGElement>(null);
  const circleRadiusRef = useRef<number>(5);
  const circleSizeOffsetRef = useRef<number>(circleRadiusRef.current * 1.5);
  const circleMouseOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const [boundaries, setBoundaries] = useState<Boundaries>({
    width: 0,
    height: 0,
  });

  const [nature, setNature] = useState<Nature>(natures[0]);
  const [pointIx, setPointIx] = useState<number>(-1);
  const [dragging, setDragging] = useState(false);

  const [points, setPoints] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 100, y: 100 },
  ]);

  const hasIndex = () => pointIx >= 0;

  const toAbsolute = (
    value: number,
    boundary: number,
    offset = circleSizeOffsetRef.current
  ) => {
    return lerp(offset, boundary - offset, value * 0.01);
  };

  const toAbsolutePoint = ({ x, y }: Point) => ({
    x: toAbsolute(x, boundaries.width),
    y: toAbsolute(y, boundaries.height),
  });

  const absolutePoints = points.map(toAbsolutePoint);

  useEffect(() => {
    if (!svg.current) return;
    const { clientWidth, clientHeight } = svg.current;
    setBoundaries({ width: clientWidth, height: clientHeight });
  }, []);

  // TODO
  useEffect(() => {
    const mouseMove = (ev: globalThis.MouseEvent) => {
      moveTo({ x: ev.clientX, y: ev.clientY });
    };

    const mouseUp = () => dragEnd();

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  });

  function toRelativePoint(
    mousePoint: Point,
    rect: DOMRect,
    radius = circleRadiusRef.current,
    offset = circleSizeOffsetRef.current,
    mouseOffset = circleMouseOffsetRef.current,
    { width, height }: Boundaries = boundaries
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
    if (!hasIndex() || !dragging) return;

    const rect = svg.current?.getBoundingClientRect();
    if (!rect) return;

    points[pointIx] = toRelativePoint(point, rect);
    setPoints([...points]);
  }

  function calculateMouseOffset(el: SVGElement, { x, y }: Point) {
    const { top, left } = el.getBoundingClientRect();
    circleMouseOffsetRef.current = { x: x - left, y: y - top };
  }

  function dragStart(ev: MouseEvent<SVGElement>) {
    if (!svg.current) return;

    const el = ev.target as SVGElement;
    const ix = Number(el.dataset.ix);

    if (el.tagName === "circle" && !isNaN(ix)) {
      calculateMouseOffset(el, { x: ev.clientX, y: ev.clientY });
      setPointIx(ix);
      setDragging(true);
    }
  }

  function dragEnd() {
    setDragging(false);
    // TODO onUpdate(targetPoint) // transform: 0 <= x,y <= 1 (divide by 100)
  }

  function handleNatureChange(newNature: Nature) {
    if (newNature === nature) return;

    const first = points[0];
    const last = points[points.length - 1];

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

  function handleInputChange(ix: number, axis: "x" | "y") {
    return (ev: ChangeEvent<HTMLInputElement>) => {
      let val = Number(ev.target.value);
      if (isNaN(val)) {
        val = points[ix][axis];
        // https://github.com/preactjs/preact/issues/1899
        ev.target.value = val.toString();
        return;
      }

      points[ix][axis] = clamp(val, 0, 100);
      setPoints([...points]);
    };
  }

  function handleSliderUpdate(axis: "x" | "y") {
    return (value: number) => {
      if (!hasIndex()) return;
      points[pointIx][axis] = value;
      setPoints([...points]);
    };
  }

  const currentClassName = (ix: number) =>
    classNames({ current: pointIx === ix });

  return (
    <div className="movement-container">
      <Toggle value={nature} items={natures} onChange={handleNatureChange} />
      <div className="plot-container">
        <Slider
          min={0}
          max={100}
          orientation="vertical"
          disabled={!hasIndex()}
          value={hasIndex() ? points[pointIx].y : 0}
          onValue={handleSliderUpdate("y")}
        />
        <svg ref={svg} className="plot" onMouseDown={dragStart}>
          <Grid size={boundaries.width} />
          <Lines points={absolutePoints} />
          {absolutePoints.map((point, ix) => (
            <circle
              className={currentClassName(ix)}
              cx={point.x}
              cy={point.y}
              r={circleRadiusRef.current}
              key={ix}
              data-ix={ix}
            />
          ))}
        </svg>
      </div>
      <Slider
        min={0}
        max={100}
        orientation="horizontal"
        disabled={!hasIndex()}
        value={hasIndex() ? points[pointIx].x : 0}
        onValue={handleSliderUpdate("x")}
      />
      {points.map((point, ix) => (
        <label key={`p${ix}`} className={currentClassName(ix)}>
          P{ix}| x:
          <input
            className="common colors"
            value={point.x}
            onFocus={() => setPointIx(ix)}
            onChange={handleInputChange(ix, "x")}
          />
          y:
          <input
            className="common colors"
            value={point.y}
            onFocus={() => setPointIx(ix)}
            onChange={handleInputChange(ix, "y")}
          />
        </label>
      ))}
    </div>
  );
}
