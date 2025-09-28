import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userToken = localStorage.getItem('userToken')
    const adminToken = localStorage.getItem('adminToken')
    
    if (userToken) {
      fetchUserProfile(userToken)
    } else if (adminToken) {
      setAdmin({ token: adminToken })
    }
    
    setLoading(false)
  }, [])

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: { token }
      })
      setUser({ ...response.data.user, token })
    } catch (error) {
      localStorage.removeItem('userToken')
    }
  }

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('/api/user/login', { email, password })
      const token = response.data.token
      localStorage.setItem('userToken', token)
      await fetchUserProfile(token)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Login failed' }
    }
  }

  const signupUser = async (userData) => {
    try {
      const response = await axios.post('/api/user/signup', userData)
      return { success: true, message: response.data.msg }
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Signup failed' }
    }
  }

  const loginAdmin = async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', { email, password })
      const token = response.data.token
      localStorage.setItem('adminToken', token)
      setAdmin({ token })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Login failed' }
    }
  }

  const signupAdmin = async (userData) => {
    try {
      const response = await axios.post('/api/admin/signup', userData)
      return { success: true, message: response.data.msg }
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Signup failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('adminToken')
    setUser(null)
    setAdmin(null)
  }

  const value = {
    user,
    admin,
    loading,
    loginUser,
    signupUser,
    loginAdmin,
    signupAdmin,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}