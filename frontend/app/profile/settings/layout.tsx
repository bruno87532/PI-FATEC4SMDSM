"use client"

import { type ReactNode } from "react"
import { DashboardNav } from "./components/dashboard-nav/dashboard-nav"
import { UserNav } from "./components/user-nav/user-nav"
import { UserProvider } from "@/app/context/user-context"
import Link from "next/link"

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-4 md:px-6">
            <div className="font-bold text-xl mr-6">ConfiaMercado</div>
            <nav className="hidden md:flex flex-1 items-center space-x-4 lg:space-x-6">
              <Link
                href="/payments"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Anuncie aqui
              </Link>
              <Link
                href="/profile/settings"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Configurações
              </Link>
            </nav>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-muted/40 md:block">
            <DashboardNav />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </UserProvider>
  )
}

export default DashboardLayout