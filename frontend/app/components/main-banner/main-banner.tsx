"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/images/padaria.png",
  },
  {
    id: 2,
    image: "/images/acougue.png",
  },
  {
    id: 3,
    image: "/images/flv.png",
  },
]

export function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = slides.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto py-2 relative max-w-6xl">
      <div className="relative rounded-lg overflow-hidden">
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <Image
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt={`Slide ${currentSlide + 1}`}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <Button
          variant="outline"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full p-0 bg-white/80 hover:bg-white"
          onClick={prevSlide}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full p-0 bg-white/80 hover:bg-white"
          onClick={nextSlide}
          aria-label="Próximo slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-3 w-3 rounded-full transition-colors ${i === currentSlide ? "bg-green-600" : "bg-gray-300"}`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
