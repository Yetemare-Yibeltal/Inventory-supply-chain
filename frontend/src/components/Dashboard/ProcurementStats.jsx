import React from 'react'

const ProcurementStats = ({ orders }) => {
  // Simple calculation for example stats
  const totalOrders = orders.length
  const totalValue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  )

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <div className='bg-[#161b22] p-4 rounded-xl border border-gray-800'>
        <h3 className='text-gray-400 text-xs uppercase font-bold'>
          Total Orders
        </h3>
        <p className='text-2xl font-bold text-white'>{totalOrders}</p>
      </div>
      <div className='bg-[#161b22] p-4 rounded-xl border border-gray-800'>
        <h3 className='text-gray-400 text-xs uppercase font-bold'>
          Total Valuation
        </h3>
        <p className='text-2xl font-bold text-emerald-400'>
          Br {totalValue.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default ProcurementStats
