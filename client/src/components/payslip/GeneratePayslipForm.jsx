import { Plus, X, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

const GeneratePayslipForm = ({ employees, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return (
    <button
      onClick={() => setIsOpen(true)}
      className="btn-primary flex items-center gap-2"
    >
      <Plus className="w-4 h-4" /> Generate Payslip
    </button>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    try {
      await api.post("/payslips", data)
      toast.success("Payslip generated successfully")
      setIsOpen(false)
      onSuccess()
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message || "Failed to generate payslip")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='card max-w-lg w-full p-6 animate-slide-up'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-lg font-bold text-slate-900'>Generate Monthly Payslip</h3>
          <button
            onClick={() => setIsOpen(false)}
            className='text-slate-400 hover:text-slate-600 p-1'
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Employee */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Employee
            </label>
            <select name="employeeId" required>
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e._id || e.id} value={e._id || e.id}>
                  {e.firstName} {e.lastName} {e.position ? `(${e.position})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Select Month & Year */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Month
              </label>
              <select name="month" defaultValue={new Date().getMonth() + 1}>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year
              </label>
              <input
                type="number"
                name="year"
                required
                defaultValue={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Basic Salary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              required
              min="0"
              placeholder="5000"
            />
          </div>

          {/* Allowances & Deductions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Allowances
              </label>
              <input
                type="number"
                name="allowances"
                min="0"
                defaultValue="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deductions
              </label>
              <input
                type="number"
                name="deductions"
                min="0"
                defaultValue="0"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              type='button'
              className='btn-secondary'
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type='submit'
              className='btn-primary flex items-center'
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GeneratePayslipForm