import dotenv from 'dotenv'

dotenv.config()

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue

  if (value === undefined) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Missing environment variable for ${key}, using a default value`,
      )
      return key
    }
    throw Error(`Missing String environment variable for ${key}`)
  }

  return value
}

export const NODE_ENV = getEnv('NODE_ENV', 'development')
export const APP_URL = getEnv('APP_URL')
export const API_URL = getEnv('API_URL')
