import { Point } from "@/core/meta";

const p = ({ x, y }: Point) => `${x},${y}`;

interface Props {
  points: Point[];
  type?: "main" | "handle";
}

function Line({ points, type = "main" }: Props) {
  const [p0, p1, p2, p3] = points;
  let d = `M ${p(p0)} `;

  if (p3) d += `C ${p(p1)} ${p(p2)} ${p(p3)}`;
  else if (p2) d += `Q ${p(p1)} ${p(p2)}`;
  else d += `L ${p(p1)}`;

  return <path className={type} d={d} />;
}

export function Lines({ points }: { points: Point[] }) {
  return (
    <g>
      <Line points={points} />
      {/* TODO create handles for quadratic */}
      {points.length === 4 && (
        <>
          <Line type="handle" points={points.slice(0, 2)} />
          <Line type="handle" points={points.slice(2)} />
        </>
      )}
    </g>
  );
}
