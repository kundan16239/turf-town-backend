import {Getter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {VenueAdvertise, VenueAdvertiseRelations} from '../models';
import {TimestampingRepository} from './timestamp.repository';
import {VenueRepository} from './venue.repository';

export class VenueAdvertiseRepository extends TimestampingRepository<
  VenueAdvertise,
  typeof VenueAdvertise.prototype.id,
  VenueAdvertiseRelations
> {

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('VenueRepository') protected venueRepositoryGetter: Getter<VenueRepository>,
  ) {
    super(VenueAdvertise, dataSource);
  }
}
