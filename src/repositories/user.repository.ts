import {inject} from '@loopback/core';
import {MongodbDataSource} from '../datasources';
import {User, UserRelations} from '../models';
import {TimestampingRepository} from './timestamp.repository';

export class UserRepository extends TimestampingRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(User, dataSource);
  }
}
