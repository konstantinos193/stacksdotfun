import { NextResponse } from 'next/server'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd'

export async function GET() {
  try {
    const response = await fetch(COINGECKO_API_URL, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch STX price')
    }

    const data = await response.json()
    const stxPrice = data.blockstack?.usd || 0

    // Calculate how many STX is needed for $2
    const stxAmountFor2Dollars = stxPrice > 0 ? 2 / stxPrice : null

    return NextResponse.json({
      stxPrice,
      stxAmountFor2Dollars,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching STX price:', error)
    return NextResponse.json(
      { error: 'Failed to fetch STX price' },
      { status: 500 }
    )
  }
} 