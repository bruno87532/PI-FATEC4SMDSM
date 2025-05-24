"use client"

import type React from "react"

import Link from "next/link"
import { Search, User, Crown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { AuthDialog } from "../auth/auth-dialog"
import { SideMenuCart } from "../side-menu-cart/side-menu-cart"
import { useIsLoginOpen } from "@/app/context/is-login-open"
import { useSearch } from "@/app/context/search-context"
import { useUser } from "@/app/context/user-context"
import { UserNav as UserNavAdvertiser } from "@/app/market/dashboard/components/user-nav/user-nav"
import { UserNav as UserNavUser } from "@/app/profile/settings/components/user-nav/user-nav"

export const SiteHeader = () => {
  const { user, setUser } = useUser()
  const { isLoginOpen, setIsLoginOpen } = useIsLoginOpen()
  const [searchQuery, setSearchQuery] = useState("")
  const { search, setSearch } = useSearch()

  const handleSearch = (e: React.FormEvent) => {
    setSearch(searchQuery)
    e.preventDefault()
    if (searchQuery.trim()) {
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center font-extrabold text-lg hover:opacity-80 transition-opacity"
            aria-label="Página inicial do PI4DSM"
          >
            PI4DSM
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <button type="submit" className="absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </button>
              <Input
                type="search"
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
                aria-label="Campo de pesquisa"
              />
            </div>
          </form>


          <div className="flex items-center gap-2">
            <Link href="/payments" className={`shrink-0 ${!user || user?.advertiserName ? 'invisible' : ''}`}>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-700 hover:from-green-600 hover:to-green-700 shadow-md transition-all duration-200 font-semibold"
              >
                <Crown className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Seja Premium</span>
                <span className="sm:hidden">Premium</span>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Pesquisar">
              <Search className="h-5 w-5" />
            </Button>

            {
              !user ? (
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Fazer login ou acessar conta">
                      <User className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <AuthDialog />
                </Dialog>
              ) : (
                <div className="ml-auto flex items-center space-x-4">
                  {
                    user.advertiserName ? (
                      <UserNavAdvertiser />
                    ) : (
                      <UserNavUser />
                    )
                  }
                </div>
              )
            }

            <SideMenuCart />
          </div>
        </div>

        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
              aria-label="Campo de pesquisa mobile"
            />
          </div>
        </form>
      </div>
    </header>
  )
}
