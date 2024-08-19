import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {VenueAdvertiseRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AdInsertionService {
  constructor(@repository(VenueAdvertiseRepository) private venueAdvertiseRepository: VenueAdvertiseRepository) {}

  /*
   * Add service methods here
   */
  async insertAds(venues: any[], zone: string) {
    // Fetch ads for the given zone
    const ads = await this.venueAdvertiseRepository.find({ where: { zone: zone } });

    const adMap = new Map<string, number>();
    ads.forEach(ad => {
      adMap.set(ad.venueId.toString(), ad.insertionPosition);
    });

    const orderedVenues = new Array(venues.length).fill(null);

    adMap.forEach((insertionPosition, venueId) => {
      const venue = venues.find(v => v._id.toString() === venueId);
      if (venue) {
        orderedVenues[insertionPosition] = {
          ...venue,
          showAd: true
        };
      }
    });

    let currentPosition = 0;
    venues.forEach(venue => {
      if (!adMap.has(venue._id.toString())) {
        while (orderedVenues[currentPosition] !== null) {
          currentPosition++;
        }
        orderedVenues[currentPosition] = {
          ...venue,
          showAd: false
        };
      }
    });

    return orderedVenues;
  }
}
