import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProgressStore = create(
  persist(
    (set, get) => ({
      courseProgress: {
        // Datos iniciales de progreso basados en mockUsers
        1: { percentage: 75, lastWatched: new Date('2024-01-20'), timeSpent: 135, enrolledAt: '2024-01-15' },
        3: { percentage: 30, lastWatched: new Date('2024-01-18'), timeSpent: 60, enrolledAt: '2024-01-16' },
        4: { percentage: 100, lastWatched: new Date('2024-01-25'), timeSpent: 160, enrolledAt: '2024-01-10' },
        6: { percentage: 45, lastWatched: new Date('2024-01-22'), timeSpent: 99, enrolledAt: '2024-01-12' },
        7: { percentage: 100, lastWatched: new Date('2024-01-30'), timeSpent: 190, enrolledAt: '2024-01-05' },
        8: { percentage: 60, lastWatched: new Date('2024-01-28'), timeSpent: 156, enrolledAt: '2024-01-08' },
        9: { percentage: 80, lastWatched: new Date('2024-01-26'), timeSpent: 168, enrolledAt: '2024-01-07' }
      },
      completedCourses: [4, 7], // Cursos completados
      certificates: [
        { id: 'cert_4_1', courseId: 4, courseName: 'Introducción a la Minería', area: 'mineria', completedAt: '2024-01-25' },
        { id: 'cert_7_1', courseId: 7, courseName: 'Geología General', area: 'geologia', completedAt: '2024-01-30' }
      ],
      learningPaths: [],
      userStats: {
        totalHours: 0,
        completedCourses: 0,
        currentStreak: 0,
        maxStreak: 0,
        lastStudyDate: null
      },
      weeklyRanking: {
        position: null,
        points: 0,
        weekStart: null
      },

      updateLessonProgress: (courseId, lessonId) => set((state) => {
        const progress = state.courseProgress[courseId] || { completedLessons: [], percentage: 0, lastWatched: new Date() }
        
        // Asegurar que completedLessons sea siempre un array
        const completedLessons = Array.isArray(progress.completedLessons) ? progress.completedLessons : []
        
        if (!completedLessons.includes(lessonId)) {
          const updatedCompletedLessons = [...completedLessons, lessonId]
          const course = get().getCourseData(courseId)
          const totalLessons = course?.lessons?.length || 1
          const percentage = Math.round((updatedCompletedLessons.length / totalLessons) * 100)
          
          return {
            courseProgress: {
              ...state.courseProgress,
              [courseId]: {
                ...progress,
                completedLessons: updatedCompletedLessons,
                percentage,
                lastWatched: new Date()
              }
            }
          }
        }
        return state
      }),

      completeCourse: (courseId, courseName, area) => set((state) => {
        const completedCourses = Array.isArray(state.completedCourses) ? state.completedCourses : []
        if (!completedCourses.includes(courseId)) {
          const certificate = {
            id: `cert_${courseId}_${Date.now()}`,
            courseId,
            courseName,
            area,
            completedAt: new Date(),
            userId: state.user?.id || 'guest'
          }
          
          return {
            completedCourses: [...completedCourses, courseId],
            certificates: [...(state.certificates || []), certificate],
            userStats: {
              ...state.userStats,
              completedCourses: state.userStats.completedCourses + 1
            }
          }
        }
        return state
      }),

      addStudyTime: (minutes) => set((state) => {
        const today = new Date().toDateString()
        const lastStudyDate = state.userStats.lastStudyDate
        const isConsecutiveDay = lastStudyDate && 
          new Date(lastStudyDate).getTime() === new Date(today).getTime() - 86400000
        
        const newStreak = isConsecutiveDay ? state.userStats.currentStreak + 1 : 1
        
        return {
          userStats: {
            ...state.userStats,
            totalHours: state.userStats.totalHours + (minutes / 60),
            currentStreak: newStreak,
            maxStreak: Math.max(state.userStats.maxStreak, newStreak),
            lastStudyDate: today
          }
        }
      }),

      updateWeeklyRanking: (position, points) => set({
        weeklyRanking: {
          position,
          points,
          weekStart: new Date()
        }
      }),

      addLearningPath: (pathData) => set((state) => ({
        learningPaths: [...state.learningPaths, { ...pathData, startedAt: new Date() }]
      })),

      // Inicializar progreso del usuario basado en datos mock
      initializeUserProgress: (user) => {
        if (!user) return
        
        const userProgressData = {
          1: { // Carlos Mendoza
            1: { percentage: 75, lastWatched: new Date('2024-01-20'), timeSpent: 135, enrolledAt: '2024-01-15' },
            3: { percentage: 30, lastWatched: new Date('2024-01-18'), timeSpent: 60, enrolledAt: '2024-01-16' }
          },
          2: { // Ana Rodriguez
            4: { percentage: 100, lastWatched: new Date('2024-01-25'), timeSpent: 160, enrolledAt: '2024-01-10' },
            6: { percentage: 45, lastWatched: new Date('2024-01-22'), timeSpent: 99, enrolledAt: '2024-01-12' }
          },
          3: { // Miguel Santos (Admin)
            7: { percentage: 100, lastWatched: new Date('2024-01-30'), timeSpent: 190, enrolledAt: '2024-01-05' },
            8: { percentage: 60, lastWatched: new Date('2024-01-28'), timeSpent: 156, enrolledAt: '2024-01-08' },
            9: { percentage: 80, lastWatched: new Date('2024-01-26'), timeSpent: 168, enrolledAt: '2024-01-07' }
          }
        }

        const userCertificates = {
          1: [], // Carlos Mendoza - no tiene cursos completados al 100%
          2: [{ 
            id: 'cert_4_2', 
            courseId: 4, 
            courseName: 'Introducción a la Minería', 
            area: 'mineria', 
            completedAt: '2024-01-25',
            instructor: 'Ing. Pedro Vargas'
          }],
          3: [
            { 
              id: 'cert_7_3', 
              courseId: 7, 
              courseName: 'Geología General', 
              area: 'geologia', 
              completedAt: '2024-01-30',
              instructor: 'Dr. Sofia Herrera'
            }
          ]
        }

        const progress = userProgressData[user.id] || {}
        const certificates = userCertificates[user.id] || []
        const completedCourses = Object.keys(progress).filter(courseId => progress[courseId].percentage >= 100).map(Number)

        set({
          courseProgress: progress,
          completedCourses: completedCourses,
          certificates: certificates
        })
      },

      getCourseProgress: (courseId) => {
        const progress = get().courseProgress[courseId] || { completedLessons: [], percentage: 0 }
        return {
          completedLessons: Array.isArray(progress.completedLessons) ? progress.completedLessons : [],
          percentage: typeof progress.percentage === 'number' ? progress.percentage : 0,
          lastWatched: progress.lastWatched || null,
          timeSpent: typeof progress.timeSpent === 'number' ? progress.timeSpent : 0,
          enrolledAt: progress.enrolledAt || null
        }
      },
      isCourseCompleted: (courseId) => {
        const completedCourses = get().completedCourses || []
        return Array.isArray(completedCourses) && completedCourses.includes(courseId)
      },
      getCertificates: () => get().certificates,
      getUserStats: () => get().userStats,
      getWeeklyRanking: () => get().weeklyRanking,

      // Helper function to get course data (should be connected to courseStore)
      getCourseData: (courseId) => {
        // This would typically connect to the course store
        // For now, return a mock structure
        return { lessons: [] }
      },

      resetProgress: () => set({
        courseProgress: {},
        completedCourses: [],
        certificates: [],
        learningPaths: [],
        userStats: {
          totalHours: 0,
          completedCourses: 0,
          currentStreak: 0,
          maxStreak: 0,
          lastStudyDate: null
        },
        weeklyRanking: {
          position: null,
          points: 0,
          weekStart: null
        }
      })
    }),
    {
      name: 'progress-storage',
      partialize: (state) => ({
        courseProgress: state.courseProgress,
        completedCourses: state.completedCourses,
        certificates: state.certificates,
        learningPaths: state.learningPaths,
        userStats: state.userStats,
        weeklyRanking: state.weeklyRanking
      })
    }
  )
)