import { createEffect, createSignal, For, mergeProps } from "solid-js";

import { Boundaries, Point } from "@/core/meta";

import { Line } from "./Line";

type PointTuple = [Point, Point];
type Dimension = "width" | "height";

interface Props {
  boundaries: Boundaries;
  dimension?: Dimension;
  slices?: number;
}

export function Grid(props: Props) {
  const merged = mergeProps({ slices: 10, dimension: "width" }, props);
  const [lines, setLines] = createSignal<PointTuple[]>();

  createEffect(() => {
    const size = props.boundaries[merged.dimension as Dimension];
    const lines: PointTuple[] = [];
    const spacing = size / merged.slices;
    for (let i = 1; i < merged.slices; i++) {
      const tile = i * spacing;
      lines.push(
        [
          { x: 0, y: tile },
          { x: size, y: tile },
        ],
        [
          { x: tile, y: 0 },
          { x: tile, y: size },
        ]
      );
    }
    setLines(lines);
  });

  return (
    <For each={lines()}>{(points) => <Line type="grid" points={points} />}</For>
  );
}
