import { HttpError, Message, StatusCode } from './http.js';
import { createIdGenerator } from './id.js';

export class Repository {
  constructor({ dataSource, transformId = Number, idGenerator = createIdGenerator() }) {
    this.dataSource = dataSource;
    this.transformId = transformId;
    this.idGenerator = idGenerator;
  }

  getOneOrFail(id) {
    const transformedId = this.transformId(id);
    const found = this.dataSource.find((entity) => entity.id === transformedId);

    if (!found) {
      throw new HttpError({ message: Message.NotFound, statusCode: StatusCode.NotFound });
    }

    return found;
  }

  getAll() {
    return this.dataSource;
  }

  createOne(body) {
    const id = this.idGenerator.nextId();
    const entity = { id, ...body };

    this.dataSource.push(entity);

    return entity;
  }

  updateOne({ id, ...body }) {
    const entity = this.getOneOrFail(id);
    Object.assign(entity, body);

    return entity;
  }

  deleteOne(id) {
    const entity = this.getOneOrFail(id);
    const i = this.dataSource.indexOf(entity);

    this.dataSource.splice(i, 1);

    return entity;
  }
}
