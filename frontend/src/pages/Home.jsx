import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)

const Home = () => {
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // If already logged in, redirect
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const user = JSON.parse(atob(token.split('.')[1]))
        navigate(user?.role === 'admin' ? '/admin-dashboard' : '/dashboard')
      } catch {}
    }
  }, [navigate])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 transition-colors"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Theme toggle */}
      <button
        onClick={() => {
          const next = !dark
          setDark(next)
          localStorage.setItem('theme', next ? 'dark' : 'light')
        }}
        className="fixed top-6 right-6 p-2 rounded-md transition-colors"
        style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
        aria-label="Toggle theme"
        id="home-theme-toggle"
      >
        {dark ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>

      {/* Content */}
      <main className="text-center max-w-2xl animate-fade-in">
        {/* Brand mark */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 text-2xl font-bold"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          CT
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          Share your campus
          <br />
          journey.
        </h1>

        <p
          className="text-lg mb-12 max-w-lg mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Discover interview experiences, preparation tips, and career insights from students just like you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--text-on-accent)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            id="cta-register"
          >
            Get Started
            <IconArrowRight />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-muted)'
              e.currentTarget.style.borderColor = 'var(--border-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-default)'
            }}
            id="cta-login"
          >
            Sign In
          </button>
        </div>
      </main>

      {/* Footer */}
      <p
        className="absolute bottom-6 text-xs"
        style={{ color: 'var(--text-tertiary)' }}
      >
        © {new Date().getFullYear()} CampusTales
      </p>
    </div>
  )
}

export default Home