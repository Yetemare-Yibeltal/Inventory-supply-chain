import { useState, useEffect } from 'react'
import API from '../services/api'
import { usePermissions } from '../hooks/usePermissions'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const { canCreate, canUpdate, canDelete } = usePermissions()

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCategories()
  }, [])

  const openAddModal = () => {
    setEditingCat(null)
    setFormData({ name: '', description: '' })
    setShowModal(true)
  }
  const openEditModal = c => {
    setEditingCat(c)
    setFormData({ name: c.name, description: c.description || '' })
    setShowModal(true)
  }
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (editingCat) await API.put(`/categories/${editingCat._id}`, formData)
      else await API.post('/categories', formData)
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category')
    }
  }
  const handleDelete = async id => {
    if (window.confirm('Delete this category?')) {
      try {
        await API.delete(`/categories/${id}`)
        fetchCategories()
      } catch (err) {
        alert('Delete failed (maybe has products)')
      }
    }
  }
  if (loading)
    return <div className='p-4 text-center'>Loading categories...</div>

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
          Categories
        </h1>
        {canCreate && (
          <button
            onClick={openAddModal}
            className='bg-gradient-to-r from-green-500 to-emerald-700 text-white px-4 py-2 rounded hover:opacity-90'
          >
            + Add Category
          </button>
        )}
      </div>
      <div className='bg-white shadow-lg rounded-xl overflow-hidden'>
        <table className='min-w-full'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-left'>Name</th>
              <th className='p-3 text-left'>Description</th>
              <th className='p-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id} className='border-b hover:bg-gray-50'>
                <td className='p-3 font-semibold'>{c.name}</td>
                <td className='p-3 text-gray-600'>{c.description || '-'}</td>
                <td className='p-3 flex items-center justify-center gap-2 min-w-[160px]'>
                  <button
                    disabled={!canUpdate}
                    onClick={canUpdate ? () => openEditModal(c) : undefined}
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
                    onClick={canDelete ? () => handleDelete(c._id) : undefined}
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
        {categories.length === 0 && (
          <div className='p-4 text-center text-gray-500'>No categories</div>
        )}
      </div>
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col pt-[20vh] pb-[10vh] justify-start items-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>
              {editingCat ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                name='name'
                placeholder='Category Name'
                value={formData.name}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-2'
                required
              />
              <textarea
                name='description'
                placeholder='Description (optional)'
                value={formData.description}
                onChange={handleChange}
                className='w-full p-2 border rounded mb-4'
                rows='2'
              ></textarea>
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
export default Categories
