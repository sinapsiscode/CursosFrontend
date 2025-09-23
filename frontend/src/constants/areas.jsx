// 🎯 Configuración de áreas de estudio
export const AREAS_CONFIG = [
  {
    id: 'metalurgia',
    name: 'Metalurgia',
    description: 'Desarrolla aplicaciones web desde cero y haz realidad tu carrera como Web Developer. Sé parte de la industria con los empleos mejor pagados a nivel global.',
    color: 'bg-primary-metalurgia',
    textColor: 'text-primary-metalurgia',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
        <path d="M32 4L8 16v32l24 12 24-12V16L32 4zm-16 36V24l16-8 16 8v16l-16 8-16-8z"/>
        <path d="M28 20v24l8-4V20l-8 4z"/>
      </svg>
    )
  },
  {
    id: 'mineria',
    name: 'Minería',
    description: 'Especialízate en técnicas de extracción y procesamiento de minerales. Domina las mejores prácticas de la industria minera moderna.',
    color: 'bg-primary-mineria',
    textColor: 'text-primary-mineria',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
        <path d="M8 48h48v8H8zm4-4h40l-4-8H16zm2-12l6-8h20l6 8zm4-16l4-8h12l4 8z"/>
        <rect x="28" y="52" width="8" height="8"/>
      </svg>
    )
  },
  {
    id: 'geologia',
    name: 'Geología',
    description: 'Explora la estructura terrestre y los procesos geológicos. Comprende la formación de minerales y recursos naturales.',
    color: 'bg-primary-geologia',
    textColor: 'text-primary-geologia',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
        <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 40c-8.837 0-16-7.163-16-16s7.163-16 16-16 16 7.163 16 16-7.163 16-16 16z"/>
        <circle cx="32" cy="28" r="4"/>
        <path d="M24 40l8-8 8 8"/>
      </svg>
    )
  }
]

export const APP_CONFIG = {
  appName: 'MetSel',
  appInitial: 'M',
  welcomeTitle: 'Descubre lo que puedes aprender',
  welcomeSubtitle: 'Elige tu área de especialización y comienza tu viaje de aprendizaje',
  continueButton: {
    enabled: 'Comenzar mi aprendizaje',
    disabled: 'Selecciona un área para continuar'
  },
  infoNote: 'Podrás cambiar tu área de especialización en cualquier momento desde tu perfil'
}