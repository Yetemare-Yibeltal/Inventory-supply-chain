import { useState, useEffect, useCallback } from 'react'
import API from '../services/api'
import { usePermissions } from '../hooks/usePermissions'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  })
  const { canCreate, canUpdate, canDelete } = usePermissions()

  // High-performance memoized data pipeline reference
  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await API.get('/suppliers')
      setSuppliers(res.data)
    } catch (err) {
      console.error('Vendor directory synchronization breakdown:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const openAddModal = () => {
    setEditingSupplier(null)
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    })
    setShowModal(true)
  }

  const openEditModal = supplier => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
    })
    setShowModal(true)
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editingSupplier) {
        await API.put(`/suppliers/${editingSupplier._id}`, formData)
      } else {
        await API.post('/suppliers', formData)
      }
      setShowModal(false)
      fetchSuppliers()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Error processing vendor endpoint command matrix'
      )
    }
  }

  const handleDelete = async id => {
    if (
      window.confirm(
        'Sever communication lines and purge this vendor record permanently from the node network?'
      )
    ) {
      try {
        await API.delete(`/suppliers/${id}`)
        fetchSuppliers()
      } catch (err) {
        alert(
          err.response?.data?.message || 'Vendor elimination script aborted'
        )
      }
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#0d1117]'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin' />
          <span className='text-xs font-semibold tracking-wider text-gray-400 uppercase'>
            Indexing Vendor Clusters...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-6 font-sans relative overflow-hidden'>
      {/* Dynamic Ambient Blur Lens Flares */}
      <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto z-10'>
        {/* Module Header Section */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
              Vendor Directory Matrix
            </h1>
            <p className='text-xs text-gray-400 mt-1'>
              Configure structural links, connection nodes, and B2B vendor
              channels
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
              Establish New Link
            </button>
          )}
        </div>

        {/* Data Grid Section */}
        <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-800/60'>
              <thead className='bg-[#161b22]/80'>
                <tr className='text-left text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                  <th className='px-6 py-4'>Supplier Identity</th>
                  <th className='px-6 py-4'>Point of Contact</th>
                  <th className='px-6 py-4'>Secure Mail Address</th>
                  <th className='px-6 py-4'>Comms Phone Line</th>
                  <th className='px-6 py-4'>Physical Coordinates</th>
                  <th className='px-6 py-4 text-center'>Operations</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-800/40 bg-transparent text-sm'>
                {suppliers.map(supplier => (
                  <tr
                    key={supplier._id}
                    className='hover:bg-gray-800/20 transition-colors duration-150 group'
                  >
                    <td className='px-6 py-4 whitespace-nowrap font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors'>
                      {supplier.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-gray-300'>
                      {supplier.contactPerson || (
                        <span className='text-gray-600 italic'>None</span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-xs'>
                      {supplier.email || (
                        <span className='text-gray-600 italic'>-</span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-xs'>
                      {supplier.phone || (
                        <span className='text-gray-600 italic'>-</span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-gray-400 max-w-xs truncate'>
                      {supplier.address || (
                        <span className='text-gray-600 italic'>
                          No coordinates stored
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-center'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          disabled={!canUpdate}
                          onClick={
                            canUpdate
                              ? () => openEditModal(supplier)
                              : undefined
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
                            canDelete
                              ? () => handleDelete(supplier._id)
                              : undefined
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                            !canDelete
                              ? 'border-gray-800/60 text-gray-600 cursor-not-allowed opacity-40'
                              : 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40'
                          }`}
                        >
                          Sever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {suppliers.length === 0 && (
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
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              <h3 className='text-sm font-medium text-gray-400'>
                Directory Grid Empty
              </h3>
              <p className='text-xs text-gray-600 mt-1'>
                No supplier endpoints registered in this node stack.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Slide/Fade Overlay Modal Form Drawer */}
      {showModal && (
        <div className='fixed inset-0 bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn'>
          <div className='relative w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden scale-in'>
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' />

            <h2 className='text-xl font-bold tracking-tight text-white mb-6'>
              {editingSupplier
                ? 'Modify Vendor Link Configuration'
                : 'Establish New Vendor Link'}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                  Supplier Entity Name *
                </label>
                <input
                  name='name'
                  placeholder='e.g., Apex Logistics Core'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
                  required
                />
              </div>

              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                  Personnel Contact Name
                </label>
                <input
                  name='contactPerson'
                  placeholder='e.g., Sarah Jenkins'
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
                />
              </div>

              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                  Comms Endpoint Mail
                </label>
                <input
                  name='email'
                  type='email'
                  placeholder='name@vendor-root.com'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono'
                />
              </div>

              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                  Secure Hot Phone Line
                </label>
                <input
                  name='phone'
                  placeholder='+1 (555) 019-2831'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono'
                />
              </div>

              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1'>
                  Physical Distribution Coordinates
                </label>
                <textarea
                  name='address'
                  placeholder='Enter complete depot, city, and shipping terminal codes...'
                  value={formData.address}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none'
                  rows='2'
                />
              </div>

              <div className='flex justify-end items-center gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800/40 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-sm font-medium rounded-xl shadow-md transition-all'
                >
                  Save Manifest Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Suppliers

// ==========================================
// GIT ATOMIC COMMIT TERMINAL COMMAND:
// git add src/pages/Suppliers.jsx && git commit -m "refactor(vendor): optimize network registry views with memoized data hooks and animations"
// ==========================================
