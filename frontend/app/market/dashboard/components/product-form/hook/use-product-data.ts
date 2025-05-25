import React, { useEffect, useState } from "react"
import { googleDriveService } from "@/services/google-drive"
import { ProductDb } from "@/type/product"

export const useProductData = (
  product: ProductDb | undefined, setIsPromotional: React.Dispatch<React.SetStateAction<boolean>>,
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
) => {
  const [loading, setLoading] = useState(true)

  const regularPriceDb = product && product.regularPrice.toString().length === 1
    ? "00.0" + product.regularPrice.toString() :
    product && product.regularPrice.toString().length === 2 ?
      "00." + product.regularPrice.toString() :
      product && product.regularPrice.toString().length === 3 ?
        "0" + product.regularPrice.toString().slice(0, 1) + "." + product.regularPrice.toString().slice(-2) :
        product && product.regularPrice.toString().length >= 4 ?
          product.regularPrice.toString().slice(0, -2) + "." + product.regularPrice.toString().slice(-2) :
          undefined

  const hasPromotion = product && product.promotionExpiration && new Date(product.promotionExpiration).getTime() > new Date().getTime()

  const promotionalPrice = hasPromotion && product.promotionalPrice && product.promotionalPrice.toString().length === 1
    ? "00.0" + product.promotionalPrice.toString() :
    hasPromotion && product.promotionalPrice && product.promotionalPrice.toString().length === 2 ?
      "00." + product.promotionalPrice.toString() :
      hasPromotion && product.promotionalPrice && product.promotionalPrice.toString().length === 3 ?
        "0" + product.promotionalPrice.toString().slice(0, 1) + "." + product.promotionalPrice.toString().slice(-2) :
        hasPromotion && product.promotionalPrice && product.promotionalPrice.toString().length >= 4 ?
          product.promotionalPrice.toString().slice(0, -2) + "." + product.promotionalPrice.toString().slice(-2) :
          undefined

  const promotion = hasPromotion ? {
    promotionalPrice: promotionalPrice,
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
    loading,
    ...promotion
  }
}
