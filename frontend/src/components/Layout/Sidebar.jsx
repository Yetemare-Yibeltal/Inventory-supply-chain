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

const Sidebar = () => {
  const { logout, user } = useAuth()
  const { role } = usePermissions()

  // Upgraded system routing map featuring descriptive icon modules
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaLayout },
    { path: '/products', label: 'Products', icon: FaBoxOpen },
    { path: '/categories', label: 'Categories', icon: FaTags },
    { path: '/suppliers', label: 'Suppliers', icon: FaTruckLoading },
    {
      path: '/purchase-orders',
      label: 'Purchase Orders',
      icon: FaClipboardList
    },
    { path: '/low-stock', label: 'Low Stock', icon: FaExclamationTriangle }
  ]

  return (
    <aside className='w-64 bg-[#161b22]/40 backdrop-blur-md text-gray-200 flex flex-col h-full border-r border-gray-800/40 select-none'>
      {/* Brand Context Identity Frame */}
      <div className='p-5 h-16 flex items-center border-b border-gray-800/80 bg-[#161b22]/20'>
        <span className='font-black text-sm uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-white'>
          Supply System
        </span>
      </div>

      {/* Main Core Navigation Links Matrix */}
      <nav className='flex-1 p-4 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-800'>
        <ul className='space-y-1.5'>
          {user ? (
            navItems.map(item => {
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
                    <Icon className='text-sm group-hover:scale-105 transition-transform duration-200' />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            })
          ) : (
            <>
              <li>
                <Link
                  to='/login'
                  className='flex items-center justify-center p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/40 transition-all'
                >
                  Login to Node
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  className='flex items-center justify-center p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:brightness-110 transition-all shadow-md shadow-indigo-500/5'
                >
                  Register Account
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Profile Signature System Footer */}
      <div className='p-4 border-t border-gray-800/80 bg-[#161b22]/30 backdrop-blur-sm'>
        {user ? (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between bg-[#0d1117]/60 border border-gray-800 p-2.5 rounded-xl'>
              <div className='flex flex-col truncate max-w-[140px]'>
                <span className='text-xs font-bold text-gray-300 truncate'>
                  {user.name}
                </span>
                <span className='text-[10px] font-mono text-gray-500 uppercase tracking-tight truncate'>
                  Verified Account
                </span>
              </div>

              {role && (
                <span className='bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase font-mono shadow-sm shadow-indigo-500/5'>
                  {role}
                </span>
              )}
            </div>

            <button
              onClick={logout}
              className='flex items-center gap-2 w-full justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 rounded-xl transition-all duration-200 group'
            >
              <FaSignOutAlt className='text-xs group-hover:translate-x-[2px] transition-transform duration-200' />
              <span>Terminate Session</span>
            </button>
          </div>
        ) : (
          <div className='text-center p-2 border border-dashed border-gray-800 rounded-xl'>
            <span className='text-[10px] font-mono text-gray-500 uppercase tracking-wider'>
              Anonymous Instance
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

