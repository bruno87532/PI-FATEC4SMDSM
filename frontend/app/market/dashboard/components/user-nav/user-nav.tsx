"use client"

import { LogOut, Settings, Package } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/app/context/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authService } from "@/services/auth"
import { useRouter } from "next/navigation"

export const UserNav = () => {
  const { user, setUser } = useUser()
  const router = useRouter()
  
  const handleClick = async () => {
    await authService.logout()
    setUser(null)
    window.location.href = "/"
  }
  
  let avatar = ""
  if (user) {
    if (!user) throw new Error("user is required")
    const nameSplit = user?.advertiserName ? user?.advertiserName.split(" ") : ""
    if (nameSplit.length > 1) {
      avatar = nameSplit[0][0] + nameSplit[nameSplit.length - 1][0]
    } else {
      avatar = nameSplit[0][0]
    }
    avatar.toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>{avatar}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.advertiserName}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Package className="mr-2 h-4 w-4" />
            <Link href="/market/dashboard/products">Produtos</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/market/dashboard/settings">Configurações</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClick}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

