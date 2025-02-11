import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { JobType, User } from '../lib/types';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  tokens: TokenInterface | null;
  jobs: JobType[] | undefined;
  setJobs: React.Dispatch<React.SetStateAction<JobType[] | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface TokenInterface {
  accessToken: string | null,
  refreshToken: string | null
}
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [jobs, setJobs] = useState<JobType[]>()
  const [tokens, setTokens] = useState<TokenInterface>({
    accessToken: "",
    refreshToken: ""
  })

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email,
        password,
      })
      const { accessToken, refreshToken, userInfo } = response.data
      console.log(response.data)
      setIsLoggedIn(true)
      setTokens({
        accessToken,
        refreshToken
      })
      const currUser: User = {
        id: userInfo.id,
        email: userInfo.email,
        type: userInfo.type,
        name: userInfo.name,
        location: userInfo.location,
        mobileNumber: userInfo.mobileNumber,
        sector: userInfo.sector
      }

      localStorage.setItem('user', JSON.stringify(currUser))
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken }))
      
      getJobs(userInfo.id);

      if (userInfo.type === "employee") navigate('dashboard/employee')
      else if (userInfo.type === "employer") navigate('/dashboard/employer')

    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (user) {
        await axios.post('http://localhost:5000/api/v1/auth/logout', { sessionId: user.id })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setTokens({
        accessToken: null,
        refreshToken: null
      })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/api/v1/auth/refresh-token', {
        refreshToken: tokens.refreshToken
      })
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data
      setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      })
      localStorage.setItem('accessToken', newAccessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
    }
  }


  const getJobs = async (id:string) => {
    if (user?.type == "employee") {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/job',)
        setJobs(response.data);
        console.log(response.data)
      } catch (error: any) {
        console.log("error")
      }
    } else {
      try {
        console.log(user?.id)
        const response = await axios.get(`http://localhost:5000/api/v1/job/${id}`,)
        setJobs(response.data);
        console.log(response.data)
      } catch (error: any) {
        console.log("error")
      }
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (tokens.accessToken) {
        try {
          const response = await axios.get('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })
          setUser(response.data)
        } catch (error) {
          console.error('Error fetching user:', error)
          logout()
        }
      }
    }

    fetchUser()
  }, [tokens.accessToken])

  useEffect(() => {
    if (tokens.accessToken) {
      const refreshInterval = setInterval(
        () => {
          refreshAccessToken()
        },
        14 * 60 * 1000,
      )

      return () => clearInterval(refreshInterval)
    }
  }, [tokens.accessToken])

  return (
    <AuthContext.Provider value={{ user, setIsLoggedIn, tokens, login, logout, refreshAccessToken, jobs, setJobs }}>
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
