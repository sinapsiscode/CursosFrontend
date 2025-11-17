import { Link } from 'react-router-dom'

const PageLayout = ({ title, action, children, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        <span className="ml-2 text-secondary">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {action && (
          <Link
            to={action.href}
            className="bg-accent hover:bg-accent/80 text-background px-4 py-2 rounded-lg transition-colors"
          >
            {action.label}
          </Link>
        )}
      </header>

      <main className="page-content">
        {children}
      </main>
    </div>
  )
}

// Componente de loading estático para uso directo
PageLayout.Loading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    <span className="ml-2 text-secondary">Cargando...</span>
  </div>
)

export default PageLayout