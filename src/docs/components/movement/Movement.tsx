import "./styles.css";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { PointM } from "@/core/math";
import { Boundaries, Point } from "@/core/meta";
import { InputText, Label } from "@/docs/styles";
import { classNames } from "@/docs/util";

import { Toggle, ToggleItem } from "..";
import { Grid } from "./Grid";
import { Lines } from "./Line";

// interface Props { params: MovementParams; }

const natures = ["Linear", "Quadratic", "Cubic"] as const;
type Nature = (typeof natures)[number];

export function Movement() {
  const svg = useRef<SVGSVGElement>(null);
  const circleRadius = useRef<number>(5);
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

  const toAbsolute = (
    value: number,
    boundary: number,
    radius = circleRadius.current
  ) => {
    if (value <= 0) return radius;
    else if (value >= 100) return boundary - radius * 1.5;
    else return (value * boundary) / 100;
  };

  const toAbsolutePoint = ({ x, y }: Point) => ({
    x: toAbsolute(x, boundaries.width),
    y: toAbsolute(y, boundaries.height),
  });

  const absolutePoints = points.map(toAbsolutePoint);

  useEffect(() => {
    const rect = svg.current?.getBoundingClientRect();
    if (rect) setBoundaries(rect);
  }, []);

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

  function offset(
    point: Point,
    rect: DOMRect,
    radius = circleRadius.current,
    { width, height }: Boundaries = boundaries
  ): Point {
    const x = point.x - rect.left;
    const y = point.y - rect.top;
    const relative = { x, y };

    if (x - radius < 0) relative.x = 0;
    else if (x + radius * 2 > width) relative.x = 1;
    else relative.x /= width;

    if (y - radius < 0) relative.y = 0;
    else if (y + radius * 2 > height) relative.y = 1;
    else relative.y /= height;

    return PointM(relative).mtpn(100).floor().value();
  }

  function moveTo(point: Point) {
    if (pointIx < 0 || !dragging) return { x: 0, y: 0 };

    const rect = svg.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    points[pointIx] = offset(point, rect);
    setPoints([...points]);
  }

  function dragStart(ev: MouseEvent<SVGElement>) {
    if (!svg.current) return;

    const el = ev.target as SVGElement;
    const ix = Number(el.dataset.ix);

    if (el.tagName === "circle" && !isNaN(ix)) {
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
      const ref = PointM(first);
      if (newNature === natures[1])
        newPoints.push(ref.lerp(last, 0.5).floor().value());
      else
        newPoints.push(
          ref.lerp(last, 0.333).floor().value(),
          ref.lerp(last, 0.666).floor().value()
        );
    }
    newPoints.push(last);
    setPoints(newPoints);
    setNature(newNature);
  }

  function handleInputChange(ix: number, axis: "x" | "y") {
    return (ev: ChangeEvent<HTMLInputElement>) => {
      let value = Number(ev.target.value);
      if (isNaN(value)) return;

      if (value >= 100) value = 100;
      else if (value <= 0) value = 0;

      points[ix][axis] = value;
      setPoints([...points]);
    };
  }

  const currentClassName = (ix: number) =>
    classNames({ current: pointIx === ix });

  return (
    <div className="movement-container">
      <Toggle type="single" value={nature} onValueChange={handleNatureChange}>
        {natures.map((nature) => (
          <ToggleItem value={nature} key={nature}>
            {nature}
          </ToggleItem>
        ))}
      </Toggle>
      <svg className="movement-plot" ref={svg} onMouseDown={dragStart}>
        <Grid width={boundaries.width} />
        <Lines points={absolutePoints} />
        {absolutePoints.map((point, ix) => (
          <circle
            className={currentClassName(ix)}
            cx={point.x}
            cy={point.y}
            r={circleRadius.current}
            key={ix}
            data-ix={ix}
          />
        ))}
      </svg>
      {points.map((point, ix) => (
        <Label key={`p${ix}`} className={currentClassName(ix)}>
          P{ix}| x:
          <InputText value={point.x} onChange={handleInputChange(ix, "x")} />
          y:
          <InputText value={point.y} onChange={handleInputChange(ix, "y")} />
        </Label>
      ))}
    </div>
  );
}
