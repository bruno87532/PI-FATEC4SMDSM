import React, { useEffect, useState } from "react"
import { googleDriveService } from "@/services/google-drive"
import { ProductDb } from "@/type/product"

export const useProductData = (product: ProductDb | undefined, setIsPromotional: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [file, setFile] = useState<File | undefined>()
  const [loading, setLoading] = useState(true)

  const regularPriceDb = product
    ? ((product.regularPrice % 100) === 0
      ? product.regularPrice.toString() + ".00"
      : (product.regularPrice % 100) < 10
        ? product.regularPrice.toString().slice(0, -2) + ".0" + product.regularPrice.toString().slice(-1)
        : product.regularPrice.toString().slice(0, -2) + "." + product.regularPrice.toString().slice(-2))
    : undefined

  const hasPromotion = product && product.promotionExpiration && new Date(product.promotionExpiration).getTime() > new Date().getTime()
  const promotion = hasPromotion ? {
    promotionalPrice: product.promotionalPrice,
    promotionStart: product.promotionStart,
    promotionExpiration: product.promotionExpiration
  } : {}
  useEffect(() => {
    if (hasPromotion) {
      setIsPromotional(true)
    } else {
      setIsPromotional(false)
    }
  }, [hasPromotion, setIsPromotional])

  const categoryDb = product?.categorys.map(c => c.id)
  const subCategoryDb = product?.subCategorys.map(c => c.id)

  useEffect(() => {
    const getImage = async () => {
      if (product) {
        const file = await googleDriveService.getImageFromGoogleDrive(product.idDrive)
        setFile(file)
      }
      setLoading(false)
    }
    getImage()
  }, [product])

  return {
    regularPriceDb,
    categoryDb,
    subCategoryDb,
    file,
    loading,
    ...promotion
  }
}
