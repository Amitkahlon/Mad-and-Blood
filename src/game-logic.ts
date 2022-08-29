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
            if (entity.mode === MovementMode.walk) {
                if (entityReached(entity)) {
                    entity.stopWalk()
                    continue
                }

                entity.headToDestination();
            }
        }
    }
}

