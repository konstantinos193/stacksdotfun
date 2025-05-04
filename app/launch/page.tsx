"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { StacksLogoIcon } from "@/components/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from 'sonner'
import { request } from "sats-connect"
import { openContractCall } from "@stacks/connect"
import { STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network"
import { WalletProvider, useWallet, WalletButton } from "@/components/WalletProvider"
import { useRouter } from "next/navigation"
import { cvToHex, stringAsciiCV, uintCV } from '@stacks/transactions'

// Add testnet configuration
const IS_TESTNET = process.env.NEXT_PUBLIC_NETWORK === 'testnet'
const TESTNET_EXPLORER = 'https://explorer.hiro.so/?chain=testnet'
const MAINNET_EXPLORER = 'https://explorer.hiro.so'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

interface SignatureResponse {
  address: string
  signature: string
}

interface XverseAddress {
  address: string;
  publicKey: string;
  purpose: "payment" | "ordinals" | "stacks";
  addressType: "p2tr" | "p2wpkh" | "p2sh" | "stacks";
}

interface XverseNetwork {
  bitcoin: {
    name: string;
  };
  stacks: {
    name: string;
  };
}

interface XverseResponse {
  walletType: string;
  id: string;
  addresses: XverseAddress[];
  network: XverseNetwork;
}

interface Provider {
  name: string;
  id: string;
}

interface StacksProvider {
  request: (method: string, params?: any) => Promise<any>;
  getAddresses?: () => Promise<string[]>;
}

interface OKXStacks {
  connect: () => Promise<any>;
  getAddresses: () => Promise<string[]>;
  disconnect: () => Promise<void>;
  signTransaction: (txOptions: any) => Promise<{ txid: string }>;
}

interface FormData {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  devTokens: string;
  description: string;
  website: string;
  twitter: string;
  telegram: string;
  tokenImage: string | File;
}

declare global {
  interface Window {
    LeatherProvider?: {
      request: (method: string, params?: any) => Promise<any>;
      getAddresses?: () => Promise<string[]>;
    };
    okxwallet?: {
      stacks: {
        connect: () => Promise<any>;
        getAddresses: () => Promise<string[]>;
        disconnect: () => Promise<void>;
        signTransaction: any; // Allow any signature for wallet methods
      };
    };
    btc_providers?: Provider[];
  }
}

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

export default function LaunchPage() {
  const { isConnected, stxBalance, walletAddress, selectedWallet, connect, disconnect } = useWallet()
  const [isLaunching, setIsLaunching] = useState(false)
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  const [stxAmountFor2Dollars, setStxAmountFor2Dollars] = useState<number | null>(null)
  const [stxPrice, setStxPrice] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "21000000",
    devTokens: "",
    description: "",
    website: "",
    twitter: "",
    telegram: "",
    tokenImage: "",
  })
  const router = useRouter()
  const [networkFee, setNetworkFee] = useState<number>(0.003); // Default fallback

  // Add effect to check wallet connection status
  useEffect(() => {
    console.log('Wallet state:', { isConnected, walletAddress, selectedWallet })
  }, [isConnected, walletAddress, selectedWallet])

  // Add this useEffect to fetch STX price
  useEffect(() => {
    const fetchStxPrice = async () => {
      try {
        const response = await fetch('/api/stx-price')
        const data = await response.json()
        if (data.stxPrice && data.stxAmountFor2Dollars) {
          setStxPrice(data.stxPrice)
          setStxAmountFor2Dollars(data.stxAmountFor2Dollars)
        }
      } catch (error) {
        console.error('Error fetching STX price:', error)
      }
    }

    fetchStxPrice()
    // Refresh price every 5 minutes
    const interval = setInterval(fetchStxPrice, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch network fee dynamically
  useEffect(() => {
    const fetchNetworkFee = async () => {
      try {
        // Hiro API for fee estimation (mainnet/testnet)
        const feeApi = IS_TESTNET
          ? 'https://api.testnet.hiro.so/extended/v1/fee_rates'
          : 'https://api.hiro.so/extended/v1/fee_rates';
        const res = await fetch(feeApi);
        const data = await res.json();
        // Use the "standard" fee for contract calls (in microSTX)
        if (data && data.stacks && data.stacks.standard) {
          setNetworkFee(Number(data.stacks.standard) / 1_000_000); // Convert microSTX to STX
        }
      } catch (e) {
        // fallback to default
        setNetworkFee(0.003);
      }
    };
    fetchNetworkFee();
  }, []);

  const handleConnect = () => {
    setShowWalletPopup(true)
  }

  const connectWallet = async (walletName: string) => {
    setError("")

    try {
      if (walletName === "OKX Wallet") {
        if (!window.okxwallet) {
          toast.error("OKX Wallet is not installed")
          return
        }

        await window.okxwallet.stacks.connect()
        const addresses = await window.okxwallet.stacks.getAddresses()
        if (addresses && addresses.length > 0) {
          connect()
          setShowWalletPopup(false)
          toast.success("OKX Wallet connected successfully!")
        }
      } else if (walletName === "Leather") {
        if (!window.LeatherProvider) {
          toast.error("Leather wallet is not installed")
          return
        }

        try {
          const accounts = await window.LeatherProvider.request('getAddresses')
          if (accounts && accounts.length > 0) {
            connect()
            setShowWalletPopup(false)
            toast.success("Wallet connected successfully!")
          }
        } catch (err) {
          console.error('Error connecting to Leather:', err)
          toast.error("Failed to connect to Leather wallet")
        }
      } else if (walletName === "Xverse") {
        try {
          const response = await request('wallet_connect', {
            message: "Connect to STACK.SATS"
          })
          if (response.status === 'success' && response.result?.addresses) {
            const stacksAddressItem = response.result.addresses.find(
              (address: any) => address.addressType === 'stacks'
            )
            
            if (stacksAddressItem) {
              connect()
              setShowWalletPopup(false)
              toast.success("Xverse wallet connected successfully!")
            }
          }
        } catch (err) {
          console.error('Error connecting to Xverse:', err)
          toast.error("Failed to connect to Xverse")
        }
      } else if (walletName === "Orange Wallet") {
        try {
          const response = await request("getAddresses", {
            purposes: ["payment"] as any[], // Cast to any array to avoid type issues
            message: "Connect to STACK.SATS"
          })

          if (response.status === "success") {
            const paymentAddress = response.result.addresses.find(
              (addr: any) => addr.purpose === "payment"
            )
            
            if (paymentAddress) {
              connect()
              setShowWalletPopup(false)
              toast.success("Orange Wallet connected successfully!")
            } else {
              throw new Error('No payment address found')
            }
          }
        } catch (err) {
          console.error('Error connecting to Orange Wallet:', err)
          toast.error("Failed to connect to Orange Wallet")
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err)
      toast.error("Failed to connect wallet")
      setSelectedWallet(null)
    }
  }

  const handleDisconnect = async () => {
    try {
      if (selectedWallet === 'Leather' && window.LeatherProvider) {
        await window.LeatherProvider.request('disconnect')
      }
      
      disconnect()
      setSelectedWallet(null)
      toast.success("Wallet disconnected")
    } catch (err) {
      console.error('Error disconnecting wallet:', err)
      toast.error("Error disconnecting wallet")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Launch initiated', { isConnected, walletAddress, selectedWallet })

    if (!isConnected || !walletAddress) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!selectedWallet) {
      toast.error("No wallet selected")
      return
    }

    setIsLaunching(true)
    setError(null)

    try {
      console.log('Form data:', formData)
      console.log('STX amount for $2:', stxAmountFor2Dollars)

      let imageUrl = formData.tokenImage
      if (typeof formData.tokenImage !== 'string') {
        console.log('Uploading image...')
        const uploadFormData = new FormData()
        uploadFormData.append('file', formData.tokenImage)

        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: uploadFormData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const { url } = await uploadResponse.json()
        console.log('Image uploaded successfully:', url)
        imageUrl = url
      }

      console.log('Sending token data to backend...')
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenName: formData.tokenName,
          tokenSymbol: formData.tokenSymbol,
          description: formData.description,
          website: formData.website,
          twitter: formData.twitter,
          telegram: formData.telegram,
          tokenImage: imageUrl,
          walletAddress,
          initialPurchase: formData.devTokens ? parseInt(formData.devTokens) : 0
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Backend error:', errorData)
        throw new Error(errorData.error || 'Failed to launch token')
      }

      const { contractCallParams, tokenData } = await response.json()
      console.log('Contract call params:', contractCallParams)
      console.log('Token data:', tokenData)

      let txId: string | undefined
      
      if (selectedWallet === "Xverse") {
        const txOptions = {
          contract: `${contractCallParams.contractAddress}.${contractCallParams.contractName}`,
          functionName: contractCallParams.functionName,
          functionArgs: [
            uintCV(parseInt(formData.devTokens || '0')), // initial-purchase (must be uint)
            stringAsciiCV(formData.tokenName.slice(0, 32)), // name (max 32 bytes)
            stringAsciiCV(formData.tokenSymbol.slice(0, 8)), // symbol (max 8 bytes)
            stringAsciiCV(formData.description || 'No description provided'), // description (must not be empty)
            stringAsciiCV(formData.website || ''), // website
            stringAsciiCV(formData.twitter || ''), // twitter
            stringAsciiCV(formData.telegram || ''), // telegram
            stringAsciiCV(typeof formData.tokenImage === 'string' ? formData.tokenImage : '') // logo-url
          ].map(cvToHex),
          postConditionMode: "allow" as const,
          postConditions: [
            `(stx-transfer? ${2450000} '${contractCallParams.contractAddress})` // Launch fee of 2.45 STX
          ]
        }

        console.log('Raw function args:', [
          parseInt(formData.devTokens || '0'),
          formData.tokenName.slice(0, 32),
          formData.tokenSymbol.slice(0, 8),
          formData.description || 'No description provided',
          formData.website || '',
          formData.twitter || '',
          formData.telegram || '',
          typeof formData.tokenImage === 'string' ? formData.tokenImage : ''
        ])

        console.log('Hex function args:', txOptions.functionArgs)

        console.log('Calling contract...')

        const response = await request('stx_callContract', txOptions)
        console.log('Contract call response:', response)
        
        if (response.status === 'success') {
          if (typeof response.result === 'string') {
            txId = response.result
          } else if (response.result && typeof response.result.txid === 'string') {
            txId = response.result.txid
          }
          console.log('Transaction ID:', txId)
          toast.success("Transaction signed successfully!")
        } else {
          console.error('Contract call failed:', response)
          throw new Error(response.error?.message || "Failed to sign transaction")
        }
      } else if (selectedWallet === "Leather") {
        const functionArgs = [
          stringAsciiCV(formData.tokenName.slice(0, 32)), // name (max 32 bytes)
          stringAsciiCV(formData.tokenSymbol.slice(0, 8)), // symbol (max 8 bytes)
          uintCV(21000000 * 2500000), // market-cap (total supply * 2500000)
          uintCV(2500000), // stx-price (microSTX per token)
          uintCV(formData.devTokens ? parseInt(formData.devTokens) : 0) // creator-allocated-tokens
        ];

        const txOptions = {
          contract: `${contractCallParams.contractAddress}.${contractCallParams.contractName}`,
          functionName: contractCallParams.functionName,
          functionArgs: functionArgs.map(cvToHex),
          postConditionMode: "allow" as const,
          postConditions: [
            `(stx-transfer? ${stxAmountFor2Dollars ? stxAmountFor2Dollars * 1000000 : 0} '${contractCallParams.contractAddress})`
          ]
        };

        let transactionCompleted = false;
        txId = await new Promise<string | undefined>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            if (!transactionCompleted) {
              reject(new Error('Transaction signing timed out after 2 minutes'));
            }
          }, 120000);

          window.LeatherProvider!.request("stx_callContract", txOptions)
            .then((response) => {
              transactionCompleted = true;
              clearTimeout(timeoutId);
              if (!response.result?.txid) {
                reject(new Error('Transaction completed but no txid received'));
                return;
              }
              toast.success("Transaction signed successfully!");
              resolve(response.result.txid);
            })
            .catch((error) => {
              transactionCompleted = true;
              clearTimeout(timeoutId);
              reject(error);
            });
        });
      } else {
        throw new Error(`Wallet ${selectedWallet} not supported yet`)
      }

      if (!txId) {
        throw new Error('Failed to get transaction ID')
      }

      const explorerUrl = IS_TESTNET ? TESTNET_EXPLORER : MAINNET_EXPLORER
      console.log('Transaction submitted:', `${explorerUrl}/txid/${txId}`)
      toast.success(`Token ${formData.tokenName} launch initiated!`, {
        description: (
          <div>
            <p>Transaction ID: {txId}</p>
            <a 
              href={`${explorerUrl}/txid/${txId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on Explorer
            </a>
          </div>
        )
      })

      setFormData({
        tokenName: "",
        tokenSymbol: "",
        totalSupply: "21000000",
        devTokens: "",
        description: "",
        website: "",
        twitter: "",
        telegram: "",
        tokenImage: "",
      })

      const checkTxStatus = async () => {
        try {
          const response = await fetch(`${explorerUrl}/extended/v1/tx/${txId}`)
          const data = await response.json()
          
          if (data.tx_status === 'success') {
            router.push(`/token/${tokenData.symbol.toLowerCase()}`)
          } else if (data.tx_status === 'pending') {
            setTimeout(checkTxStatus, 5000)
          }
        } catch (error) {
          console.error('Error checking transaction status:', error)
        }
      }

      setTimeout(checkTxStatus, 5000)
    } catch (err) {
      console.error('Launch error:', err)
      let errorMessage = 'Unknown error';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'error' in err && err.error && typeof err.error.message === 'string') {
        errorMessage = err.error.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      console.error('Error details:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined
      })
      toast.error("Failed to launch token", {
        description: errorMessage
      })
    } finally {
      setIsLaunching(false)
    }
  }

  const isWalletInstalled = (walletName: string) => {
    if (typeof window === 'undefined') return false;

    if (walletName === "Leather") {
      return !!window.LeatherProvider;
    }
    if (walletName === "Xverse") {
      try {
        const providers = (window as any).btc_providers || [];
        return providers.some(
          (provider: { name: string; id: string }) => 
            provider.name === "Xverse Wallet" || 
            provider.id === "BitcoinProvider"
        );
      } catch {
        return false;
      }
    }
    if (walletName === "OKX Wallet") {
      return typeof window.okxwallet !== 'undefined' && !!window.okxwallet;
    }
    if (walletName === "Orange Wallet") {
      try {
        const providers = (window as any).btc_providers || [];
        return providers.some((provider: { name: string }) => provider.name === "Orange Wallet");
      } catch {
        return false;
      }
    }
    return false;
  };

  const [sortedWallets, setSortedWallets] = useState([
    { 
      name: "Leather",
      icon: "https://cdn.prod.website-files.com/618b0aafa4afde9048fe3926/6515e3a7184e8056bd755b4d_Leather%20Logo%20(1).png"
    },
    { 
      name: "Xverse", 
      icon: "https://cdn.prod.website-files.com/618b0aafa4afde9048fe3926/6482132085c0b4c147b72d4a_uvxAQs60_400x400.png"
    },
    { 
      name: "OKX Wallet", 
      icon: "https://lh3.googleusercontent.com/2bBevW79q6gRZTFdm42CzUetuEKndq4fn41HQGknMpKMF_d-Ae2sJJzgfFUAVb1bJKCBb4ptZ9EAPp-QhWYIvc35yw=s60"
    },
    { 
      name: "Orange Wallet", 
      icon: "https://cdn.prod.website-files.com/618b0aafa4afde9048fe3926/66490df7ec0215d645393709_Orange%20Pill%20Avatar%203D-p-500.png"
    }
  ]);

  useEffect(() => {
    const sortWallets = () => {
      const sorted = [...sortedWallets].sort((a, b) => {
        const aInstalled = isWalletInstalled(a.name);
        const bInstalled = isWalletInstalled(b.name);
        if (aInstalled && !bInstalled) return -1;
        if (!aInstalled && bInstalled) return 1;
        return 0;
      });
      setSortedWallets(sorted);
    };

    sortWallets();
  }, []);

  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        uploadImageToBackend(file);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const uploadImageToBackend = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.url) {
      setFormData(prev => ({ ...prev, tokenImage: data.url }));
    } else {
    }
  };

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
                {IS_TESTNET && (
                  <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                    TESTNET
                  </span>
                )}
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Launch Your Token</h1>
            <p className="text-zinc-400">
              Create and deploy your own token on the Bitcoin Stacks ecosystem in minutes. No approval needed.
              {IS_TESTNET && (
                <span className="block mt-2 text-yellow-500">
                  You are currently on the testnet. All transactions will be made with test STX.
                </span>
              )}
            </p>
          </div>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StacksLogoIcon className="h-6 w-6 text-[#FF5500]" />
                Token Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleLaunch} className="space-y-6">
                <div className="flex items-center gap-4 mb-4 p-3 border border-dashed border-zinc-700 rounded-lg bg-zinc-800/50">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {formData.tokenImage ? (
                      <img
                        src={formData.tokenImage}
                        alt="Token logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <StacksLogoIcon className="h-8 w-8 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="tokenImage"
                      className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors inline-block mb-1"
                    >
                      Upload Token Logo*
                    </Label>
                    <Input
                      id="tokenImage"
                      name="tokenImage"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      required
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.size > 500 * 1024) {
                            toast.error("Image too large", {
                              description: "Max size: 500KB"
                            })
                            return
                          }

                          const img = new Image()
                          img.onload = () => {
                            if (img.width !== img.height) {
                              toast.error("Invalid image", {
                                description: "Image must be square"
                              })
                              return
                            }

                            const formData = new FormData()
                            formData.append('file', file)

                            fetch(`${API_BASE_URL}/upload`, {
                              method: 'POST',
                              body: formData
                            })
                              .then(res => {
                                if (!res.ok) {
                                  throw new Error('Upload failed')
                                }
                                return res.json()
                              })
                              .then(data => {
                                if (data.error) {
                                  toast.error("Upload failed", {
                                    description: data.error
                                  })
                                  return
                                }
                                setFormData(prev => ({ ...prev, tokenImage: data.url }))
                                toast.success("Image uploaded successfully")
                              })
                              .catch(err => {
                                console.error('Upload error:', err)
                                toast.error("Upload failed", {
                                  description: err.message || "Please try again"
                                })
                              })
                          }
                          img.src = URL.createObjectURL(file)
                        }
                      }}
                    />
                    <p className="text-xs text-zinc-500">
                      Required: Square image (max 500KB)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-zinc-300 mb-3">Required Information</h3>
                    <div>
                      <Label htmlFor="tokenName" className="text-sm text-zinc-400 mb-1.5 block">
                        Token Name*
                      </Label>
                      <Input
                        id="tokenName"
                        name="tokenName"
                        placeholder="e.g. StackSats"
                        className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                        value={formData.tokenName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tokenSymbol" className="text-sm text-zinc-400 mb-1.5 block">
                        Token Symbol*
                      </Label>
                      <Input
                        id="tokenSymbol"
                        name="tokenSymbol"
                        placeholder="e.g. SATS"
                        className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                        value={formData.tokenSymbol}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalSupply" className="text-sm text-zinc-400 mb-1.5 block">
                        Total Supply
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="totalSupply"
                          name="totalSupply"
                          type="text"
                          value="21,000,000"
                          className="bg-zinc-800 border-zinc-700 text-zinc-400"
                          disabled
                        />
                        <div className="ml-2 text-xs text-[#FF5500]">Fixed</div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">All tokens have a fixed supply of 21 million</p>
                    </div>
                    <div>
                      <Label htmlFor="devTokens" className="text-sm text-zinc-400 mb-1.5 block">
                        Initial STX to Spend
                      </Label>
                      <Input
                        id="devTokens"
                        name="devTokens"
                        type="number"
                        placeholder="e.g. 1.5"
                        className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                        value={formData.devTokens}
                        onChange={handleChange}
                        min="0"
                        step="any"
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        Enter the amount of STX you want to spend to buy tokens during creation.
                      </p>
                      {formData.devTokens && !isNaN(Number(formData.devTokens)) && Number(formData.devTokens) > 0 && (
                        <div className="text-xs text-zinc-400 mt-1">
                          You will receive approximately {(
                            ((Number(formData.devTokens) * 1_000_000) / 199) / 21_000_000 * 100
                          ).toFixed(4)}% of the total supply at 199 microSTX per token.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-lg font-medium text-zinc-300 mb-3">Additional Information</h3>
                    <div>
                      <Label htmlFor="description" className="text-sm text-zinc-400 mb-1.5 block">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Brief description of your token"
                        className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500] min-h-[104px] resize-none"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-sm text-zinc-400 mb-1.5 block">
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="https://"
                        className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="twitter" className="text-sm text-zinc-400 mb-1.5 block">
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          placeholder="@username"
                          className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                          value={formData.twitter}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="telegram" className="text-sm text-zinc-400 mb-1.5 block">
                          Telegram
                        </Label>
                        <Input
                          id="telegram"
                          name="telegram"
                          placeholder="t.me/group"
                          className="bg-zinc-800 border-zinc-700 focus:border-[#FF5500]"
                          value={formData.telegram}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-lg p-5 text-sm mt-8">
                  <div className="flex items-start gap-3">
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
                      className="text-[#FF5500] flex-shrink-0 mt-0.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      <p className="text-zinc-300">
                        Launch fee: {stxAmountFor2Dollars ? stxAmountFor2Dollars.toFixed(4) : '...'} STX ($2)
                      </p>
                      <div className="text-xs text-zinc-400 mt-1">
                        Network fee: <span className="font-bold text-[#FF5500]">{networkFee.toFixed(6)} STX</span>
                      </div>
                      {formData.devTokens && !isNaN(Number(formData.devTokens)) && Number(formData.devTokens) > 0 && (
                        (() => {
                          const initialBuyStx = Number(formData.devTokens);
                          const launchFee = stxAmountFor2Dollars || 0;
                          const total = launchFee + initialBuyStx + networkFee;
                          return (
                            <div className="text-xs text-zinc-400 mt-1">
                              Total: <span className="font-bold text-[#FF5500]">{total.toFixed(6)} STX</span> (Launch fee + Initial buy + Network fee)
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    type="submit"
                    className="bg-[#FF5500] hover:bg-[#E64D00] text-white px-12 py-6 text-lg w-full md:w-auto"
                    disabled={!isConnected || isLaunching || (stxBalance && stxAmountFor2Dollars && Number(stxBalance) < stxAmountFor2Dollars) || false}
                  >
                    {isLaunching ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Launching...
                      </>
                    ) : !isConnected ? (
                      "Connect Wallet to Launch"
                    ) : stxBalance && stxAmountFor2Dollars && Number(stxBalance) < stxAmountFor2Dollars ? (
                      "Insufficient STX Balance"
                    ) : (
                      "Launch Token"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showWalletPopup} onOpenChange={setShowWalletPopup}>
        <DialogContent className="sm:max-w-md bg-[#1A1B1E] border-zinc-800 text-white p-0 gap-0">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Connect Wallet</DialogTitle>
              <p className="text-sm text-zinc-400 mt-2">Select a wallet to connect to STACK.SATS</p>
            </DialogHeader>
          </div>

          <div className="px-3">
            {sortedWallets.map((wallet) => {
              const isInstalled = isWalletInstalled(wallet.name);
              return (
              <div
                key={wallet.name}
                  className={`flex items-center justify-between p-3 hover:bg-[#FF5500]/10 hover:border-[#FF5500] border border-transparent cursor-pointer rounded-lg mb-2 group ${
                    isInstalled ? 'bg-zinc-800/50' : ''
                  }`}
                onClick={() => connectWallet(wallet.name)}
              >
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-black flex items-center justify-center overflow-hidden">
                    {wallet.icon ? (
                      <img 
                        src={wallet.icon} 
                        alt={`${wallet.name} logo`} 
                          className="w-full h-full object-contain"
                      />
                    ) : (
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
                        className="text-[#FF5500]"
                      >
                        <path d="M3 3h18v18H3z"></path>
                        <path d="M3 8h18"></path>
                        <path d="M8 3v18"></path>
                      </svg>
                    )}
                  </div>
                    <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{wallet.name}</span>
                      {isInstalled && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                          Installed
                        </span>
                      )}
                    </div>
                </div>
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
                  className="text-zinc-500 group-hover:text-[#FF5500]"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
              );
            })}
          </div>

          <div className="p-6 pt-4">
            <p className="text-xs text-zinc-500">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </DialogContent>
      </Dialog>

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
