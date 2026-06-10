import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BackendURL } from '../config.js'

export default function LogoutButton({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const logout = async () => {
    try {
      const response = await fetch(
        `${BackendURL}/api/v1/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      setIsAuthenticated(false)
      navigate("/")
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <button
      onClick={logout}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-300 shadow-sm text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
      aria-label="Logout"
      title="Logout"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  )
}