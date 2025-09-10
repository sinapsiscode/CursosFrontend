import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from '../ui'

const CourseCard = ({ course }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/course/${course.id}`)
  }
  
  const discount = course.originalPrice && course.originalPrice > course.price
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0

  return (
    <Card hover className="overflow-hidden cursor-pointer" onClick={handleClick}>
      {/* Course Image/Icon */}
      <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center relative">
        <span className="text-6xl opacity-50">{course.icon || '📚'}</span>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {course.new && (
            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
              Nuevo
            </span>
          )}
          {course.bestseller && (
            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold">
              Bestseller
            </span>
          )}
          {course.featured && (
            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-semibold">
              Destacado
            </span>
          )}
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded">
            <span className="text-sm font-bold">-{discount}%</span>
          </div>
        )}
      </div>
      
      {/* Course Info */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary mb-1 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-sm text-text-secondary mb-3">
          {course.instructor}
        </p>
        
        {/* Rating and Students */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm font-medium text-text-primary">
              {course.rating || '4.5'}
            </span>
            <span className="text-xs text-text-secondary">
              ({course.students || 0})
            </span>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded ${
            course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
            course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {course.level === 'beginner' ? 'Principiante' :
             course.level === 'intermediate' ? 'Intermedio' :
             'Avanzado'}
          </span>
        </div>
        
        {/* Duration */}
        <p className="text-xs text-text-secondary mb-3">
          ⏱️ {course.duration || '8 horas'}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-accent">
              ${course.price}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-sm text-text-secondary line-through ml-2">
                ${course.originalPrice}
              </span>
            )}
          </div>
          
          <Button size="small" variant="secondary">
            Ver más
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default CourseCard