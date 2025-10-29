import React, { useEffect, useState, useCallback } from 'react';
import { getCategories, getProducts } from '../services/woocommerceService';
import type { Category, Product } from '../types';
import CategorySlider from '../components/CategorySlider';
import AiRecommendations from '../components/AiRecommendations';
import ProductCard from '../components/ProductCard';
import ProductRequest from '../components/ProductRequest'; // Import the new component
// Fix: Import ViewState from the correct types file.
import type { ViewState } from '../types';

interface HomeViewProps {
  navigateTo: (viewState: ViewState) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ navigateTo }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState<'noteworthy' | 'ai'>('noteworthy');
  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const PRODUCTS_PER_PAGE = 4;

  const loadProducts = useCallback(async (pageNum: number) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const newProducts = await getProducts(pageNum, PRODUCTS_PER_PAGE);
        if (newProducts.length < PRODUCTS_PER_PAGE) {
          setCanLoadMore(false);
        }
        setProducts(prev => pageNum === 1 ? newProducts : [...prev, ...newProducts]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setCanLoadMore(false); // Stop trying if there's an error
      } finally {
        if (pageNum === 1) setLoading(false);
        else setLoadingMore(false);
      }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        loadProducts(1);
        getCategories().then(setCategories);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, [loadProducts]);
  
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadProducts(nextPage);
  };

  const ProductSkeleton = () => (
    <div className="group relative flex flex-col bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
        <div className="relative aspect-[1/1.1] w-full bg-accent"></div>
        <div className="p-3">
            <div className="h-4 bg-accent rounded w-3//4"></div>
            <div className="h-3 bg-accent rounded w-1/2 mt-2"></div>
            <div className="h-5 bg-accent rounded w-1/4 mt-3"></div>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-48 rounded-2xl flex flex-col justify-center items-start text-left p-6 overflow-hidden">
            <img src="https://images.pexels.com/photos/1043148/pexels-photo-1043148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="New Collection" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-white/40"></div>
            <div className="relative z-10 text-dark">
                <p className="text-sm font-semibold">WIELKIE OTWARCIE</p>
                <h1 className="text-2xl font-bold font-serif tracking-tight mt-1">Rabat 50%</h1>
                <p className="text-xs mt-1">Na pierwszą transakcję</p>
                <button 
                  onClick={() => navigateTo({ view: 'productList', title: 'Wszystkie produkty' })}
                  className="mt-3 px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold"
                >
                    Kup teraz
                </button>
            </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <CategorySlider categories={categories} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex border-b border-gray-200 mb-4">
              <button onClick={() => setActiveTab('noteworthy')} className={`-mb-px px-4 py-2 text-base font-bold transition-colors duration-200 ${activeTab === 'noteworthy' ? 'text-dark border-b-2 border-primary' : 'text-gray-400'}`}>
                  Warte uwagi
              </button>
              <button onClick={() => setActiveTab('ai')} className={`-mb-px px-4 py-2 text-base font-bold transition-colors duration-200 ${activeTab === 'ai' ? 'text-dark border-b-2 border-primary' : 'text-gray-400'}`}>
                  Rekomendacje AI
              </button>
          </div>

          {activeTab === 'noteworthy' ? (
              <div>
                <div className="grid grid-cols-2 gap-4">
                    {loading && products.length === 0 ? (
                        <>
                            <ProductSkeleton />
                            <ProductSkeleton />
                            <ProductSkeleton />
                            <ProductSkeleton />
                        </>
                    ) : (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
                {canLoadMore && !loadingMore && !loading && (
                    <div className="text-center mt-8">
                        <button 
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
                        >
                            Pokaż więcej
                        </button>
                    </div>
                )}
                {loadingMore && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <ProductSkeleton />
                        <ProductSkeleton />
                    </div>
                )}
              </div>
          ) : (
              <AiRecommendations allProducts={products} />
          )}
      </div>
      
      {/* Product Request Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductRequest />
      </div>
    </div>
  );
};

export default HomeView;