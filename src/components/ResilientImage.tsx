import { Sprout } from 'lucide-react';
import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 text-emerald-700 p-3 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sprout className="w-7 h-7 mb-1.5 text-emerald-600/80" />
        <span className="text-[11px] font-medium text-emerald-900/70 line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
