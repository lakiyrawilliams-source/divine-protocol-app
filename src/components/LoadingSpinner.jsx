import React from 'react';

export function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className={`${sizeClasses[size]} border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin`} />
  );
}

export function LoadingCard({ message = 'Loading...' }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
}
