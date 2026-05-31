import React from 'react'

const ProductSkeleton = () => {
  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-1 font-sans relative overflow-hidden animate-pulse transform-gpu'>
      {/* Top Header Block Skeleton */}
      <div className='flex justify-between items-center h-12 mb-6'>
        <div className='h-8 bg-gray-800/80 rounded-xl w-32' />
        <div className='h-10 bg-gray-800/60 rounded-xl w-28' />
      </div>

      {/* Primary Products Matrix Data Table Skeleton */}
      <div className='bg-[#161b22]/40 border border-gray-800/60 rounded-2xl overflow-hidden shadow-2xl'>
        {/* Table Mock Header Row */}
        <div className='bg-[#161b22]/80 h-12 border-b border-gray-800/60' />

        {/* Table Mock Data Rows Container */}
        <div className='divide-y divide-gray-800/30 px-2'>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='grid grid-cols-7 gap-4 p-4 h-16 items-center bg-transparent'
            >
              <div className='h-3.5 bg-gray-800/70 rounded-md w-24' />
              <div className='h-3.5 bg-gray-800/50 rounded-md w-20' />
              <div className='h-3.5 bg-gray-800/50 rounded-md w-16 ml-auto' />
              <div className='h-3.5 bg-gray-800/40 rounded-md w-12' />
              <div className='h-3.5 bg-gray-800/50 rounded-md w-20' />
              <div className='h-3.5 bg-gray-800/50 rounded-md w-20' />

              {/* Operation Buttons Mock State */}
              <div className='flex gap-2 ml-auto shrink-0'>
                <div className='h-7 bg-gray-800/60 rounded-xl w-14 border border-gray-800/30' />
                <div className='h-7 bg-gray-800/40 rounded-xl w-14 border border-gray-800/30' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
