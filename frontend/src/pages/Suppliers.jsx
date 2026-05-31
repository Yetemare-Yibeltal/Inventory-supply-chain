import { useState, useEffect } from 'react'
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

  const fetchSuppliers = async () => {
    try {
      const res = await API.get('/suppliers')
      setSuppliers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

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
      alert(err.response?.data?.message || 'Error saving supplier')
    }
  }

  const handleDelete = async id => {
    if (window.confirm('Delete this supplier?')) {
      try {
        await API.delete(`/suppliers/${id}`)
        fetchSuppliers()
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed')
      }
    }
  }

  if (loading) {
    return <div className='p-4 text-center'>Loading suppliers...</div>
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
          Suppliers
        </h1>
        {canCreate && (
          <button
            onClick={openAddModal}
            className='bg-gradient-to-r from-green-500 to-emerald-700 text-white px-4 py-2 rounded hover:opacity-90 hover:shadow-md transition-all'
          >
            + Add Supplier
          </button>
        )}
      </div>

      <div className='bg-white shadow-lg rounded-xl overflow-x-auto'>
        <table className='min-w-full'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-left'>Name</th>
              <th className='p-3 text-left'>Contact Person</th>
              <th className='p-3 text-left'>Email</th>
              <th className='p-3 text-left'>Phone</th>
              <th className='p-3 text-left'>Address</th>
              <th className='p-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier._id} className='border-b hover:bg-gray-50'>
                <td className='p-3 font-semibold'>{supplier.name}</td>
                <td className='p-3'>{supplier.contactPerson || '-'}</td>
                <td className='p-3'>{supplier.email || '-'}</td>
                <td className='p-3'>{supplier.phone || '-'}</td>
                <td className='p-3'>{supplier.address || '-'}</td>
                <td className='p-3 flex items-center justify-center gap-2 min-w-[160px]'>
                  <button
                    disabled={!canUpdate}
                    onClick={
                      canUpdate ? () => openEditModal(supplier) : undefined
                    }
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
                    onClick={
                      canDelete ? () => handleDelete(supplier._id) : undefined
                    }
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
        {suppliers.length === 0 && (
          <div className='p-4 text-center text-gray-500'>
            No suppliers found
          </div>
        )}
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col pt-[20vh] pb-[10vh] justify-start items-center z-50 overflow-y-auto'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4'>
            <h2 className='text-xl font-bold mb-4'>
              {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                name='name'
                placeholder='Supplier Name *'
                value={formData.name}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
                required
              />
              <input
                name='contactPerson'
                placeholder='Contact Person'
                value={formData.contactPerson}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
              />
              <input
                name='email'
                type='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
              />
              <input
                name='phone'
                placeholder='Phone'
                value={formData.phone}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
              />
              <textarea
                name='address'
                placeholder='Address'
                value={formData.address}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-4'
                rows='2'
              />
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

export default Suppliers
