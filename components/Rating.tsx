import React from 'react';
import { StarIcon } from './Icons';

interface RatingProps {
  value: number;
  max?: number;
}

const Rating: React.FC<RatingProps> = ({ value, max = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`w-4 h-4 ${value >= starValue ? 'text-yellow-400' : 'text-gray-300'}`}
            isFilled={value >= starValue}
          />
        );
      })}
    </div>
  );
};

export default Rating;