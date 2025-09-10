import React, { useState, useEffect } from 'react'
import { useUIStore } from '../../store'
import { Button, Card, Input, Modal } from '../../components/ui'
import apiClient from '../../api/client'

const CourseManager = () => {
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [courses, setCourses] = useState([])
  const [areas, setAreas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterArea, setFilterArea] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    area: '',
    level: 'beginner',
    duration: '',
    price: '',
    originalPrice: '',
    icon: '📚',
    status: 'draft',
    featured: false,
    bestseller: false,
    new: false,
    rating: 4.5,
    students: 0,
    lessons: [],
    requirements: [],
    whatYouLearn: [],
    targetAudience: [],
    tags: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [coursesData, areasData] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/areas')
      ])
      setCourses(coursesData)
      setAreas(areasData)
    } catch (error) {
      console.error('Error loading data:', error)
      showError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.area || !formData.price) {
      showError('Por favor completa los campos requeridos')
      return
    }
    
    setLoading(true)
    try {
      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        lessons: formData.lessons.filter(l => l.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        whatYouLearn: formData.whatYouLearn.filter(w => w.trim()),
        targetAudience: formData.targetAudience.filter(t => t.trim()),
        tags: formData.tags.filter(t => t.trim()),
        updatedAt: new Date().toISOString()
      }
      
      if (editingCourse) {
        const updated = await apiClient.put(`/api/courses/${editingCourse.id}`, courseData)
        setCourses(courses.map(c => c.id === editingCourse.id ? updated : c))
        showSuccess('Curso actualizado exitosamente')
      } else {
        courseData.id = Date.now().toString()
        courseData.createdAt = new Date().toISOString()
        courseData.enrollments = 0
        
        const created = await apiClient.post('/api/courses', courseData)
        setCourses([...courses, created])
        showSuccess('Curso creado exitosamente')
      }
      
      handleCloseModal()
    } catch (error) {
      console.error('Error saving course:', error)
      showError('Error al guardar el curso')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      ...course,
      lessons: course.lessons || [],
      requirements: course.requirements || [],
      whatYouLearn: course.whatYouLearn || [],
      targetAudience: course.targetAudience || [],
      tags: course.tags || []
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este curso?')) {
      setLoading(true)
      try {
        await apiClient.delete(`/api/courses/${id}`)
        setCourses(courses.filter(c => c.id !== id))
        showSuccess('Curso eliminado exitosamente')
      } catch (error) {
        console.error('Error deleting course:', error)
        showError('Error al eliminar el curso')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleToggleStatus = async (course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published'
    try {
      const updated = await apiClient.patch(`/api/courses/${course.id}`, { status: newStatus })
      setCourses(courses.map(c => c.id === course.id ? { ...c, status: newStatus } : c))
      showSuccess(`Curso ${newStatus === 'published' ? 'publicado' : 'despublicado'}`)
    } catch (error) {
      showError('Error al actualizar el estado')
    }
  }

  const handleToggleFeatured = async (course) => {
    try {
      const updated = await apiClient.patch(`/api/courses/${course.id}`, { featured: !course.featured })
      setCourses(courses.map(c => c.id === course.id ? { ...c, featured: !course.featured } : c))
      showSuccess(course.featured ? 'Curso removido de destacados' : 'Curso destacado')
    } catch (error) {
      showError('Error al actualizar')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCourse(null)
    setFormData({
      title: '',
      description: '',
      instructor: '',
      area: '',
      level: 'beginner',
      duration: '',
      price: '',
      originalPrice: '',
      icon: '📚',
      status: 'draft',
      featured: false,
      bestseller: false,
      new: false,
      rating: 4.5,
      students: 0,
      lessons: [],
      requirements: [],
      whatYouLearn: [],
      targetAudience: [],
      tags: []
    })
  }

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]]
    if (value === '' && index === newArray.length - 1) {
      newArray.pop()
    } else {
      newArray[index] = value
    }
    
    if (index === newArray.length - 1 && value !== '') {
      newArray.push('')
    }
    
    setFormData({ ...formData, [field]: newArray })
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArea = filterArea === 'all' || course.area === filterArea
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    return matchesSearch && matchesArea && matchesStatus
  })

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    featured: courses.filter(c => c.featured).length,
    totalRevenue: courses.reduce((acc, c) => acc + (c.price * (c.enrollments || 0)), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Gestión de Cursos</h1>
            <p className="text-text-secondary mt-2">Administra todos los cursos de la plataforma</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            + Nuevo Curso
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-sm text-text-secondary">Total Cursos</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-400">{stats.published}</p>
            <p className="text-sm text-text-secondary">Publicados</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-yellow-400">{stats.draft}</p>
            <p className="text-sm text-text-secondary">Borradores</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-purple-400">{stats.featured}</p>
            <p className="text-sm text-text-secondary">Destacados</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-accent">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-text-secondary">Ingresos Totales</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="search"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">Todas las áreas</option>
            {areas.map(area => (
              <option key={area.id} value={area.slug}>{area.name}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>
        </div>
      </Card>

      {/* Courses Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Curso</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Área</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Estudiantes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Destacado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-text-secondary">
                    Cargando cursos...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-text-secondary">
                    No se encontraron cursos
                  </td>
                </tr>
              ) : (
                filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-surface/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{course.icon}</span>
                        <div>
                          <p className="font-medium text-text-primary">{course.title}</p>
                          <p className="text-sm text-text-secondary">{course.instructor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-text-secondary">
                        {areas.find(a => a.slug === course.area)?.name || course.area}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-text-primary">${course.price}</p>
                        {course.originalPrice && (
                          <p className="text-sm text-text-secondary line-through">${course.originalPrice}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-text-primary">{course.enrollments || 0}</span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(course)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          course.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {course.status === 'published' ? 'Publicado' : 'Borrador'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleFeatured(course)}
                        className="text-2xl"
                      >
                        {course.featured ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Course Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCourse ? 'Editar Curso' : 'Nuevo Curso'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Título del Curso *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            
            <Input
              label="Instructor"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            />
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Área *
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="">Selecciona un área</option>
                {areas.map(area => (
                  <option key={area.id} value={area.slug}>{area.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nivel
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
            
            <Input
              label="Duración"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="Ej: 8 horas"
            />
            
            <Input
              label="Ícono (emoji)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
            
            <Input
              label="Precio *"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            
            <Input
              label="Precio Original"
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="Para mostrar descuento"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Describe el curso..."
            />
          </div>
          
          {/* Arrays Fields */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              ¿Qué aprenderás?
            </label>
            {[...formData.whatYouLearn, ''].map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleArrayFieldChange('whatYouLearn', index, e.target.value)}
                placeholder="Ej: Crear aplicaciones web modernas"
                className="mb-2"
              />
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Requisitos
            </label>
            {[...formData.requirements, ''].map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                placeholder="Ej: Conocimientos básicos de HTML"
                className="mb-2"
              />
            ))}
          </div>
          
          {/* Checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              <span className="text-text-primary">Destacado</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.bestseller}
                onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                className="mr-2"
              />
              <span className="text-text-primary">Bestseller</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.new}
                onChange={(e) => setFormData({ ...formData, new: e.target.checked })}
                className="mr-2"
              />
              <span className="text-text-primary">Nuevo</span>
            </label>
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : editingCourse ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CourseManager