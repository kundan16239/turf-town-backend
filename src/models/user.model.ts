import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
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
    type: 'array',
    itemType: 'string',
    required: true,
    default: [],
  })
  preferredSports: string[];

  @property({
    type: 'object',
    required: true,
  })
  location: {latitude: number; longitude: number};

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

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
