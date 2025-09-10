import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../components/common'

const CertificateVerify = () => {
  const { verificationCode } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    verifyCertificate()
  }, [verificationCode])

  const verifyCertificate = async () => {
    try {
      setLoading(true)
      
      // Simular verificación de certificado
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Parsear el código de verificación: METSEL-courseId-userId-timestamp
      const parts = verificationCode.split('-')
      if (parts.length !== 4 || parts[0] !== 'METSEL') {
        throw new Error('Código de verificación inválido')
      }
      
      const courseId = parseInt(parts[1])
      const userId = parseInt(parts[2])
      
      // Datos simulados de certificados válidos
      const validCertificates = {
        'METSEL-4-2': {
          courseName: 'Introducción a la Minería',
          userName: 'Ana Rodriguez',
          area: 'Minería',
          completedAt: '2024-01-25',
          instructor: 'Ing. Pedro Vargas',
          duration: '160 minutos'
        },
        'METSEL-7-3': {
          courseName: 'Geología General',
          userName: 'Miguel Santos',
          area: 'Geología',
          completedAt: '2024-01-30',
          instructor: 'Dr. Sofia Herrera',
          duration: '190 minutos'
        }
      }
      
      const certKey = `METSEL-${courseId}-${userId}`
      const certData = validCertificates[certKey]
      
      if (certData) {
        setCertificate({
          ...certData,
          verificationCode,
          isValid: true,
          verifiedAt: new Date()
        })
      } else {
        throw new Error('Certificado no encontrado o inválido')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-white mt-4">Verificando certificado...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-surface rounded-xl p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Certificado No Válido</h2>
            <p className="text-text-secondary mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificado Verificado</h1>
          <p className="text-text-secondary">Este certificado ha sido verificado exitosamente</p>
        </div>

        {/* Certificado */}
        <div className="bg-white rounded-xl p-12 mb-8">
          <div className="text-center">
            {/* Logo y header */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-background font-bold text-xl">M</span>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-800">MetSel</div>
                  <div className="text-sm text-gray-600">Academy</div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Certificado de Finalización</h2>
              <p className="text-gray-600">Se otorga el presente certificado a</p>
            </div>

            {/* Información del estudiante */}
            <div className="mb-8">
              <h3 className="text-4xl font-bold text-indigo-800 mb-4">{certificate.userName}</h3>
              <p className="text-lg text-gray-700 mb-2">Por completar exitosamente el curso</p>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">"{certificate.courseName}"</h4>
              <p className="text-gray-600">en el área de <strong>{certificate.area}</strong></p>
            </div>

            {/* Información adicional */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-left">
                <h5 className="font-semibold text-gray-800 mb-2">Detalles del Curso:</h5>
                <p className="text-sm text-gray-600 mb-1"><strong>Instructor:</strong> {certificate.instructor}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Duración:</strong> {certificate.duration}</p>
                <p className="text-sm text-gray-600"><strong>Área:</strong> {certificate.area}</p>
              </div>
              <div className="text-left">
                <h5 className="font-semibold text-gray-800 mb-2">Verificación:</h5>
                <p className="text-sm text-gray-600 mb-1"><strong>Código:</strong> {certificate.verificationCode}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Completado:</strong> {formatDate(certificate.completedAt)}</p>
                <p className="text-sm text-gray-600"><strong>Verificado:</strong> {formatDate(certificate.verifiedAt)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end pt-8 border-t border-gray-200">
              <div className="text-left">
                <div className="text-sm text-gray-600">Fecha de finalización</div>
                <div className="font-semibold text-gray-800">{formatDate(certificate.completedAt)}</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xs text-gray-500">Certificado Válido</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">MetSel Academy</div>
                <div className="text-xs text-gray-500">Institución Certificadora</div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de verificación */}
        <div className="bg-surface rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Información de Verificación</h3>
          <p className="text-text-secondary mb-4">
            Este certificado ha sido emitido por MetSel Academy y puede ser verificado usando el código único mostrado arriba.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Cursos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificateVerify