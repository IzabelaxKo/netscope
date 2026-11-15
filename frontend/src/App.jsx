import './App.css'
import LoginForm from './components/LoginForm.jsx'
// import RegisterForm from './components/RegisterForm.jsx'

function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="NetScope home">
          <span>NETSCOPE</span>
        </a>
      </header>
      <LoginForm/>
      {/* <RegisterForm /> */}
    </main>
  )
}

export default App
