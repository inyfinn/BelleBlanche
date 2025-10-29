import React, { useEffect, useState } from 'react';
import { getProductById } from '../services/woocommerceService';
import type { Product, ProductAttribute } from '../types';
import { useAppContext } from '../context/AppContext';
import { HeartIcon, PlusIcon, MinusIcon, ShareIcon } from '../components/Icons';
import Rating from '../components/Rating';

interface ProductDetailsViewProps {
  productId: number;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  const { addToCart, toggleWishlist, isInWishlist, showToast } = useAppContext();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // Pre-select the first option for each attribute
          const initialAttributes: Record<string, string> = {};
          fetchedProduct.attributes.forEach(attr => {
              if(attr.options.length > 0) {
                  initialAttributes[attr.name] = attr.options[0];
              }
          });
          setSelectedAttributes(initialAttributes);
        } else {
          console.error(`Product with ID ${productId} not found.`);
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedAttributes);
    }
  };

  const handleAttributeSelect = (attributeName: string, option: string) => {
      setSelectedAttributes(prev => ({...prev, [attributeName]: option}));
  };
  
  const onWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="aspect-square bg-accent rounded-2xl w-full"></div>
            <div className="h-8 bg-accent rounded w-3/4 mt-6"></div>
            <div className="h-4 bg-accent rounded w-1/2 mt-4"></div>
            <div className="h-12 bg-accent rounded w-full mt-6"></div>
            <div className="h-20 bg-accent rounded w-full mt-2"></div>
            <div className="h-16 bg-accent rounded-2xl w-full mt-8"></div>
        </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold">Produkt nie został znaleziony</h1>
        <p className="mt-2 text-gray-500">Przepraszamy, nie mogliśmy znaleźć produktu, którego szukasz.</p>
      </div>
    );
  }

  return (
    <div>
        {/* Image Carousel */}
        <div className="relative">
            <div className="aspect-square w-full">
                <img
                    src={product.images[activeImageIndex]?.src || 'https://placehold.co/600x600/f0f0f0/373737?text=Belle+Blanche'}
                    alt={product.images[activeImageIndex]?.alt || product.name}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.length > 1 && product.images.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-primary' : 'bg-gray-300'}`}
                        aria-label={`Zobacz zdjęcie ${index + 1}`}
                    />
                ))}
            </div>
             <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: product.name,
                                text: `Sprawdź ${product.name} w Belle Blanche!`,
                                url: product.permalink,
                            });
                        } else {
                            showToast('Udostępnianie nie jest wspierane na tym urządzeniu');
                        }
                    }}
                    className="p-3 bg-white/70 backdrop-blur-sm rounded-full text-dark hover:bg-white transition-colors"
                    aria-label="Udostępnij"
                >
                    <ShareIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-full transition-all duration-300 ${onWishlist ? 'bg-primary text-white' : 'bg-white/70 backdrop-blur-sm text-dark hover:bg-white'}`}
                    aria-label={onWishlist ? "Usuń z listy życzeń" : "Dodaj do listy życzeń"}
                >
                    <HeartIcon className={`w-6 h-6 ${onWishlist ? 'fill-current' : ''}`} />
                </button>
            </div>
        </div>

        {/* Product Info */}
        <div className="p-6 bg-white rounded-t-3xl -mt-6 relative z-10">
            <h1 className="text-2xl font-bold text-dark">{product.name}</h1>
            <div className="flex items-center mt-2">
                <Rating value={parseFloat(product.average_rating)} />
                <span className="text-sm text-gray-400 ml-2">({product.rating_count} opinii)</span>
            </div>
            
            {product.attributes.map(attr => (
                <div key={attr.id} className="mt-4">
                    <h3 className="text-sm font-bold text-dark mb-2">{attr.name}</h3>
                    <div className="flex flex-wrap gap-2">
                        {attr.options.map(option => (
                            <button 
                                key={option}
                                onClick={() => handleAttributeSelect(attr.name, option)}
                                className={`px-4 py-2 text-sm rounded-lg border-2 transition-colors ${selectedAttributes[attr.name] === option ? 'bg-primary text-white border-primary' : 'bg-white text-dark border-gray-200'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <p className="mt-4 text-dark/80 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Purchase CTA */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 border-t border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
                 <div className="flex items-center bg-accent rounded-xl">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-4 text-dark"><MinusIcon className="w-5 h-5" /></button>
                    <span className="px-4 text-lg font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-4 text-dark"><PlusIcon className="w-5 h-5" /></button>
                </div>
                <button 
                    onClick={handleAddToCart}
                    className="flex-grow bg-primary text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-colors text-lg"
                    disabled={!product.in_stock}
                >
                    {product.in_stock ? (
                        <div className="flex items-center justify-center gap-2">
                            <span>Dodaj</span>
                            <span>|</span>
                            <span>{ (parseFloat(product.price) * quantity).toFixed(2) } zł</span>
                        </div>
                    ) : (
                         <span>Produkt niedostępny</span>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductDetailsView;
