import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, DollarSign, BookOpen, Users, TrendingUp } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

const AdminDashboard = () => {
  const { admin } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalRevenue: 0
  })

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    imageURL: ''
  })

  useEffect(() => {
    if (admin) {
      fetchCourses()
      fetchDashboardStats()
    }
  }, [admin])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/admin/courses/bulk', {
        headers: { token: admin.token }
      })
      setCourses(response.data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard', {
        headers: { token: admin.token }
      })
      setDashboardStats({
        totalCourses: response.data.totalCourses,
        totalRevenue: response.data.totalRevenue
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/admin/course', courseForm, {
        headers: { token: admin.token }
      })
      
      if (response.data.msg === 'Course successfully created') {
        alert('Course created successfully!')
        setShowCreateModal(false)
        setCourseForm({ title: '', description: '', price: '', imageURL: '' })
        fetchCourses()
        fetchDashboardStats()
      }
    } catch (error) {
      alert('Error creating course')
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put('/api/admin/courseupdate', {
        ...courseForm,
        courseId: editingCourse._id
      }, {
        headers: { token: admin.token }
      })
      
      if (response.data.msg === 'Course updated') {
        alert('Course updated successfully!')
        setEditingCourse(null)
        setCourseForm({ title: '', description: '', price: '', imageURL: '' })
        fetchCourses()
      }
    } catch (error) {
      alert('Error updating course')
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await axios.delete(`/api/admin/course/${courseId}`, {
          headers: { token: admin.token }
        })
        
        if (response.data.msg === 'Course deleted successfully') {
          alert('Course deleted successfully!')
          fetchCourses()
          fetchDashboardStats()
        }
      } catch (error) {
        alert('Error deleting course')
      }
    }
  }

  const openEditModal = (course) => {
    setEditingCourse(course)
    setCourseForm({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
      imageURL: course.imageURL || ''
    })
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingCourse(null)
    setCourseForm({ title: '', description: '', price: '', imageURL: '' })
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-600">Manage your courses and track performance</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Course</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${dashboardStats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{courses.length * 15}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Rating</p>
                <p className="text-2xl font-semibold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-4">Create your first course to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Course
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <span className="text-primary-600 font-semibold">
                                {course.title.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {course.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${course.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {Math.floor(Math.random() * 100) + 10}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(course)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Course Modal */}
        {(showCreateModal || editingCourse) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              
              <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="input-field"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      className="input-field"
                      value={courseForm.imageURL}
                      onChange={(e) => setCourseForm({...courseForm, imageURL: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard