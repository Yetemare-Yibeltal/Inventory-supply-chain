import React, { useMemo } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePermissions } from '../../hooks/usePermissions'
import {
  FaLayout,
  FaBoxOpen,
  FaTags,
  FaTruckLoading,
  FaClipboardList,
  FaExclamationTriangle,
  FaSignOutAlt
} from 'react-icons/fa'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: FaLayout },
  { path: '/products', label: 'Products', icon: FaBoxOpen },
  { path: '/categories', label: 'Categories', icon: FaTags },
  { path: '/suppliers', label: 'Suppliers', icon: FaTruckLoading },
  { path: '/purchase-orders', label: 'Purchase Orders', icon: FaClipboardList },
  { path: '/low-stock', label: 'Low Stock', icon: FaExclamationTriangle }
]

const Sidebar = () => {
  const { logout, user } = useAuth()
  const { role } = usePermissions()

  // Memoized link list to prevent layout flickering and re-render overhead
  const navLinks = useMemo(
    () =>
      NAV_ITEMS.map(item => {
        const Icon = item.icon
        return (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 group ${
                  isActive
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent'
                }`
              }
            >
              <Icon className='text-sm group-hover:scale-105 transition-transform' />
              <span>{item.label}</span>
            </NavLink>
          </li>
        )
      }),
    []
  )

  return (
    <aside className='w-64 bg-[#161b22]/40 backdrop-blur-md text-gray-200 flex flex-col h-full border-r border-gray-800/40'>
      <div className='p-5 h-16 flex items-center border-b border-gray-800/80 bg-[#161b22]/20'>
        <span className='font-black text-sm uppercase tracking-widest text-indigo-300'>
          Supply System
        </span>
      </div>

      <nav className='flex-1 p-4 overflow-y-auto space-y-1'>
        <ul className='space-y-1.5'>
          {user ? (
            navLinks
          ) : (
            <>
              <li>
                <Link
                  to='/login'
                  className='flex items-center justify-center p-2.5 rounded-xl text-xs font-bold border border-gray-800 text-gray-400'
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className='p-4 border-t border-gray-800/80 bg-[#161b22]/30'>
        {user ? (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between bg-[#0d1117]/60 border border-gray-800 p-2.5 rounded-xl'>
              <div className='truncate max-w-[120px]'>
                <p className='text-xs font-bold text-gray-300 truncate'>
                  {user.name}
                </p>
                <p className='text-[10px] font-mono text-gray-500 uppercase'>
                  {role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className='flex items-center gap-2 w-full justify-center px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl transition-all'
            >
              <FaSignOutAlt /> Terminate Session
            </button>
          </div>
        ) : (
          <div className='text-center p-2 border border-dashed border-gray-800 rounded-xl text-[10px] text-gray-500 uppercase'>
            Anonymous
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

