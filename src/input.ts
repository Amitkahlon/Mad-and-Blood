import { checkInsideCircle, isPointInRect } from './calc';
import type { Entity, Point } from './entity';
import { getEntity, ENTITIES_LIST, getEntities } from './game';

enum MouseMode {
  standby,
  selectedEntity,
  multipleSelectedEntities,
  mouseHold,
}

class MouseState {
  mouse_mode: MouseMode;
  selectedEntityId: number;
  selectedEntityIds: number[];
  public currentMousePos: Point;
  public initialHoldPos: Point;
  public mouseHoldFlag: boolean;

  constructor() {
    this.mouse_mode = MouseMode.standby;
    this.selectedEntityId = -1;
  }

  public mouse_state_entity_selection(entityId: number) {
    this.mouse_mode = MouseMode.selectedEntity;
    this.selectedEntityId = entityId;
  }

  public mouse_state_entity_unselection() {
    this.mouse_mode = MouseMode.standby;
    this.selectedEntityId = -1;
  }

  public mouse_state_multiple_entity_selection(entityIds: number[]) {
    this.mouse_mode = MouseMode.multipleSelectedEntities;
    this.selectedEntityIds = entityIds;
  }

  public mouse_state_multiple_entity_unselection() {
    this.mouse_mode = MouseMode.standby;
    this.selectedEntityIds = null;
  }
}

export class Input {
  private canvas: HTMLCanvasElement;
  public mouse_state: MouseState;
  private holdTimer: NodeJS.Timeout;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.mouse_state = new MouseState();
  }

  private onMouseClick = (event: MouseEvent) => {
    console.log('click Hit!');
    const cursorPos = this.getCursorPosition(event);

    switch (this.mouse_state.mouse_mode) {
      case MouseMode.standby:
        const id = this.attemptSingleEntitySelection(cursorPos);

        if (id != null) {
          const currentEntity = getEntity(id) as Entity;
          currentEntity.select_effect();
          this.mouse_state.mouse_state_entity_selection(id);
        }
        break;
      case MouseMode.multipleSelectedEntities:
        //temp
        this.mouse_state.selectedEntityIds.forEach((id) => {
          const currentEntity = getEntity(id) as Entity;

          currentEntity.setNewMoveOrder(cursorPos);
          currentEntity.unselect_effect();
          this.mouse_state.mouse_state_entity_unselection();
        });
        break;
      case MouseMode.selectedEntity:
        const currentEntity = getEntity(
          this.mouse_state.selectedEntityId,
        ) as Entity;

        currentEntity.setNewMoveOrder(cursorPos);
        currentEntity.unselect_effect();
        this.mouse_state.mouse_state_entity_unselection();
        break;
    }
  };

  public initInput() {
    this.canvas.addEventListener('mousemove', (event) => {
      this.mouse_state.currentMousePos = this.getCursorPosition(event);
    });

    this.canvas.addEventListener('mousedown', (event) => {
      this.mouse_state.mouseHoldFlag = false;
      this.mouse_state.initialHoldPos = this.getCursorPosition(event);
      this.holdTimer = setTimeout(() => {
        this.mouse_state.mouseHoldFlag = true;
        this.mouse_state.mouse_mode = MouseMode.mouseHold;
      }, 150);
    });

    this.canvas.addEventListener('mouseup', (event) => {
      clearTimeout(this.holdTimer);
      if (this.mouse_state.mouseHoldFlag) {
        //handle as hold
        this.mouse_state.mouseHoldFlag = false;
        this.mouse_state.mouse_mode = MouseMode.standby;
        const selectedEntities = this.attemptMultipleEntitySelection();
        if (selectedEntities) {
          this.mouse_state.mouse_mode = MouseMode.multipleSelectedEntities;

          debugger;
          //clear last selected entities
          const currentlySelectedEntities = getEntities(
            this.mouse_state.selectedEntityIds,
          );
          currentlySelectedEntities?.forEach((entity) =>
            entity.unselect_effect(),
          );

          //select entities
          selectedEntities.forEach((entity) => entity.select_effect());
          this.mouse_state.mouse_state_multiple_entity_selection(
            selectedEntities.map((entity) => entity.id),
          );
        }
      } else {
        //handle as click
        this.onMouseClick(event);
      }
    });
  }

  private getCursorPosition(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x: x, y: y };
  }

  private attemptSingleEntitySelection = (mousePos: Point) => {
    const entitySelected = ENTITIES_LIST.find((entity) =>
      checkInsideCircle(mousePos, entity.pos, entity.r),
    );

    if (entitySelected) {
      return entitySelected.id;
    }

    return null;
  };

  private attemptMultipleEntitySelection = (): Entity[] => {
    const selectedEntities: Entity[] = ENTITIES_LIST.filter((entity) => {
      const initialHoldPos = this.mouse_state.initialHoldPos;
      const currentMousePos = this.mouse_state.currentMousePos;

      const rectangle = {
        x1:
          initialHoldPos.x < currentMousePos.x
            ? initialHoldPos.x
            : currentMousePos.x,
        y1:
          initialHoldPos.y < currentMousePos.y
            ? initialHoldPos.y
            : currentMousePos.y,
        x2:
          initialHoldPos.x > currentMousePos.x
            ? initialHoldPos.x
            : currentMousePos.x,
        y2:
          initialHoldPos.y > currentMousePos.y
            ? initialHoldPos.y
            : currentMousePos.y,
      };

      return isPointInRect(rectangle, entity.pos);
    });

    return selectedEntities;
  };
}
