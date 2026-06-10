import React from 'react'

export default function LoadingAnimation() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-slate-50">
      
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(226 232 240 / 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(226 232 240 / 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="flex gap-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 animate-bounce shadow-[0_0_20px_rgba(37,99,235,0.5)]" />

          <div
            className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 animate-bounce shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            style={{ animationDelay: '0.15s' }}
          />

          <div
            className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 animate-bounce shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            style={{ animationDelay: '0.3s' }}
          />
        </div>

        <h1 className="mt-8 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          TM1 Data Entry
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Connecting to TM1...
        </p>
      </div>
    </div>
  )
}