import React from 'react'
import LogoutButton from '../component/LogoutButton.jsx'
import { useNavigate } from 'react-router-dom'
import Logo from '../images/companylogo.png'
import { getFromLocalStorage } from '../helper/localstoragehelper.js'

export default function WelcomePage({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const username = getFromLocalStorage('username')

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .welcome-header { animation: fadeDown 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .welcome-card   { animation: fadeUp  0.5s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .cta-btn {
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .cta-btn:hover {
          background-color: #1d4ed8 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35) !important;
        }
        .cta-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="relative min-h-screen bg-slate-50 overflow-hidden">

        {/* Grid Background */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `
            linear-gradient(to right, rgb(226 232 240 / 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(226 232 240 / 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Header */}
        <header className="welcome-header relative z-20 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-10 w-auto object-contain" />
            <span className="text-base font-semibold text-slate-800">TM1 Data Entry Demo</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Username pill */}
            {username && (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-slate-400">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-sm text-slate-600 font-medium">{username}</span>
              </div>
            )}
            <LogoutButton setIsAuthenticated={setIsAuthenticated} />
          </div>
        </header>

        {/* Main */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-72px)]">
          <div className="welcome-card w-full max-w-lg mx-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12"/>
                  <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-3">Welcome back</h1>

              <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-sm mx-auto">
                Access your TM1 cube data entry tools and manage planning data efficiently.
              </p>

              <button
                onClick={() => navigate('/tm1pytestcube')}
                className="cta-btn inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
                Open TM1py Cube Demo
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}