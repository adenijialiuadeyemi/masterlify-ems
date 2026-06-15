import { useCallback, useEffect, useState } from "react"
import { dummyEmployeeData } from "../assets/assets"
import { Plus, Search, X } from "lucide-react"
import EmployeeCard from "../components/EmployeeCard"
import EmployeeForm from "../components/EmployeeForm"
import api from "../api/axios"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editEmployee, setEditEmployee] = useState(null)

  const fetchEmployees = useCallback(async (dept = selectedDept) => {
   try {
     setLoading(true)
     const url = dept ? `/employees?department=${dept}` : "/employees"
     const res = await api.get(url)
     setEmployees(res.data)
   } catch (error) {
     console.error("Failed to fetch employees:", error)
   } finally {
      setLoading(false)
   }
  }, [selectedDept])

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees])

  const handleDeptChange = (e) => {
    const dept = e.target.value
    setSelectedDept(dept)
    fetchEmployees(dept)
  }

  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(search.toLowerCase())
  )

  const departments = [...new Set(dummyEmployeeData.map((e) => e.department).filter(Boolean))]

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your team members</p>
        </div>
        <button
          className="btn-primary inline-flex items-center gap-1"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Search bar + department filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="sm:w-44"
          value={selectedDept}
          onChange={handleDeptChange}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Employee cards */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              No employees found
            </p>
          ) : (
            filtered.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onDelete={fetchEmployees}
                onEdit={(e) => setEditEmployee(e)}
              />
            ))
          )}
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="fixed inset-0" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Add Employee</h2>
                <p className="text-sm text-slate-500 mt-0.5">Create a new employee record</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <EmployeeForm
                onSuccess={() => { setShowCreateModal(false); fetchEmployees(); }}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editEmployee && (
        <div
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setEditEmployee(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
                <p className="text-sm text-slate-500 mt-0.5">Update employee details</p>
              </div>
              <button
                onClick={() => setEditEmployee(null)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <EmployeeForm
                initialData={editEmployee}
                onSuccess={() => { setEditEmployee(null); fetchEmployees(); }}
                onCancel={() => setEditEmployee(null)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Employees