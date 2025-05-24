import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID', example: 'ORDER123' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Amount to pay', example: 100000 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({ description: 'Bank code (optional)', example: 'NCB' })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiPropertyOptional({ description: 'Language (default: vn)', example: 'vn', enum: ['vn', 'en'] })
  @IsOptional()
  @IsString()
  language?: string;
}

export class QueryTransactionDto {
  @ApiProperty({ description: 'Order ID', example: 'ORDER123' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Transaction date (yyyyMMddHHmmss)', example: '20250522040605' })
  @IsNotEmpty()
  @IsString()
  transDate: string;
}

export class RefundTransactionDto {
  @ApiProperty({ description: 'Order ID', example: 'ORDER123' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Amount to refund', example: 100000 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ description: 'Transaction date (yyyyMMddHHmmss)', example: '20250522040605' })
  @IsNotEmpty()
  @IsString()
  transDate: string;

  @ApiProperty({ description: 'User who requested the refund', example: 'admin' })
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiPropertyOptional({ description: 'Transaction type (default: 02)', example: '02' })
  @IsOptional()
  @IsString()
  transType?: string;
}

export class VnpayReturnDto {
  @ApiProperty({ description: 'Terminal ID' })
  @IsString()
  vnp_TmnCode: string;

  @ApiProperty({ description: 'Amount (already multiplied by 100)' })
  @IsString()
  vnp_Amount: string;

  @ApiProperty({ description: 'Bank code' })
  @IsString()
  vnp_BankCode: string;

  @ApiPropertyOptional({ description: 'Bank transaction number' })
  @IsString()
  vnp_BankTranNo?: string;

  @ApiProperty({ description: 'Card type' })
  @IsString()
  vnp_CardType: string;

  @ApiProperty({ description: 'Payment date (yyyyMMddHHmmss)' })
  @IsString()
  vnp_PayDate: string;

  @ApiProperty({ description: 'Order information' })
  @IsString()
  vnp_OrderInfo: string;

  @ApiProperty({ description: 'VNPay transaction number' })
  @IsString()
  vnp_TransactionNo: string;

  @ApiProperty({ description: 'Response code (00: success)' })
  @IsString()
  vnp_ResponseCode: string;

  @ApiProperty({ description: 'Transaction status' })
  @IsString()
  vnp_TransactionStatus: string;

  @ApiProperty({ description: 'Order ID' })
  @IsString()
  vnp_TxnRef: string;

  @ApiProperty({ description: 'Secure hash for validation' })
  @IsString()
  vnp_SecureHash: string;
} 