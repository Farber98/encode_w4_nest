import { ConfigModule, ConfigService } from '@nestjs/config';
import { Injectable, Get } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from '../assets/MyERC20.json';
import { ConfigureProvider } from '../helpers/utils';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  contract: ethers.Contract;
  contractAddress: string;
  network: string;
  constructor(private configService: ConfigService) {
    // Put general things inside here to access from the diffrent funcs.
    this.contractAddress = this.configService.getOrThrow('CONTRACT_ADDRESS')
    this.network = this.configService.getOrThrow('NETWORK')
    this.provider = ConfigureProvider(this.network)
    this.contract = new ethers.Contract(this.contractAddress, tokenJson.abi, this.provider);
  }

  getHello(): string {
    return 'Hello World!!';
  }


  async getTotalSupply(): Promise<string> {
    const totalSupplyBN = await this.contract.totalSupply();
    // Return string formatted as ether.
    return ethers.utils.formatEther(totalSupplyBN)
  }

  async getAllowance(from: string, to: string): Promise<string> {
    const allowanceBn = await this.contract.allowance(from, to);
    return ethers.utils.formatEther(allowanceBn);
  }

  getTransaction(hash: string): Promise<ethers.providers.TransactionResponse> {
    return this.provider.getTransaction(hash);
  }

}
