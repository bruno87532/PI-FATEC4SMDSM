import type { ReactNode } from "react"
import { DashboardNav } from "./components/dashboard-nav/dashboard-nav"
import { UserNav } from "./components/user-nav/user-nav"

const  DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="font-bold text-xl mr-6">MercadoAnúncios</div>
          <nav className="hidden md:flex flex-1 items-center space-x-4 lg:space-x-6">
            <a href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Painel
            </a>
            <a
              href="/dashboard/produtos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Produtos
            </a>
            <a
              href="/dashboard/estatisticas"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Estatísticas
            </a>
            <a
              href="/dashboard/configuracoes"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Configurações
            </a>
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
  )
}

export default DashboardLayout