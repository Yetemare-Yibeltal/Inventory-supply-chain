import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaBars, FaTimes, FaLayerGroup } from 'react-icons/fa'

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
    <header className='bg-[#161b22]/70 backdrop-blur-md border-b border-gray-800/80 text-gray-100 shadow-xl sticky top-0 z-50 transition-all duration-300'>
      {/* Top Bar Layout */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-16'>
        {/* Left Section: Responsive Hamburger + Brand Node Icon */}
        <div className='flex items-center gap-4'>
          <button
            onClick={toggleMobileMenu}
            className='md:hidden text-gray-400 hover:text-white focus:outline-none transition-colors'
            aria-label='Toggle Navigation Node Grid'
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          <Link
            to='/'
            className='flex items-center gap-2.5 group focus:outline-none'
          >
            <div className='p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-500/10 group-hover:brightness-110 transition-all duration-200'>
              <FaLayerGroup className='text-white text-sm' />
            </div>
            <span className='font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 group-hover:from-white group-hover:to-white transition-all duration-300'>
              Tracker
            </span>
          </Link>
        </div>

        {/* Desktop Central Navigation Pipeline */}
        <nav className='hidden md:flex items-center space-x-1 lg:space-x-2'>
          {user &&
            navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
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
            ))}
        </nav>

        {/* Desktop User Profile / Authentication Matrix */}
        <div className='hidden md:flex items-center space-x-4'>
          {user ? (
            <div className='flex items-center gap-4 bg-[#0d1117]/60 border border-gray-800 px-4 py-1.5 rounded-xl'>
              <div className='flex flex-col text-right'>
                <span className='text-xs font-bold text-gray-200'>
                  {user.name}
                </span>
                <span className='text-[10px] font-mono text-gray-500 uppercase tracking-tight'>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className='bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200'
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='flex items-center space-x-3'>
              <Link
                to='/login'
                className='text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white px-3 py-2 transition-colors'
              >
                Login
              </Link>
              <Link
                to='/register'
                className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/10 transition-all active:scale-[0.98]'
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Mini Profile Signature Badge */}
        <div className='md:hidden flex items-center'>
          {user ? (
            <div className='bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1 text-xs font-bold text-indigo-400 font-mono'>
              {user.name.split(' ')[0]}
            </div>
          ) : (
            <Link
              to='/login'
              className='text-xs font-bold tracking-wider text-indigo-400 font-mono uppercase'
            >
              Guest
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Dropdown Matrix */}
      <div
        className={`md:hidden bg-[#161b22] border-b border-gray-800 transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className='px-4 py-3 bg-[#0d1117]/40 backdrop-blur-md'>
          <ul className='space-y-1.5'>
            {user ? (
              <>
                {navItems.map(item => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `block p-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                          isActive
                            ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li className='pt-2 mt-2 border-t border-gray-800/60'>
                  <button
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className='w-full text-left p-2.5 text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl transition-all'
                  >
                    Terminate Session ({user.name})
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to='/login'
                    onClick={closeMobileMenu}
                    className='block p-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-800/40 transition-all'
                  >
                    Login to Instance
                  </Link>
                </li>
                <li>
                  <Link
                    to='/register'
                    onClick={closeMobileMenu}
                    className='block p-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-center transition-all'
                  >
                    Register Base Node
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

