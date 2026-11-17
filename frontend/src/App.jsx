import './App.css'
import LoginForm from './components/LoginForm.jsx'
import { useState } from 'react';
import Cookies from 'js-cookie'
import RegisterForm from './components/RegisterForm.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(Cookies.get('session_token')?.trim()));
  const [logOrReg, setLogOrReg] = useState('login'); // 'login' or 'register'

  const handleLogout = () => {
    Cookies.remove('session_token');
    setIsLoggedIn(false);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="NetScope home">
          <span>NETSCOPE</span>
        </a>
        {isLoggedIn && (
          <button className="signout-button" type="button" onClick={handleLogout}>
            Sign out
          </button>
        )}
      </header>
      {isLoggedIn ? (
        <div className="logged-in-message">
          <h2>Welcome to NetScope!</h2>
          <p>You are logged in.</p>
          <button className="signout-button" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      ) : (
        <div className="auth-container">
          {logOrReg === 'login' ? (
            <>
              <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
              <p className="switch-form">
                Don't have an account?{' '}
                <button
                  className="switch-form-button"
                  type="button"
                  onClick={() => setLogOrReg('register')}
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
                  onClick={() => setLogOrReg('login')}
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      )}
    </main>
  )
}

export default App
