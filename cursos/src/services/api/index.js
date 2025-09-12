// Exportar APIs legacy
export { apiClient, api } from './client'
export { endpoints } from './endpoints'

// Exportar nuevos servicios modulares
export { default as baseApi } from './baseApi'
export { default as authApi } from './authApi'
export { default as courseApi } from './courseApi'
export { default as studentApi } from './studentApi'
export { default as examApi } from './examApi'
export { default as areaApi } from './areaApi'
export { default as userApi } from './userApi'

// Re-exports para compatibilidad
export { authApi as auth } from './authApi'
export { courseApi as courses } from './courseApi'
export { studentApi as students } from './studentApi'
export { examApi as exams } from './examApi'