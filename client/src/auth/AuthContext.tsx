import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { JobType, User } from '../lib/types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from '../components/ui/toaster';
import api, { fetchJobs } from '../lib/api';
import { toast } from '../hooks/use-toast';

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
  const location = useLocation();
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

      setUser(userInfo);

      localStorage.setItem('user', JSON.stringify(currUser))
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken }))

      const jobs = await fetchJobs(userInfo.id, userInfo.type);
      if (jobs) {
        setJobs(jobs);
      }

      navigate('dashboard')
      toast({
        title: "Logged In",
      })

    } catch (error) {
      toast({
        title: "Login Error",
        description: "Error during Logging In"
      })
      console.log(error);
    }
  }

  const logout = async () => {
    try {
      if (user) {
        await api.post('auth/logout')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setUser(null)
      setTokens({
        accessToken: null,
        refreshToken: null
      })
      localStorage.clear();
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

  useEffect(() => {
    // Protecting Routes
    const tokens = localStorage.getItem("tokens");
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}')

    if (['/login', '/signup'].includes(location.pathname) && tokens && userInfo) {
      navigate('/dashboard')
    }

    if (!tokens || !userInfo) {
      if (location.pathname != "/signup") {
        navigate("/login");
        return;
      }
    }

    const jobsLocalStorage = JSON.parse(localStorage.getItem('jobs') || '{}')

    if (userInfo) setUser(userInfo)
    if (jobsLocalStorage) setJobs(jobsLocalStorage)

  }, [location.pathname])

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
      <Toaster />
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
