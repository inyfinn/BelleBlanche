import React from 'react';
import type { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { HeartIcon, PlusIcon, PlayIcon } from './Icons';
import Rating from './Rating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, navigateTo, addToCart, openVideoPlayer } = useAppContext();
  const onWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    navigateTo({ view: 'productDetails', productId: product.id });
  };
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.in_stock) {
        addToCart(product, 1);
    }
  };

  const handlePlayVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.videoUrl) {
      openVideoPlayer(product.videoUrl);
    }
  };

  const isSale = product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price);
  const isSimpleProduct = !product.attributes || product.attributes.length === 0 || product.attributes.every(attr => attr.options.length <= 1);

  return (
    <div onClick={handleCardClick} className="group relative flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
      <div className="relative aspect-[1/1.1] w-full">
        <img
          src={product.images[0]?.src || 'https://placehold.co/400x400/f0f0f0/373737?text=Belle+Blanche'}
          alt={product.images[0]?.alt || product.name}
          className="h-full w-full object-cover object-center"
        />
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${onWishlist ? 'bg-primary text-white' : 'bg-white/70 text-dark hover:bg-white'}`}
          aria-label={onWishlist ? "Usuń z listy życzeń" : "Dodaj do listy życzeń"}
        >
          <HeartIcon className={`w-5 h-5 ${onWishlist ? 'fill-current' : ''}`} />
        </button>
        {product.videoUrl && (
            <button
                onClick={handlePlayVideoClick}
                className="absolute bottom-5 right-5 z-10 p-1 bg-black/40 text-white rounded-full hover:bg-black/60 transition-all"
                aria-label="Odtwórz wideo"
            >
                <PlayIcon className="w-6 h-6" />
            </button>
        )}
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-dark flex-grow leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center mt-1">
            <Rating value={parseFloat(product.average_rating)} />
            <span className="text-xs text-gray-400 ml-2">({product.rating_count})</span>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <p className="text-base font-bold text-primary">
              {parseFloat(product.price).toFixed(2)} zł
            </p>
            {isSale && (
              <p className="text-sm text-gray-400 line-through">
                {parseFloat(product.regular_price).toFixed(2)} zł
              </p>
            )}
          </div>
          {isSimpleProduct && product.in_stock && (
            <button
              onClick={handleAddToCartClick}
              className="p-2 bg-primary text-white rounded-full hover:bg-opacity-80 transition-transform hover:scale-110 active:scale-95 z-10"
              aria-label="Dodaj do koszyka"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;