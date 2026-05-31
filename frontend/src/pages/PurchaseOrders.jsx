import { useState, useEffect, useCallback } from 'react'
import API from '../services/api'
import useSuppliers from '../hooks/useSuppliers'
import useProductsSimple from '../hooks/useProductsSimple'
import ProcurementStats from '../components/ProcurementStats'
import Select from 'react-select'
import { usePermissions } from '../hooks/usePermissions'

const statusOptions = [
  {
    value: 'PENDING',
    label: 'PENDING',
    gradient: 'from-amber-500 to-yellow-600',
    color: '#f59e0b'
  },
  {
    value: 'APPROVED',
    label: 'APPROVED',
    gradient: 'from-blue-500 to-indigo-600',
    color: '#3b82f6'
  },
  {
    value: 'SHIPPED',
    label: 'SHIPPED',
    gradient: 'from-purple-500 to-fuchsia-600',
    color: '#a855f7'
  },
  {
    value: 'RECEIVED',
    label: 'RECEIVED',
    gradient: 'from-emerald-500 to-teal-600',
    color: '#10b981'
  }
]

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [items, setItems] = useState([
    { productId: '', quantity: 1, unitPrice: 0, productName: '' }
  ])
  const [totalAmount, setTotalAmount] = useState(0)

  const { suppliers } = useSuppliers()
  const { products } = useProductsSimple()
  const { canCreate, canUpdate, canDelete } = usePermissions()

  const fetchPOs = useCallback(async () => {
    try {
      const res = await API.get('/purchase-orders')
      setPurchaseOrders(res.data)
    } catch (err) {
      console.error('Data pipeline failure:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPOs()
  }, [fetchPOs])

  useEffect(() => {
    const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
    setTotalAmount(total)
  }, [items])

  const addItemRow = () =>
    setItems([
      ...items,
      { productId: '', quantity: 1, unitPrice: 0, productName: '' }
    ])

  const removeItemRow = idx => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== idx))
  }

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items]
    if (field === 'productId') {
      const prod = products.find(p => p._id === value)
      newItems[idx].productId = value
      newItems[idx].productName = prod ? prod.name : ''
      newItems[idx].unitPrice = prod ? prod.price : 0
    } else {
      newItems[idx][field] = value
    }
    setItems(newItems)
  }

  const createPurchaseOrder = async e => {
    e.preventDefault()
    if (!supplierId) return alert('Select supplier')
    if (items.some(i => !i.productId || i.quantity <= 0 || i.unitPrice <= 0)) {
      return alert('Invalid entries parsed inside target matrix configuration.')
    }
    try {
      await API.post('/purchase-orders', {
        supplier: supplierId,
        items: items.map(i => ({
          product: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      })
      setShowModal(false)
      setSupplierId('')
      setItems([{ productId: '', quantity: 1, unitPrice: 0, productName: '' }])
      fetchPOs()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to initialize purchase order matrix'
      )
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/purchase-orders/${id}/status`, { status })
      fetchPOs()
    } catch (err) {
      alert('Status boundary sync failure')
    }
  }

  const deletePO = async id => {
    if (window.confirm('Permanently purge this purchase order config?')) {
      try {
        await API.delete(`/purchase-orders/${id}`)
        fetchPOs()
      } catch (err) {
        alert('Delete tracking node interrupted')
      }
    }
  }

  const autoCreateLowStock = async () => {
    try {
      const res = await API.post('/purchase-orders/auto-create')
      alert(
        `Automated baseline deployment complete. Spawned ${
          res.data.orders?.length || 0
        } configurations.`
      )
      fetchPOs()
    } catch (err) {
      alert('Automated cycle compilation exception')
    }
  }

  const reactSelectCustomStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#0d1117',
      borderColor: state.isFocused ? '#6366f1' : '#1f2937',
      borderRadius: '12px',
      color: '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px rgba(99, 102, 241, 0.2)' : 'none',
      '&:hover': { borderColor: '#4b5563' }
    }),
    menu: provided => ({
      ...provided,
      backgroundColor: '#161b22',
      borderRadius: '12px',
      border: '1px solid #1f2937'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#4f46e5'
        : state.isFocused
        ? '#1f2937'
        : 'transparent',
      color: '#e5e7eb',
      cursor: 'pointer'
    }),
    singleValue: provided => ({ ...provided, color: '#e5e7eb' }),
    placeholder: provided => ({ ...provided, color: '#4b5563' }),
    input: provided => ({ ...provided, color: '#e5e7eb' })
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#0d1117]'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin' />
          <span className='text-xs font-semibold tracking-wider text-gray-400 uppercase'>
            Syncing Ledger Matrix...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0d1117] text-gray-100 p-6 relative overflow-hidden'>
      <div className='absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto z-10'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
              Procurement Pipeline
            </h1>
            <p className='text-xs text-gray-400 mt-1'>
              Manage vendor procurement nodes and real-time arrival logs
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            {canCreate && (
              <>
                <button
                  onClick={autoCreateLowStock}
                  className='bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95'
                >
                  Auto-Run Low Stock
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95 flex items-center gap-1.5'
                >
                  Create Manual PO
                </button>
              </>
            )}
          </div>
        </div>

        <ProcurementStats orders={purchaseOrders} />

        <div className='bg-[#161b22]/40 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-800/60'>
              <thead className='bg-[#161b22]/80 text-left text-xs font-bold text-gray-400 uppercase tracking-wider'>
                <tr>
                  <th className='px-6 py-4'>PO Node ID</th>
                  <th className='px-6 py-4'>Supplier</th>
                  <th className='px-6 py-4'>Created At</th>
                  <th className='px-6 py-4 text-right'>Valuation</th>
                  <th className='px-6 py-4'>State Checkpoint</th>
                  <th className='px-6 py-4 text-center'>Operations</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-800/40 text-sm'>
                {purchaseOrders.map(po => (
                  <tr
                    key={po._id}
                    className='hover:bg-gray-800/20 transition-colors duration-150'
                  >
                    <td className='px-6 py-4 font-mono text-indigo-400 font-bold'>
                      {po.poNumber}
                    </td>
                    <td className='px-6 py-4 text-gray-300 font-medium'>
                      {po.supplier?.name || (
                        <span className='text-gray-600 italic'>Null link</span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-gray-400 font-mono text-xs'>
                      {new Date(po.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-right font-mono text-emerald-400 font-bold'>
                      Br {po.totalAmount?.toFixed(2) ?? '0.00'}
                    </td>
                    <td className='px-6 py-4'>
                      {canUpdate ? (
                        <select
                          value={po.status}
                          onChange={e => updateStatus(po._id, e.target.value)}
                          className='bg-[#0d1117] text-gray-200 border border-gray-800 rounded-lg text-xs font-semibold px-3 py-1.5 focus:border-indigo-500 cursor-pointer outline-none'
                        >
                          {statusOptions.map(opt => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className='bg-[#161b22]'
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                            statusOptions.find(s => s.value === po.status)
                              ?.gradient || 'from-gray-700 to-gray-800'
                          } text-white`}
                        >
                          {po.status}
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <button
                        disabled={!canDelete}
                        onClick={() => deletePO(po._id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          !canDelete
                            ? 'border-gray-800/40 text-gray-600 opacity-40 cursor-not-allowed'
                            : 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10'
                        }`}
                      >
                        Purge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Creation Modal */}
      {showModal && canCreate && (
        <div className='fixed inset-0 bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn'>
          <div className='relative w-full max-w-3xl bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col scale-in'>
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500' />
            <div className='mb-4'>
              <h2 className='text-xl font-bold text-white'>
                Initialize Purchase Order
              </h2>
              <p className='text-xs text-gray-400 mt-0.5'>
                Map required stock units to target vendor profiles
              </p>
            </div>
            <form
              onSubmit={createPurchaseOrder}
              className='space-y-4 flex-1 overflow-y-auto pr-1'
            >
              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1'>
                  Target Vendor Profile
                </label>
                <select
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  className='w-full bg-[#0d1117]/60 text-gray-200 px-4 py-2.5 rounded-xl border border-gray-800 focus:border-indigo-500 text-sm outline-none'
                  required
                >
                  <option value=''>Select Supplier Profile</option>
                  {suppliers.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2'>
                  Item Matrix Composition
                </label>
                <div className='space-y-2.5'>
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className='flex flex-col sm:flex-row gap-2 bg-[#0d1117]/40 p-3 border border-gray-800/60 rounded-xl items-center'
                    >
                      <div className='w-full sm:flex-1'>
                        <Select
                          options={products.map(p => ({
                            value: p._id,
                            label: `${p.name} [${p.sku}]`
                          }))}
                          styles={reactSelectCustomStyles}
                          onChange={sel =>
                            handleItemChange(idx, 'productId', sel?.value || '')
                          }
                          placeholder='Select product SKU...'
                          value={
                            item.productId
                              ? {
                                  value: item.productId,
                                  label: item.productName
                                }
                              : null
                          }
                        />
                      </div>
                      <div className='flex gap-2 w-full sm:w-auto'>
                        <input
                          type='number'
                          placeholder='Qty'
                          value={item.quantity}
                          onChange={e =>
                            handleItemChange(
                              idx,
                              'quantity',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className='w-full sm:w-24 bg-[#0d1117]/60 text-gray-200 px-3 py-2 rounded-xl border border-gray-800 text-center font-mono text-sm outline-none'
                          min='1'
                          required
                        />
                        <input
                          type='number'
                          step='0.01'
                          placeholder='Price'
                          value={item.unitPrice}
                          onChange={e =>
                            handleItemChange(
                              idx,
                              'unitPrice',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className='w-full sm:w-32 bg-[#0d1117]/60 text-gray-200 px-3 py-2 rounded-xl border border-gray-800 text-right font-mono text-sm outline-none'
                          min='0.01'
                          required
                        />
                        {items.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeItemRow(idx)}
                            className='p-2 border border-gray-800 text-gray-500 hover:text-rose-400 rounded-xl transition-colors'
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type='button'
                  onClick={addItemRow}
                  className='mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1'
                >
                  + Append Item Array Dimension
                </button>
              </div>

              <div className='pt-3 border-t border-gray-800 flex justify-between items-center'>
                <span className='text-xs text-gray-400'>
                  Computed Valuation Total
                </span>
                <span className='text-xl font-mono text-emerald-400 font-extrabold'>
                  Br {totalAmount.toFixed(2)}
                </span>
              </div>

              <div className='flex justify-end items-center gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(false)
                    setSupplierId('')
                    setItems([
                      {
                        productId: '',
                        quantity: 1,
                        unitPrice: 0,
                        productName: ''
                      }
                    ])
                  }}
                  className='px-4 py-2 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800/40'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-500/10'
                >
                  Execute Procurement Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseOrders

// ==========================================
// GIT ATOMIC COMMIT TERMINAL COMMAND:
// git add src/pages/PurchaseOrders.jsx && git commit -m "refactor(procurement): clean style key references, mount analytics view, and apply memoized dispatches"
// ==========================================
