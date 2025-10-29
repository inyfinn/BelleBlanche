import React, { useEffect, useState } from 'react';
import { getProductById } from '../services/woocommerceService';
import type { Product } from '../types';
import type { ViewState } from '../App';
import { useAppContext } from '../context/AppContext';
import Rating from '../components/Rating';
import { HeartIcon, ShareIcon } from '../components/Icons';

interface ProductDetailsViewProps {
  productId: number;
  navigateTo: (viewState: ViewState) => void;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Brown');

  const { addToCart, toggleWishlist, isInWishlist } = useAppContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData || null);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div className="text-center p-10">Ładowanie...</div>;
  if (!product) return <div className="text-center p-10">Nie znaleziono produktu.</div>;

  const onWishlist = isInWishlist(product.id);
  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const COLORS = [{name: 'Brown', hex: '#8B6F47'}, {name: 'Beige', hex: '#F5E6D3'}, {name: 'Black', hex: '#2D2D2D'}];

  return (
    <div className="bg-white">
      <div className="relative aspect-square w-full">
         <img
          src={product.images[0]?.src || 'https://placehold.co/400x400/f0f0f0/373737?text=...'}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5 rounded-t-3xl -mt-8 relative bg-light z-10">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold font-serif">{product.name}</h1>
                <div className="flex items-center mt-2">
                    <Rating value={product.rating} />
                    <span className="text-sm text-gray-500 ml-3">({product.reviewCount} opinii)</span>
                </div>
            </div>
            <p className="text-2xl font-bold text-secondary">{parseFloat(product.price).toFixed(2)} zł</p>
        </div>

        <div className="mt-4">
            <h2 className="text-md font-bold mb-2">Opis</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        <div className="mt-6">
            <h2 className="text-md font-bold mb-3">Rozmiar</h2>
            <div className="flex gap-3">
                {SIZES.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 flex items-center justify-center rounded-xl text-sm font-bold border-2 transition-colors ${selectedSize === size ? 'bg-secondary text-white border-secondary' : 'bg-white text-dark border-accent'}`}>
                        {size}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-6">
            <h2 className="text-md font-bold mb-3">Kolor</h2>
            <div className="flex gap-3">
                {COLORS.map(color => (
                     <button key={color.name} onClick={() => setSelectedColor(color.name)} className={`w-10 h-10 rounded-full transition-all duration-200 ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-secondary' : ''}`} style={{backgroundColor: color.hex}}/>
                ))}
            </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-accent z-30 flex items-center gap-4">
            <button
                onClick={() => addToCart(product)}
                className="flex-grow w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-colors text-lg"
            >
                Dodaj do koszyka
            </button>
            <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-xl border-2 transition-colors ${onWishlist ? 'bg-secondary text-white border-secondary' : 'border-accent text-dark bg-white'}`}
            >
                <HeartIcon className={`w-6 h-6 ${onWishlist ? 'fill-current' : ''}`} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsView;
