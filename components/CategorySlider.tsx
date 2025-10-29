import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Category } from '../types';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CategorySliderProps {
  categories: Category[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ categories }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const { navigateTo } = useAppContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(hasOverflow && el.scrollLeft > 0);
      setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
    }
  }, []);

  useEffect(() => {
    checkForScrollability();
    const el = scrollContainerRef.current;
    el?.addEventListener('scroll', checkForScrollability);
    window.addEventListener('resize', checkForScrollability);
    return () => {
      el?.removeEventListener('scroll', checkForScrollability);
      window.removeEventListener('resize', checkForScrollability);
    };
  }, [categories, checkForScrollability]);

  const handleCategoryClick = (category: Category) => {
    setActiveCategoryId(category.id);
    navigateTo({ view: 'productList', title: category.name, categorySlug: category.slug });
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8; // Scroll 80% of the visible width
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold tracking-wide text-dark">Kategorie</h2>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo({ view: 'productList', title: 'Wszystkie produkty' })}} className="text-sm font-semibold text-primary">Zobacz wszystko</a>
      </div>
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          }}
        >
          {categories.map((category) => (
            <button 
              key={category.id} 
              onClick={() => handleCategoryClick(category)}
              className={`flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-all duration-200 border-2 ${activeCategoryId === category.id ? 'bg-white text-primary font-bold border-accent' : 'bg-accent text-primary border-transparent'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {canScrollLeft && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-5 h-5 text-dark" />
          </button>
        )}
        {canScrollRight && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-all"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-5 h-5 text-dark" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategorySlider;