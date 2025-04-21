import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { FormItem, FormField, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { Product } from "../../schema/schema";

export const ProductImage: React.FC<{ productForm: UseFormReturn<Product>, image?: File }> = ({ productForm, image }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (image && fileInputRef.current) {
      productForm.setValue("file", image)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(image)
    }
  }, [image])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    productForm.resetField("file")
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label>Imagem do Produto</Label>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative flex h-40 w-full items-center justify-center rounded-md border border-dashed">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain p-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 rounded-full bg-muted"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Arraste uma imagem ou clique para fazer upload
                  </p>
                </div>
              )}
            </div>
            <FormField
              control={productForm.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center items-center">
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="product-image"
                      multiple={false}
                      ref={(el) => {
                        fileInputRef.current = el;
                        field.ref(el);
                      }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          field.onChange(file);
                        } else {
                          field.onChange(undefined)
                        }
                        handleImageUpload(e);
                      }}
                    />

                  </FormControl>
                  <FormLabel htmlFor="product-image" className="cursor-pointer text-sm text-primary hover:underline">Selecionar imagem</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}