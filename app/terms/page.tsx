"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("terms")
  const lastUpdated = "April 24, 2024"

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF5500]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <span className="text-xl font-bold">STACK.SATS</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/launch" className="text-zinc-400 hover:text-white transition-colors">
                Launch
              </Link>
              <Link href="/liquidity" className="text-zinc-400 hover:text-white transition-colors">
                Liquidity
              </Link>
              <Link href="/learn" className="text-zinc-400 hover:text-white transition-colors">
                Learn
              </Link>
              <Link href="/terms" className="text-white font-medium transition-colors">
                Legal
              </Link>
            </nav>
            <Button className="bg-[#FF5500] hover:bg-[#E64D00] text-white">Connect Wallet</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Legal Documents</h1>
          <p className="text-zinc-400 mb-8">Last updated: {lastUpdated}</p>

          <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="space-y-8">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
                <p className="text-zinc-300 mb-6">
                  These Terms of Service ("Terms") govern your access to and use of STACK.SATS platform, including any
                  content, functionality, and services offered on or through STACK.SATS ("the Platform"). Please read
                  these Terms carefully before using the Platform.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">1. Acceptance of Terms</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        By accessing or using the Platform, you agree to be bound by these Terms and all applicable laws
                        and regulations. If you do not agree with any of these Terms, you are prohibited from using or
                        accessing the Platform.
                      </p>
                      <p>
                        We may modify these Terms at any time. Your continued use of the Platform following the posting
                        of revised Terms means that you accept and agree to the changes.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">2. Eligibility</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        You must be at least 18 years old to use the Platform. By using the Platform, you represent and
                        warrant that you are at least 18 years old and have the legal capacity to enter into these
                        Terms.
                      </p>
                      <p>
                        The Platform is not available to users in jurisdictions where cryptocurrency trading is
                        prohibited or restricted. It is your responsibility to ensure that your use of the Platform
                        complies with applicable laws in your jurisdiction.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">3. User Accounts</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        To access certain features of the Platform, you may need to connect your cryptocurrency wallet.
                        You are responsible for maintaining the security of your wallet and all activities that occur
                        through your account.
                      </p>
                      <p className="mb-4">
                        You agree to immediately notify us of any unauthorized use of your account or any other breach
                        of security. We will not be liable for any loss or damage arising from your failure to comply
                        with this section.
                      </p>
                      <p>You are solely responsible for all content and activity that occurs under your account.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">4. Platform Services</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        STACK.SATS provides a platform for trading and launching tokens on the Stacks blockchain. The
                        Platform facilitates transactions between users but does not itself buy, sell, or exchange
                        cryptocurrencies.
                      </p>
                      <p className="mb-4">
                        We reserve the right to modify, suspend, or discontinue any part of the Platform at any time
                        without notice.
                      </p>
                      <p>
                        The Platform may include fees for certain services, which will be clearly disclosed before you
                        incur any charges.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">5. User Conduct</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">You agree not to:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Use the Platform for any illegal purpose or in violation of any laws</li>
                        <li>Manipulate or disrupt the Platform or servers</li>
                        <li>Attempt to gain unauthorized access to any part of the Platform</li>
                        <li>Use the Platform to transmit harmful code or malware</li>
                        <li>Engage in market manipulation or fraudulent activities</li>
                        <li>Impersonate any person or entity</li>
                        <li>Harass, abuse, or harm another person</li>
                      </ul>
                      <p>
                        We reserve the right to terminate or suspend your access to the Platform for violations of these
                        Terms.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">6. Risks and Disclaimers</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        Cryptocurrency trading involves significant risks. You acknowledge and agree that:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Cryptocurrency prices are highly volatile</li>
                        <li>Trading cryptocurrencies may result in partial or total loss of funds</li>
                        <li>Blockchain transactions are irreversible</li>
                        <li>Technical issues may affect the Platform's functionality</li>
                        <li>Regulatory changes may impact cryptocurrency trading</li>
                      </ul>
                      <p>
                        You are solely responsible for evaluating the risks associated with using the Platform and
                        trading cryptocurrencies.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">7. Limitation of Liability</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        To the maximum extent permitted by law, STACK.SATS and its affiliates, officers, directors,
                        employees, and agents shall not be liable for any indirect, incidental, special, consequential,
                        or punitive damages, including loss of profits, data, or goodwill, arising out of or in
                        connection with your use of the Platform.
                      </p>
                      <p>
                        Our total liability for all claims related to the Platform shall not exceed the greater of $100
                        or the amount you paid to us in the past six months.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">8. Governing Law</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p>
                        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
                        in which STACK.SATS is registered, without regard to its conflict of law provisions. Any
                        disputes arising under these Terms shall be resolved exclusively in the courts of that
                        jurisdiction.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">9. Contact Information</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p>If you have any questions about these Terms, please contact us at legal@stacksats.com.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-8">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                <p className="text-zinc-300 mb-6">
                  This Privacy Policy describes how STACK.SATS ("we", "our", or "us") collects, uses, and shares your
                  personal information when you use our platform.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="privacy-1" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">1. Information We Collect</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">We collect the following types of information:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Wallet addresses and transaction data</li>
                        <li>Usage data and platform interactions</li>
                        <li>Device information and IP addresses</li>
                        <li>Information you provide when contacting support</li>
                      </ul>
                      <p>
                        We do not collect traditional personally identifiable information like names or email addresses
                        unless you voluntarily provide them.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="privacy-2" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">2. How We Use Your Information</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">We use your information to:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Provide and improve our services</li>
                        <li>Process transactions and maintain records</li>
                        <li>Detect and prevent fraud and security issues</li>
                        <li>Comply with legal obligations</li>
                        <li>Communicate with you about the platform</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="privacy-3" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">3. Information Sharing</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">We may share your information with:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Service providers who help us operate the platform</li>
                        <li>Legal authorities when required by law</li>
                        <li>Other parties in connection with a merger or acquisition</li>
                      </ul>
                      <p>We do not sell your personal information to third parties.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="privacy-4" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">4. Data Security</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        We implement appropriate technical and organizational measures to protect your information.
                        However, no method of transmission over the Internet or electronic storage is 100% secure.
                      </p>
                      <p>
                        You are responsible for maintaining the security of your wallet and private keys. We will never
                        ask for your private keys or seed phrases.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="privacy-5" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">5. Your Rights</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        Depending on your location, you may have certain rights regarding your personal information,
                        including:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Access to your personal information</li>
                        <li>Correction of inaccurate information</li>
                        <li>Deletion of your information</li>
                        <li>Restriction of processing</li>
                        <li>Data portability</li>
                      </ul>
                      <p>To exercise these rights, please contact us at privacy@stacksats.com.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="cookies" className="space-y-8">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">Cookie Policy</h2>
                <p className="text-zinc-300 mb-6">
                  This Cookie Policy explains how STACK.SATS uses cookies and similar technologies on our platform.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="cookies-1" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">1. What Are Cookies</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        Cookies are small text files that are stored on your device when you visit a website. They are
                        widely used to make websites work more efficiently and provide information to the website
                        owners.
                      </p>
                      <p>
                        We use both session cookies (which expire when you close your browser) and persistent cookies
                        (which remain on your device for a set period or until you delete them).
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cookies-2" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">2. Types of Cookies We Use</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">We use the following types of cookies:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>
                          <strong>Essential cookies:</strong> Necessary for the platform to function properly
                        </li>
                        <li>
                          <strong>Functional cookies:</strong> Enable enhanced functionality and personalization
                        </li>
                        <li>
                          <strong>Analytics cookies:</strong> Help us understand how users interact with our platform
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cookies-3" className="border-zinc-800">
                    <AccordionTrigger className="text-lg font-medium">3. Managing Cookies</AccordionTrigger>
                    <AccordionContent className="text-zinc-300">
                      <p className="mb-4">
                        Most web browsers allow you to control cookies through their settings. You can typically:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Delete all cookies from your browser</li>
                        <li>Block all cookies or only third-party cookies</li>
                        <li>Configure your browser to notify you when cookies are set</li>
                      </ul>
                      <p>Please note that restricting cookies may impact the functionality of our platform.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>

          <div className="border-t border-zinc-800 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-zinc-400">Have questions about our legal documents?</p>
              </div>
              <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF5500]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-white"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">STACK.SATS</span>
              </div>
              <p className="text-zinc-400 mb-4">
                The premier platform for trading and launching tokens on the Stacks blockchain.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/launch" className="text-zinc-400 hover:text-white transition-colors">
                    Launch
                  </Link>
                </li>
                <li>
                  <Link href="/liquidity" className="text-zinc-400 hover:text-white transition-colors">
                    Liquidity
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="text-zinc-400 hover:text-white transition-colors">
                    Learn
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab("terms")}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("privacy")}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("cookies")}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-500">
            <p>© {new Date().getFullYear()} STACK.SATS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
