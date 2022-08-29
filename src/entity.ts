import { EntityAudio } from './audio';
import { getDistance, getPointDistance, toDegrees } from './calc';

export enum MovementMode {
  stand,
  walk,
}

export class Point {
  public x: number;
  public y: number;
}

export class Entity {
  public id: number;
  public pos: Point;
  public r: number;
  public color: string;
  public mode: MovementMode;
  public moveDestination: Point;
  public audio: EntityAudio = new EntityAudio();
  public readonly MOVE_SPEED = 1;
  public readonly NORMAL_COLOR = 'black';
  public readonly SELECTED_COLOR = '#DD725B';

  constructor(id: number) {
    (this.id = id), (this.color = this.NORMAL_COLOR);
    this.mode = MovementMode.stand;
    this.moveDestination = { x: 0, y: 0 };
    this.pos = { x: 100, y: 100 };
    this.r = 20;
  }

  public stopWalk() {
    this.mode = MovementMode.stand;
    this.audio.WalkOnGrass.pause();
  }

  public headToDestination() {
    const ballPos = { x: this.pos.x, y: this.pos.y };
    const wantedPos = {
      x: this.moveDestination.x,
      y: this.moveDestination.y,
    };

    const yDis = getDistance(ballPos.y, wantedPos.y);
    const cDis = getPointDistance(ballPos, wantedPos);

    // const ratio = MOVE_DIS / cDis;
    const deg = toDegrees(Math.asin(yDis / cDis));

    let addY, addX;
    addY = this.MOVE_SPEED * Math.sin(deg);
    addX = this.MOVE_SPEED * Math.cos(deg);

    if (this.pos.x < wantedPos.x) {
      this.pos.x += addX;
    } else {
      this.pos.x -= addX;
    }

    if (this.pos.y < wantedPos.y) {
      this.pos.y += addY;
    } else {
      this.pos.y -= addY;
    }
  }

  public select_effect()
  {
    this.color = this.SELECTED_COLOR;
  }

  public unselect_effect()
  {
    this.color = this.NORMAL_COLOR;
  }

  setNewMoveOrder(x: number, y: number) {
    this.moveDestination.x = x;
    this.moveDestination.y = y;
    this.mode = MovementMode.walk;
    this.audio.WalkOnGrass.playInLoop();
  }
}
