import { useState, useEffect } from 'react'
import API from '../services/api'
import { usePermissions } from '../hooks/usePermissions'

const LowStock = () => {
  const { canCreate } = usePermissions()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLowStock = async () => {
    try {
      const res = await API.get('/products/low-stock')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLowStock()
  }, [])

  const createPOForProduct = async product => {
    const supplierId = product.supplier?._id || product.supplier
    if (!supplierId) return alert('No valid supplier node mapped to asset')
    const qty = prompt(
      `Specify target purchase quantity for ${product.name}:`,
      product.reorderPoint * 2
    )
    if (!qty || isNaN(qty)) return
    try {
      await API.post('/purchase-orders', {
        supplier: supplierId,
        items: [
          {
            product: product._id,
            quantity: parseInt(qty),
            unitPrice: product.price
          }
        ]
      })
      alert('Purchase order batch initialized successfully.')
      fetchLowStock()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to dispatch purchase order request'
      )
    }
  }

  const autoCreateAll = async () => {
    try {
      const res = await API.post('/purchase-orders/auto-create')
      alert(
        `Automated run complete. generated ${
          res.data.orders?.length || 0
        } purchase logs.`
      )
      fetchLowStock()
    } catch (err) {
      alert('Automated background generation engine failure')
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#0d1117]'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin' />
          <span className='text-xs font-semibold tracking-wider text-gray-400 uppercase'>
            Scanning Storage Levels...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-6 font-sans relative overflow-hidden'>
      {/* Background Ambient Emergency Glow Grid */}
      <div className='absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/5 blur-[120px] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto z-10'>
        {/* Module Header View Area */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <div className='flex items-center gap-2'>
              <span className='flex h-2 w-2 relative'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75' />
                <span className='relative inline-flex rounded-full h-2 w-2 bg-rose-500' />
              </span>
              <h1 className='text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
                Critical Depletion Center
              </h1>
            </div>
            <p className='text-xs text-gray-400 mt-1'>
              Real-time depletion alerts and automated item restock triggers
            </p>
          </div>

          {canCreate && products.length > 0 && (
            <button
              onClick={autoCreateAll}
              className='bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-rose-500/10 transition-all duration-200 active:scale-[0.98] flex items-center gap-2'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
              Auto-Generate All Pending POs
            </button>
          )}
        </div>

        {/* Dynamic State Evaluation Matrix */}
        {products.length === 0 ? (
          <div className='relative bg-emerald-950/20 border border-emerald-500/20 p-8 rounded-2xl text-center shadow-2xl backdrop-blur-md max-w-2xl mx-auto mt-12 overflow-hidden group'>
            <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            <svg
              className='w-12 h-12 text-emerald-400 mx-auto mb-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.5'
                d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
              />
            </svg>
            <h3 className='text-base font-bold text-emerald-400 tracking-tight'>
              All Storage Nodes nominal
            </h3>
            <p className='text-xs text-gray-400 mt-1 max-w-md mx-auto'>
              No under-stock variations identified. Supply lines match current
              inventory thresholds.
            </p>
          </div>
        ) : (
          <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-800/60'>
                <thead className='bg-[#161b22]/80'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                      Asset Manifest
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                      SKU Space Reference
                    </th>
                    <th className='px-6 py-4 text-right text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                      On Hand Capacity
                    </th>
                    <th className='px-6 py-4 text-right text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                      Trigger Point
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                      Source Supplier Node
                    </th>
                    <th className='px-6 py-4 text-center text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                      Logistics Pipeline
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-800/40 bg-transparent'>
                  {products.map(p => (
                    <tr
                      key={p._id}
                      className='hover:bg-gray-800/20 transition-colors duration-150 group'
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-3'>
                          <div className='w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse' />
                          <span className='font-semibold text-gray-200 group-hover:text-rose-400 transition-colors duration-150'>
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono'>
                        {p.sku}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-rose-500 font-bold'>
                        {p.quantityOnHand}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-gray-400'>
                        {p.reorderPoint}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='text-sm text-gray-400 max-w-xs block truncate'>
                          {p.supplier?.name || (
                            <span className='text-gray-600 italic'>
                              No node linked
                            </span>
                          )}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                        {canCreate ? (
                          <button
                            onClick={() => createPOForProduct(p)}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-200'
                          >
                            Dispatch PO
                          </button>
                        ) : (
                          <span className='text-xs text-gray-600 italic'>
                            Read-Only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LowStock

