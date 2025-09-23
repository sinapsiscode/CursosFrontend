import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { VALID_CERTIFICATES, CERTIFICATE_VERIFY_CONFIG } from '../constants/certificateVerifyConstants'

export const useCertificateVerify = (verificationCode) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (verificationCode) {
      verifyCertificate()
    }
  }, [verificationCode])

  const verifyCertificate = async () => {
    try {
      setLoading(true)

      // Simular verificación de certificado
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Parsear el código de verificación: METSEL-courseId-userId-timestamp
      const parts = verificationCode.split('-')

      if (parts.length !== CERTIFICATE_VERIFY_CONFIG.validation.expectedParts ||
          parts[0] !== CERTIFICATE_VERIFY_CONFIG.validation.expectedPrefix) {
        throw new Error(CERTIFICATE_VERIFY_CONFIG.messages.invalidCode)
      }

      const courseId = parseInt(parts[1])
      const userId = parseInt(parts[2])

      const certKey = `${CERTIFICATE_VERIFY_CONFIG.validation.expectedPrefix}-${courseId}-${userId}`
      const certData = VALID_CERTIFICATES[certKey]

      if (certData) {
        setCertificate({
          ...certData,
          verificationCode,
          isValid: true,
          verifiedAt: new Date()
        })
      } else {
        throw new Error(CERTIFICATE_VERIFY_CONFIG.messages.notFound)
      }

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return {
    loading,
    certificate,
    error,
    formatDate,
    navigate
  }
}