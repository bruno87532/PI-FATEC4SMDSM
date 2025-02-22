import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export const MainNav = () => {
  const categories = ["Queijos Especiais", "Vinhos", "Bovinos", "Iogurtes", "Café", "Leites", "Azeite", "Aves"]

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Todos os departamentos
          </Button>

          {categories.map((category) => (
            <Link
              key={category}
              href={`/categoria/${category.toLowerCase()}`}
              className="py-4 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {category}
            </Link>
          ))}

          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" className="flex items-center gap-2">
              <span className="text-sm">Montar Compra</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <span className="text-sm">Minhas listas</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

