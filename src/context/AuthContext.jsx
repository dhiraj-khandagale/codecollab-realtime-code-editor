import { createContext, useContext, useState, useEffect } from 'react'
import { tokenManager } from '../utils/tokenManager'
import { MOCK_USER } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On app load, check if already "logged in"
    if (tokenManager.exists()) {
      setUser(MOCK_USER)
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Mock login — in future this calls your backend
    if (email && password) {
      tokenManager.set('mock-jwt-token-12345')
      setUser(MOCK_USER)
      return true
    }
    return false
  }

  const logout = () => {
    tokenManager.remove()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)