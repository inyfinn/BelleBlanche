import React from 'react';
import { StarIcon } from './Icons';

interface RatingProps {
  value: number | string;
  max?: number;
}

const Rating: React.FC<RatingProps> = ({ value, max = 5 }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`w-4 h-4 ${numericValue >= starValue ? 'text-rating-gold' : 'text-gray-300'}`}
            isFilled={numericValue >= starValue}
          />
        );
      })}
    </div>
  );
};

export default Rating;
