// import { toDeg } from "@/common/math";
import { PlayerStatus } from "@/common/meta";

interface DrawPlayerParams {
  c: CanvasRenderingContext2D;
  status: PlayerStatus;
  img: HTMLImageElement;
}

export function drawPlayer({ c, status, img }: DrawPlayerParams): void {
  const {
    position: { x, y },
    boundaries: { width, height },
    rotation,
    // hitbox,
  } = status;

  const cx = width * 0.5;
  const cy = height * 0.5;

  c.save();
  c.translate(x + cx, y + cy);
  c.rotate(rotation);

  // c.fillStyle = "white";
  // c.fillRect(-cx, -cy, width, height);
  // c.closePath();
  c.drawImage(img, -cx, -cy, width, height);
  c.restore();

  /*
  // debug
  const _y = Math.floor(y);
  const _x = Math.floor(x);
  const rad = Math.floor(toDeg(rotation));
  c.strokeStyle = "red";
  c.fillStyle = "white";
  c.font = `${16}px sans-serif`;

  // c.textAlign = "center";
  c.fillText(`[${_x}, ${_y}] ${rad}°`, _x + width, _y);

  c.beginPath();
  c.arc(hitbox.x, hitbox.y, hitbox.radius, 0, Math.PI * 2);
  c.stroke();
  */
}
