import { useState } from 'react';

interface NumberRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function NumberRating({ value, onChange }: NumberRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const activeValue = hover !== null ? hover : value;

  return (
    <div className="flex space-x-1">
      {Array.from({ length: 11 }, (_, idx) => {
        const isActive = activeValue >= idx;
        return (
          <button
            key={idx}
            type="button"
            className={`
              cursor-pointer
              h-8 w-8 flex items-center justify-center
              rounded-md transition-colors
              ${isActive ? 'bg-blue-400 text-white' : 'bg-gray-300 text-black'}
            `}
            onClick={() => onChange(idx)}
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="font-bold">{idx}</span>
          </button>
        );
      })}
    </div>
  );
}
