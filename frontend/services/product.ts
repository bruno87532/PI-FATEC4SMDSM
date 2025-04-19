import { ProductDb } from "@/type/product";

export class productService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async createProduct(data: {
    name: string;
    description?: string;
    regularPrice: string;
    promotionalPrice?: string;
    promotionExpiration?: Date;
    promotionStart?: Date;
    stock: string;
    categorys: string[];
    subCategorys: string[];
    file: File;
  }) {
    const formData = new FormData()
    const keysCategory: (keyof typeof data)[] = ["categorys", "subCategorys"]
    const keys: (keyof typeof data)[] = ["name", "description", "regularPrice", "promotionalPrice", "promotionExpiration", "promotionStart", "stock", "file"]
    for (const key of keysCategory) {
      const arr = data[key] as string[]
      for (let x = 0; x < arr.length; x++) {
        formData.append(key + `[${x}]`, arr[x])        
      }
    }
    for (const key of keys) {
      const value = data[key]
      if (value) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString())
        } 
        else formData.append(key, value as string | Blob)
      }
    }
    await fetch(this.pathBackend + "/product", {
      credentials: "include",
      method: "POST",
      body: formData
    })
  }

  static async getProductsById(): Promise<ProductDb[]> {
    const res = await fetch(this.pathBackend + "/product/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    return await res.json()
  }

  static async deleteProductByIds(ids: string[]) {
    const res = await fetch(this.pathBackend + "/product/delete-many", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ids })
    })

    await res.json()
  }
}