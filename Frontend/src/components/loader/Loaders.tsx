
import React from 'react'

export const Loader: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f0f7ff]">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#dbeafe] flex items-center justify-center shadow-md">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 12h18" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 8v8" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 8v8" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-2xl text-[#2563eb] font-semibold" style={{ fontFamily: 'cursive' }}>UniMart</div>
        </div>

        <div className="relative flex items-end gap-4 mt-2">
          <div className="w-36 h-24 bg-white rounded-xl shadow-lg transform origin-bottom animate-float" style={{ animationDelay: '0s' }} />
          <div className="w-28 h-20 bg-white rounded-xl shadow-lg transform origin-bottom animate-float" style={{ animationDelay: '0.15s' }} />
          <div className="w-20 h-16 bg-white rounded-xl shadow-lg transform origin-bottom animate-float" style={{ animationDelay: '0.3s' }} />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="text-sm text-gray-600">Loading UniMart</div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#2563eb] rounded-full animate-pulse delay-0" />
            <span className="w-2 h-2 bg-[#2563eb] rounded-full animate-pulse delay-100" />
            <span className="w-2 h-2 bg-[#2563eb] rounded-full animate-pulse delay-200" />
          </div>
        </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-float { animation: float 2s ease-in-out infinite; }
        .animate-pulse { animation: pulseDot 1s infinite; opacity: 0.9 }
        @keyframes pulseDot { 0% { transform: translateY(0); opacity: 0.25 } 50% { transform: translateY(-6px); opacity: 1 } 100% { transform: translateY(0); opacity: 0.25 } }
        .delay-0 { animation-delay: 0s }
        .delay-100 { animation-delay: 0.12s }
        .delay-200 { animation-delay: 0.24s }
      `}</style>
      </div>
    </div>
  )
}

export default Loader
