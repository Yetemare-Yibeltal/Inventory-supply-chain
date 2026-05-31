import { useState, useEffect } from 'react'
import API from '../services/api'
import { usePermissions } from '../hooks/usePermissions'

const LowStock = () => {
  const { role, canCreate } = usePermissions()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLowStock = async () => {
    try {
      setLoading(true)
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
    if (!supplierId)
      return alert('No valid supplier node mapped to this asset.')

    const qty = prompt(
      `Specify quantity for ${product.name}:`,
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
      // This now captures the specific backend messages
      const serverMsg =
        err.response?.data?.message ||
        'Failed to dispatch purchase order request.'
      alert(serverMsg)
    }
  }

  const autoCreateAll = async () => {
    try {
      const res = await API.post('/purchase-orders/auto-create')
      alert(
        `Automated run complete. Generated ${
          res.data.orders?.length || 0
        } purchase logs.`
      )
      fetchLowStock()
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || 'Generation engine failure.'
      alert(serverMsg)
    }
  }

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#0d1117] text-gray-400'>
        Scanning...
      </div>
    )

  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-6 font-sans'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-extrabold text-white'>
            Critical Depletion Center
          </h1>
          {products.length > 0 && (
            <button
              onClick={autoCreateAll}
              className='bg-gradient-to-r from-amber-500 to-rose-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:brightness-110'
            >
              Auto-Generate All Pending POs
            </button>
          )}
        </div>

        <div className='bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden shadow-xl'>
          <table className='min-w-full divide-y divide-gray-800'>
            <tbody className='divide-y divide-gray-800'>
              {products.map(p => (
                <tr key={p._id}>
                  <td className='px-6 py-4'>{p.name}</td>
                  <td className='px-6 py-4 text-right text-rose-500 font-mono'>
                    {p.quantityOnHand}
                  </td>
                  <td className='px-6 py-4'>
                    {p.supplier?.name ? (
                      <span className='text-sm text-gray-400'>
                        {p.supplier.name}
                      </span>
                    ) : (
                      <span className='text-xs text-rose-500 italic'>
                        No node linked
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={() => createPOForProduct(p)}
                      className='px-3 py-1 text-xs rounded border border-indigo-500 text-indigo-400'
                    >
                      Dispatch PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LowStock
