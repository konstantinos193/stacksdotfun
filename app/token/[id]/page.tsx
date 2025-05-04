"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createChart, ColorType, IChartApi, ISeriesApi, Time } from "lightweight-charts"
import { WalletButton } from "@/components/WalletProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Token {
  id: string;
  name: string;
  ticker: string;
  price: number;
  priceUSD: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume: number;
  holders: number;
  description: string;
  website: string;
  twitter: string;
  telegram: string;
  contract: string;
  launchDate: string;
  totalSupply: number;
  circulatingSupply: number;
  change5m: number;
  change1h: number;
  change6h: number;
  transactions: number;
  buys: number;
  sells: number;
  developer: string;
  ascendedName: string;
}

interface TokensData {
  [key: string]: Token;
}

const tokensData: TokensData = {
  stacksats: {
    id: "stacksats",
    name: "STACKSATS",
    ticker: "SATS",
    price: 0.00012,
    priceUSD: 0.00015,
    change24h: 5.2,
    change7d: 12.3,
    marketCap: 4500000,
    volume: 780000,
    holders: 1250,
    description: "STACKSATS is the premier utility token for the Bitcoin Stacks ecosystem, enabling fast and secure transactions with minimal fees.",
    website: "https://stacksats.io",
    twitter: "https://twitter.com/stacksats",
    telegram: "https://t.me/stacksats",
    contract: "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.sats-token",
    launchDate: "2023-05-15",
    totalSupply: 21000000,
    circulatingSupply: 4500000,
    change5m: 0.1,
    change1h: -0.5,
    change6h: 5.5,
    transactions: 180000,
    buys: 118000,
    sells: 62300,
    developer: "STACKSTEAM.blife",
    ascendedName: "STACKSATS•ID•YTTL•SATS",
  },
  bitcorner: {
    id: "bitcorner",
    name: "BITCORNER",
    ticker: "BTCR",
    price: 0.00045,
    priceUSD: 0.00056,
    change24h: -2.1,
    change7d: 8.7,
    marketCap: 3200000,
    volume: 560000,
    holders: 980,
    description:
      "BITCORNER is a community-driven token focused on creating a decentralized marketplace for Bitcoin enthusiasts.",
    website: "https://bitcorner.io",
    twitter: "https://twitter.com/bitcorner",
    telegram: "https://t.me/bitcorner",
    contract: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.btcr-token",
    launchDate: "2023-07-22",
    totalSupply: 10000000,
    circulatingSupply: 2500000,
    change5m: -0.2,
    change1h: 1.5,
    change6h: -2.5,
    transactions: 120000,
    buys: 70000,
    sells: 50000,
    developer: "BTCTEAM.blife",
    ascendedName: "BITCORNER•ID•YTTL•BTCR",
  },
  satstack: {
    id: "satstack",
    name: "SATSTACK",
    ticker: "STCK",
    price: 0.00078,
    priceUSD: 0.00098,
    change24h: 7.8,
    change7d: -3.2,
    marketCap: 2800000,
    volume: 420000,
    holders: 760,
    description:
      "SATSTACK provides a staking platform for Bitcoin-based assets, allowing users to earn passive income on their holdings.",
    website: "https://satstack.io",
    twitter: "https://twitter.com/satstack",
    telegram: "https://t.me/satstack",
    contract: "SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.stck-token",
    launchDate: "2023-09-10",
    totalSupply: 5000000,
    circulatingSupply: 1200000,
    change5m: 0.3,
    change1h: 0.8,
    change6h: 3.2,
    transactions: 95000,
    buys: 60000,
    sells: 35000,
    developer: "STACKDEV.blife",
    ascendedName: "SATSTACK•ID•YTTL•STCK",
  },
}

const getTokenData = (id: string): Token | undefined => {
  return tokensData[id.toLowerCase()]
}

export default function TokenPage() {
  const params = useParams()
  const id = params?.id as string
  const [token, setToken] = useState<Token | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tradeMode, setTradeMode] = useState("buy")
  const [activeInterval, setActiveInterval] = useState("1m")
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("trade")
  const [stxBalance, setStxBalance] = useState<string>("0.00")

  useEffect(() => {
    // Simulate loading token data
    setLoading(true)
    setTimeout(() => {
      const tokenData = getTokenData(id) || tokensData.stacksats
      setToken(tokenData)
      setLoading(false)
    }, 500)
  }, [id])

  const handleConnect = () => {
    setIsConnected(true)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    } else {
      return `${num.toFixed(2)}`
    }
  }

  const formatPrice = (num: number): string => {
    return `${num.toFixed(8)}`
  }

  const handleIntervalChange = (interval: string): void => {
    setActiveInterval(interval)
    // Here we would normally fetch new data for the selected interval
  }

  // Helper to generate data based on interval
  const generateCandlestickData = (interval: string) => {
    const currentTime = new Date().getTime()
    const intervalMs =
      {
        "1m": 60 * 1000,
        "15m": 15 * 60 * 1000,
        "1h": 60 * 60 * 1000,
        "4h": 4 * 60 * 60 * 1000,
        "1d": 24 * 60 * 60 * 1000,
      }[interval] || 60 * 1000

    // Initial price and parameters
    let lastClose = token?.price || 0.00012
    let volatility = 0.02 // 2% volatility
    const trend = 0.001 // Slight upward trend
    let trendDirection = 1
    const trendChangeProbability = 0.1 // 10% chance to change trend direction

    return Array(100)
      .fill(0)
      .map((_, i) => {
        // Change trend direction occasionally
        if (Math.random() < trendChangeProbability) {
          trendDirection *= -1
        }

        // Calculate price movement
        const priceChange = lastClose * volatility * (Math.random() - 0.5)
        const trendChange = lastClose * trend * trendDirection

        // Calculate OHLC values
        const open = lastClose
        const close = open + priceChange + trendChange
        const high = Math.max(open, close) + Math.abs(priceChange) * Math.random()
        const low = Math.min(open, close) - Math.abs(priceChange) * Math.random()

        // Update last close for next candle
        lastClose = close

        // Add some randomness to volatility
        volatility = Math.max(0.01, Math.min(0.05, volatility + (Math.random() - 0.5) * 0.01))

        // Create candlestick data point
        return {
          time: Math.floor((currentTime - (100 - i) * intervalMs) / 1000),
          open: Number(open.toFixed(8)),
          high: Number(high.toFixed(8)),
          low: Number(low.toFixed(8)),
          close: Number(close.toFixed(8)),
        }
      })
  }

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || !token) return;

    // Get actual size
    const width = chartContainerRef.current.offsetWidth;
    const height = chartContainerRef.current.offsetHeight;
    if (width === 0 || height === 0) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    try {
      // Create chart instance
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "#131722" },
          textColor: "#d1d4dc",
        },
        width,
        height,
        grid: {
          vertLines: { color: "rgba(42, 46, 57, 0.5)" },
          horzLines: { color: "rgba(42, 46, 57, 0.5)" },
        },
        rightPriceScale: {
          borderColor: "rgba(42, 46, 57, 0.5)",
          textColor: "#d1d4dc",
        },
        timeScale: {
          borderColor: "rgba(42, 46, 57, 0.5)",
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          vertLine: {
            color: "#758696",
            width: 1,
            style: 3,
            labelBackgroundColor: "#758696",
          },
          horzLine: {
            color: "#758696",
            width: 1,
            style: 3,
            labelBackgroundColor: "#758696",
          },
        },
      }) as unknown as IChartApi;

      // Generate mock candlestick data
      const data = generateCandlestickData(activeInterval)

      // Create candlestick series
      const mainSeries = (chart as any).addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
        borderColor: "#378658",
        borderUpColor: "#26a69a",
        borderDownColor: "#ef5350",
        wickColor: "#737375",
        wickVisible: true,
      }) as ISeriesApi<"Candlestick">;

      // Add volume series
      const volumeSeries = (chart as any).addHistogramSeries({
        color: "#26a69a",
        base: 0,
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "",
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      }) as ISeriesApi<"Histogram">;

      // Generate and set candlestick data
      const dataAsTime = data.map(item => ({
        ...item,
        time: item.time as Time
      }));

      mainSeries.setData(dataAsTime);

      // Generate and set volume data
      const volumeData = dataAsTime.map(item => ({
        time: item.time as Time,
        value: Math.random() * 1000 + 500,
        color: item.close >= item.open ? "rgba(38, 166, 154, 0.5)" : "rgba(239, 83, 80, 0.5)",
      }));

      volumeSeries.setData(volumeData);

      // Store chart reference
      chartRef.current = chart

      // Add resize listener
      window.addEventListener("resize", handleResize)

      setLoading(false)

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
        }
      }
    } catch (error) {
      console.error("Chart initialization failed:", error)
      setLoading(false)
    }
  }, [token, activeInterval])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-1 text-xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#FF5500]"
                >
                  <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M7 9H17M7 12H17M7 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <div className="flex items-center font-space-grotesk font-bold tracking-tight">
                  <span className="text-[#FF5500]">STACK</span>
                  <span className="text-white">.SATS</span>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/liquidity" className="text-sm font-medium hover:text-[#FF5500]">
                  LIQUIDITY
                </Link>
                <Link href="/launch" className="text-sm font-medium hover:text-[#FF5500]">
                  LAUNCH
                </Link>
                <Link href="/learn" className="text-sm font-medium hover:text-[#FF5500]">
                  LEARN
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                >
                  <span className="mr-2 text-[#FF5500] font-bold">STX</span>
                  <span>{stxBalance || '0.00'}</span>
                </Button>
              )}
              <WalletButton />

              {/* Mobile Menu Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] bg-zinc-900 border-zinc-800 mt-1 md:hidden">
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                    <Link href="/liquidity">LIQUIDITY</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                    <Link href="/launch">LAUNCH</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                    <Link href="/learn">LEARN</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 container px-4 py-8">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-48 bg-zinc-800 rounded-lg mb-4"></div>
              <div className="h-6 w-24 bg-zinc-800 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-1 text-xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#FF5500]"
                >
                  <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M7 9H17M7 12H17M7 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <div className="flex items-center font-space-grotesk font-bold tracking-tight">
                  <span className="text-[#FF5500]">STACK</span>
                  <span className="text-white">.SATS</span>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/liquidity" className="text-sm font-medium hover:text-[#FF5500]">
                  LIQUIDITY
                </Link>
                <Link href="/launch" className="text-sm font-medium hover:text-[#FF5500]">
                  LAUNCH
                </Link>
                <Link href="/learn" className="text-sm font-medium hover:text-[#FF5500]">
                  LEARN
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                >
                  <span className="mr-2 text-[#FF5500] font-bold">STX</span>
                  <span>{stxBalance || '0.00'}</span>
                </Button>
              )}
              <WalletButton />

              {/* Mobile Menu Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] bg-zinc-900 border-zinc-800 mt-1 md:hidden">
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                    <Link href="/liquidity">LIQUIDITY</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                    <Link href="/launch">LAUNCH</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                    <Link href="/learn">LEARN</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 container px-4 py-8">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
            <p className="text-zinc-400 mb-6">The token you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white">Back to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1 text-xl">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#FF5500]"
              >
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M7 9H17M7 12H17M7 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              <div className="flex items-center font-space-grotesk font-bold tracking-tight">
                <span className="text-[#FF5500]">STACK</span>
                <span className="text-white">.SATS</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/liquidity" className="text-sm font-medium hover:text-[#FF5500]">
                LIQUIDITY
              </Link>
              <Link href="/launch" className="text-sm font-medium hover:text-[#FF5500]">
                LAUNCH
              </Link>
              <Link href="/learn" className="text-sm font-medium hover:text-[#FF5500]">
                LEARN
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
              >
                <span className="mr-2 text-[#FF5500] font-bold">STX</span>
                <span>{stxBalance || '0.00'}</span>
              </Button>
            )}
            <WalletButton />

            {/* Mobile Menu Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-zinc-900 border-zinc-800 mt-1 md:hidden">
                <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                  <Link href="/liquidity">LIQUIDITY</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                  <Link href="/launch">LAUNCH</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                  <Link href="/learn">LEARN</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-zinc-950">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] gap-8 px-6 py-6">
          {/* Left side - Chart with tools */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 flex flex-col gap-6 h-full">
              {/* Chart header */}
              <div className="border-b border-zinc-800 h-14 flex items-center px-2 gap-6">
                <div className="flex gap-3">
                  {["1m", "15m", "1h", "4h", "1d"].map((interval) => (
                    <button
                      key={interval}
                      className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors duration-150 ${
                        activeInterval === interval
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      }`}
                      onClick={() => handleIntervalChange(interval)}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <button className="text-zinc-400 hover:text-white p-2">
                    {/* settings icon */}
                  </button>
                  <button className="text-zinc-400 hover:text-white p-2">
                    {/* close icon */}
                  </button>
                </div>
              </div>
              {/* Chart */}
              <div
                className="rounded-2xl overflow-hidden bg-zinc-900"
                style={{ height: 1000, width: "100%" }}
                ref={chartContainerRef}
              ></div>
              {/* Chat Section */}
              <div className="h-[600px] min-h-[400px] border-t border-zinc-800 flex flex-col bg-zinc-950 rounded-xl p-4 mt-2">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                  <h3 className="text-sm font-medium">Live Chat</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>124 online</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {/* System Message */}
                  <div className="bg-zinc-800/60 text-zinc-300 text-center w-full text-xs italic rounded-lg px-6 py-3">
                    Welcome to the {token?.name || "token"} chat! Ask questions or discuss with other traders.
                  </div>
                  {/* User Messages */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-zinc-800 text-white rounded-lg px-6 py-3">
                      <div className="font-medium text-xs text-[#FF5500] mb-2">Satoshi_Nakamoto</div>
                      <p className="text-sm">
                        Has anyone been accumulating {token?.ticker || "this token"} during this dip? I think it's undervalued right now.
                      </p>
                      <div className="text-right mt-2">
                        <span className="text-zinc-500 text-xs">10:15 AM</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-zinc-800 text-white rounded-lg px-6 py-3">
                      <div className="font-medium text-xs text-[#FF5500] mb-2">BTCmaxi</div>
                      <p className="text-sm">
                        I'm waiting for confirmation of the uptrend before adding to my position.
                      </p>
                      <div className="text-right mt-2">
                        <span className="text-zinc-500 text-xs">10:17 AM</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-zinc-800 text-white rounded-lg px-6 py-3">
                      <div className="font-medium text-xs text-[#FF5500] mb-2">CryptoTrader99</div>
                      <p className="text-sm">What's the utility of this token? I'm new here.</p>
                      <div className="text-right mt-2">
                        <span className="text-zinc-500 text-xs">10:20 AM</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-[#FF5500]/20 text-white rounded-lg px-6 py-3">
                      <p className="text-sm">
                        The bonding curve mechanism is really interesting. It creates a price floor that increases as more people buy.
                      </p>
                      <div className="text-right mt-2">
                        <span className="text-zinc-500 text-xs">10:22 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-zinc-800 pt-3 mt-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder={isConnected ? "Type your message..." : "Connect wallet to chat with your identity"}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                    />
                    <button className="bg-[#FF5500] hover:bg-[#E64D00] text-white p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 2L11 13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right side - Trading panel */}
          <div className="w-full lg:w-[400px] bg-zinc-900 overflow-y-auto rounded-2xl shadow-lg p-8 flex flex-col gap-8">
            {/* Token info and buy/sell buttons */}
            <div className="p-4 border-b border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden">
                    <img
                      src="https://s2.coinmarketcap.com/static/img/coins/200x200/4847.png"
                      alt="STX"
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg font-bold">{token.name}</h1>
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 text-xs rounded-full">
                        {token.ticker}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white text-sm font-medium">${formatPrice(token.price)}</span>
                      <span className={`text-xs ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>{token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                {/* Social links below price */}
                <div className="flex items-center gap-3 mt-2">
                  <a
                    href={token.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white p-1.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </a>
                  <a
                    href={token.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white p-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                    </svg>
                  </a>
                  <a
                    href={token.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white p-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M 44.376953 5.9863281 C 43.889905 6.0076957 43.415817 6.1432497 42.988281 6.3144531 C 42.565113 6.4845113 40.128883 7.5243408 36.53125 9.0625 C 32.933617 10.600659 28.256963 12.603668 23.621094 14.589844 C 14.349356 18.562196 5.2382813 22.470703 5.2382812 22.470703 L 5.3046875 22.445312 C 5.3046875 22.445312 4.7547875 22.629122 4.1972656 23.017578 C 3.9185047 23.211806 3.6186028 23.462555 3.3730469 23.828125 C 3.127491 24.193695 2.9479735 24.711788 3.015625 25.259766 C 3.2532479 27.184511 5.2480469 27.730469 5.2480469 27.730469 L 5.2558594 27.734375 L 14.158203 30.78125 C 14.385177 31.538434 16.858319 39.792923 17.402344 41.541016 C 17.702797 42.507484 17.984013 43.064995 18.277344 43.445312 C 18.424133 43.635633 18.577962 43.782915 18.748047 43.890625 C 18.815627 43.933415 18.8867 43.965525 18.957031 43.994141 C 18.958531 43.994806 18.959437 43.99348 18.960938 43.994141 C 18.969579 43.997952 18.977708 43.998295 18.986328 44.001953 L 18.962891 43.996094 C 18.979231 44.002694 18.995359 44.013801 19.011719 44.019531 C 19.043456 44.030655 19.062905 44.030268 19.103516 44.039062 C 20.123059 44.395042 20.966797 43.734375 20.966797 43.734375 L 21.001953 43.707031 L 26.470703 38.634766 L 35.345703 45.554688 L 35.457031 45.605469 C 37.010484 46.295216 38.415349 45.910403 39.193359 45.277344 C 39.97137 44.644284 40.277344 43.828125 40.277344 43.828125 L 40.310547 43.742188 L 46.832031 9.7519531 C 46.998903 8.9915162 47.022612 8.334202 46.865234 7.7402344 C 46.707857 7.1462668 46.325492 6.6299361 45.845703 6.34375 C 45.365914 6.0575639 44.864001 5.9649605 44.376953 5.9863281 z M 44.429688 8.0195312 C 44.627491 8.0103707 44.774102 8.032983 44.820312 8.0605469 C 44.866523 8.0881109 44.887272 8.0844829 44.931641 8.2519531 C 44.976011 8.419423 45.000036 8.7721605 44.878906 9.3242188 L 44.875 9.3359375 L 38.390625 43.128906 C 38.375275 43.162926 38.240151 43.475531 37.931641 43.726562 C 37.616914 43.982653 37.266874 44.182554 36.337891 43.792969 L 26.632812 36.224609 L 26.359375 36.009766 L 26.353516 36.015625 L 23.451172 33.837891 L 39.761719 14.648438 A 1.0001 1.0001 0 0 0 38.974609 13 A 1.0001 1.0001 0 0 0 38.445312 13.167969 L 14.84375 28.902344 L 5.9277344 25.849609 C 5.9277344 25.849609 5.0423771 25.356927 5 25.013672 C 4.99765 24.994652 4.9871961 25.011869 5.0332031 24.943359 C 5.0792101 24.874869 5.1948546 24.759225 5.3398438 24.658203 C 5.6298218 24.456159 5.9609375 24.333984 5.9609375 24.333984 L 5.9941406 24.322266 L 6.0273438 24.308594 C 6.0273438 24.308594 15.138894 20.399882 24.410156 16.427734 C 29.045787 14.44166 33.721617 12.440122 37.318359 10.902344 C 40.914175 9.3649615 43.512419 8.2583658 43.732422 8.1699219 C 43.982886 8.0696253 44.231884 8.0286918 44.429688 8.0195312 z M 33.613281 18.792969 L 21.244141 33.345703 L 21.238281 33.351562 A 1.0001 1.0001 0 0 0 21.183594 33.423828 A 1.0001 1.0001 0 0 0 21.128906 33.507812 A 1.0001 1.0001 0 0 0 20.998047 33.892578 A 1.0001 1.0001 0 0 0 20.998047 33.900391 L 19.386719 41.146484 C 19.35993 41.068197 19.341173 41.039555 19.3125 40.947266 L 19.3125 40.945312 C 18.800713 39.30085 16.467362 31.5161 16.144531 30.439453 L 33.613281 18.792969 z M 22.640625 35.730469 L 24.863281 37.398438 L 21.597656 40.425781 L 22.640625 35.730469 z"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Tabs for trading and info */}
              <div className="flex border-b border-zinc-800">
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "trade" ? "text-white border-b-2 border-[#FF5500]" : "text-zinc-400 hover:text-white"}`}
                  onClick={() => setActiveTab("trade")}
                >
                  Trade
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "info" ? "text-white border-b-2 border-[#FF5500]" : "text-zinc-400 hover:text-white"}`}
                  onClick={() => setActiveTab("info")}
                >
                  Info
                </button>
              </div>
            </div>

            {activeTab === "trade" ? (
              /* Trading form */
              <div className="p-4 space-y-4">
                {/* Buy/Sell buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`py-2.5 rounded-md text-center font-medium text-sm ${
                      tradeMode === "buy"
                        ? "bg-green-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                    onClick={() => setTradeMode("buy")}
                  >
                    buy
                  </button>
                  <button
                    className={`py-2.5 rounded-md text-center font-medium text-sm ${
                      tradeMode === "sell"
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                    onClick={() => setTradeMode("sell")}
                  >
                    sell
                  </button>
                </div>

                {/* Amount input */}
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-white">STX</span>
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                      <img
                        src="https://s2.coinmarketcap.com/static/img/coins/200x200/4847.png"
                        alt="STX"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick amount buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <button
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 rounded text-xs"
                    onClick={() => setAmount("0.1")}
                  >
                    0.1 STX
                  </button>
                  <button
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 rounded text-xs"
                    onClick={() => setAmount("0.5")}
                  >
                    0.5 STX
                  </button>
                  <button
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 rounded text-xs"
                    onClick={() => setAmount("1")}
                  >
                    1 STX
                  </button>
                  <button
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 rounded text-xs"
                    onClick={() => setAmount("max")}
                  >
                    max
                  </button>
                </div>

                {/* Connect wallet button */}
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-md font-medium text-sm">
                  Connect wallet to trade
                </button>

                {/* Bonding curve info */}
                <div className="space-y-3 bg-zinc-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-white">Bonding curve progress</span>
                    <span className="text-xs font-medium text-green-400">2%</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "2%" }}></div>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Graduate this coin to AlexLabs DEX at $61,568 market cap. There is 0.317 STX in the bonding curve.
                  </p>
                </div>

                {/* Contract info */}
                <div className="space-y-3">
                  <div className="bg-zinc-800 rounded-md p-3 flex items-center justify-between">
                    <span className="text-xs text-zinc-300">
                      Contract: {token.contract.substring(0, 8)}...{token.contract.substring(token.contract.length - 4)}
                    </span>
                    <button className="text-zinc-400 hover:text-white p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Top holders */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">top holders</h3>
                    <button className="text-xs text-zinc-400 hover:text-white bg-zinc-800 px-2 py-1 rounded-md">
                      generate bubble map
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-xs">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
                          </svg>
                        </div>
                        <span className="text-xs">1. bonding curve</span>
                      </div>
                      <span className="text-white text-xs">99.30%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                          2
                        </div>
                        <span className="text-zinc-400 text-xs">2. PUUtn1</span>
                      </div>
                      <span className="text-white text-xs">0.68%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                          3
                        </div>
                        <span className="text-zinc-400 text-xs">3. FNwFGf</span>
                      </div>
                      <span className="text-white text-xs">0.00%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                          4
                        </div>
                        <span className="text-zinc-400 text-xs">4. 9Tz3jb</span>
                      </div>
                      <span className="text-white text-xs">0.00%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Token Info Tab */
              <div className="p-4 space-y-4">
                {/* Ascended Name */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Ascended:</h3>
                  <p className="text-sm text-white">{token.ascendedName}</p>
                </div>

                {/* Price Info */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Price USD</span>
                    <span className="text-sm font-medium">${token.priceUSD.toFixed(5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Price</span>
                    <span className="text-sm font-medium">{(token.price * 1000000).toFixed(3)} sats</span>
                  </div>
                </div>

                {/* Price Changes */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-zinc-800 rounded-lg p-3 text-center">
                    <div className={`text-xs ${token.change5m >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {token.change5m >= 0 ? "+" : ""}
                      {token.change5m}%
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">5M</div>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3 text-center">
                    <div className={`text-xs ${token.change1h >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {token.change1h >= 0 ? "+" : ""}
                      {token.change1h}%
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">1H</div>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3 text-center">
                    <div className={`text-xs ${token.change6h >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {token.change6h >= 0 ? "+" : ""}
                      {token.change6h}%
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">6H</div>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3 text-center">
                    <div className={`text-xs ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h.toFixed(1)}%
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">24H</div>
                  </div>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="text-sm font-medium">{formatNumber(token.marketCap)}</div>
                    <div className="text-xs text-zinc-400 mt-1">Market Cap</div>
                    <div className="text-xs text-zinc-500">${formatNumber(token.marketCap)}</div>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="text-sm font-medium">{formatNumber(token.volume)}</div>
                    <div className="text-xs text-zinc-400 mt-1">Volume</div>
                    <div className="text-xs text-zinc-500">${formatNumber(token.volume)}</div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{formatNumber(token.transactions)}</div>
                      <div className="text-xs text-zinc-400 mt-1">Txns</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs">
                        <span className="text-green-500">{formatNumber(token.buys)}</span>
                        {" / "}
                        <span className="text-red-500">{formatNumber(token.sells)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="text-sm font-medium">{formatNumber(token.holders)}</div>
                    <div className="text-xs text-zinc-400 mt-1">Holders</div>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="text-sm font-medium">{formatNumber(token.totalSupply)}</div>
                    <div className="text-xs text-zinc-400 mt-1">Supply</div>
                  </div>
                </div>

                {/* Created and Developer */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Created</span>
                    <span className="text-sm">{token.launchDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Dev</span>
                    <span className="text-sm">{token.developer}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
