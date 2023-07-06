import "./styles.css";

import { MouseEvent, ReactElement, useEffect, useRef, useState } from "react";

import { $$ } from "@/core/dom";
import { Point } from "@/core/meta";

import { createGrid, path } from "./svg-util";

// interface Props { points: Point[]; } // 0 <= x,y <= 1

interface Target {
  ix: number;
  el: Element;
}

export function Movement() {
  const svg = useRef<SVGSVGElement>(null);
  const bounds = useRef({
    min: { x: 0, y: 0 },
    max: { x: 0, y: 0 },
  });
  // TODO could be a ref
  const [grid, setGrid] = useState<ReactElement | null>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [points, setPoints] = useState<Point[]>([
    { x: 15, y: 75 },
    { x: 30, y: 25 },
    { x: 60, y: 25 },
    { x: 115, y: 75 },
  ]);

  useEffect(() => {
    if (!svg.current) return;
    const { left, top, width, height } = svg.current.getBoundingClientRect();
    bounds.current = {
      min: { x: left, y: top },
      max: { x: left + width, y: top + height },
    };
    // TODO setPoints(transform(width));
    setGrid(createGrid(width));
  }, []);

  function dragEnd() {
    if (!target) return;
    setTarget(null);
    // TODO onDragEnd(targetPoint) // transform: 0 <= x,y <= 1
  }

  function dragStart(ev: MouseEvent<SVGElement>) {
    // TODO prevent going outbounds
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
    // The solution below also works pretty well
    // const ctm = svg.current?.getScreenCTM();
    // if (!ctm) return { x: 0, y: 0 };
    // return { x: (ev.x - ctm.e) / ctm.a, y: (ev.y - ctm.f) / ctm.d };

    // TODO this function could offset the
    // target element as well (using getBoundingClientRect)
    const svgRect = svg.current?.getBoundingClientRect();
    if (!svgRect) return { x: 0, y: 0 };
    return { x: x - svgRect.left, y: y - svgRect.top };
  }

  function drag(ev: MouseEvent<SVGElement>) {
    if (!target) return;
    ev.preventDefault();

    // TODO "out of bounds"
    // const point = points[target.ix];
    const off = offset(ev.clientX, ev.clientY);
    // point.x -= off.x;
    // point.y -= off.y;
    points[target.ix] = off;
    setPoints([...points]);
  }

  return (
    <svg
      className="movement"
      ref={svg}
      onMouseDown={dragStart}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      onMouseMove={drag}
    >
      {grid}
      <g>
        {points.length === 4 && (
          <>
            <path className="handle" d={path([points[0], points[1]])} />
            <path className="handle" d={path([points[2], points[3]])} />
          </>
        )}
        {/* TODO create handles for quadratic */}
        <path className="main" d={path(points)} />
      </g>
      {points.map((point, ix) => (
        <circle cx={point.x} cy={point.y} r={5} key={ix} data-ix={ix} />
      ))}
    </svg>
  );
}
