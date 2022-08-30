import { checkInsideCircle } from "./calc"
import type { Entity } from "./entity";

export const entityReached = (entity: Entity) => {
  const currentPos = { x: entity.pos.x, y: entity.pos.y }
  const wantedPos = entity.moveDestination
  const reached = checkInsideCircle(wantedPos, currentPos, entity.r)
  return reached
}

