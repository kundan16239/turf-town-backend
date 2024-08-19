import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Venue} from '../models';
import {UserRepository, VenueRepository} from '../repositories';
import {AdInsertionService, ApiResponseService, VenueRankingService} from '../services';
import {CachingService} from '../services/caching.service';

export class VenueController {
  constructor(
    @repository(VenueRepository)
    public venueRepository: VenueRepository,
    @repository(UserRepository) private userRepository: UserRepository,
    @inject('services.VenueRankingService')
    private venueRankingService: VenueRankingService,
    @inject('services.AdInsertionService')
    private adInsertionService: AdInsertionService,
    @service() private apiResponseService: ApiResponseService,
    @inject('services.CachingService') private cachingService: CachingService,
  ) {}

  @post('/venue')
  @response(200, {
    description: 'Venue model instance',
    content: {'application/json': {schema: getModelSchemaRef(Venue)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Venue, {
            title: 'NewVenue',
            exclude: ['id'],
          }),
        },
      },
    })
    venue: Omit<Venue, 'id'>,
  ): Promise<Venue> {
    return this.venueRepository.create(venue);
  }

  @get('/venue/count')
  @response(200, {
    description: 'Venue model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Venue) where?: Where<Venue>): Promise<Count> {
    return this.venueRepository.count(where);
  }

  @get('/venue')
  @response(200, {
    description: 'Array of Venue model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Venue, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Venue) filter?: Filter<Venue>): Promise<Venue[]> {
    return this.venueRepository.find(filter);
  }
  @get('/venues')
  async getVenues(
    @param.query.string('userId') userId: string,
    @param.query.string('zone') zone: string,
    @param.query.number('latitude') latitude: number,
    @param.query.number('longitude') longitude: number,
  ): Promise<any> {
    try {
      const cacheKey = `venues_${userId}_${latitude}_${longitude}`;
      const cachedResult = await this.cachingService.getCachedValue(cacheKey);
      if (cachedResult) {
        return this.apiResponseService.success("Venues Fetched Successfully", JSON.parse(cachedResult), 200)
      }

      const user = await this.userRepository.findById(userId);
      user.location = {latitude, longitude};

      const rankedVenues = await this.venueRankingService.rankVenues(
        user,
        zone,
      );
      const finalResult = await this.adInsertionService.insertAds(
        rankedVenues,
        zone,
      );

      await this.cachingService.setCacheValue(
        cacheKey,
        JSON.stringify(finalResult),
        3600,
      );
      return this.apiResponseService.success("Venues Fetched Successfully", finalResult, 200)
      // return finalResult;
    } catch (error) {
      throw error
    }
  }

  @patch('/venue')
  @response(200, {
    description: 'Venue PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Venue, {partial: true}),
        },
      },
    })
    venue: Venue,
    @param.where(Venue) where?: Where<Venue>,
  ): Promise<Count> {
    return this.venueRepository.updateAll(venue, where);
  }

  @get('/venue/{id}')
  @response(200, {
    description: 'Venue model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Venue, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Venue, {exclude: 'where'})
    filter?: FilterExcludingWhere<Venue>,
  ): Promise<Venue> {
    return this.venueRepository.findById(id, filter);
  }

  @patch('/venue/{id}')
  @response(204, {
    description: 'Venue PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Venue, {partial: true}),
        },
      },
    })
    venue: Venue,
  ): Promise<void> {
    await this.venueRepository.updateById(id, venue);
  }

  @put('/venue/{id}')
  @response(204, {
    description: 'Venue PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() venue: Venue,
  ): Promise<void> {
    await this.venueRepository.replaceById(id, venue);
  }

  @del('/venue/{id}')
  @response(204, {
    description: 'Venue DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.venueRepository.deleteById(id);
  }
}
