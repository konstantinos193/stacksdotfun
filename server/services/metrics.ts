import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { fetchCallReadOnlyFunction, broadcastTransaction, makeContractCall } from '@stacks/transactions';
import { stringAsciiCV, uintCV } from '@stacks/transactions';

export class MetricsService {
  private network: typeof STACKS_TESTNET | typeof STACKS_MAINNET;
  private contractAddress: string;
  private privateKey: string;

  constructor() {
    this.network = process.env.NODE_ENV === 'production' ? STACKS_MAINNET : STACKS_TESTNET;
    this.contractAddress = process.env.CONTRACT_ADDRESS!;
    this.privateKey = process.env.PRIVATE_KEY!;
  }

  async updateTokenMetrics(
    tokenAddress: string,
    currentPrice: number,
    marketCap: number,
    holders: number,
    volumes: {
      volume5m: number;
      volume1h: number;
      volume6h: number;
      volume24h: number;
      totalVolume: number;
    }
  ) {
    const txOptions = {
      contractAddress: this.contractAddress,
      contractName: 'token-metrics',
      functionName: 'update-metrics',
      functionArgs: [
        stringAsciiCV(tokenAddress),
        uintCV(currentPrice),
        uintCV(marketCap),
        uintCV(holders),
        uintCV(volumes.volume5m),
        uintCV(volumes.volume1h),
        uintCV(volumes.volume6h),
        uintCV(volumes.volume24h),
        uintCV(volumes.totalVolume)
      ],
      senderKey: this.privateKey,
      network: this.network,
    };

    try {
      const transaction = await makeContractCall(txOptions);
      const result = await broadcastTransaction({ transaction, network: this.network });
      return result;
    } catch (error) {
      console.error('Error updating token metrics:', error);
      throw error;
    }
  }

  async getTokenMetrics(tokenAddress: string) {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: 'token-metrics',
        functionName: 'get-current-metrics',
        functionArgs: [stringAsciiCV(tokenAddress)],
        network: this.network,
        senderAddress: this.contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching token metrics:', error);
      throw error;
    }
  }

  async getPriceHistory(tokenAddress: string, startTime: number, endTime: number) {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: 'token-metrics',
        functionName: 'get-price-history',
        functionArgs: [
          stringAsciiCV(tokenAddress),
          uintCV(startTime),
          uintCV(endTime)
        ],
        network: this.network,
        senderAddress: this.contractAddress
      });

      return result;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }
} 