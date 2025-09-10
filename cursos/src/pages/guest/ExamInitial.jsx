import React, { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { Button } from '../../components/ui'
import { InitialExam } from '../../components/exams'
import { LeadCaptureForm } from '../../components/forms'
import apiClient from '../../api/client'

const ExamInitial = () => {
  const { selectedArea, guestMode } = useAuthStore()
  const { showSuccess, showError } = useUIStore()
  
  const [examStarted, setExamStarted] = useState(false)
  const [examResults, setExamResults] = useState(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 1250,
    averageDiscount: 18,
    popularArea: 'Metalurgia'
  })

  useEffect(() => {
    // Cargar estadísticas del examen
    loadExamStats()
  }, [])

  const loadExamStats = async () => {
    try {
      const analyticsData = await apiClient.get('/analytics/dashboard')
      // En la implementación real, calcular estadísticas del examen
      setStats({
        totalUsers: analyticsData.totalLeads || 1250,
        averageDiscount: 18,
        popularArea: selectedArea || 'Metalurgia'
      })
    } catch (error) {
      console.error('Error loading exam stats:', error)
      // Usar stats por defecto
    }
  }

  const handleStartExam = () => {
    setExamStarted(true)
  }

  const handleExamComplete = async (results) => {
    setExamResults(results)
    
    // Guardar resultados del examen
    try {
      await apiClient.post('/api/exam-results', {
        ...results,
        userId: guestMode ? null : 'current_user_id',
        sessionId: Date.now().toString()
      })
    } catch (error) {
      console.error('Error saving exam results:', error)
    }

    showSuccess('¡Examen completado exitosamente!')
  }

  const handleClaimDiscount = () => {
    setShowLeadForm(true)
  }

  if (examStarted && !examResults) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          <InitialExam onComplete={handleExamComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Examen de Diagnóstico
          </h1>
          <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
            Descubre tu nivel en <span className="text-accent font-semibold">{selectedArea || 'tu área de interés'}</span> y 
            obtén un descuento personalizado en nuestros cursos
          </p>
          
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-accent">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-text-secondary">Estudiantes evaluados</div>
            </div>
            <div className="bg-surface/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">{stats.averageDiscount}%</div>
              <div className="text-sm text-text-secondary">Descuento promedio</div>
            </div>
            <div className="bg-surface/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">2-5</div>
              <div className="text-sm text-text-secondary">Minutos para completar</div>
            </div>
          </div>

          {!examResults && (
            <Button onClick={handleStartExam} size="large" className="px-8 py-3">
              Comenzar Examen Gratis
            </Button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Rápido y Fácil
              </h3>
              <p className="text-text-secondary">
                Solo 5-7 preguntas diseñadas para evaluar tu nivel actual de conocimiento
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Descuentos Reales
              </h3>
              <p className="text-text-secondary">
                Obtén hasta 30% de descuento basado en tu perfil y necesidades de aprendizaje
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Plan Personalizado
              </h3>
              <p className="text-text-secondary">
                Recibe recomendaciones específicas sobre qué cursos son ideales para ti
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Sin Compromiso
              </h3>
              <p className="text-text-secondary">
                Es completamente gratuito y no requiere registro previo
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Creado por Expertos
              </h3>
              <p className="text-text-secondary">
                Preguntas diseñadas por profesionales con años de experiencia en {selectedArea || 'la industria'}
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Asesoramiento Gratis
              </h3>
              <p className="text-text-secondary">
                Al completar el examen, podrás hablar con uno de nuestros asesores académicos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-surface/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-text-primary mb-12">
            ¿Cómo Funciona?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Responde</h3>
              <p className="text-sm text-text-secondary">
                5-7 preguntas sobre tu experiencia y objetivos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Evaluamos</h3>
              <p className="text-sm text-text-secondary">
                Nuestro sistema analiza tus respuestas instantáneamente
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Obtienes</h3>
              <p className="text-sm text-text-secondary">
                Tu descuento personalizado y plan de estudios
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Comienza</h3>
              <p className="text-sm text-text-secondary">
                Inscríbete en el curso ideal con tu descuento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {examResults && (
        <div className="py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-surface rounded-xl p-8 border border-gray-700 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                ¡Resultados de tu Examen!
              </h2>
              
              <div className="bg-background rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-3xl font-bold text-accent">{examResults.totalPoints}</div>
                    <div className="text-sm text-text-secondary">Puntos obtenidos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400">{examResults.discount}%</div>
                    <div className="text-sm text-text-secondary">Descuento ganado</div>
                  </div>
                </div>
                
                <div className="text-lg font-medium text-text-primary mb-4">
                  {examResults.message}
                </div>
              </div>

              {examResults.discount > 0 && (
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-accent mb-3">
                    🎁 ¡Felicidades! Has ganado {examResults.discount}% de descuento
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Este descuento es válido para cualquier curso de <strong>{selectedArea}</strong>. 
                    Déjanos tus datos para enviarte el código de descuento y asesorarte sobre el curso ideal para ti.
                  </p>
                  <Button onClick={handleClaimDiscount} size="large">
                    Reclamar Mi Descuento
                  </Button>
                </div>
              )}

              <Button 
                variant="secondary" 
                onClick={() => {
                  setExamResults(null)
                  setExamStarted(false)
                }}
              >
                Tomar Examen Nuevamente
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-background py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-text-primary mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-surface rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold text-text-primary mb-2">
                ¿El examen tiene costo?
              </h3>
              <p className="text-text-secondary">
                No, el examen es completamente gratuito y no requiere registro previo.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold text-text-primary mb-2">
                ¿Cuánto tiempo toma?
              </h3>
              <p className="text-text-secondary">
                El examen toma entre 2 a 5 minutos. Son pocas preguntas pero muy específicas para evaluar tu nivel.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold text-text-primary mb-2">
                ¿Cómo funciona el descuento?
              </h3>
              <p className="text-text-secondary">
                Basado en tus respuestas, nuestro sistema determina tu nivel y necesidades, otorgándote un descuento personalizado de hasta 30%.
              </p>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold text-text-primary mb-2">
                ¿Puedo retomar el examen?
              </h3>
              <p className="text-text-secondary">
                Sí, puedes retomar el examen cuando quieras. Sin embargo, recomendamos ser honesto en las respuestas para obtener el mejor plan personalizado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        trigger="exam_discount_claim"
        examResults={examResults}
      />
    </div>
  )
}

export default ExamInitial