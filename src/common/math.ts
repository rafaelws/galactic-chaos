const _rad = Math.PI / 180;
const _deg = 180 / Math.PI;

export function toRad(deg: number) {
  return deg * _rad;
}

export function toDeg(rad: number) {
  return rad * _deg;
}
