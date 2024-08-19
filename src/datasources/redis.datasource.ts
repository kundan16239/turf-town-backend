import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as redis from 'redis';

const config = {
  name: 'redis',
  connector: 'kv-redis',
  url: process.env.REDIS_URL, // Added missing comma
  // host: 'redis-14223.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
  // port: 14223,
  // password: 'f7WD9Tgjcdne81n2ORr14Bg2pNb6bnZZ',
  // db: 0
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class RedisDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'redis';
  static readonly defaultConfig = config;
  public client: redis.RedisClientType;

  constructor(
    @inject('datasources.config.redis', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);

    // Initialize the Redis client with the provided URL from the config
    this.client = redis.createClient({
      url: config.url,
    });

    this.client.connect().catch(err => {
      console.error('Failed to connect to Redis', err);
    });
  }

  // Ensure to disconnect the Redis client when the application is stopped
  async disconnect(): Promise<void> {
    await this.client.quit();
    super.disconnect();
  }
}
