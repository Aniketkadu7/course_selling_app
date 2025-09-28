import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { BookOpen, User, LogOut, Settings } from 'lucide-react'

const Navbar = () => {
  const { user, admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CourseHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-gray-700 hover:text-primary-600 transition-colors">
              Courses
            </Link>
            
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                My Learning
              </Link>
            )}
            
            {admin && (
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!user && !admin ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-2">
                    <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:block">{user.firstName}</span>
                    </Link>
                  </div>
                )}
                
                {admin && (
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-700" />
                    <span className="hidden sm:block text-gray-700">Admin</span>
                  </div>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar