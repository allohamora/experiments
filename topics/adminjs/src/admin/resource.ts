import { BaseEntity } from 'typeorm';

export const Resource = (entity: Function) => {
  Reflect.setPrototypeOf(entity, BaseEntity);

  return entity;
};
