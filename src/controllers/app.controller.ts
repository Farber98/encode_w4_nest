import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { PaymentOrder } from 'src/models/paymentOrder.model';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-address')
  getContractAddress(): string {
    return this.configService.getOrThrow('CONTRACT_ADDRESS');
  }

  @Get('total-supply')
  getTotalSupply(): Promise<string> {
    return this.appService.getTotalSupply();
  }

  @Get('allowance')
  getAllowance(
    @Query('from') from: string,
    @Query('to') to: string
  ): Promise<string> {
    return this.appService.getAllowance(from, to);
  }

  @Get('tx/:hash')
  getTransaction(@Param('hash') hash: string): Promise<ethers.providers.TransactionResponse> {
    return this.appService.getTransaction(hash);
  }

  @Get('payment-orders')
  listPaymentOrders() {
    return this.appService.listPaymentOrders()
  }

  @Post("payment-order")
  createPaymentOrder(
    @Body() body: PaymentOrder
  ) {
    return this.appService.createPaymentOrder(body.value, body.secret);
  }

  @Post("claim")
  claimPaymentOrder(
    @Body() body: PaymentOrder
  ) {
    return this.appService.claimPayment(body.id, body.secret, body.address);
  }
}