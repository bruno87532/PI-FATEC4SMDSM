import Link from "next/link"

const categories = [
    { name: "Dia de Feira", icon: "🥦" },
    { name: "Vitaminas & Suplementos", icon: "💊" },
    { name: "Saudáveis", icon: "🥗" },
    { name: "Açougue", icon: "🥩" },
    { name: "Vinhos", icon: "🍷" },
    { name: "Cafés", icon: "☕" },
    { name: "Leites", icon: "🥛" },
    { name: "Piscos", icon: "🍽️" },
]

export function CategoryNav() {
    return (
        <div className="container mx-auto py-2">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {categories.map((category, index) => (
                    <Link href="#" key={index} className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-2">
                            {category.icon}
                        </div>
                        <span className="text-xs font-medium">{category.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
