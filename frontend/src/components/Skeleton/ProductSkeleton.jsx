import React from 'react';

const ProductSkeleton = () => (
  <div className="p-6 animate-pulse">
    {/* Header */}
    <div className="flex justify-between items-center h-12 mb-6">
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="h-10 bg-gray-200 rounded w-28"></div>
    </div>

    {/* Table */}
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gray-100 h-12"></div>
      <div className="divide-y divide-gray-200">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-7 gap-4 p-4 h-12 items-center">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="flex gap-2 ml-auto">
              <div className="h-8 bg-gray-200 rounded-full w-16"></div>
              <div className="h-8 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProductSkeleton;

