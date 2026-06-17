import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeftIcon, PrinterIcon } from 'lucide-react'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import api from '../api/axios'

const PrintPayslip = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      toast.error('Invalid payslip ID')
      navigate('/payslips')
      return
    }

    api.get(`/payslips/${id}`)
      .then(res => {
        if (res.data?.data) {
          setPayslip(res.data.data)
        } else {
          toast.error('Payslip not found')
          navigate('/payslips')
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to fetch payslip')
        navigate('/payslips')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <Loading />
  if (!payslip) return null

  const period =
    payslip.year && payslip.month
      ? format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")
      : "—"

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      {/* Back + Print buttons — hidden on print */}
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={() => navigate('/payslips')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Payslips
        </button>
        <button
          onClick={() => window.print()}
          className="btn-primary inline-flex items-center gap-2"
        >
          <PrinterIcon className="w-4 h-4" />
          Print Payslip
        </button>
      </div>

      {/* Payslip Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">

        {/* Header */}
        <div className='text-center border-b border-slate-200 pb-6 mb-8'>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>PAYSLIP</h1>
          <p className='text-slate-500 text-sm mt-1'>{period}</p>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
              Employee Name
            </p>
            <p className='font-semibold text-slate-900'>
              {payslip.employee?.firstName} {payslip.employee?.lastName}
            </p>
          </div>
          <div>
            <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
              Position
            </p>
            <p className='font-semibold text-slate-900'>
              {payslip.employee?.position || "—"}
            </p>
          </div>
          <div>
            <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
              Department
            </p>
            <p className='font-semibold text-slate-900'>
              {payslip.employee?.department || "—"}
            </p>
          </div>
          <div>
            <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
              Period
            </p>
            <p className='font-semibold text-slate-900'>{period}</p>
          </div>
          <div className="col-span-2">
            <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>
              Email
            </p>
            <p className='font-semibold text-slate-900'>
              {payslip.employee?.email || "—"}
            </p>
          </div>
        </div>

        {/* Salary Breakdown Table */}
        <div className='rounded-xl border border-slate-200 overflow-hidden mb-8'>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className='text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider'>
                  Description
                </th>
                <th className='text-right py-3 px-4 text-xs text-slate-500 uppercase tracking-wider'>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className='py-3 px-4 text-slate-700'>Basic Salary</td>
                <td className='text-right py-3 px-4 text-slate-900 font-medium'>
                  ${payslip.basicSalary?.toLocaleString()}
                </td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className='py-3 px-4 text-slate-700'>Allowances</td>
                <td className='text-right py-3 px-4 text-emerald-600 font-medium'>
                  +${payslip.allowances?.toLocaleString()}
                </td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className='py-3 px-4 text-slate-700'>Deductions</td>
                <td className='text-right py-3 px-4 text-rose-600 font-medium'>
                  -${payslip.deductions?.toLocaleString()}
                </td>
              </tr>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className='py-4 px-4 font-bold text-slate-900'>Net Salary</td>
                <td className='text-right py-4 px-4 font-bold text-indigo-600 text-lg'>
                  ${payslip.netSalary?.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 print:block">
          Generated by Masterlify-EMS 
        </div>
      </div>
    </div>
  )
}

export default PrintPayslip