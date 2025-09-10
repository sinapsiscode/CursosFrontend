import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card } from '../../components/ui'
import { InitialExam } from '../../components/exams'
import { LeadCaptureForm } from '../../components/forms'

const InitialExamLanding = () => {
  const navigate = useNavigate()
  const { showSuccess } = useUIStore()
  
  const [showExam, setShowExam] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [examResults, setExamResults] = useState(null)
  
  const benefits = [
    { icon: '💰', title: 'Hasta 30% de Descuento', description: 'Gana descuentos según tu puntaje' },
    { icon: '⏱️', title: 'Solo 10 Minutos', description: 'Examen rápido y sencillo' },
    { icon: '📊', title: 'Resultados Inmediatos', description: 'Conoce tu nivel al instante' },
    { icon: '🎯', title: 'Cursos Personalizados', description: 'Recomendaciones según tu nivel' },
    { icon: '🏆', title: 'Certificado Gratis', description: 'Obtén un certificado de nivel' },
    { icon: '♾️', title: 'Intentos Ilimitados', description: 'Puedes repetirlo cuando quieras' }
  ]

  const discountTiers = [
    { min: 90, max: 100, discount: 30, label: 'Excelente' },
    { min: 70, max: 89, discount: 20, label: 'Muy Bueno' },
    { min: 50, max: 69, discount: 15, label: 'Bueno' },
    { min: 30, max: 49, discount: 10, label: 'Regular' },
    { min: 0, max: 29, discount: 5, label: 'Participación' }
  ]

  const faqs = [
    {
      question: '¿Cómo funciona el examen?',
      answer: 'El examen consta de 10 preguntas de opción múltiple sobre conocimientos generales de programación y tecnología. Tienes 10 minutos para completarlo.'
    },
    {
      question: '¿Puedo repetir el examen?',
      answer: 'Sí, puedes realizar el examen tantas veces como quieras. Se considerará tu mejor puntaje para el descuento.'
    },
    {
      question: '¿El descuento aplica para todos los cursos?',
      answer: 'Sí, el descuento obtenido es válido para cualquier curso de nuestra plataforma durante 30 días.'
    },
    {
      question: '¿Necesito conocimientos previos?',
      answer: 'No necesariamente. El examen evalúa diferentes niveles, desde principiante hasta avanzado.'
    }
  ]

  const handleExamComplete = (results) => {
    setExamResults(results)
    setShowExam(false)
    setShowLeadForm(true)
    showSuccess(`¡Felicidades! Obtuviste ${results.totalPoints} puntos y ganaste un ${results.discount}% de descuento`)
  }

  const handleStartExam = () => {
    setShowExam(true)
  }

  const handleLeadFormClose = () => {
    setShowLeadForm(false)
    if (examResults) {
      navigate('/courses')
    }
  }

  if (showExam) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <InitialExam onComplete={handleExamComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-accent/20 to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🎯 OFERTA ESPECIAL
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Gana hasta <span className="gradient-text">30% de Descuento</span>
          </h1>
          
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Realiza nuestro examen de diagnóstico gratuito y obtén un descuento 
            instantáneo basado en tu desempeño. ¡Solo te tomará 10 minutos!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="large"
              onClick={handleStartExam}
              className="px-8 py-4 text-lg"
            >
              🚀 Comenzar Examen Gratis
            </Button>
            <Button 
              variant="secondary"
              size="large"
              onClick={() => navigate('/courses')}
              className="px-8 py-4 text-lg"
            >
              Ver Cursos
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
            <span>✓ Sin tarjeta de crédito</span>
            <span>✓ 100% Gratis</span>
            <span>✓ Resultados inmediatos</span>
            <span>✓ Descuento garantizado</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-accent/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            ¿Por qué hacer el examen?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="p-6 text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Tiers */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-4">
            Tabla de Descuentos
          </h2>
          <p className="text-center text-text-secondary mb-12">
            Tu descuento dependerá de tu puntaje en el examen
          </p>
          
          <div className="space-y-4">
            {discountTiers.map((tier, idx) => (
              <div key={idx} className="bg-background rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                    tier.discount === 30 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                    tier.discount === 20 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' :
                    tier.discount === 15 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {idx + 1}°
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {tier.min} - {tier.max} puntos
                    </p>
                    <p className="text-sm text-text-secondary">
                      Nivel: {tier.label}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent">
                    {tier.discount}%
                  </p>
                  <p className="text-sm text-text-secondary">
                    Descuento
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            ¿Cómo funciona?
          </h2>
          
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
            
            <div className="space-y-8">
              {[
                { step: 1, title: 'Inicia el Examen', desc: 'Haz clic en el botón para comenzar el examen gratuito' },
                { step: 2, title: 'Responde las Preguntas', desc: '10 preguntas de opción múltiple en 10 minutos' },
                { step: 3, title: 'Obtén tu Resultado', desc: 'Conoce tu puntaje y nivel al instante' },
                { step: 4, title: 'Recibe tu Descuento', desc: 'Obtén un código de descuento basado en tu desempeño' },
                { step: 5, title: 'Aplica en Cualquier Curso', desc: 'Usa tu descuento en cualquier curso de la plataforma' }
              ].map((item) => (
                <div key={item.step} className="flex items-center ml-8">
                  <div className="absolute left-0 w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="ml-12 bg-surface rounded-lg p-4 flex-1">
                    <h3 className="font-semibold text-text-primary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="font-semibold text-text-primary mb-2">
                  {faq.question}
                </h3>
                <p className="text-text-secondary">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent/20 to-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            ¿Listo para ganar tu descuento?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Miles de estudiantes ya han obtenido sus descuentos. ¡Es tu turno!
          </p>
          
          <Button 
            size="large"
            onClick={handleStartExam}
            className="px-12 py-4 text-lg"
          >
            🎯 Comenzar Examen Ahora
          </Button>
          
          <div className="mt-8 flex justify-center gap-8 text-sm text-text-secondary">
            <div>
              <span className="text-2xl font-bold text-accent">5,000+</span>
              <p>Exámenes realizados</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-accent">85%</span>
              <p>Obtienen descuento</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-accent">4.8/5</span>
              <p>Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={handleLeadFormClose}
        examResults={examResults}
        trigger="exam_completion"
      />
    </div>
  )
}

export default InitialExamLanding