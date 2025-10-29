import React from 'react';

// types.ts

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string; // e.g., "Color" or "Size"
  options: string[]; // e.g., ["Black", "White"] or ["S", "M", "L"]
}

export interface Product {
  id: number;
  name: string;
  permalink: string;
  price: string;
  regular_price: string;
  images: ProductImage[];
  description: string;
  average_rating: string;
  rating_count: number;
  categories: { id: number; name: string; slug: string }[];
  attributes: ProductAttribute[];
  in_stock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  // Add selected attributes to the cart item
  selectedAttributes?: Record<string, string>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: {
    src: string;
  };
}

// Fix: Add navigation view types
export type MainView = 'home' | 'search' | 'wishlist' | 'live' | 'profile';

export type ViewState =
  | { view: 'home' }
  | { view: 'productList'; title: string; categorySlug?: string }
  | { view: 'productDetails'; productId: number }
  | { view: 'wishlist' }
  | { view: 'cart' }
  | { view: 'profile' }
  | { view: 'search' }
  | { view: 'live' };
