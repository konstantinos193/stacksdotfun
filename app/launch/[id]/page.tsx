"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StacksLogoIcon, BitcoinIcon } from "@/components/icons"

// Mock data for launches
const launchesData = {
  satoshi: {
    id: "satoshi",
    name: "SATOSHI",
    symbol: "TOSHI",
    description:
      "The first community-driven Bitcoin Layer 2 token with deflationary mechanics. SATOSHI aims to become the standard for decentralized applications on the Bitcoin Stacks ecosystem, offering a suite of DeFi tools and services that leverage Bitcoin's security and Stacks' programmability.",
    icon: "stacks",
    hardCap: 500000,
    raised: 325000,
    progress: 65,
    startDate: "2025-05-15T10:00:00Z",
    endDate: "2025-05-22T10:00:00Z",
    status: "active",
    website: "https://satoshi-token.io",
    twitter: "https://twitter.com/satoshi_token",
    telegram: "https://t.me/satoshi_token",
    github: "https://github.com/satoshi-token",
    whitepaper: "https://satoshi-token.io/whitepaper.pdf",
    minContribution: 0.0001,
    maxContribution: 0.01,
    tokenPrice: 0.00056,
    totalSupply: 21000000,
    initialMarketCap: 1176000,
    featured: true,
    team: [
      {
        name: "Alex Nakamoto",
        role: "Founder & CEO",
        bio: "Former Bitcoin Core contributor with 8+ years in blockchain development",
        avatar: "/diverse-group-city.png",
      },
      {
        name: "Sarah Chen",
        role: "CTO",
        bio: "Smart contract specialist with experience at major DeFi protocols",
        avatar: "/diverse-group-city.png",
      },
      {
        name: "Michael Rodriguez",
        role: "Head of Business",
        bio: "10+ years in fintech with focus on cryptocurrency adoption",
        avatar: "/diverse-group-city.png",
      },
    ],
    tokenomics: {
      publicSale: 25,
      liquidity: 30,
      team: 15,
      marketing: 10,
      development: 15,
      ecosystem: 5,
    },
    roadmap: [
      {
        title: "Q2 2025",
        items: ["Token Launch", "DEX Listing", "Community Building"],
      },
      {
        title: "Q3 2025",
        items: ["Staking Platform", "Governance Implementation", "Partnership Expansion"],
      },
      {
        title: "Q4 2025",
        items: ["DeFi Suite Launch", "Cross-chain Bridge", "Mobile Wallet"],
      },
      {
        title: "Q1 2026",
        items: ["DAO Transition", "Ecosystem Grants Program", "Enterprise Solutions"],
      },
    ],
  },
  lightning: {
    id: "lightning",
    name: "LIGHTNING",
    symbol: "LTNG",
    description:
      "Fast and secure payment solution built on Bitcoin Stacks with instant finality. LIGHTNING is designed to facilitate micropayments and high-frequency transactions on the Bitcoin network, leveraging Stacks' layer 2 capabilities to achieve scalability without compromising security.",
    icon: "stacks",
    hardCap: 350000,
    raised: 350000,
    progress: 100,
    startDate: "2025-05-10T14:00:00Z",
    endDate: "2025-05-17T14:00:00Z",
    status: "filled",
    website: "https://lightning-token.io",
    twitter: "https://twitter.com/lightning_token",
    telegram: "https://t.me/lightning_token",
    github: "https://github.com/lightning-token",
    whitepaper: "https://lightning-token.io/whitepaper.pdf",
    minContribution: 0.0001,
    maxContribution: 0.005,
    tokenPrice: 0.00021,
    totalSupply: 100000000,
    initialMarketCap: 2100000,
    featured: true,
    team: [
      {
        name: "Elena Swift",
        role: "Founder & Lead Developer",
        bio: "Payment systems expert with background at major fintech companies",
        avatar: "/diverse-group-city.png",
      },
      {
        name: "David Park",
        role: "Head of Research",
        bio: "PhD in Distributed Systems with focus on payment channels",
        avatar: "/diverse-group-city.png",
      },
      {
        name: "Lisa Johnson",
        role: "COO",
        bio: "Operations specialist with experience scaling blockchain startups",
        avatar: "/diverse-group-city.png",
      },
    ],
    tokenomics: {
      publicSale: 20,
      liquidity: 35,
      team: 15,
      marketing: 10,
      development: 15,
      ecosystem: 5,
    },
    roadmap: [
      {
        title: "Q2 2025",
        items: ["Token Launch", "Initial Exchange Listings", "Payment SDK Release"],
      },
      {
        title: "Q3 2025",
        items: ["Merchant Integration Tools", "Mobile Wallet Beta", "Developer API"],
      },
      {
        title: "Q4 2025",
        items: ["Point-of-Sale Solutions", "Cross-chain Interoperability", "Enterprise Partnerships"],
      },
      {
        title: "Q1 2026",
        items: ["Global Payment Network", "Fiat On/Off Ramps", "Institutional Services"],
      },
    ],
  },
}

export default function LaunchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [launch, setLaunch] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contributionAmount, setContributionAmount] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate loading launch data
    setLoading(true)
    setTimeout(() => {
      const launchData = launchesData[id.toLowerCase()]
      if (launchData) {
        setLaunch(launchData)
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
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    } else {
      return `${num.toFixed(2)}`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    })
  }

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const distance = end - now

    if (distance < 0) return "Ended"

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

    return `${days}d ${hours}h ${minutes}m remaining`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Upcoming</Badge>
      case "filled":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Filled</Badge>
      case "completed":
        return <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">Completed</Badge>
      default:
        return null
    }
  }

  const handleContribute = () => {
    // Simulate contribution
    alert(`Successfully contributed ${contributionAmount} BTC to ${launch.name} token launch!`)
    setContributionAmount("")
  }

  const calculateTokens = () => {
    if (!contributionAmount || isNaN(Number(contributionAmount))) return 0
    const btcValue = Number(contributionAmount) * 65000 // Assuming 1 BTC = $65,000
    return btcValue / launch.tokenPrice
  }

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

  if (!launch) {
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
              <Button variant="outline" size="sm" onClick={() => router.push("/launch")}>
                Back to Launches
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h1 className="text-2xl font-bold mb-4">Launch Not Found</h1>
            <p className="text-zinc-400 mb-6">The token launch you're looking for doesn't exist or has been removed.</p>
            <Link href="/launch">
              <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white">Back to Launches</Button>
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
              <Link href="/liquidity" className="text-sm font-medium hover:text-[#FF5500]">
                LIQUIDITY
              </Link>
              <Link href="/launch" className="text-sm font-medium text-[#FF5500]">
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
                <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3">
                  <Link href="/liquidity">LIQUIDITY</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-3 bg-zinc-800">
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
              <Link href="/launch" className="hover:text-white">
                Launches
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{launch.name}</span>
            </div>
          </div>

          {/* Launch Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5500]/10 text-[#FF5500]">
                  {launch.icon === "stacks" ? (
                    <StacksLogoIcon className="h-6 w-6" />
                  ) : (
                    <BitcoinIcon className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{launch.name}</h1>
                    {getStatusBadge(launch.status)}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-sm">{launch.symbol}</span>
                    <span className="text-xs">•</span>
                    <span className="text-sm">Bitcoin Stacks</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                  asChild
                >
                  <Link href={launch.website} target="_blank" rel="noopener noreferrer">
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
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Website
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                  asChild
                >
                  <Link href={launch.twitter} target="_blank" rel="noopener noreferrer">
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
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    Twitter
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                  asChild
                >
                  <Link href={launch.telegram} target="_blank" rel="noopener noreferrer">
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
                      <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.968.193 1.798.919 2.286 1.61.516 3.275 1.009 4.654 1.472.846 1.467 1.618 2.92 2.454 4.342l.159.273c.51.885.947 1.643 1.486 1.725.595.093 1.28-.393 1.762-.825 1.134-1.017 2.055-1.857 2.993-2.71l3.572 2.654c1.053.78 2.087 1.25 2.857.596 1.267-.987 1.8-3.447 2.018-4.361.192-.809.528-3.322.566-3.907.026-.384.044-.928-.096-1.239-.172-.376-.4-.438-.58-.443-.108-.003-.21.012-.31.033l-8.602 3.807c-.433.192-.87.318-1.296.013-.314-.225-.501-.694-.513-.987 0 0-.044-.8.058-1.17.109-.401.545-.794 1.436-1.12l8.18-3.191c.061-.024.138-.043.224-.043.171 0 .385.07.465.283.087.22.051.532-.103.91l-3.617 8.96c-.346.846-1.004 1.98-2.198 2.357z"></path>
                    </svg>
                    Telegram
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                  asChild
                >
                  <Link href={launch.whitepaper} target="_blank" rel="noopener noreferrer">
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Whitepaper
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Launch Info */}
              <div className="lg:col-span-2">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="bg-zinc-800 border border-zinc-700 mb-6">
                        <TabsTrigger
                          value="overview"
                          className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                        >
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="tokenomics"
                          className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                        >
                          Tokenomics
                        </TabsTrigger>
                        <TabsTrigger
                          value="team"
                          className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                        >
                          Team
                        </TabsTrigger>
                        <TabsTrigger
                          value="roadmap"
                          className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                        >
                          Roadmap
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="mt-0">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">About {launch.name}</h3>
                            <p className="text-zinc-300 leading-relaxed">{launch.description}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-zinc-400 mb-3">Token Details</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Token Name</span>
                                  <span>{launch.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Token Symbol</span>
                                  <span>{launch.symbol}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Total Supply</span>
                                  <span>{launch.totalSupply.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Token Price</span>
                                  <span>${launch.tokenPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Initial Market Cap</span>
                                  <span>${formatNumber(launch.initialMarketCap)}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-zinc-400 mb-3">Sale Details</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Hard Cap</span>
                                  <span>${formatNumber(launch.hardCap)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Raised</span>
                                  <span>${formatNumber(launch.raised)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Start Date</span>
                                  <span>{formatDate(launch.startDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">End Date</span>
                                  <span>{formatDate(launch.endDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Min Contribution</span>
                                  <span>{launch.minContribution} BTC</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Max Contribution</span>
                                  <span>{launch.maxContribution} BTC</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="tokenomics" className="mt-0">
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold mb-3">Tokenomics</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="space-y-2">
                                {Object.entries(launch.tokenomics).map(([key, value]: [string, any]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-zinc-400 capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <span>{value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="h-[200px] relative">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                  {Object.entries(launch.tokenomics).reduce(
                                    (acc: JSX.Element[], [key, value]: [string, any], index: number) => {
                                      const colors = ["#FF5500", "#FF7A00", "#FFA500", "#FFD000", "#FFEA00", "#FFF200"]
                                      const startAngle = acc.length ? acc[acc.length - 1].props.endAngle : 0
                                      const endAngle = startAngle + (value / 100) * 360
                                      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

                                      // Calculate coordinates on the circle
                                      const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
                                      const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
                                      const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
                                      const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

                                      // Create the path for the pie slice
                                      const path = (
                                        <path
                                          key={key}
                                          d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                                          fill={colors[index % colors.length]}
                                          stroke="#1c1c1c"
                                          strokeWidth="1"
                                          startAngle={startAngle}
                                          endAngle={endAngle}
                                        />
                                      )

                                      return [...acc, path]
                                    },
                                    [],
                                  )}
                                </svg>
                              </div>
                              <div className="mt-4 grid grid-cols-2 gap-2">
                                {Object.entries(launch.tokenomics).map(([key, value]: [string, any], index: number) => {
                                  const colors = ["#FF5500", "#FF7A00", "#FFA500", "#FFD000", "#FFEA00", "#FFF200"]
                                  return (
                                    <div key={key} className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: colors[index % colors.length] }}
                                      ></div>
                                      <span className="text-xs text-zinc-400 capitalize">
                                        {key.replace(/([A-Z])/g, " $1").trim()} ({value}%)
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="team" className="mt-0">
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold mb-3">Team</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {launch.team.map((member: any, index: number) => (
                              <Card key={index} className="bg-zinc-800 border-zinc-700">
                                <CardContent className="p-4">
                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                                      <img
                                        src={member.avatar || "/placeholder.svg"}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <h4 className="font-medium mb-1">{member.name}</h4>
                                    <p className="text-sm text-[#FF5500] mb-2">{member.role}</p>
                                    <p className="text-xs text-zinc-400">{member.bio}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="roadmap" className="mt-0">
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold mb-3">Roadmap</h3>
                          <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800"></div>

                            <div className="space-y-8">
                              {launch.roadmap.map((phase: any, index: number) => (
                                <div key={index} className="relative pl-12">
                                  {/* Circle marker */}
                                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5500]"></div>
                                  </div>

                                  <h4 className="text-md font-medium mb-3">{phase.title}</h4>
                                  <ul className="space-y-2">
                                    {phase.items.map((item: string, itemIndex: number) => (
                                      <li key={itemIndex} className="flex items-start">
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
                                          className="text-[#FF5500] mr-2 flex-shrink-0 mt-1"
                                        >
                                          <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span className="text-zinc-300">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Contribution Box */}
              <div>
                <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Token Sale</h3>
                      <div className="text-sm text-zinc-400 mb-4">{getTimeRemaining(launch.endDate)}</div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-400">Progress</span>
                          <span>{launch.progress}%</span>
                        </div>
                        <Progress value={launch.progress} className="h-2 bg-zinc-800" />
                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                          <span>${formatNumber(launch.raised)}</span>
                          <span>${formatNumber(launch.hardCap)}</span>
                        </div>
                      </div>
                    </div>

                    {(launch.status === "active" || launch.status === "upcoming") && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-zinc-400 mb-1.5 block">Contribution Amount (BTC)</label>
                          <Input
                            type="number"
                            placeholder={`Min: ${launch.minContribution} BTC`}
                            className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            min={launch.minContribution}
                            max={launch.maxContribution}
                            step="0.0001"
                          />
                          <div className="text-xs text-zinc-500 mt-1">Max: {launch.maxContribution} BTC</div>
                        </div>

                        <div className="bg-zinc-800 rounded-lg p-4 text-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-zinc-400">You will receive</span>
                            <span className="font-medium">
                              {calculateTokens().toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}{" "}
                              {launch.symbol}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-zinc-400">Token price</span>
                            <span>${launch.tokenPrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Sale ends</span>
                            <span>{formatDate(launch.endDate)}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-[#FF5500] hover:bg-[#E64D00] text-white py-6 text-lg"
                          disabled={
                            !isConnected ||
                            !contributionAmount ||
                            Number(contributionAmount) < launch.minContribution ||
                            Number(contributionAmount) > launch.maxContribution ||
                            launch.status === "upcoming"
                          }
                          onClick={handleContribute}
                        >
                          {!isConnected
                            ? "Connect Wallet"
                            : launch.status === "upcoming"
                              ? "Sale Not Started"
                              : "Contribute"}
                        </Button>
                      </div>
                    )}

                    {launch.status === "filled" && (
                      <div className="text-center py-4">
                        <div className="text-yellow-500 mb-2">Hard Cap Reached</div>
                        <p className="text-zinc-400 text-sm mb-4">
                          This token sale has reached its hard cap. Token distribution will begin soon.
                        </p>
                        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white" disabled>
                          Sale Completed
                        </Button>
                      </div>
                    )}

                    {launch.status === "completed" && (
                      <div className="text-center py-4">
                        <div className="text-purple-500 mb-2">Sale Completed</div>
                        <p className="text-zinc-400 text-sm mb-4">
                          This token sale has ended. Tokens have been distributed to participants.
                        </p>
                        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white" disabled>
                          Sale Ended
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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
