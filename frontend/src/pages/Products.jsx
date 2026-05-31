import { useState, useEffect } from 'react'
import API from '../services/api'
import useCategories from '../hooks/useCategories'
import useSuppliers from '../hooks/useSuppliers'
import { usePermissions } from '../hooks/usePermissions'
import ProductSkeleton from '../components/Skeleton/ProductSkeleton'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantityOnHand: '',
    reorderPoint: '',
    category: '',
    supplier: ''
  })
  const { categories } = useCategories()
  const { suppliers } = useSuppliers()
  const { canCreate, canUpdate, canDelete } = usePermissions()

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [])

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      sku: '',
      price: '',
      quantityOnHand: '',
      reorderPoint: '',
      category: '',
      supplier: ''
    })
    setShowModal(true)
  }
  const openEditModal = p => {
    setEditingProduct(p)
    setFormData({
      name: p.name,
      sku: p.sku,
      price: p.price,
      quantityOnHand: p.quantityOnHand,
      reorderPoint: p.reorderPoint,
      category: p.category?._id || p.category,
      supplier: p.supplier?._id || p.supplier
    })
    setShowModal(true)
  }
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editingProduct)
        await API.put(`/products/${editingProduct._id}`, formData)
      else await API.post('/products', formData)
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product')
    }
  }
  const handleDelete = async id => {
    if (window.confirm('Delete this product?')) {
      try {
        await API.delete(`/products/${id}`)
        fetchProducts()
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed')
      }
    }
  }
  if (loading) return <ProductSkeleton />

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
          Products
        </h1>
        {canCreate && (
          <button
            onClick={openAddModal}
            className='bg-gradient-to-r from-green-500 to-emerald-700 text-white px-4 py-2 rounded hover:opacity-90'
          >
            + Add Product
          </button>
        )}
      </div>
      <div className='bg-white shadow-lg rounded-xl overflow-x-auto'>
        <table className='min-w-full'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-left'>Name</th>
              <th className='p-3 text-left'>SKU</th>
              <th className='p-3 text-right'>Price</th>
              <th className='p-3 text-right'>Qty</th>
              <th className='p-3 text-left'>Category</th>
              <th className='p-3 text-left'>Supplier</th>
              <th className='p-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className='border-b hover:bg-gray-50'>
                <td className='p-3'>{p.name}</td>
                <td className='p-3'>{p.sku}</td>
                <td className='p-3 text-right'>Br {p.price?.toFixed(2)}</td>
                <td className='p-3 text-right'>{p.quantityOnHand}</td>
                <td className='p-3'>{p.category?.name || '-'}</td>
                <td className='p-3'>{p.supplier?.name || '-'}</td>
                <td className='p-3 flex items-center justify-center gap-2 min-w-[160px]'>
                  <button
                    disabled={!canUpdate}
                    onClick={canUpdate ? () => openEditModal(p) : undefined}
                    className={`w-20 h-9 flex items-center justify-center text-xs font-medium rounded-full shadow-sm bg-white border border-blue-200 text-blue-500 ${
                      !canUpdate
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:text-blue-700 hover:scale-105 hover:shadow-md transition-all'
                    }`}
                  >
                    Edit
                  </button>

                  <button
                    disabled={!canDelete}
                    onClick={canDelete ? () => handleDelete(p._id) : undefined}
                    className={`w-20 h-9 flex items-center justify-center text-xs font-medium rounded-full shadow-sm bg-white border border-red-200 text-red-500 ${
                      !canDelete
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:text-red-700 hover:scale-105 hover:shadow-md transition-all'
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className='p-4 text-center text-gray-500'>No products</div>
        )}
      </div>
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col pt-[20vh] pb-[10vh] justify-start items-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                name='name'
                placeholder='Name'
                value={formData.name}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
                required
              />
              <input
                name='sku'
                placeholder='SKU'
                value={formData.sku}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
                required
              />
              <input
                name='price'
                type='number'
                step='0.01'
                placeholder='Price'
                value={formData.price}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
                required
              />
              <input
                name='quantityOnHand'
                type='number'
                placeholder='Qty'
                value={formData.quantityOnHand}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
                required
              />
              <input
                name='reorderPoint'
                type='number'
                placeholder='Reorder Point'
                value={formData.reorderPoint}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
                required
              />
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
                required
              >
                <option value=''>Select Category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                name='supplier'
                value={formData.supplier}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-4'
                required
              >
                <option value=''>Select Supplier</option>
                {suppliers.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 border rounded hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded hover:opacity-90'
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default Products
