import type { Product, Category, ProductReview, CreateReviewData } from '../types';
import { stripHtml, decodeHtmlEntities } from '../utils/textUtils';

const WOOCOMMERCE_API_URL = 'https://belleblanche.store/wp-json/wc/v3/';
const CONSUMER_KEY = 'ck_63467977290a562ce148450ddbd0e1f86a01fa10';
const CONSUMER_SECRET = 'cs_ca4226d8591bfc8a5f7ea86f694fa0005f066faa';

const mapProductFromWooCommerceApi = (apiProduct: any): Product => {
    // Find video URL in meta_data
    const videoMeta = apiProduct.meta_data.find((meta: any) => meta.key === '_video_url');
    const videoUrl = videoMeta ? videoMeta.value : undefined;

    return {
        id: apiProduct.id,
        name: decodeHtmlEntities(apiProduct.name),
        permalink: apiProduct.permalink,
        price: apiProduct.price,
        regular_price: apiProduct.regular_price,
        images: apiProduct.images.map((img: any) => ({ id: img.id, src: img.src, alt: img.alt })),
        description: apiProduct.description || apiProduct.short_description || '',
        average_rating: apiProduct.average_rating,
        rating_count: apiProduct.rating_count,
        categories: apiProduct.categories.map((cat: any) => ({ id: cat.id, name: decodeHtmlEntities(cat.name), slug: cat.slug })),
        attributes: apiProduct.attributes.map((attr: any) => ({ id: attr.id, name: decodeHtmlEntities(attr.name), options: attr.options.map((opt: string) => decodeHtmlEntities(opt)) })),
        in_stock: apiProduct.in_stock,
        videoUrl: videoUrl,
    };
};

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

export const getProductReviews = async (productId: number): Promise<ProductReview[]> => {
    const apiReviews = await fetchFromWooCommerceApi<any[]>(`products/reviews`, { product: productId, per_page: 100, status: 'approved' });
    return apiReviews.map(r => ({
        id: r.id,
        date_created: r.date_created,
        review: decodeHtmlEntities(stripHtml(r.review)),
        rating: r.rating,
        name: decodeHtmlEntities(r.name),
        email: r.email,
        verified: r.verified
    }));
};

export const createProductReview = async (reviewData: CreateReviewData): Promise<ProductReview> => {
    const response = await fetch(`${WOOCOMMERCE_API_URL}products/reviews?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się dodać opinii.');
    }
    return response.json();
};