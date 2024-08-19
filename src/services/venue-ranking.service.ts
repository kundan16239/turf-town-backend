import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {User} from '../models';
import {VenueRepository} from '../repositories';


@injectable({scope: BindingScope.TRANSIENT})
export class VenueRankingService {
  constructor(@repository(VenueRepository) private venueRepository: VenueRepository,
) {}

  /*
   * Add service methods here
   */
  async rankVenues(user: User, zone: string) {
    const userLocation = {
      type: 'Point',
      coordinates: [user.location.longitude, user.location.latitude],
    };

    const venueCollection = (
      this.venueRepository.dataSource.connector as any
    ).collection('Venue');
    const venues = await venueCollection.aggregate([
      {
        $geoNear: {
          near: userLocation,
          distanceField: "distance",
          spherical: true
        }
      },
      {
        $match: {
          zone: zone,

        }
      },
      {
        $addFields: {
          isPreferredSport: {
            $anyElementTrue: {
              $map: {
                input: "$sports",
                as: "sport",
                in: {$in: ["$$sport", user.preferredSports]}
              }
            }
          }
        }
      },
      {
        $sort: {
          isPreferredSport: -1, // Sort by preferred sport first
          distance: 1,          // Then by distance (nearest first)
          rating: -1            // Finally by rating (highest first)
        }
      }
    ]).get();
    return venues;
  }
}
