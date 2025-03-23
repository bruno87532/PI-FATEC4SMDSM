import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function MainBanner() {
  return (
    <div className="container mx-auto py-2 relative">
      <div className="relative rounded-lg overflow-hidden">
        <div className="flex items-center bg-gradient-to-r from-purple-800 to-orange-400 rounded-lg">
          <div className="w-1/2 p-8 flex flex-col items-center">
            <div className="relative w-full h-32 md:h-48">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="test"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="w-1/2 p-8 flex flex-col">
            <h2 className="text-xl md:text-3xl font-bold text-blue-900 mb-2">
              Comprar com quem entende.
            </h2>
            <Button className="bg-blue-900 hover:bg-blue-800 text-white rounded-full px-6 py-2 mt-4 self-start">
              Aproveite
            </Button>
            <div className="flex gap-4 mt-6">
              <Image src="/placeholder.svg?height=40&width=40" alt="Marca 1" width={40} height={40} />
              <Image src="/placeholder.svg?height=40&width=40" alt="Marca 2" width={40} height={40} />
              <Image src="/placeholder.svg?height=40&width=40" alt="Marca 3" width={40} height={40} />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full p-0 bg-white/80"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full p-0 bg-white/80"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-1 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-2 w-2 rounded-full ${i === 0 ? "bg-green-600" : "bg-gray-300"}`} />
        ))}
      </div>
    </div>
  )
}

