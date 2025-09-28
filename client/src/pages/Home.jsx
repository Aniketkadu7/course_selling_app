import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, TrendingUp, ArrowRight } from 'lucide-react'
import axios from 'axios'
import CourseCard from '../components/CourseCard'

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedCourses()
  }, [])

  const fetchFeaturedCourses = async () => {
    try {
      const response = await axios.get('/api/course')
      setFeaturedCourses(response.data.courses.slice(0, 3))
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Skills That Matter
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Join thousands of learners and advance your career with our expert-led courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Browse Courses
              </Link>
              <Link to="/signup" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">Instructors</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} showPurchaseButton={false} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/courses" 
              className="inline-flex items-center space-x-2 btn-primary text-lg"
            >
              <span>View All Courses</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join our community of learners and take your skills to the next level
          </p>
          <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home