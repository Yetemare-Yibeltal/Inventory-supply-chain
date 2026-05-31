import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaBars, FaTimes } from 'react-icons/fa'
const Header = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/categories', label: 'Categories' },
    { path: '/suppliers', label: 'Suppliers' },
    { path: '/purchase-orders', label: 'Purchase Orders' },
    { path: '/low-stock', label: 'Low Stock' }
  ]

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className='bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md sticky top-0 z-20'>
      {/* Top Bar */}
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        {/* Left: Hamburger + Logo */}
        <div className='flex items-center gap-3'>
          <button
            onClick={toggleMobileMenu}
            className='md:hidden text-white focus:outline-none'
            aria-label='Menu'
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          Tracker
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex space-x-6'>
          {user &&
            navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  'hover:text-gray-200 transition ' +
                  (isActive ? 'border-b-2 border-white pb-1' : '')
                }
              >
                {item.label}
              </NavLink>
            ))}
        </nav>

        {/* Desktop User & Auth */}
        <div className='hidden md:flex items-center space-x-4'>
          {user ? (
            <>
              <span className='text-sm'>
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className='bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='text-sm hover:text-gray-200 transition'
              >
                Login
              </Link>
              <Link
                to='/register'
                className='bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm transition'
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: show auth state */}
        <div className='md:hidden text-sm'>{user ? user.name : 'Guest'}</div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={
          'md:hidden bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out ' +
          (mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')
        }
      >
        <nav className='px-4 py-3'>
          <ul className='space-y-2'>
            {user ? (
              <>
                {navItems.map(item => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        'block p-2 rounded hover:bg-gray-700 transition ' +
                        (isActive ? 'bg-gray-700' : '')
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li className='pt-2 border-t border-gray-700'>
                  <button
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className='w-full text-left p-2 text-red-300 hover:bg-gray-700 rounded'
                  >
                    Logout ({user.name})
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to='/login'
                    onClick={closeMobileMenu}
                    className='block p-2 rounded hover:bg-gray-700 transition'
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to='/register'
                    onClick={closeMobileMenu}
                    className='block p-2 rounded hover:bg-gray-700 transition'
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
