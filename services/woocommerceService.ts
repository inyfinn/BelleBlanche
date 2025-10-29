import type { Product, Category } from '../types';
import { stripHtml } from '../utils/textUtils';

// --- PRODUCTION WOOCOMMERCE API ---
const WOOCOMMERCE_API_URL = 'https://belleblanche.store/wp-json/wc/v3/';
const CONSUMER_KEY = 'ck_63467977290a562ce148450ddbd0e1f86a01fa10';
const CONSUMER_SECRET = 'cs_ca4226d8591bfc8a5f7ea86f694fa0005f066faa';

const mapProductFromWooCommerceApi = (apiProduct: any): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  permalink: apiProduct.permalink,
  price: apiProduct.price,
  regular_price: apiProduct.regular_price,
  images: apiProduct.images.map((img: any) => ({ id: img.id, src: img.src, alt: img.alt })),
  description: stripHtml(apiProduct.description || apiProduct.short_description),
  average_rating: apiProduct.average_rating,
  rating_count: apiProduct.rating_count,
  categories: apiProduct.categories.map((cat: any) => ({ id: cat.id, name: cat.name, slug: cat.slug })),
  attributes: apiProduct.attributes.map((attr: any) => ({ id: attr.id, name: attr.name, options: attr.options })),
  in_stock: apiProduct.in_stock,
});

const fetchFromWooCommerceApi = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
    const url = new URL(`${WOOCOMMERCE_API_URL}${endpoint}`);
    url.searchParams.append('consumer_key', CONSUMER_KEY);
    url.searchParams.append('consumer_secret', CONSUMER_SECRET);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
    
    const response = await fetch(url.toString());

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch(e) {
            errorData = { message: 'An unknown error occurred' };
        }
        throw new Error(`WooCommerce API error: ${response.statusText} - ${errorData.message}`);
    }
    return response.json();
};

export const getProducts = async (page: number = 1, perPage: number = 10): Promise<Product[]> => {
    const apiProducts = await fetchFromWooCommerceApi<any[]>('products', { per_page: perPage, page, status: 'publish' });
    return apiProducts.map(mapProductFromWooCommerceApi);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
    const apiProducts = await fetchFromWooCommerceApi<any[]>('products', { search: query, per_page: 50, status: 'publish' });
    return apiProducts.map(mapProductFromWooCommerceApi);
};

export const getProductsByCategory = async (slug: string): Promise<Product[]> => {
    const allCategories = await getCategories();
    const category = allCategories.find(c => c.slug === slug);
    if (!category) {
        console.warn(`Category with slug "${slug}" not found.`);
        return [];
    }
    const apiProducts = await fetchFromWooCommerceApi<any[]>(`products`, { category: category.id, per_page: 100, status: 'publish' });
    return apiProducts.map(mapProductFromWooCommerceApi);
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
    try {
        const apiProduct = await fetchFromWooCommerceApi<any>(`products/${id}`);
        return mapProductFromWooCommerceApi(apiProduct);
    } catch(error) {
        console.error(`Failed to fetch product with id ${id}`, error);
        return undefined;
    }
};

export const getCategories = async (): Promise<Category[]> => {
    return await fetchFromWooCommerceApi<Category[]>('products/categories', { per_page: 100 });
};
