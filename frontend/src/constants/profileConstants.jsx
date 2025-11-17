export const AREA_COLORS = {
  metalurgia: {
    bg: 'bg-primary-metalurgia',
    text: 'text-primary-metalurgia',
    gradient: 'from-primary-metalurgia to-red-600'
  },
  mineria: {
    bg: 'bg-primary-mineria',
    text: 'text-primary-mineria',
    gradient: 'from-primary-mineria to-teal-600'
  },
  geologia: {
    bg: 'bg-primary-geologia',
    text: 'text-primary-geologia',
    gradient: 'from-primary-geologia to-blue-600'
  }
}

export const PROFILE_MESSAGES = {
  auth: {
    loginRequired: 'Inicia sesión para ver tu perfil',
    loginButton: 'Iniciar Sesión'
  },
  header: {
    defaultName: 'Usuario',
    defaultEmail: 'email@ejemplo.com',
    proUpgradeButton: 'Subir a Pro',
    areaPrefix: 'Área de'
  },
  banner: {
    defaultTitle: '¡Certifícate y potencia tu CV!',
    subtitle: 'Valida tus conocimientos profesionalmente',
    defaultButton: 'Ver más'
  },
  whatsapp: {
    defaultButton: 'Unirse al Canal de WhatsApp'
  },
  gallery: {
    title: '📸 Galería',
    empty: {
      icon: '📷',
      title: 'No hay fotos configuradas',
      subtitle: 'El administrador aún no ha configurado fotos para mostrar en esta sección.'
    },
    viewDetails: 'Ver detalles'
  }
}

export const DEFAULT_URLS = {
  proUpgrade: 'https://ejemplo.com/upgrade-pro',
  whatsappChannel: 'https://chat.whatsapp.com/ejemplo123',
  logoImage: '/vite.svg'
}

export const PROFILE_STYLES = {
  container: 'min-h-screen bg-background',
  maxWidth: 'max-w-7xl mx-auto px-4 py-8',

  authMessage: {
    container: 'min-h-screen bg-background flex items-center justify-center',
    content: 'text-center',
    title: 'text-2xl font-bold text-white mb-4',
    button: 'bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90'
  },

  loading: {
    container: 'min-h-screen bg-background flex items-center justify-center'
  },

  header: {
    container: 'bg-surface rounded-xl p-8 mb-8',
    wrapper: 'flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8',
    logoContainer: 'relative',
    logo: 'w-32 h-32 rounded-full border-4 border-accent bg-white flex items-center justify-center',
    logoImage: 'w-20 h-20 object-contain',
    logoBadge: 'absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
    infoSection: 'flex-1 text-center md:text-left',
    name: 'text-3xl font-bold text-white mb-2',
    email: 'text-secondary mb-4',
    badges: 'flex flex-wrap justify-center md:justify-start gap-4 mb-4',
    areaBadge: 'text-white px-4 py-2 rounded-full text-sm font-medium',
    proButton: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 flex items-center space-x-2',
    subscriptionBadge: 'bg-accent text-background px-4 py-2 rounded-full text-sm font-bold',
    areaInfo: 'text-center md:text-left',
    areaInfoBadge: 'text-white px-4 py-2 rounded-full text-sm font-medium inline-block'
  },

  banner: {
    container: 'bg-surface border border-gray-600 rounded-lg p-4 mb-8',
    wrapper: 'flex items-center justify-between',
    content: 'flex items-center space-x-3',
    icon: 'w-10 h-10 bg-accent bg-opacity-20 rounded-full flex items-center justify-center',
    iconEmoji: 'text-accent',
    textSection: '',
    title: 'text-white font-medium',
    subtitle: 'text-secondary text-sm',
    button: 'bg-accent text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors'
  },

  whatsapp: {
    container: 'flex justify-center mb-8',
    button: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3',
    icon: 'w-6 h-6',
    text: 'text-lg'
  },

  gallery: {
    section: 'mb-8',
    title: 'text-2xl font-bold text-white mb-6',
    grid: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
    card: 'group relative bg-surface rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer',
    image: 'w-full h-64 object-cover',
    overlay: 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center',
    overlayContent: 'opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white',
    overlayIcon: 'mb-2',
    overlayIconSvg: 'w-8 h-8 mx-auto',
    overlayText: 'text-sm font-medium',
    infoOverlay: 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4',
    infoTitle: 'text-white font-semibold text-sm mb-1',
    infoDescription: 'text-gray-300 text-xs line-clamp-2',
    empty: {
      container: 'text-center py-16 bg-surface rounded-xl',
      icon: 'text-6xl mb-4',
      title: 'text-xl font-semibold text-white mb-2',
      subtitle: 'text-secondary mb-6'
    }
  },

  modal: {
    backdrop: 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4',
    container: 'bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden',
    header: 'flex items-center justify-between p-4 border-b border-gray-700',
    title: 'text-xl font-bold text-white',
    closeButton: 'text-gray-400 hover:text-white transition-colors',
    closeIcon: 'w-6 h-6',
    content: 'p-4',
    image: 'w-full max-h-[60vh] object-contain rounded-lg mb-4',
    description: 'bg-gray-900 rounded-lg p-4',
    descriptionText: 'text-gray-300 leading-relaxed',
    date: 'text-center mt-4',
    dateText: 'text-sm text-gray-400'
  }
}