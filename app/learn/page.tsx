"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const featuredArticles = [
    {
      id: 1,
      title: "Introduction to Stacks",
      description: "Learn about the Stacks blockchain and how it brings smart contracts to Bitcoin.",
      category: "Beginner",
      readTime: "5 min",
      image: "/stacks-blockchain-concept.png",
    },
    {
      id: 2,
      title: "How to Launch a Token on Stacks",
      description: "A step-by-step guide to creating and launching your own token on the Stacks blockchain.",
      category: "Intermediate",
      readTime: "8 min",
      image: "/crypto-launch-pad.png",
    },
    {
      id: 3,
      title: "Understanding Liquidity Pools",
      description: "Dive deep into how liquidity pools work and how you can participate.",
      category: "Advanced",
      readTime: "10 min",
      image: "/crypto-liquidity-flow.png",
    },
  ]

  const allArticles = [
    ...featuredArticles,
    {
      id: 4,
      title: "Stacks vs Other Smart Contract Platforms",
      description: "Compare Stacks with Ethereum, Solana, and other smart contract platforms.",
      category: "Intermediate",
      readTime: "7 min",
      image: "/blockchain-network-comparison.png",
    },
    {
      id: 5,
      title: "Security Best Practices for Crypto",
      description: "Learn how to keep your crypto assets safe with these security tips.",
      category: "Beginner",
      readTime: "6 min",
      image: "/crypto-fortress.png",
    },
    {
      id: 6,
      title: "Advanced Trading Strategies",
      description: "Explore sophisticated trading techniques for experienced traders.",
      category: "Advanced",
      readTime: "12 min",
      image: "/placeholder.svg?height=200&width=400&query=crypto trading strategies",
    },
  ]

  const filteredArticles = allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const faqs = [
    {
      question: "What is Stacks?",
      answer:
        "Stacks is a layer-1 blockchain solution that is connected to Bitcoin. It brings smart contracts and decentralized apps to Bitcoin. These smart contracts are executed by the Stacks blockchain, but they settle on the Bitcoin blockchain.",
    },
    {
      question: "How do I create a token on Stacks?",
      answer:
        "You can create a token on Stacks by using our platform's 'Launch' feature. The process involves defining your token's properties, setting up initial distribution, and paying a small fee of $1 worth of STX to deploy your token contract.",
    },
    {
      question: "What are liquidity pools?",
      answer:
        "Liquidity pools are collections of funds locked in a smart contract. They are used to facilitate decentralized trading, lending, and other functions. By providing liquidity to these pools, users can earn rewards in the form of trading fees.",
    },
    {
      question: "How do I connect my wallet?",
      answer:
        "Click on the 'Connect Wallet' button in the top right corner of the platform. You'll be presented with a list of compatible wallets including Xverse, Leather, Hiro, and OKX. Select your preferred wallet and follow the prompts to connect.",
    },
    {
      question: "What fees are involved in trading?",
      answer:
        "Trading on our platform involves a small fee of 0.3% per trade. Of this fee, 0.25% goes to liquidity providers as an incentive, and 0.05% goes to the platform for maintenance and development.",
    },
  ]

  const tutorials = [
    {
      id: 1,
      title: "How to Set Up a Stacks Wallet",
      steps: [
        "Choose a wallet provider (Xverse, Leather, Hiro, or OKX)",
        "Download and install the wallet application",
        "Create a new wallet and securely store your seed phrase",
        "Fund your wallet with STX tokens",
      ],
      difficulty: "Beginner",
      image: "/placeholder.svg?height=150&width=300&query=crypto wallet setup",
    },
    {
      id: 2,
      title: "Making Your First Trade",
      steps: [
        "Connect your wallet to the platform",
        "Navigate to the token you want to trade",
        "Enter the amount you want to buy or sell",
        "Review and confirm the transaction",
      ],
      difficulty: "Beginner",
      image: "/placeholder.svg?height=150&width=300&query=cryptocurrency trading",
    },
    {
      id: 3,
      title: "Providing Liquidity",
      steps: [
        "Navigate to the Liquidity section",
        "Select the token pair you want to provide liquidity for",
        "Enter the amounts of each token",
        "Confirm and receive your LP tokens",
      ],
      difficulty: "Intermediate",
      image: "/placeholder.svg?height=150&width=300&query=defi liquidity providing",
    },
  ]

  return (
    <main className="flex flex-col min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#FF5500] flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-lg">BTC Stacks</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                Home
              </Button>
            </Link>
            <Link href="/launch">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                Launch
              </Button>
            </Link>
            <Link href="/liquidity">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                Liquidity
              </Button>
            </Link>
            <Link href="/learn" className="hidden md:block">
              <Button variant="ghost" className="text-white bg-zinc-800">
                Learn
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Learn About Stacks & Crypto</h1>
            <p className="text-zinc-400 text-lg mb-8">
              Explore our educational resources to better understand the Stacks ecosystem, cryptocurrency trading, and
              blockchain technology.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search articles, tutorials, and FAQs..."
                className="bg-zinc-800 border-zinc-700 pl-10 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="articles" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-zinc-800">
              <TabsTrigger value="articles" className="data-[state=active]:bg-[#FF5500] data-[state=active]:text-white">
                Articles
              </TabsTrigger>
              <TabsTrigger
                value="tutorials"
                className="data-[state=active]:bg-[#FF5500] data-[state=active]:text-white"
              >
                Tutorials
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-[#FF5500] data-[state=active]:text-white">
                FAQ
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Articles Tab */}
          <TabsContent value="articles">
            {searchQuery ? (
              <>
                <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-zinc-500">{article.readTime} read</span>
                          </div>
                          <CardTitle className="text-xl">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-zinc-400 mb-4">{article.description}</CardDescription>
                          <Button
                            variant="ghost"
                            className="text-[#FF5500] hover:text-[#FF5500] hover:bg-[#FF5500]/10 p-0"
                          >
                            Read Article
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
                              className="ml-1"
                            >
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto text-zinc-600 mb-4"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">No results found</h3>
                    <p className="text-zinc-400">
                      We couldn't find any articles matching "{searchQuery}". Try a different search term.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Featured Articles */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Featured Articles</h2>
                    <Button variant="ghost" className="text-[#FF5500] hover:text-[#FF5500] hover:bg-[#FF5500]/10">
                      View All
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
                        className="ml-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-zinc-500">{article.readTime} read</span>
                          </div>
                          <CardTitle className="text-xl">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-zinc-400 mb-4">{article.description}</CardDescription>
                          <Button
                            variant="ghost"
                            className="text-[#FF5500] hover:text-[#FF5500] hover:bg-[#FF5500]/10 p-0"
                          >
                            Read Article
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
                              className="ml-1"
                            >
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "Beginner",
                      "Intermediate",
                      "Advanced",
                      "Stacks",
                      "Trading",
                      "Security",
                      "Tokenomics",
                      "DeFi",
                    ].map((category, index) => (
                      <Card
                        key={index}
                        className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
                      >
                        <CardContent className="p-6 flex items-center justify-between">
                          <span className="font-medium">{category}</span>
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
                            className="text-zinc-500"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Latest Articles */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Latest Articles</h2>
                    <Button variant="ghost" className="text-[#FF5500] hover:text-[#FF5500] hover:bg-[#FF5500]/10">
                      View All
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
                        className="ml-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allArticles.slice(3, 6).map((article) => (
                      <Card
                        key={article.id}
                        className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-zinc-500">{article.readTime} read</span>
                          </div>
                          <CardTitle className="text-xl">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-zinc-400 mb-4">{article.description}</CardDescription>
                          <Button
                            variant="ghost"
                            className="text-[#FF5500] hover:text-[#FF5500] hover:bg-[#FF5500]/10 p-0"
                          >
                            Read Article
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
                              className="ml-1"
                            >
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Step-by-Step Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => (
                  <Card
                    key={tutorial.id}
                    className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={tutorial.image || "/placeholder.svg"}
                        alt={tutorial.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="outline" className="w-fit mb-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-800">
                        {tutorial.difficulty}
                      </Badge>
                      <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Steps:</h4>
                        <ol className="list-decimal pl-5 space-y-1 text-zinc-400">
                          {tutorial.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <Button className="w-full bg-[#FF5500] hover:bg-[#E64D00] text-white">Start Tutorial</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Video Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                  <div className="aspect-video bg-zinc-800 relative flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=300&width=600&query=stacks blockchain tutorial video thumbnail"
                      alt="Getting Started with Stacks"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-[#FF5500]/90 flex items-center justify-center">
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
                          className="text-white ml-1"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>Getting Started with Stacks</CardTitle>
                    <CardDescription className="text-zinc-400">
                      A comprehensive introduction to the Stacks ecosystem and how to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
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
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>15:24</span>
                    </div>
                    <div className="flex items-center gap-1">
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
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>2.4K views</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                  <div className="aspect-video bg-zinc-800 relative flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=300&width=600&query=cryptocurrency trading tutorial video thumbnail"
                      alt="Advanced Trading Techniques"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-[#FF5500]/90 flex items-center justify-center">
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
                          className="text-white ml-1"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>Advanced Trading Techniques</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Learn advanced trading strategies and technical analysis for cryptocurrency markets.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
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
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>23:10</span>
                    </div>
                    <div className="flex items-center gap-1">
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
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>1.8K views</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-zinc-800">
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="text-lg font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-zinc-400 pb-4">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
                <p className="text-zinc-400 mb-6">
                  Can't find the answer you're looking for? Feel free to reach out to our support team.
                </p>
                <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white">Contact Support</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Newsletter Section */}
      <div className="bg-zinc-900 border-t border-zinc-800 mt-12">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-zinc-400 mb-8">
              Subscribe to our newsletter to receive the latest updates, tutorials, and news about Stacks and
              cryptocurrency.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-zinc-800 border-zinc-700" />
              <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-[#FF5500] flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-lg">BTC Stacks</span>
            </div>
            <div className="text-zinc-500 text-sm">© {new Date().getFullYear()} BTC Stacks. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </main>
  )
}
