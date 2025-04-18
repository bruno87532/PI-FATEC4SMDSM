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
    console.log(formData)
    await fetch(this.pathBackend + "/product", {
      credentials: "include",
      method: "POST",
      body: formData
    })
  }
}