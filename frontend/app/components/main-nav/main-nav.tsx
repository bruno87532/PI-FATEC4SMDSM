import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mainContent, categories } from "./content"

export const MainNav = () => {
  const categories = ["Queijos Especiais", "Vinhos", "Bovinos", "Iogurtes", "Café", "Leites", "Azeite", "Aves"]

  return (

    <nav className="border-b bg-white max-w-6xl mx-auto">
      <div className="container mx-auto">
        <div className="flex items-center">
          <div className="flex-none">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  Todos os departamentos
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-max">
                <DropdownMenuLabel>Departamentos</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {mainContent.map((item, index) => {
                  const categoryName: categories = Object.keys(item)[0];
                  const subCategories = item[categoryName];

                  return (
                    <DropdownMenu key={index}>
                      <DropdownMenuTrigger asChild>
                        <DropdownMenuItem className="flex justify-between w-full">
                          {categoryName}
                        </DropdownMenuItem>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>{categoryName}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.entries(subCategories).map(([subName, link]) => (
                          <DropdownMenuItem key={subName} asChild>
                            <p>teste</p>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {/* Categorias centralizadas */}
          <div className="flex-1 flex items-center justify-center gap-6">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/categoria/${category.toLowerCase()}`}
                className="py-4 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Botões direita */}
          <div className="flex-none flex items-center gap-4">
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

