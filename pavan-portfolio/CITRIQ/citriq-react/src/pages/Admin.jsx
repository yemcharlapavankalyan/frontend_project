import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([
    { id: 'a1', title: 'Landing Page Review', due: '2025-10-20' },
    { id: 'a2', title: 'React Components Review', due: '2025-10-25' },
  ])

  useEffect(() => {
    const role = localStorage.getItem('critiq_role')
    if (role !== 'admin') navigate('/login')
  }, [navigate])

  const stats = useMemo(() => ({ submissions: 12, feedbacks: 28, avgRating: 4.1 }), [])

  function addAssignment() {
    const title = prompt('Assignment title?')
    if (!title) return
    setAssignments(prev => [...prev, { id: crypto.randomUUID(), title, due: '2025-11-01' }])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <button onClick={addAssignment} className="rounded-md bg-indigo-600 text-white px-3 py-2">New Assignment</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">Submissions: {stats.submissions}</div>
        <div className="rounded-lg border bg-white p-4">Feedbacks: {stats.feedbacks}</div>
        <div className="rounded-lg border bg-white p-4">Avg Rating: {stats.avgRating}</div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Assignments</h3>
        <ul className="divide-y rounded-lg border bg-white">
          {assignments.map(a => (
            <li key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-gray-600">Due: {a.due}</p>
              </div>
              <button className="text-indigo-600">View</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


