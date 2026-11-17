import { useState } from 'react'
import { Edit2, Trash2, Plus, Search } from 'lucide-react'

export default function UsersTable({ users = [], onEdit, onDelete, onAdd }) {
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()) ||
    String(u.id).includes(search)
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            className="dashboard-search-input"
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="action-btn action-btn-primary" type="button" onClick={onAdd}>
          <Plus size={15} /> Add User
        </button>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Email Address</th>
              <th>Role</th>
              <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="dashboard-empty-state">
                  {users.length === 0 ? 'No accounts found in system.' : 'No accounts matching search.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="table-cell-mono">#{user.id}</td>
                  <td style={{ fontWeight: 500 }}>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-blue' : 'badge-gray'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="table-cell-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="action-btn action-btn-outline"
                        type="button"
                        onClick={() => onEdit(user)}
                        title="Edit user"
                        aria-label={`Edit ${user.email}`}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        className="action-btn action-btn-danger"
                        type="button"
                        onClick={() => onDelete(user)}
                        title="Delete user"
                        aria-label={`Delete ${user.email}`}
                      >
                        <Trash2 size={13} />
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
