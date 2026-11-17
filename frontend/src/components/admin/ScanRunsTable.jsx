import { useState } from 'react'
import { Search, Activity, FileText, Play } from 'lucide-react'

export default function ScanRunsTable({
  scanRuns = [],
  assets = [],
  isAdmin = true,
  onViewDetails,
  onNewScan,
}) {
  const [search, setSearch] = useState('')

  const getAssetName = (assetId) => {
    const asset = assets.find((a) => a.id === assetId)
    return asset ? `${asset.name} (#${assetId})` : `Asset #${assetId}`
  }

  const filteredScans = scanRuns.filter((s) =>
    s.status.toLowerCase().includes(search.toLowerCase()) ||
    String(s.id).includes(search) ||
    String(s.asset_id).includes(search) ||
    String(s.user_id).includes(search)
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-green'
      case 'failed':
        return 'badge-red'
      case 'running':
      case 'in_progress':
        return 'badge-blue'
      default:
        return 'badge-yellow'
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            className="dashboard-search-input"
            type="text"
            placeholder="Search scans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Activity size={14} /> Total Scans: {scanRuns.length}
          </span>
          {!isAdmin && onNewScan && (
            <button className="action-btn action-btn-primary" type="button" onClick={onNewScan}>
              <Play size={13} /> Run Scan
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
              {isAdmin && <th>Initiated By</th>}
              <th>Status</th>
              <th>Started</th>
              <th>Completed</th>
              <th style={{ textAlign: 'right', width: '120px' }}>Results</th>
            </tr>
          </thead>
          <tbody>
            {filteredScans.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="dashboard-empty-state">
                  {scanRuns.length === 0
                    ? !isAdmin
                      ? 'No scan runs initiated yet. Select an asset to run a security scan.'
                      : 'No scan activity recorded yet.'
                    : 'No scans matching search.'}
                </td>
              </tr>
            ) : (
              filteredScans.map((scan) => (
                <tr key={scan.id}>
                  <td className="table-cell-mono">#{scan.id}</td>
                  <td style={{ fontWeight: 500 }}>{getAssetName(scan.asset_id)}</td>
                  {isAdmin && <td className="table-cell-mono">User #{scan.user_id}</td>}
                  <td>
                    <span className={`badge ${getStatusBadge(scan.status)}`}>
                      {scan.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {scan.created_at || 'N/A'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {scan.completed_at || 'Pending'}
                  </td>
                  <td>
                    <div className="table-cell-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="action-btn action-btn-outline"
                        type="button"
                        onClick={() => onViewDetails(scan)}
                        title="View scan details and JSON results"
                      >
                        <FileText size={13} /> View
                      </button>
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
