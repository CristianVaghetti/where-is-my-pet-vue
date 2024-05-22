import axios from 'axios'
import router from '@/router'

const axiosIns = axios.create({
// You can add your headers here
// ================================
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: { 'Access-Control-Allow-Origin': '*' },
})

const isUserAFK = () => {
  const last = localStorage.getItem('lastActiveTime')
  const current = Date.now()
  const idleTime = current - last

  return idleTime > import.meta.env.VITE_IDLE * 60 * 1000
}

const checkRedirect = () => {
  if (isUserAFK()) {
    const last = localStorage.getItem('pageBeforeSessionEnd')

    localStorage.removeItem('accessToken')
    localStorage.setItem('lastActiveTime', Date.now())
    router.push(`/login?sessionEnd=true&to=${last}`)

    return Promise.reject()
  }
}

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {
  // Retrieve token from localStorage
  const token = localStorage.getItem('accessToken')

  // If token is found
  if (token) {
    // Get request headers and if headers is undefined assign blank object
    config.headers = config.headers || {}

    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : ''
  }

  // Return modified config
  return config
})

axiosIns.interceptors.response.use(response => {
  checkRedirect()

  localStorage.setItem('lastActiveTime', Date.now())

  return response
}, error => {
  checkRedirect()

  const token = JSON.parse(localStorage.getItem('accessToken'))

  if (error.response.status === 401 && error.response.data.msg === 'Token has expired' && token) {
    // eslint-disable-next-line promise/no-promise-in-callback
    axiosIns.post('auth/refresh', { token: token }).then(response => {
      if (response.data.token) {
        const newToken = response.data.token

        localStorage.setItem('accessToken', JSON.stringify(newToken))
        router.go(0)
      }
    }).catch(e => console.log(e))
  }

  return Promise.reject(error)
})

export default axiosIns
