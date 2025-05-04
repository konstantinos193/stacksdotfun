import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { StacksLogoIcon, ZapIcon } from "@/components/icons/index"
import Link from "next/link"

interface TokenRowProps {
  rank: number
  name: string
  ticker: string
  price: number
  change24h: number
  change7d: number
  marketCap: number
  volume: number
  holders: number
}

export function TokenRow({
  rank,
  name,
  ticker,
  price,
  change24h,
  change7d,
  marketCap,
  volume,
  holders,
}: TokenRowProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    } else {
      return `${num.toFixed(2)}`
    }
  }

  const formatPrice = (num: number) => {
    return `${num.toFixed(5)}`
  }

  const formatHolders = (num: number) => {
    return num.toLocaleString('en-US')
  }

  return (
    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
      <TableCell className="font-medium">{rank}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#FF5500]/10 text-[#FF5500] flex-shrink-0">
            <StacksLogoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <Link href={`/token/${ticker.toLowerCase()}`} className="hover:text-[#FF5500] transition-colors">
              <div className="font-medium text-sm sm:text-base">{name}</div>
            </Link>
            <div className="text-xs text-zinc-500">{ticker}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm sm:text-base">{formatPrice(price)}</TableCell>
      <TableCell className={`text-right ${change24h >= 0 ? "text-green-500" : "text-red-500"} text-sm sm:text-base`}>
        {change24h >= 0 ? "+" : ""}
        {change24h.toFixed(1)}%
      </TableCell>
      <TableCell className={`text-right ${change7d >= 0 ? "text-green-500" : "text-red-500"} text-sm sm:text-base`}>
        {change7d >= 0 ? "+" : ""}
        {change7d.toFixed(1)}%
      </TableCell>
      <TableCell className="text-right font-mono hidden md:table-cell">{formatNumber(marketCap)}</TableCell>
      <TableCell className="text-right font-mono hidden md:table-cell">{formatNumber(volume)}</TableCell>
      <TableCell className="text-right hidden sm:table-cell">{formatHolders(holders)}</TableCell>
      <TableCell className="text-right">
        <Button size="sm" className="bg-[#FF5500] hover:bg-[#E64D00] text-white h-8 w-8 sm:w-auto sm:px-3">
          <ZapIcon className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline">Buy</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}
