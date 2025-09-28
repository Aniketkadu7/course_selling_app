import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Users, Star, Play, CheckCircle, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/course/${id}`)
      setCourse(response.data.course)
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      alert('Please login to purchase courses')
      navigate('/login')
      return
    }

    setPurchasing(true)
    try {
      const response = await axios.post('/api/user/purchaseCourse', 
        { title: course.title },
        { headers: { token: user.token } }
      )
      
      if (response.data.msg === 'Course purchased successfully.') {
        alert('Course purchased successfully!')
        navigate('/dashboard')
      } else {
        alert(response.data.msg)
      }
    } catch (error) {
      alert('Error purchasing course')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="aspect-video bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <button onClick={() => navigate('/courses')} className="btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/courses')}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Courses</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Course Header */}
          <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            {course.imageURL ? (
              <img 
                src={course.imageURL} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Course Preview</p>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>8 weeks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>1,234 students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (324 reviews)</span>
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About this course</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Master the fundamentals and advanced concepts',
                      'Build real-world projects from scratch',
                      'Learn industry best practices',
                      'Get hands-on experience with tools',
                      'Understand core principles and patterns',
                      'Prepare for professional opportunities'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="lg:w-80">
                <div className="card sticky top-8">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      ${course.price || 0}
                    </div>
                    <p className="text-gray-500">One-time payment</p>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full btn-primary mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchasing ? 'Processing...' : 'Enroll Now'}
                  </button>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Full lifetime access</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Certificate of completion</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>30-day money-back guarantee</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail