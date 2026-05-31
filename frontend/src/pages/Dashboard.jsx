import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import API from '../services/api'
import DashboardSkeleton from '../components/Skeleton/DashboardSkeleton'
import DashboardScene from '../components/Dashboard/DashboardScene'

const RADAR_COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4'
]

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  // FIX: Initialize with empty arrays to prevent "undefined" errors during render
  const [data, setData] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    categoryStats: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await API.get('/dashboard-stats') // Ensure your API endpoint is correct
        setData(res.data)
      } catch (err) {
        console.error('Dashboard load failure:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className='min-h-screen bg-[#09090b] text-gray-100 p-6 space-y-8'>
      {/* 1. Hero Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* FIX: Ensure container has a defined background or border to see if it's rendering */}
        <div className='lg:col-span-2 h-[400px] bg-[#161b22]/20 rounded-2xl border border-gray-800 overflow-hidden'>
          <DashboardScene />
        </div>

        <div className='grid grid-cols-1 gap-4'>
          <div className='bg-[#161b22]/40 border border-gray-800 p-6 rounded-2xl'>
            <h3 className='text-xs font-semibold uppercase text-gray-400'>
              Total Inventory
            </h3>
            <p className='text-4xl font-black text-white'>
              {data.totalProducts}
            </p>
          </div>
          <div className='bg-[#161b22]/40 border border-gray-800 p-6 rounded-2xl'>
            <h3 className='text-xs font-semibold uppercase text-gray-400'>
              Critical Alerts
            </h3>
            <p className='text-4xl font-black text-rose-500'>
              {data.lowStockCount}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Analytical Graphics Row */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-[#161b22]/40 border border-gray-800 rounded-2xl p-6'>
          <h3 className='text-sm font-bold uppercase text-gray-300 mb-4'>
            Allocation Matrix
          </h3>
          <div className='h-[300px]'>
            {data.categoryStats?.length > 0 ? (
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={data.categoryStats}
                    dataKey='value'
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {data.categoryStats.map((e, i) => (
                      <Cell
                        key={i}
                        fill={RADAR_COLORS[i % RADAR_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className='text-gray-500 text-center mt-20'>
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
