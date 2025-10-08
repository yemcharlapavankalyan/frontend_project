import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem('critiq_role', role)
    navigate(role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold">Login</h2>
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Select Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border px-3 py-2">
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="w-full rounded-md bg-indigo-600 text-white px-3 py-2">Continue</button>
      </motion.form>
    </div>
  )
}


