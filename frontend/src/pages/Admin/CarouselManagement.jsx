import { useState, useEffect } from 'react'
import { carouselService } from '../../services/carouselService'
import Swal from 'sweetalert2'

const IMAGE_SPECS = {
  recommendedWidth: 1920,
  recommendedHeight: 600,
  maxSizeKB: 500,
  formats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

const CarouselManagement = () => {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSlides()
  }, [])

  const loadSlides = async () => {
    try {
      setLoading(true)
      const data = await carouselService.getAllSlides()
      setSlides(data)
    } catch (error) {
      console.error('Error cargando slides:', error)
      Swal.fire('Error', 'No se pudieron cargar los slides', 'error')
    } finally {
      setLoading(false)
    }
  }

  const validateImage = (file) => {
    // Validar formato
    if (!IMAGE_SPECS.formats.includes(file.type)) {
      return {
        valid: false,
        message: `Formato no válido. Use: ${IMAGE_SPECS.formats.join(', ')}`
      }
    }

    // Validar tamaño
    const sizeKB = file.size / 1024
    if (sizeKB > IMAGE_SPECS.maxSizeKB) {
      return {
        valid: false,
        message: `Imagen muy pesada (${Math.round(sizeKB)}KB). Máximo: ${IMAGE_SPECS.maxSizeKB}KB`
      }
    }

    return { valid: true }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleUploadImage = async (slideId) => {
    const { value: file } = await Swal.fire({
      title: 'Subir Imagen de Fondo',
      html: `
        <div class="text-left p-4">
          <div class="mb-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded">
            <p class="text-sm text-blue-300 mb-2"><strong>📐 Especificaciones recomendadas:</strong></p>
            <ul class="text-xs text-blue-200 space-y-1">
              <li>• Tamaño: <strong>${IMAGE_SPECS.recommendedWidth}x${IMAGE_SPECS.recommendedHeight}px</strong></li>
              <li>• Formatos: <strong>JPG, PNG, WebP</strong></li>
              <li>• Peso máximo: <strong>${IMAGE_SPECS.maxSizeKB}KB</strong></li>
              <li>• Relación de aspecto: <strong>16:5 (panorámica)</strong></li>
            </ul>
          </div>
          <input type="file" id="file-input" class="swal2-file" accept="image/jpeg,image/jpg,image/png,image/webp">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Subir',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const file = document.getElementById('file-input').files[0]
        if (!file) {
          Swal.showValidationMessage('Debes seleccionar una imagen')
          return false
        }

        const validation = validateImage(file)
        if (!validation.valid) {
          Swal.showValidationMessage(validation.message)
          return false
        }

        return file
      }
    })

    if (file) {
      try {
        Swal.fire({
          title: 'Subiendo imagen...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        })

        const base64 = await convertToBase64(file)
        await carouselService.update(slideId, { image: base64 })

        Swal.fire('¡Subida!', 'La imagen ha sido cargada exitosamente', 'success')
        loadSlides()
      } catch (error) {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error')
      }
    }
  }

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Crear Nuevo Slide',
      html: `
        <div class="text-left">
          <input id="title" class="swal2-input" placeholder="Título">
          <input id="subtitle" class="swal2-input" placeholder="Subtítulo">
          <input id="order" type="number" class="swal2-input" placeholder="Orden" value="${slides.length + 1}">
          <div class="mt-3 p-3 bg-gray-700 rounded text-xs text-gray-300">
            💡 <strong>Nota:</strong> Podrás agregar la imagen después de crear el slide
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const title = document.getElementById('title').value
        const subtitle = document.getElementById('subtitle').value
        const order = parseInt(document.getElementById('order').value)

        if (!title || !subtitle) {
          Swal.showValidationMessage('Título y subtítulo son requeridos')
          return false
        }

        return { title, subtitle, order }
      }
    })

    if (formValues) {
      try {
        await carouselService.create(formValues)
        Swal.fire('¡Creado!', 'El slide ha sido creado. Ahora puedes agregarle una imagen.', 'success')
        loadSlides()
      } catch (error) {
        Swal.fire('Error', 'No se pudo crear el slide', 'error')
      }
    }
  }

  const handleEdit = async (slide) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Slide',
      html: `
        <input id="title" class="swal2-input" placeholder="Título" value="${slide.title}">
        <input id="subtitle" class="swal2-input" placeholder="Subtítulo" value="${slide.subtitle}">
        <input id="order" type="number" class="swal2-input" placeholder="Orden" value="${slide.order}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const title = document.getElementById('title').value
        const subtitle = document.getElementById('subtitle').value
        const order = parseInt(document.getElementById('order').value)

        if (!title || !subtitle) {
          Swal.showValidationMessage('Título y subtítulo son requeridos')
          return false
        }

        return { title, subtitle, order }
      }
    })

    if (formValues) {
      try {
        await carouselService.update(slide.id, formValues)
        Swal.fire('¡Actualizado!', 'El slide ha sido actualizado', 'success')
        loadSlides()
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar el slide', 'error')
      }
    }
  }

  const handleToggleActive = async (slide) => {
    try {
      await carouselService.toggleActive(slide.id)
      Swal.fire('¡Actualizado!', `Slide ${slide.active ? 'desactivado' : 'activado'}`, 'success')
      loadSlides()
    } catch (error) {
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error')
    }
  }

  const handleDelete = async (slide) => {
    const result = await Swal.fire({
      title: '¿Eliminar slide?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await carouselService.delete(slide.id)
        Swal.fire('¡Eliminado!', 'El slide ha sido eliminado', 'success')
        loadSlides()
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el slide', 'error')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Gestión de Carrusel</h1>
        <p className="text-sm sm:text-base text-gray-400 mb-4">
          Administra los slides del carrusel principal del home
        </p>

        {/* Especificaciones de imagen */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 sm:p-4 max-w-2xl">
          <h3 className="text-sm sm:text-base text-blue-400 font-semibold mb-2">📐 Especificaciones de Imágenes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-blue-200">
            <div>
              <strong>Tamaño:</strong> {IMAGE_SPECS.recommendedWidth}x{IMAGE_SPECS.recommendedHeight}px
            </div>
            <div>
              <strong>Peso máx:</strong> {IMAGE_SPECS.maxSizeKB}KB
            </div>
            <div>
              <strong>Formatos:</strong> JPG, PNG, WebP
            </div>
            <div>
              <strong>Aspecto:</strong> 16:5 (panorámico)
            </div>
          </div>
        </div>
      </div>

      {/* Botón crear */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={handleCreate}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors"
        >
          + Crear Nuevo Slide
        </button>
      </div>

      {/* Lista de slides */}
      <div className="bg-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Orden</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Vista Previa</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Título</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm hidden md:table-cell">Subtítulo</th>
              <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Estado</th>
              <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr
                key={slide.id}
                className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors"
              >
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-white font-semibold text-xs sm:text-sm">
                  #{slide.order}
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-24 sm:w-32 h-8 sm:h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 sm:w-32 h-8 sm:h-10 bg-gray-700 rounded flex items-center justify-center text-[10px] sm:text-xs text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-white font-medium text-xs sm:text-sm">
                  <div className="max-w-[120px] sm:max-w-none truncate">
                    {slide.title}
                  </div>
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                  <div className="max-w-[200px] truncate">
                    {slide.subtitle}
                  </div>
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                  <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      slide.active
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {slide.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4">
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handleUploadImage(slide.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-sm transition-colors whitespace-nowrap"
                      title="Cambiar imagen"
                    >
                      🖼️ Imagen
                    </button>
                    <button
                      onClick={() => handleEdit(slide)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-sm transition-colors whitespace-nowrap"
                      title="Editar texto"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`${
                        slide.active
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-sm transition-colors whitespace-nowrap`}
                      title={slide.active ? 'Desactivar' : 'Activar'}
                    >
                      {slide.active ? '👁️' : '✅'} <span className="hidden sm:inline">{slide.active ? 'Ocultar' : 'Activar'}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(slide)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-sm transition-colors whitespace-nowrap"
                      title="Eliminar"
                    >
                      🗑️ <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {slides.length === 0 && (
          <div className="py-8 sm:py-12 text-center text-gray-400 text-sm sm:text-base">
            No hay slides creados. Crea el primero.
          </div>
        )}
      </div>
    </div>
  )
}

export default CarouselManagement
