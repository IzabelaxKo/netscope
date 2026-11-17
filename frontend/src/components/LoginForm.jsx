import { useState } from 'react'
import Cookies from 'js-cookie'
import { ShieldCheck } from 'lucide-react'
import './components.css'

const API_URL = 'http://127.0.0.1:5000'

export default function LoginForm({ onLoginSuccess }) {
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    const emailInput = form.elements.namedItem('email')
    const validationErrors = {}

    if (!email) {
      validationErrors.email = 'Enter your email address.'
    } else if (emailInput.validity.typeMismatch) {
      validationErrors.email = 'Enter a valid email address.'
    }

    if (!password) {
      validationErrors.password = 'Enter your password.'
    }

    setFieldErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/login_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      let userData
      try {
        userData = await response.json()
      } catch {
        throw new Error('The server returned an invalid response. Please try again.')
      }

      if (!response.ok) {
        const responseError = typeof userData?.error === 'string' ? userData.error : ''
        throw new Error(responseError || 'Unable to sign in. Please try again.')
      }

      if (
        typeof userData?.token !== 'string' ||
        !userData.token ||
        !userData.user ||
        typeof userData.user !== 'object'
      ) {
        throw new Error('The login response was incomplete. Please try again.')
      }

      Cookies.set('session_token', userData.token, { expires: 1, sameSite: 'lax' })
      onLoginSuccess?.(userData.user)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to sign in. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        <div className="login-icon" aria-hidden="true">
          <ShieldCheck size={27} />
        </div>

        <h2>Welcome back</h2>
        <p className="login-subtitle">Sign in to NetScope</p>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
          onChange={() => {
            setFieldErrors((current) => ({ ...current, email: '' }))
            setError('')
          }}
        />
        {fieldErrors.email && (
          <p className="login-field-error" id="login-email-error">
            {fieldErrors.email}
          </p>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
          onChange={() => {
            setFieldErrors((current) => ({ ...current, password: '' }))
            setError('')
          }}
        />
        {fieldErrors.password && (
          <p className="login-field-error" id="login-password-error">
            {fieldErrors.password}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
