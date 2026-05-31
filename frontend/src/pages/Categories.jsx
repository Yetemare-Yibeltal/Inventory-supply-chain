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

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#0d1117]'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin' />
          <span className='text-xs font-semibold tracking-wider text-gray-400 uppercase'>
            Syncing Stock Categories...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-6 font-sans relative overflow-hidden'>
      {/* Decorative Ambient Canvas Lighting */}
      <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto z-10'>
        {/* Module Header Segment */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
              Inventory Categories
            </h1>
            <p className='text-xs text-gray-400 mt-1'>
              Structure, divide, and partition global storage entities
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
              Create Category Node
            </button>
          )}
        </div>

        {/* Data Architecture Matrix Board */}
        <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-800/60'>
              <thead className='bg-[#161b22]/80'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                    Classification Node
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                    Structural Description
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-gray-400 tracking-wider uppercase'>
                    System Management Operations
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-800/40 bg-transparent'>
                {categories.map(c => (
                  <tr
                    key={c._id}
                    className='hover:bg-gray-800/20 transition-colors duration-150 group'
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-3'>
                        <div className='w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50' />
                        <span className='font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors duration-150'>
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-sm text-gray-400 line-clamp-1 max-w-xl'>
                        {c.description || (
                          <span className='text-gray-600 italic'>
                            No description initialized
                          </span>
                        )}
                      </p>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                      <div className='flex items-center justify-center gap-3'>
                        <button
                          disabled={!canUpdate}
                          onClick={
                            canUpdate ? () => openEditModal(c) : undefined
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
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
                            canDelete ? () => handleDelete(c._id) : undefined
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
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
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className='p-12 text-center'>
              <svg
                className='w-12 h-12 text-gray-600 mx-auto mb-3'
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
                No Active Category Structures Found
              </h3>
              <p className='text-xs text-gray-600 mt-1'>
                Initialize your system database grid by generating a new
                category node.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modern High-End Overlay Category Modal Window */}
      {showModal && (
        <div className='fixed inset-0 bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn'>
          <div className='relative w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden'>
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500' />

            <h2 className='text-xl font-bold tracking-tight text-white mb-6'>
              {editingCat
                ? 'Modify Classification Node'
                : 'Initialize New Category'}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 ml-1'>
                  Category Title
                </label>
                <input
                  name='name'
                  type='text'
                  placeholder='e.g., Microcontrollers, Logistics Arrays'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200'
                  required
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 ml-1'>
                  Functional Description
                </label>
                <textarea
                  name='description'
                  placeholder='Specify system parameters or layout descriptions...'
                  value={formData.description}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-600 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none'
                  rows='3'
                />
              </div>

              <div className='flex justify-end items-center gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800/40 transition-colors duration-200'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-200'
                >
                  Save Configuration
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

/* 
================================================================================
COMMIT MESSAGE FOR THIS FILE:
================================================================================
feat(categories): transform category data hub to advanced cyber dark layout

Refactors structural tables to an enterprise-grade dark UI board with 
frosted backdrop visual parameters, refined authorization button control matrix 
safeguards, unified color states, and polished dynamic loading animations.
================================================================================
*/
