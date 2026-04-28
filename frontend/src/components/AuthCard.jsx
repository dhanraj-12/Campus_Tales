import React from 'react'

const AuthCard = ({ title, children }) => {
  return (
    <div
      className="w-full max-w-md rounded-xl p-8 sm:p-10 transition-all animate-fade-in"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Title */}
      <h2
        className="text-2xl font-bold text-center mb-8"
        style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
      >
        {title}
      </h2>
      
      {/* Children */}
      <div>{children}</div>
    </div>
  )
}

export default AuthCard