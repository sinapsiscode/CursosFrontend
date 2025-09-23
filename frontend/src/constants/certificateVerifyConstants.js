export const VALID_CERTIFICATES = {
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

export const CERTIFICATE_VERIFY_CONFIG = {
  appName: 'MetSel',
  appNameFull: 'MetSel Academy',
  appInitial: 'M',

  messages: {
    verifying: 'Verificando certificado...',
    verified: 'Certificado Verificado',
    verifiedSubtitle: 'Este certificado ha sido verificado exitosamente',
    invalid: 'Certificado No Válido',
    invalidCode: 'Código de verificación inválido',
    notFound: 'Certificado no encontrado o inválido',
    verificationInfo: 'Este certificado ha sido emitido por MetSel Academy y puede ser verificado usando el código único mostrado arriba.'
  },

  labels: {
    certificateTitle: 'Certificado de Finalización',
    certificateSubtitle: 'Se otorga el presente certificado a',
    courseDetails: 'Detalles del Curso:',
    verification: 'Verificación:',
    instructor: 'Instructor:',
    duration: 'Duración:',
    area: 'Área:',
    code: 'Código:',
    completed: 'Completado:',
    verified: 'Verificado:',
    completionDate: 'Fecha de finalización',
    validCertificate: 'Certificado Válido',
    certifyingInstitution: 'Institución Certificadora',
    verificationInfo: 'Información de Verificación'
  },

  buttons: {
    backHome: 'Volver al Inicio',
    viewCourses: 'Ver Cursos'
  },

  validation: {
    expectedPrefix: 'METSEL',
    expectedParts: 4
  }
}