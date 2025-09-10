import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Modal, Input } from '../../components/ui'
import apiClient from '../../api/client'

const CertificatesPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [certificates, setCertificates] = useState([])
  const [filteredCertificates, setFilteredCertificates] = useState([])
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterYear, setFilterYear] = useState('all')
  const [shareLink, setShareLink] = useState('')
  
  useEffect(() => {
    loadCertificates()
  }, [])
  
  useEffect(() => {
    filterCertificates()
  }, [certificates, searchTerm, filterYear])
  
  const loadCertificates = async () => {
    setLoading(true)
    try {
      // Simulated certificates data
      const certificatesData = [
        {
          id: '1',
          courseId: '1',
          courseName: 'React Avanzado',
          instructor: 'Juan Pérez',
          completionDate: new Date('2024-01-15'),
          certificateCode: 'CERT-2024-001-REACT',
          grade: 95,
          hours: 40,
          skills: ['React', 'Redux', 'Hooks', 'Performance'],
          verified: true,
          shareUrl: 'https://platform.com/verify/CERT-2024-001-REACT'
        },
        {
          id: '2',
          courseId: '3',
          courseName: 'Node.js Backend Development',
          instructor: 'María González',
          completionDate: new Date('2024-02-20'),
          certificateCode: 'CERT-2024-002-NODE',
          grade: 88,
          hours: 35,
          skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
          verified: true,
          shareUrl: 'https://platform.com/verify/CERT-2024-002-NODE'
        },
        {
          id: '3',
          courseId: '5',
          courseName: 'Machine Learning con Python',
          instructor: 'Carlos Rodríguez',
          completionDate: new Date('2024-03-10'),
          certificateCode: 'CERT-2024-003-ML',
          grade: 92,
          hours: 60,
          skills: ['Python', 'TensorFlow', 'Scikit-learn', 'Deep Learning'],
          verified: true,
          shareUrl: 'https://platform.com/verify/CERT-2024-003-ML'
        },
        {
          id: '4',
          courseId: '7',
          courseName: 'DevOps y CI/CD',
          instructor: 'Ana Martínez',
          completionDate: new Date('2023-12-05'),
          certificateCode: 'CERT-2023-015-DEVOPS',
          grade: 85,
          hours: 45,
          skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
          verified: true,
          shareUrl: 'https://platform.com/verify/CERT-2023-015-DEVOPS'
        },
        {
          id: '5',
          courseId: '9',
          courseName: 'Diseño UX/UI Profesional',
          instructor: 'Pedro Sánchez',
          completionDate: new Date('2023-11-20'),
          certificateCode: 'CERT-2023-012-UXUI',
          grade: 90,
          hours: 50,
          skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
          verified: true,
          shareUrl: 'https://platform.com/verify/CERT-2023-012-UXUI'
        }
      ]
      
      setCertificates(certificatesData)
    } catch (error) {
      console.error('Error loading certificates:', error)
      showError('Error al cargar los certificados')
    } finally {
      setLoading(false)
    }
  }
  
  const filterCertificates = () => {
    let filtered = [...certificates]
    
    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(cert => 
        cert.courseName.toLowerCase().includes(search) ||
        cert.instructor.toLowerCase().includes(search) ||
        cert.certificateCode.toLowerCase().includes(search) ||
        cert.skills.some(skill => skill.toLowerCase().includes(search))
      )
    }
    
    // Filter by year
    if (filterYear !== 'all') {
      filtered = filtered.filter(cert => 
        cert.completionDate.getFullYear().toString() === filterYear
      )
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => b.completionDate - a.completionDate)
    
    setFilteredCertificates(filtered)
  }
  
  const handlePreview = (certificate) => {
    setSelectedCertificate(certificate)
    setShowPreviewModal(true)
  }
  
  const handleDownloadPDF = (certificate) => {
    // Simulate PDF generation
    showSuccess('Generando PDF...')
    
    setTimeout(() => {
      // In a real app, this would generate and download a PDF
      const pdfUrl = `data:application/pdf;base64,${btoa('PDF content for ' + certificate.certificateCode)}`
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${certificate.certificateCode}.pdf`
      link.click()
      
      showSuccess('Certificado descargado exitosamente')
    }, 1500)
  }
  
  const handleShare = (certificate) => {
    setSelectedCertificate(certificate)
    setShareLink(certificate.shareUrl)
    setShowShareModal(true)
  }
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    showSuccess('Enlace copiado al portapapeles')
  }
  
  const handleShareSocial = (platform) => {
    const text = `¡Acabo de obtener mi certificado en ${selectedCertificate.courseName}! 🎓`
    const url = selectedCertificate.shareUrl
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }
  
  const handleAddToLinkedIn = (certificate) => {
    // LinkedIn Add to Profile URL format
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.courseName)}&organizationName=${encodeURIComponent('Plataforma de Cursos')}&issueYear=${certificate.completionDate.getFullYear()}&issueMonth=${certificate.completionDate.getMonth() + 1}&certUrl=${encodeURIComponent(certificate.shareUrl)}&certId=${encodeURIComponent(certificate.certificateCode)}`
    
    window.open(linkedInUrl, '_blank')
    showSuccess('Redirigiendo a LinkedIn...')
  }
  
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-400'
    if (grade >= 80) return 'text-yellow-400'
    if (grade >= 70) return 'text-orange-400'
    return 'text-red-400'
  }
  
  const getYears = () => {
    const years = new Set()
    certificates.forEach(cert => {
      years.add(cert.completionDate.getFullYear().toString())
    })
    return Array.from(years).sort((a, b) => b - a)
  }
  
  const stats = {
    total: certificates.length,
    thisYear: certificates.filter(c => c.completionDate.getFullYear() === new Date().getFullYear()).length,
    totalHours: certificates.reduce((sum, c) => sum + c.hours, 0),
    averageGrade: certificates.length > 0 
      ? (certificates.reduce((sum, c) => sum + c.grade, 0) / certificates.length).toFixed(1)
      : 0
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Mis Certificados
        </h1>
        <p className="text-text-secondary mb-6">
          Gestiona y comparte tus logros académicos
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-sm text-text-secondary">Certificados totales</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-accent">{stats.thisYear}</p>
            <p className="text-sm text-text-secondary">Este año</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-purple-400">{stats.totalHours}h</p>
            <p className="text-sm text-text-secondary">Horas certificadas</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-400">{stats.averageGrade}%</p>
            <p className="text-sm text-text-secondary">Promedio general</p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="search"
            placeholder="Buscar certificados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">Todos los años</option>
            {getYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <Button variant="secondary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Todos
          </Button>
        </div>
      </Card>
      
      {/* Certificates Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-text-secondary">Cargando certificados...</p>
          </div>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {searchTerm ? 'No se encontraron certificados' : 'No tienes certificados aún'}
          </h3>
          <p className="text-text-secondary mb-4">
            {searchTerm 
              ? 'Intenta con otro término de búsqueda'
              : 'Completa cursos para obtener certificados'}
          </p>
          <Button onClick={() => navigate('/my-courses')}>
            Ver Mis Cursos
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map(certificate => (
            <Card key={certificate.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Certificate Preview */}
              <div className="h-48 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-6 relative">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                    <text x="50" y="50" fontSize="8" textAnchor="middle" dominantBaseline="middle" className="font-serif">
                      CERTIFICADO
                    </text>
                  </svg>
                </div>
                
                <div className="relative text-white">
                  <div className="text-xs font-semibold mb-2">CERTIFICADO DE FINALIZACIÓN</div>
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">
                    {certificate.courseName}
                  </h3>
                  <p className="text-sm opacity-90">
                    {certificate.instructor}
                  </p>
                </div>
                
                {/* Verified Badge */}
                {certificate.verified && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Certificate Info */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Fecha:</span>
                    <span className="text-text-primary font-medium">
                      {formatDate(certificate.completionDate)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Calificación:</span>
                    <span className={`font-bold ${getGradeColor(certificate.grade)}`}>
                      {certificate.grade}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Duración:</span>
                    <span className="text-text-primary">{certificate.hours} horas</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-text-secondary">Código:</span>
                    <p className="text-xs text-accent font-mono mt-1">
                      {certificate.certificateCode}
                    </p>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {certificate.skills.slice(0, 3).map(skill => (
                    <span 
                      key={skill}
                      className="text-xs px-2 py-1 bg-surface rounded text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                  {certificate.skills.length > 3 && (
                    <span className="text-xs px-2 py-1 text-text-secondary">
                      +{certificate.skills.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="small" 
                    variant="secondary"
                    onClick={() => handlePreview(certificate)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver
                  </Button>
                  
                  <Button 
                    size="small"
                    onClick={() => handleDownloadPDF(certificate)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => handleShare(certificate)}
                    className="text-sm text-accent hover:text-accent-dark flex items-center justify-center py-2"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.003 9.003 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                    </svg>
                    Compartir
                  </button>
                  
                  <button
                    onClick={() => handleAddToLinkedIn(certificate)}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center py-2"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Certificate Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Vista Previa del Certificado"
      >
        {selectedCertificate && (
          <div className="space-y-4">
            {/* Certificate Design */}
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-8 rounded-lg relative">
              <div className="border-4 border-white/30 rounded-lg p-8 text-center text-white">
                <h2 className="text-3xl font-serif mb-4">Certificado de Finalización</h2>
                
                <p className="text-lg mb-4">Se certifica que</p>
                
                <h3 className="text-2xl font-bold mb-4">{user?.name || 'Usuario'}</h3>
                
                <p className="text-lg mb-4">ha completado exitosamente el curso</p>
                
                <h4 className="text-xl font-bold mb-4">{selectedCertificate.courseName}</h4>
                
                <p className="mb-2">Impartido por {selectedCertificate.instructor}</p>
                
                <p className="mb-4">
                  con una calificación de {selectedCertificate.grade}%
                </p>
                
                <p className="text-sm mb-6">
                  {formatDate(selectedCertificate.completionDate)}
                </p>
                
                <div className="flex justify-between items-end mt-8">
                  <div className="text-left">
                    <div className="border-t border-white/50 w-32 mb-2"></div>
                    <p className="text-xs">Director Académico</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                    </div>
                    <p className="text-xs">Sello Digital</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="border-t border-white/50 w-32 mb-2"></div>
                    <p className="text-xs">CEO</p>
                  </div>
                </div>
                
                <p className="text-xs mt-6 font-mono opacity-75">
                  {selectedCertificate.certificateCode}
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleDownloadPDF(selectedCertificate)}
                className="flex-1"
              >
                Descargar PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPreviewModal(false)
                  handleShare(selectedCertificate)
                }}
                className="flex-1"
              >
                Compartir
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Compartir Certificado"
      >
        {selectedCertificate && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Comparte tu certificado de "{selectedCertificate.courseName}" con tu red profesional
            </p>
            
            {/* Share Link */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Enlace de verificación
              </label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={handleCopyLink}>
                  Copiar
                </Button>
              </div>
            </div>
            
            {/* Social Share */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Compartir en redes sociales
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShareSocial('linkedin')}
                  className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShareSocial('twitter')}
                  className="flex-1 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                  Twitter
                </button>
                <button
                  onClick={() => handleShareSocial('facebook')}
                  className="flex-1 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Facebook
                </button>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="text-center p-4 bg-surface rounded-lg">
              <div className="w-32 h-32 bg-white mx-auto mb-2 flex items-center justify-center">
                <div className="text-xs text-gray-500">
                  [QR Code]
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                Escanea para verificar
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CertificatesPage