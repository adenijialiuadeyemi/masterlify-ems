import { PencilIcon, Trash2Icon } from 'lucide-react'
import React from 'react'

const EmployeeCard = ({ employee, onDelete, onEdit }) => {

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${employee._id}`);
      toast.success("Employee deleted successfully");
      onDelete(employee._id);
    }catch (error) {
      console.error("Failed to delete employee:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to delete employee");
    }
  }

  return (
    <div className='group relative card card-hover overflow-hidden'>

      {/* Avatar section */}
      <div className='relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-slate-100 to-slate-50'>
        <div className='w-full h-full flex items-center justify-center'>
          <div className='w-20 h-20 rounded-full bg-linear-to-br from-indigo-100 to-slate-100 flex items-center justify-center'>
            <span className='text-2xl font-medium text-indigo-400'>
              {employee.firstName[0]} {employee.lastName[0]}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className='absolute top-3 left-3 flex gap-2'>
          <span className='bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-slate-600 rounded-lg shadow-sm'>
            {employee.department || "Remote"}
          </span>
          {employee.isDeleted && (
            <span className='bg-red-500/60 font-medium text-white px-2.5 py-1 text-xs rounded'>DELETED</span>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className='p-5 relative'>
        <h3 className='text-slate-900'>{employee.firstName} {employee.lastName}</h3>
        <p className='text-xs text-slate-500'>{employee.position}</p>

        {/* Hover action buttons */}
        <div className='absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <button
            onClick={() => onEdit(employee)}
            className='p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 transition-colors duration-150'
            title="Edit employee"
          >
            <PencilIcon className='w-4 h-4' />
          </button>
          <button
            onClick={handleDelete}
            className='p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors duration-150'
            title="Delete employee"
          >
            <Trash2Icon className='w-4 h-4' />
          </button>
        </div>
      </div>

    </div>
  )
}

export default EmployeeCard