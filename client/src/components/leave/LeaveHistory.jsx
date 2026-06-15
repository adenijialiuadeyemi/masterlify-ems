import { format } from 'date-fns'
import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../../api/axios'

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
  const [processing, setProcessing] = useState(null)

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id)
    try {
      await api.patch(`/leaves/${id}`, { status })
      toast.success(`Leave ${status.toLowerCase()} successfully`)
      onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Failed to update leave status")
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className='card overflow-hidden'>
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              {isAdmin && <th className='text-center'>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 4} className="text-center py-12 text-slate-400">
                  No leave applications found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => {
                const leaveId = leave._id || leave.id
                return (
                  <tr key={leaveId}>
                    {isAdmin && (
                      <td className='text-slate-900'>
                        {leave.employee?.firstName} {leave.employee?.lastName}
                      </td>
                    )}

                    <td>
                      <span className='badge bg-slate-100 text-slate-600'>
                        {leave.type}
                      </span>
                    </td>

                    <td className='text-xs text-slate-500'>
                      {format(new Date(leave.startDate), "MMM dd")} — {format(new Date(leave.endDate), "MMM dd, yyyy")}
                    </td>

                    <td className='text-xs text-slate-500 max-w-[180px] truncate' title={leave.reason}>
                      {leave.reason}
                    </td>

                    <td>
                      <span className={`badge ${
                        leave.status === "APPROVED"
                          ? "badge-success"
                          : leave.status === "REJECTED"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}>
                        {leave.status}
                      </span>
                    </td>

                    {isAdmin && (
                      <td>
                        {leave.status === "PENDING" && (
                          <div className='flex justify-center gap-2'>
                            <button
                              disabled={!!processing}
                              onClick={() => handleStatusUpdate(leaveId, "APPROVED")}
                              className='p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors'
                            >
                              {processing === leaveId
                                ? <Loader2Icon className="w-4 h-4 animate-spin" />
                                : <CheckIcon className="w-4 h-4" />}
                            </button>

                            <button
                              disabled={!!processing}
                              onClick={() => handleStatusUpdate(leaveId, "REJECTED")}
                              className='p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors'
                            >
                              {processing === leaveId
                                ? <Loader2Icon className="w-4 h-4 animate-spin" />
                                : <XIcon className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeaveHistory