import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
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
}