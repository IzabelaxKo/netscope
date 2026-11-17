import Dashboard from '../components/Dashboard.jsx'

export default function AdminDashboard({ currentUser }) {
  return <Dashboard isAdmin currentUser={currentUser} />
}