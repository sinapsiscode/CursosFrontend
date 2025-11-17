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
  maxWidth: 'max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8',
  carousel: {
    container: 'relative mb-6 sm:mb-8 md:mb-12 rounded-lg overflow-hidden shadow-lg',
    slide: 'w-full h-48 sm:h-56 md:h-64 lg:h-80 bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-center px-4',
    title: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4',
    subtitle: 'text-sm sm:text-base md:text-lg lg:text-xl',
    indicators: 'absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2',
    indicator: 'w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-white bg-opacity-50 cursor-pointer transition-all duration-300',
    indicatorActive: 'bg-opacity-100 scale-110',
    button: 'absolute top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 text-xl sm:text-2xl md:text-3xl',
    prevButton: 'left-2 sm:left-3 md:left-4',
    nextButton: 'right-2 sm:right-3 md:right-4'
  },
  section: {
    container: 'mb-8 sm:mb-10 md:mb-12',
    header: 'mb-4 sm:mb-6 md:mb-8 text-center px-2',
    title: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1.5 sm:mb-2',
    subtitle: 'text-xs sm:text-sm md:text-base text-secondary'
  },
  areas: {
    grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6',
    card: 'p-4 sm:p-5 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer active:scale-95 transform duration-150',
    cardTitle: 'text-sm sm:text-base md:text-lg font-semibold text-center text-black'
  },
  courses: {
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6',
    noResults: 'text-center text-muted-foreground py-8 text-sm sm:text-base'
  }
}