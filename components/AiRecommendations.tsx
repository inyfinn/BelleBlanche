import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import ProductCard from './ProductCard';

interface AiRecommendationsProps {
  allProducts: Product[];
}

const AiRecommendations: React.FC<AiRecommendationsProps> = ({ allProducts }) => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, navigateTo } = useAppContext();

  const hasMeasurements = userProfile.height || userProfile.bust || userProfile.waist || userProfile.hips || userProfile.bodyType;

  useEffect(() => {
    if (allProducts.length < 3) {
      setLoading(false);
      setRecommendedProducts([]);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);

      // Fallback for when there are no measurements
      const fallback = () => {
        // Show some generic popular items as a fallback
        setRecommendedProducts(allProducts.slice(0, 4)); 
      };

      if (!hasMeasurements) {
        fallback();
        setLoading(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const productInfoForPrompt = allProducts.map(p => ({ 
          id: p.id, 
          name: p.name,
          attributes: p.attributes.map(attr => ({ name: attr.name, options: attr.options }))
        }));

        let userMeasurements = "Użytkowniczka ma następujące wymiary i preferencje:\n";
        if (userProfile.height) userMeasurements += `- Wzrost: ${userProfile.height} cm\n`;
        if (userProfile.bust) userMeasurements += `- Biust: ${userProfile.bust} cm\n`;
        if (userProfile.waist) userMeasurements += `- Talia: ${userProfile.waist} cm\n`;
        if (userProfile.hips) userMeasurements += `- Biodra: ${userProfile.hips} cm\n`;
        if (userProfile.shoeSize) userMeasurements += `- Rozmiar buta: ${userProfile.shoeSize} EU\n`;
        if (userProfile.calfCircumference) userMeasurements += `- Obwód łydki: ${userProfile.calfCircumference} cm\n`;
        if (userProfile.bodyType) userMeasurements += `- Typ sylwetki: ${userProfile.bodyType}\n`;
        if (userProfile.favoriteColor) userMeasurements += `- Ulubiony kolor: ${userProfile.favoriteColor}\n`;
        if (userMeasurements.split('\n').length <= 1) userMeasurements = "Użytkowniczka nie podała swoich wymiarów.";
        
        const prompt = `Jesteś ekspertką mody i osobistą stylistką w butiku Belle Blanche. Twoim zadaniem jest zarekomendowanie 3 produktów z poniższej listy, które będą idealnie pasować do sylwetki i preferencji klientki.
        ${userMeasurements}
        Przeanalizuj dostępne produkty, ich atrybuty (rozmiary, kolory) i dopasuj je do danych klientki. Bądź precyzyjna - jeśli klientka podała rozmiar buta, możesz polecić jej obuwie. Jeśli podała ulubiony kolor, postaraj się znaleźć coś w tej tonacji.
        Lista produktów: ${JSON.stringify(productInfoForPrompt)}.
        Odpowiedz TYLKO w formacie JSON, zawierającym tablicę 3 numerów ID wybranych produktów, np: [123, 456, 789]`;


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
        fallback();
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [allProducts, userProfile, hasMeasurements]);

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

  if (!hasMeasurements && !loading) {
      return (
          <div className="col-span-2 text-center text-gray-500 py-8 bg-accent/50 rounded-lg">
              <p className="font-semibold">Odkryj swój idealny styl!</p>
              <p className="text-sm mt-1 mb-3">Uzupełnij swoje wymiary w profilu, aby otrzymać spersonalizowane rekomendacje.</p>
              <button onClick={() => navigateTo({ view: 'profile' })} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Przejdź do profilu</button>
          </div>
      );
  }

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