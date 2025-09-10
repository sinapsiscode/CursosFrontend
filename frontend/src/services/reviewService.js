class ReviewService {
  constructor() {
    this.storageKeys = {
      reviews: 'course_reviews',
      enrollments: 'student_enrollments'
    }
  }

  // ========== GESTIÓN DE ESTUDIANTES ==========
  
  // Obtener estudiantes de un curso
  getCourseStudents(courseId) {
    const enrollments = this.getStoredEnrollments()
    return enrollments.filter(enrollment => 
      enrollment.courseId === courseId && enrollment.status === 'active'
    )
  }

  // Marcar estudiante como completado (admin)
  markStudentAsCompleted(userId, courseId, courseName = 'Curso', coursePoints = 100) {
    const enrollments = this.getStoredEnrollments()
    const updatedEnrollments = enrollments.map(enrollment => {
      if (enrollment.userId === userId && enrollment.courseId === courseId) {
        return {
          ...enrollment,
          status: 'completed',
          completedAt: new Date().toISOString(),
          canReview: true,
          hasReviewed: false
        }
      }
      return enrollment
    })
    
    localStorage.setItem(this.storageKeys.enrollments, JSON.stringify(updatedEnrollments))
    console.log(`✅ Estudiante ${userId} marcado como completado en curso ${courseId}`)
    
    // OTORGAR PUNTOS AUTOMÁTICAMENTE (100 puntos por curso)
    if (typeof window !== 'undefined' && window.loyaltyService) {
      // Verificar si es el primer curso del estudiante
      const completedCourses = updatedEnrollments.filter(
        e => e.userId === userId && e.status === 'completed'
      ).length
      
      const isFirstCourse = completedCourses === 1
      
      // Otorgar puntos del curso - PASAR userId y puntos personalizados
      window.loyaltyService.addPointsForCourseCompletion(
        courseId, 
        courseName,
        isFirstCourse,
        userId,  // Pasar el userId del estudiante
        coursePoints // Pasar los puntos específicos del curso
      ).then(result => {
        if (result.success) {
          const pointsAwarded = isFirstCourse ? Math.max(coursePoints + 50, 150) : coursePoints
          console.log(`🎯 Puntos otorgados al usuario ${userId}: ${pointsAwarded} pts por completar ${courseName}`)
          if (result.levelChanged) {
            console.log(`🎉 Usuario ${userId} subió al nivel ${result.newLevel}!`)
          }
        }
      })
    }
    
    return { success: true }
  }

  // Verificar si estudiante puede reseñar (ahora cualquiera puede)
  canStudentReview(userId, courseId) {
    // Verificar si ya escribió una reseña para este curso
    const reviews = this.getStoredReviews()
    const existingReview = reviews.find(review => 
      review.userId === userId && review.courseId === courseId
    )
    
    // Puede reseñar si no ha escrito una reseña antes
    return !existingReview
  }

  // ========== GESTIÓN DE RESEÑAS ==========

  // Crear nueva reseña
  createReview(reviewData) {
    const reviews = this.getStoredReviews()
    const newReview = {
      id: `review_${Date.now()}`,
      courseId: reviewData.courseId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      status: 'pending', // pending | approved | rejected
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null
    }

    reviews.push(newReview)
    localStorage.setItem(this.storageKeys.reviews, JSON.stringify(reviews))

    console.log(`📝 Nueva reseña creada:`, newReview)
    return { success: true, review: newReview }
  }

  // Marcar estudiante como que ya reseñó
  markStudentAsReviewed(userId, courseId) {
    const enrollments = this.getStoredEnrollments()
    const updatedEnrollments = enrollments.map(enrollment => {
      if (enrollment.userId === userId && enrollment.courseId === courseId) {
        return { ...enrollment, hasReviewed: true }
      }
      return enrollment
    })
    
    localStorage.setItem(this.storageKeys.enrollments, JSON.stringify(updatedEnrollments))
  }

  // Obtener reseñas de un curso (solo aprobadas para mostrar públicamente)
  getCourseReviews(courseId, includeAll = false) {
    const reviews = this.getStoredReviews()
    let courseReviews = reviews.filter(review => review.courseId === courseId)
    
    if (!includeAll) {
      // Solo reseñas aprobadas para mostrar al público
      courseReviews = courseReviews.filter(review => review.status === 'approved')
    }
    
    return courseReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // Obtener reseñas pendientes de moderación (admin)
  getPendingReviews() {
    const reviews = this.getStoredReviews()
    return reviews
      .filter(review => review.status === 'pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // Aprobar reseña (admin)
  approveReview(reviewId, adminId) {
    const reviews = this.getStoredReviews()
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          status: 'approved',
          reviewedAt: new Date().toISOString(),
          reviewedBy: adminId
        }
      }
      return review
    })
    
    localStorage.setItem(this.storageKeys.reviews, JSON.stringify(updatedReviews))
    console.log(`✅ Reseña ${reviewId} aprobada por admin ${adminId}`)
    return { success: true }
  }

  // Rechazar reseña (admin)
  rejectReview(reviewId, adminId, reason = '') {
    const reviews = this.getStoredReviews()
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          status: 'rejected',
          reviewedAt: new Date().toISOString(),
          reviewedBy: adminId,
          rejectionReason: reason
        }
      }
      return review
    })
    
    localStorage.setItem(this.storageKeys.reviews, JSON.stringify(updatedReviews))
    console.log(`❌ Reseña ${reviewId} rechazada por admin ${adminId}`)
    return { success: true }
  }

  // Obtener reseñas de un usuario
  getUserReviews(userId) {
    const reviews = this.getStoredReviews()
    return reviews
      .filter(review => review.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // Obtener estadísticas de reseñas de un curso
  getCourseReviewStats(courseId) {
    const reviews = this.getCourseReviews(courseId) // Solo aprobadas
    
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10

    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1
      return dist
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

    return {
      totalReviews: reviews.length,
      averageRating,
      ratingDistribution
    }
  }

  // ========== UTILIDADES PRIVADAS ==========

  getStoredReviews() {
    try {
      const stored = localStorage.getItem(this.storageKeys.reviews)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading reviews:', error)
      return []
    }
  }

  getStoredEnrollments() {
    try {
      const stored = localStorage.getItem(this.storageKeys.enrollments)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading enrollments:', error)
      return []
    }
  }

  // Limpiar datos (para testing)
  clearAllReviews() {
    localStorage.removeItem(this.storageKeys.reviews)
    console.log('🗑️ Todas las reseñas eliminadas')
  }

  // Crear datos de prueba completos
  generateTestData() {
    // Reseñas de prueba - múltiples estados y cursos
    const testReviews = [
      // Curso 1 - Metalurgia - Reseñas aprobadas
      {
        id: 'review_1',
        courseId: '1',
        userId: 'user_1',
        userName: 'Ana García Mendoza',
        rating: 5,
        comment: 'Excelente curso de metalurgia. El contenido es muy completo y el instructor explica de manera clara y detallada. Los ejemplos prácticos son muy útiles para entender los conceptos. Totalmente recomendado para quienes quieren iniciarse en el área.',
        status: 'approved',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1'
      },
      {
        id: 'review_2',
        courseId: '1',
        userId: 'user_2',
        userName: 'Carlos López Ruiz',
        rating: 4,
        comment: 'Muy buen contenido sobre procesos metalúrgicos. Me gustó mucho la parte de fundición y aleaciones. Solo le daría más tiempo a los temas de tratamientos térmicos que me parecieron un poco rápidos.',
        status: 'approved',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1'
      },
      {
        id: 'review_3',
        courseId: '1',
        userId: 'user_3',
        userName: 'María Rodríguez',
        rating: 5,
        comment: 'Increíble curso! Como ingeniera química, encontré muy valiosa la información sobre los procesos de extracción de metales. La calidad del material es excelente.',
        status: 'approved',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1'
      },
      
      // Curso 1 - Reseñas pendientes
      {
        id: 'review_4',
        courseId: '1',
        userId: 'user_4',
        userName: 'Pedro Sánchez Villa',
        rating: 3,
        comment: 'El curso está bien pero esperaba más contenido práctico. Los videos son buenos pero me hubiera gustado más ejercicios y casos reales de la industria.',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: null,
        reviewedBy: null
      },
      {
        id: 'review_5',
        courseId: '1',
        userId: 'user_5',
        userName: 'Lucía Fernández',
        rating: 5,
        comment: '¡Súper recomendado! Aprendí muchísimo sobre los diferentes tipos de aceros y sus aplicaciones. El profesor tiene mucha experiencia y se nota.',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: null,
        reviewedBy: null
      },

      // Curso 2 - Minería - Reseñas aprobadas
      {
        id: 'review_6',
        courseId: '2',
        userId: 'user_6',
        userName: 'Roberto Díaz Castro',
        rating: 5,
        comment: 'Excelente introducción a la minería subterránea. Los conceptos de seguridad y ventilación están muy bien explicados. Me ayudó mucho para mi trabajo.',
        status: 'approved',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1'
      },
      {
        id: 'review_7',
        courseId: '2',
        userId: 'user_7',
        userName: 'Fernando Mora',
        rating: 4,
        comment: 'Buen curso sobre minería. Los temas de explosivos y perforación están muy bien desarrollados. Me hubiera gustado más información sobre maquinaria pesada.',
        status: 'approved',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1'
      },

      // Curso 2 - Reseñas pendientes
      {
        id: 'review_8',
        courseId: '2',
        userId: 'user_8',
        userName: 'Isabel Torres',
        rating: 2,
        comment: 'El contenido es bueno pero los videos tienen mala calidad de audio. A veces es difícil entender lo que dice el instructor.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        reviewedAt: null,
        reviewedBy: null
      },

      // Curso 3 - Geología - Reseñas aprobadas
      {
        id: 'review_9',
        courseId: '3',
        userId: 'user_9',
        userName: 'Andrea Gutiérrez',
        rating: 5,
        comment: 'Fascinante curso de geología estructural. Los modelos 3D y las animaciones ayudan mucho a entender los conceptos. El material complementario es de primera calidad.',
        status: 'approved',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1'
      },
      {
        id: 'review_10',
        courseId: '3',
        userId: 'user_10',
        userName: 'Miguel Ángel Ramos',
        rating: 4,
        comment: 'Muy buen curso para entender la formación de yacimientos minerales. La parte de geoquímica está excelente.',
        status: 'approved',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1'
      },

      // Curso 3 - Reseñas pendientes
      {
        id: 'review_11',
        courseId: '3',
        userId: 'user_11',
        userName: 'Patricia Núñez',
        rating: 1,
        comment: 'No me gustó. El contenido está desactualizado y no se parece a lo que prometía en la descripción.',
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        reviewedAt: null,
        reviewedBy: null
      },

      // Curso 4 - Reseñas mixtas
      {
        id: 'review_12',
        courseId: '4',
        userId: 'user_12',
        userName: 'José Luis Vargas',
        rating: 5,
        comment: 'Perfecto para principiantes en flotación de minerales. Las animaciones del proceso son muy claras.',
        status: 'approved',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1'
      },
      {
        id: 'review_13',
        courseId: '4',
        userId: 'user_13',
        userName: 'Carmen Silva',
        rating: 4,
        comment: 'Muy didáctico. Me ayudó a entender mejor los procesos de concentración de minerales.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null
      },

      // Reseñas rechazadas (no se mostrarán pero existen en el sistema)
      {
        id: 'review_14',
        courseId: '1',
        userId: 'user_14',
        userName: 'Usuario Spam',
        rating: 1,
        comment: 'COMPRA BITCOIN AHORA!!! Visita mi sitio web...',
        status: 'rejected',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: 'admin_1',
        rejectionReason: 'Spam - Contenido no relacionado con el curso'
      }
    ]

    // Inscripciones de estudiantes con estados variados
    const testEnrollments = [
      // Estudiantes que completaron y pueden reseñar
      {
        userId: 'user_15',
        userName: 'Diego Martínez',
        userEmail: 'diego.martinez@email.com',
        courseId: '1',
        status: 'completed',
        enrolledAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        canReview: true,
        hasReviewed: false
      },
      {
        userId: 'user_16',
        userName: 'Sofía Hernández',
        userEmail: 'sofia.hernandez@email.com',
        courseId: '2',
        status: 'completed',
        enrolledAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        canReview: true,
        hasReviewed: false
      },
      
      // Estudiantes activos (no pueden reseñar aún)
      {
        userId: 'user_17',
        userName: 'Luis Gómez',
        userEmail: 'luis.gomez@email.com',
        courseId: '1',
        status: 'active',
        enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        canReview: false,
        hasReviewed: false
      },
      {
        userId: 'user_18',
        userName: 'Elena Ruiz',
        userEmail: 'elena.ruiz@email.com',
        courseId: '3',
        status: 'active',
        enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        canReview: false,
        hasReviewed: false
      },
      
      // Estudiantes que ya reseñaron
      {
        userId: 'user_1',
        userName: 'Ana García Mendoza',
        userEmail: 'ana.garcia@email.com',
        courseId: '1',
        status: 'completed',
        enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
        canReview: false,
        hasReviewed: true
      }
    ]

    localStorage.setItem(this.storageKeys.reviews, JSON.stringify(testReviews))
    localStorage.setItem(this.storageKeys.enrollments, JSON.stringify(testEnrollments))
    
    console.log('🧪 Datos de prueba completos creados:')
    console.log('   - 14 reseñas (7 aprobadas, 6 pendientes, 1 rechazada)')
    console.log('   - 5 inscripciones de estudiantes')
    console.log('   - 4 cursos con reseñas')
    
    return {
      reviews: testReviews,
      enrollments: testEnrollments
    }
  }
}

export const reviewService = new ReviewService()