export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface Product {
  id: number;
  name: string;
  permalink: string;
  price: string;
  images: ProductImage[];
  description: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: {
    src: string;
  };
}