import { Link, useLocation } from 'react-router-dom'

function App({ children }) {
  const location = useLocation()
  const active = (path) =>
    location.pathname === path ? 'text-white bg-indigo-600' : 'text-indigo-600 hover:bg-indigo-50'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">CRITIQ</h1>
          <nav className="flex gap-2">
            <Link className={`px-3 py-2 rounded-md text-sm font-medium ${active('/dashboard')}`} to="/dashboard">Dashboard</Link>
            <Link className={`px-3 py-2 rounded-md text-sm font-medium ${active('/reviews')}`} to="/reviews">Reviews</Link>
            <Link className={`px-3 py-2 rounded-md text-sm font-medium ${active('/admin')}`} to="/admin">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">
        {children}
      </main>
    </div>
  )
}

export default App
