import { useState, useMemo, useCallback } from 'react'
import { DEFAULT_VALUES, LESSON_DEFAULTS, MATERIAL_DEFAULTS } from '../constants/formConstants'

export const useCourseForm = ({ editingCourse, activeAreas, levels, onSave, onClose, showToast }) => {
  const initialFormData = useMemo(() => {
    const defaultArea = activeAreas?.[0]?.key || DEFAULT_VALUES.AREA
    const defaultLevel = levels?.[0]?.key || DEFAULT_VALUES.LEVEL

    return {
      title: editingCourse?.title || '',
      instructor: editingCourse?.instructor || '',
      area: editingCourse?.area || defaultArea,
      level: editingCourse?.level || defaultLevel,
      duration: editingCourse?.duration || DEFAULT_VALUES.DURATION,
      thumbnail: editingCourse?.thumbnail || '',
      description: editingCourse?.description || '',
      price: editingCourse?.price || DEFAULT_VALUES.PRICE,
      points: editingCourse?.points || DEFAULT_VALUES.POINTS,
      isDemo: editingCourse?.isDemo || false,
      featured: editingCourse?.featured || false,
      popular: editingCourse?.popular || false,
      isNew: editingCourse?.isNew || false,
      status: editingCourse?.status || DEFAULT_VALUES.STATUS,
      publishedAt: editingCourse?.publishedAt || null,
      enableEnrollment: editingCourse?.enableEnrollment !== false,
      enableComments: editingCourse?.enableComments !== false,
      enableRating: editingCourse?.enableRating !== false,
      maxParticipants: editingCourse?.maxParticipants || DEFAULT_VALUES.MAX_PARTICIPANTS,
      enrollmentUrl: editingCourse?.enrollmentUrl || ''
    }
  }, [editingCourse, activeAreas, levels])

  const [formData, setFormData] = useState(initialFormData)
  const [lessons, setLessons] = useState(editingCourse?.lessons || [])
  const [materials, setMaterials] = useState(editingCourse?.materials || [])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = useCallback((updates) => {
    setFormData(prevData =>
      typeof updates === 'function' ? updates(prevData) : { ...prevData, ...updates }
    )
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.title?.trim()) newErrors.title = 'El título es obligatorio'
    if (!formData.instructor?.trim()) newErrors.instructor = 'El instructor es obligatorio'
    if (!formData.description?.trim()) newErrors.description = 'La descripción es obligatoria'
    if (!formData.area) newErrors.area = 'El área es obligatoria'
    if (!formData.level) newErrors.level = 'El nivel es obligatorio'
    if (!formData.duration || formData.duration < 1) newErrors.duration = 'La duración debe ser mayor a 0'
    if (formData.price < 0) newErrors.price = 'El precio no puede ser negativo'

    if (!lessons || lessons.length === 0) {
      newErrors.lessons = 'Debe agregar al menos una lección'
    } else {
      lessons.forEach((lesson, index) => {
        if (!lesson.title?.trim()) {
          newErrors[`lesson_${index}_title`] = 'El título de la lección es obligatorio'
        }
        if (!lesson.duration || lesson.duration < 1) {
          newErrors[`lesson_${index}_duration`] = 'La duración debe ser mayor a 0'
        }
      })
    }

    setErrors(newErrors)
    return newErrors
  }, [formData, lessons])

  const addLesson = useCallback(() => {
    setLessons(prevLessons => [...prevLessons, {
      id: Date.now(),
      title: '',
      duration: LESSON_DEFAULTS.DURATION,
      videoUrl: LESSON_DEFAULTS.VIDEO_URL,
      videoFileId: LESSON_DEFAULTS.VIDEO_FILE_ID,
      isFree: LESSON_DEFAULTS.IS_FREE,
      description: LESSON_DEFAULTS.DESCRIPTION,
      materials: LESSON_DEFAULTS.MATERIALS
    }])
  }, [])

  const updateLesson = useCallback((index, field, value) => {
    setLessons(prevLessons =>
      prevLessons.map((lesson, i) =>
        i === index ? { ...lesson, [field]: value } : lesson
      )
    )
  }, [])

  const removeLesson = useCallback((index) => {
    setLessons(prevLessons => prevLessons.filter((_, i) => i !== index))
  }, [])

  const addMaterial = useCallback(() => {
    setMaterials(prevMaterials => [...prevMaterials, {
      id: Date.now(),
      name: MATERIAL_DEFAULTS.NAME,
      type: MATERIAL_DEFAULTS.TYPE,
      url: MATERIAL_DEFAULTS.URL,
      fileId: MATERIAL_DEFAULTS.FILE_ID,
      description: MATERIAL_DEFAULTS.DESCRIPTION
    }])
  }, [])

  const updateMaterial = useCallback((index, field, value) => {
    setMaterials(prevMaterials =>
      prevMaterials.map((material, i) =>
        i === index ? { ...material, [field]: value } : material
      )
    )
  }, [])

  const removeMaterial = useCallback((index) => {
    setMaterials(prevMaterials => prevMaterials.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    const validationErrors = validateForm()
    const hasValidationErrors = Object.keys(validationErrors).length > 0

    if (hasValidationErrors) {
      showToast('Por favor corrige los errores en el formulario', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const courseData = {
        ...formData,
        lessons: (lessons || []).map(lesson => ({
          ...lesson,
          materials: lesson.materials || []
        })),
        materials: materials || [],
        createdAt: editingCourse?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await onSave(courseData)
      showToast(editingCourse ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente', 'success')
      onClose()

    } catch (error) {
      showToast(`Error al guardar el curso: ${error.message || 'Error desconocido'}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, lessons, materials, validateForm, editingCourse, onSave, onClose, showToast])

  return {
    formData,
    updateFormData,
    lessons,
    materials,
    errors,
    isSubmitting,
    addLesson,
    updateLesson,
    removeLesson,
    addMaterial,
    updateMaterial,
    removeMaterial,
    handleSubmit
  }
}