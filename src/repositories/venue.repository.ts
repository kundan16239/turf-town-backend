import {inject} from '@loopback/core';
import {MongodbDataSource} from '../datasources';
import {Venue, VenueRelations} from '../models';
import {TimestampingRepository} from './timestamp.repository';

export class VenueRepository extends TimestampingRepository<
  Venue,
  typeof Venue.prototype.id,
  VenueRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Venue, dataSource);
  }
}
