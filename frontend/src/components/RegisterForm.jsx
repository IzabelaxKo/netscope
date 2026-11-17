import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import './components.css'

const API_URL = 'http://127.0.0.1:5000'

export default function RegisterForm() {
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const clearFieldFeedback = (fieldName) => {
    const fieldsToClear = fieldName === 'password'
      ? ['password', 'confirmPassword']
      : [fieldName]

    if (fieldsToClear.some((field) => fieldErrors[field])) {
      setFieldErrors((current) => {
        const updatedErrors = { ...current }
        fieldsToClear.forEach((field) => delete updatedErrors[field])
        return updatedErrors
      })
    }

    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    const confirmPassword = String(formData.get('confirmPassword') || '')
    const emailInput = form.elements.namedItem('email')
    const validationErrors = {}

    if (!email) {
      validationErrors.email = 'Enter your email address.'
    } else if (emailInput.validity.typeMismatch) {
      validationErrors.email = 'Enter a valid email address.'
    }

    if (!password) {
      validationErrors.password = 'Enter a password.'
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Confirm your password.'
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.'
    }

    setFieldErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/users`, {
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
        throw new Error(
          response.ok
            ? 'The server returned an invalid response. Please try again.'
            : 'Unable to create your account. Please try again.',
        )
      }

      if (!response.ok) {
        const responseError = typeof userData?.error === 'string' ? userData.error : ''
        throw new Error(responseError || 'Unable to create your account. Please try again.')
      }

      if (!userData || typeof userData !== 'object' || typeof userData.email !== 'string') {
        throw new Error('The server returned an invalid response. Please try again.')
      }

      form.reset()
      setFieldErrors({})
      setSuccess('Account created successfully. You can now sign in.')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to create your account. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        <div className="register-icon" aria-hidden="true">
          <ShieldCheck size={27} />
        </div>
        <h2>Create an account</h2>
        <p className="register-subtitle">Sign up to NetScope</p>

        {error && (
          <p className="register-error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="register-success" role="status">
            {success}
          </p>
        )}

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
          onChange={(event) => clearFieldFeedback(event.currentTarget.name)}
        />
        {fieldErrors.email && (
          <p className="register-field-error" id="register-email-error">
            {fieldErrors.email}
          </p>
        )}

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
          onChange={(event) => clearFieldFeedback(event.currentTarget.name)}
        />
        {fieldErrors.password && (
          <p className="register-field-error" id="register-password-error">
            {fieldErrors.password}
          </p>
        )}

        <label htmlFor="register-confirm-password">Confirm Password</label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={
            fieldErrors.confirmPassword ? 'register-confirm-password-error' : undefined
          }
          onChange={(event) => clearFieldFeedback(event.currentTarget.name)}
        />
        {fieldErrors.confirmPassword && (
          <p className="register-field-error" id="register-confirm-password-error">
            {fieldErrors.confirmPassword}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
