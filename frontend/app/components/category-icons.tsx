import { Heart, PillIcon as Pills, Apple, Beef, Wine, Coffee, Milk, Egg } from "lucide-react"

export const CategoryIcons = () => {
  const categories = [
    { icon: Heart, label: "Saudáveis" },
    { icon: Pills, label: "Vitaminas & Suplementos" },
    { icon: Apple, label: "Hortifruti" },
    { icon: Beef, label: "Açougue" },
    { icon: Wine, label: "Vinhos" },
    { icon: Coffee, label: "Cafés" },
    { icon: Milk, label: "Leites" },
    { icon: Egg, label: "Páscoa" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-8 gap-4">
        {categories.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-green-100 p-4">
              <Icon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

