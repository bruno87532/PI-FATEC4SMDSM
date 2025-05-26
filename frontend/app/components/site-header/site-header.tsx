"use client"

import type React from "react"
import Link from "next/link"
import { Search, User, Crown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { AuthDialog } from "../auth/auth-dialog"
import { useIsLoginOpen } from "@/app/context/is-login-open"
import { useUser } from "@/app/context/user-context"
import { UserNav as UserNavAdvertiser } from "@/app/market/dashboard/components/user-nav/user-nav"
import { UserNav as UserNavUser } from "@/app/profile/settings/components/user-nav/user-nav"
import { SideMenuCart } from "../side-menu-cart/side-menu-cart"
import { useSearch } from "@/app/context/search-context"

export const SiteHeader = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { user, setUser } = useUser()
  const { isLoginOpen, setIsLoginOpen } = useIsLoginOpen()
  const { search, setSearch } = useSearch()

  const handleSearch = (e: React.FormEvent) => {
    setSearch(searchQuery)
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
            aria-label="Página inicial do PI4DSM"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            PI4DSM
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <Input
                type="search"
                placeholder="Busque por produtos, mercados ou categorias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
                aria-label="Campo de pesquisa"
              />
              {searchQuery && (
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 rounded-lg"
                >
                  Buscar
                </Button>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Premium Button */}
            <Link href="/payments" className={`shrink-0 ${!user || user?.advertiserName ? "invisible" : ""}`}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold rounded-xl px-4"
              >
                <Crown className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Seja Premium</span>
                <span className="sm:hidden">Premium</span>
              </Button>
            </Link>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl hover:bg-gray-100"
              aria-label="Pesquisar"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User Account */}
            {!user ? (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100" aria-label="Fazer login">
                    <User className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <AuthDialog />
              </Dialog>
            ) : (
              <div className="ml-auto flex items-center space-x-4">
                {user.advertiserName ? <UserNavAdvertiser /> : <UserNavUser />}
              </div>
            )}

            {/* Cart */}
            <SideMenuCart />
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            <Input
              type="search"
              placeholder="Busque por produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
              aria-label="Campo de pesquisa mobile"
            />
          </div>
        </form>
      </div>
    </header>
  )
}
