import { useCallback, useEffect, useState } from "react";

import { Point } from "@/core/meta";

interface InternalLineProps {
  p0: Point;
  p1: Point;
  key: string;
}

interface Props {
  size: number;
  slices?: number;
}

export function Grid({ size, slices = 10 }: Props) {
  const [lines, setLines] = useState<InternalLineProps[]>([]);

  const calculateLines = useCallback(() => {
    const spacing = size / slices;
    const _lines = [];
    for (let i = 1; i < slices; i++) {
      const tile = i * spacing;
      _lines.push(
        {
          p0: { x: 0, y: tile },
          p1: { x: size, y: tile },
          key: `h${i}`,
        },
        { p0: { x: tile, y: 0 }, p1: { x: tile, y: size }, key: `v${i}` }
      );
    }
    setLines(_lines);
  }, [size, slices]);

  useEffect(() => {
    calculateLines();
  }, [size, calculateLines]);

  return (
    <g className="grid">
      {lines.map(({ p0, p1, key }) => {
        return <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} key={key} />;
      })}
    </g>
  );
}
