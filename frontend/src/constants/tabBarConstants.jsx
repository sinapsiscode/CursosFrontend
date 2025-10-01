export const TAB_BAR_STYLES = {
  spacer: 'h-20 md:hidden',
  mobileContainer: 'md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 z-50',
  mobileContent: 'flex justify-around items-center h-20 px-2',
  mobileTab: 'flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors',
  mobileTabActive: 'text-accent bg-accent bg-opacity-10',
  mobileTabInactive: 'text-gray-400 hover:text-white',
  mobileTabIcon: 'text-current',
  mobileTabLabel: 'text-xs font-medium',
  desktopContainer: 'hidden md:block',
  desktopWrapper: 'bg-surface border-b border-gray-700',
  desktopContent: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  desktopTabs: 'flex justify-center space-x-8',
  desktopTab: 'flex items-center space-x-2 px-3 py-4 border-b-2 text-sm font-medium transition-colors',
  desktopTabActive: 'border-accent text-accent',
  desktopTabInactive: 'border-transparent text-gray-400 hover:text-white hover:border-gray-300',
  desktopTabIcon: 'w-5 h-5'
}

export const TAB_DEFINITIONS = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    path: '/'
  },
  {
    id: 'buscar',
    label: 'Buscar',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    path: '/search'
  },
  {
    id: 'rutas',
    label: 'Mis rutas',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    path: '/learning-paths'
  },
  {
    id: 'eventos',
    label: 'Eventos',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    path: '/events'
  },
  {
    id: 'perfil',
    label: 'Mi perfil',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    path: '/profile'
  }
]