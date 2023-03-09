import { ConfigModule, ConfigService } from '@nestjs/config';
import { Injectable, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from '../assets/MyERC20.json';
import { ConfigureProvider, ConfigureWallet } from '../helpers/utils';
import { PaymentOrder } from 'src/models/paymentOrder.model';
import { number } from 'joi';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  contract: ethers.Contract;
  contractAddress: string;
  network: string;
  privateKey: string;

  paymentOrders: PaymentOrder[];

  constructor(private configService: ConfigService) {
    // Put general things inside here to access from the diffrent funcs.
    this.contractAddress = this.configService.getOrThrow('CONTRACT_ADDRESS')
    this.network = this.configService.getOrThrow('NETWORK')
    this.privateKey = this.configService.getOrThrow('PRIVATE_KEY');
    this.provider = ConfigureProvider(this.network)
    this.contract = new ethers.Contract(this.contractAddress, tokenJson.abi, this.provider);
    this.paymentOrders = [];
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

  createPaymentOrder(value: number, secret: string): number {
    const newPaymentOrder = new PaymentOrder(this.paymentOrders.length, secret, value);
    this.paymentOrders.push(newPaymentOrder)
    return newPaymentOrder.id;
  }

  listPaymentOrders() {
    // filter secrets
    return this.paymentOrders.map((po) => {
      return { id: po.id, value: po.value }
    })
  }

  async claimPayment(id: number, secret: string, address: string) {
    // check if secret matches
    const paymentOrder = this.paymentOrders[id]
    if (secret != paymentOrder.secret) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // Remove from payment orders.
    this.paymentOrders.splice(paymentOrder.id, 1);

    //create signer
    const signer = ConfigureWallet(this.network, this.privateKey)

    // connect signer to contract
    this.contract = new ethers.Contract(this.contractAddress, tokenJson.abi, signer);

    // Parse number to eth.
    const numberToBN = ethers.utils.parseEther(paymentOrder.value.toString())
    // mint value to address
    const allowanceBnTx = await this.contract.mint(address, numberToBN);
    const txReceipt = await allowanceBnTx.wait()

    return txReceipt.transactionHash
  }

}
