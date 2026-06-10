import React, { useState } from 'react'
import { BackendURL } from '../config.js'
import Logo from '../images/companylogo.png'
import LoadingAnimation from '../component/LoadingAnimation.jsx'
import {addToLocalStorage} from '../helper/localstoragehelper.js'

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const loginUser = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BackendURL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail)

        if (!data.authenticated){
          setError("Invalid username or password")
          setLoading(false)
          return
        }

      addToLocalStorage('username', username)
        setTimeout(() => {
          setIsAuthenticated(true)
        }, 1000)
    } catch (err) {
      setError(err.message)
    } 
  }

  return (
  loading ? <LoadingAnimation /> : (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .login-card {
          animation: fadeInDown 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .login-field {
          animation: fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .login-field:nth-child(1) { animation-delay: 0.1s; }
        .login-field:nth-child(2) { animation-delay: 0.18s; }
        .login-field:nth-child(3) { animation-delay: 0.26s; }
        .login-btn {
          animation: fadeInUp 0.4s 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
          transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
        }
        .login-btn:hover:not(:disabled) {
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) {
          transform: scale(0.98) translateY(0);
        }
        .error-shake {
          animation: shake 0.4s ease;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
      `}</style>

      <div className="relative flex items-center justify-center min-h-screen bg-slate-50 overflow-hidden">

        {/* Grid background */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `
            linear-gradient(to right, rgb(226 232 240 / 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(226 232 240 / 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        <div className="relative z-10 w-full max-w-xl mx-4">
          <div className="login-card bg-white rounded-2xl shadow-xl border border-slate-200 p-12">

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={Logo} alt="Company Logo" className="h-32 object-contain" />
            </div>

            <h1 className="text-3xl font-bold text-center text-slate-800">Welcome Back</h1>
            <p className="text-center text-slate-500 mt-2 mb-8">Sign in to continue</p>

            {/* Error */}
            {error && (
              <div key={error} className="error-shake mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Fields */}
            <div className="login-field">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 mb-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loginUser()}
              />
            </div>
            <div className="login-field">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 mb-6 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loginUser()}
              />
            </div>

            {/* Button */}
            <div className="login-field">
              <button
                onClick={loginUser}
                disabled={loading}
                className="login-btn w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
  )
}
