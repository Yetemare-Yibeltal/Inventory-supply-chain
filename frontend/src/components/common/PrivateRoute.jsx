import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from './Spinner'

const PrivateRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Spinner />
  }

  return user ? <Outlet /> : <Navigate to='/login' replace />
}

export default PrivateRoute

