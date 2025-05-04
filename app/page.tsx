"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpIcon, ChevronDownIcon, FilterIcon, FlameIcon, SearchIcon, SparkleIcon } from "@/components/icons"
import { TokenRow } from "@/components/token-row"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { WalletProvider, useWallet, WalletButton } from "@/components/WalletProvider"

export default function Home() {
  const { isConnected, walletAddress, stxBalance } = useWallet();
  const [activeTab, setActiveTab] = useState("trending");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for tokens with added trending score and creation date
  const tokens = [
    {
      id: 1,
      name: "STACKSATS",
      ticker: "SATS",
      price: 0.00012,
      change24h: 5.2,
      change7d: 12.3,
      marketCap: 4500000,
      volume: 780000,
      holders: 1250,
      trendingScore: 98, // Higher score means more trending
      createdAt: "2024-03-15", // Recent date for new tokens
    },
    {
      id: 2,
      name: "BITCORNER",
      ticker: "BTCR",
      price: 0.00045,
      change24h: -2.1,
      change7d: 8.7,
      marketCap: 3200000,
      volume: 560000,
      holders: 980,
      trendingScore: 85,
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      name: "SATSTACK",
      ticker: "STCK",
      price: 0.00078,
      change24h: 7.8,
      change7d: -3.2,
      marketCap: 2800000,
      volume: 420000,
      holders: 760,
      trendingScore: 92,
      createdAt: "2024-03-18",
    },
    {
      id: 4,
      name: "BLOCKGOLD",
      ticker: "BGLD",
      price: 0.00032,
      change24h: 1.4,
      change7d: 5.6,
      marketCap: 1900000,
      volume: 350000,
      holders: 620,
      trendingScore: 75,
      createdAt: "2023-12-15",
    },
    {
      id: 5,
      name: "SATOSHI",
      ticker: "TOSHI",
      price: 0.00056,
      change24h: -3.5,
      change7d: -1.2,
      marketCap: 1700000,
      volume: 290000,
      holders: 540,
      trendingScore: 82,
      createdAt: "2024-02-01",
    },
    {
      id: 6,
      name: "LIGHTNING",
      ticker: "LTNG",
      price: 0.00021,
      change24h: 12.3,
      change7d: 28.7,
      marketCap: 1500000,
      volume: 270000,
      holders: 480,
      trendingScore: 95,
      createdAt: "2024-03-20",
    },
    {
      id: 7,
      name: "STACKCHAIN",
      ticker: "STKC",
      price: 0.00009,
      change24h: -1.8,
      change7d: 4.2,
      marketCap: 1200000,
      volume: 210000,
      holders: 390,
      trendingScore: 78,
      createdAt: "2024-01-10",
    },
    {
      id: 8,
      name: "BITNODE",
      ticker: "NODE",
      price: 0.00018,
      change24h: 3.7,
      change7d: 9.1,
      marketCap: 980000,
      volume: 180000,
      holders: 320,
      trendingScore: 88,
      createdAt: "2024-03-10",
    },
  ];

  // Function to check if a date is within the last 30 days
  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo;
  };

  const filteredTokens = tokens.filter(token => {
    // Search filter
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         token.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filter
    let matchesTab = true;
    switch (activeTab) {
      case "trending":
        // Show top trending tokens (trendingScore > 85)
        matchesTab = token.trendingScore > 85;
        break;
      case "gainers":
        // Show tokens with positive 24h change, sorted by highest gains
        matchesTab = token.change24h > 0;
        break;
      case "new":
        // Show tokens created in the last 30 days
        matchesTab = isNew(token.createdAt);
        break;
    }
    
    // Additional filter
    const matchesFilter = filter === "all" ? true :
                         filter === "highest-volume" ? token.volume > 500000 :
                         filter === "highest-market-cap" ? token.marketCap > 3000000 :
                         filter === "recently-added" ? token.id > 5 :
                         filter === "price-high-low" ? true :
                         filter === "price-low-high" ? true : true;

    return matchesSearch && matchesTab && matchesFilter;
  }).sort((a, b) => {
    // Sort based on active tab and filter
    if (activeTab === "trending") {
      return b.trendingScore - a.trendingScore;
    } else if (activeTab === "gainers") {
      return b.change24h - a.change24h;
    } else if (activeTab === "new") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (filter === "price-high-low") {
      return b.price - a.price;
    } else if (filter === "price-low-high") {
      return a.price - b.price;
    }
    return 0;
  });

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
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="bg-zinc-900 border border-zinc-800">
                  <TabsTrigger
                    value="trending"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
                  >
                    <FlameIcon className="mr-2 h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger
                    value="gainers"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
                  >
                    <ArrowUpIcon className="mr-2 h-4 w-4" />
                    Gainers
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
                  >
                    <SparkleIcon className="mr-2 h-4 w-4" />
                    New
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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
                <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("highest-volume")}>
                    Highest Volume
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("highest-market-cap")}>
                    Highest Market Cap
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("recently-added")}>
                    Recently Added
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("price-high-low")}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("price-low-high")}>
                    Price: Low to High
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative w-full md:w-auto">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search tokens..."
                className="w-full md:w-[300px] pl-10 bg-zinc-900 border-zinc-800 text-zinc-400 focus:border-[#FF5500]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-zinc-800">
                    <TableHead className="text-zinc-400 w-[50px] whitespace-nowrap">#</TableHead>
                    <TableHead className="text-zinc-400 whitespace-nowrap">TOKEN</TableHead>
                    <TableHead className="text-zinc-400 whitespace-nowrap">PRICE</TableHead>
                    <TableHead className="text-zinc-400 text-right whitespace-nowrap">24H</TableHead>
                    <TableHead className="text-zinc-400 text-right whitespace-nowrap">7D</TableHead>
                    <TableHead className="text-zinc-400 text-right whitespace-nowrap hidden md:table-cell">
                      MARKET CAP
                    </TableHead>
                    <TableHead className="text-zinc-400 text-right whitespace-nowrap hidden md:table-cell">
                      VOLUME
                    </TableHead>
                    <TableHead className="text-zinc-400 text-right whitespace-nowrap hidden sm:table-cell">
                      HOLDERS
                    </TableHead>
                    <TableHead className="text-zinc-400 text-right whitespace-nowrap">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens.map((token, index) => (
                    <TokenRow
                      key={token.id}
                      rank={index + 1}
                      name={token.name}
                      ticker={token.ticker}
                      price={token.price}
                      change24h={token.change24h}
                      change7d={token.change7d}
                      marketCap={token.marketCap}
                      volume={token.volume}
                      holders={token.holders}
                    />
                  ))}
                </TableBody>
              </Table>
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
