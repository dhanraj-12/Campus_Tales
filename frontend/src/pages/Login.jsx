import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import AuthCard from '../components/AuthCard'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      setMessage('Login successful! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(err.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-md)',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 transition-colors"
      style={{ backgroundColor: 'var(--bg-primary)' }}
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

      {/* Back to home */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 text-sm font-medium transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        ← Back
      </button>

      <AuthCard title="Welcome back">
        {/* Error message */}
        {error && (
          <div
            className="p-3 rounded-lg mb-6 text-sm"
            style={{
              backgroundColor: 'var(--status-error-bg)',
              border: '1px solid var(--status-error-border)',
              color: 'var(--status-error-text)',
            }}
          >
            {error}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div
            className="p-3 rounded-lg mb-6 text-sm"
            style={{
              backgroundColor: 'var(--status-success-bg)',
              border: '1px solid var(--status-success-border)',
              color: 'var(--status-success-text)',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm transition-colors focus:outline-none"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm transition-colors focus:outline-none"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--text-on-accent)',
              borderRadius: 'var(--radius-md)',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent-hover)' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent)' }}
            disabled={loading}
            id="login-submit"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Footer link */}
          <div
            className="text-center text-sm pt-4 mt-4"
            style={{ borderTop: '1px solid var(--border-default)' }}
          >
            <span style={{ color: 'var(--text-tertiary)' }}>Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-medium transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Create account
            </button>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}

export default Login