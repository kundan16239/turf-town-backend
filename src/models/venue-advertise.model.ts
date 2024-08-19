import {Entity, model, property} from '@loopback/repository';

@model()
export class VenueAdvertise extends Entity {
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
  zone: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  sports: string[];

  @property({
    type: 'number',
  })
  insertionPosition: number;

  @property({
    type: 'string',
    required: true,
  })
  venueId: string;

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

  constructor(data?: Partial<VenueAdvertise>) {
    super(data);
  }
}

export interface VenueAdvertiseRelations {
  // describe navigational properties here
}

export type VenueAdvertiseWithRelations = VenueAdvertise & VenueAdvertiseRelations;
