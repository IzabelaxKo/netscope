import { useState } from 'react'
import { X } from 'lucide-react'

export function UserModal({ isOpen, onClose, onSave, initialData, isEdit }) {
  const [email, setEmail] = useState(initialData?.email || '')
  const [role, setRole] = useState(initialData?.role || 'user')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!isEdit && !password.trim()) {
      setError('Password is required')
      return
    }
    setError('')
    onSave({
      email: email.trim(),
      role,
      ...(password ? { password } : {}),
    })
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit User' : 'Add New User'}</h3>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <p className="dashboard-alert dashboard-alert-error">{error}</p>}
          <div className="modal-form-group">
            <label htmlFor="user-email">Email Address</label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="user-role">Role</label>
            <select
              id="user-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          {!isEdit && (
            <div className="modal-form-group">
              <label htmlFor="user-password">Initial Password</label>
              <input
                id="user-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          )}
          <div className="modal-actions">
            <button className="action-btn action-btn-outline" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="action-btn action-btn-primary" type="submit">
              {isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AssetModal({ isOpen, onClose, onSave, initialData, users = [], isEdit, showUserSelect = true }) {
  const [name, setName] = useState(initialData?.name || '')
  const [target, setTarget] = useState(initialData?.target || '')
  const [assetType, setAssetType] = useState(initialData?.asset_type || 'server')
  const [userId, setUserId] = useState(initialData?.user_id || users[0]?.id || '')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !target.trim()) {
      setError('Asset name and target are required')
      return
    }
    setError('')
    onSave({
      name: name.trim(),
      target: target.trim(),
      asset_type: assetType,
      ...(!isEdit && showUserSelect && userId ? { user_id: Number(userId) } : {}),
    })
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Asset' : 'Add New Asset'}</h3>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <p className="dashboard-alert dashboard-alert-error">{error}</p>}
          <div className="modal-form-group">
            <label htmlFor="asset-name">Asset Name</label>
            <input
              id="asset-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Internal Portal or Primary Web Gateway"
              required
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="asset-target">Target (IP / Host / URL)</label>
            <input
              id="asset-target"
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 192.168.1.100 or https://internal.company.com"
              required
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="asset-type">Asset Type</label>
            <select
              id="asset-type"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option value="server">Server</option>
              <option value="workstation">Workstation</option>
              <option value="domain">Domain / Web App</option>
              <option value="network_device">Router / Firewall</option>
              <option value="cloud_instance">Cloud Instance</option>
              <option value="private_page">Private Page (Requires Physical Proof)</option>
            </select>
            {assetType === 'private_page' && (
              <span style={{ fontSize: '0.74rem', color: 'var(--yellow)', marginTop: '2px' }}>
                🔒 Private pages require submission of physical possession/ownership proof before scans are authorized.
              </span>
            )}
          </div>
          {!isEdit && showUserSelect && users.length > 0 && (
            <div className="modal-form-group">
              <label htmlFor="asset-user">Assigned Owner (User)</label>
              <select
                id="asset-user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email} (ID: {u.id})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="modal-actions">
            <button className="action-btn action-btn-outline" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="action-btn action-btn-primary" type="submit">
              {isEdit ? 'Save Changes' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function RequestAuthModal({ isOpen, onClose, onSave, assets = [], preselectedAssetId }) {
  const [assetId, setAssetId] = useState(preselectedAssetId || (assets.length > 0 ? assets[0].id : ''))
  const [documentPath, setDocumentPath] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('30')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const targetAssetId = assetId || (assets.length > 0 ? assets[0].id : '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!targetAssetId) {
      setError('Please select an asset to authorize')
      return
    }
    if (!documentPath.trim()) {
      setError('Proof of physical possession/ownership document path is required')
      return
    }
    setError('')
    onSave({
      asset_id: Number(targetAssetId),
      document_path: documentPath.trim(),
      expires_in_days: Number(expiresInDays),
    })
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Request Scan Authorization</h3>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <p style={{ margin: '0 0 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
          Scanning a private page or restricted system requires proof that you physically possess or own this infrastructure (e.g. hardware photo, server lease invoice, or physical site access proof).
        </p>
        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <p className="dashboard-alert dashboard-alert-error">{error}</p>}
          <div className="modal-form-group">
            <label htmlFor="auth-asset">Target Private Asset</label>
            <select
              id="auth-asset"
              value={targetAssetId}
              onChange={(e) => setAssetId(e.target.value)}
              required
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.target}) {a.asset_type === 'private_page' ? '🔒 [Private Page]' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-form-group">
            <label htmlFor="auth-document">Proof Document Reference / Path</label>
            <input
              id="auth-document"
              type="text"
              value={documentPath}
              onChange={(e) => setDocumentPath(e.target.value)}
              placeholder="e.g. /docs/ownership_proof_physical_hardware.pdf"
              required
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Provide the file path or document verifying physical ownership of this private target.
            </span>
          </div>
          <div className="modal-form-group">
            <label htmlFor="auth-validity">Requested Authorization Period</label>
            <select
              id="auth-validity"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
            >
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
              <option value="365">1 Year</option>
            </select>
          </div>
          <div className="modal-actions">
            <button className="action-btn action-btn-outline" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="action-btn action-btn-primary" type="submit">
              Submit Proof for Authorization
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ConfirmDialog({ isOpen, title, message, confirmText = 'Confirm', confirmVariant = 'danger', onConfirm, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {message}
        </p>
        <div className="modal-actions">
          <button className="action-btn action-btn-outline" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`action-btn ${confirmVariant === 'danger' ? 'action-btn-danger' : 'action-btn-success'}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ScanDetailsModal({ isOpen, onClose, scan }) {
  if (!isOpen || !scan) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content modal-content-wide">
        <div className="modal-header">
          <h3>Scan Run #{scan.id} Details</h3>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Status: </span>
            <span className={`badge ${scan.status === 'completed' ? 'badge-green' : scan.status === 'failed' ? 'badge-red' : 'badge-yellow'}`}>
              {scan.status}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Asset ID: </span>
            <span className="table-cell-mono">#{scan.asset_id}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>User ID: </span>
            <span className="table-cell-mono">#{scan.user_id}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Created: </span>
            <span style={{ color: 'var(--text-secondary)' }}>{scan.created_at || 'N/A'}</span>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Results Output (JSON)
          </label>
          <pre className="json-pre-viewer">
            {scan.results_json ? JSON.stringify(scan.results_json, null, 2) : 'No results recorded yet.'}
          </pre>
        </div>
        <div className="modal-actions" style={{ marginTop: '16px' }}>
          <button className="action-btn action-btn-outline" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
