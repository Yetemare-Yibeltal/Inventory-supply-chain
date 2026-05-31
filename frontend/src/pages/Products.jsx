import { useState, useEffect, useCallback } from 'react'
import API from '../services/api'
import useCategories from '../hooks/useCategories'
import useSuppliers from '../hooks/useSuppliers'
import { usePermissions } from '../hooks/usePermissions'
import ProductSkeleton from '../components/Skeleton/ProductSkeleton'

const INITIAL_FORM_STATE = {
  name: '',
  sku: '',
  price: '',
  quantityOnHand: '',
  reorderPoint: '',
  category: '',
  supplier: ''
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)

  const { categories } = useCategories()
  const { suppliers } = useSuppliers()
  const { canCreate, canUpdate, canDelete } = usePermissions()

  // Wrapped in useCallback to prevent unneeded redeclarations
  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to resolve stock manifests:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData(INITIAL_FORM_STATE)
    setShowModal(true)
  }

  const openEditModal = p => {
    setEditingProduct(p)
    setFormData({
      name: p.name || '',
      sku: p.sku || '',
      price: p.price ?? '',
      quantityOnHand: p.quantityOnHand ?? '',
      reorderPoint: p.reorderPoint ?? '',
      category: p.category?._id || p.category || '',
      supplier: p.supplier?._id || p.supplier || ''
    })
    setShowModal(true)
  }

  const handleChange = e => {
    const { name, value, type } = e.target
    // Automatically sanitize and parse numeric inputs safely
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, formData)
      } else {
        await API.post('/products', formData)
      }
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product configuration')
    }
  }

  const handleDelete = async id => {
    if (window.confirm('Purge this asset manifest entry permanently?')) {
      try {
        await API.delete(`/products/${id}`)
        fetchProducts()
      } catch (err) {
        alert(err.response?.data?.message || 'Asset deletion command failed')
      }
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-[#0d1117] p-6'>
        <ProductSkeleton />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-6 font-sans relative overflow-hidden'>
      {/* Decorative Blur Accent */}
      <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto z-10'>
        {/* Module Title Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
              Master Asset Registry
            </h1>
            <p className='text-xs text-gray-400 mt-1'>
              Monitor, adjust, and control system-wide stock manifests
            </p>
          </div>

          {canCreate && (
            <button
              onClick={openAddModal}
              className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 transition-all duration-200 active:scale-[0.98] flex items-center gap-2'
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
                  d='M12 4v16m8-8H4'
                />
              </svg>
              Register New Asset
            </button>
          )}
        </div>

        {/* Centralized Grid Data Table */}
        <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-800/60'>
              <thead className='bg-[#161b22]/80'>
                <tr className='text-left text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                  <th className='px-6 py-4'>Asset Identification</th>
                  <th className='px-6 py-4'>SKU Space</th>
                  <th className='px-6 py-4 text-right'>Unit Pricing</th>
                  <th className='px-6 py-4 text-right'>Capacity</th>
                  <th className='px-6 py-4'>Classification</th>
                  <th className='px-6 py-4'>Source Supplier</th>
                  <th className='px-6 py-4 text-center'>Operations</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-800/40 bg-transparent text-sm'>
                {products.map(p => {
                  const isLowStock = p.quantityOnHand <= p.reorderPoint
                  return (
                    <tr
                      key={p._id}
                      className='hover:bg-gray-800/20 transition-colors duration-150 group'
                    >
                      <td className='px-6 py-4 whitespace-nowrap font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors'>
                        {p.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-400'>
                        {p.sku}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right font-mono text-emerald-400 font-medium'>
                        Br{' '}
                        {typeof p.price === 'number'
                          ? p.price.toFixed(2)
                          : '0.00'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right font-mono'>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            isLowStock
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse'
                              : 'text-gray-300'
                          }`}
                        >
                          {p.quantityOnHand}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-gray-400'>
                        {p.category?.name || (
                          <span className='text-gray-600 italic'>
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-gray-400 max-w-xs truncate'>
                        {p.supplier?.name || (
                          <span className='text-gray-600 italic'>
                            None linked
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          <button
                            disabled={!canUpdate}
                            onClick={
                              canUpdate ? () => openEditModal(p) : undefined
                            }
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                              !canUpdate
                                ? 'border-gray-800/60 text-gray-600 cursor-not-allowed opacity-40'
                                : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/40'
                            }`}
                          >
                            Modify
                          </button>
                          <button
                            disabled={!canDelete}
                            onClick={
                              canDelete ? () => handleDelete(p._id) : undefined
                            }
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                              !canDelete
                                ? 'border-gray-800/60 text-gray-600 cursor-not-allowed opacity-40'
                                : 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40'
                            }`}
                          >
                            Purge
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className='p-12 text-center text-gray-500'>
              <svg
                className='w-12 h-12 text-gray-700 mx-auto mb-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
              <h3 className='text-sm font-medium text-gray-400'>
                No Asset Elements Found
              </h3>
              <p className='text-xs text-gray-600 mt-1'>
                Database cluster is currently empty.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Control Overlay Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-center z-50 p-4'>
          <div className='relative w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden'>
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' />

            <h2 className='text-xl font-bold tracking-tight text-white mb-6'>
              {editingProduct
                ? 'Update Core Asset Entry'
                : 'Register New Asset Entry'}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                  Asset Name
                </label>
                <input
                  name='name'
                  placeholder='e.g., Quantum Storage Controller'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                    SKU Code
                  </label>
                  <input
                    name='sku'
                    placeholder='SKU-XXXX'
                    value={formData.sku}
                    onChange={handleChange}
                    className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono'
                    required
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                    Base Valuation (Br)
                  </label>
                  <input
                    name='price'
                    type='number'
                    step='0.01'
                    placeholder='0.00'
                    value={formData.price}
                    onChange={handleChange}
                    className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                    Initial Qty
                  </label>
                  <input
                    name='quantityOnHand'
                    type='number'
                    placeholder='0'
                    value={formData.quantityOnHand}
                    onChange={handleChange}
                    className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
                    required
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                    Reorder Boundary
                  </label>
                  <input
                    name='reorderPoint'
                    type='number'
                    placeholder='Min Alert Qty'
                    value={formData.reorderPoint}
                    onChange={handleChange}
                    className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                  Structural Classification
                </label>
                <select
                  name='category'
                  value={formData.category}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
                  required
                >
                  <option value='' className='bg-[#161b22]'>
                    Select Category Node
                  </option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id} className='bg-[#161b22]'>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                  Assigned Vendor Supplier
                </label>
                <select
                  name='supplier'
                  value={formData.supplier}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
                  required
                >
                  <option value='' className='bg-[#161b22]'>
                    Select Supplier Node
                  </option>
                  {suppliers.map(s => (
                    <option key={s._id} value={s._id} className='bg-[#161b22]'>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex justify-end items-center gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800/40 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-sm font-medium rounded-xl shadow-md transition-all'
                >
                  Commit Entry
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
