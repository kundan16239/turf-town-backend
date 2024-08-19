import {Client} from '@loopback/testlab';
import {TurfTownBackendApplication} from '../..';
import {VenueRepository} from '../../repositories';
import {VenueRankingService} from '../../services';
import {setupApplication} from './test-helper';

describe('VenueController', () => {
  let app: TurfTownBackendApplication;
  let client: Client;
  let venueRepo: VenueRepository;
  let venueRankingService: VenueRankingService;


  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    venueRepo = await app.get('repositories.VenueRepository');
    // venueRankingService = await app.get('services.venue-ranking.service');
  });
  after(async () => {
    await app.stop();
  });
  beforeEach(clearDatabase);

  it('protects shopping cart with authorization', async () => {
    const data = await venueRepo.find({})
    console.log(data)
  });


  async function clearDatabase() {
    // await venueRepo.deleteAll();
  }


});
