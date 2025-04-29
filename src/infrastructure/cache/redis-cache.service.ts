import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly DEFAULT_TTL = 60 * 60 * 24; // 24 hours in seconds

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.logger.log('RedisCacheService initialized');
  }

  /**
   * Check if Redis connection is working
   * @returns {Promise<boolean>} True if connected, false otherwise
   */
  async checkConnection(): Promise<boolean> {
    try {
      const redisClient = (this.cacheManager as any).store.getClient();
      if (!redisClient) {
        this.logger.error('Redis client not available');
        return false;
      }
      
      // Set a test value
      const testKey = 'connection-test';
      await this.set(testKey, 'connected');
      
      // Get the test value
      const result = await this.get(testKey);
      
      // Delete the test key
      await this.delete(testKey);
      
      if (result === 'connected') {
        this.logger.log('Successfully connected to Redis');
        return true;
      } else {
        this.logger.error('Redis connection test failed');
        return false;
      }
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
      await this.cacheManager.set(key, value, ttl);
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
      const value = await this.cacheManager.get<T>(key);
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
      await this.cacheManager.del(key);
      this.logger.debug(`Deleted cache for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache for key ${key}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Invalidate cache by pattern (using Redis key pattern)
   * @param pattern The pattern to match keys (e.g., "user:*")
   */
  async invalidateByPattern(pattern: string): Promise<void> {
    try {
      // Access Redis client directly to use the KEYS command
      const redisClient = (this.cacheManager as any).store.getClient();
      if (redisClient && typeof redisClient.keys === 'function') {
        const keys = await redisClient.keys(pattern);
        
        if (keys.length > 0) {
          await Promise.all(keys.map(key => this.cacheManager.del(key)));
          this.logger.debug(`Invalidated ${keys.length} keys matching pattern: ${pattern}`);
        }
      } else {
        this.logger.warn('Redis client not available or keys method not found');
      }
    } catch (error) {
      this.logger.error(`Error invalidating cache by pattern ${pattern}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clear all cache
   */
  async reset(): Promise<void> {
    try {
      // Check if reset method exists
      if (typeof (this.cacheManager as any).reset === 'function') {
        await (this.cacheManager as any).reset();
        this.logger.debug('Cache reset successfully');
      } else {
        // Fallback: obtain all keys and delete them
        const redisClient = (this.cacheManager as any).store.getClient();
        if (redisClient && typeof redisClient.flushall === 'function') {
          await redisClient.flushall();
          this.logger.debug('Cache flushed successfully');
        } else {
          this.logger.warn('Could not reset cache, no compatible method found');
        }
      }
    } catch (error) {
      this.logger.error(`Error resetting cache: ${error.message}`);
      throw error;
    }
  }
} 