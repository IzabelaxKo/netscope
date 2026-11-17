import Dashboard from '../components/Dashboard.jsx'

export default function UserDashboard({ currentUser }) {
  return <Dashboard isAdmin={false} currentUser={currentUser} />
}