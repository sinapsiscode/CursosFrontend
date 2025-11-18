/**
 * Default configurations for AdminPhotos module
 */

export const defaultLinks = {
  proUpgradeUrl: 'https://ejemplo.com/upgrade-pro',
  whatsappChannelUrl: 'https://chat.whatsapp.com/ejemplo123'
}

export const defaultButtons = {
  showProButton: true,
  showWhatsAppButton: true,
  showBanner: true,
  proButtonText: 'Subir a Pro',
  whatsAppButtonText: 'Unirse al Canal de WhatsApp',
  bannerButtonText: 'Ver más'
}

export const defaultAdvertising = {
  bannerTitle: '¡Certifícate y potencia tu CV!',
  bannerSubtitle: 'Transforma tu carrera profesional con certificaciones oficiales que te destacarán en el mercado laboral',
  motivationalTitle: '💼 Destaca en el mercado laboral',
  motivationalSubtitle: 'Valida tus conocimientos con certificaciones oficiales reconocidas por la industria',
  motivationalQuote: '"El conocimiento certificado es tu mejor inversión profesional"'
}

export const initialFormState = {
  photo: {
    title: '',
    description: '',
    imageUrl: '',
    date: '',
    active: true
  },
  links: {
    proUpgradeUrl: '',
    whatsappChannelUrl: ''
  },
  buttons: {
    showProButton: true,
    showWhatsAppButton: true,
    showBanner: true,
    proButtonText: 'Subir a Pro',
    whatsAppButtonText: 'Unirse al Canal de WhatsApp',
    bannerButtonText: 'Ver más'
  },
  advertising: {
    bannerTitle: '',
    bannerSubtitle: '',
    motivationalTitle: '',
    motivationalSubtitle: '',
    motivationalQuote: ''
  }
}
