import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { ContractService } from './contract';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const prisma = new PrismaClient();
const contractService = new ContractService();

export class MarketService {
  async getTokenMarketData(tokenId: number) {
    try {
      // Try to get from cache first
      const cachedData = await redis.get(`token:${tokenId}:market`);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, fetch from contract
      const marketData = await contractService.getTokenMarketData(tokenId);
      
      // Update database
      await prisma.marketData.upsert({
        where: { tokenId },
        update: {
          price: marketData.price,
          volume24h: marketData.volume24h,
          holders: marketData.holders,
          marketCap: marketData.marketCap,
          lastUpdated: new Date(),
        },
        create: {
          tokenId,
          price: marketData.price,
          volume24h: marketData.volume24h,
          holders: marketData.holders,
          marketCap: marketData.marketCap,
        },
      });

      // Cache the data for 1 minute
      await redis.set(
        `token:${tokenId}:market`,
        JSON.stringify(marketData),
        'EX',
        60
      );

      return marketData;
    } catch (error: any) {
      console.error('Error getting market data:', error);
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
      const cacheKey = `token:${tokenId}:chart:${timeframe}:${startBlock}:${endBlock}`;
      
      // Try to get from cache first
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, fetch from contract
      const chartData = await contractService.getTradingViewData(
        tokenId,
        timeframe,
        startBlock,
        endBlock
      );

      // Cache the data for 5 minutes
      await redis.set(cacheKey, JSON.stringify(chartData), 'EX', 300);

      return chartData;
    } catch (error: any) {
      console.error('Error getting trading view data:', error);
      throw error;
    }
  }

  async updateAllMarketData() {
    try {
      // Get all active tokens
      const tokens = await prisma.token.findMany({
        where: { isActive: true },
        select: { id: true },
      });

      for (const token of tokens) {
        try {
          const marketData = await contractService.getTokenMarketData(token.id);
          
          // Update database
          await prisma.marketData.upsert({
            where: { tokenId: token.id },
            update: {
              price: marketData.price,
              volume24h: marketData.volume24h,
              holders: marketData.holders,
              marketCap: marketData.marketCap,
              lastUpdated: new Date(),
            },
            create: {
              tokenId: token.id,
              price: marketData.price,
              volume24h: marketData.volume24h,
              holders: marketData.holders,
              marketCap: marketData.marketCap,
            },
          });

          // Update cache
          await redis.set(
            `token:${token.id}:market`,
            JSON.stringify(marketData),
            'EX',
            60
          );
        } catch (error: any) {
          console.error(`Error updating market data for token ${token.id}:`, error);
        }
      }
    } catch (error: any) {
      console.error('Error updating all market data:', error);
      throw error;
    }
  }

  async getTokenPriceHistory(tokenId: number, limit: number = 100) {
    try {
      const marketData = await prisma.marketData.findUnique({
        where: { tokenId },
        select: { priceHistory: true },
      });

      if (!marketData?.priceHistory) {
        return [];
      }

      const priceHistory = JSON.parse(marketData.priceHistory) as any[];
      return priceHistory.slice(-limit);
    } catch (error: any) {
      console.error('Error getting price history:', error);
      throw error;
    }
  }
} 