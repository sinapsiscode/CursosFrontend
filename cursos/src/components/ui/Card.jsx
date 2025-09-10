import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  ...props 
}) => {
  const baseStyles = 'bg-surface rounded-lg border border-gray-700'
  const hoverStyles = hover ? 'hover:border-gray-600 hover:shadow-lg transition-all duration-200 cursor-pointer' : ''
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card