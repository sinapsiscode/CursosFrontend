import { useState, useCallback } from 'react'
import { FILE_UPLOAD } from '../constants/formConstants'

export const useFileUpload = ({ showToast }) => {
  const [uploadProgress, setUploadProgress] = useState({})

  const simulateFileUpload = useCallback((file, type, callback) => {
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const fileName = file.name

    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[fileId] || 0
        if (currentProgress >= 100) {
          clearInterval(interval)

          const fileUrl = `${FILE_UPLOAD.STORAGE_BASE_URL}/${type}/${fileId}_${fileName}`

          if (callback && typeof callback === 'function') {
            callback(fileUrl, fileId)
          }

          setTimeout(() => {
            setUploadProgress(prev => {
              const newPrev = { ...prev }
              delete newPrev[fileId]
              return newPrev
            })
          }, 1000)

          return prev
        }

        return { ...prev, [fileId]: currentProgress + Math.random() * 20 }
      })
    }, 200)

    return fileId
  }, [])

  const handleFileUpload = useCallback((event, type, callback) => {
    try {
      const file = event.target.files[0]
      if (!file) return

      const maxSize = FILE_UPLOAD.MAX_SIZE[type.toUpperCase()] || FILE_UPLOAD.MAX_SIZE.DOCUMENT
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024)
        showToast(`El archivo es muy grande. Máximo ${maxSizeMB}MB`, 'error')
        return
      }

      const allowedTypes = FILE_UPLOAD.ALLOWED_TYPES[type]
      if (allowedTypes && !allowedTypes.includes(file.type)) {
        showToast(`Tipo de archivo no permitido para ${type}`, 'error')
        return
      }

      simulateFileUpload(file, type, callback)
      showToast(`Subiendo ${file.name}...`, 'info')

    } catch (error) {
      showToast('Error al procesar el archivo', 'error')
    }
  }, [simulateFileUpload, showToast])

  return {
    uploadProgress,
    handleFileUpload
  }
}