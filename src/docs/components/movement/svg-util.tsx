import { Point } from "@/core/meta";

const p = (p: Point) => `${p.x},${p.y}`;

export function path(points: Point[]) {
  const length = points.length;
  if (length < 2) return;

  const [p0, p1, p2, p3] = points;
  const d = `M ${p(p0)}`;

  if (p3) return `${d} C ${p(p1)} ${p(p2)} ${p(p3)}`;
  else if (p2) return `${d} Q ${p(p1)} ${p(p2)}`;
  return `${d} L ${p(p1)}`;
}

export function createGrid(gridSizePx: number, slices = 10) {
  const spacing = gridSizePx / slices;

  const lines = [];
  for (let i = 0; i < slices; i++) {
    const x = i * spacing;
    const y = i * spacing;

    lines.push(
      <line
        key={`h${i}`}
        x1={0}
        y1={y}
        x2={gridSizePx}
        y2={y}
        strokeWidth={1}
      />,
      <line
        key={`v${i}`}
        x1={x}
        y1={0}
        x2={x}
        y2={gridSizePx}
        strokeWidth={1}
      />
    );
  }
  return <g className="grid">{lines}</g>;
}
