import { Withdraw } from '../entities/withdraw.entity';

export interface IWithdrawRepository {
  /**
   * Create a new withdrawal request
   * @param data Withdrawal data
   * @returns Created withdrawal
   */
  create(data: Partial<Withdraw>): Promise<Withdraw>;

  /**
   * Find withdrawal by ID
   * @param id Withdrawal ID
   * @returns Withdrawal or null if not found
   */
  findById(id: string): Promise<Withdraw | null>;

  /**
   * Find all withdrawals by user ID
   * @param userId User ID
   * @param limit Maximum number of results to return
   * @param page Page number
   * @returns Withdrawals and total count
   */
  findByUserId(userId: number, limit?: number, page?: number): Promise<{ withdrawals: Withdraw[], total: number }>;

  /**
   * Find all withdrawals with optional pagination
   * @param limit Maximum number of results to return
   * @param page Page number
   * @returns Withdrawals and total count
   */
  findAll(limit?: number, page?: number): Promise<{ withdrawals: Withdraw[], total: number }>;

  /**
   * Update withdrawal status
   * @param id Withdrawal ID
   * @param status New status
   * @param approvedAt Approval date (for success or rejected status)
   * @returns Updated withdrawal
   */
  updateStatus(id: string, status: string, approvedAt?: Date): Promise<Withdraw>;

  /**
   * Delete withdrawal by ID
   * @param id Withdrawal ID
   * @returns True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;
} 