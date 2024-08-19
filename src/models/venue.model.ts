import {Entity, model, property} from '@loopback/repository';

@model()
export class Venue extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: "ObjectId"}
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  zone: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    default: [],
  })
  sports: string[];

  @property({
    type: 'number',
    default: 0,
  })
  rating: number;

  @property({
    type: 'object',
    required: true,
  })
  location: {type: 'Point'; coordinates: [number, number]};

  @property({
    type: 'date',
    default: new Date
  })
  createdAt: Date

  @property({
    type: 'date',
    default: new Date
  })
  updatedAt: Date


  constructor(data?: Partial<Venue>) {
    super(data);
  }
}

export interface VenueRelations {
  // describe navigational properties here
}

export type VenueWithRelations = Venue & VenueRelations;
