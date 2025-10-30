import React, { useEffect, useState, useCallback } from 'react';
import { getProductById, getProductReviews, createProductReview } from '../services/woocommerceService';
import type { Product, ProductReview, CreateReviewData } from '../types';
import { useAppContext } from '../context/AppContext';
import { HeartIcon, PlusIcon, MinusIcon, ShareIcon, PencilIcon, StarIcon, PlayIcon } from '../components/Icons';
import Rating from '../components/Rating';

// --- SUB-COMPONENTS for Reviews ---

const StarRatingInput: React.FC<{ rating: number; setRating: (rating: number) => void; }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starValue)}
                        aria-label={`Ocena ${starValue} na 5`}
                    >
                        <StarIcon
                            className={`w-6 h-6 cursor-pointer ${starValue <= (hoverRating || rating) ? 'text-rating-gold' : 'text-gray-300'}`}
                            isFilled={starValue <= (hoverRating || rating)}
                        />
                    </button>
                );
            })}
        </div>
    );
};

const ReviewForm: React.FC<{ productId: number; onReviewSubmitted: () => void }> = ({ productId, onReviewSubmitted }) => {
    const { userProfile, showToast } = useAppContext();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviewerName, setReviewerName] = useState(userProfile.name);
    const [reviewerEmail, setReviewerEmail] = useState(userProfile.email);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            showToast("Proszę wybrać ocenę w gwiazdkach.");
            return;
        }
        if (!review.trim()) {
            showToast("Treść opinii nie może być pusta.");
            return;
        }
        setIsSubmitting(true);
        try {
            const reviewData: CreateReviewData = {
                product_id: productId,
                review: review,
                reviewer: reviewerName,
                reviewer_email: reviewerEmail,
                rating: rating,
            };
            await createProductReview(reviewData);
            showToast("Dziękujemy za Twoją opinię!");
            onReviewSubmitted();
            setRating(0);
            setReview('');
        } catch (error: any) {
            console.error("Failed to submit review", error);
            showToast(error.message || "Nie udało się dodać opinii.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-accent/50 p-4 rounded-xl mt-4 space-y-3">
             <div>
                <label className="block text-sm font-semibold text-dark mb-1">Twoja ocena</label>
                <StarRatingInput rating={rating} setRating={setRating} />
            </div>
            <div>
                <label htmlFor="reviewText" className="block text-sm font-semibold text-dark mb-1">Twoja opinia</label>
                <textarea
                    id="reviewText"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Podziel się swoimi wrażeniami..."
                    rows={4}
                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div>
                    <label htmlFor="reviewerName" className="block text-sm font-semibold text-dark mb-1">Imię</label>
                    <input type="text" id="reviewerName" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" required />
                </div>
                <div>
                    <label htmlFor="reviewerEmail" className="block text-sm font-semibold text-dark mb-1">Email</label>
                    <input type="email" id="reviewerEmail" value={reviewerEmail} onChange={(e) => setReviewerEmail(e.target.value)} className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" required />
                </div>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
            >
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij opinię'}
            </button>
        </form>
    );
};


// --- Main Component ---

interface ProductDetailsViewProps {
  productId: number;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const reviewsRef = React.useRef<HTMLDivElement>(null);


  const { addToCart, toggleWishlist, isInWishlist, showToast, openVideoPlayer } = useAppContext();
  
  const fetchProductData = useCallback(async () => {
    try {
        setLoading(true);
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
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
  }, [productId]);

  const fetchReviews = useCallback(async () => {
    try {
        const fetchedReviews = await getProductReviews(productId);
        setReviews(fetchedReviews);
    } catch(error) {
        console.error("Failed to fetch reviews", error);
    }
  }, [productId]);


  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [fetchProductData, fetchReviews]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedAttributes);
    }
  };

  const handleAttributeSelect = (attributeName: string, option: string) => {
      setSelectedAttributes(prev => ({...prev, [attributeName]: option}));
  };
  
  const handlePlayVideoClick = () => {
    if (product?.videoUrl) {
      openVideoPlayer(product.videoUrl);
    }
  };

  const onWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
        <div className="bg-light container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
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
      <div className="bg-light container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold">Produkt nie został znaleziony</h1>
        <p className="mt-2 text-gray-500">Przepraszamy, nie mogliśmy znaleźć produktu, którego szukasz.</p>
      </div>
    );
  }

  return (
    <div className="bg-light">
        <div className="relative">
            <div className="aspect-square w-full bg-white">
                <img
                    src={product.images[activeImageIndex]?.src || 'https://placehold.co/600x600/f0f0f0/373737?text=Belle+Blanche'}
                    alt={product.images[activeImageIndex]?.alt || product.name}
                    className="h-full w-full object-contain"
                />
            </div>
            {product.videoUrl && (
                <button
                    onClick={handlePlayVideoClick}
                    className="absolute bottom-12 right-5 z-10 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-all"
                    aria-label="Odtwórz wideo"
                >
                    <PlayIcon className="w-8 h-8" />
                </button>
            )}
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
                            navigator.share({ title: product.name, text: `Sprawdź ${product.name} w Belle Blanche!`, url: product.permalink, });
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

        <div className="p-6 bg-white rounded-t-3xl -mt-6 relative z-10">
            <h1 className="text-2xl font-bold text-dark">{product.name}</h1>
            <div className="flex items-center mt-2">
                <Rating value={parseFloat(product.average_rating)} />
                <a href="#reviews" onClick={(e) => { e.preventDefault(); reviewsRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm text-gray-400 ml-2 hover:underline">
                  ({product.rating_count} opinii)
                </a>
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

            <div 
                className="mt-4 text-dark/80 text-sm leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
            />
        </div>

        <div id="reviews" ref={reviewsRef} className="p-6 bg-white border-t border-gray-100">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-dark">Opinie ({reviews.length})</h2>
                <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                >
                    <PencilIcon className="w-4 h-4" />
                    <span>{showReviewForm ? 'Anuluj' : 'Napisz opinię'}</span>
                </button>
            </div>
            
            {showReviewForm && <ReviewForm productId={productId} onReviewSubmitted={() => { fetchReviews(); setShowReviewForm(false); }} />}

            <div className="mt-6 space-y-6">
                {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-dark">{review.name}</h4>
                            <Rating value={review.rating} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{new Date(review.date_created).toLocaleDateString('pl-PL')}</p>
                        <p className="mt-2 text-dark/80 text-sm">{review.review}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-6">Ten produkt nie ma jeszcze żadnych opinii. Bądź pierwsza!</p>
                )}
            </div>
        </div>

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