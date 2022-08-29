import { checkInsideCircle } from './calc';
import type { Entity } from './entity';
import { getEntity, ENTITIES_LIST } from './game';

enum MouseMode {
  standby,
  selectedEntity,
}

class MouseState {
  mouse_mode: number;
  selectedEntityId: number;

  constructor() {
    this.mouse_mode = MouseMode.standby;
    this.selectedEntityId = -1;
  }

  public mouse_state_entity_selected(entityId: number) {
    this.mouse_mode = MouseMode.selectedEntity;
    this.selectedEntityId = entityId;
  }

  public mouse_state_entity_unselected() {
    this.mouse_mode = MouseMode.standby;
    this.selectedEntityId = -1;
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
        const id = this.attemptEntitySelection(mouseX, mouseY);

        if (id != null) {
          const currentEntity = getEntity(id) as Entity;
          currentEntity.select_effect();
          this.mouse_state.mouse_state_entity_selected(id);
        }
      } else if (this.mouse_state.mouse_mode === MouseMode.selectedEntity) {
        const currentEntity = getEntity(
          this.mouse_state.selectedEntityId,
        ) as Entity;

        currentEntity.setNewMoveOrder(mouseX, mouseY);
        currentEntity.unselect_effect();
        this.mouse_state.mouse_state_entity_unselected();
      }
    });
  }

  private getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { mouseX: x, mouseY: y };
  }

  private attemptEntitySelection = (mouseX, mouseY) => {
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
