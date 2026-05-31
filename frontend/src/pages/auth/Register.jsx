import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await register({ name, email, password, role })
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'System authorization registration failed'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen flex items-center justify-center bg-[#0d1117] overflow-hidden font-sans'>
      {/* Background Decorative Ambient 3D Glows */}
      <div className='absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/0 blur-[120px] pointer-events-none' />
      <div className='absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-emerald-600/15 to-cyan-600/0 blur-[120px] pointer-events-none' />

      {/* Main Glassmorphic Registration Card Wrapper */}
      <div className='relative w-full max-w-md mx-4 z-10'>
        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-2xl opacity-20 blur-sm transition-all duration-300' />

        <div className='relative bg-[#161b22]/75 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:border-gray-700/80'>
          {/* Header Section */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 mb-4 font-bold text-xl tracking-wider'>
              IX
            </div>
            <h2 className='text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
              Create Platform Account
            </h2>
            <p className='text-xs text-gray-400 mt-1'>
              Initialize your supply node access credentials
            </p>
          </div>

          {/* Dynamic Action Error Handling View */}
          {error && (
            <div className='flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm transition-all duration-300 animate-fadeIn'>
              <svg
                className='w-4 h-4 shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Registration Input Controls Matrix */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 ml-1'>
                Full Name
              </label>
              <input
                type='text'
                placeholder='John Doe'
                value={name}
                onChange={e => setName(e.target.value)}
                className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-500 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200'
                required
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 ml-1'>
                Email Node Address
              </label>
              <input
                type='email'
                placeholder='name@supplychain.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-500 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200'
                required
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 ml-1'>
                Secure Password
              </label>
              <input
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='w-full bg-[#0d1117]/60 text-gray-200 placeholder-gray-500 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200'
                required
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 ml-1'>
                System Operational Role
              </label>
              <div className='relative'>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className='w-full bg-[#0d1117]/60 text-gray-200 px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 appearance-none cursor-pointer'
                >
                  <option value='staff' className='bg-[#161b22]'>
                    Staff Personnel
                  </option>
                  <option value='manager' className='bg-[#161b22]'>
                    Inventory Manager
                  </option>
                  <option value='admin' className='bg-[#161b22]'>
                    System Administrator
                  </option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500'>
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
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* High Interactivity Interactive Trigger Action Submission button */}
            <button
              type='submit'
              disabled={isLoading}
              className='relative w-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none overflow-hidden mt-2 group'
            >
              <span className='relative z-10 flex items-center justify-center gap-2'>
                {isLoading ? (
                  <svg
                    className='animate-spin h-5 w-5 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                ) : (
                  <>
                    Initialize Authorization
                    <svg
                      className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M14 5l7 7m0 0l-7 7m7-7H3'
                      />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer Navigation Redirection Anchor links */}
          <p className='text-center text-sm text-gray-400 mt-6'>
            Already registered on node?{' '}
            <Link
              to='/login'
              className='text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors duration-200'
            >
              Access Core Terminal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

/* 
================================================================================
COMMIT MESSAGE FOR THIS FILE:
================================================================================
feat(auth): refactor registration portal layout to cyber-industrial theme

Upgrades Register view with highly advanced glassmorphic card layouts,
asymmetric gradient background ambient meshes, multi-layered visual depth,
interactive loading element integrations, and refined custom selection inputs.
================================================================================
*/
