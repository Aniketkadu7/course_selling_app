import React, { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import axios from 'axios'
import CourseCard from '../components/CourseCard'
import { useAuth } from '../hooks/useAuth'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const { user } = useAuth()

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, priceFilter])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/course')
      setCourses(response.data.courses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = courses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(course => {
        const price = course.price || 0
        switch (priceFilter) {
          case 'free':
            return price === 0
          case 'under50':
            return price > 0 && price < 50
          case 'under100':
            return price >= 50 && price < 100
          case 'over100':
            return price >= 100
          default:
            return true
        }
      })
    }

    setFilteredCourses(filtered)
  }

  const handlePurchase = async (course) => {
    if (!user) {
      alert('Please login to purchase courses')
      return
    }

    try {
      const response = await axios.post('/api/user/purchaseCourse', 
        { title: course.title },
        { headers: { token: user.token } }
      )
      
      if (response.data.msg === 'Course purchased successfully.') {
        alert('Course purchased successfully!')
      } else {
        alert(response.data.msg)
      }
    } catch (error) {
      alert('Error purchasing course')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-video bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Courses</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="input-field"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="free">Free</option>
                <option value="under50">Under $50</option>
                <option value="under100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>
            </div>
          </div>

          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course._id} 
                course={course} 
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses