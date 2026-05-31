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
    if (!supplierId) return alert('No supplier')
    const qty = prompt(
      `Quantity for ${product.name}:`,
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
      alert('PO created')
      fetchLowStock()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }
  const autoCreateAll = async () => {
    try {
      const res = await API.post('/purchase-orders/auto-create')
      alert(`Created ${res.data.orders?.length || 0} POs`)
      fetchLowStock()
    } catch (err) {
      alert('Auto-create failed')
    }
  }

  if (loading)
    return <div className='p-4 text-center'>Loading low stock products...</div>

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>
          Low Stock Alerts
        </h1>
        {canCreate && (
          <button
            onClick={autoCreateAll}
            className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded hover:opacity-90'
          >
            Auto‑Create POs for All
          </button>
        )}
      </div>
      {products.length === 0 ? (
        <div className='bg-green-100 text-green-800 p-4 rounded-lg text-center'>
          No low stock products. Good inventory!
        </div>
      ) : (
        <div className='bg-white shadow-lg rounded-xl overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='p-3 text-left'>Product</th>
                <th className='p-3 text-left'>SKU</th>
                <th className='p-3 text-right'>On Hand</th>
                <th className='p-3 text-right'>Reorder Point</th>
                <th className='p-3 text-left'>Supplier</th>
                <th className='p-3 text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className='border-b hover:bg-gray-50'>
                  <td className='p-3 font-semibold'>{p.name}</td>
                  <td className='p-3'>{p.sku}</td>
                  <td className='p-3 text-right text-red-600 font-bold'>
                    {p.quantityOnHand}
                  </td>
                  <td className='p-3 text-right'>{p.reorderPoint}</td>
                  <td className='p-3'>{p.supplier?.name || '-'}</td>
                  <td className='p-3 text-center'>
                    {canCreate && (
                      <button
                        onClick={() => createPOForProduct(p)}
                        className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded text-sm hover:opacity-90'
                      >
                        Create PO
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
export default LowStock
