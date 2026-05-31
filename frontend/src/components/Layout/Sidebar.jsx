import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePermissions } from '../../hooks/usePermissions'

const Sidebar = () => {
  const { logout, user } = useAuth()
  const { role } = usePermissions()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/categories', label: 'Categories' },
    { path: '/suppliers', label: 'Suppliers' },
    { path: '/purchase-orders', label: 'Purchase Orders' },
    { path: '/low-stock', label: 'Low Stock' }
  ]

  return (
    <aside className='w-64 bg-gray-800 text-white flex flex-col h-full'>
      <div className='p-4 text-xl font-bold border-b border-gray-700'>
        Supply System
      </div>
      <nav className='flex-1 p-4 overflow-y-auto'>
        <ul className='space-y-2'>
          {user ? (
            navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block p-2 rounded ${
                      isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))
          ) : (
            <>
              <li>
                <Link
                  to='/login'
                  className='block p-2 rounded hover:bg-gray-700'
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  className='block p-2 rounded hover:bg-gray-700'
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className='p-4 border-t border-gray-700'>
        {user ? (
          <>
            <div className='text-xs text-gray-400 mb-2 flex items-center'>
              Logged in as: {user.name}
              {role === 'staff' && (
                <span className='ml-2 bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs font-bold'>
                  Staff
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className='w-full text-left p-2 hover:bg-gray-700 rounded'
            >
              Logout
            </button>
          </>
        ) : (
          <div className='text-xs text-gray-400'>Not logged in</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
