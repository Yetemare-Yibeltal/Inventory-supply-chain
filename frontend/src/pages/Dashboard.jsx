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

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#A28F9C',
  '#E76F51'
]

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
    const fetchData = async () => {
      try {
        const [productsRes, posRes] = await Promise.all([
          API.get('/products'),
          API.get('/purchase-orders')
        ])
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
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
        })
      } catch (error) {
        console.error('Dashboard error', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white shadow rounded-lg p-6'>
          <h3 className='text-gray-500'>Total Products</h3>
          <p className='text-3xl font-bold'>{data.totalProducts}</p>
        </div>
        <div className='bg-white shadow rounded-lg p-6'>
          <h3 className='text-gray-500'>Low Stock Alert</h3>
          <p className='text-3xl font-bold text-red-600'>
            {data.lowStockCount}
          </p>
        </div>
        <div className='bg-white shadow rounded-lg p-6'>
          <h3 className='text-gray-500'>Pending Purchase Orders</h3>
          <p className='text-3xl font-bold text-yellow-600'>
            {data.pendingOrdersCount}
          </p>
        </div>
      </div>

      {/* Pie Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white shadow rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-4'>Inventory Overview</h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={data.categoryStats}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={100}
                label
              >
                {data.categoryStats.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-4'>
            Purchase Orders by Status
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={data.statusStats}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={100}
                label
              >
                {data.statusStats.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Low Stock and Recent POs */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white shadow rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-4'>Recent Low Stock</h3>
          {data.recentLowStock.length === 0 ? (
            <p className='text-gray-500'>No low stock products</p>
          ) : (
            <ul className='space-y-2'>
              {data.recentLowStock.map((item, i) => (
                <li key={i} className='flex justify-between border-b pb-1'>
                  <span>{item.name}</span>
                  <span className='text-sm text-gray-500'>SKU: {item.sku}</span>
                  <span>
                    {item.qty} / {item.reorder}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to='/low-stock'
            className='text-blue-500 text-sm mt-2 inline-block'
          >
            View all low stock →
          </Link>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-4'>Recent Purchase Orders</h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='p-2 text-left'>PO Number</th>
                  <th className='p-2 text-left'>Supplier</th>
                  <th className='p-2 text-left'>Date</th>
                  <th className='p-2 text-right'>Total</th>
                  <th className='p-2 text-left'>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPurchaseOrders.map(po => (
                  <tr key={po.poNumber} className='border-b'>
                    <td className='p-2'>{po.poNumber}</td>
                    <td className='p-2'>{po.supplier}</td>
                    <td className='p-2'>{po.date}</td>
                    <td className='p-2 text-right'>
                      Br {po.totalAmount?.toFixed(2) ?? '0.00'}
                    </td>
                    <td className='p-2'>
                      <span
                        className={`w-24 h-9 flex items-center justify-center text-xs font-medium rounded-full shadow-sm transition-all ${
                          po.status === 'RECEIVED'
                            ? 'bg-green-100 text-green-800 border border-green-200 hover:scale-105 hover:shadow-md'
                            : po.status === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200 hover:scale-105 hover:shadow-md'
                            : po.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200 hover:scale-105 hover:shadow-md'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200 hover:scale-105 hover:shadow-md'
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
      </div>

      {/* Top Selling Products */}
      <div className='bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100'>
        <h3 className='text-xl font-bold mb-6 text-gray-800'>
          Top Selling Products
        </h3>
        <div className='overflow-x-auto rounded-lg border'>
          <table className='min-w-full text-sm divide-y divide-gray-200'>
            <thead className='bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0'>
              <tr>
                <th className='px-6 py-4 text-left font-semibold text-gray-900 uppercase tracking-wider max-w-xs truncate'>
                  Product
                </th>
                <th className='px-6 py-4 text-right font-semibold text-gray-900 uppercase tracking-wider'>
                  Sold Qty
                </th>
                <th className='px-6 py-4 text-right font-semibold text-gray-900 uppercase tracking-wider'>
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {data.topProducts.map((p, i) => (
                <tr
                  key={i}
                  className='hover:bg-gray-50 transition-colors duration-200'
                >
                  <td className='px-6 py-4 max-w-xs truncate text-gray-900 font-medium'>
                    {p.name}
                  </td>
                  <td className='px-6 py-4 text-right text-gray-900 font-semibold'>
                    {p.soldQty}
                  </td>
                  <td className='p-3 text-right font-bold text-green-600'>
                    Br {p.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
              {data.topProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className='px-6 py-12 text-center text-gray-500'
                  >
                    No sales data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className='text-center text-gray-500 text-sm border-t pt-4'>
        © 2025 SupplyChain Tracker. All rights reserved.
      </footer>
    </div>
  )
}
export default Dashboard
