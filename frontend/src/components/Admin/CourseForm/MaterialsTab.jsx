import { FileUploadButton } from './FileUploadButton'
import { ProgressBar } from './ProgressBar'
import { MATERIAL_TYPES } from '../../../constants/formConstants'

const MaterialsTab = ({ materials, addMaterial, updateMaterial, removeMaterial, uploadProgress, handleFileUpload }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Materiales del Curso</h3>
        <button
          type="button"
          onClick={addMaterial}
          className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          + Agregar Material
        </button>
      </div>

      <div className="space-y-4">
        {materials.map((material, index) => (
          <div key={material.id} className="bg-background rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="text-white font-medium">Material {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Material
                </label>
                <input
                  type="text"
                  value={material.name}
                  onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ej: Manual de Referencia.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo
                </label>
                <select
                  value={material.type}
                  onChange={(e) => updateMaterial(index, 'type', e.target.value)}
                  className="w-full px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {MATERIAL_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Archivo
              </label>
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <input
                    type="url"
                    value={material.url}
                    onChange={(e) => updateMaterial(index, 'url', e.target.value)}
                    className="flex-1 px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="URL del archivo o sube un archivo"
                  />
                  <FileUploadButton
                    type="document"
                    accept={material.type === 'pdf' ? '.pdf' : '*/*'}
                    onUpload={(url, fileId) => {
                      updateMaterial(index, 'url', url)
                      updateMaterial(index, 'fileId', fileId)
                    }}
                    handleFileUpload={handleFileUpload}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Subir Archivo
                  </FileUploadButton>
                </div>
                {material.fileId && uploadProgress[material.fileId] !== undefined && (
                  <ProgressBar progress={uploadProgress[material.fileId]} />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={material.description || ''}
                onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                rows="2"
                className="w-full px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Breve descripción de este material..."
              />
            </div>
          </div>
        ))}

        {materials.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No hay materiales agregados</p>
            <p className="text-sm">Agrega PDFs, documentos, presentaciones y más</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MaterialsTab