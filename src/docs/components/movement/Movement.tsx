import "./styles.css";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { Point } from "@/core/meta";
import { InputText, Label } from "@/docs/styles";

import { Toggle, ToggleItem } from "..";
import { Grid } from "./Grid";
import { Lines } from "./Line";

// interface Props { points: Point[]; } // 0 <= x,y <= 1

const natures = ["Linear", "Quadratic", "Cubic"];

type Bounds = { min: Point; max: Point; rect: DOMRect };

export function Movement() {
  const svg = useRef<SVGSVGElement>(null);
  const [bounds, setBounds] = useState<Bounds>();

  const [currentNature, setCurrentNature] = useState(natures[0]);
  const [pointIx, setPointIx] = useState<number>(-1);
  const [dragging, setDragging] = useState<boolean>(false);
  const [points, setPoints] = useState<Point[]>([
    { x: 15, y: 75 },
    { x: 30, y: 25 },
    { x: 60, y: 25 },
    { x: 115, y: 75 },
  ]);

  const hasIndex = () => pointIx >= 0;

  useEffect(() => {
    if (!svg.current) return;
    const rect = svg.current.getBoundingClientRect();
    setBounds({
      rect,
      min: { x: rect.left, y: rect.top },
      max: { x: rect.left + rect.width, y: rect.top + rect.height },
    });
    // TODO setPoints(transform(width)); // transform: 0 <= x,y <= 1
  }, []);

  // FIXME treat out of bounds
  function snapTo({ x, y }: Point) {
    const svgRect = svg.current?.getBoundingClientRect();
    if (!svgRect) return { x: 0, y: 0 };

    points[pointIx] = {
      x: x - svgRect.left,
      y: y - svgRect.top,
    };
    setPoints([...points]);
  }

  function dragStart(ev: MouseEvent<SVGElement>) {
    if (!svg.current) return;

    const el = ev.target as SVGElement;
    const ix = Number(el.dataset.ix);

    if (el.tagName === "circle" && !isNaN(ix)) {
      setPointIx(ix);
      setDragging(true);
    } else {
      if (hasIndex()) snapTo({ x: ev.clientX, y: ev.clientY });
    }
  }

  function drag(ev: MouseEvent<SVGElement>) {
    ev.preventDefault();
    if (hasIndex() && dragging) snapTo({ x: ev.clientX, y: ev.clientY });
  }

  function dragEnd() {
    setDragging(false);
    // TODO onUpdate(targetPoint) // transform: 0 <= x,y <= 1
  }

  function createPoint(p0: Point, p1?: Point): Point {
    // determine if the new points are in bounds
    if (p1) return { x: p1.x - p0.x, y: p1.y + p0.y };
    return { x: p0.x + p0.x * 0.25, y: p0.y + p0.y * 0.25 };
  }

  function handleNatureChange(nature: string) {
    if (nature === currentNature) return;

    const first = points[0];
    const last = points[points.length - 1];

    const newPoints: Point[] = [];

    if (nature === natures[0]) {
      newPoints.push(first, last);
    } else if (nature === natures[1]) {
      if (currentNature === natures[0])
        newPoints.push(first, createPoint(first, last), last);
      else newPoints.push(first, points[2] || points[1], last);
    } else {
      if (currentNature === natures[0])
        newPoints.push(first, createPoint(first), createPoint(last), last);
      else newPoints.push(first, points[1], createPoint(last), last);
    }
    setPoints(newPoints);
    setCurrentNature(nature);
  }

  function handleInputChange(ix: number, axis: "x" | "y") {
    return (ev: ChangeEvent<HTMLInputElement>) => {
      const value = Number(ev.target.value);
      if (isNaN(value)) return;
      points[ix][axis] = value;
      setPoints([...points]);
    };
  }

  const currentClassName = (ix: number) => (pointIx === ix ? "current" : "");

  return (
    <div className="movement-container">
      <Toggle
        type="single"
        value={currentNature}
        onValueChange={handleNatureChange}
      >
        {natures.map((nature) => (
          <ToggleItem value={nature} key={nature}>
            {nature}
          </ToggleItem>
        ))}
      </Toggle>
      <svg
        className="movement"
        ref={svg}
        onMouseDown={dragStart}
        onMouseUp={dragEnd}
        onMouseLeave={dragEnd}
        onMouseMove={drag}
      >
        {bounds && <Grid width={bounds.rect.width} />}
        <Lines points={points} />
        {points.map((point, ix) => (
          <circle
            className={currentClassName(ix)}
            cx={point.x}
            cy={point.y}
            r={5}
            key={ix}
            data-ix={ix}
          />
        ))}
      </svg>
      {points.map((point, ix) => (
        <Label key={`p${ix}`} className={currentClassName(ix)}>
          <b>P{ix}</b> | x:
          <InputText value={point.x} onChange={handleInputChange(ix, "x")} />
          y:
          <InputText value={point.y} onChange={handleInputChange(ix, "y")} />
        </Label>
      ))}
    </div>
  );
}
