"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Package, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const DashboardNav = () => {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Painel",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Produtos",
      href: "/dashboard/produtos",
      icon: Package,
    },
    {
      title: "Estatísticas",
      href: "/dashboard/estatisticas",
      icon: BarChart3,
    },
    {
      title: "Configurações",
      href: "/dashboard/configuracoes",
      icon: Settings,
    },
  ]

  return (
    <nav className="grid gap-1 p-4">
      {navItems.map((item) => (
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

