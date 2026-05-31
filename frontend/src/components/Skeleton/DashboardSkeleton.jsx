import React from 'react'

const DashboardSkeleton = () => (
  <div className='animate-pulse'>
    {/* Header */}
    <div className='h-8 bg-gray-200 rounded w-48 mb-6'></div>

    {/* Summary Cards */}
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='bg-white shadow rounded-lg p-6'>
          <div className='h-4 bg-gray-200 rounded w-32 mb-2'></div>
          <div className='h-12 bg-gray-200 rounded w-24'></div>
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      {[...Array(2)].map((_, i) => (
        <div key={i} className='bg-white shadow rounded-lg p-4'>
          <div className='h-5 bg-gray-200 rounded w-32 mb-4'></div>
          <div className='h-64 bg-gray-200 rounded'></div>
        </div>
      ))}
    </div>

    {/* Tables */}
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      {[...Array(2)].map((_, i) => (
        <div key={i} className='bg-white shadow rounded-lg p-4'>
          <div className='h-5 bg-gray-200 rounded w-40 mb-4'></div>
          <div className='space-y-2'>
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className='flex justify-between h-8 bg-gray-200 rounded mb-1'
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Top Products Table */}
    <div className='bg-white shadow-lg rounded-xl p-6'>
      <div className='h-6 bg-gray-200 rounded w-48 mb-6'></div>
      <div className='overflow-hidden rounded-lg border'>
        <div className='bg-gradient-to-r from-gray-50 to-gray-100'>
          <div className='grid grid-cols-3 gap-4 p-4 h-12 items-center'></div>
        </div>
        <div className='divide-y divide-gray-200'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='grid grid-cols-3 gap-4 p-4 h-12 items-center'
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default DashboardSkeleton
