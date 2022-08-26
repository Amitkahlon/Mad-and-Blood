import { checkInsideCircle } from './calc';
import { Entity, MovementMode } from './entity';
import { getEntity, ENTITIES_LIST } from './game';

enum MouseMode {
  standby,
  selectedEntity,
}

class MouseState {
  mouse_mode: number;
  selectedBallId: number;

  constructor() {
    this.mouse_mode = MouseMode.standby;
    this.selectedBallId = -1;
  }
}

export class Input {
  private canvas: HTMLCanvasElement;
  private mouse_state: MouseState;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.mouse_state = new MouseState();
  }

  public initInput() {
    this.canvas.addEventListener('click', (event) => {
      console.log('Hit!');
      const { mouseX, mouseY } = this.getCursorPosition(this.canvas, event);

      if (this.mouse_state.mouse_mode === MouseMode.standby) {
        const id = this.selectEntity(mouseX, mouseY);

        if (id != null) {
          const currentBall = getEntity(id) as Entity;
          currentBall.color = '#DD725B';
          this.mouse_state.mouse_mode = MouseMode.selectedEntity;
          this.mouse_state.selectedBallId = id;

        }
      } else if (this.mouse_state.mouse_mode === MouseMode.selectedEntity) {
        const currentBall = getEntity(
          this.mouse_state.selectedBallId,
        ) as Entity;
        currentBall.moveDestination.x = mouseX;
        currentBall.moveDestination.y = mouseY;
        currentBall.mode = MovementMode.walk;
        this.mouse_state.mouse_mode = MouseMode.standby;
        this.mouse_state.selectedBallId = -1;
        currentBall.color = '#000000';
        
        currentBall.walkAudio.loop = true;
        currentBall.walkAudio.play();
      }
    });
  }

  private getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { mouseX: x, mouseY: y };
  }

  private selectEntity = (mouseX, mouseY) => {
    for (let i = 0; i < ENTITIES_LIST.length; i++) {
      const ball = ENTITIES_LIST[i];
      const a = { x: mouseX, y: mouseY };
      const b = { x: ball.pos.x, y: ball.pos.y };

      const ballSelected = checkInsideCircle(a, b, ball.r);
      if (ballSelected) {
        return ball.id;
      }
    }

    return null;
  };
}
