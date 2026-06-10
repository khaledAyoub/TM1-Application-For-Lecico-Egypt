import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './routes/login.jsx'
import WelcomePage from './routes/WelcomePage.jsx'
import LoadingAnimation from './component/LoadingAnimation.jsx'
import Tm1pytestcube from './routes/Tm1pytestcube.jsx'
import { BackendURL } from './config.js'

import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      let data = undefined;
      try {
        const response = await fetch(
          `${BackendURL}/api/v1/auth/checkauth`,
          {
            method: 'POST',
            credentials: 'include',
          }
        )

        data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail)
        }

        setIsAuthenticated(data.authenticated)
      } catch (error) {
        console.error('Authentication failed:', error)
        setIsAuthenticated(data.authenticated)
      } finally {
        if (data.authenticated === undefined) {
          setLoading(true)
        }
        else {        
          setLoading(false)
 }
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <LoadingAnimation />
  }

  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/tm1pytestcube" element={<Tm1pytestcube setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  )
}

export default App