import { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Jury from './pages/Jury'
import ApplicationDetail from './pages/ApplicationDetail'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/jury'} replace />
  }
  return children
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              user
                ? <Navigate to={user.role === 'admin' ? '/admin' : '/jury'} replace />
                : <Login />
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jury"
            element={
              <ProtectedRoute requiredRole="jury">
                <Jury />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jury/:id"
            element={
              <ProtectedRoute requiredRole="jury">
                <ApplicationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              user
                ? <Navigate to={user.role === 'admin' ? '/admin' : '/jury'} replace />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
