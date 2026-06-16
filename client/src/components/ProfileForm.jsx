import React, { useState } from 'react'
import { User, Loader2, Save } from 'lucide-react'
import api from '../api/axios'

const ProfileForm = ({ initialData, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    /* try {
      // TODO: call API with FormData
      setMessage("Profile updated successfully.")
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    } */
   const formData = new FormData(e.target)
   try{
    await api.put("/profile", formData)
    setMessage("Profile updated successfully.")
    onSuccess?.()
   }catch(error){
    setError(error?.response?.data?.error || error?.message || "Failed to update profile")
   }finally{
    setLoading(false)
   }
  }

  return (
    <form onSubmit={handleSubmit} className='card p-5 sm:p-6 mb-6'>
      <h2 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2'>
        <User className="w-5 h-5 text-slate-400" /> Public Profile
      </h2>

      {/* Error banner */}
      {error && (
        <div className='bg-rose-50 text-rose-700 p-4 rounded-xl text-sm border border-rose-200 mb-6 flex items-start gap-3'>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Success banner */}
      {message && (
        <div className='bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-6 flex items-start gap-3'>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
          {message}
        </div>
      )}

      <div className='space-y-5'>
        {/* Name & Email row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>
            <input
              disabled
              value={`${initialData.firstName} ${initialData.lastName}`}
              className='bg-slate-50 text-slate-400 cursor-not-allowed'
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              disabled
              value={initialData.email}
              className='bg-slate-50 text-slate-400 cursor-not-allowed'
            />
          </div>
        </div>

        {/* Position */}
        <div className='sm:col-span-2'>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Position
          </label>
          <input
            disabled
            value={initialData.position}
            className='bg-slate-50 text-slate-400 cursor-not-allowed'
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bio
          </label>
          <textarea
            disabled={initialData.isDeleted}
            name="bio"
            defaultValue={initialData.bio || ""}
            placeholder='Write a brief bio...'
            className={`resize-none ${
              initialData.isDeleted
                ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                : ""
            }`}
          />
          <p className='text-xs text-slate-400 mt-1.5'>
            This will be displayed on your profile.
          </p>
        </div>

        {/* Save button — only if not deleted */}
        {!initialData.isDeleted ? (
          <div className='flex justify-end pt-2'>
            <button
              type='submit'
              disabled={loading}
              className='btn-primary flex items-center gap-2 justify-center w-full sm:w-auto'
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        ) : (
          <div className='flex justify-end pt-2'>
            <p className='text-sm text-slate-400'>
              You cannot update your profile.
            </p>
          </div>
        )}
      </div>
    </form>
  )
}

export default ProfileForm