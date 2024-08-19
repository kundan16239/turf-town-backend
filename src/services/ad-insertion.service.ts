import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {VenueAdvertiseRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AdInsertionService {
  constructor(@repository(VenueAdvertiseRepository) private venueAdvertiseRepository: VenueAdvertiseRepository) {}

  /*
   * Add service methods here
   */
  // async insertAds(venues: any, zone: string) {
  //   const ads = await this.venueAdvertiseRepository.find({where: {zone: zone}});

  //   // Insert ads at predefined positions
  //   ads.forEach(ad => {
  //     if (ad.insertionPosition < venues.length) {
  //       venues.splice(ad.insertionPosition, 0, ad);
  //     } else {
  //       venues.push(ad);
  //     }
  //   });

  //   return venues;
  // }
  async insertAds(venues: any[], zone: string) {
    // Fetch ads for the given zone
    const ads = await this.venueAdvertiseRepository.find({ where: { zone: zone } });

    // Create a mapping of venueId to insertionPosition
    const adMap = new Map<string, number>();
    ads.forEach(ad => {
      adMap.set(ad.venueId.toString(), ad.insertionPosition);
    });

    // Create an array to hold reordered venues
    const orderedVenues = new Array(venues.length).fill(null);

    // Place ads at their predefined positions
    adMap.forEach((insertionPosition, venueId) => {
      const venue = venues.find(v => v._id.toString() === venueId);
      if (venue) {
        orderedVenues[insertionPosition] = {
          ...venue,
          showAd: true
        };
      }
    });

    // Place remaining venues in the gaps
    let currentPosition = 0;
    venues.forEach(venue => {
      if (!adMap.has(venue._id.toString())) {
        // Find the next available position
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
