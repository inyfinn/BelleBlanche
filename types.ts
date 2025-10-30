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
  videoUrl?: string; // For product videos
}

export interface CartItem extends Product {
  quantity: number;
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

export type FavoriteColor = 'Biały' | 'Beżowy' | 'Lekko szary' | 'Ecru';
export type BodyType = 'Szczupła' | 'Atletyczna' | 'Normalna' | 'Troszkę większa' | 'Dość duża' | 'Bardzo duża';


export interface UserProfile {
  name: string;
  email: string;
  height?: number;
  bust?: number;
  waist?: number;
  hips?: number;
  shoeSize?: number;
  calfCircumference?: number;
  favoriteColor?: FavoriteColor[];
  bodyType?: BodyType;
}

export interface ProductReview {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  name: string;
  email: string;
  verified: boolean;
}

export interface CreateReviewData {
    product_id: number;
    review: string;
    reviewer: string;
    reviewer_email: string;
    rating: number;
}

export interface Order {
    id: string;
    date: string;
    status: 'W trakcie' | 'Wysłane' | 'Dostarczone' | 'Anulowane';
    total: number;
    items: { name: string; quantity: number }[];
}

export interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export interface PaymentMethod {
    id: string;
    cardType: 'Visa' | 'Mastercard';
    last4: string;
    expiryDate: string;
    isDefault: boolean;
}

export type MainView = 'home' | 'search' | 'wishlist' | 'live' | 'profile';

export type ViewState =
  | { view: 'home' }
  | { view: 'productList'; title: string; categorySlug?: string }
  | { view: 'productDetails'; productId: number }
  | { view: 'wishlist' }
  | { view: 'cart' }
  | { view: 'profile' }
  | { view: 'search' }
  | { view: 'live' }
  | { view: 'checkout' }
  | { view: 'orderHistory' }
  | { view: 'addressManagement' }
  | { view: 'paymentMethods' }
  | { view: 'helpCenter' }
  | { view: 'aboutUs' }
  | { view: 'contact' }
  | { view: 'terms' }
  | { view: 'privacy' }
  | { view: 'returns' };