"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StacksLogoIcon, BitcoinIcon, ArrowUpIcon, ChevronDownIcon, FilterIcon, FlameIcon, SearchIcon, SparkleIcon } from "@/components/icons"
import { useWallet, WalletButton } from "@/components/WalletProvider"
import { toast } from "sonner"

export default function ProfilePage() {
  const { isConnected, walletAddress, profile, stxBalance, connect, updateProfile } = useWallet();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [newUsername, setNewUsername] = useState(profile?.username || '');
  const [newAvatar, setNewAvatar] = useState<string | null>(profile?.avatar_url || null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!updateProfile) {
        throw new Error('Update profile function not available');
      }

      const updates: { username?: string; avatar_url?: string } = {};
      
      if (newUsername && newUsername !== profile?.username) {
        updates.username = newUsername;
      }
      
      if (newAvatar && newAvatar !== profile?.avatar_url) {
        updates.avatar_url = newAvatar;
      }

      await updateProfile(updates);
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    }
  };

  // Initialize userData with empty arrays for transactions and portfolio
  const userData = {
    username: profile?.username || 'Set Username',
    joinDate: "May 2023",
    email: "",
    avatar_url: profile?.avatar_url,
    stxBalance: stxBalance || 0,
    btcBalance: 0.00842,
    portfolio: [], // Empty array for portfolio
    transactions: [], // Empty array for transactions
    referrals: {
      code: "SATOSHI10",
      invited: 0,
      active: 0,
      rewards: 0,
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
    })
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

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num)
  }

  const getTotalPortfolioValue = () => {
    return userData.portfolio.reduce((total, token) => total + token.value, 0)
  }

  if (!isConnected) {
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
              <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white" onClick={connect}>
                Connect
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-zinc-400 mb-6 max-w-md">
              Connect your wallet to view your profile, portfolio, and transaction history.
            </p>
            <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white" onClick={connect}>
              Connect Wallet
            </Button>
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
                <span>{stxBalance}</span>
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
                  <Link href="/">TOKENS</Link>
                </DropdownMenuItem>
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
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative group h-16 w-16 overflow-hidden rounded-full bg-zinc-800 border border-zinc-700">
                  {editMode ? (
                    <label className="cursor-pointer block h-full w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                      {newAvatar ? (
                        <img
                          src={newAvatar}
                          alt="New Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Current Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            console.error('Error loading avatar:', e);
                            e.currentTarget.src = '/default-avatar.png'; // Fallback to default avatar
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-zinc-500"
                          >
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.35 18.5C8.66 17.56 10.26 17 12 17s3.34.56 4.65 1.5c-1.31.94-2.91 1.5-4.65 1.5s-3.34-.56-4.65-1.5zm10.79-1.38C16.45 15.8 14.32 15 12 15s-4.45.8-6.14 2.12A7.96 7.96 0 0 1 4 12c0-4.42 3.58-8 8-8s8 3.58 8 8c0 1.85-.63 3.54-1.86 4.12zM12 6c-1.93 0-3.5 1.57-3.5 3.5S10.07 13 12 13s3.5-1.57 3.5-3.5S13.93 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      )}
                    </label>
                  ) : (
                    profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error('Error loading avatar:', e);
                          e.currentTarget.src = '/default-avatar.png'; // Fallback to default avatar
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-zinc-500"
                        >
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.35 18.5C8.66 17.56 10.26 17 12 17s3.34.56 4.65 1.5c-1.31.94-2.91 1.5-4.65 1.5s-3.34-.56-4.65-1.5zm10.79-1.38C16.45 15.8 14.32 15 12 15s-4.45.8-6.14 2.12A7.96 7.96 0 0 1 4 12c0-4.42 3.58-8 8-8s8 3.58 8 8c0 1.85-.63 3.54-1.86 4.12zM12 6c-1.93 0-3.5 1.57-3.5 3.5S10.07 13 12 13s3.5-1.57 3.5-3.5S13.93 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    )
                  )}
                </div>
                <div>
                  {editMode ? (
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1 text-xl font-bold mb-1"
                      placeholder="Enter username"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{profile?.username || 'Set Username'}</h1>
                  )}
                  <p className="text-zinc-400">Wallet: {walletAddress}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                  onClick={() => {
                    if (editMode) {
                      setNewUsername(profile?.username || '');
                      setNewAvatar(profile?.avatar_url || null);
                    }
                    setEditMode(!editMode);
                  }}
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </Button>
                {editMode && (
                  <Button 
                    className="bg-[#FF5500] hover:bg-[#E64D00] text-white"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-zinc-400">Total Portfolio Value</div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5500]/10 text-[#FF5500]">
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
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(getTotalPortfolioValue())}</div>
                  <div className="text-xs text-green-500 mt-1">+8.2% (24h)</div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-zinc-400">STX Balance</div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5500]/10">
                      <img 
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/4847.png"
                        alt="STX"
                        className="h-5 w-5"
                      />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stxBalance}</div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-zinc-400">Referral Rewards</div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5500]/10 text-[#FF5500]">
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
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{userData.referrals.rewards} STX</div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {userData.referrals.active} active referrals of {userData.referrals.invited}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Profile Content */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
              <TabsTrigger
                value="portfolio"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="referrals"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-[#FF5500]"
              >
                Referrals
              </TabsTrigger>
            </TabsList>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="mt-0">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Your Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="text-zinc-400 whitespace-nowrap">TOKEN</TableHead>
                            <TableHead className="text-zinc-400 whitespace-nowrap">AMOUNT</TableHead>
                            <TableHead className="text-zinc-400 whitespace-nowrap">VALUE</TableHead>
                            <TableHead className="text-zinc-400 text-right whitespace-nowrap">24H</TableHead>
                            <TableHead className="text-zinc-400 text-right whitespace-nowrap">ACTION</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userData.portfolio.length > 0 ? (
                            userData.portfolio.map((token, index) => (
                            <TableRow key={index} className="border-zinc-800 hover:bg-zinc-800/50">
                              <TableCell>
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div
                                    className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full ${
                                      token.icon === "stacks"
                                        ? "bg-[#FF5500]/10 text-[#FF5500]"
                                        : "bg-[#f7931a]/10 text-[#f7931a]"
                                    } flex-shrink-0`}
                                  >
                                    {token.icon === "stacks" ? (
                                      <StacksLogoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    ) : (
                                      <BitcoinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm sm:text-base">{token.token}</div>
                                    <div className="text-xs text-zinc-500">{token.ticker}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm sm:text-base">
                                {token.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="font-medium">{formatCurrency(token.value)}</TableCell>
                              <TableCell
                                className={`text-right ${
                                  token.change24h >= 0 ? "text-green-500" : "text-red-500"
                                } text-sm sm:text-base`}
                              >
                                {token.change24h >= 0 ? "+" : ""}
                                {token.change24h.toFixed(1)}%
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-[#FF5500] hover:bg-[#E64D00] text-white h-8 px-3 rounded-md"
                                  >
                                    Buy
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 h-8 px-3 rounded-md"
                                  >
                                    Sell
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-12">
                                <div className="flex flex-col items-center justify-center gap-3">
                                  <div className="h-12 w-12 rounded-full bg-[#FF5500]/10 flex items-center justify-center">
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
                                      className="text-[#FF5500]"
                                    >
                                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                  </div>
                                  <div className="text-zinc-400 text-center">
                                    <p className="font-medium mb-1">No tokens in your portfolio</p>
                                    <p className="text-sm text-zinc-500">Start trading to build your portfolio</p>
                                  </div>
                                  <Button
                                    className="bg-[#FF5500] hover:bg-[#E64D00] text-white mt-2"
                                    onClick={() => window.location.href = '/'}
                                  >
                                    Browse Tokens
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-0">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="text-zinc-400 whitespace-nowrap">TYPE</TableHead>
                            <TableHead className="text-zinc-400 whitespace-nowrap">TOKEN</TableHead>
                            <TableHead className="text-zinc-400 whitespace-nowrap">AMOUNT</TableHead>
                            <TableHead className="text-zinc-400 whitespace-nowrap">PRICE</TableHead>
                            <TableHead className="text-zinc-400 whitespace-nowrap">TOTAL</TableHead>
                            <TableHead className="text-zinc-400 whitespace-nowrap">DATE</TableHead>
                            <TableHead className="text-zinc-400 text-right whitespace-nowrap">STATUS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userData.transactions.length > 0 ? (
                            userData.transactions.map((tx) => (
                            <TableRow key={tx.id} className="border-zinc-800 hover:bg-zinc-800/50">
                              <TableCell>
                                <Badge
                                  className={`${
                                    tx.type === "Buy"
                                      ? "bg-green-500/20 text-green-500 border-green-500/30"
                                      : tx.type === "Sell"
                                        ? "bg-red-500/20 text-red-500 border-red-500/30"
                                        : tx.type === "Deposit"
                                          ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                          : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                                  }`}
                                >
                                  {tx.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{tx.token}</TableCell>
                              <TableCell className="font-mono">{tx.amount}</TableCell>
                              <TableCell className="font-mono">${tx.price}</TableCell>
                              <TableCell className="font-mono">${tx.total}</TableCell>
                              <TableCell>{formatDate(tx.date)}</TableCell>
                              <TableCell className="text-right">
                                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                  {tx.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-12">
                                <div className="flex flex-col items-center justify-center gap-3">
                                  <div className="h-12 w-12 rounded-full bg-[#FF5500]/10 flex items-center justify-center">
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
                                      className="text-[#FF5500]"
                                    >
                                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                                      <path d="M18 9v6" />
                                    </svg>
                                  </div>
                                  <div className="text-zinc-400 text-center">
                                    <p className="font-medium mb-1">No transactions yet</p>
                                    <p className="text-sm text-zinc-500">Your trading history will appear here</p>
                                  </div>
                                  <Button
                                    className="bg-[#FF5500] hover:bg-[#E64D00] text-white mt-2"
                                    onClick={() => window.location.href = '/'}
                                  >
                                    Start Trading
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals" className="mt-0">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
                      <div className="bg-zinc-800 p-4 rounded-lg mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-zinc-400">Share this link with friends:</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
                          >
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
                              className="mr-1"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                          </Button>
                        </div>
                        <div className="bg-zinc-900 p-3 rounded border border-zinc-700 font-mono text-sm break-all">
                          https://stack.sats/ref/{userData.referrals.code}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-4">Referral Code</h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-zinc-400">Your unique code:</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
                          >
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
                              className="mr-1"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                          </Button>
                        </div>
                        <div className="bg-zinc-900 p-3 rounded border border-zinc-700 font-mono text-sm text-center">
                          {userData.referrals.code}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Referral Stats</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-zinc-800 border-zinc-700">
                          <CardContent className="p-4">
                            <div className="text-sm text-zinc-400 mb-1">Total Invited</div>
                            <div className="text-2xl font-bold">{userData.referrals.invited}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-zinc-800 border-zinc-700">
                          <CardContent className="p-4">
                            <div className="text-sm text-zinc-400 mb-1">Active Users</div>
                            <div className="text-2xl font-bold">{userData.referrals.active}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-zinc-800 border-zinc-700">
                          <CardContent className="p-4">
                            <div className="text-sm text-zinc-400 mb-1">Total Rewards</div>
                            <div className="text-2xl font-bold">{userData.referrals.rewards} STX</div>
                          </CardContent>
                        </Card>
                      </div>

                      <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF5500]/20 text-[#FF5500] mr-2 flex-shrink-0 mt-0.5">
                              1
                            </div>
                            <span className="text-zinc-300">
                              Share your referral link or code with friends and community
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF5500]/20 text-[#FF5500] mr-2 flex-shrink-0 mt-0.5">
                              2
                            </div>
                            <span className="text-zinc-300">
                              When they sign up and make their first trade, you earn 5 STX
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF5500]/20 text-[#FF5500] mr-2 flex-shrink-0 mt-0.5">
                              3
                            </div>
                            <span className="text-zinc-300">Earn 1% of their trading fees for the first 3 months</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
