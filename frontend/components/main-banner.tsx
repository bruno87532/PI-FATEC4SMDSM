"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
    {
        id: 1,
        image: "/placeholder.svg?height=200&width=300",
        title: "Comprar com quem entende.",
        brands: [
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
        ],
    },
    {
        id: 2,
        image: "/placeholder.svg?height=200&width=300",
        title: "Ofertas exclusivas para você.",
        brands: [
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
        ],
    },
    {
        id: 3,
        image: "/placeholder.svg?height=200&width=300",
        title: "Produtos de alta qualidade.",
        brands: [
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
        ],
    },
    {
        id: 4,
        image: "/placeholder.svg?height=200&width=300",
        title: "Entrega rápida e segura.",
        brands: [
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
        ],
    },
    {
        id: 5,
        image: "/placeholder.svg?height=200&width=300",
        title: "Atendimento personalizado.",
        brands: [
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
        ],
    },
    {
        id: 6,
        image: "/placeholder.svg?height=200&width=300",
        title: "Garantia estendida.",
        brands: [
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
        ],
    },
    {
        id: 7,
        image: "/placeholder.svg?height=200&width=300",
        title: "Parcele em até 12x.",
        brands: [
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
        ],
    },
    {
        id: 8,
        image: "/placeholder.svg?height=200&width=300",
        title: "Frete grátis para todo o Brasil.",
        brands: [
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
            "/placeholder.svg?height=40&width=40",
        ],
    },
]

export function MainBanner() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const totalSlides = slides.length

    // Função para ir para o próximo slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
    }

    // Função para ir para o slide anterior
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
    }

    // Função para ir para um slide específico
    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    // Funcionalidade de deslizamento automático
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide()
        }, 5000) 

        return () => clearInterval(interval) 
    }, [])

    return (
        <div className="container mx-auto py-2 relative max-w-6xl">
            <div className="relative rounded-lg overflow-hidden">
                <div className="flex items-center bg-gradient-to-r from-purple-800 to-orange-400 rounded-lg">
                    <div className="w-1/2 p-8 flex flex-col items-center">
                        <div className="relative w-full h-32 md:h-48">
                            <Image
                                src={slides[currentSlide].image || "/placeholder.svg"}
                                alt="Banner image"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <div className="w-1/2 p-8 flex flex-col">
                        <h2 className="text-xl md:text-3xl font-bold text-blue-900 mb-2">{slides[currentSlide].title}</h2>
                        <Button className="bg-blue-900 hover:bg-blue-800 text-white rounded-full px-6 py-2 mt-4 self-start">
                            Aproveite
                        </Button>
                        <div className="flex gap-4 mt-6">
                            {slides[currentSlide].brands.map((brand, index) => (
                                <Image
                                    key={index}
                                    src={brand || "/placeholder.svg"}
                                    alt={`Marca ${index + 1}`}
                                    width={40}
                                    height={40}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full p-0 bg-white/80"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="outline"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full p-0 bg-white/80"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${i === currentSlide ? "bg-green-600" : "bg-gray-300"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
