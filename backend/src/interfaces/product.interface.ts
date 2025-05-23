export interface Product {
  name: string;
  description?: string;
  regularPrice: number;
  promotionalPrice?: number;
  promotionExpiration?: Date;
  promotionStart?: Date;
  stock: number;
};
