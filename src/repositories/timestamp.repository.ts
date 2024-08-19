import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {Options} from 'loopback-datasource-juggler';
export class TimestampingRepository<
  T extends Entity, ID, Relations extends object
> extends DefaultCrudRepository<T, ID, Relations> {
  constructor(
    public entityClass: typeof Entity & {prototype: T},
    public dataSource: juggler.DataSource,
  ) {
    super(entityClass, dataSource);
  }
  async create(entity: any, options?: Options): Promise<T> {
    if (!entity.createdAt) {
      entity.createdAt = new Date();
    }
    entity.updatedAt = new Date();
    return super.create(entity, options);
  }
  async replaceById(id: ID, data: any, options?: Options): Promise<void> {
    data.updatedAt = new Date();
    return super.replaceById(id, data, options);
  }
  async updateById(id: ID, data: any, options?: Options): Promise<void> {
    data.updatedAt = new Date();
    return super.updateById(id, data, options);
  }
}
