import type { Point } from "./entity";

export const getDistance = (x, y) => {
  return Math.abs(x - y);
}

export const getPointDistance = (point1: Point, point2: Point) => {
  const disX = getDistance(point1.x, point2.x);
  const disY = getDistance(point1.y, point2.y);

  let dis = Math.pow(disX, 2) + Math.pow(disY, 2)
  dis = Math.sqrt(dis);
  return dis;
}

export const checkInsideCircle = (point1, point2, circleRadius) => {
  const distance = getPointDistance(point1, point2)

  return distance < (circleRadius);
}

export function toDegrees (angle) {
  return angle * (180 / Math.PI);
}