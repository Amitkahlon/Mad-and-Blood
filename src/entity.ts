
export enum MovementMode {
  stand,
  walk
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
  public moveDestination : Point;
  public walkAudio: HTMLAudioElement = new Audio("../grass_walk.mp3");

  constructor(id: number){
    this.id = id,
    this.color =  "black";
    this.mode = MovementMode.stand;
    this.moveDestination =  {x: 0, y: 0};
    this.pos =  {x: 100, y: 100};
    this.r = 20
  }
}