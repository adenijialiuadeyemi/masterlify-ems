import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './pages/Layout';
import LoginLanding from './pages/LoginLanding';
import Dashboard from './pages/Dashboard';
import PrintPayslip from './pages/PrintPayslip';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payslips from './pages/Payslips';
import Settings from './pages/Settings';
import LoginForm from './components/LoginForm';

const App = () => {
 return (
  <>
    <Toaster />
    <Routes>
      {/* Public login routes */}
      <Route path="/login" element={<LoginLanding />} />
      <Route
        path="/login/admin"
        element={
          <LoginForm
            role="admin"
            title="Admin Portal"
            subtitle="Sign in to manage the organization"
          />
        }
      />
      <Route
        path="/login/employee"
        element={
          <LoginForm
            role="employee"
            title="Employee Portal"
            subtitle="Sign in to access your account"
          />
        }
      />

      {/* Protected layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/payslips" element={<Payslips />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Dynamic payslip printing */}
     <Route path="/payslips/:id" element={<PrintPayslip />} />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </>
);

}

export default App