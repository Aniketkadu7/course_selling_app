import React, { useState } from 'react'
import { User, Mail, Edit3, Save, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'

const Profile = () => {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.put('/api/user/profile', formData, {
        headers: { token: user.token }
      })
      
      setMessage('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      setMessage('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || ''
    })
    setEditing(false)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 btn-secondary"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 btn-primary disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-600'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-500">@{user?.username}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 py-2">@{user?.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 py-2">{user?.email}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            {/* Account Stats */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">5</p>
                  <p className="text-sm text-gray-500">Courses Enrolled</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">3</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">40h</p>
                  <p className="text-sm text-gray-500">Learning Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile