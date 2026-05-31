import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await register({ name, email, password, role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Register</h2>
        {error && (
          <div className='bg-red-100 text-red-700 p-2 rounded mb-4'>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full p-2 border rounded mb-4'
            required
          />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full p-2 border rounded mb-4'
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full p-2 border rounded mb-4'
            required
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className='w-full p-2 border rounded mb-4'
          >
            <option value='staff'>Staff</option>
            <option value='manager'>Manager</option>
            <option value='admin'>Admin</option>
          </select>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
          >
            Register
          </button>
        </form>
        <p className='text-center mt-4'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
export default Register
