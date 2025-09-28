import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Star } from 'lucide-react'

const CourseCard = ({ course, showPurchaseButton = true, onPurchase }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mb-4 flex items-center justify-center">
        {course.imageURL ? (
          <img 
            src={course.imageURL} 
            alt={course.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-white text-lg font-semibold">
            {course.title?.charAt(0) || 'C'}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>8 weeks</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>1.2k</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-2xl font-bold text-primary-600">
            ${course.price || 0}
          </div>
          
          <div className="flex space-x-2">
            <Link 
              to={`/course/${course._id}`}
              className="btn-secondary text-sm"
            >
              View Details
            </Link>
            {showPurchaseButton && onPurchase && (
              <button 
                onClick={() => onPurchase(course)}
                className="btn-primary text-sm"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard