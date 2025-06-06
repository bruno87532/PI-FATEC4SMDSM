import React from "react"
import { UseFormReturn } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { maskPrice } from "@/utils/mask-price"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Product } from "../../schema/schema"

interface ProductPromotionProps {
  productForm: UseFormReturn<Product>;
  isPromotional: boolean;
  setIsPromotional: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProductPromotion: React.FC<ProductPromotionProps> = ({ 
  productForm, 
  isPromotional, 
  setIsPromotional,
}) => {

  const onCheckboxChange = (checked: boolean) => {
    setIsPromotional(checked)
    if (checked) {
      productForm.setValue("promotionalPrice", "00.00")
      productForm.setValue("promotionExpiration", new Date())
      productForm.setValue("promotionStart", new Date())
    } else {
      productForm.resetField("promotionExpiration")
      productForm.resetField("promotionStart")
      productForm.resetField("promotionalPrice")
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isPromotional}
              onCheckedChange={
                (checked) => onCheckboxChange(!!checked)
              }
            />
            <div className="space-y-1 leading-none">
              <Label>Produto em promoção</Label>
              <p className="mt-2 text-sm text-muted-foreground">Marque esta opção para definir um preço promocional</p>
            </div>
          </div>

          {isPromotional && (
            <div className="space-y-4 pt-4">
              <FormField
                control={productForm.control}
                name="promotionalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Promocional (R$)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00"
                        onChange={(e) => field.onChange(maskPrice(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="promotionStart"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Início da Promoção</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="bg-white"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={productForm.control}
                  name="promotionExpiration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fim da Promoção</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="bg-white"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}