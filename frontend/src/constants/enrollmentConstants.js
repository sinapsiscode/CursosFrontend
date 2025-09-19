export const ENROLLMENT_STYLES = {
  button: 'bg-accent text-background px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  loadingContainer: 'flex items-center',
  loadingSpinner: 'animate-spin h-5 w-5 mr-2',
  modalOverlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
  modalContent: 'bg-gray-800 rounded-xl p-6 w-full max-w-md',
  modalTitle: 'text-xl font-bold text-white mb-4',
  courseInfoCard: 'bg-gray-700/50 rounded-lg p-4 mb-4',
  courseTitle: 'font-medium text-white mb-2',
  courseDetails: 'text-sm text-gray-400',
  priceSection: 'space-y-3 mb-6',
  priceRow: 'flex justify-between text-gray-300',
  discountRow: 'flex justify-between text-green-400',
  totalRow: 'border-t border-gray-600 pt-3 flex justify-between',
  totalLabel: 'font-medium text-white',
  totalAmount: 'text-xl font-bold text-white',
  pointsCard: 'bg-purple-600/20 border border-purple-500/50 rounded-lg p-3 mb-6',
  pointsContainer: 'flex items-center justify-between',
  pointsLabel: 'text-purple-300',
  pointsAmount: 'text-xl font-bold text-purple-400',
  levelSection: 'text-center mb-6',
  levelLabel: 'text-xs text-gray-400 mb-1',
  levelContainer: 'flex items-center justify-center space-x-2',
  levelIcon: 'text-2xl',
  levelName: 'font-medium',
  buttonContainer: 'flex space-x-3',
  cancelButton: 'flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors',
  confirmButton: 'flex-1 bg-accent text-background py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50'
}

export const ENROLLMENT_TEXTS = {
  acquireCourse: 'Adquirir curso completo',
  processing: 'Procesando...',
  purchaseDetails: 'Detalles de Compra',
  originalPrice: 'Precio original',
  levelDiscount: 'Descuento nivel',
  totalToPay: 'Total a pagar',
  pointsToEarn: 'Puntos a ganar',
  currentLevel: 'Tu nivel actual',
  cancel: 'Cancelar',
  confirmPurchase: 'Confirmar Compra',
  enrolling: 'Procesando...',
  lessons: 'lecciones'
}

export const ENROLLMENT_ICONS = {
  spinner: {
    circle: "opacity-25",
    path: "opacity-75"
  }
}

export const ENROLLMENT_TYPES = {
  whatsapp: 'whatsapp_purchase',
  paid: 'paid',
  free: 'free'
}

export const ENROLLMENT_STATUS = {
  active: 'active',
  pending: 'pending_payment'
}

export const POINTS_CONFIG = {
  courseEnrollment: 100,
  freeEnrollment: 50,
  purchaseMultiplier: 10
}

export const NOTIFICATION_CONFIGS = {
  enrollment: {
    type: 'success',
    title: '✅ Pre-inscripción Exitosa',
    icon: '🎯',
    persistent: true
  },
  freeEnrollment: {
    type: 'success',
    title: '¡Inscripción Exitosa!',
    icon: '🎉',
    persistent: true
  },
  purchase: {
    type: 'success',
    title: '¡Compra Exitosa!',
    icon: '🛒',
    persistent: true
  }
}

export const WHATSAPP_MESSAGE_TEMPLATE = {
  header: '*Solicitud de Inscripción - {courseTitle}*\n\n',
  courseInfo: '📚 *Curso:* {courseTitle}\n🎯 *Área:* {courseArea}\n⭐ *Nivel:* {courseLevel}\n💰 *Precio:* ${finalPrice}\n\n',
  studentInfo: '👤 *Estudiante:*\nNombre: {userName}\nEmail: {userEmail}\nID: {userId}\n\n',
  actionInfo: '🚀 *Quiero adquirir este curso completo*\nPor favor, envíenme información sobre métodos de pago y acceso inmediato.\n\nFecha de solicitud: {currentDate}'
}

export const DEFAULT_WHATSAPP_PHONE = '+57 300 123 4567'