import React, { useState, useEffect } from 'react'
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import CourseCard from '../components/CourseCard'

const Dashboard = () => {
  const { user } = useAuth()
  const [purchasedCourses, setPurchasedCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchPurchasedCourses()
    }
  }, [user])

  const fetchPurchasedCourses = async () => {
    try {
      const response = await axios.get('/api/user/purchases', {
        headers: { token: user.token }
      })
      setPurchasedCourses(response.data.courses || [])
    } catch (error) {
      console.error('Error fetching purchased courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card">
                  <div className="h-12 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{purchasedCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hours Learned</p>
                <p className="text-2xl font-semibold text-gray-900">{purchasedCourses.length * 8}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Certificates</p>
                <p className="text-2xl font-semibold text-gray-900">{Math.floor(purchasedCourses.length * 0.7)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progress</p>
                <p className="text-2xl font-semibold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          
          {purchasedCourses.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-4">Start your learning journey by enrolling in a course</p>
              <a href="/courses" className="btn-primary">
                Browse Courses
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((course) => (
                <div key={course._id} className="card">
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
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary">
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard