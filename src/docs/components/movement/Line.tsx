import { createEffect, createSignal, Show } from "solid-js";

import { Point } from "@/core/meta";

const p = ({ x, y }: Point) => `${x},${y}`;

interface LineProps {
  points: Point[];
  type: "main" | "handle" | "grid";
}

export function Line(props: LineProps) {
  const [path, setPath] = createSignal("");

  createEffect(() => {
    const [p0, p1, p2, p3] = props.points;
    let d = `M ${p(p0)} `;

    if (p3) d += `C ${p(p1)} ${p(p2)} ${p(p3)}`;
    else if (p2) d += `Q ${p(p1)} ${p(p2)}`;
    else d += `L ${p(p1)}`;

    setPath(d);
  });
  return <path class={props.type} d={path()} />;
}

type LineWithHandlesProps = { points: Point[] };

export function LineWithHandles(props: LineWithHandlesProps) {
  // TODO create handles for quadratic
  return (
    <>
      <Show when={props.points.length === 4}>
        <Line type="handle" points={props.points.slice(0, 2)} />
        <Line type="handle" points={props.points.slice(2)} />
      </Show>
      <Line type="main" points={props.points} />
    </>
  );
}
