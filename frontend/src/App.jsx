import { useEffect, useState } from 'react'
import './App.css'
import Cookies from 'js-cookie'
import { X, Shield } from 'lucide-react'
import LoginForm from './components/LoginForm.jsx'
import RegisterForm from './components/RegisterForm.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import LandingPage from './pages/LandingPage.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [isCheckingSession, setIsCheckingSession] = useState(
    () => Boolean(Cookies.get('session_token')?.trim()),
  )
  const [authError, setAuthError] = useState('')
  const [authModal, setAuthModal] = useState(null) // null | 'login' | 'register'

  useEffect(() => {
    const token = Cookies.get('session_token')?.trim()
    if (!token) return

    let isMounted = true

    const loadCurrentUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          Cookies.remove('session_token')
          return
        }

        if (!response.ok) {
          throw new Error('Unable to verify your session. Please try again.')
        }

        const data = await response.json()
        if (!data.user || !['admin', 'user'].includes(data.user.role)) {
          throw new Error('Your account has an unsupported role.')
        }

        if (isMounted) setUser(data.user)
      } catch (error) {
        if (isMounted) {
          setAuthError(error.message || 'Unable to verify your session.')
        }
      } finally {
        if (isMounted) setIsCheckingSession(false)
      }
    }

    loadCurrentUser()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove('session_token')
    setUser(null)
    setAuthError('')
    setAuthModal(null)
  }

  const handleLoginSuccess = (loggedInUser) => {
    if (!loggedInUser || !['admin', 'user'].includes(loggedInUser.role)) {
      setAuthError('Your account has an unsupported role.')
      return
    }

    setAuthError('')
    setUser(loggedInUser)
    setAuthModal(null)
  }

  return (
    <main className="app-shell">
      {user && (
        <header className="topbar">
          <a className="brand" href="/" aria-label="NetScope home">
            <div className="topbar-brand-icon">
              <Shield size={18} />
            </div>
            <span>NETSCOPE</span>
          </a>
          <button className="signout-button" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </header>
      )}

      {isCheckingSession ? (
        <div className="logged-in-message" role="status">
          <p>Checking your session...</p>
        </div>
      ) : authError ? (
        <div className="logged-in-message" role="alert">
          <p>{authError}</p>
          <button className="signout-button" type="button" onClick={handleLogout}>
            Sign out and return to home
          </button>
        </div>
      ) : user?.role === 'admin' ? (
        <AdminDashboard currentUser={user} />
      ) : user?.role === 'user' ? (
        <UserDashboard currentUser={user} />
      ) : (
        <>
          <LandingPage
            onOpenLogin={() => setAuthModal('login')}
            onOpenRegister={() => setAuthModal('register')}
          />

          {authModal && (
            <div
              className="modal-overlay"
              role="dialog"
              aria-modal="true"
              onClick={() => setAuthModal(null)}
            >
              <div
                className="auth-modal-wrapper"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="auth-modal-close"
                  type="button"
                  onClick={() => setAuthModal(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>

                {authModal === 'login' ? (
                  <>
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                    <p className="switch-form">
                      Don&apos;t have an account?{' '}
                      <button
                        className="switch-form-button"
                        type="button"
                        onClick={() => setAuthModal('register')}
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <RegisterForm />
                    <p className="switch-form">
                      Already have an account?{' '}
                      <button
                        className="switch-form-button"
                        type="button"
                        onClick={() => setAuthModal('login')}
                      >
                        Sign in
                      </button>
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default App
