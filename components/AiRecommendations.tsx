import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface AiRecommendationsProps {
  allProducts: Product[];
}

const AiRecommendations: React.FC<AiRecommendationsProps> = ({ allProducts }) => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Only run if we have enough products for a meaningful recommendation AND a fallback
    if (allProducts.length < 7) {
        setLoading(false);
        setRecommendedProducts([]); // Ensure it's empty if not enough products
        return;
    };

    const fetchRecommendations = async () => {
      setLoading(true);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const productInfoForPrompt = allProducts.map(p => ({ id: p.id, name: p.name }));

        const prompt = `You are a fashion expert. From the following list of products, select the IDs of 3 products that create a cohesive, elegant outfit.
        Product list: ${JSON.stringify(productInfoForPrompt)}.
        Respond ONLY with a JSON array of the 3 selected product IDs, like this: [1, 2, 3]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER }
                }
            }
        });
        
        // Clean the response text from potential markdown formatting
        let responseText = response.text.trim();
        if (responseText.startsWith('```json')) {
          responseText = responseText.substring(7, responseText.length - 3).trim();
        } else if (responseText.startsWith('`')) {
          responseText = responseText.substring(1, responseText.length - 1).trim();
        }

        const recommendedIds: number[] = JSON.parse(responseText);
        
        if (recommendedIds && recommendedIds.length > 0) {
            const recommended = allProducts.filter(p => recommendedIds.includes(p.id));
            setRecommendedProducts(recommended.slice(0, 3));
        } else {
            throw new Error("AI did not return a valid array of IDs");
        }

      } catch (error) {
        console.error("Failed to fetch AI recommendations, using fallback:", error);
        // Fallback to showing products that are not on the main page.
        // HomeView shows slice(0, 4), so we show from index 4 onwards.
        setRecommendedProducts(allProducts.slice(4, 7));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [allProducts]);

  const ProductSkeleton = () => (
    <div className="group relative flex flex-col bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
        <div className="relative aspect-[1/1.1] w-full bg-accent"></div>
        <div className="p-3">
            <div className="h-4 bg-accent rounded w-3/4"></div>
            <div className="h-3 bg-accent rounded w-1/2 mt-2"></div>
            <div className="h-5 bg-accent rounded w-1/4 mt-3"></div>
        </div>
    </div>
  );

  if (!loading && recommendedProducts.length === 0) {
      return <div className="col-span-2 text-center text-gray-500 py-8">Brak rekomendacji do wyświetlenia.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
        {loading ? (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        ) : (
          recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
    </div>
  );
};

export default AiRecommendations;