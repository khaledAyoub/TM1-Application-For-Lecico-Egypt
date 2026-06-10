import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomeButton() {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  return (
    <button
      onClick={goHome}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-300 shadow-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition"
      aria-label="Go Home"
      title="Home"
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
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}