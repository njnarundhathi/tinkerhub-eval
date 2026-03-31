import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (email) => api.post('/auth/login', { email })
export const logout = () => api.post('/auth/logout')

// Admin
export const uploadJuryCSV = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/admin/upload/jury', fd)
}

export const uploadApplicationsCSV = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/admin/upload/applications', fd)
}

export const assignReviewers = () => api.post('/admin/assign')
export const reassignReviewers = () => api.post('/admin/reassign')
export const getAdminApplications = (params) => api.get('/admin/applications', { params })
export const getCampuses = () => api.get('/admin/campuses')
export const getStats = () => api.get('/admin/stats')
export const resolveConflict = (id) => api.post(`/admin/resolve-conflict/${id}`)

// Jury
export const getJuryApplications = () => api.get('/jury/applications')
export const getJuryApplication = (id) => api.get(`/jury/applications/${id}`)
export const submitReview = (id, data) => api.post(`/jury/applications/${id}/review`, data)

export default api
