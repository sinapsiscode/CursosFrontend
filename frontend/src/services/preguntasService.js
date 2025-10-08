import apiClient from './apiClient'

/**
 * Servicio para gestión de preguntas de exámenes
 * USA JSON SERVER - Reemplaza localStorage('exam_questions')
 */
class PreguntasService {
  /**
   * Obtener todas las preguntas con filtros
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      if (filters.examId) params.append('examId', filters.examId)
      if (filters.courseId) params.append('courseId', filters.courseId)
      if (filters.tipo) params.append('tipo', filters.tipo)
      if (filters.dificultad) params.append('dificultad', filters.dificultad)

      const queryString = params.toString()
      const url = queryString ? `/preguntas?${queryString}` : '/preguntas'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo preguntas:', error)
      throw error
    }
  }

  /**
   * Obtener pregunta por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/preguntas/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo pregunta ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener preguntas de un examen
   */
  async getByExamId(examId) {
    try {
      const preguntas = await this.getAll({ examId })

      // Ordenar por orden definido
      return preguntas.sort((a, b) => (a.orden || 0) - (b.orden || 0))
    } catch (error) {
      console.error(`Error obteniendo preguntas del examen ${examId}:`, error)
      throw error
    }
  }

  /**
   * Obtener preguntas de un curso
   */
  async getByCourseId(courseId) {
    try {
      return await this.getAll({ courseId })
    } catch (error) {
      console.error(`Error obteniendo preguntas del curso ${courseId}:`, error)
      throw error
    }
  }

  /**
   * Crear nueva pregunta
   */
  async create(questionData) {
    try {
      const newQuestion = {
        examId: questionData.examId,
        courseId: questionData.courseId,
        tipo: questionData.tipo || 'multiple', // multiple | verdadero_falso | abierta
        pregunta: questionData.pregunta,
        opciones: questionData.opciones || [],
        respuestaCorrecta: questionData.respuestaCorrecta,
        explicacion: questionData.explicacion || '',
        puntos: questionData.puntos || 1,
        dificultad: questionData.dificultad || 'media', // facil | media | dificil
        orden: questionData.orden || 0,
        activa: questionData.activa !== undefined ? questionData.activa : true,
        tags: questionData.tags || [],
        imagen: questionData.imagen || null,
        createdAt: new Date().toISOString(),
        createdBy: questionData.createdBy || null
      }

      const response = await apiClient.post('/preguntas', newQuestion)
      console.log('✅ Pregunta creada:', response.data)
      return { success: true, question: response.data }
    } catch (error) {
      console.error('Error creando pregunta:', error)
      throw error
    }
  }

  /**
   * Actualizar pregunta existente
   */
  async update(id, updateData) {
    try {
      const updates = {
        ...updateData,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/preguntas/${id}`, updates)
      console.log(`✅ Pregunta ${id} actualizada`)
      return { success: true, question: response.data }
    } catch (error) {
      console.error(`Error actualizando pregunta ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar pregunta
   */
  async delete(id) {
    try {
      await apiClient.delete(`/preguntas/${id}`)
      console.log('✅ Pregunta eliminada:', id)
      return { success: true }
    } catch (error) {
      console.error(`Error eliminando pregunta ${id}:`, error)
      throw error
    }
  }

  /**
   * Duplicar pregunta
   */
  async duplicate(id) {
    try {
      const original = await this.getById(id)

      const duplicated = {
        ...original,
        pregunta: `${original.pregunta} (Copia)`,
        createdAt: new Date().toISOString()
      }

      delete duplicated.id

      const response = await apiClient.post('/preguntas', duplicated)
      console.log('✅ Pregunta duplicada:', response.data)
      return { success: true, question: response.data }
    } catch (error) {
      console.error(`Error duplicando pregunta ${id}:`, error)
      throw error
    }
  }

  /**
   * Actualizar orden de preguntas
   */
  async reorder(examId, questionsOrder) {
    try {
      const updatePromises = questionsOrder.map((questionId, index) =>
        this.update(questionId, { orden: index + 1 })
      )

      await Promise.all(updatePromises)
      console.log(`✅ Orden de preguntas actualizado para examen ${examId}`)
      return { success: true }
    } catch (error) {
      console.error('Error reordenando preguntas:', error)
      throw error
    }
  }

  /**
   * Activar/Desactivar pregunta
   */
  async toggleActive(id) {
    try {
      const question = await this.getById(id)
      const updates = {
        activa: !question.activa,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/preguntas/${id}`, updates)
      console.log(`✅ Pregunta ${id} ${response.data.activa ? 'activada' : 'desactivada'}`)
      return { success: true, question: response.data }
    } catch (error) {
      console.error(`Error cambiando estado de pregunta ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de preguntas de un examen
   */
  async getExamQuestionStats(examId) {
    try {
      const preguntas = await this.getByExamId(examId)

      return {
        total: preguntas.length,
        activas: preguntas.filter(p => p.activa).length,
        inactivas: preguntas.filter(p => !p.activa).length,
        byType: {
          multiple: preguntas.filter(p => p.tipo === 'multiple').length,
          verdadero_falso: preguntas.filter(p => p.tipo === 'verdadero_falso').length,
          abierta: preguntas.filter(p => p.tipo === 'abierta').length
        },
        byDifficulty: {
          facil: preguntas.filter(p => p.dificultad === 'facil').length,
          media: preguntas.filter(p => p.dificultad === 'media').length,
          dificil: preguntas.filter(p => p.dificultad === 'dificil').length
        },
        totalPoints: preguntas.reduce((sum, p) => sum + (p.puntos || 0), 0)
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas de preguntas:', error)
      throw error
    }
  }

  /**
   * Importar preguntas en lote
   */
  async importBatch(questions) {
    try {
      const createPromises = questions.map(q => this.create(q))
      const results = await Promise.all(createPromises)

      console.log(`✅ ${results.length} preguntas importadas`)
      return {
        success: true,
        imported: results.length,
        questions: results.map(r => r.question)
      }
    } catch (error) {
      console.error('Error importando preguntas:', error)
      throw error
    }
  }

  /**
   * Exportar preguntas de un examen
   */
  async exportExamQuestions(examId) {
    try {
      const preguntas = await this.getByExamId(examId)

      // Formatear para exportación
      return {
        examId,
        totalQuestions: preguntas.length,
        exportedAt: new Date().toISOString(),
        questions: preguntas.map(p => ({
          tipo: p.tipo,
          pregunta: p.pregunta,
          opciones: p.opciones,
          respuestaCorrecta: p.respuestaCorrecta,
          explicacion: p.explicacion,
          puntos: p.puntos,
          dificultad: p.dificultad,
          tags: p.tags
        }))
      }
    } catch (error) {
      console.error('Error exportando preguntas:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const preguntasService = new PreguntasService()
export default preguntasService
