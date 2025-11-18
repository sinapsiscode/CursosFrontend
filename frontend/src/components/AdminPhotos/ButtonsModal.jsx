/**
 * ButtonsModal component - Modal for managing profile buttons configuration
 */
const ButtonsModal = ({ show, formData, setFormData, onSubmit, onClose }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">🔘 Configurar Botones del Perfil</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Visibilidad de Botones */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
              <span className="text-white font-medium">👑 Botón Pro</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showProButton}
                  onChange={(e) => setFormData({ ...formData, showProButton: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
              <span className="text-white font-medium">💬 Botón WhatsApp</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showWhatsAppButton}
                  onChange={(e) => setFormData({ ...formData, showWhatsAppButton: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
              <span className="text-white font-medium">🎓 Banner</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showBanner}
                  onChange={(e) => setFormData({ ...formData, showBanner: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>

          {/* Textos de Botones */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                👑 Texto del Botón Pro
              </label>
              <input
                type="text"
                value={formData.proButtonText}
                onChange={(e) => setFormData({ ...formData, proButtonText: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Subir a Pro"
                disabled={!formData.showProButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                💬 Texto del Botón WhatsApp
              </label>
              <input
                type="text"
                value={formData.whatsAppButtonText}
                onChange={(e) => setFormData({ ...formData, whatsAppButtonText: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Unirse al Canal de WhatsApp"
                disabled={!formData.showWhatsAppButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                🎓 Texto del Botón del Banner
              </label>
              <input
                type="text"
                value={formData.bannerButtonText}
                onChange={(e) => setFormData({ ...formData, bannerButtonText: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Ver más"
                disabled={!formData.showBanner}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ButtonsModal
