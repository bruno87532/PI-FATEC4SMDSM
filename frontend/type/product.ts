export interface Product {
  id: string;
  idDrive: string;
  name: string;
  description: string | undefined;
  regularPrice: number;
  promotionalPrice: number | undefined;
  promotionExpiration: Date | undefined;
  promotionStart: Date | undefined;
  stock: number;
}

export interface ProductDb extends Product {
  idUser: string;
  categorys: {
    id: string
  }[];
  subCategorys: {
    id: string
  }[];
}

export interface ProductPage extends Product {
  nameCategories: string[];
  nameSubCategories: string[];
}

export interface CreateOrUpdateProduct {
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
}

export interface ProductFromCart {
  id: string;
  name: string;
  regularPrice: number;
  promotionalPrice?: number;
  promotionExpiration?: Date;
  promotionStart?: Date;
  quantity: number;
}