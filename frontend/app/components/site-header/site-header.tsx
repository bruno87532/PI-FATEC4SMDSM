"use client"

import Link from "next/link"
import { Search, Mic, User, Crown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { AuthDialog } from "../auth/auth-dialog"
import { SideMenuCart } from "../side-menu-cart/side-menu-cart"
import { useIsLoginOpen } from "@/app/context/is-login-open"
import { set } from "date-fns"

export const SiteHeader = () => {
  const { isLoginOpen, setIsLoginOpen } = useIsLoginOpen()

  return (
    <header className="w-full border-b max-w-6xl mx-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-4">
          <Link href="/" className="flex items-center font-extrabold text-lg">
            PI4DSM
          </Link>

          <Link href="/payments" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="bg-green-500 text-white border-2 border-black hover:bg-green-600 shadow-sm"
            >
              <Crown className="h-4 w-4 mr-1.5" />
              Seja Premium
            </Button>
          </Link>

          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-4">
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsLoginOpen(true)} variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <AuthDialog />
            </Dialog>

            <SideMenuCart />
          </div>
        </div>
      </div>
    </header>
  )
}
