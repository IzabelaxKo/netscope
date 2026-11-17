import { useState } from 'react'
import { Check, X, Search, FileText, Plus, Trash2 } from 'lucide-react'

export default function AuthRequestsTable({
  requests = [],
  assets = [],
  isAdmin = true,
  onAccept,
  onReject,
  onDelete,
  onRequestAuth,
}) {
  const [search, setSearch] = useState('')

  const getAssetName = (assetId) => {
    const asset = assets.find((a) => a.id === assetId)
    return asset ? `${asset.name} (#${assetId})` : `Asset #${assetId}`
  }

  const filteredRequests = requests.filter((r) =>
    r.document_path.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase()) ||
    String(r.id).includes(search) ||
    String(r.asset_id).includes(search)
  )

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            className="dashboard-search-input"
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {pendingCount} pending review
          </span>
          {!isAdmin && onRequestAuth && (
            <button className="action-btn action-btn-primary" type="button" onClick={onRequestAuth}>
              <Plus size={15} /> Request Authorization
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Target Asset</th>
              <th>Physical Proof Document</th>
              <th>Status</th>
              <th>Expires At</th>
              <th style={{ textAlign: 'right', width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="dashboard-empty-state">
                  {requests.length === 0
                    ? !isAdmin
                      ? 'No authorization requests submitted. Create one to scan private assets.'
                      : 'No authorization requests found.'
                    : 'No requests matching search.'}
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td className="table-cell-mono">#{req.id}</td>
                  <td style={{ fontWeight: 500 }}>{getAssetName(req.asset_id)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={14} style={{ color: 'var(--text-muted)' }} />
                      <span className="table-cell-mono" style={{ fontSize: '0.78rem' }}>{req.document_path}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${req.status === 'accepted' ? 'badge-green' : 'badge-yellow'}`}>
                      {req.status === 'accepted' ? 'Authorized' : 'Pending Admin Review'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {req.expires_at || 'Never'}
                  </td>
                  <td>
                    <div className="table-cell-actions" style={{ justifyContent: 'flex-end' }}>
                      {isAdmin ? (
                        req.status === 'pending' ? (
                          <>
                            <button
                              className="action-btn action-btn-success"
                              type="button"
                              onClick={() => onAccept(req)}
                              title="Accept Authorization Request"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              className="action-btn action-btn-danger"
                              type="button"
                              onClick={() => onReject(req)}
                              title="Reject & Delete Authorization Request"
                            >
                              <X size={14} /> Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ color: 'var(--green)', fontSize: '0.78rem', fontWeight: 600 }}>
                            Accepted
                          </span>
                        )
                      ) : (
                        // User actions
                        req.status === 'pending' ? (
                          <button
                            className="action-btn action-btn-danger"
                            type="button"
                            onClick={() => onDelete && onDelete(req)}
                            title="Cancel and remove request"
                          >
                            <Trash2 size={13} /> Cancel
                          </button>
                        ) : (
                          <span style={{ color: 'var(--green)', fontSize: '0.78rem', fontWeight: 600 }}>
                            Approved
                          </span>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
