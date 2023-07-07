import { Point } from "@/core/meta";

function line(p0: Point, p1: Point, key: string) {
  return <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} key={key} />;
}

interface Props {
  width: number;
  slices?: number;
}

export function Grid({ width, slices = 10 }: Props) {
  const spacing = width / slices;
  const lines = [];
  for (let i = 0; i < slices; i++) {
    const tile = i * spacing;
    lines.push(
      line({ x: 0, y: tile }, { x: width, y: tile }, `h${i}`),
      line({ x: tile, y: 0 }, { x: tile, y: width }, `v${i}`)
    );
  }
  return <g className="grid">{lines}</g>;
}
