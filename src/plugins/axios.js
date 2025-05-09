import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { throttle, debounce } from 'lodash'

// Request queue for throttling
class RequestQueue {
  constructor() {
    this.queue = new Map()
  }
  
  add(key, request) {
    this.queue.set(key, request)
  }
  
  get(key) {
    return this.queue.get(key)
  }
  
  clear(key) {
    this.queue.delete(key)
  }
}

// Global request queue
const requestQueue = new RequestQueue()

// Cancel Token
let CancelToken = axios.CancelToken
let source = CancelToken.source()

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
})

// Request Interceptor (add token, throttle, and debounce)
api.interceptors.request.use(
  (config) => {
    // Add token if available
    const { accessToken } = useAuthStore().getToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Check if request needs to be throttled
    if (config.throttle) {
      const key = `${config.url}${config.method}${JSON.stringify(config.params)}${JSON.stringify(config.data)}`
      const existingRequest = requestQueue.get(key)
      
      if (existingRequest) {
        // Cancel previous request
        if (existingRequest.cancel) {
          existingRequest.cancel()
        }
        // Update request in queue
        requestQueue.add(key, config)
        return config
      }
      
      // Add new request to queue
      requestQueue.add(key, config)
    }

    // Apply debounce if needed
    if (config.debounce) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(config)
        }, config.debounce)
      })
    }

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor (central error handler)
api.interceptors.response.use(
  (response) => {
    // Clear throttled request from queue
    if (response.config.throttle) {
      const key = `${response.config.url}${response.config.method}${JSON.stringify(response.config.params)}${JSON.stringify(response.config.data)}`
      requestQueue.clear(key)
    }
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          // Token expired or invalid
          router.push('/auth/login')
          break
        case 403:
          // Forbidden
          throw new Error('Access denied')
        case 429:
          // Too many requests
          throw new Error('Too many requests. Please try again later.')
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server')
    } else {
      // Something happened in setting up the request
      throw new Error(error.message)
    }
    
    // Clear throttled request from queue
    if (error.config?.throttle) {
      const key = `${error.config.url}${error.config.method}${JSON.stringify(error.config.params)}${JSON.stringify(error.config.data)}`
      requestQueue.clear(key)
    }
    
    return Promise.reject(error)
  }
)

// Centralized Error Handler
const errorHandler = (error) => {
  // Log error details
  console.error('API Error:', {
    status: error.response?.status,
    message: error.message,
    data: error.response?.data
  })

  // Show error message to user
  if (error.response?.data?.message) {
    alert(error.response.data.message)
  } else if (error.message) {
    alert(error.message)
  }
}

// Main export function: Custom wrapper
export default function request(
  method,
  url,
  {
    headers = {},
    params = {},
    data = {},
    onSuccess = null,
    onFailure = null,
    onFinally = null,
    responseType = 'json',
    onUploadProgress = null,
    onDownloadProgress = null,
    isTokenRequired = true,
    cancel = false,
    baseURL = import.meta.env.VITE_API_BASE_URL,
    throttle = false,
    debounce = false,
    retryCount = 0,
    maxRetries = 3,
  } = {}
) {
  const allowedMethods = ['get', 'post', 'patch', 'put', 'delete']
  if (!allowedMethods.includes(method)) return `Method ${method} not allowed`
  if (!url) return 'URL is required'

  const config = {
    method,
    url,
    headers: { ...headers },
    params,
    data,
    responseType,
    onUploadProgress,
    onDownloadProgress,
    baseURL,
    throttle: throttle || false,
    debounce: debounce || false,
    retryCount: retryCount || 0,
    maxRetries: maxRetries || 3,
  }

  if (cancel) {
    source.cancel('Request cancelled by user.')
    source = CancelToken.source()
    config.cancelToken = source.token
  }

  return api(config)
    .then((response) => {
      if (onSuccess) onSuccess(response)
      return response
    })
    .catch(async (error) => {
      // Handle retry logic
      if (error.config.retryCount < error.config.maxRetries) {
        error.config.retryCount++
        return request(
          method,
          url,
          {
            ...config,
            retryCount: error.config.retryCount
          }
        )
      }

      if (onFailure) {
        onFailure(error.response)
      } else {
        errorHandler(error)
      }
      throw error
    })
    .finally(() => {
      if (onFinally) onFinally()
    })
}