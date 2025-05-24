// vnpay.controller.ts
import { Body, Controller, Get, Post, Query, Req, Res, Render } from '@nestjs/common';
import { VnpayService } from 'src/infrastructure/vn-pay/vn-pay.service';
import { Request, Response } from 'express';
import { CreatePaymentDto, QueryTransactionDto, RefundTransactionDto, VnpayReturnDto } from 'src/infrastructure/vn-pay/dto/vnpay.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('VNPay')
@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) {}

  @Get()
  @ApiOperation({ summary: 'Show payment form' })
  @ApiResponse({ status: 200, description: 'Payment form' })
  async showPaymentForm(@Res() res: Response) {
    // Create a simple HTML form
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VNPay Payment</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .container { max-width: 600px; margin: 0 auto; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; }
          input, select { width: 100%; padding: 8px; box-sizing: border-box; }
          button { padding: 10px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
          h1 { color: #333; }
          .nav { margin-bottom: 20px; }
          .nav a { margin-right: 10px; text-decoration: none; color: #0066cc; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="nav">
            <a href="/vnpay">Payment</a>
            <a href="/vnpay/query-form">Query Transaction</a>
            <a href="/vnpay/refund-form">Refund</a>
          </div>
          <h1>VNPay Payment Form</h1>
          <form action="/vnpay/create-payment-url" method="get">
            <div class="form-group">
              <label for="orderId">Order ID:</label>
              <input type="text" id="orderId" name="orderId" required placeholder="Enter order ID">
            </div>
            <div class="form-group">
              <label for="amount">Amount (VND):</label>
              <input type="number" id="amount" name="amount" required placeholder="Enter amount">
            </div>
            <div class="form-group">
              <label for="bankCode">Bank Code (Optional):</label>
              <select id="bankCode" name="bankCode">
                <option value="">Select bank (or leave empty for VNPay portal)</option>
                <option value="NCB">NCB</option>
                <option value="VNPAYQR">VNPAYQR</option>
                <option value="VNBANK">VNBANK</option>
                <option value="INTCARD">INTCARD</option>
              </select>
            </div>
            <div class="form-group">
              <label for="language">Language:</label>
              <select id="language" name="language">
                <option value="vn">Vietnamese</option>
                <option value="en">English</option>
              </select>
            </div>
            <button type="submit">Pay with VNPay</button>
          </form>
        </div>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('query-form')
  @ApiOperation({ summary: 'Show query transaction form' })
  @ApiResponse({ status: 200, description: 'Query form' })
  async showQueryForm(@Res() res: Response) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VNPay Query Transaction</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .container { max-width: 600px; margin: 0 auto; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; }
          input { width: 100%; padding: 8px; box-sizing: border-box; }
          button { padding: 10px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
          h1 { color: #333; }
          pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
          .nav { margin-bottom: 20px; }
          .nav a { margin-right: 10px; text-decoration: none; color: #0066cc; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="nav">
            <a href="/vnpay">Payment</a>
            <a href="/vnpay/query-form">Query Transaction</a>
            <a href="/vnpay/refund-form">Refund</a>
          </div>
          <h1>Query Transaction</h1>
          <form id="queryForm">
            <div class="form-group">
              <label for="orderId">Order ID:</label>
              <input type="text" id="orderId" name="orderId" required placeholder="Enter order ID">
            </div>
            <div class="form-group">
              <label for="transDate">Transaction Date (yyyyMMddHHmmss):</label>
              <input type="text" id="transDate" name="transDate" required placeholder="e.g., 20250522040605">
            </div>
            <button type="submit">Query Transaction</button>
          </form>
          <div id="result" style="margin-top: 20px; display: none;">
            <h2>Result:</h2>
            <pre id="resultContent"></pre>
          </div>
          <script>
            document.getElementById('queryForm').addEventListener('submit', async function(e) {
              e.preventDefault();
              const orderId = document.getElementById('orderId').value;
              const transDate = document.getElementById('transDate').value;
              
              try {
                const response = await fetch('/vnpay/query', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId,
                    transDate
                  }),
                });
                
                const data = await response.json();
                document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
                document.getElementById('result').style.display = 'block';
              } catch (error) {
                document.getElementById('resultContent').textContent = 'Error: ' + error.message;
                document.getElementById('result').style.display = 'block';
              }
            });
          </script>
        </div>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('refund-form')
  @ApiOperation({ summary: 'Show refund form' })
  @ApiResponse({ status: 200, description: 'Refund form' })
  async showRefundForm(@Res() res: Response) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VNPay Refund</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .container { max-width: 600px; margin: 0 auto; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; }
          input, select { width: 100%; padding: 8px; box-sizing: border-box; }
          button { padding: 10px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
          h1 { color: #333; }
          pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
          .nav { margin-bottom: 20px; }
          .nav a { margin-right: 10px; text-decoration: none; color: #0066cc; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="nav">
            <a href="/vnpay">Payment</a>
            <a href="/vnpay/query-form">Query Transaction</a>
            <a href="/vnpay/refund-form">Refund</a>
          </div>
          <h1>Refund Transaction</h1>
          <form id="refundForm">
            <div class="form-group">
              <label for="orderId">Order ID:</label>
              <input type="text" id="orderId" name="orderId" required placeholder="Enter order ID">
            </div>
            <div class="form-group">
              <label for="amount">Amount (VND):</label>
              <input type="number" id="amount" name="amount" required placeholder="Enter amount">
            </div>
            <div class="form-group">
              <label for="transDate">Transaction Date (yyyyMMddHHmmss):</label>
              <input type="text" id="transDate" name="transDate" required placeholder="e.g., 20250522040605">
            </div>
            <div class="form-group">
              <label for="user">User:</label>
              <input type="text" id="user" name="user" required placeholder="Enter user">
            </div>
            <div class="form-group">
              <label for="transType">Transaction Type:</label>
              <select id="transType" name="transType">
                <option value="02">02 - Refund</option>
                <option value="03">03 - Cancel</option>
              </select>
            </div>
            <button type="submit">Process Refund</button>
          </form>
          <div id="result" style="margin-top: 20px; display: none;">
            <h2>Result:</h2>
            <pre id="resultContent"></pre>
          </div>
          <script>
            document.getElementById('refundForm').addEventListener('submit', async function(e) {
              e.preventDefault();
              const orderId = document.getElementById('orderId').value;
              const amount = document.getElementById('amount').value;
              const transDate = document.getElementById('transDate').value;
              const user = document.getElementById('user').value;
              const transType = document.getElementById('transType').value;
              
              try {
                const response = await fetch('/vnpay/refund', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId,
                    amount: Number(amount),
                    transDate,
                    user,
                    transType
                  }),
                });
                
                const data = await response.json();
                document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
                document.getElementById('result').style.display = 'block';
              } catch (error) {
                document.getElementById('resultContent').textContent = 'Error: ' + error.message;
                document.getElementById('result').style.display = 'block';
              }
            });
          </script>
        </div>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('create-payment-url')
  @ApiOperation({ summary: 'Create VNPay payment URL' })
  @ApiQuery({ name: 'orderId', type: String, required: true, description: 'Order ID' })
  @ApiQuery({ name: 'amount', type: Number, required: true, description: 'Amount to pay' })
  @ApiQuery({ name: 'bankCode', type: String, required: false, description: 'Bank code (optional)' })
  @ApiQuery({ name: 'language', type: String, required: false, description: 'Language (default: vn)', enum: ['vn', 'en'] })
  @ApiResponse({ status: 302, description: 'Redirect to VNPay payment gateway' })
  async createPayment(
    @Query('orderId') orderId: string,
    @Query('amount') amount: number,
    @Req() req: Request, 
    @Res() res: Response,
    @Query('bankCode') bankCode?: string,
    @Query('language') language: string = 'vn'
  ) {
    if (!orderId || !amount) {
      return res.status(400).json({
        message: 'orderId and amount are required'
      });
    }
    
    const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    const url = this.vnpayService.createPaymentUrl(
      orderId,
      Number(amount),
      ip.toString(),
      bankCode,
      language
    );
    return res.redirect(url);
  }

  @Get('return')
  @ApiOperation({ summary: 'Handle VNPay payment return' })
  @ApiResponse({ status: 200, description: 'Payment result' })
  async handleReturn(@Query() query: VnpayReturnDto, @Res() res: Response) {
    const valid = this.vnpayService.validateSignature(query);
    if (valid && query.vnp_ResponseCode === '00') {
      res.send('Nạp tiền thành công');
    } else {
      res.send('Thanh toán thất bại');
    }
  }

  @Post('ipn')
  @ApiOperation({ summary: 'Handle VNPay IPN (Instant Payment Notification)' })
  @ApiResponse({ status: 200, description: 'IPN processed' })
  async handleIpn(@Body() params: VnpayReturnDto, @Res() res: Response) {
    const valid = this.vnpayService.validateSignature(params);
    
    if (!valid) {
      return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
    
    const orderId = params.vnp_TxnRef;
    const rspCode = params.vnp_ResponseCode;
    
    // TODO: Check orderId exists in database
    const checkOrderId = true; 
    
    // TODO: Check amount matches with order in database
    const checkAmount = true; 
    
    // TODO: Check payment status in database (0: init, 1: success, 2: failed)
    const paymentStatus = '0';
    
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus === '0') {
          if (rspCode === '00') {
            // TODO: Update payment status to success in database
            return res.status(200).json({ RspCode: '00', Message: 'Success' });
          } else {
            // TODO: Update payment status to failed in database
            return res.status(200).json({ RspCode: '00', Message: 'Success' });
          }
        } else {
          return res.status(200).json({ 
            RspCode: '02', 
            Message: 'This order has been updated to the payment status' 
          });
        }
      } else {
        return res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
      }
    } else {
      return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }
  }

  @Post('query')
  @ApiOperation({ summary: 'Query transaction status' })
  @ApiResponse({ status: 200, description: 'Transaction query result' })
  async queryTransaction(
    @Body() queryTransactionDto: QueryTransactionDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    try {
      const result = await this.vnpayService.queryTransaction(
        queryTransactionDto.orderId, 
        queryTransactionDto.transDate, 
        ip.toString()
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund transaction' })
  @ApiResponse({ status: 200, description: 'Refund result' })
  async refundTransaction(
    @Body() refundTransactionDto: RefundTransactionDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    try {
      const result = await this.vnpayService.refundTransaction(
        refundTransactionDto.orderId, 
        refundTransactionDto.amount, 
        refundTransactionDto.transDate, 
        refundTransactionDto.user, 
        ip.toString(), 
        refundTransactionDto.transType
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
