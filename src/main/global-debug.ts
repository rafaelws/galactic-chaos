import { Boundaries } from "@/common/meta";

export function globalDebug(
  delta: number,
  worldBoundaries: Boundaries,
  c: CanvasRenderingContext2D
) {
  const { width, height } = worldBoundaries;
  const lines = [
    `${width}x${height}`,
    `${Math.floor(1000 / delta)}fps`,
    `${Math.floor(delta)}ms`,
  ];
  c.fillStyle = "white";
  c.strokeStyle = "white";
  c.font = `${16}px sans-serif`;
  c.fillText(lines.join(", "), 5, 16);
}
