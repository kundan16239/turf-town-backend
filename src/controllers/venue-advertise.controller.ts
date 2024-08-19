import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {VenueAdvertise} from '../models';
import {VenueAdvertiseRepository} from '../repositories';

export class VenueAdvertiseController {
  constructor(
    @repository(VenueAdvertiseRepository)
    public venueAdvertiseRepository : VenueAdvertiseRepository,
  ) {}

  @post('/venue-advertises')
  @response(200, {
    description: 'VenueAdvertise model instance',
    content: {'application/json': {schema: getModelSchemaRef(VenueAdvertise)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VenueAdvertise, {
            title: 'NewVenueAdvertise',
            exclude: ['id'],
          }),
        },
      },
    })
    venueAdvertise: Omit<VenueAdvertise, 'id'>,
  ): Promise<VenueAdvertise> {
    return this.venueAdvertiseRepository.create(venueAdvertise);
  }

  @get('/venue-advertises/count')
  @response(200, {
    description: 'VenueAdvertise model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(VenueAdvertise) where?: Where<VenueAdvertise>,
  ): Promise<Count> {
    return this.venueAdvertiseRepository.count(where);
  }

  @get('/venue-advertises')
  @response(200, {
    description: 'Array of VenueAdvertise model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(VenueAdvertise, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(VenueAdvertise) filter?: Filter<VenueAdvertise>,
  ): Promise<VenueAdvertise[]> {
    return this.venueAdvertiseRepository.find(filter);
  }

  @patch('/venue-advertises')
  @response(200, {
    description: 'VenueAdvertise PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VenueAdvertise, {partial: true}),
        },
      },
    })
    venueAdvertise: VenueAdvertise,
    @param.where(VenueAdvertise) where?: Where<VenueAdvertise>,
  ): Promise<Count> {
    return this.venueAdvertiseRepository.updateAll(venueAdvertise, where);
  }

  @get('/venue-advertises/{id}')
  @response(200, {
    description: 'VenueAdvertise model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(VenueAdvertise, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(VenueAdvertise, {exclude: 'where'}) filter?: FilterExcludingWhere<VenueAdvertise>
  ): Promise<VenueAdvertise> {
    return this.venueAdvertiseRepository.findById(id, filter);
  }

  @patch('/venue-advertises/{id}')
  @response(204, {
    description: 'VenueAdvertise PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VenueAdvertise, {partial: true}),
        },
      },
    })
    venueAdvertise: VenueAdvertise,
  ): Promise<void> {
    await this.venueAdvertiseRepository.updateById(id, venueAdvertise);
  }

  @put('/venue-advertises/{id}')
  @response(204, {
    description: 'VenueAdvertise PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() venueAdvertise: VenueAdvertise,
  ): Promise<void> {
    await this.venueAdvertiseRepository.replaceById(id, venueAdvertise);
  }

  @del('/venue-advertises/{id}')
  @response(204, {
    description: 'VenueAdvertise DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.venueAdvertiseRepository.deleteById(id);
  }
}
