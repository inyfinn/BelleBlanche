import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
// Fix: Import ViewState from the correct types file.
import type { ViewState } from '../types';
import { getCategories } from '../services/woocommerceService';
import type { Category } from '../types';

interface WishlistViewProps {
  navigateTo: (viewState: ViewState) => void;
}

const WishlistView: React.FC<WishlistViewProps> = ({ navigateTo }) => {
  const { wishlist } = useAppContext();
  const [activeCategorySlug, setActiveCategorySlug] = useState('Wszystko');
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setAllCategories);
  }, []);

  const wishlistCategorySlugs = new Set(
    wishlist.flatMap(p => p.categories.map(c => c.slug)).filter(Boolean)
  );
  
  const availableCategories = [
      { id: -1, name: 'Wszystko', slug: 'Wszystko' },
      ...allCategories.filter(c => wishlistCategorySlugs.has(c.slug))
  ];
  
  const filteredWishlist = activeCategorySlug === 'Wszystko'
    ? wishlist
    : wishlist.filter(p => p.categories.some(c => c.slug === activeCategorySlug));

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold">Twoja lista życzeń jest pusta</h1>
        <p className="mt-2 text-gray-500">Dodaj produkty, które Ci się podobają, klikając w serduszko.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-6">
            {availableCategories.map(category => (
                <button 
                    key={category.slug}
                    onClick={() => setActiveCategorySlug(category.slug)}
                    className={`flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-colors ${activeCategorySlug === category.slug ? 'bg-primary text-white font-semibold' : 'bg-accent text-primary'}`}
                >
                    {category.name}
                </button>
            ))}
        </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredWishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistView;
