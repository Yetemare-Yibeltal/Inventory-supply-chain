import { useEffect, useState } from 'react'
import DashboardSkeleton from '../components/Skeleton/DashboardSkeleton'
import { Link } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import API from '../services/api'

const RADAR_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4' // Cyan
]

// High-fidelity custom chart tooltip component
const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-[#161b22] border border-gray-800 p-3 rounded-xl shadow-2xl backdrop-blur-md'>
        <p className='text-xs font-bold text-gray-200 uppercase tracking-wider'>
          {payload[0].name}
        </p>
        <p className='text-sm font-extrabold text-indigo-400 mt-1'>
          Metrics Value: <span className='text-white'>{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    pendingOrdersCount: 0,
    categoryStats: [],
    statusStats: [],
    recentLowStock: [],
    recentPurchaseOrders: [],
    topProducts: []
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [productsRes, posRes] = await Promise.all([
          API.get('/products'),
          API.get('/purchase-orders')
        ])

        if (!isMounted) return

        const products = productsRes.data
        const purchaseOrders = posRes.data

        setData({
          totalProducts: products.length,
          lowStockCount: products.filter(
            p => p.quantityOnHand <= p.reorderPoint
          ).length,
          pendingOrdersCount: purchaseOrders.filter(
            po => po.status === 'PENDING'
          ).length,
          categoryStats: Object.entries(
            products.reduce((acc, p) => {
              const cat = p.category?.name || 'Uncategorized'
              acc[cat] = (acc[cat] || 0) + 1
              return acc
            }, {})
          ).map(([name, value]) => ({ name, value })),
          statusStats: Object.entries(
            purchaseOrders.reduce((acc, po) => {
              acc[po.status] = (acc[po.status] || 0) + 1
              return acc
            }, {})
          ).map(([name, value]) => ({ name, value })),
          recentLowStock: products
            .filter(p => p.quantityOnHand <= p.reorderPoint)
            .slice(0, 5)
            .map(p => ({
              name: p.name,
              sku: p.sku,
              qty: p.quantityOnHand,
              reorder: p.reorderPoint
            })),
          recentPurchaseOrders: [...purchaseOrders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(po => ({
              poNumber: po.poNumber,
              supplier: po.supplier?.name || 'Unknown',
              date: new Date(po.createdAt).toLocaleDateString(),
              totalAmount: po.totalAmount,
              status: po.status
            })),
          topProducts: Object.entries(
            purchaseOrders
              .filter(po => po.status === 'RECEIVED')
              .flatMap(po => po.items)
              .reduce((acc, item) => {
                const name = item.product?.name || 'Unknown'
                if (!acc[name]) acc[name] = { soldQty: 0, revenue: 0 }
                acc[name].soldQty += item.quantity
                acc[name].revenue += item.quantity * item.unitPrice
                return acc
              }, {})
          )
            .map(([name, { soldQty, revenue }]) => ({ name, soldQty, revenue }))
            // Safe copy array clone allocation before sorting data structures
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
        })
      } catch (error) {
        console.error('Dashboard pipeline engine mapping crash:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-6 font-sans relative overflow-hidden'>
      {/* Background Decorative Ambient light */}
      <div className='absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto z-10 space-y-8'>
        {/* Module Header View */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800/60 pb-6'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
              System Operations Control Center
            </h1>
            <p className='text-xs text-gray-400 mt-1'>
              Real-time macro supply logistics monitoring dashboard
            </p>
          </div>
          <div className='flex items-center gap-2 text-xs font-mono bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-lg text-emerald-400'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            Data Stream Active
          </div>
        </div>

        {/* Global Overview Metrics Summary Panel Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='relative bg-[#161b22]/40 backdrop-blur-md border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700/80 transition-all duration-200 group'>
            <div className='absolute top-0 left-0 w-2 h-full bg-indigo-500 rounded-l-2xl opacity-40 group-hover:opacity-100 transition-opacity' />
            <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
              Total Tracked Stock Items
            </h3>
            <p className='text-4xl font-black text-white mt-2 tracking-tight'>
              {data.totalProducts}
            </p>
          </div>

          <div
            className={`relative backdrop-blur-md border p-6 rounded-2xl shadow-xl hover:border-gray-700/80 transition-all duration-200 group ${
              data.lowStockCount > 0
                ? 'bg-rose-500/[0.02] border-rose-500/20'
                : 'bg-[#161b22]/40 border-gray-800'
            }`}
          >
            <div className='absolute top-0 left-0 w-2 h-full bg-rose-500 rounded-l-2xl opacity-40 group-hover:opacity-100 transition-opacity' />
            <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
              Critical Stock Alerts
            </h3>
            <p
              className={`text-4xl font-black mt-2 tracking-tight ${
                data.lowStockCount > 0
                  ? 'text-rose-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'text-white'
              }`}
            >
              {data.lowStockCount}
            </p>
          </div>

          <div className='relative bg-[#161b22]/40 backdrop-blur-md border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700/80 transition-all duration-200 group'>
            <div className='absolute top-0 left-0 w-2 h-full bg-amber-500 rounded-l-2xl opacity-40 group-hover:opacity-100 transition-opacity' />
            <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
              Pending Logistics Orders
            </h3>
            <p className='text-4xl font-black text-amber-500 mt-2 tracking-tight'>
              {data.pendingOrdersCount}
            </p>
          </div>
        </div>

        {/* Dynamic Recharts Analytical Graphics Arrays */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-gray-300 mb-6'>
              Inventory Allocation Matrix
            </h3>
            <div className='w-full h-[300px] flex-1'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={data.categoryStats}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={4}
                    label={{ fill: '#9ca3af', fontSize: 10, fontWeight: 500 }}
                  >
                    {data.categoryStats.map((e, i) => (
                      <Cell
                        key={i}
                        fill={RADAR_COLORS[i % RADAR_COLORS.length]}
                        stroke='#0d1117'
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                    iconType='circle'
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-gray-300 mb-6'>
              Purchase Orders Log Distribution
            </h3>
            <div className='w-full h-[300px] flex-1'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={data.statusStats}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={4}
                    label={{ fill: '#9ca3af', fontSize: 10, fontWeight: 500 }}
                  >
                    {data.statusStats.map((e, i) => (
                      <Cell
                        key={i}
                        fill={RADAR_COLORS[(i + 2) % RADAR_COLORS.length]}
                        stroke='#0d1117'
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                    iconType='circle'
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Operational Status Panels and System Logs */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Critical Low Stock Warnings Log list */}
          <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between'>
            <div>
              <h3 className='text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2'>
                <span
                  className={`w-2 h-2 rounded-full ${
                    data.recentLowStock.length > 0
                      ? 'bg-rose-500 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
                Critical Under-Stock Alert Log
              </h3>
              {data.recentLowStock.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <svg
                    className='w-8 h-8 text-emerald-500/40 mb-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <p className='text-xs text-gray-500'>
                    All storage items within nominal boundaries.
                  </p>
                </div>
              ) : (
                <div className='divide-y divide-gray-800/40'>
                  {data.recentLowStock.map((item, i) => (
                    <div
                      key={i}
                      className='flex justify-between items-center py-3 group'
                    >
                      <div className='space-y-0.5'>
                        <p className='text-sm font-semibold text-gray-200 group-hover:text-rose-400 transition-colors'>
                          {item.name}
                        </p>
                        <p className='text-xs text-gray-500 font-mono'>
                          SKU: {item.sku}
                        </p>
                      </div>
                      <div className='text-right'>
                        <span className='text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-1 rounded-lg font-bold font-mono'>
                          {item.qty} / {item.reorder} Left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link
              to='/low-stock'
              className='text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-4 flex items-center gap-1 w-fit group'
            >
              Access Complete Exhaustion Logs{' '}
              <span className='group-hover:translate-x-1 transition-transform'>
                →
              </span>
            </Link>
          </div>

          {/* Logistics Processing Orders Matrix Table */}
          <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden'>
            <div>
              <h3 className='text-sm font-bold uppercase tracking-wider text-gray-300 mb-4'>
                Recent Logistics Operations Orders
              </h3>
              <div className='overflow-x-auto'>
                <table className='min-w-full text-xs'>
                  <thead>
                    <tr className='border-b border-gray-800 text-gray-400 font-semibold text-left uppercase tracking-wider text-[10px]'>
                      <th className='pb-3'>PO Reference</th>
                      <th className='pb-3'>Supplier Origin</th>
                      <th className='pb-3 text-right'>Aggregate Cost</th>
                      <th className='pb-3 text-center'>Status Flag</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-800/30'>
                    {data.recentPurchaseOrders.map(po => (
                      <tr
                        key={po.poNumber}
                        className='hover:bg-gray-800/10 transition-colors'
                      >
                        <td className='py-3 font-mono font-medium text-indigo-400'>
                          {po.poNumber}
                        </td>
                        <td className='py-3 text-gray-400 max-w-[120px] truncate'>
                          {po.supplier}
                        </td>
                        <td className='py-3 text-right font-mono font-semibold text-gray-200'>
                          Br {po.totalAmount?.toFixed(2) ?? '0.00'}
                        </td>
                        <td className='py-3 text-center'>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border font-mono ${
                              po.status === 'RECEIVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : po.status === 'SHIPPED'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                : po.status === 'APPROVED'
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Link
              to='/purchase-orders'
              className='text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-4 flex items-center gap-1 w-fit group'
            >
              View Full Orders Stream{' '}
              <span className='group-hover:translate-x-1 transition-transform'>
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Top Operational Revenue Velocity Matrix Table */}
        <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl'>
          <h3 className='text-sm font-bold uppercase tracking-wider text-gray-300 mb-6'>
            High Velocity Inventory Assets
          </h3>
          <div className='overflow-x-auto rounded-xl border border-gray-800/60'>
            <table className='min-w-full text-sm divide-y divide-gray-800'>
              <thead className='bg-[#161b22]/80'>
                <tr className='text-xs font-semibold text-gray-400 tracking-wider text-left uppercase'>
                  <th className='px-6 py-4'>Asset Manifest Name</th>
                  <th className='px-6 py-4 text-right'>
                    Dispatched Quantities
                  </th>
                  <th className='px-6 py-4 text-right'>
                    Financial Yield Velocity
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-800/40 bg-transparent text-gray-300'>
                {data.topProducts.map((p, i) => (
                  <tr
                    key={i}
                    className='hover:bg-gray-800/20 transition-colors'
                  >
                    <td className='px-6 py-4 font-medium text-gray-200'>
                      {p.name}
                    </td>
                    <td className='px-6 py-4 text-right text-gray-400 font-mono font-semibold'>
                      {p.soldQty} units
                    </td>
                    <td className='px-6 py-4 text-right font-bold text-emerald-400 font-mono'>
                      Br {p.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {data.topProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className='px-6 py-12 text-center text-sm text-gray-500'
                    >
                      No distribution data pipeline metrics loaded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Module Core Branding */}
        <footer className='text-center text-gray-600 text-xs border-t border-gray-800/60 pt-6'>
          © {new Date().getFullYear()} SupplyChain Tracker Network Matrix.
          Production Stack Active.
        </footer>
      </div>
    </div>
  )
}

export default Dashboard
