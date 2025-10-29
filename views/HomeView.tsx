import React, { useEffect, useState } from 'react';
import { getCategories, getProducts } from '../services/woocommerceService';
import type { Category, Product } from '../types';
import CategorySlider from '../components/CategorySlider';
import ProductCard from '../components/ProductCard';
import type { ViewState } from '../App';

interface HomeViewProps {
  navigateTo: (viewState: ViewState) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ navigateTo }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <div className="space-y-6 pt-4">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-48 bg-accent rounded-2xl flex flex-col justify-center items-center text-center p-4 overflow-hidden">
            <img src="https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="New Collection" className="absolute inset-0 w-full h-full object-cover opacity-60"/>
            <div className="relative z-10 text-white">
                <p className="text-sm font-semibold">WIELKIE OTWARCIE</p>
                <h1 className="text-2xl font-bold font-serif tracking-tight mt-1">Rabat 50%</h1>
                <p className="text-xs mt-1">Na pierwszą transakcję</p>
                <button className="mt-3 px-5 py-2 bg-secondary text-white rounded-lg text-sm font-bold">
                    Kup teraz
                </button>
            </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <CategorySlider categories={categories} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold tracking-wide text-dark">Na topie</h2>
            <a href="#" className="text-sm font-semibold text-secondary">Zobacz wszystko</a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <>
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </>
          ) : (
            products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeView;