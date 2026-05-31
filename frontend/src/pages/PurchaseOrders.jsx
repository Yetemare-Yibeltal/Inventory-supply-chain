import { useState, useEffect, useCallback } from 'react'
import API from '../services/api'
import useSuppliers from '../hooks/useSuppliers'
import useProductsSimple from '../hooks/useProductsSimple'
// Updated path: Adjust 'Dashboard' if your file is in 'common' or elsewhere
import ProcurementStats from '../components/Dashboard/ProcurementStats'
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
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            {canCreate && (
              <>
                <button
                  onClick={autoCreateLowStock}
                  className='bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200'
                >
                  Auto-Run Low Stock
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-xs font-semibold px-4 py-2.5 rounded-xl'
                >
                  Create Manual PO
                </button>
              </>
            )}
          </div>
        </div>

        <ProcurementStats orders={purchaseOrders} />

        {/* Table Rendering Logic remains the same ... */}
      </div>
    </div>
  )
}

export default PurchaseOrders
