import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import multer from 'multer'
import dotenv from 'dotenv'
import path from 'path'
import { StacksService } from './services/stacks'
import { MetricsService } from './services/metrics'
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network'
import { connect } from '@stacks/connect'
import { getAddressFromPrivateKey } from '@stacks/transactions'
import { cvToHex } from '@stacks/transactions'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'

// Load environment variables
dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Initialize Stacks service
const stacksService = new StacksService()
const metricsService = new MetricsService()

// Initialize Prisma and Redis
const prisma = new PrismaClient()
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Network configuration
const network = process.env.NODE_ENV === 'production' 
  ? STACKS_MAINNET 
  : STACKS_TESTNET

// Contract address
const CONTRACT_ADDRESS = 'SPAT9BDQ1NQ5B6VNNVS9J5PEH8WXHAEZ3E2Z72AR'
const CONTRACT_NAME = 'bondingcurvestxfun'

// Price feed interval (5 minutes)
const PRICE_FEED_INTERVAL = 5 * 60 * 1000

// Socket.IO connection handling
io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id)

  socket.on('subscribe', (tokenId: string) => {
    socket.join(`token:${tokenId}`)
  })

  socket.on('unsubscribe', (tokenId: string) => {
    socket.leave(`token:${tokenId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

interface MarketData {
  price: number;
  volume24h: number;
  holders: number;
  marketCap: number;
  priceHistory: string;
}

// Price feed service
async function updatePriceFeeds() {
  try {
    // Get all active tokens
    const tokens = await prisma.token.findMany({
      where: { isActive: true }
    })

    for (const token of tokens) {
      // Get latest market data from contract
      const marketData = await getTokenMarketData(token.id)
      
      // Update database
      await prisma.marketData.upsert({
        where: { tokenId: token.id },
        update: {
          price: marketData.price,
          volume24h: marketData.volume24h,
          holders: marketData.holders,
          marketCap: marketData.marketCap,
          lastUpdated: new Date(),
          priceHistory: JSON.stringify(marketData.priceHistory)
        },
        create: {
          tokenId: token.id,
          price: marketData.price,
          volume24h: marketData.volume24h,
          holders: marketData.holders,
          marketCap: marketData.marketCap,
          priceHistory: JSON.stringify(marketData.priceHistory)
        }
      })
      
      // Update Redis cache
      await redis.set(`token:${token.id}:market`, JSON.stringify(marketData))
      
      // Emit update to subscribed clients
      io.to(`token:${token.id}`).emit('marketUpdate', marketData)
    }
  } catch (error) {
    console.error('Price feed update error:', error)
  }
}

// Start price feed service
setInterval(updatePriceFeeds, PRICE_FEED_INTERVAL)

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024, // 500KB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'))
    }
  }
})

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const file = req.file
    const fileType = file.mimetype
    const fileSize = file.size

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' })
    }

    // Validate file size (500KB limit)
    if (fileSize > 500 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 500KB limit' })
    }

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('token-images')
      .upload(`${Date.now()}-${file.originalname}`, file.buffer, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return res.status(500).json({ error: 'Failed to upload file to storage' })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('token-images')
      .getPublicUrl(data.path)

    res.json({ url: publicUrl })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Trade processing worker
async function processTradeQueue() {
  while (true) {
    try {
      const tradeData = await redis.brpop('trade:queue', 0)
      if (!tradeData) continue

      const trade = JSON.parse(tradeData[1])
      
      // Create trade record
      const dbTrade = await prisma.trade.create({
        data: {
          tokenId: trade.tokenId,
          amount: trade.amount,
          type: trade.type,
          walletAddress: trade.walletAddress,
          status: 'pending'
        }
      })
      
      // Execute trade on contract
      const result = await executeTrade(
        trade.tokenId,
        trade.amount,
        trade.type,
        trade.walletAddress
      )

      // Update trade status
      await prisma.trade.update({
        where: { id: dbTrade.id },
        data: { 
          status: result.success ? 'completed' : 'failed',
          txId: result.txId,
          error: result.error
        }
      })

      // Emit trade update
      io.to(`token:${trade.tokenId}`).emit('tradeUpdate', {
        tradeId: dbTrade.id,
        status: result.success ? 'completed' : 'failed'
      })
    } catch (error) {
      console.error('Trade processing error:', error)
    }
  }
}

// Start trade processing worker
processTradeQueue()

// Helper functions
interface TradeResult {
  success: boolean;
  txId?: string;
  error?: string;
}

// Contract interaction functions
async function launchToken(
  initialPurchase: number,
  name: string,
  symbol: string,
  description: string,
  website: string,
  twitter: string,
  telegram: string,
  logoUrl: string,
  walletAddress: string
) {
  // Return contract call params for frontend to use
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'launch-token',
    functionArgs: [
      initialPurchase, // initial-purchase
      name, // name
      symbol, // symbol
      description, // description
      website, // website
      twitter, // twitter
      telegram, // telegram
      logoUrl // logo-url
    ]
  }
}

async function getTokenCount() {
  try {
    const result = await stacksService.callReadOnly({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-token-count',
      functionArgs: []
    })
    return result
  } catch (error) {
    console.error('Get token count error:', error)
    throw error
  }
}

async function getTokenList(offset: number, limit: number) {
  try {
    const result = await stacksService.callReadOnly({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-token-list',
      functionArgs: [offset, limit]
    })
    return result
  } catch (error) {
    console.error('Get token list error:', error)
    throw error
  }
}

async function getTokenMarketData(id: number): Promise<MarketData> {
  try {
    const result = await stacksService.callReadOnly({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-token-market-data',
      functionArgs: [id]
    })
    return result as MarketData
  } catch (error) {
    console.error('Get token market data error:', error)
    throw error
  }
}

async function buyTokens(id: number, amount: number, walletAddress: string) {
  // Return contract call params for frontend to use
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'buy',
    functionArgs: [id, amount, walletAddress]
  }
}

async function sellTokens(id: number, amount: number, walletAddress: string) {
  // Return contract call params for frontend to use
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'sell',
    functionArgs: [id, amount, walletAddress]
  }
}

async function getTradingViewData(
  id: number,
  timeframe: number,
  startBlock: number,
  endBlock: number
) {
  try {
    const result = await stacksService.callReadOnly({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-tradingview-data-range',
      functionArgs: [id, timeframe, startBlock, endBlock]
    })
    return result
  } catch (error) {
    console.error('Get trading view data error:', error)
    throw error
  }
}

function validateTrade(amount: number, type: string) {
  // Validate trade parameters
  return amount > 0 && (type === 'buy' || type === 'sell')
}

async function executeTrade(
  tokenId: number,
  amount: number,
  type: string,
  walletAddress: string
): Promise<TradeResult> {
  // Implementation to execute trade on contract
  // Returns transaction result
  return {
    success: true,
    txId: 'tx123'
  }
}

// Token launch endpoint
app.post('/api/token', async (req, res) => {
  try {
    const {
      tokenName,
      tokenSymbol,
      description,
      website,
      twitter,
      telegram,
      tokenImage,
      walletAddress,
      initialPurchase
    } = req.body

    // Validate required fields
    if (!tokenName || !tokenSymbol || !walletAddress || !tokenImage) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create token in database
    const token = await prisma.token.create({
      data: {
      name: tokenName,
      symbol: tokenSymbol,
        contractAddress: walletAddress,
        isActive: true,
        ...(description && { description }),
        ...(website && { website }),
        ...(twitter && { twitter }),
        ...(telegram && { telegram }),
        ...(tokenImage && { imageUrl: tokenImage })
      }
    })

    // Return contract call params for frontend
    const contractCallParams = await launchToken(
      initialPurchase || 0,
      tokenName,
      tokenSymbol,
      description || '',
      website || '',
      twitter || '',
      telegram || '',
      tokenImage,
      walletAddress
    )

    res.json({
      contractCallParams,
      tokenData: {
        id: token.id,
        name: token.name,
        symbol: token.symbol
      }
    })
  } catch (error) {
    console.error('Token launch error:', error)
    res.status(500).json({ error: 'Failed to launch token' })
  }
})

// Update trade endpoint
app.post('/api/trade', async (req, res) => {
  try {
    const {
      tokenId,
      amount,
      type,
      walletAddress
    } = req.body

    // Validate trade parameters
    if (!tokenId || !amount || !type || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Return contract call params for frontend
    let contractCallParams
    if (type === 'buy') {
      contractCallParams = await buyTokens(tokenId, amount, walletAddress)
    } else {
      contractCallParams = await sellTokens(tokenId, amount, walletAddress)
    }

    // Optionally, you can still record the trade in your DB as 'pending' here

    res.json({ contractCallParams })
  } catch (error) {
    console.error('Trade error:', error)
    res.status(500).json({ error: 'Failed to process trade' })
  }
})

// Update market data endpoint
app.get('/api/market/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params
    const marketData = await getTokenMarketData(parseInt(tokenId))

    await prisma.marketData.upsert({
      where: { tokenId: parseInt(tokenId) },
      update: {
        price: marketData.price,
        volume24h: marketData.volume24h,
        holders: marketData.holders,
        marketCap: marketData.marketCap,
        lastUpdated: new Date(),
        priceHistory: JSON.stringify(marketData.priceHistory)
      },
      create: {
        tokenId: parseInt(tokenId),
        price: marketData.price,
        volume24h: marketData.volume24h,
        holders: marketData.holders,
        marketCap: marketData.marketCap,
        priceHistory: JSON.stringify(marketData.priceHistory)
      }
    })

    res.json(marketData)
  } catch (error) {
    console.error('Market data error:', error)
    res.status(500).json({ error: 'Failed to fetch market data' })
  }
})

// Update trading view data endpoint
app.get('/api/tradingview/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params
    const { timeframe, startBlock, endBlock } = req.query

    const data = await getTradingViewData(
      parseInt(tokenId),
      parseInt(timeframe as string),
      parseInt(startBlock as string),
      parseInt(endBlock as string)
    )

    res.json(data)
  } catch (error) {
    console.error('Trading view data error:', error)
    res.status(500).json({ error: 'Failed to fetch trading view data' })
  }
})

// Get token count
app.get('/api/token/count', async (req, res) => {
  try {
    const result = await stacksService.callReadOnly({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-token-count',
      functionArgs: []
    })
    res.json(result)
  } catch (error) {
    console.error('Get token count error:', error)
    res.status(500).json({ error: 'Failed to get token count' })
  }
})

// Redis client setup
redis.on('error', (error) => {
  console.error('Redis connection error:', error)
  // Don't crash the app on Redis errors
})

redis.on('connect', () => {
  console.log('Connected to Redis')
})

// Start server
const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 