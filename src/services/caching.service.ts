import {inject, injectable} from '@loopback/core';
import {RedisDataSource} from '../datasources/redis.datasource';

@injectable()
export class CachingService {
  private redisClient: any;

  constructor(@inject('datasources.redis') private redisDataSource: RedisDataSource) {
    this.redisClient = this.redisDataSource.client;

    if (!this.redisClient || !this.redisClient.isOpen) {
      throw new Error('Redis client is not available');
    }
  }

  async getCachedValue(key: string): Promise<any> {
    if (!this.redisClient.isOpen) {
      throw new Error('Redis client is not connected');
    }
    const result = await this.redisClient.get(key);
    return result ? JSON.parse(result) : null;
  }

  async setCacheValue(key: string, value: any, ttl: number): Promise<void> {
    if (!this.redisClient.isOpen) {
      throw new Error('Redis client is not connected');
    }
    await this.redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }
}
