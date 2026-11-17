import { useState } from 'react'
import { Edit2, Trash2, Plus, Search, Play, ShieldAlert, ShieldCheck } from 'lucide-react'

export default function AssetsTable({
  assets = [],
  users = [],
  authRequests = [],
  isAdmin = true,
  onEdit,
  onDelete,
  onAdd,
  onRunScan,
  onRequestAuth,
}) {
  const [search, setSearch] = useState('')

  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.email : `User #${userId}`
  }

  const getAssetAuthStatus = (assetId) => {
    const req = authRequests.find((r) => r.asset_id === assetId)
    if (!req) return { status: 'none', label: 'Unverified Proof' }
    if (req.status === 'accepted') return { status: 'accepted', label: 'Authorized' }
    return { status: 'pending', label: 'Pending Review' }
  }

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.target.toLowerCase().includes(search.toLowerCase()) ||
    a.asset_type.toLowerCase().includes(search.toLowerCase()) ||
    String(a.id).includes(search)
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            className="dashboard-search-input"
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="action-btn action-btn-primary" type="button" onClick={onAdd}>
          <Plus size={15} /> Add Asset
        </button>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Asset Name</th>
              <th>Target</th>
              <th>Type</th>
              {isAdmin ? <th>Owner</th> : <th>Authorization Proof</th>}
              <th style={{ textAlign: 'right', width: isAdmin ? '120px' : '220px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={6} className="dashboard-empty-state">
                  {assets.length === 0 ? 'No assets added yet.' : 'No assets matching search.'}
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isPrivate = asset.asset_type === 'private_page'
                const authInfo = !isAdmin ? getAssetAuthStatus(asset.id) : null

                return (
                  <tr key={asset.id}>
                    <td className="table-cell-mono">#{asset.id}</td>
                    <td style={{ fontWeight: 600 }}>
                      {asset.name}
                      {isPrivate && (
                        <span style={{ marginLeft: '6px', fontSize: '0.72rem', color: 'var(--yellow)' }}>
                          🔒 [Private]
                        </span>
                      )}
                    </td>
                    <td className="table-cell-mono">{asset.target}</td>
                    <td>
                      <span className={`badge ${isPrivate ? 'badge-yellow' : 'badge-blue'}`}>
                        {asset.asset_type}
                      </span>
                    </td>
                    {isAdmin ? (
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {getUserEmail(asset.user_id)}
                      </td>
                    ) : (
                      <td>
                        {isPrivate ? (
                          authInfo.status === 'accepted' ? (
                            <span className="badge badge-green" style={{ display: 'inline-flex', gap: '4px' }}>
                              <ShieldCheck size={12} /> {authInfo.label}
                            </span>
                          ) : authInfo.status === 'pending' ? (
                            <span className="badge badge-yellow" style={{ display: 'inline-flex', gap: '4px' }}>
                              <ShieldAlert size={12} /> {authInfo.label}
                            </span>
                          ) : (
                            <span className="badge badge-red" style={{ display: 'inline-flex', gap: '4px' }}>
                              <ShieldAlert size={12} /> Needs Physical Proof
                            </span>
                          )
                        ) : (
                          <span className="badge badge-gray">Standard Access</span>
                        )}
                      </td>
                    )}
                    <td>
                      <div className="table-cell-actions" style={{ justifyContent: 'flex-end' }}>
                        {!isAdmin && onRunScan && (
                          <button
                            className="action-btn action-btn-success"
                            type="button"
                            onClick={() => onRunScan(asset)}
                            title={isPrivate && authInfo?.status !== 'accepted' ? 'Authorization required before scan' : 'Run security scan'}
                          >
                            <Play size={12} /> Scan
                          </button>
                        )}
                        {!isAdmin && isPrivate && authInfo?.status !== 'accepted' && onRequestAuth && (
                          <button
                            className="action-btn action-btn-warning"
                            type="button"
                            onClick={() => onRequestAuth(asset)}
                            title="Submit physical ownership proof"
                          >
                            <ShieldCheck size={12} /> Request Auth
                          </button>
                        )}
                        <button
                          className="action-btn action-btn-outline"
                          type="button"
                          onClick={() => onEdit(asset)}
                          title="Edit asset"
                          aria-label={`Edit ${asset.name}`}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="action-btn action-btn-danger"
                          type="button"
                          onClick={() => onDelete(asset)}
                          title="Delete asset"
                          aria-label={`Delete ${asset.name}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
