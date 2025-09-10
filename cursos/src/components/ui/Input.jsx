import React from 'react'

/**
 * Input component reutilizable
 */
const Input = ({
  label,
  error,
  helperText,
  className = '',
  required = false,
  ...props
}) => {
  const inputClasses = `
    w-full px-3 py-2 bg-surface border rounded-lg text-text-primary placeholder-text-secondary
    focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'}
    ${className}
  `

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-text-secondary text-sm">{helperText}</p>
      )}
    </div>
  )
}

export default Input