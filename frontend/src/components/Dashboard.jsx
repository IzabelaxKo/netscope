import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import {
  RefreshCw,
  Users,
  Server,
  Activity,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import UsersTable from './admin/UsersTable.jsx'
import AssetsTable from './admin/AssetsTable.jsx'
import AuthRequestsTable from './admin/AuthRequestsTable.jsx'
import ScanRunsTable from './admin/ScanRunsTable.jsx'
import {
  UserModal,
  AssetModal,
  ConfirmDialog,
  ScanDetailsModal,
  RequestAuthModal,
} from './admin/Modals.jsx'

const API_BASE = 'http://127.0.0.1:5000'

const adminNavigation = [
  { label: 'Overview', target: 'overview' },
  { label: 'Assets', target: 'assets' },
  { label: 'Accounts', target: 'accounts' },
  { label: 'Requests', target: 'requests' },
  { label: 'Activity', target: 'activity' },
]

const userNavigation = [
  { label: 'Overview', target: 'overview' },
  { label: 'My assets', target: 'assets' },
  { label: 'Authorizations', target: 'requests' },
  { label: 'Scan activity', target: 'activity' },
]

export function DashboardPanel({ id, title, description, action, children, className = '' }) {
  return (
    <section className={`dashboard-panel ${className}`} id={id} aria-labelledby={`${id}-heading`}>
      <div className="dashboard-panel-heading">
        <div>
          <h2 id={`${id}-heading`}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action && <div className="dashboard-panel-header-actions">{action}</div>}
      </div>
      {children || <p className="dashboard-empty-state">Data will appear here when available.</p>}
    </section>
  )
}

export default function Dashboard({ isAdmin, currentUser }) {
  const navigation = isAdmin ? adminNavigation : userNavigation
  const [activeTab, setActiveTab] = useState('overview')

  // Logged-in user fallback state
  const [resolvedUser, setResolvedUser] = useState(null)
  const effectiveUser = currentUser || resolvedUser

  // Data State
  const [users, setUsers] = useState([])
  const [assets, setAssets] = useState([])
  const [authRequests, setAuthRequests] = useState([])
  const [scanRuns, setScanRuns] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  // Modals state
  const [userModal, setUserModal] = useState({ isOpen: false, isEdit: false, data: null })
  const [assetModal, setAssetModal] = useState({ isOpen: false, isEdit: false, data: null })
  const [requestAuthModal, setRequestAuthModal] = useState({ isOpen: false, preselectedAssetId: null })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null })
  const [scanModal, setScanModal] = useState({ isOpen: false, scan: null })

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type })
    setTimeout(() => {
      setAlert(null)
    }, 5000)
  }

  const getAuthHeaders = () => {
    const token = Cookies.get('session_token')?.trim()
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  // Ensure current user is resolved if not passed as prop
  useEffect(() => {
    if (currentUser) return

    const token = Cookies.get('session_token')?.trim()
    if (!token) return

    let isMounted = true
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.user) {
          setResolvedUser(data.user)
        }
      })
      .catch((err) => console.error('Failed to resolve current user:', err))

    return () => {
      isMounted = false
    }
  }, [currentUser])

  // Data Fetching for manual refreshes
  const loadData = useCallback(async () => {
    const uid = effectiveUser?.id
    if (!isAdmin && !uid) return

    setIsLoading(true)
    try {
      const headers = getAuthHeaders()

      if (isAdmin) {
        const [usersRes, assetsRes, reqsRes, scansRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, { headers }),
          fetch(`${API_BASE}/admin/assets`, { headers }),
          fetch(`${API_BASE}/admin/authorization_requests`, { headers }),
          fetch(`${API_BASE}/admin/scan_runs`, { headers }),
        ])

        if (usersRes.ok) setUsers(await usersRes.json())
        if (assetsRes.ok) setAssets(await assetsRes.json())
        if (reqsRes.ok) setAuthRequests(await reqsRes.json())
        if (scansRes.ok) setScanRuns(await scansRes.json())
      } else {
        // User Mode: fetch only user's assets, auth requests, and scan runs
        const [assetsRes, reqsRes, scansRes] = await Promise.all([
          fetch(`${API_BASE}/user/assets/${uid}`, { headers }),
          fetch(`${API_BASE}/user/authorization_requests/${uid}`, { headers }),
          fetch(`${API_BASE}/user/scan_runs/${uid}`, { headers }),
        ])

        if (assetsRes.ok) setAssets(await assetsRes.json())
        if (reqsRes.ok) setAuthRequests(await reqsRes.json())
        if (scansRes.ok) setScanRuns(await scansRes.json())
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      showAlert('Unable to connect to backend API server.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [isAdmin, effectiveUser])

  // Initial load
  useEffect(() => {
    const uid = (currentUser || resolvedUser)?.id
    if (!isAdmin && !uid) return

    let isMounted = true

    const fetchInitialData = async () => {
      try {
        const token = Cookies.get('session_token')?.trim()
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        if (isAdmin) {
          const [usersRes, assetsRes, reqsRes, scansRes] = await Promise.all([
            fetch(`${API_BASE}/admin/users`, { headers }),
            fetch(`${API_BASE}/admin/assets`, { headers }),
            fetch(`${API_BASE}/admin/authorization_requests`, { headers }),
            fetch(`${API_BASE}/admin/scan_runs`, { headers }),
          ])

          if (!isMounted) return
          if (usersRes.ok) setUsers(await usersRes.json())
          if (assetsRes.ok) setAssets(await assetsRes.json())
          if (reqsRes.ok) setAuthRequests(await reqsRes.json())
          if (scansRes.ok) setScanRuns(await scansRes.json())
        } else {
          const [assetsRes, reqsRes, scansRes] = await Promise.all([
            fetch(`${API_BASE}/user/assets/${uid}`, { headers }),
            fetch(`${API_BASE}/user/authorization_requests/${uid}`, { headers }),
            fetch(`${API_BASE}/user/scan_runs/${uid}`, { headers }),
          ])

          if (!isMounted) return
          if (assetsRes.ok) setAssets(await assetsRes.json())
          if (reqsRes.ok) setAuthRequests(await reqsRes.json())
          if (scansRes.ok) setScanRuns(await scansRes.json())
        }
      } catch (err) {
        console.error('Initial fetch failed:', err)
      }
    }

    fetchInitialData()

    return () => {
      isMounted = false
    }
  }, [isAdmin, currentUser, resolvedUser])

  // --- USER (ACCOUNT) ACTIONS (ADMIN ONLY) ---
  const handleSaveUser = async (formData) => {
    try {
      const headers = getAuthHeaders()
      if (userModal.isEdit && userModal.data) {
        const res = await fetch(`${API_BASE}/admin/user_edit/${userModal.data.id}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error('Failed to update user')
        showAlert(`User ${formData.email} updated successfully.`)
      } else {
        const res = await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error('Failed to create user')
        showAlert(`User ${formData.email} created successfully.`)
      }
      setUserModal({ isOpen: false, isEdit: false, data: null })
      loadData()
    } catch (err) {
      showAlert(err.message, 'error')
    }
  }

  const handleDeleteUser = (user) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Account',
      message: `Are you sure you want to permanently delete user "${user.email}" (ID #${user.id})? This cannot be undone.`,
      confirmText: 'Delete User',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/admin/users/${user.id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          })
          if (!res.ok) throw new Error('Failed to delete user')
          showAlert(`User "${user.email}" was deleted.`)
          setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })
          loadData()
        } catch (err) {
          showAlert(err.message, 'error')
        }
      },
    })
  }

  // --- ASSET ACTIONS ---
  const handleSaveAsset = async (formData) => {
    try {
      const headers = getAuthHeaders()
      const payload = {
        ...formData,
        user_id: isAdmin ? formData.user_id || effectiveUser?.id : effectiveUser?.id,
      }

      if (assetModal.isEdit && assetModal.data) {
        const url = isAdmin
          ? `${API_BASE}/admin/asset_edit/${assetModal.data.id}`
          : `${API_BASE}/user/asset_edit/${assetModal.data.id}`

        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to update asset')
        showAlert(`Asset "${formData.name}" updated successfully.`)
      } else {
        const url = isAdmin ? `${API_BASE}/assets` : `${API_BASE}/user/assets`
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to add asset')
        showAlert(
          formData.asset_type === 'private_page'
            ? `Asset "${formData.name}" created. Remember to submit physical ownership proof before running scans.`
            : `Asset "${formData.name}" registered successfully.`
        )
      }
      setAssetModal({ isOpen: false, isEdit: false, data: null })
      loadData()
    } catch (err) {
      showAlert(err.message, 'error')
    }
  }

  const handleDeleteAsset = (asset) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Asset',
      message: `Are you sure you want to delete asset "${asset.name}" (${asset.target})?`,
      confirmText: 'Delete Asset',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          const url = isAdmin
            ? `${API_BASE}/admin/assets/${asset.id}`
            : `${API_BASE}/user/assets/${asset.id}`

          const res = await fetch(url, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          })
          if (!res.ok) throw new Error('Failed to delete asset')
          showAlert(`Asset "${asset.name}" was deleted.`)
          setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })
          loadData()
        } catch (err) {
          showAlert(err.message, 'error')
        }
      },
    })
  }

  // --- AUTHORIZATION REQUEST ACTIONS ---
  const handleUpdateAuthRequest = async (request, status) => {
    try {
      const res = await fetch(`${API_BASE}/admin/authorization_requests/${request.id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error(`Failed to update request`)
      showAlert(
        status === 'accepted'
          ? `Authorization request #${request.id} accepted.`
          : `Authorization request #${request.id} rejected and removed.`
      )
      loadData()
    } catch (err) {
      showAlert(err.message, 'error')
    }
  }

  // User: Submit new authorization request
  const handleCreateAuthRequest = async (authData) => {
    try {
      const res = await fetch(`${API_BASE}/user/authorization_requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(authData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to submit authorization request')
      }
      showAlert('Physical ownership proof submitted! An administrator will review your request.')
      setRequestAuthModal({ isOpen: false, preselectedAssetId: null })
      loadData()
    } catch (err) {
      showAlert(err.message, 'error')
    }
  }

  // User: Cancel authorization request
  const handleDeleteAuthRequest = (request) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Cancel Authorization Request',
      message: `Are you sure you want to cancel the authorization request for Asset #${request.asset_id}?`,
      confirmText: 'Cancel Request',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/user/authorization_requests/${request.id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          })
          if (!res.ok) throw new Error('Failed to cancel authorization request')
          showAlert('Authorization request was cancelled.')
          setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })
          loadData()
        } catch (err) {
          showAlert(err.message, 'error')
        }
      },
    })
  }

  // --- SCAN RUN ACTIONS ---
  const handleRunScan = async (asset) => {
    if (!asset) return

    // If it's a private page, verify physical ownership authorization
    if (asset.asset_type === 'private_page') {
      const isAuthorized = authRequests.some(
        (r) => r.asset_id === asset.id && r.status === 'accepted'
      )
      if (!isAuthorized) {
        showAlert(
          `Asset "${asset.name}" is a private page and requires proof of physical possession before scanning.`,
          'error'
        )
        setRequestAuthModal({ isOpen: true, preselectedAssetId: asset.id })
        return
      }
    }

    try {
      const res = await fetch(`${API_BASE}/user/scan_runs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          asset_id: asset.id,
          user_id: effectiveUser?.id,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to execute scan run')
      }

      showAlert(`Security scan completed for asset "${asset.name}".`)
      loadData()
    } catch (err) {
      showAlert(err.message, 'error')
    }
  }

  // Dynamic Stat Cards
  const adminStats = [
    { label: 'Registered Accounts', value: users.length, note: `${users.filter((u) => u.role === 'admin').length} admin accounts`, icon: Users, tone: 'info' },
    { label: 'Monitored Assets', value: assets.length, note: 'Network nodes and services', icon: Server, tone: 'info' },
    { label: 'Pending Authorizations', value: authRequests.filter((r) => r.status === 'pending').length, note: 'Awaiting administrator review', icon: FileCheck, tone: 'warning' },
    { label: 'Total Scan Runs', value: scanRuns.length, note: `${scanRuns.filter((s) => s.status === 'completed').length} completed scans`, icon: Activity, tone: 'info' },
  ]

  const userStats = [
    { label: 'My Monitored Assets', value: assets.length, note: 'Targets added to your account', icon: Server, tone: 'info' },
    { label: 'Verified Authorizations', value: authRequests.filter((r) => r.status === 'accepted').length, note: 'Private pages approved for scanning', icon: ShieldCheck, tone: 'success' },
    { label: 'Pending Requests', value: authRequests.filter((r) => r.status === 'pending').length, note: 'Proof under administrative review', icon: FileCheck, tone: 'warning' },
    { label: 'Completed Scans', value: scanRuns.length, note: 'Historical security scans performed', icon: Activity, tone: 'success' },
  ]

  return (
    <div className={`dashboard-shell ${isAdmin ? 'dashboard-shell-admin' : 'dashboard-shell-user'}`}>
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-label">Workspace</div>
        <div className="dashboard-role">
          <span className="dashboard-role-indicator" />
          {isAdmin ? 'Administrator' : 'User'}
        </div>
        <nav className="dashboard-navigation" aria-label="Dashboard sections">
          {navigation.map((item) => (
            <button
              className={`dashboard-nav-link ${activeTab === item.target ? 'is-active' : ''}`}
              type="button"
              style={{
                textAlign: 'left',
                background: activeTab === item.target ? 'var(--blue-muted)' : 'transparent',
                border: 'none',
                width: '100%',
              }}
              onClick={() => setActiveTab(item.target)}
              key={item.target}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-content" id="overview">
        <header
          className="dashboard-page-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}
        >
          <div>
            <p className="dashboard-eyebrow">NetScope / {isAdmin ? 'Administration' : 'User Workspace'}</p>
            <h1>{isAdmin ? 'Admin Dashboard' : 'User Dashboard'}</h1>
            <p className="dashboard-description">
              {isAdmin
                ? 'Manage accounts, monitor network assets, review authorizations, and inspect scan runs.'
                : `Welcome${effectiveUser?.email ? `, ${effectiveUser.email}` : ''}. Manage your monitored network assets, submit ownership verification, and initiate security scans.`}
            </p>
          </div>
          <div className="dashboard-actions-bar">
            <button
              className="dashboard-refresh-btn"
              type="button"
              onClick={loadData}
              disabled={isLoading}
              title="Refresh dashboard data"
            >
              <RefreshCw size={14} className={isLoading ? 'is-spinning' : ''} />
              {isLoading ? 'Syncing...' : 'Refresh'}
            </button>
          </div>
        </header>

        {alert && (
          <div
            className={`dashboard-alert ${alert.type === 'error' ? 'dashboard-alert-error' : 'dashboard-alert-success'}`}
            role="status"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {alert.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{alert.message}</span>
            </div>
            <button type="button" onClick={() => setAlert(null)} aria-label="Dismiss alert">
              &times;
            </button>
          </div>
        )}

        {/* STATS SECTION */}
        <section className="dashboard-stat-grid" aria-label="Summary">
          {(isAdmin ? adminStats : userStats).map((item) => (
            <article className="dashboard-stat-card" key={item.label}>
              <div className="dashboard-stat-heading">
                <h2>{item.label}</h2>
                <span className={`dashboard-stat-icon dashboard-stat-icon-${item.tone}`} aria-hidden="true">
                  <item.icon size={18} />
                </span>
              </div>
              <p className="dashboard-stat-value">{isLoading ? '...' : item.value}</p>
              <p className="dashboard-stat-note">{item.note}</p>
            </article>
          ))}
        </section>

        {/* MAIN CONTENT SECTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Assets Section (Both Admin and User) */}
          {(activeTab === 'overview' || activeTab === 'assets') && (
            <DashboardPanel
              id="assets"
              title={isAdmin ? 'Monitored Assets' : 'My Monitored Assets'}
              description={
                isAdmin
                  ? 'All network targets, servers, and devices monitored across NetScope.'
                  : 'Manage your assets and web pages. Private pages require proof of physical possession before scanning.'
              }
              className="dashboard-panel-full"
            >
              <AssetsTable
                assets={assets}
                users={isAdmin ? users : (effectiveUser ? [effectiveUser] : [])}
                authRequests={authRequests}
                isAdmin={isAdmin}
                onAdd={() => setAssetModal({ isOpen: true, isEdit: false, data: null })}
                onEdit={(asset) => setAssetModal({ isOpen: true, isEdit: true, data: asset })}
                onDelete={handleDeleteAsset}
                onRunScan={!isAdmin ? handleRunScan : undefined}
                onRequestAuth={!isAdmin ? (asset) => setRequestAuthModal({ isOpen: true, preselectedAssetId: asset.id }) : undefined}
              />
            </DashboardPanel>
          )}

          {/* Accounts Section (Admin Only) */}
          {isAdmin && (activeTab === 'overview' || activeTab === 'accounts') && (
            <DashboardPanel
              id="accounts"
              title="User Accounts"
              description="Manage registered user credentials, roles, and permissions."
              className="dashboard-panel-full"
            >
              <UsersTable
                users={users}
                onAdd={() => setUserModal({ isOpen: true, isEdit: false, data: null })}
                onEdit={(user) => setUserModal({ isOpen: true, isEdit: true, data: user })}
                onDelete={handleDeleteUser}
              />
            </DashboardPanel>
          )}

          {/* Authorization Requests Section */}
          {(activeTab === 'overview' || activeTab === 'requests') && (
            <DashboardPanel
              id="requests"
              title={isAdmin ? 'Authorization Requests' : 'Ownership Authorizations'}
              description={
                isAdmin
                  ? 'Pending verification documents for scanning approval.'
                  : 'Proof of physical ownership submitted for private page scanning permissions.'
              }
              className="dashboard-panel-full"
            >
              <AuthRequestsTable
                requests={authRequests}
                assets={assets}
                isAdmin={isAdmin}
                onAccept={(req) => handleUpdateAuthRequest(req, 'accepted')}
                onReject={(req) => handleUpdateAuthRequest(req, 'rejected')}
                onDelete={handleDeleteAuthRequest}
                onRequestAuth={!isAdmin ? () => setRequestAuthModal({ isOpen: true, preselectedAssetId: null }) : undefined}
              />
            </DashboardPanel>
          )}

          {/* Scan Runs / Activity Section */}
          {(activeTab === 'overview' || activeTab === 'activity') && (
            <DashboardPanel
              id="activity"
              title={isAdmin ? 'Network Activity & Scan Runs' : 'My Security Scan Runs'}
              description={
                isAdmin
                  ? 'History of automated network security and vulnerability scans.'
                  : 'Historical audit results of security scans executed against your assets.'
              }
              className="dashboard-panel-full"
            >
              <ScanRunsTable
                scanRuns={scanRuns}
                assets={assets}
                isAdmin={isAdmin}
                onViewDetails={(scan) => setScanModal({ isOpen: true, scan })}
                onNewScan={!isAdmin ? () => setActiveTab('assets') : undefined}
              />
            </DashboardPanel>
          )}
        </div>
      </main>

      {/* DIALOGS & MODALS */}
      {isAdmin && (
        <UserModal
          isOpen={userModal.isOpen}
          isEdit={userModal.isEdit}
          initialData={userModal.data}
          onClose={() => setUserModal({ isOpen: false, isEdit: false, data: null })}
          onSave={handleSaveUser}
        />
      )}

      <AssetModal
        isOpen={assetModal.isOpen}
        isEdit={assetModal.isEdit}
        initialData={assetModal.data}
        users={isAdmin ? users : (effectiveUser ? [effectiveUser] : [])}
        showUserSelect={isAdmin}
        onClose={() => setAssetModal({ isOpen: false, isEdit: false, data: null })}
        onSave={handleSaveAsset}
      />

      <RequestAuthModal
        isOpen={requestAuthModal.isOpen}
        assets={assets}
        preselectedAssetId={requestAuthModal.preselectedAssetId}
        onClose={() => setRequestAuthModal({ isOpen: false, preselectedAssetId: null })}
        onSave={handleCreateAuthRequest}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmVariant={confirmDialog.confirmVariant}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })}
      />

      <ScanDetailsModal
        isOpen={scanModal.isOpen}
        scan={scanModal.scan}
        onClose={() => setScanModal({ isOpen: false, scan: null })}
      />
    </div>
  )
}
