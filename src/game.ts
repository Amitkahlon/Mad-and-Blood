import { Entity, MovementMode } from './entity';

const entity_1: Entity = new Entity(0);
const entity_2: Entity = new Entity(1);
const entity_3: Entity = new Entity(2);

export const ENTITIES_LIST: Array<Entity> = [entity_1, entity_2, entity_3];

let entity_added_count: number;

export const addEntity = (entity: Entity): void => {
  ENTITIES_LIST.push(entity);
  entity_added_count++;
};

export const getEntity = (id: number): Entity => {
  return ENTITIES_LIST.find((entity) => entity.id === id);
};

export const getEntities = (ids: number[]): Entity[] => {
  return ENTITIES_LIST.filter((entity) => {
    if(ids?.includes(entity.id)) return entity
  });
};
