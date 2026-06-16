import { DownloadIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0)

const getPeriod = (payslip) => {
  if (!payslip.month || !payslip.year) return "—"
  return `${MONTHS[(payslip.month || 1) - 1]} ${payslip.year}`
}

const getEmployeeName = (payslip) => {
  const emp = payslip.employee || payslip.employeeId
  if (!emp) return "—"
  return `${emp.firstName || ""} ${emp.lastName || ""}`.trim()
}

const PayslipList = ({ payslips, isAdmin, onUpdate }) => {
  const navigate = useNavigate()

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {payslips.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-center py-12 text-slate-400">
                  No payslips found
                </td>
              </tr>
            ) : (
              payslips.map((payslip) => {
                const payslipId = payslip._id || payslip.id
                return (
                  <tr key={payslipId}>
                    {isAdmin && (
                      <td className="font-medium text-slate-900">
                        {getEmployeeName(payslip)}
                      </td>
                    )}
                    <td className="text-slate-500">
                      {getPeriod(payslip)}
                    </td>
                    <td className="text-slate-600">
                      {formatCurrency(payslip.basicSalary)}
                    </td>
                    <td className="font-semibold text-slate-900">
                      {formatCurrency(payslip.netSalary)}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => navigate(`/payslips/${payslipId}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <DownloadIcon className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </td>
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

export default PayslipList