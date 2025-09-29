// TODO: REFACTOR - Reemplazar con datos de base de datos
// Esta estructura debe convertirse en un esquema de BD (Course model)
// Campos que necesitan normalización:
// - area: debería ser FK a tabla Areas
// - level: debería ser FK a tabla Levels  
// - instructor: debería ser FK a tabla Instructors
// - lessons: debería ser tabla separada Lessons
// - materials: debería ser tabla separada Materials
export const mockCourses = [
  // HARDCODED: Todos estos cursos deben venir de BD
  // METALURGIA
  {
    id: 1, // TODO: REFACTOR - Auto-increment de BD
    title: "Fundamentos de Metalurgia", // TODO: REFACTOR - Campo título en BD
    instructor: "Dr. Carlos Rodriguez", // TODO: REFACTOR - FK a tabla Instructors
    area: "metalurgia", // TODO: REFACTOR - FK a tabla Areas en lugar de string
    level: "básico", // TODO: REFACTOR - FK a tabla Levels en lugar de string
    duration: 180, // TODO: REFACTOR - Duración en minutos, validar en BD
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400", // TODO: REFACTOR - URL de imagen, considerar storage propio
    rating: 4.8, // TODO: REFACTOR - Calcular dinámicamente desde reviews/ratings
    students: 1250, // TODO: REFACTOR - Contar desde tabla Enrollments
    enrolledStudents: 834, // TODO: REFACTOR - Contar inscripciones activas desde BD
    views: 15420, // TODO: REFACTOR - Contador de vistas del curso
    price: 0, // TODO: REFACTOR - Siempre gratis, no hay descuentos
    points: 10,
    isDemo: true,
    featured: true,
    popular: true,
    isNew: false,
    description: "Aprende los conceptos fundamentales de la metalurgia, desde la estructura atómica hasta los procesos de transformación de metales.",
    lessons: [
      // TODO: REFACTOR - Lecciones hardcodeadas, crear tabla Lessons en BD
      { id: 1, title: "Introducción a la Metalurgia", duration: 15, videoUrl: "demo_video_1.mp4", isFree: true }, // TODO: REFACTOR - videoUrl debe ser storage/CDN real
      { id: 2, title: "Estructura Cristalina de los Metales", duration: 20, videoUrl: "demo_video_2.mp4", isFree: true }, // TODO: REFACTOR - videoUrl debe ser storage/CDN real
      { id: 3, title: "Propiedades Mecánicas", duration: 25, videoUrl: "lesson_3.mp4", isFree: false }, // TODO: REFACTOR - videoUrl debe ser storage/CDN real
      { id: 4, title: "Aleaciones y Diagramas de Fase", duration: 30, videoUrl: "lesson_4.mp4", isFree: false } // TODO: REFACTOR - videoUrl debe ser storage/CDN real
    ],
    materials: [ // TODO: REFACTOR - Materiales hardcodeados, crear tabla Materials en BD
      { name: "Manual de Metalurgia.pdf", type: "pdf", url: "manual_metalurgia.pdf" }, // TODO: REFACTOR - URL debe ser storage/CDN real
      { name: "Tablas de Propiedades.xlsx", type: "excel", url: "tablas_propiedades.xlsx" } // TODO: REFACTOR - URL debe ser storage/CDN real
    ],
    enrolledStudentsData: [
      {
        id: 1,
        name: "Carlos Mendoza",
        email: "carlos@email.com",
        phone: "+57 300 123 4567",
        selectedArea: "metalurgia",
        progress: 75,
        enrollmentDate: "2024-01-15",
        suspended: false,
        lastActivity: "2024-03-10"
      },
      {
        id: 5,
        name: "Luis Fernández",
        email: "luis@email.com",
        phone: "+57 305 654 3210",
        selectedArea: "metalurgia",
        progress: 25,
        enrollmentDate: "2024-04-05",
        suspended: false,
        lastActivity: "2024-03-08"
      },
      {
        id: 101,
        name: "Ana María Torres",
        email: "ana.torres@email.com",
        phone: "+57 301 987 1234",
        selectedArea: "metalurgia",
        progress: 90,
        enrollmentDate: "2024-02-20",
        suspended: false,
        lastActivity: "2024-03-12"
      },
      {
        id: 102,
        name: "Roberto Silva",
        email: "roberto.silva@email.com",
        phone: "+57 302 456 7890",
        selectedArea: "metalurgia",
        progress: 45,
        enrollmentDate: "2024-03-01",
        suspended: false,
        lastActivity: "2024-03-11"
      },
      {
        id: 103,
        name: "María Elena Vásquez",
        email: "maria.vasquez@email.com",
        phone: "+57 304 321 6547",
        selectedArea: "metalurgia",
        progress: 60,
        enrollmentDate: "2024-01-28",
        suspended: true,
        lastActivity: "2024-02-15"
      }
    ]
  },
  {
    id: 2,
    title: "Procesos de Fundición Avanzada",
    instructor: "Ing. Maria Santos",
    area: "metalurgia",
    level: "avanzado",
    duration: 240,
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400",
    rating: 4.9,
    students: 890,
    enrolledStudents: 678,
    views: 8930,
    price: 129,
    points: 10,
    isDemo: false,
    featured: true,
    popular: false,
    isNew: true,
    enrollmentUrl: "https://formularios.metsel.edu.co/inscripcion-fundicion-avanzada",
    description: "Domina las técnicas avanzadas de fundición y moldeo para la producción industrial de piezas metálicas.",
    lessons: [
      { id: 1, title: "Tipos de Fundición", duration: 20, videoUrl: "demo_fundicion_1.mp4", isFree: true },
      { id: 2, title: "Diseño de Moldes", duration: 30, videoUrl: "lesson_moldes.mp4", isFree: false },
      { id: 3, title: "Control de Calidad", duration: 25, videoUrl: "lesson_calidad.mp4", isFree: false }
    ],
    materials: [],
    enrolledStudentsData: [
      {
        id: 1,
        name: "Carlos Mendoza",
        email: "carlos@email.com",
        phone: "+57 300 123 4567",
        selectedArea: "metalurgia",
        progress: 30,
        enrollmentDate: "2024-02-01",
        suspended: false,
        lastActivity: "2024-03-12"
      },
      {
        id: 104,
        name: "Patricia González",
        email: "patricia.gonzalez@email.com",
        phone: "+57 306 789 1234",
        selectedArea: "metalurgia",
        progress: 85,
        enrollmentDate: "2024-01-10",
        suspended: false,
        lastActivity: "2024-03-13"
      },
      {
        id: 105,
        name: "Andrés Morales",
        email: "andres.morales@email.com",
        phone: "+57 307 234 5678",
        selectedArea: "metalurgia",
        progress: 55,
        enrollmentDate: "2024-02-15",
        suspended: false,
        lastActivity: "2024-03-11"
      }
    ]
  },
  {
    id: 3,
    title: "Tratamientos Térmicos",
    instructor: "Dr. Roberto Mendez",
    area: "metalurgia",
    level: "intermedio",
    duration: 200,
    thumbnail: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=400",
    rating: 4.7,
    students: 756,
    enrolledStudents: 523,
    views: 6250,
    price: 89,
    points: 10,
    isDemo: false,
    featured: false,
    popular: true,
    isNew: false,
    enrollmentUrl: "https://whatsapp.com/send?phone=573001234567&text=Hola%2C%20quiero%20inscribirme%20en%20el%20curso%20de%20Tratamientos%20T%C3%A9rmicos",
    description: "Aprende los diferentes tratamientos térmicos para mejorar las propiedades de los materiales metálicos.",
    lessons: [
      { id: 1, title: "Recocido y Normalizado", duration: 25, videoUrl: "demo_termicos_1.mp4", isFree: true },
      { id: 2, title: "Temple y Revenido", duration: 30, videoUrl: "lesson_temple.mp4", isFree: false }
    ],
    materials: []
  },

  // MINERÍA
  {
    id: 4,
    title: "Introducción a la Minería",
    instructor: "Ing. Pedro Vargas",
    area: "mineria",
    level: "básico",
    duration: 160,
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    rating: 4.6,
    students: 2100,
    enrolledStudents: 1567,
    views: 21340,
    price: 0,
    points: 10,
    isDemo: true,
    featured: true,
    popular: true,
    isNew: false,
    description: "Conoce los fundamentos de la industria minera, desde la exploración hasta la extracción de minerales.",
    lessons: [
      { id: 1, title: "Historia de la Minería", duration: 15, videoUrl: "demo_mineria_1.mp4", isFree: true },
      { id: 2, title: "Tipos de Yacimientos", duration: 20, videoUrl: "demo_mineria_2.mp4", isFree: true },
      { id: 3, title: "Métodos de Extracción", duration: 25, videoUrl: "lesson_extraccion.mp4", isFree: false }
    ],
    materials: [
      { name: "Guía de Minerales.pdf", type: "pdf", url: "guia_minerales.pdf" }
    ],
    enrolledStudentsData: [
      {
        id: 2,
        name: "Ana Rodriguez",
        email: "ana@email.com",
        phone: "+57 301 987 6543",
        selectedArea: "mineria",
        progress: 100,
        enrollmentDate: "2024-02-20",
        suspended: false,
        lastActivity: "2024-03-13"
      },
      {
        id: 106,
        name: "Diego Ramírez",
        email: "diego.ramirez@email.com",
        phone: "+57 308 456 7891",
        selectedArea: "mineria",
        progress: 75,
        enrollmentDate: "2024-01-05",
        suspended: false,
        lastActivity: "2024-03-12"
      },
      {
        id: 107,
        name: "Sandra López",
        email: "sandra.lopez@email.com",
        phone: "+57 309 123 4567",
        selectedArea: "mineria",
        progress: 50,
        enrollmentDate: "2024-02-10",
        suspended: false,
        lastActivity: "2024-03-10"
      },
      {
        id: 108,
        name: "Fernando Castro",
        email: "fernando.castro@email.com",
        phone: "+57 310 987 6543",
        selectedArea: "mineria",
        progress: 92,
        enrollmentDate: "2024-01-20",
        suspended: false,
        lastActivity: "2024-03-13"
      },
      {
        id: 109,
        name: "Claudia Herrera",
        email: "claudia.herrera@email.com",
        phone: "+57 311 234 5678",
        selectedArea: "mineria",
        progress: 35,
        enrollmentDate: "2024-03-01",
        suspended: true,
        lastActivity: "2024-03-05"
      },
      {
        id: 110,
        name: "Javier Mendoza",
        email: "javier.mendoza@email.com",
        phone: "+57 312 345 6789",
        selectedArea: "mineria",
        progress: 80,
        enrollmentDate: "2024-01-15",
        suspended: false,
        lastActivity: "2024-03-12"
      }
    ]
  },
  {
    id: 5,
    title: "Minería Subterránea",
    instructor: "Ing. Ana Gutierrez",
    area: "mineria",
    level: "avanzado",
    duration: 280,
    thumbnail: "https://images.unsplash.com/photo-1562391804-fe737b9d0f62?w=400",
    rating: 4.8,
    students: 634,
    enrolledStudents: 412,
    views: 4720,
    price: 149,
    points: 10,
    isDemo: false,
    featured: false,
    popular: false,
    isNew: true,
    description: "Especialízate en técnicas de minería subterránea y sistemas de soporte de túneles y galerías.",
    lessons: [
      { id: 1, title: "Planificación de Minas Subterráneas", duration: 35, videoUrl: "demo_subterranea_1.mp4", isFree: true },
      { id: 2, title: "Sistemas de Ventilación", duration: 30, videoUrl: "lesson_ventilacion.mp4", isFree: false }
    ],
    materials: []
  },
  {
    id: 6,
    title: "Procesamiento de Minerales",
    instructor: "Dr. Luis Martinez",
    area: "mineria",
    level: "intermedio",
    duration: 220,
    thumbnail: "https://images.unsplash.com/photo-1586253633467-78485bf3d6a1?w=400",
    rating: 4.5,
    students: 890,
    enrolledStudents: 623,
    views: 9850,
    price: 99,
    points: 10,
    isDemo: false,
    featured: true,
    popular: false,
    isNew: false,
    description: "Domina las técnicas de concentración y procesamiento de minerales para obtener productos comerciales.",
    lessons: [
      { id: 1, title: "Trituración y Molienda", duration: 25, videoUrl: "demo_procesamiento_1.mp4", isFree: true },
      { id: 2, title: "Flotación de Minerales", duration: 30, videoUrl: "lesson_flotacion.mp4", isFree: false }
    ],
    materials: []
  },

  // GEOLOGÍA
  {
    id: 7,
    title: "Geología General",
    instructor: "Dr. Sofia Herrera",
    area: "geologia",
    level: "básico",
    duration: 190,
    thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
    rating: 4.7,
    students: 1580,
    enrolledStudents: 1123,
    price: 0,
    points: 10,
    isDemo: true,
    featured: true,
    popular: true,
    isNew: false,
    description: "Explora los fundamentos de la geología: minerales, rocas, estructura terrestre y procesos geológicos.",
    lessons: [
      { id: 1, title: "La Tierra como Sistema", duration: 20, videoUrl: "demo_geologia_1.mp4", isFree: true },
      { id: 2, title: "Minerales y Cristales", duration: 25, videoUrl: "demo_geologia_2.mp4", isFree: true },
      { id: 3, title: "Tipos de Rocas", duration: 22, videoUrl: "lesson_rocas.mp4", isFree: false }
    ],
    materials: [
      { name: "Atlas de Minerales.pdf", type: "pdf", url: "atlas_minerales.pdf" }
    ],
    enrolledStudentsData: [
      {
        id: 3,
        name: "Miguel Santos",
        email: "miguel@email.com",
        phone: "+57 302 456 7890",
        selectedArea: "geologia",
        progress: 100,
        enrollmentDate: "2023-12-01",
        suspended: false,
        lastActivity: "2024-03-13"
      },
      {
        id: 4,
        name: "Carmen Ruiz",
        email: "carmen@email.com",
        phone: "+57 304 123 9876",
        selectedArea: "geologia",
        progress: 45,
        enrollmentDate: "2024-01-10",
        suspended: false,
        lastActivity: "2024-03-11"
      },
      {
        id: 111,
        name: "Eduardo Vargas",
        email: "eduardo.vargas@email.com",
        phone: "+57 313 456 7890",
        selectedArea: "geologia",
        progress: 70,
        enrollmentDate: "2024-01-25",
        suspended: false,
        lastActivity: "2024-03-12"
      },
      {
        id: 112,
        name: "Valeria Sánchez",
        email: "valeria.sanchez@email.com",
        phone: "+57 314 567 8901",
        selectedArea: "geologia",
        progress: 88,
        enrollmentDate: "2024-02-05",
        suspended: false,
        lastActivity: "2024-03-13"
      },
      {
        id: 113,
        name: "Ricardo Torres",
        email: "ricardo.torres@email.com",
        phone: "+57 315 678 9012",
        selectedArea: "geologia",
        progress: 25,
        enrollmentDate: "2024-02-28",
        suspended: false,
        lastActivity: "2024-03-09"
      }
    ]
  },
  {
    id: 8,
    title: "Geología Estructural",
    instructor: "Dr. Miguel Torres",
    area: "geologia",
    level: "avanzado",
    duration: 260,
    thumbnail: "https://images.unsplash.com/photo-1464822759844-d150ad6fb472?w=400",
    rating: 4.9,
    students: 423,
    enrolledStudents: 287,
    price: 139,
    points: 10,
    isDemo: false,
    featured: false,
    popular: false,
    isNew: true,
    description: "Analiza las deformaciones de la corteza terrestre y la formación de estructuras geológicas complejas.",
    lessons: [
      { id: 1, title: "Esfuerzos y Deformaciones", duration: 30, videoUrl: "demo_estructural_1.mp4", isFree: true },
      { id: 2, title: "Plegamientos y Fallas", duration: 35, videoUrl: "lesson_plegamientos.mp4", isFree: false }
    ],
    materials: []
  },
  {
    id: 9,
    title: "Hidrogeología",
    instructor: "Dra. Carmen Ruiz",
    area: "geologia",
    level: "intermedio",
    duration: 210,
    thumbnail: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
    rating: 4.6,
    students: 567,
    enrolledStudents: 389,
    price: 109,
    points: 10,
    isDemo: false,
    featured: true,
    popular: true,
    isNew: false,
    description: "Estudia el comportamiento del agua subterránea y su interacción con las formaciones geológicas.",
    lessons: [
      { id: 1, title: "Ciclo Hidrológico", duration: 20, videoUrl: "demo_hidro_1.mp4", isFree: true },
      { id: 2, title: "Acuíferos y Pozos", duration: 28, videoUrl: "lesson_acuiferos.mp4", isFree: false }
    ],
    materials: []
  }
];

export const mockUsers = [
  {
    id: 1,
    name: "Carlos Mendoza",
    fullName: "Carlos Alberto Mendoza García",
    email: "carlos@email.com",
    phone: "+57 300 123 4567",
    role: "user",
    selectedArea: "metalurgia",
    subscription: { type: "expert", expiresAt: "2024-12-31" },
    progress: { 1: 75, 3: 30 },
    totalUsageTime: 7200000, // 2 horas en millisegundos
    certificates: [],
    favorites: [1, 3],
    createdAt: "2024-01-15",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    initialSurvey: {
      completedAt: "2024-01-15",
      desiredCourses: [
        "Soldadura industrial avanzada",
        "Control de calidad en metales",
        "Fundición de precisión",
        "Tratamientos térmicos especializados"
      ],
      interests: ["Procesos industriales", "Nuevas tecnologías", "Automatización"],
      experience: "intermedio",
      additionalComments: "Me interesa especializarme en soldadura robotizada"
    },
    demographics: {
      age: 28,
      country: "Colombia",
      city: "Medellín",
      profession: "Ingeniero Metalúrgico"
    }
  },
  {
    id: 2,
    name: "Ana Rodriguez",
    fullName: "Ana María Rodríguez López",
    email: "ana@email.com",
    phone: "+57 301 987 6543",
    role: "user",
    selectedArea: "mineria",
    subscription: { type: "basic", expiresAt: "2024-08-15" },
    progress: { 4: 100, 6: 45 },
    totalUsageTime: 14400000, // 4 horas en millisegundos
    certificates: [{ courseId: 4, completedAt: "2024-07-20" }],
    favorites: [4, 5],
    createdAt: "2024-02-20",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100",
    initialSurvey: {
      completedAt: "2024-02-20",
      desiredCourses: [
        "Geotecnia aplicada",
        "Explosivos y voladura controlada",
        "Minería sostenible",
        "Procesamiento de minerales",
        "Seguridad minera avanzada"
      ],
      interests: ["Sostenibilidad", "Innovación", "Seguridad industrial", "Medio ambiente"],
      experience: "avanzado",
      additionalComments: "Trabajo en mina a cielo abierto y me interesa la minería verde"
    },
    demographics: {
      age: 35,
      country: "Colombia",
      city: "Bogotá",
      profession: "Ingeniera de Minas"
    }
  },
  {
    id: 3,
    name: "Miguel Santos",
    fullName: "Miguel Ángel Santos Herrera",
    email: "miguel@email.com",
    phone: "+57 302 456 7890",
    role: "admin",
    selectedArea: "geologia",
    subscription: { type: "expert", expiresAt: "2025-01-01" },
    progress: { 7: 100, 8: 60, 9: 80 },
    totalUsageTime: 25200000, // 7 horas en millisegundos
    certificates: [
      { courseId: 7, completedAt: "2024-06-10" },
      { courseId: 9, completedAt: "2024-07-25" }
    ],
    favorites: [7, 8, 9],
    createdAt: "2023-12-01",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    initialSurvey: {
      completedAt: "2023-12-01",
      desiredCourses: [
        "Geofísica moderna",
        "Análisis petrográfico avanzado",
        "Geología marina",
        "Paleontología aplicada",
        "Modelado geológico 3D"
      ],
      interests: ["Investigación", "Tecnología aplicada", "Conservación", "Modelado digital"],
      experience: "experto",
      additionalComments: "Me dedico tanto a la docencia como a la consultoría"
    },
    demographics: {
      age: 42,
      country: "Colombia",
      city: "Cali",
      profession: "Geólogo Senior / Profesor Universitario"
    }
  },
  {
    id: 4,
    name: "Carmen Ruiz",
    fullName: "Carmen Elena Ruiz Morales",
    email: "carmen@email.com",
    phone: "+57 304 123 9876",
    role: "user",
    selectedArea: "geologia",
    subscription: { type: "premium", expiresAt: "2024-11-30" },
    progress: { 7: 45, 8: 30 },
    totalUsageTime: 10800000, // 3 horas en millisegundos
    certificates: [],
    favorites: [7, 8],
    createdAt: "2024-01-10",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    initialSurvey: {
      completedAt: "2024-01-10",
      desiredCourses: [
        "Geoquímica ambiental",
        "Cartografía geológica digital",
        "Evaluación de riesgo sísmico",
        "Hidrogeología aplicada"
      ],
      interests: ["Medio ambiente", "Cartografía", "Prevención de desastres", "GIS"],
      experience: "principiante",
      additionalComments: "Recién graduada, busco especializarme en geología ambiental"
    },
    demographics: {
      age: 26,
      country: "Colombia",
      city: "Bucaramanga",
      profession: "Geóloga Junior"
    }
  },
  {
    id: 5,
    name: "Luis Fernández",
    fullName: "Luis Fernando Fernández Castro",
    email: "luis@email.com",
    phone: "+57 305 654 3210",
    role: "user",
    selectedArea: "metalurgia",
    subscription: { type: "free", expiresAt: null },
    progress: { 1: 25, 3: 10 },
    totalUsageTime: 5400000, // 1.5 horas en millisegundos
    certificates: [],
    favorites: [1, 2],
    createdAt: "2024-04-05",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    initialSurvey: {
      completedAt: "2024-04-05",
      desiredCourses: [
        "Metalurgia básica",
        "Corrosión y protección",
        "Aleaciones especiales",
        "Análisis de fallas en metales"
      ],
      interests: ["Fundamentos teóricos", "Casos prácticos", "Mantenimiento industrial"],
      experience: "principiante",
      additionalComments: "Trabajo como técnico y quiero profundizar conocimientos"
    },
    demographics: {
      age: 31,
      country: "Colombia",
      city: "Barranquilla",
      profession: "Técnico Industrial"
    }
  },
  // Estudiantes adicionales para el panel administrativo
  {
    id: 6,
    name: "Andrea Morales",
    fullName: "Andrea Lucia Morales Pérez",
    email: "andrea.morales@email.com",
    phone: "+57 315 789 1234",
    role: "user",
    selectedArea: "metalurgia",
    subscription: { type: "premium", expiresAt: "2024-10-15" },
    progress: { 1: 60, 2: 30 },
    totalUsageTime: 5400000, // 1.5 horas
    certificates: [],
    favorites: [1, 2],
    createdAt: "2024-03-10",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    demographics: {
      age: 26,
      country: "Colombia",
      city: "Cali",
      profession: "Ingeniera Metalúrgica"
    },
    dni: "1045678901",
    university: "Universidad del Valle",
    suspended: false
  },
  {
    id: 7,
    name: "Roberto Silva",
    fullName: "Roberto Carlos Silva Mendoza",
    email: "roberto.silva@email.com",
    phone: "+57 316 234 5678",
    role: "user",
    selectedArea: "mineria",
    subscription: { type: "basic", expiresAt: "2024-09-20" },
    progress: { 4: 85, 5: 20 },
    totalUsageTime: 8100000, // 2.25 horas
    certificates: [],
    favorites: [4],
    createdAt: "2024-02-15",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    demographics: {
      age: 32,
      country: "Colombia",
      city: "Cartagena",
      profession: "Ingeniero de Minas"
    },
    dni: "1234567890",
    university: "Universidad Nacional",
    suspended: false
  },
  {
    id: 8,
    name: "Patricia González",
    fullName: "Patricia Elena González Castro",
    email: "patricia.gonzalez@email.com",
    phone: "+57 317 345 6789",
    role: "user",
    selectedArea: "geologia",
    subscription: { type: "expert", expiresAt: "2024-11-30" },
    progress: { 7: 90, 8: 50, 9: 70 },
    totalUsageTime: 12600000, // 3.5 horas
    certificates: [{ courseId: 7, completedAt: "2024-03-01" }],
    favorites: [7, 8, 9],
    createdAt: "2024-01-20",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100",
    demographics: {
      age: 29,
      country: "Colombia",
      city: "Bucaramanga",
      profession: "Geóloga"
    },
    dni: "9876543210",
    university: "Universidad Industrial de Santander",
    suspended: false
  },
  {
    id: 9,
    name: "Diego Ramírez",
    fullName: "Diego Fernando Ramírez López",
    email: "diego.ramirez@email.com",
    phone: "+57 318 456 7890",
    role: "user",
    selectedArea: "metalurgia",
    subscription: { type: "basic", expiresAt: "2024-08-10" },
    progress: { 1: 45, 3: 60 },
    totalUsageTime: 6300000, // 1.75 horas
    certificates: [],
    favorites: [1, 3],
    createdAt: "2024-02-28",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    demographics: {
      age: 34,
      country: "Colombia",
      city: "Pereira",
      profession: "Técnico en Metalurgia"
    },
    dni: "5678901234",
    university: "SENA",
    suspended: false
  },
  {
    id: 10,
    name: "Claudia Herrera",
    fullName: "Claudia María Herrera Vargas",
    email: "claudia.herrera@email.com",
    phone: "+57 319 567 8901",
    role: "user",
    selectedArea: "mineria",
    subscription: { type: "premium", expiresAt: "2024-12-01" },
    progress: { 4: 35, 6: 15 },
    totalUsageTime: 3600000, // 1 hora
    certificates: [],
    favorites: [4],
    createdAt: "2024-03-01",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    demographics: {
      age: 27,
      country: "Colombia",
      city: "Manizales",
      profession: "Ingeniera de Minas"
    },
    dni: "2345678901",
    university: "Universidad Nacional de Colombia",
    suspended: true
  },
  {
    id: 11,
    name: "Fernando Castro",
    fullName: "Fernando José Castro Restrepo",
    email: "fernando.castro@email.com",
    phone: "+57 320 678 9012",
    role: "user",
    selectedArea: "geologia",
    subscription: { type: "expert", expiresAt: "2025-02-15" },
    progress: { 7: 100, 8: 75, 9: 90 },
    totalUsageTime: 18000000, // 5 horas
    certificates: [
      { courseId: 7, completedAt: "2024-02-10" },
      { courseId: 9, completedAt: "2024-03-05" }
    ],
    favorites: [7, 8, 9],
    createdAt: "2024-01-10",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    demographics: {
      age: 38,
      country: "Colombia",
      city: "Armenia",
      profession: "Geólogo Senior"
    },
    dni: "3456789012",
    university: "Universidad de Caldas",
    suspended: false
  },
  {
    id: 12,
    name: "Sandra López",
    fullName: "Sandra Milena López Torres",
    email: "sandra.lopez@email.com",
    phone: "+57 321 789 0123",
    role: "user",
    selectedArea: "metalurgia",
    subscription: { type: "basic", expiresAt: "2024-07-30" },
    progress: { 1: 80, 2: 40 },
    totalUsageTime: 9000000, // 2.5 horas
    certificates: [],
    favorites: [1, 2],
    createdAt: "2024-02-05",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100",
    demographics: {
      age: 30,
      country: "Colombia",
      city: "Ibagué",
      profession: "Ingeniera de Materiales"
    },
    dni: "4567890123",
    university: "Universidad del Tolima",
    suspended: false
  },
  {
    id: 13,
    name: "Javier Mendoza",
    fullName: "Javier Alejandro Mendoza Ruiz",
    email: "javier.mendoza@email.com",
    phone: "+57 322 890 1234",
    role: "user",
    selectedArea: "mineria",
    subscription: { type: "premium", expiresAt: "2024-11-15" },
    progress: { 4: 95, 5: 70, 6: 85 },
    totalUsageTime: 14400000, // 4 horas
    certificates: [{ courseId: 4, completedAt: "2024-02-28" }],
    favorites: [4, 5, 6],
    createdAt: "2024-01-15",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    demographics: {
      age: 33,
      country: "Colombia",
      city: "Villavicencio",
      profession: "Especialista en Minería"
    },
    dni: "5678901234",
    university: "Universidad Minuto de Dios",
    suspended: false
  },
  {
    id: 14,
    name: "Valeria Sánchez",
    fullName: "Valeria Andrea Sánchez Moreno",
    email: "valeria.sanchez@email.com",
    phone: "+57 323 901 2345",
    role: "user",
    selectedArea: "geologia",
    subscription: { type: "basic", expiresAt: "2024-08-25" },
    progress: { 7: 55, 8: 25 },
    totalUsageTime: 7200000, // 2 horas
    certificates: [],
    favorites: [7],
    createdAt: "2024-02-12",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    demographics: {
      age: 25,
      country: "Colombia",
      city: "Pasto",
      profession: "Estudiante de Geología"
    },
    dni: "6789012345",
    university: "Universidad de Nariño",
    suspended: false
  },
  {
    id: 15,
    name: "Ricardo Torres",
    fullName: "Ricardo Enrique Torres Aguilar",
    email: "ricardo.torres@email.com",
    phone: "+57 324 012 3456",
    role: "user",
    selectedArea: "metalurgia",
    subscription: { type: "expert", expiresAt: "2025-01-20" },
    progress: { 1: 100, 2: 85, 3: 75 },
    totalUsageTime: 21600000, // 6 horas
    certificates: [
      { courseId: 1, completedAt: "2024-01-25" },
      { courseId: 2, completedAt: "2024-03-10" }
    ],
    favorites: [1, 2, 3],
    createdAt: "2024-01-05",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    demographics: {
      age: 41,
      country: "Colombia",
      city: "Neiva",
      profession: "Ingeniero Metalúrgico Senior"
    },
    dni: "7890123456",
    university: "Universidad Surcolombiana",
    suspended: false
  }
];

// TODO: REFACTOR - Crear tabla Areas en BD con estos campos
// Esta configuración debería ser 100% dinámica desde BD
// HARDCODED: Estas 3 áreas están hardcodeadas, deben ser admin-configurable
export const mockAreas = [
  {
    id: 1, // TODO: REFACTOR - Auto-increment de BD
    key: 'metalurgia', // TODO: REFACTOR - Slug único, validar unicidad en BD
    name: 'Metalurgia', // TODO: REFACTOR - Nombre editable desde admin
    description: 'Ciencia y tecnología de los metales', // TODO: REFACTOR - Descripción editable
    color: '#ff6b6b', // TODO: REFACTOR - Color hex seleccionable desde admin
    bgColor: 'bg-red-500', // TODO: REFACTOR - Generar dinámicamente desde color
    textColor: 'text-red-500', // TODO: REFACTOR - Generar dinámicamente desde color
    primaryColor: 'text-primary-metalurgia', // TODO: REFACTOR - CSS class dinámica
    icon: '🔥', // TODO: REFACTOR - Icono seleccionable desde admin o subir imagen
    active: true, // TODO: REFACTOR - Estado activo/inactivo desde BD
    createdAt: '2024-01-01' // TODO: REFACTOR - Timestamp automático de BD
  },
  {
    id: 2,
    key: 'mineria',
    name: 'Minería',
    description: 'Extracción y procesamiento de minerales',
    color: '#4ecdc4',
    bgColor: 'bg-teal-500',
    textColor: 'text-teal-500',
    primaryColor: 'text-primary-mineria',
    icon: '⛏️',
    active: true,
    createdAt: '2024-01-01'
  },
  {
    id: 3,
    key: 'geologia',
    name: 'Geología',
    description: 'Estudio de la estructura y composición terrestre',
    color: '#45b7d1',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    primaryColor: 'text-primary-geologia',
    icon: '🌍',
    active: true,
    createdAt: '2024-01-01'
  },
  {
    id: 4,
    key: 'ingenieria-civil',
    name: 'Ingeniería Civil',
    description: 'Diseño y construcción de infraestructura',
    color: '#f39c12',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-500',
    primaryColor: 'text-orange-500',
    icon: '🏗️',
    active: false, // Ejemplo de área desactivada
    createdAt: '2024-01-15'
  }
]

// TODO: REFACTOR - Crear tabla Levels en BD
// HARDCODED: Estos 3 niveles están fijos, deberían ser configurables
export const mockLevels = [
  { key: 'básico', name: 'Básico', color: '#10b981', description: 'Nivel introductorio' }, // TODO: REFACTOR - BD configurable
  { key: 'intermedio', name: 'Intermedio', color: '#f59e0b', description: 'Conocimientos previos necesarios' }, // TODO: REFACTOR - BD configurable
  { key: 'avanzado', name: 'Avanzado', color: '#ef4444', description: 'Para expertos en la materia' } // TODO: REFACTOR - BD configurable
]

export const mockLearningPaths = [
  {
    id: 1,
    title: "Fundamentos de Metalurgia",
    area: "metalurgia",
    courses: [1, 3, 2],
    estimatedTime: "12 semanas",
    difficulty: "básico-intermedio",
    certificate: true,
    description: "Ruta completa para dominar los fundamentos de la metalurgia"
  },
  {
    id: 2,
    title: "Especialista en Minería",
    area: "mineria", 
    courses: [4, 6, 5],
    estimatedTime: "16 semanas",
    difficulty: "intermedio-avanzado",
    certificate: true,
    description: "Conviértete en un especialista en técnicas mineras modernas"
  },
  {
    id: 3,
    title: "Geólogo Profesional",
    area: "geologia",
    courses: [7, 9, 8],
    estimatedTime: "14 semanas", 
    difficulty: "básico-avanzado",
    certificate: true,
    description: "Domina todos los aspectos de la geología aplicada"
  }
];

export const mockRanking = [
  { id: 1, name: "Jose Esneider Almanza", points: 10118, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
  { id: 2, name: "Carlos Humberto Carrillo", points: 6507, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  { id: 3, name: "Johnathan Yesid Silva P.", points: 5621, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
  { id: 22753, name: "Pervol Tech", points: 2, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100" },
  { id: 22754, name: "Marisol De La Cruz", points: 2, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
  { id: 22755, name: "Santiago Bernal", points: 1, avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100" }
];

// Simulación de API con delays realistas
export const mockAPI = {
  // Courses
  getCourses: async (area = null) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    let courses = mockCourses;
    if (area) {
      courses = courses.filter(course => course.area === area);
    }
    return courses;
  },

  getCourseById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses.find(course => course.id === parseInt(id));
  },

  searchCourses: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockCourses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.instructor.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Users
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockUsers;
  },

  getUserById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockUsers.find(user => user.id === parseInt(id));
  },

  // Learning Paths
  getLearningPaths: async (area = null) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    let paths = mockLearningPaths;
    if (area) {
      paths = paths.filter(path => path.area === area);
    }
    return paths;
  },

  // Ranking
  getWeeklyRanking: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRanking;
  },

  // Auth simulation
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = mockUsers.find(u => u.email === email);
    if (user && password === "123456") {
      // Verificar si el usuario está suspendido
      if (user.suspended) {
        return { success: false, error: "Tu cuenta ha sido suspendida. Contacta al administrador." };
      }
      return { success: true, user };
    }
    return { success: false, error: "Credenciales inválidas" };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const newUser = {
      id: Date.now(),
      ...userData,
      role: "user",
      subscription: { type: "free", expiresAt: null },
      progress: {},
      certificates: [],
      favorites: [],
      createdAt: new Date().toISOString(),
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    };
    mockUsers.push(newUser);
    return { success: true, user: newUser };
  },

  // Areas y Levels
  getAreas: async (includeInactive = false) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return includeInactive ? mockAreas : mockAreas.filter(area => area.active)
  },

  getAreaByKey: (key) => {
    return mockAreas.find(area => area.key === key)
  },

  getLevels: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockLevels
  },

  createArea: (areaData) => {
    const newArea = {
      ...areaData,
      id: Math.max(...mockAreas.map(a => a.id)) + 1,
      createdAt: new Date().toISOString()
    }
    mockAreas.push(newArea)
    return newArea
  },

  updateArea: (areaId, updates) => {
    const index = mockAreas.findIndex(area => area.id === areaId)
    if (index !== -1) {
      mockAreas[index] = { ...mockAreas[index], ...updates }
      return mockAreas[index]
    }
    return null
  },

  deleteArea: (areaId) => {
    const index = mockAreas.findIndex(area => area.id === areaId)
    if (index !== -1) {
      return mockAreas.splice(index, 1)[0]
    }
    return null
  }
};