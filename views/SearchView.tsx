import React, { useState, useEffect, useCallback } from 'react';
import { searchProducts } from '../services/woocommerceService';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { SearchIcon } from '../components/Icons';

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [query]);
  
  const performSearch = useCallback(async () => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const products = await searchProducts(debouncedQuery);
      setResults(products);
    } catch (error) {
      console.error("Failed to search products:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj produktów..."
          className="w-full pl-11 pr-4 py-3 bg-white text-dark border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : debouncedQuery.trim() && !loading ? (
          <p className="text-center text-gray-500 pt-10">Nie znaleziono produktów pasujących do Twojego zapytania.</p>
        ) : (
          <p className="text-center text-gray-500 pt-10">Zacznij pisać, aby wyszukać produkty.</p>
        )}
      </div>
    </div>
  );
};

export default SearchView;