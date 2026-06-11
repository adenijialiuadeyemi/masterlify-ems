import React, { useState } from 'react'
import { Lock as LockIcon, X, Loader2 as Loader2Icon } from 'lucide-react'

const ChangePasswordModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: call API with formData
      setMessage({ type: "success", text: "Password updated successfully." })
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong." })
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
    >
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' />

      <div
        className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 pb-0'>
          <h2 className='text-lg font-medium text-slate-900 flex items-center gap-2'>
            <LockIcon className="w-5 h-5 text-slate-400" /> Change Password
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Feedback message */}
          {message.text && (
            <div className={`p-4 rounded-xl text-sm border flex items-start gap-3 ${
              message.type === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                message.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
              }`} />
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Password
            </label>
            <input type="password" name="currentPassword" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>
            <input type="password" name="newPassword" required />
          </div>

          <div className='flex gap-3 pt-2'>
            <button
              type="button"
              onClick={onClose}
              className='btn-secondary flex-1'
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className='btn-primary flex-1 flex justify-center items-center gap-2'
            >
              {loading && <Loader2Icon className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal