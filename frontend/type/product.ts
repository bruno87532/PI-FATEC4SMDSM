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