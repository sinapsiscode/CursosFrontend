/**
 * AdvertisingModal component - Modal for managing advertising configuration
 */
const AdvertisingModal = ({ show, formData, setFormData, onSubmit, onClose }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">📢 Configurar Publicidad del Perfil</h3>
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
        <form onSubmit={onSubmit} className="p-6 space-y-8">
          {/* Banner Superior */}
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-4">
            <h4 className="text-lg font-bold text-white mb-4">🎯 Banner Promocional Superior</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Título Principal
                </label>
                <input
                  type="text"
                  value={formData.bannerTitle}
                  onChange={(e) => setFormData({ ...formData, bannerTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="¡Certifícate y potencia tu CV!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Subtítulo del Banner
                </label>
                <textarea
                  value={formData.bannerSubtitle}
                  onChange={(e) => setFormData({ ...formData, bannerSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Transforma tu carrera profesional con certificaciones oficiales..."
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Sección Motivacional */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-4">
            <h4 className="text-lg font-bold text-white mb-4">💼 Sección Motivacional Central</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Título Motivacional
                </label>
                <input
                  type="text"
                  value={formData.motivationalTitle}
                  onChange={(e) => setFormData({ ...formData, motivationalTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="💼 Destaca en el mercado laboral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Subtítulo Motivacional
                </label>
                <textarea
                  value={formData.motivationalSubtitle}
                  onChange={(e) => setFormData({ ...formData, motivationalSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Valida tus conocimientos con certificaciones oficiales..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Frase Motivacional
                </label>
                <input
                  type="text"
                  value={formData.motivationalQuote}
                  onChange={(e) => setFormData({ ...formData, motivationalQuote: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="El conocimiento certificado es tu mejor inversión profesional"
                />
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="text-white font-bold mb-4">👀 Vista Previa</h4>

            {/* Preview Banner */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-lg p-4 mb-4 opacity-75">
              <div className="text-center text-white">
                <h5 className="text-lg font-bold mb-2">
                  🎓 {formData.bannerTitle || 'Título del banner'} 🚀
                </h5>
                <p className="text-sm">
                  {formData.bannerSubtitle || 'Subtítulo del banner aparecerá aquí'}
                </p>
              </div>
            </div>

            {/* Preview Motivacional */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg p-4 opacity-75">
              <div className="text-center text-white">
                <h5 className="text-lg font-bold mb-2">
                  {formData.motivationalTitle || 'Título motivacional'}
                </h5>
                <p className="text-blue-200 text-sm mb-3">
                  {formData.motivationalSubtitle || 'Subtítulo motivacional aparecerá aquí'}
                </p>
                <div className="text-green-400 text-sm italic">
                  {formData.motivationalQuote || 'Frase motivacional aparecerá aquí'}
                </div>
              </div>
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
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdvertisingModal
