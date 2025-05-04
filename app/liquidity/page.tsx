"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronDownIcon, FilterIcon, SearchIcon, StacksLogoIcon, BitcoinIcon } from "@/components/icons"

// Mock data for liquidity pools
const liquidityPools = [
  {
    id: 1,
    name: "SATS-BTC",
    token1: { symbol: "SATS", name: "STACKSATS", icon: "stacks" },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
    tvl: 2450000,
    apr: 42.5,
    volume24h: 320000,
    myLiquidity: 12500,
    rewards: ["SATS"],
    featured: true,
  },
  {
    id: 2,
    name: "BTCR-BTC",
    token1: { symbol: "BTCR", name: "BITCORNER", icon: "stacks" },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
    tvl: 1850000,
    apr: 38.2,
    volume24h: 275000,
    myLiquidity: 0,
    rewards: ["BTCR"],
    featured: false,
  },
  {
    id: 3,
    name: "STCK-BTC",
    token1: { symbol: "STCK", name: "SATSTACK", icon: "stacks" },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
    tvl: 1250000,
    apr: 35.8,
    volume24h: 195000,
    myLiquidity: 8200,
    rewards: ["STCK", "SATS"],
    featured: true,
  },
  {
    id: 4,
    name: "BGLD-BTC",
    token1: { symbol: "BGLD", name: "BLOCKGOLD", icon: "stacks" },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
    tvl: 980000,
    apr: 32.1,
    volume24h: 145000,
    myLiquidity: 0,
    rewards: ["BGLD"],
    featured: false,
  },
  {
    id: 5,
    name: "TOSHI-BTC",
    token1: { symbol: "TOSHI", name: "SATOSHI", icon: "stacks" },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
    tvl: 750000,
    apr: 29.5,
    volume24h: 120000,
    myLiquidity: 0,
    rewards: ["TOSHI"],
    featured: false,
  },
  {
    id: 6,
    name: "LTNG-BTC",
    token1: { symbol: "LTNG", name: "LIGHTNING", icon: "stacks" },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
    tvl: 620000,
    apr: 45.2,
    volume24h: 110000,
    myLiquidity: 0,
    rewards: ["LTNG", "SATS"],
    featured: true,
  },
  {
    id: 7,
    name: "STKC-BTC",
    token1: { symbol: "STKC", name: "STACKCHAIN", icon: "stacks" },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
    tvl: 520000,
    apr: 27.8,
    volume24h: 95000,
    myLiquidity: 3100,
    rewards: ["STKC"],
    featured: false,
  },
  {
    id: 8,
    name: "NODE-BTC",
    token1: { symbol: "NODE", name: "BITNODE", icon: "stacks" },
    token2: { symbol: "BTC", name: "Bitcoin", icon: "bitcoin" },
    tvl: 420000,
    apr: 25.3,
    volume24h: 85000,
    myLiquidity: 0,
    rewards: ["NODE"],
    featured: false,
  },
]

export default function LiquidityPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [showMyPositions, setShowMyPositions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("tvl")
  const [sortOrder, setSortOrder] = useState("desc")

  const handleConnect = () => {
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setShowMyPositions(false)
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

  const filteredPools = liquidityPools
    .filter((pool) => {
      // Filter by search query
      if (searchQuery) {
        return (
          pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.token1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.token2.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      // Filter by my positions
      if (showMyPositions && isConnected) {
        return pool.myLiquidity > 0
      }
      return true
    })
    .sort((a, b) => {
      // Sort by selected column
      if (sortBy === "tvl") {
        return sortOrder === "desc" ? b.tvl - a.tvl : a.tvl - b.tvl
      } else if (sortBy === "apr") {
        return sortOrder === "desc" ? b.apr - a.apr : a.apr - b.apr
      } else if (sortBy === "volume") {
        return sortOrder === "desc" ? b.volume24h - a.volume24h : a.volume24h - b.volume24h
      }
      return 0
    })

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null
    return sortOrder === "desc" ? "↓" : "↑"
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
                    <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <span>Security</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                      <span>Referrals</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 py-2" onClick={handleDisconnect}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Disconnect</span>
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
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Liquidity Pools</h1>
            <p className="text-zinc-400 max-w-3xl">
              Provide liquidity to earn trading fees and farm rewards. Stake your LP tokens to maximize your yield.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="text-sm text-zinc-400 mb-1">Total Value Locked</div>
                <div className="text-2xl font-bold">$9.84M</div>
                <div className="text-xs text-green-500 mt-1">+5.2% (24h)</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="text-sm text-zinc-400 mb-1">24h Trading Volume</div>
                <div className="text-2xl font-bold">$1.35M</div>
                <div className="text-xs text-green-500 mt-1">+8.7% (24h)</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="text-sm text-zinc-400 mb-1">Active Pools</div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-xs text-green-500 mt-1">+1 this week</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="text-sm text-zinc-400 mb-1">Average APR</div>
                <div className="text-2xl font-bold">34.5%</div>
                <div className="text-xs text-green-500 mt-1">+2.3% (24h)</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs and Filters */}
          <div className="mb-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <TabsList className="bg-zinc-900 border border-zinc-800">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
                  >
                    All Pools
                  </TabsTrigger>
                  <TabsTrigger
                    value="featured"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
                  >
                    Featured
                  </TabsTrigger>
                  {isConnected && (
                    <TabsTrigger
                      value="my-liquidity"
                      className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
                      onClick={() => setShowMyPositions(true)}
                    >
                      My Liquidity
                    </TabsTrigger>
                  )}
                </TabsList>

                <div className="flex items-center gap-4">
                  <div className="relative w-full md:w-auto">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      placeholder="Search pools..."
                      className="w-full md:w-[250px] pl-10 bg-zinc-900 border-zinc-800 text-zinc-400 focus:border-[#FF5500]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                      >
                        <FilterIcon className="mr-2 h-4 w-4" />
                        Filter
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem onClick={() => handleSort("tvl")}>
                        TVL {sortBy === "tvl" && (sortOrder === "desc" ? "↓" : "↑")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("apr")}>
                        APR {sortBy === "apr" && (sortOrder === "desc" ? "↓" : "↑")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("volume")}>
                        Volume {sortBy === "volume" && (sortOrder === "desc" ? "↓" : "↑")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <LiquidityPoolsTable
                  pools={filteredPools}
                  isConnected={isConnected}
                  formatNumber={formatNumber}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                  getSortIcon={getSortIcon}
                />
              </TabsContent>

              <TabsContent value="featured" className="mt-0">
                <LiquidityPoolsTable
                  pools={filteredPools.filter((pool) => pool.featured)}
                  isConnected={isConnected}
                  formatNumber={formatNumber}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                  getSortIcon={getSortIcon}
                />
              </TabsContent>

              {isConnected && (
                <TabsContent value="my-liquidity" className="mt-0">
                  <LiquidityPoolsTable
                    pools={filteredPools.filter((pool) => pool.myLiquidity > 0)}
                    isConnected={isConnected}
                    formatNumber={formatNumber}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                    getSortIcon={getSortIcon}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Create New Pool Card */}
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

interface LiquidityPoolsTableProps {
  pools: any[]
  isConnected: boolean
  formatNumber: (num: number) => string
  sortBy: string
  sortOrder: string
  handleSort: (column: string) => void
  getSortIcon: (column: string) => string | null
}

function LiquidityPoolsTable({
  pools,
  isConnected,
  formatNumber,
  sortBy,
  sortOrder,
  handleSort,
  getSortIcon,
}: LiquidityPoolsTableProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 whitespace-nowrap">POOL</TableHead>
              <TableHead className="text-zinc-400 whitespace-nowrap cursor-pointer" onClick={() => handleSort("tvl")}>
                TVL {getSortIcon("tvl")}
              </TableHead>
              <TableHead className="text-zinc-400 whitespace-nowrap cursor-pointer" onClick={() => handleSort("apr")}>
                APR {getSortIcon("apr")}
              </TableHead>
              <TableHead
                className="text-zinc-400 whitespace-nowrap cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("volume")}
              >
                24H VOLUME {getSortIcon("volume")}
              </TableHead>
              <TableHead className="text-zinc-400 whitespace-nowrap hidden md:table-cell">REWARDS</TableHead>
              {isConnected && (
                <TableHead className="text-zinc-400 whitespace-nowrap hidden sm:table-cell">MY LIQUIDITY</TableHead>
              )}
              <TableHead className="text-zinc-400 text-right whitespace-nowrap">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isConnected ? 7 : 6} className="text-center py-8 text-zinc-400">
                  No liquidity pools found
                </TableCell>
              </TableRow>
            ) : (
              pools.map((pool) => (
                <TableRow key={pool.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative flex -space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5500]/10 text-[#FF5500] z-10 border border-zinc-800">
                          {pool.token1.icon === "stacks" ? (
                            <StacksLogoIcon className="h-4 w-4" />
                          ) : (
                            <BitcoinIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7931a]/10 text-[#f7931a] border border-zinc-800">
                          <BitcoinIcon className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{pool.name}</div>
                        <div className="text-xs text-zinc-500">
                          {pool.token1.name}/{pool.token2.name}
                        </div>
                      </div>
                      {pool.featured && (
                        <Badge className="bg-[#FF5500]/20 text-[#FF5500] border-[#FF5500]/30 ml-2">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatNumber(pool.tvl)}</TableCell>
                  <TableCell>
                    <span className="text-green-500 font-medium">{pool.apr.toFixed(1)}%</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatNumber(pool.volume24h)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {pool.rewards.map((reward: string, index: number) => (
                        <Badge key={index} className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700">
                          {reward}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  {isConnected && (
                    <TableCell className="hidden sm:table-cell">
                      {pool.myLiquidity > 0 ? formatNumber(pool.myLiquidity) : "-"}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" className="bg-[#FF5500] hover:bg-[#E64D00] text-white h-8 px-3 rounded-md">
                        Add
                      </Button>
                      {pool.myLiquidity > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 h-8 px-3 rounded-md"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
