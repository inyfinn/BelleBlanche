import React, { useEffect, useState } from 'react';
import { getProducts, getProductsByCategory } from '../services/woocommerceService';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
// Fix: Import ViewState from the correct types file.
import type { ViewState } from '../types';

interface ProductListViewProps {
  title: string;
  categorySlug?: string;
  navigateTo: (viewState: ViewState) => void;
}

const ProductListView: React.FC<ProductListViewProps> = ({ title, categorySlug }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = categorySlug
          ? await getProductsByCategory(categorySlug)
          : await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categorySlug]);

  const ProductSkeleton = () => (
    <div className="group relative flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
        <div className="relative aspect-[1/1.1] w-full bg-accent"></div>
        <div className="p-3">
            <div className="h-4 bg-accent rounded w-3/4"></div>
            <div className="h-3 bg-accent rounded w-1/2 mt-2"></div>
            <div className="h-5 bg-accent rounded w-1/4 mt-3"></div>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
            <>
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </>
        ) : products.length > 0 ? (
            products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))
        ) : (
            <p className="col-span-full text-center text-gray-500">Nie znaleziono produktów w tej kategorii.</p>
        )}
      </div>
    </div>
  );
};

export default ProductListView;
