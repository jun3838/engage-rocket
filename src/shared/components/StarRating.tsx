import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const activeValue = hover !== null ? hover : value;

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = activeValue >= star;
        return(
          <button
            key={star}
            type="button"
            className="cursor-pointer"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          >
            <FaStar
              className={`
                h-8 w-8 transition-colors
                ${isActive ? 'text-yellow-400' : 'text-gray-300'}
              `}
            />
          </button>
        )
      })}
    </div>
  );
}