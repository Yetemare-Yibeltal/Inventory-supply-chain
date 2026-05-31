import React, { useState, useMemo } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaBars, FaTimes, FaLayerGroup } from 'react-icons/fa'

// Externalizing config to prevent re-creation on every render cycle
const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/products', label: 'Products' },
  { path: '/categories', label: 'Categories' },
  { path: '/suppliers', label: 'Suppliers' },
  { path: '/purchase-orders', label: 'Purchase Orders' },
  { path: '/low-stock', label: 'Low Stock' }
]

const Header = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Memoized navigation logic to optimize rendering of private links
  const navLinks = useMemo(
    () =>
      NAV_ITEMS.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={closeMobileMenu}
          className={({ isActive }) =>
            `px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent'
            }`
          }
        >
          {item.label}
        </NavLink>
      )),
    []
  )

  return (
    <header className='bg-[#161b22]/70 backdrop-blur-md border-b border-gray-800/80 text-gray-100 shadow-xl sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-16'>
        {/* Brand Node */}
        <div className='flex items-center gap-4'>
          <button
            onClick={toggleMobileMenu}
            className='md:hidden text-gray-400 hover:text-white'
            aria-label='Toggle Navigation'
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <Link to='/' className='flex items-center gap-2.5 group'>
            <div className='p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl'>
              <FaLayerGroup className='text-white text-sm' />
            </div>
            <span className='font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400'>
              Tracker
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center space-x-1'>
          {user && navLinks}
        </nav>

        {/* Desktop Auth */}
        <div className='hidden md:flex items-center space-x-4'>
          {user ? (
            <div className='flex items-center gap-4 bg-[#0d1117] border border-gray-800 px-4 py-1.5 rounded-xl'>
              <div className='text-right'>
                <p className='text-xs font-bold text-gray-200'>{user.name}</p>
                <p className='text-[10px] font-mono text-gray-500 uppercase'>
                  {user.role}
                </p>
              </div>
              <button
                onClick={logout}
                className='text-xs text-rose-400 hover:text-rose-300'
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to='/login'
              className='text-xs font-bold text-gray-400 hover:text-white'
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden bg-[#161b22] border-b border-gray-800 transition-all ${
          mobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        } overflow-hidden`}
      >
        <nav className='px-4 py-3 space-y-2'>
          {user ? (
            navLinks
          ) : (
            <Link
              to='/login'
              onClick={closeMobileMenu}
              className='block p-2 text-xs'
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

