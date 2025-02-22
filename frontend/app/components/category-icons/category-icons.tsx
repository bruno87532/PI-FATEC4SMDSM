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
    <div className="py-8 max-w-6xl mx-auto px-4">
      <div className="flex justify-between">
        {categories.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-green-100 p-4">
              <Icon className="h-8 w-8 text-green-600" />
            </div>
            <span className="text-md font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

