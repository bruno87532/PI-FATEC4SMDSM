"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, FilePlus2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const DashboardNav = () => {
  const pathname = usePathname()

  const navitems = [
    {
      title: "Anuncie aqui",
      href: "/payments",
      icon: FilePlus2,
    },
    {
      title: "Configurações",
      href: "/profile/settings",
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

