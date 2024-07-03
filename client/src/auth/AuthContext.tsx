import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, NavigateFunction } from 'react-router-dom'

export interface User {
  id: string;
  name: string | null;
  email: string;
  type: 'employee' | 'employer';
  location: string | null;
  sector: string | null;
  mobileNumber: string | null
}

interface AuthContextType {
  type: string | null;
  setType: React.Dispatch<React.SetStateAction<string | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [type, setType] = useState<string | null>(null)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'))

  useEffect(() => {
    const sessionData: any = sessionStorage.getItem('user')
    if (sessionData) {
      setUser(JSON.parse(sessionData))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email,
        password,
      },
      )
      const { accessToken, refreshToken, userResponse } = response.data
      setUser(userResponse)
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      sessionStorage.setItem('user', JSON.stringify(userResponse))
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (user) {
        await axios.post('/api/v1/auth/logout', { sessionId: user.id })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/api/v1/auth/refresh-token', {
        refreshToken,
      })
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data
      setAccessToken(newAccessToken)
      setRefreshToken(newRefreshToken)
      localStorage.setItem('accessToken', newAccessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await axios.get('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          setUser(response.data)
        } catch (error) {
          console.error('Error fetching user:', error)
          logout()
        }
      }
    }

    fetchUser()
  }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      const refreshInterval = setInterval(() => {
        refreshAccessToken()
      }, 14 * 60 * 1000,
      )

      return () => clearInterval(refreshInterval)
    }
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, type, setType, user, navigate, accessToken, refreshToken, login, logout, refreshAccessToken, }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
