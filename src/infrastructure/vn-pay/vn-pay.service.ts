import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qs from 'qs';
import * as moment from 'moment';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VnpayService {
  private tmnCode: string;
  private hashSecret: string;
  private vnpUrl: string;
  private returnUrl: string;
  private vnpApi: string;

  constructor(private configService: ConfigService) {
    this.tmnCode = this.configService.get<string>('vnpay.tmnCode');
    this.hashSecret = this.configService.get<string>('vnpay.hashSecret');
    this.vnpUrl = this.configService.get<string>('vnpay.url');
    this.returnUrl = this.configService.get<string>('vnpay.returnUrl');
    this.vnpApi = this.configService.get<string>('vnpay.api');
  }

  createPaymentUrl(orderId: string, amount: number, ip: string, bankCode?: string, locale: string = 'vn') {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    
    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ip,
      vnp_CreateDate: createDate,
    };

    if (bankCode) vnp_Params.vnp_BankCode = bankCode;

    const sortedParams = this.sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams.vnp_SecureHash = signed;
    return this.vnpUrl + '?' + qs.stringify(sortedParams, { encode: false });
  }

  validateSignature(params: any): boolean {
    const receivedHash = params.vnp_SecureHash;
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const sorted = this.sortObject(params);
    const signData = qs.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac('sha512', this.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return signed === receivedHash;
  }

  async queryTransaction(orderId: string, transactionDate: string, ipAddr: string) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const requestId = moment(date).format('HHmmss');
    
    const vnp_RequestId = requestId;
    const vnp_Version = '2.1.0';
    const vnp_Command = 'querydr';
    const vnp_TmnCode = this.tmnCode;
    const vnp_TxnRef = orderId;
    const vnp_OrderInfo = `Truy van GD ma: ${orderId}`;
    const vnp_TransactionDate = transactionDate;
    const vnp_CreateDate = createDate;
    const vnp_IpAddr = ipAddr;
    
    const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
    
    const hmac = crypto.createHmac("sha512", this.hashSecret);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex");
    
    const requestBody = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TxnRef,
      vnp_OrderInfo,
      vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_SecureHash
    };
    
    try {
      const response = await axios.post(this.vnpApi, requestBody);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to query transaction: ${error.message}`);
    }
  }

  async refundTransaction(orderId: string, amount: number, transactionDate: string, user: string, ipAddr: string, transactionType = '02') {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const requestId = moment(date).format('HHmmss');
    
    const vnp_RequestId = requestId;
    const vnp_Version = '2.1.0';
    const vnp_Command = 'refund';
    const vnp_TmnCode = this.tmnCode;
    const vnp_TransactionType = transactionType;
    const vnp_TxnRef = orderId;
    const vnp_Amount = amount * 100;
    const vnp_TransactionNo = '0';
    const vnp_TransactionDate = transactionDate;
    const vnp_CreateBy = user;
    const vnp_CreateDate = createDate;
    const vnp_IpAddr = ipAddr;
    const vnp_OrderInfo = `Hoan tien GD ma: ${orderId}`;
    
    const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TransactionType}|${vnp_TxnRef}|${vnp_Amount}|${vnp_TransactionNo}|${vnp_TransactionDate}|${vnp_CreateBy}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
    
    const hmac = crypto.createHmac("sha512", this.hashSecret);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex");
    
    const requestBody = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_OrderInfo,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_SecureHash
    };
    
    try {
      const response = await axios.post(this.vnpApi, requestBody);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to refund transaction: ${error.message}`);
    }
  }

  private sortObject(obj: Record<string, any>) {
    const sorted: Record<string, any> = {};
    const str = Object.keys(obj)
      .map(key => encodeURIComponent(key))
      .sort();
      
    for (let i = 0; i < str.length; i++) {
      const key = str[i];
      const decodedKey = decodeURIComponent(key);
      sorted[decodedKey] = encodeURIComponent(obj[decodedKey]).replace(/%20/g, "+");
    }
    
    return sorted;
  }
}
