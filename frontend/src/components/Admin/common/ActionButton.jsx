const ActionButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  className = ''
}) => {
  const variants = {
    primary: 'bg-accent hover:bg-accent-dark text-background',
    secondary: 'bg-surface hover:bg-surface-dark text-white border border-text-secondary/20',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    ghost: 'bg-transparent hover:bg-surface text-white'
  }

  const sizes = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  }

  const buttonClasses = `
    ${variants[variant]}
    ${sizes[size]}
    rounded-lg font-medium transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center space-x-2
    ${className}
  `

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

export default ActionButton