import React, { createContext, useState, useEffect, useContext } from 'react'
import API from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(
      'useAuth must be executed within an explicit, verified AuthProvider boundary node'
    )
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Side-effect pipeline to verify active session identity tokens upon mounting
  useEffect(() => {
    const initializeAuthenticationSession = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Force header mapping fallback if initial axios instances missed state parsing
        if (
          API.defaults.headers &&
          !API.defaults.headers.common['Authorization']
        ) {
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }

        const res = await API.get('/users/profile')
        if (res.data) {
          setUser(res.data)
        }
      } catch (error) {
        console.error(
          'Session state verification failure: Flushed corrupt token record.'
        )
        localStorage.removeItem('token')
        if (API.defaults.headers?.common) {
          delete API.defaults.headers.common['Authorization']
        }
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuthenticationSession()
  }, [])

  // Execute secure server authentication transaction matrix
  const login = async (email, password) => {
    const res = await API.post('/users/login', { email, password })
    const { token, _id, name, email: userEmail, role } = res.data

    localStorage.setItem('token', token)
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const authenticatedPayload = { _id, name, email: userEmail, role }
    setUser(authenticatedPayload)
    return res.data
  }

  // Execute secure account registration pipeline sequence
  const register = async userData => {
    const res = await API.post('/users/register', userData)
    const { token, _id, name, email, role } = res.data

    localStorage.setItem('token', token)
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const registeredPayload = { _id, name, email, role }
    setUser(registeredPayload)
    return res.data
  }

  // Terminate current network environment session context
  const logout = () => {
    localStorage.removeItem('token')
    if (API.defaults.headers?.common) {
      delete API.defaults.headers.common['Authorization']
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

