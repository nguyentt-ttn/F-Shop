// export interface Product {
//   _id: string;
//   name: string;
//   slug?: string;
//   price: number;
//   attributes?: { [key: string]: any }[];
//   image_urls: string[];
//   quantity?: number;
//   description?: string;
//   rating?: number;
//   reviews?: number;
//   category?: Types.ObjectId | string;
//   tags?: string[];
//   sku?: string;
//   status?: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

export interface ProductVariant {
  _id: string;
  productId: string;
  size: string;
  colors: {
    _id: string;
    color: string;
    quantity: number;
  }[];
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  image_urls: string[];
  quantity?: number;
  description?: string;
  rating?: number;
  reviews?: number;
  category?: Types.ObjectId | string;
  tags?: string[];
  sku?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  variants?: ProductVariant[];
}