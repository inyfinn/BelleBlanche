import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import type { ViewState } from '../App';

interface WishlistViewProps {
  navigateTo: (viewState: ViewState) => void;
}

const categories = ['Wszystko', 'Kurtka', 'Sukienka', 'Spodnie', 'T-Shirt'];

const WishlistView: React.FC<WishlistViewProps> = ({ navigateTo }) => {
  const { wishlist } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Wszystko');

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
            {categories.map(category => (
                <button 
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeCategory === category ? 'bg-secondary text-white' : 'bg-accent text-dark'}`}
                >
                    {category}
                </button>
            ))}
        </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistView;