import { getDistance, getPointDistance, toDegrees } from "./calc"
import { MovementMode } from "./entity"
import { ENTITIES_LIST } from "./game"
import { entityReached } from "./game-calc"


export class  GameLogic {
    public readonly MOVE_DISTANCE = 1

    public runLogic() {
        this.movement()
    }

    private movement() {
        for (const entity of ENTITIES_LIST) {
            const MOVE_DIS = 1
            if (entity.mode === MovementMode.walk) {
                if (entityReached(entity)) {
                    entity.mode = MovementMode.stand
                    entity.walkAudio.pause();
                    continue
                }

                const ballPos = { x: entity.pos.x, y: entity.pos.y }
                const wantedPos = {
                    x: entity.moveDestination.x,
                    y: entity.moveDestination.y,
                }

                const yDis = getDistance(ballPos.y, wantedPos.y)
                const cDis = getPointDistance(ballPos, wantedPos)

                // const ratio = MOVE_DIS / cDis;
                const deg = toDegrees(Math.asin(yDis / cDis))

                let addY, addX
                addY = MOVE_DIS * Math.sin(deg)
                addX = MOVE_DIS * Math.cos(deg)

                if (entity.pos.x < wantedPos.x) {
                    entity.pos.x += addX
                } else {
                    entity.pos.x -= addX
                }

                if (entity.pos.y < wantedPos.y) {
                    entity.pos.y += addY
                } else {
                    entity.pos.y -= addY
                }
            }
        }
    }
}

