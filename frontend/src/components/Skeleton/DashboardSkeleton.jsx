import React from 'react'

const DashboardSkeleton = () => {
  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-1 font-sans relative overflow-hidden animate-pulse transform-gpu'>
      {/* Top Main Header Block */}
      <div className='h-8 bg-gray-800/80 rounded-xl w-48 mb-6' />

      {/* Summary Analytics Cards Matrix */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='bg-[#161b22]/40 border border-gray-800/60 rounded-2xl p-6 space-y-3'
          >
            <div className='h-4 bg-gray-800/50 rounded-md w-32' />
            <div className='h-12 bg-gray-800/80 rounded-xl w-24' />
          </div>
        ))}
      </div>

      {/* Analytics Charts Panels */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className='bg-[#161b22]/40 border border-gray-800/60 rounded-2xl p-4 space-y-4'
          >
            <div className='h-5 bg-gray-800/60 rounded-md w-32' />
            <div className='h-64 bg-gray-800/30 rounded-xl' />
          </div>
        ))}
      </div>

      {/* Distribution Split Tables Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className='bg-[#161b22]/40 border border-gray-800/60 rounded-2xl p-4 space-y-4'
          >
            <div className='h-5 bg-gray-800/60 rounded-md w-40' />
            <div className='space-y-2'>
              {[...Array(5)].map((_, j) => (
                <div key={j} className='h-8 bg-gray-800/30 rounded-xl w-full' />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Top Products Table Block */}
      <div className='bg-[#161b22]/40 border border-gray-800/60 rounded-2xl p-6 shadow-2xl'>
        <div className='h-6 bg-gray-800/70 rounded-md w-48 mb-6' />
        <div className='overflow-hidden rounded-xl border border-gray-800/40'>
          <div className='bg-[#161b22]/80 border-b border-gray-800/60'>
            <div className='grid grid-cols-3 gap-4 p-4 h-12 items-center' />
          </div>
          <div className='divide-y divide-gray-800/30'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='grid grid-cols-3 gap-4 p-4 h-12 items-center bg-transparent'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton

