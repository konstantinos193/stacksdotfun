"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { StacksLogoIcon, BitcoinIcon } from "@/components/icons"

// Mock data for liquidity pools
const liquidityPools = {
  "sats-btc": {
    id: "sats-btc",
    name: "SATS-BTC",
    token1: { symbol: "SATS", name: "STACKSATS", icon: "stacks", price: 0.00012, balance: 25000 },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin", price: 65000, balance: 0.00045 },
    tvl: 2450000,
    apr: 42.5,
    volume24h: 320000,
    myLiquidity: 12500,
    myTokens: { token1: 52000, token2: 0.00096 },
    rewards: ["SATS"],
    featured: true,
    fee: 0.3,
    description:
      "The SATS-BTC pool is the flagship liquidity pool on STACK.SATS, offering deep liquidity for the native SATS token paired with Bitcoin. Liquidity providers earn 0.3% on all trades proportional to their share of the pool, plus SATS rewards.",
  },
  "btcr-btc": {
    id: "btcr-btc",
    name: "BTCR-BTC",
    token1: { symbol: "BTCR", name: "BITCORNER", icon: "stacks", price: 0.00045, balance: 15000 },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin", price: 65000, balance: 0.00032 },
    tvl: 1850000,
    apr: 38.2,
    volume24h: 275000,
    myLiquidity: 0,
    myTokens: { token1: 0, token2: 0 },
    rewards: ["BTCR"],
    featured: false,
    fee: 0.3,
    description:
      "The BTCR-BTC pool provides liquidity for BITCORNER token paired with Bitcoin. Liquidity providers earn 0.3% on all trades proportional to their share of the pool, plus BTCR rewards.",
  },
  "stck-btc": {
    id: "stck-btc",
    name: "STCK-BTC",
    token1: { symbol: "STCK", name: "SATSTACK", icon: "stacks", price: 0.00078, balance: 18000 },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin", price: 65000, balance: 0.00028 },
    tvl: 1250000,
    apr: 35.8,
    volume24h: 195000,
    myLiquidity: 8200,
    myTokens: { token1: 5200, token2: 0.00064 },
    rewards: ["STCK", "SATS"],
    featured: true,
    fee: 0.3,
    description:
      "The STCK-BTC pool provides liquidity for SATSTACK token paired with Bitcoin. Liquidity providers earn 0.3% on all trades proportional to their share of the pool, plus STCK and SATS rewards.",
  },
}

export default function LiquidityPoolPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [pool, setPool] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("add")
  const [token1Amount, setToken1Amount] = useState("")
  const [token2Amount, setToken2Amount] = useState("")
  const [removePercentage, setRemovePercentage] = useState(50)

  useEffect(() => {
    // Simulate loading pool data
    setLoading(true)
    setTimeout(() => {
      const poolData = liquidityPools[id.toLowerCase()]
      if (poolData) {
        setPool(poolData)
        setIsConnected(poolData.myLiquidity > 0)
      }
      setLoading(false)
    }, 500)
  }, [id])

  const handleConnect = () => {
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`
    } else {
      return `$${num.toFixed(2)}`
    }
  }

  const formatCryptoAmount = (amount: number, decimals = 6) => {
    if (amount < 0.000001) return "0"
    return amount.toFixed(decimals)
  }

  const handleToken1Change = (value: string) => {
    setToken1Amount(value)
    if (!value || isNaN(Number.parseFloat(value))) {
      setToken2Amount("")
      return
    }

    // Calculate equivalent amount of token2 based on price ratio
    const token1Value = Number.parseFloat(value)
    const token2Value = (token1Value * pool.token1.price) / pool.token2.price
    setToken2Amount(token2Value.toFixed(8))
  }

  const handleToken2Change = (value: string) => {
    setToken2Amount(value)
    if (!value || isNaN(Number.parseFloat(value))) {
      setToken1Amount("")
      return
    }

    // Calculate equivalent amount of token1 based on price ratio
    const token2Value = Number.parseFloat(value)
    const token1Value = (token2Value * pool.token2.price) / pool.token1.price
    setToken1Amount(token1Value.toFixed(2))
  }

  const handleRemovePercentageChange = (value: number[]) => {
    setRemovePercentage(value[0])
  }

  const calculateRemoveAmounts = () => {
    if (!pool || !pool.myTokens) return { token1: 0, token2: 0, usdValue: 0 }

    const token1Amount = (pool.myTokens.token1 * removePercentage) / 100
    const token2Amount = (pool.myTokens.token2 * removePercentage) / 100
    const usdValue = (pool.myLiquidity * removePercentage) / 100

    return {
      token1: token1Amount,
      token2: token2Amount,
      usdValue,
    }
  }

  const removeAmounts = calculateRemoveAmounts()

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
            </div>
          </div>
        </header>
        <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
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

  if (!pool) {
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
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/liquidity")}>
                Back to Pools
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h1 className="text-2xl font-bold mb-4">Pool Not Found</h1>
            <p className="text-zinc-400 mb-6">
              The liquidity pool you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/liquidity">
              <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white">Back to Liquidity Pools</Button>
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
              <Link href="/" className="text-sm font-medium hover:text-[#FF5500]">
                TOKENS
              </Link>
              <Link href="/liquidity" className="text-sm font-medium text-[#FF5500]">
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
            {isConnected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                >
                  <span className="mr-2 text-[#f7931a] font-bold">₿</span>
                  <span>0.00000842</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-1 sm:px-2 py-1 hover:bg-zinc-800 rounded-full h-9 min-w-0"
                    >
                      <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="absolute h-full w-full text-zinc-500"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                      </div>
                      <span className="hidden sm:inline text-sm font-medium text-white truncate max-w-[80px] md:max-w-none">
                        satoshi_stacker
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] sm:w-56 bg-zinc-900 border-zinc-800 mt-1">
                    <div className="px-3 py-2 border-b border-zinc-800 sm:hidden">
                      <p className="text-sm font-medium text-white">satoshi_stacker</p>
                    </div>
                    <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 py-2">Profile</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 py-2">Security</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 py-2">Referrals</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 py-2" onClick={handleDisconnect}>
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white" onClick={handleConnect}>
                Connect
              </Button>
            )}

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
                  <Link href="/">TOKENS</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3 bg-zinc-800">
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

      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-zinc-400">
              <Link href="/liquidity" className="hover:text-white">
                Liquidity Pools
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{pool.name}</span>
            </div>
          </div>

          {/* Pool Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex -space-x-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5500]/10 text-[#FF5500] z-10 border border-zinc-800">
                    {pool.token1.icon === "stacks" ? (
                      <StacksLogoIcon className="h-6 w-6" />
                    ) : (
                      <BitcoinIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7931a]/10 text-[#f7931a] border border-zinc-800">
                    <BitcoinIcon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{pool.name} Pool</h1>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-sm">
                      {pool.token1.name}/{pool.token2.name}
                    </span>
                    <span className="text-xs">•</span>
                    <span className="text-sm">{pool.fee}% Fee</span>
                  </div>
                </div>
                {pool.featured && (
                  <Badge className="bg-[#FF5500]/20 text-[#FF5500] border-[#FF5500]/30">Featured</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                  asChild
                >
                  <Link href={`/token/${pool.token1.symbol.toLowerCase()}`}>View {pool.token1.symbol}</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                >
                  Share
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pool Stats */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Pool Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Total Value Locked</span>
                    <span className="font-medium">{formatNumber(pool.tvl)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">APR</span>
                    <span className="text-green-500 font-medium">{pool.apr.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">24h Volume</span>
                    <span className="font-medium">{formatNumber(pool.volume24h)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Fee</span>
                    <span className="font-medium">{pool.fee}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400">Rewards</span>
                    <div className="flex gap-1">
                      {pool.rewards.map((reward: string, index: number) => (
                        <Badge key={index} className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700">
                          {reward}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* My Position */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">My Position</h2>
                {isConnected && pool.myLiquidity > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">My Liquidity</span>
                      <span className="font-medium">{formatNumber(pool.myLiquidity)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">Share of Pool</span>
                      <span className="font-medium">{((pool.myLiquidity / pool.tvl) * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">{pool.token1.symbol}</span>
                      <span className="font-medium">{formatCryptoAmount(pool.myTokens.token1)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">{pool.token2.symbol}</span>
                      <span className="font-medium">{formatCryptoAmount(pool.myTokens.token2, 8)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-zinc-400">Estimated Earnings (24h)</span>
                      <span className="text-green-500 font-medium">
                        {formatNumber((pool.volume24h * pool.fee * 0.01 * (pool.myLiquidity / pool.tvl)) / 100)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-zinc-400 mb-4">You don't have any liquidity in this pool yet.</p>
                    <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white" onClick={() => setActiveTab("add")}>
                      Add Liquidity
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About {pool.name} Pool</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <p className="text-zinc-300 leading-relaxed">{pool.description}</p>
            </div>
          </div>

          {/* Add/Remove Liquidity */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Manage Liquidity</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-zinc-800">
                  <TabsList className="w-full bg-transparent h-auto p-0">
                    <TabsTrigger
                      value="add"
                      className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF5500] data-[state=active]:bg-transparent data-[state=active]:text-[#FF5500] py-3"
                    >
                      Add Liquidity
                    </TabsTrigger>
                    {isConnected && pool.myLiquidity > 0 && (
                      <TabsTrigger
                        value="remove"
                        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF5500] data-[state=active]:bg-transparent data-[state=active]:text-[#FF5500] py-3"
                      >
                        Remove Liquidity
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <TabsContent value="add" className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-zinc-400">Input {pool.token1.symbol}</label>
                        <span className="text-xs text-zinc-500">
                          Balance: {formatCryptoAmount(pool.token1.balance)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5500]/10 text-[#FF5500] border border-zinc-800">
                          <StacksLogoIcon className="h-4 w-4" />
                        </div>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                          value={token1Amount}
                          onChange={(e) => handleToken1Change(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                          onClick={() => handleToken1Change(pool.token1.balance.toString())}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-zinc-800 rounded-full p-1">
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
                          className="text-zinc-400"
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-zinc-400">Input {pool.token2.symbol}</label>
                        <span className="text-xs text-zinc-500">
                          Balance: {formatCryptoAmount(pool.token2.balance, 8)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7931a]/10 text-[#f7931a] border border-zinc-800">
                          <BitcoinIcon className="h-4 w-4" />
                        </div>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                          value={token2Amount}
                          onChange={(e) => handleToken2Change(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                          onClick={() => handleToken2Change(pool.token2.balance.toString())}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4 text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-400">Exchange Rate</span>
                        <span>
                          1 {pool.token1.symbol} = {(pool.token1.price / pool.token2.price).toFixed(8)}{" "}
                          {pool.token2.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-400">Share of Pool</span>
                        <span>
                          {token1Amount && token2Amount
                            ? (
                                ((Number.parseFloat(token1Amount) * pool.token1.price) /
                                  (pool.tvl + Number.parseFloat(token1Amount) * pool.token1.price)) *
                                100
                              ).toFixed(4)
                            : "0.00"}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Slippage Tolerance</span>
                        <span>0.5%</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[#FF5500] hover:bg-[#E64D00] text-white py-6 text-lg"
                      disabled={!token1Amount || !token2Amount || !isConnected}
                    >
                      {!isConnected
                        ? "Connect Wallet"
                        : !token1Amount || !token2Amount
                          ? "Enter Amount"
                          : "Add Liquidity"}
                    </Button>
                  </div>
                </TabsContent>

                {isConnected && pool.myLiquidity > 0 && (
                  <TabsContent value="remove" className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm text-zinc-400">Amount to Remove</label>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold">{removePercentage}%</span>
                          <div className="flex-1">
                            <Slider
                              defaultValue={[50]}
                              max={100}
                              step={1}
                              value={[removePercentage]}
                              onValueChange={handleRemovePercentageChange}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                            onClick={() => setRemovePercentage(25)}
                          >
                            25%
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                            onClick={() => setRemovePercentage(50)}
                          >
                            50%
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                            onClick={() => setRemovePercentage(75)}
                          >
                            75%
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                            onClick={() => setRemovePercentage(100)}
                          >
                            MAX
                          </Button>
                        </div>
                      </div>

                      <div className="bg-zinc-800 rounded-lg p-4 space-y-3">
                        <div className="text-sm text-zinc-400 mb-2">You will receive:</div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF5500]/10 text-[#FF5500] border border-zinc-800">
                              <StacksLogoIcon className="h-3 w-3" />
                            </div>
                            <span>
                              {formatCryptoAmount(removeAmounts.token1)} {pool.token1.symbol}
                            </span>
                          </div>
                          <span className="text-sm text-zinc-400">
                            ≈ ${(removeAmounts.token1 * pool.token1.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f7931a]/10 text-[#f7931a] border border-zinc-800">
                              <BitcoinIcon className="h-3 w-3" />
                            </div>
                            <span>
                              {formatCryptoAmount(removeAmounts.token2, 8)} {pool.token2.symbol}
                            </span>
                          </div>
                          <span className="text-sm text-zinc-400">
                            ≈ ${(removeAmounts.token2 * pool.token2.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-zinc-700">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Total Value</span>
                            <span className="font-medium">${removeAmounts.usdValue.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full bg-[#FF5500] hover:bg-[#E64D00] text-white py-6 text-lg">
                        Remove Liquidity
                      </Button>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#FF5500]"
              >
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M7 9H17M7 12H17M7 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              <div className="flex items-center font-space-grotesk font-bold tracking-tight">
                <span className="text-[#FF5500]">STACK</span>
                <span className="text-white">.SATS</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </div>
            <div className="text-sm text-zinc-500">© 2025 STACK.SATS. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
