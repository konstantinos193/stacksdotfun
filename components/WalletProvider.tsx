"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { toast } from "sonner"
import { request } from "sats-connect"
import { useRouter } from "next/navigation"
import { supabase } from '@/lib/supabase'

interface Provider {
  name: string;
  id: string;
}

interface StacksWallet {
  connect: () => Promise<any>;
  getAddresses: () => Promise<string[]>;
  disconnect: () => Promise<void>;
}

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  selectedWallet: string | null;
  stxBalance: number;
  profile: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  connect: () => void;
  disconnect: () => void;
  updateProfile: (updates: { username?: string; avatar_url?: string }) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

interface AddressPurpose {
  payment: 'payment';
  ordinals: 'ordinals';
  stacks: 'stacks';
}

interface WalletError extends Error {
  code?: number;
}

declare global {
  interface Window {
    LeatherProvider?: {
      request: (method: string, params?: any) => Promise<any>;
      getAddresses?: () => Promise<string[]>;
    };
    okxwallet?: {
      stacks: StacksWallet;
    };
    btc_providers?: Provider[];
  }
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [stxBalance, setStxBalance] = useState(0);
  const [profile, setProfile] = useState<{ username: string | null; avatar_url: string | null; } | null>(null);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
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
  const didMount = useRef(false);
  const [hasUserConnected, setHasUserConnected] = useState(false);

  // Add effect to fetch STX balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && walletAddress) {
        try {
          const response = await fetch(`/api/balance/${walletAddress}`)
          if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
          }
          const data = await response.json()
          setStxBalance(data.balance)
        } catch (error) {
          console.error('Error fetching balance:', error)
          // Optionally: setStxBalance(0);
        }
      }
    }

    fetchBalance()
  }, [isConnected, walletAddress])

  const connect = () => {
    console.log('[WalletProvider] User clicked Connect Wallet, opening dialog');
    setShowWalletPopup(true);
    setHasUserConnected(true);
  }

  const disconnect = () => {
    setIsConnected(false)
    setWalletAddress(null)
    setSelectedWallet(null)
    setStxBalance(0)
    setProfile(null)
    localStorage.removeItem('wallet')
  }

  const connectWallet = async (walletName: string) => {
    try {
      if (walletName === "Xverse") {
        const w = window as any;
        const hasXverse =
          (w.btc && typeof w.btc === 'object' && typeof w.btc.request === 'function') ||
          (w.btc_providers && Array.isArray(w.btc_providers) && w.btc_providers.some((p: Provider) => p.name?.toLowerCase().includes('xverse')));
        
        if (!hasXverse) {
          toast.error("Xverse wallet is not installed", {
            description: "Please install Xverse wallet to continue",
            action: {
              label: "Install",
              onClick: () => window.open("https://www.xverse.app/download", "_blank")
            }
          });
          return false;
        }

        try {
          const response = await request('wallet_connect', {
            message: "Connect to stacksats.fun"
          });

          if (response.status === 'success' && response.result?.addresses) {
            const stacksAddress = response.result.addresses.find(
              (addr: any) => addr.addressType === 'stacks'
            );
            
            if (stacksAddress) {
              setWalletAddress(stacksAddress.address);
              setSelectedWallet(walletName);
              setIsConnected(true);
              
              localStorage.setItem('wallet', JSON.stringify({
                address: stacksAddress.address,
                walletName
              }));
              
              await createOrFetchProfile(stacksAddress.address);
              return true;
            } else {
              toast.error("No Stacks address found", {
                description: "Please make sure you have a Stacks account in Xverse"
              });
              return false;
            }
          } else {
            toast.error("Failed to connect wallet", {
              description: "Please try again"
            });
            return false;
          }
        } catch (err) {
          const error = err as WalletError;
          if (error.code === 4001) {
            toast.error("Connection rejected", {
              description: "You rejected the connection request"
            });
          } else {
            toast.error("Connection failed", {
              description: error.message || "Please try again"
            });
          }
          return false;
        }
      } else if (walletName === "Leather") {
        if (!window.LeatherProvider) {
          toast.error("Leather wallet is not installed", {
            description: "Please install Leather wallet to continue",
            action: {
              label: "Install",
              onClick: () => window.open("https://leather.io/install", "_blank")
            }
          });
          return false;
        }

        try {
          const response = await window.LeatherProvider.request('getAddresses');
          console.log('Leather getAddresses result:', response);

          let stxAddress: string | undefined;

          if (
            response &&
            typeof response === 'object' &&
            response.result &&
            Array.isArray(response.result.addresses)
          ) {
            const stxAccount = response.result.addresses.find(
              (a: any) => a.symbol === 'STX'
            );
            if (stxAccount) {
              stxAddress = stxAccount.address;
            }
          }

          if (stxAddress) {
            // Set wallet state first
            setWalletAddress(stxAddress);
            setSelectedWallet(walletName);
            
            // Store in localStorage
            localStorage.setItem('wallet', JSON.stringify({
              address: stxAddress,
              walletName
            }));

            // Create/fetch profile
            await createOrFetchProfile(stxAddress);
            
            // Set connected last to prevent verification loop
            setIsConnected(true);
            
            return true;
          } else {
            toast.error("No Stacks address found", {
              description: "Please make sure you have a Stacks account in Leather"
            });
            return false;
          }
        } catch (err) {
          const error = err as WalletError;
          toast.error("Failed to connect Leather", {
            description: error.message || "Please try again"
          });
          return false;
        }
      }
      
      return false;
    } catch (err) {
      const error = err as WalletError;
      console.error('Wallet connection error:', error);
      toast.error("Connection failed", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };

  // Check for stored wallet on mount
  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
      try {
        const { address, walletName } = JSON.parse(storedWallet);
        setWalletAddress(address);
        setSelectedWallet(walletName);
        // DO NOT set isConnected or hasUserConnected here!
        createOrFetchProfile(address);
        console.log('[WalletProvider] Restored wallet from localStorage:', address, walletName);
      } catch (error) {
        console.error('Error restoring wallet:', error);
        localStorage.removeItem('wallet');
      }
    }
  }, []);

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

    if (typeof window !== 'undefined') {
      sortWallets();
    }
  }, []);

  const isWalletInstalled = (walletName: string): boolean => {
    if (typeof window === 'undefined') return false;

    if (walletName === "Leather") {
      return !!window.LeatherProvider;
    }
    if (walletName === "Xverse") {
      try {
        const providers = (window as any).btc_providers || [];
        return providers.some((provider: Provider) => 
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
        return providers.some((provider: Provider) => provider.name === "Orange Wallet");
      } catch {
        return false;
      }
    }
    return false;
  };

  const createOrFetchProfile = async (address: string) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in createOrFetchProfile:', error);
      toast.error('Failed to create profile');
    }
  };

  const handleWalletConnection = async (walletName: string) => {
    try {
      const success = await connectWallet(walletName);
      if (success) {
        setIsConnected(true);
        setShowWalletPopup(false);
        toast.success(`${walletName} connected successfully!`);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      // Reset state
      disconnect();
    }
  };

  const handleDisconnect = async () => {
    try {
      if (selectedWallet === 'Leather' && window.LeatherProvider) {
        await window.LeatherProvider.request('disconnect');
      }
      
      disconnect();
      toast.success("Wallet disconnected");
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      toast.error("Error disconnecting wallet");
    }
  };

  // Update verification effect
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    // Only run if user has explicitly connected
    if (hasUserConnected && isConnected && walletAddress && selectedWallet) {
      const verifyWalletState = async () => {
        if (selectedWallet === 'Leather' && window.LeatherProvider) {
          // This should NOT run unless user has connected
          await window.LeatherProvider.request('getAddresses');
        }
      };
      const timer = setTimeout(verifyWalletState, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasUserConnected, isConnected, walletAddress, selectedWallet]);

  const updateProfile = async (updates: { username?: string; avatar_url?: string }) => {
    try {
      if (!walletAddress) throw new Error('No wallet connected');

      // If there's an avatar file to upload
      if (updates.avatar_url?.startsWith('data:')) {
        // Extract file type from data URL
        const mimeType = updates.avatar_url.split(';')[0].split(':')[1];
        const fileExt = mimeType.split('/')[1];
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${walletAddress}/${fileName}`;

        // Convert data URL to Blob
        const blob = await fetch(updates.avatar_url).then(r => r.blob());

        // Upload new avatar
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, blob, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        updates.avatar_url = publicUrl;

        // Clean up old avatar if it exists
        if (profile?.avatar_url) {
          try {
            const oldUrl = new URL(profile.avatar_url);
            const oldPath = oldUrl.pathname.split('/avatars/')[1];
            if (oldPath) {
              await supabase.storage
                .from('avatars')
                .remove([oldPath]);
            }
          } catch (error) {
            console.log('Error cleaning up old avatar:', error);
          }
        }
      }

      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...(updates.username && { username: updates.username }),
          ...(updates.avatar_url && { avatar_url: updates.avatar_url }),
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', walletAddress)
        .select()
        .single();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to update profile: ' + errorMessage);
      throw err;
    }
  };

  return (
    <WalletContext.Provider 
      value={{
        isConnected,
        walletAddress,
        selectedWallet,
        stxBalance,
        profile,
        connect: () => setShowWalletPopup(true),
        disconnect: handleDisconnect,
        updateProfile,
      }}
    >
      {children}

      {/* Wallet Connection Dialog */}
      <Dialog open={showWalletPopup} onOpenChange={setShowWalletPopup}>
        <DialogContent className="sm:max-w-md bg-[#1A1B1E] border-zinc-800 text-white p-0 gap-0">
          <DialogHeader className="pt-6 pb-2 px-6">
            <DialogTitle className="text-2xl font-bold font-space-grotesk tracking-tight flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              Connect Wallet
            </DialogTitle>
            <DialogDescription className="text-base text-zinc-400 mt-1 font-space-grotesk">
              Select a wallet to connect to <span className="text-[#FF5500] font-bold font-space-grotesk">stacksats.fun</span>
            </DialogDescription>
          </DialogHeader>
          <div className="px-3 pb-2">
            {sortedWallets.map((wallet, idx) => {
              const isInstalled = isWalletInstalled(wallet.name);
              return (
                <div key={wallet.name}>
                  <div
                    className={`flex items-center justify-between py-4 px-3 hover:bg-[#FF5500]/10 hover:border-[#FF5500] border border-transparent cursor-pointer rounded-xl group transition-all duration-150 ${
                      isInstalled ? 'bg-zinc-800/50' : ''
                    }`}
                    onClick={() => handleWalletConnection(wallet.name)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded bg-black flex items-center justify-center overflow-hidden">
                        {wallet.icon ? (
                          <img 
                            src={wallet.icon} 
                            alt={`${wallet.name} logo`} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <img src="/logo.png" alt="Default logo" className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg font-space-grotesk tracking-wide text-white">
                          {wallet.name}
                        </span>
                        {isInstalled && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-400 ml-1 uppercase tracking-wider">
                            Installed
                          </span>
                        )}
                      </div>
                    </div>
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
                      className="text-zinc-500 group-hover:text-[#FF5500] transition-colors"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                  {idx < sortedWallets.length - 1 && (
                    <div className="border-b border-zinc-800 mx-3" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="p-6 pt-4">
            <p className="text-xs text-zinc-500 font-space-grotesk">
              By connecting your wallet, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </WalletContext.Provider>
  );
}

export function WalletButton() {
  const { isConnected, profile, connect, disconnect } = useWallet();
  const router = useRouter();

  if (!isConnected) {
    return (
      <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white" onClick={connect}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-1 sm:px-2 py-1 hover:bg-zinc-800 rounded-full h-9 min-w-0"
        >
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error('Error loading avatar:', e);
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-zinc-800">
                <svg
                  width="16"
                  height="16"
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
          </div>
          <span className="hidden sm:inline text-sm font-medium text-white truncate max-w-[80px] md:max-w-none">
            {profile?.username || 'Set Username'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] sm:w-56 bg-zinc-900 border-zinc-800 mt-1">
        <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-2">
          <Link href="/profile" className="w-full flex items-center">
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
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 py-2">
          <Link href="/profile?tab=referrals" className="w-full flex items-center">
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
            Referrals
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-zinc-800 focus:bg-zinc-800 py-2 w-full flex items-center" 
          onClick={disconnect}
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
            className="mr-2 h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 