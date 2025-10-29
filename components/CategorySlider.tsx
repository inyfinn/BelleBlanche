import React, { useState } from 'react';
import type { Category } from '../types';

interface CategorySliderProps {
  categories: Category[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.name || '');
  
  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold tracking-wide text-dark">Kategorie</h2>
            <a href="#" className="text-sm font-semibold text-secondary">Zobacz wszystko</a>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((category) => (
            <button 
                key={category.id} 
                onClick={() => setActiveCategory(category.name)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeCategory === category.name ? 'bg-secondary text-white' : 'bg-accent text-dark'}`}
            >
             {category.name}
            </button>
        ))}
        </div>
    </div>
  );
};

export default CategorySlider;