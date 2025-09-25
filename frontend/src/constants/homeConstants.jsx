export const AREA_NAMES = {
  web: 'Desarrollo Web',
  mobile: 'Mobile',
  data: 'Data Science',
  ia: 'Inteligencia Artificial',
  design: 'Diseño',
  marketing: 'Marketing Digital',
  business: 'Business',
  personal: 'Desarrollo Personal'
}

export const AREA_COLORS = {
  web: 'bg-blue-100',
  mobile: 'bg-green-100',
  data: 'bg-purple-100',
  ia: 'bg-red-100',
  design: 'bg-pink-100',
  marketing: 'bg-yellow-100',
  business: 'bg-indigo-100',
  personal: 'bg-orange-100'
}

export const CAROUSEL_CONFIG = {
  autoPlayInterval: 3000,
  showIndicators: true,
  pauseOnHover: true
}

export const HOME_MESSAGES = {
  carousel: {
    nextSlide: 'Siguiente slide',
    prevSlide: 'Slide anterior'
  },
  featured: {
    title: 'Cursos Destacados',
    subtitle: 'Los mejores cursos seleccionados para ti'
  },
  recommended: {
    title: 'Recomendados para ti',
    subtitle: 'Basado en tu historial de aprendizaje'
  },
  continueWithCourse: {
    title: 'Continúa con tu curso',
    subtitle: 'Retoma donde lo dejaste'
  },
  explore: {
    title: 'Explorar por áreas',
    subtitle: 'Descubre cursos en diferentes especialidades'
  }
}

export const HOME_STYLES = {
  container: 'min-h-screen bg-background text-foreground',
  maxWidth: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  carousel: {
    container: 'relative mb-12 rounded-lg overflow-hidden shadow-lg',
    slide: 'w-full h-64 bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-center',
    title: 'text-4xl font-bold mb-4',
    subtitle: 'text-xl',
    indicators: 'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2',
    indicator: 'w-3 h-3 rounded-full bg-white bg-opacity-50 cursor-pointer transition-all duration-300',
    indicatorActive: 'bg-opacity-100',
    button: 'absolute top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300',
    prevButton: 'left-4',
    nextButton: 'right-4'
  },
  section: {
    container: 'mb-12',
    header: 'mb-8 text-center',
    title: 'text-3xl font-bold text-text-primary mb-2',
    subtitle: 'text-text-secondary'
  },
  areas: {
    grid: 'grid grid-cols-2 md:grid-cols-4 gap-6',
    card: 'p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer',
    cardTitle: 'text-lg font-semibold text-center text-black'
  },
  courses: {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    noResults: 'text-center text-muted-foreground py-8'
  }
}