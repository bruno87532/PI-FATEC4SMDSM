import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { ShoppingCart, User } from "lucide-react"

export const SiteHeader = () => {
  return (
    <header className="w-full border-b max-w-6xl mx-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center font-extrabold text-lg">
            PI4DSM
          </Link>

          {/* Location Selector */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">Retire em:</span>
            <Button variant="ghost" className="text-green-600">
              Campinas - Betânia (19)
            </Button>
            <span className="ml-2">Frete: R$ 0,00</span>
          </div>

          {/* Search Bar */}
          <div className="flex flex-1 max-w-xl items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Busque por voz, ou usando vírgula, ex.: leite, tomate, banana"
                className="w-full pl-4 pr-10"
              />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

