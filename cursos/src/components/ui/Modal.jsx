import React from 'react'

/**
 * Modal component reutilizable
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  hideCloseButton = false
}) => {
  if (!isOpen) return null

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`relative bg-surface rounded-lg shadow-xl w-full ${sizes[size]}`}>
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              {title && (
                <h3 className="text-lg font-semibold text-text-primary">
                  {title}
                </h3>
              )}
              
              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal