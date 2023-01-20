import { GameState, PlayerStatus, toDeg } from "@/common";

const color = "white";

export function draw(
  status: PlayerStatus,
  c: CanvasRenderingContext2D,
  state: GameState
): void {
  const {
    position: { x, y },
    boundaries: { width, height },
    rotation,
    hitbox,
  } = status;

  const cx = width * 0.5;
  const cy = height * 0.5;

  c.save();
  c.translate(x + cx, y + cy);
  c.rotate(rotation);

  // FIXME draw player
  // c.strokeStyle = color;
  c.fillRect(-cx, -cy, width, height);
  // c.drawImage(image, -cx, -cy, width, height);

  c.closePath();

  c.restore();

  if (state.debug) {
    const _y = Math.floor(y);
    const _x = Math.floor(x);
    const rad = Math.floor(toDeg(rotation));
    c.strokeStyle = "red";
    c.fillStyle = color;
    c.font = `${16}px sans-serif`;

    // c.textAlign = "center";
    c.fillText(`[${_x}, ${_y}] ${rad}°`, _x + width, _y);

    c.beginPath();
    c.arc(hitbox.x, hitbox.y, hitbox.radius, 0, Math.PI * 2);
    c.stroke();
  }
}
