import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly DEFAULT_TTL = 60 * 60 * 24; // 24 hours in seconds
  private store: any;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.logger.log('RedisCacheService initialized');
    this.store = this.cacheManager.stores[0];
  }

  /**
   * Check if Redis connection is working
   * @returns {Promise<boolean>} True if connected, false otherwise
   */
  async checkConnection(): Promise<boolean> {
    try {
      // Try to set and get a test value
      await this.set('connection-test', 'ok');
      const result = await this.get('connection-test');
      await this.delete('connection-test');
      
      if (result === 'ok') {
        this.logger.log('Successfully connected to Redis');
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Redis connection error: ${error.message}`);
      return false;
    }
  }

  /**
   * Set a value in cache with optional TTL
   * @param key The cache key
   * @param value The value to cache
   * @param ttl Time to live in seconds (optional, defaults to 24 hours)
   */
  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      await this.store.set(key, value, ttl * 1000); // Convert to milliseconds
      this.logger.debug(`Cached value for key: ${key} with TTL: ${ttl}s`);
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a value from cache
   * @param key The cache key
   * @returns The cached value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.store.get(key) as T;
      if (value) {
        this.logger.debug(`Cache hit for key: ${key}`);
      } else {
        this.logger.debug(`Cache miss for key: ${key}`);
      }
      return value;
    } catch (error) {
      this.logger.error(`Error getting cache for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Delete a value from cache
   * @param key The cache key
   */
  async delete(key: string): Promise<void> {
    try {
      await this.store.delete(key);
      this.logger.debug(`Deleted cache for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache for key ${key}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    try {
      await this.store.clear();
      this.logger.debug('Cache cleared successfully');
    } catch (error) {
      this.logger.error(`Error clearing cache: ${error.message}`);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    await this.store.delete(key);
  }
} 