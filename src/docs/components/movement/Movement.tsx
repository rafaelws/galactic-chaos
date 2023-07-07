import "./styles.css";

import { MouseEvent, useEffect, useRef, useState } from "react";

import { $$ } from "@/core/dom";
import { Point } from "@/core/meta";

import { Grid } from "./Grid";
import { Lines } from "./Line";

// interface Props { points: Point[]; } // 0 <= x,y <= 1

type Bounds = { min: Point; max: Point; rect: DOMRect };
type Target = { ix: number; el: Element };

export function Movement() {
  const svg = useRef<SVGSVGElement>(null);
  const [bounds, setBounds] = useState<Bounds>();

  const [target, setTarget] = useState<Target | null>(null);
  const [points, setPoints] = useState<Point[]>([
    { x: 15, y: 75 },
    { x: 30, y: 25 },
    { x: 60, y: 25 },
    { x: 115, y: 75 },
  ]);

  useEffect(() => {
    if (!svg.current) return;
    const rect = svg.current.getBoundingClientRect();
    setBounds({
      rect,
      min: { x: rect.left, y: rect.top },
      max: { x: rect.left + rect.width, y: rect.top + rect.height },
    });
    // TODO setPoints(transform(width));
  }, []);

  function dragEnd() {
    if (!target) return;
    setTarget(null);
    // TODO onUpdate(targetPoint) // transform: 0 <= x,y <= 1
  }

  function dragStart(ev: MouseEvent<SVGElement>) {
    const el = ev.target as SVGElement;
    const ix = Number(el.dataset.ix);

    // TODO snap target to a new position if there is a
    // current and it is not locked
    if (!svg.current || el.tagName !== "circle" || isNaN(ix)) return;

    $$("circle", svg.current).forEach((el) => el.classList.remove("current"));
    el.classList.add("current");
    setTarget({ ix, el });
  }

  // FIXME treat out of bounds
  function offset(x: number, y: number): Point {
    const svgRect = svg.current?.getBoundingClientRect();
    if (!svgRect) return { x: 0, y: 0 };
    return { x: x - svgRect.left, y: y - svgRect.top };
  }

  function drag(ev: MouseEvent<SVGElement>) {
    if (!target) return;
    ev.preventDefault();
    points[target.ix] = offset(ev.clientX, ev.clientY);
    setPoints([...points]);
  }

  return (
    <>
      {/* Movement */}
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
          <circle cx={point.x} cy={point.y} r={5} key={ix} data-ix={ix} />
        ))}
      </svg>
    </>
  );
}
