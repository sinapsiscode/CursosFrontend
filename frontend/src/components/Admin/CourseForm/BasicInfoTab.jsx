import { FileUploadButton } from './FileUploadButton'

const BasicInfoTab = ({ formData, updateFormData, errors, activeAreas, levels, handleFileUpload }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Título del Curso *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.title ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Ej: Fundamentos de Metalurgia"
          />
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Instructor *
          </label>
          <input
            type="text"
            value={formData.instructor}
            onChange={(e) => updateFormData({ instructor: e.target.value })}
            className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.instructor ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Dr. Juan Pérez"
          />
          {errors.instructor && <p className="mt-1 text-sm text-red-400">{errors.instructor}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Área *
          </label>
          <select
            value={formData.area}
            onChange={(e) => updateFormData({ area: e.target.value })}
            className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.area ? 'border-red-500' : 'border-gray-600'
            }`}
          >
            {activeAreas.map(area => (
              <option key={area.key} value={area.key}>
                {area.icon} {area.name}
              </option>
            ))}
          </select>
          {errors.area && <p className="mt-1 text-sm text-red-400">{errors.area}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Nivel *
          </label>
          <select
            value={formData.level}
            onChange={(e) => updateFormData({ level: e.target.value })}
            className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.level ? 'border-red-500' : 'border-gray-600'
            }`}
          >
            {levels.map(level => (
              <option key={level.key} value={level.key}>
                {level.name}
              </option>
            ))}
          </select>
          {errors.level && <p className="mt-1 text-sm text-red-400">{errors.level}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Duración (minutos) *
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => updateFormData({ duration: parseInt(e.target.value) || 0 })}
            className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.duration ? 'border-red-500' : 'border-gray-600'
            }`}
            min="1"
          />
          {errors.duration && <p className="mt-1 text-sm text-red-400">{errors.duration}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Precio
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
            className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.price ? 'border-red-500' : 'border-gray-600'
            }`}
            min="0"
            step="0.01"
          />
          {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            N° de participantes
          </label>
          <input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => updateFormData({ maxParticipants: parseInt(e.target.value) || 50 })}
            className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.maxParticipants ? 'border-red-500' : 'border-gray-600'
            }`}
            min="1"
            placeholder="50"
          />
          {errors.maxParticipants && <p className="mt-1 text-sm text-red-400">{errors.maxParticipants}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Puntos de Fidelización
          </label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => updateFormData({ points: parseInt(e.target.value) || 100 })}
            className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.points ? 'border-red-500' : 'border-gray-600'
            }`}
            min="0"
            step="10"
            placeholder="100"
          />
          <p className="mt-1 text-xs text-gray-400">
            Puntos que el estudiante ganará al completar este curso
          </p>
          {errors.points && <p className="mt-1 text-sm text-red-400">{errors.points}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Imagen de Portada
        </label>
        <div className="space-y-4">
          {formData.thumbnail && (
            <div className="flex items-center space-x-4">
              <img
                src={formData.thumbnail}
                alt="Portada actual"
                className="object-cover w-24 h-16 rounded-lg"
              />
              <button
                type="button"
                onClick={() => updateFormData({ thumbnail: '' })}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Eliminar imagen
              </button>
            </div>
          )}
          <div className="flex space-x-4">
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => updateFormData({ thumbnail: e.target.value })}
              className="flex-1 px-4 py-2 text-white border border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="URL de la imagen o sube un archivo"
            />
            <FileUploadButton
              type="image"
              onUpload={(url) => updateFormData({ thumbnail: url })}
              handleFileUpload={handleFileUpload}
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Subir Imagen
            </FileUploadButton>
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows="4"
          className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
            errors.description ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Describe lo que los estudiantes aprenderán en este curso..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
      </div>
    </div>
  )
}

export default BasicInfoTab