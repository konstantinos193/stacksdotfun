import type React from "react"
import "@/app/globals.css"
import { Inter, Space_Grotesk } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/WalletProvider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

export const metadata = {
  title: "STACK.SATS - BTC Stacks Trading Platform",
  description: "Trade and discover tokens on the Bitcoin Stacks ecosystem",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-black text-white font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <WalletProvider>
          {children}
            <Toaster 
              position="bottom-right"
              expand={true}
              richColors
              theme="dark"
              toastOptions={{
                style: {
                  background: '#1A1B1E',
                  border: '1px solid #27272A',
                  padding: '16px',
                  fontSize: '14px',
                  width: '400px'
                },
                className: 'my-toast-class',
                duration: 5000,
              }}
            />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
