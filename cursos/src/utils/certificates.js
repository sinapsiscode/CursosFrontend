import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer'

// Estilos para el certificado
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    alignItems: 'center',
    marginBottom: 30
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    backgroundColor: '#98d932',
    borderRadius: 40
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#121f3d',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40
  },
  content: {
    alignItems: 'center',
    marginBottom: 40
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#121f3d',
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '2px solid #98d932',
    paddingBottom: 10
  },
  courseName: {
    fontSize: 22,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10
  },
  area: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30
  },
  completionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    paddingTop: 20,
    borderTop: '1px solid #ccc'
  },
  signature: {
    alignItems: 'center'
  },
  signatureLine: {
    borderBottom: '1px solid #333',
    width: 150,
    marginBottom: 5
  },
  signatureText: {
    fontSize: 12,
    color: '#666'
  },
  certificateId: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 10,
    color: '#999'
  },
  qrCode: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

// Componente del certificado PDF
const CertificateDocument = ({ 
  studentName, 
  courseName, 
  area, 
  completedAt, 
  certificateId,
  instructorName = "Director Académico"
}) => {
  const areaNames = {
    metalurgia: 'Metalurgia',
    mineria: 'Minería',
    geologia: 'Geología'
  }

  const areaColors = {
    metalurgia: '#ff6b6b',
    mineria: '#4ecdc4',
    geologia: '#45b7d1'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: areaColors[area] || '#98d932' }]}>
          </View>
          <Text style={styles.title}>CERTIFICADO DE FINALIZACIÓN</Text>
          <Text style={styles.subtitle}>Academia Digital de {areaNames[area] || 'Especialización'}</Text>
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          <Text style={styles.completionText}>
            Por medio del presente se certifica que
          </Text>
          
          <Text style={styles.studentName}>
            {studentName}
          </Text>
          
          <Text style={styles.completionText}>
            ha completado satisfactoriamente el curso de
          </Text>
          
          <Text style={styles.courseName}>
            {courseName}
          </Text>
          
          <Text style={styles.area}>
            Área de especialización: {areaNames[area] || area}
          </Text>
          
          <Text style={styles.completionText}>
            Completado el {formatDate(completedAt)}
          </Text>
        </View>

        {/* Footer con firmas */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>{instructorName}</Text>
            <Text style={styles.signatureText}>Director Académico</Text>
          </View>
          
          <View style={styles.signature}>
            <View style={styles.qrCode}>
              <Text style={{ fontSize: 8 }}>QR</Text>
            </View>
            <Text style={styles.signatureText}>Código de verificación</Text>
          </View>
          
          <View style={styles.signature}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>MetSel Academy</Text>
            <Text style={styles.signatureText}>Institución Certificadora</Text>
          </View>
        </View>

        {/* ID del certificado */}
        <Text style={styles.certificateId}>
          ID: {certificateId}
        </Text>
      </Page>
    </Document>
  )
}

// Utilidades para generar certificados
export const certificateUtils = {
  
  // Generar ID único para el certificado
  generateCertificateId: (userId, courseId) => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    return `CERT-${userId}-${courseId}-${timestamp}-${random}`.toUpperCase()
  },

  // Crear y descargar certificado
  generateCertificate: async (certificateData) => {
    const {
      studentName,
      courseName,
      area,
      completedAt,
      userId,
      courseId,
      instructorName
    } = certificateData

    const certificateId = certificateUtils.generateCertificateId(userId, courseId)
    
    const doc = (
      <CertificateDocument
        studentName={studentName}
        courseName={courseName}
        area={area}
        completedAt={completedAt}
        certificateId={certificateId}
        instructorName={instructorName}
      />
    )

    try {
      // Generar el PDF como blob
      const blob = await pdf(doc).toBlob()
      
      // Crear URL para descarga
      const url = URL.createObjectURL(blob)
      
      // Crear link de descarga
      const link = document.createElement('a')
      link.href = url
      link.download = `certificado-${courseName.replace(/\s+/g, '-').toLowerCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Limpiar URL
      URL.revokeObjectURL(url)
      
      return {
        success: true,
        certificateId,
        downloadUrl: url
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Componente de vista previa del certificado
  CertificatePreview: ({ certificateData, onDownload, onClose }) => {
    const {
      studentName,
      courseName,
      area,
      completedAt,
      userId,
      courseId,
      instructorName
    } = certificateData

    const certificateId = certificateUtils.generateCertificateId(userId, courseId)

    const handleDownload = async () => {
      const result = await certificateUtils.generateCertificate({
        ...certificateData,
        certificateId
      })
      
      if (result.success && onDownload) {
        onDownload(result)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-surface p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Vista previa del certificado</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Preview */}
          <div className="p-8 bg-white">
            <div className="aspect-[4/3] bg-gray-50 border-2 border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              {/* Simulación del certificado */}
              <div className="w-16 h-16 bg-accent rounded-full mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                CERTIFICADO DE FINALIZACIÓN
              </h1>
              
              <p className="text-gray-600 mb-6">
                Academia Digital de {area?.charAt(0).toUpperCase() + area?.slice(1)}
              </p>
              
              <p className="text-gray-600 mb-2">Por medio del presente se certifica que</p>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-accent pb-2">
                {studentName}
              </h2>
              
              <p className="text-gray-600 mb-2">ha completado satisfactoriamente el curso de</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {courseName}
              </h3>
              
              <p className="text-gray-600 text-sm">
                Completado el {new Date(completedAt).toLocaleDateString('es-ES')}
              </p>
              
              <p className="text-xs text-gray-400 mt-4">
                ID: {certificateId}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 p-4 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>
      </div>
    )
  },

  // Verificar certificado (simulado)
  verifyCertificate: async (certificateId) => {
    // En una aplicación real, esto haría una consulta a la API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      valid: true,
      certificateData: {
        studentName: 'Usuario Ejemplo',
        courseName: 'Curso de Ejemplo',
        area: 'metalurgia',
        completedAt: new Date(),
        verifiedAt: new Date()
      }
    }
  }
}

export default certificateUtils