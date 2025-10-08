import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Reviews from './pages/Reviews.jsx'
import Admin from './pages/Admin.jsx'
import { getRole } from './utils/auth.js'
import { ReviewsProvider } from './context/ReviewsContext.jsx'

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: getRole() ? <App><Dashboard /></App> : <Login /> },
  { path: '/reviews', element: getRole() ? <App><Reviews /></App> : <Login /> },
  { path: '/admin', element: getRole() === 'admin' ? <App><Admin /></App> : <Login /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReviewsProvider>
      <RouterProvider router={router} />
    </ReviewsProvider>
  </StrictMode>,
)
