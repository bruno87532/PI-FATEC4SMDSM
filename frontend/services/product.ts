import { ApiError } from "@/type/error";
import { ProductDb } from "@/type/product";
import { CreateOrUpdateProduct } from "@/type/product";

export class productService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async createProduct(data: CreateOrUpdateProduct) {
    const formData = this.buildProductFormData(data)
    try {
      const res = await fetch(this.pathBackend + "/product", {
        credentials: "include",
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const error = await res.json()
        throw new ApiError(error.message || "An error ocurred while creating product")
      }

    } catch (error) {
      console.error("An error ocurred while creating product", error)
      throw error
    }
  }

  static async csv(file: File) {
    try {
      const formData = new FormData()
      formData.append("file", file)
      await fetch(this.pathBackend + "/product/csv", {
        credentials: "include",
        method: "POST",
        body: formData
      })

    } catch (error) {
      console.error("An error ocurred while uploading csv", error)
      throw error
    }
  }

  static async updateProduct(data: CreateOrUpdateProduct, id: string) {
    try {
      const formData = this.buildProductFormData(data)
      const res = await fetch(this.pathBackend + "/product/me/" + id, {
        credentials: "include",
        method: "PUT",
        body: formData
      })


      if (!res.ok) {
        const error = await res.json()
        throw new ApiError(error.message || "An error ocurred while creating product")
      }

    } catch (error) {
      console.error("An error ocurred while updating product", error)
      throw error
    }
  }

  private static buildProductFormData(data: CreateOrUpdateProduct) {
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
    return formData
  }

  static async getProducts(page = 1, limit = 20, partialName = ""): Promise<ProductDb[]> {
    const res = await fetch(
      `${this.pathBackend}/product/me?page=${page}&limit=${limit}${partialName ? `&partialName=${partialName}`: ""}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    return res.json();
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

  static async getProductById(id: string): Promise<ProductDb> {
    const res = await fetch(this.pathBackend + "/product/me/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    return await res.json()
  }

  static async getProductsByIds(ids: string[]): Promise<ProductDb[]> {
    try {
      const res = await fetch(this.pathBackend + "/product/get-products-by-ids", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ ids })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error)
      }

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while fetching products", error)
      throw error
    }
  }
}