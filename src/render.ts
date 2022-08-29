import { ENTITIES_LIST } from './game';
import { GameLogic } from './game-logic';
import { Input } from './input';

export class Render {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private readonly gameLogic: GameLogic;
  private readonly user_input: Input;

  private interval: NodeJS.Timer;
  private readonly FPS = 60;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.gameLogic = new GameLogic();
    this.user_input = new Input(this.canvas);
  }

  public init() {
    this.user_input.initInput();

    this.interval = setInterval(() => {
      this.gameLogic.runLogic();
      this.renderGame();
    }, 1000 / this.FPS);
  }

  private renderGame() {
    this.clearCanvas();
    this.renderBalls();
  }

  private drawEntity = (x, y, r, color) => {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  };

  private renderBalls = () => {
    ENTITIES_LIST.forEach((entity) => {
      this.drawEntity(entity.pos.x, entity.pos.y, entity.r, entity.color);
    });
  };

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
  }
}
