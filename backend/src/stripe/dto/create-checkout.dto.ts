import { ProductEnum } from "../enum/product.enum";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateCheckoutDto {
    @IsNotEmpty({ message: "The product is required" })
    @IsEnum(ProductEnum, { message: "The product must be BASIC_MONTHLY" })
    product: ProductEnum
}