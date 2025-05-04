import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { fetchCallReadOnlyFunction, makeContractCall } from '@stacks/transactions';
import { cvToHex, cvToJSON } from '@stacks/transactions';
import { bufferCV, uintCV, stringAsciiCV, someCV, noneCV } from '@stacks/transactions';
import { config } from 'dotenv';

config();

const network = process.env.NODE_ENV === 'production' 
  ? STACKS_MAINNET 
  : STACKS_TESTNET;

const CONTRACT_ADDRESS = 'SPAT9BDQ1NQ5B6VNNVS9J5PEH8WXHAEZ3E2Z72AR';
const CONTRACT_NAME = 'bondingcurvestxfun';

export class ContractService {
  async getTokenMarketData(tokenId: number) {
    try {
      const result = await fetchCallReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-token-market-data',
        functionArgs: [uintCV(tokenId)],
        senderAddress: CONTRACT_ADDRESS,
      });

      const data = cvToJSON(result);
      return {
        price: data.value.price.value,
        volume24h: data.value.volume24h.value,
        holders: data.value.holders.value,
        marketCap: data.value.marketCap.value,
      };
    } catch (error: any) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  async getTradingViewData(
    tokenId: number,
    timeframe: number,
    startBlock: number,
    endBlock: number
  ) {
    try {
      const result = await fetchCallReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-tradingview-data',
        functionArgs: [
          uintCV(tokenId),
          uintCV(timeframe),
          uintCV(startBlock),
          uintCV(endBlock)
        ],
        senderAddress: CONTRACT_ADDRESS,
      });

      return cvToJSON(result);
    } catch (error: any) {
      console.error('Error fetching trading view data:', error);
      throw error;
    }
  }

  async executeTrade(
    tokenId: number,
    amount: number,
    type: 'buy' | 'sell',
    walletAddress: string
  ) {
    try {
      const functionName = type === 'buy' ? 'buy' : 'sell';
      
      const tx = await makeContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs: [
          uintCV(tokenId),
          uintCV(amount)
        ],
        senderKey: process.env.SERVER_PRIVATE_KEY!,
        postConditionMode: 1,
      });

      return {
        success: true,
        txId: tx.txid(),
      };
    } catch (error: any) {
      console.error('Error executing trade:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getTokenCount() {
    try {
      const result = await fetchCallReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-token-count',
        functionArgs: [],
        senderAddress: CONTRACT_ADDRESS,
      });

      return cvToJSON(result).value;
    } catch (error: any) {
      console.error('Error fetching token count:', error);
      throw error;
    }
  }

  async getTokenInfo(tokenId: number) {
    try {
      const result = await fetchCallReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-token-info',
        functionArgs: [uintCV(tokenId)],
        senderAddress: CONTRACT_ADDRESS,
      });

      return cvToJSON(result);
    } catch (error: any) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }
} 