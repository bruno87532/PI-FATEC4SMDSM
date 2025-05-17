"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const DashboardNav = () => {
  const pathname = usePathname()

  const navitems = [
    {
      title: "Produtos",
      href: "/market/dashboard/products",
      icon: Package,
    },
    {
      title: "Configurações",
      href: "/market/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="grid gap-1 p-4">
      {navitems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn("justify-start", pathname === item.href && "bg-muted font-medium")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}

