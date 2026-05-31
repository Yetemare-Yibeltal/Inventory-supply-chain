import { useState, useEffect } from 'react'
import API from '../services/api'
import useSuppliers from '../hooks/useSuppliers'
import useProductsSimple from '../hooks/useProductsSimple'
import Select from 'react-select'
import { usePermissions } from '../hooks/usePermissions'

const statusOptions = [
  {
    value: 'PENDING',
    label: 'PENDING',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  {
    value: 'APPROVED',
    label: 'APPROVED',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    value: 'SHIPPED',
    label: 'SHIPPED',
    gradient: 'from-purple-400 to-purple-600'
  },
  {
    value: 'RECEIVED',
    label: 'RECEIVED',
    gradient: 'from-green-400 to-green-600'
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

  const fetchPOs = async () => {
    try {
      const res = await API.get('/purchase-orders')
      setPurchaseOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchPOs()
  }, [])

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
    const newItems = [...items]
    newItems.splice(idx, 1)
    setItems(newItems)
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
    if (items.some(i => !i.productId || i.quantity <= 0 || i.unitPrice <= 0))
      return alert('Invalid items')
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
      alert(err.response?.data?.message || 'Failed')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/purchase-orders/${id}/status`, { status })
      fetchPOs()
    } catch (err) {
      alert('Status update failed')
    }
  }
  const deletePO = async id => {
    if (window.confirm('Delete this purchase order?')) {
      try {
        await API.delete(`/purchase-orders/${id}`)
        fetchPOs()
      } catch (err) {
        alert('Delete failed')
      }
    }
  }
  const autoCreateLowStock = async () => {
    try {
      const res = await API.post('/purchase-orders/auto-create')
      alert(`Created ${res.data.orders?.length || 0} PO(s)`)
      fetchPOs()
    } catch (err) {
      alert('Auto-create failed')
    }
  }

  if (loading) return <div className='p-4 text-center'>Loading...</div>

  const productOptions = products.map(p => ({
    value: p._id,
    label: `${p.name} (${p.sku})`
  }))

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
          Purchase Orders
        </h1>
        <div className='space-x-2'>
          {canCreate && (
            <>
              <button
                onClick={autoCreateLowStock}
                className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded hover:opacity-90 hover:shadow-md transition-all'
              >
                Auto-Create from Low Stock
              </button>
              <button
                onClick={() => setShowModal(true)}
                className='bg-gradient-to-r from-green-500 to-emerald-700 text-white px-4 py-2 rounded hover:opacity-90 hover:shadow-md transition-all'
              >
                + Create PO
              </button>
            </>
          )}
        </div>
      </div>
      <div className='bg-white shadow-lg rounded-xl overflow-x-auto'>
        <table className='min-w-full'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-left'>PO Number</th>
              <th className='p-3 text-left'>Supplier</th>
              <th className='p-3 text-left'>Date</th>
              <th className='p-3 text-right'>Total</th>
              <th className='p-3 text-left'>Status</th>
              <th className='p-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map(po => (
              <tr key={po._id} className='border-b'>
                <td className='p-3 font-mono'>{po.poNumber}</td>
                <td className='p-3'>{po.supplier?.name || '-'}</td>
                <td className='p-3'>
                  {new Date(po.createdAt).toLocaleDateString()}
                </td>
                <td className='p-3 text-right font-semibold'>
                  Br {po.totalAmount?.toFixed(2) ?? '0.00'}
                </td>
                <td className='p-3'>
                  {canUpdate ? (
                    <select
                      value={po.status}
                      disabled={!canUpdate}
                      onChange={e => updateStatus(po._id, e.target.value)}
                      className={`w-24 h-9 flex items-center justify-center text-xs font-medium rounded-full shadow-sm transition-all bg-gradient-to-r ${
                        statusOptions.find(s => s.value === po.status)
                          ?.gradient || 'from-gray-400 to-gray-600'
                      } text-white hover:scale-105 hover:shadow-md ${
                        !canUpdate
                          ? 'opacity-50 cursor-not-allowed bg-gray-300'
                          : 'cursor-pointer'
                      }`}
                    >
                      {statusOptions.map(opt => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className='text-black'
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`w-24 h-9 flex items-center justify-center text-xs font-medium rounded-full shadow-sm transition-all bg-gradient-to-r ${
                        statusOptions.find(s => s.value === po.status)?.gradient
                      } text-white hover:scale-105 hover:shadow-md`}
                    >
                      {statusOptions.find(s => s.value === po.status)?.label ||
                        po.status}
                    </span>
                  )}
                </td>
                <td className='p-3 text-center'>
                  <button
                    disabled={!canDelete}
                    onClick={canDelete ? () => deletePO(po._id) : undefined}
                    className={`w-20 h-9 flex items-center justify-center text-xs font-medium rounded-full shadow-sm bg-white border border-red-200 text-red-500 ${
                      !canDelete
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:text-red-700 hover:scale-105 hover:shadow-md transition-all'
                    } ml-1`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchaseOrders.length === 0 && (
          <div className='p-4 text-center text-gray-500'>
            No purchase orders
          </div>
        )}
      </div>

      {showModal && canCreate && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col pt-[20vh] pb-[10vh] justify-start items-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-3xl max-h-[70vh] overflow-y-auto'>
            <h2 className='text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent'>
              Create Purchase Order
            </h2>
            <form onSubmit={createPurchaseOrder}>
              <div className='mb-4'>
                <label className='block font-medium mb-1'>Supplier</label>
                <select
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  className='w-full p-2 border rounded'
                  required
                >
                  <option value=''>Select supplier</option>
                  {suppliers.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='block font-medium mb-2'>Items</label>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className='flex flex-wrap gap-2 mb-2 items-end'
                  >
                    <div className='flex-1 min-w-[150px]'>
                      <Select
                        options={productOptions}
                        onChange={sel =>
                          handleItemChange(idx, 'productId', sel?.value || '')
                        }
                        placeholder='Product'
                        value={
                          productOptions.find(
                            o => o.value === item.productId
                          ) || null
                        }
                      />
                    </div>
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
                      className='w-24 p-2 border rounded'
                      min='1'
                      required
                    />
                    <input
                      type='number'
                      step='0.01'
                      placeholder='Unit Price'
                      value={item.unitPrice}
                      onChange={e =>
                        handleItemChange(
                          idx,
                          'unitPrice',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className='w-32 p-2 border rounded'
                      min='0.01'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => removeItemRow(idx)}
                      className='text-red-500 px-2'
                    >
                      ✖
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={addItemRow}
                  className='text-blue-500 text-sm mt-1'
                >
                  + Add Item
                </button>
              </div>
              <div className='mb-4 text-right font-bold text-lg'>
                Total: Br {totalAmount.toFixed(2)}
              </div>
              <div className='flex justify-end gap-2'>
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
                  className='px-4 py-2 border rounded hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-700 text-white rounded hover:opacity-90'
                >
                  Create Order
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
