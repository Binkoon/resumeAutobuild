import React from 'react';

interface StarRatingProps {
  score: number; // 1-5
  onScoreChange?: (score: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ score, onScoreChange, readonly = false, size = 'md' }: StarRatingProps) {
  const sizeStyles = {
    sm: { width: '16px', height: '16px' },
    md: { width: '20px', height: '20px' },
    lg: { width: '24px', height: '24px' }
  };

  const handleStarClick = (starIndex: number) => {
    if (!readonly && onScoreChange) {
      onScoreChange(starIndex + 1);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'sm' ? '4px' : size === 'lg' ? '8px' : '6px' }}>
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <button
          key={starIndex}
          type="button"
          onClick={() => handleStarClick(starIndex - 1)}
          disabled={readonly}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: readonly ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            color: starIndex <= score ? '#fbbf24' : '#d1d5db',
            ...sizeStyles[size]
          }}
          onMouseEnter={(e) => {
            if (!readonly) {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.color = '#f59e0b';
            }
          }}
          onMouseLeave={(e) => {
            if (!readonly) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.color = starIndex <= score ? '#fbbf24' : '#d1d5db';
            }
          }}
          aria-label={`${starIndex}점`}
        >
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span style={{ 
        marginLeft: '8px', 
        fontSize: '14px', 
        color: '#6b7280', 
        fontWeight: '500' 
      }}>
        {score}/5
      </span>
    </div>
  );
}