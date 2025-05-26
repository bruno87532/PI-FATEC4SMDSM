"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/images/padaria.png",
    title: "Produtos Frescos",
    subtitle: "Direto dos melhores mercados",
  },
  {
    id: 2,
    image: "/images/acougue.png",
    title: "Carnes Premium",
    subtitle: "Qualidade garantida",
  },
  {
    id: 3,
    image: "/images/flv.png",
    title: "Frutas & Verduras",
    subtitle: "Sempre frescos e selecionados",
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          {/* Background Image */}
          <Image
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt={`Slide ${currentSlide + 1}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-start p-8 md:p-12">
            <div className="text-white max-w-lg">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{slides[currentSlide].title}</h1>
              <p className="text-lg md:text-xl mb-6 text-gray-200">{slides[currentSlide].subtitle}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="secondary"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full p-0 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={prevSlide}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="secondary"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full p-0 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={nextSlide}
          aria-label="Próximo slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-3 mt-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-3 w-8 rounded-full transition-all duration-300 ${
              i === currentSlide ? "bg-green-600 shadow-lg" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
