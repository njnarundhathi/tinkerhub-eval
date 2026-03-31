import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { getJuryApplications, logout as logoutApi } from '../api'

function StatusBadge({ hasReviewed }) {
  return hasReviewed
    ? <span className="badge badge-success">Reviewed</span>
    : <span className="badge badge-warning">Pending</span>
}

export default function Jury() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getJuryApplications()
      .then(({ data }) => setApps(data))
      .catch(() => setError('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    try { await logoutApi() } catch {}
    logout()
    navigate('/login')
  }

  const pending = apps.filter(a => !a.has_reviewed)
  const reviewed = apps.filter(a => a.has_reviewed)

  return (
    <>
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">Eval Platform</span>
          <span className="badge badge-neutral">Jury</span>
        </div>
        <div className="app-header-right">
          <div className="user-badge">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
              {user.campus_name && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.campus_name}</div>
              )}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="app-content">
        <h2 className="page-title">My Assignments</h2>
        <p className="page-subtitle">
          Applications assigned to you for review.
          {apps.length > 0 && ` ${reviewed.length} of ${apps.length} reviewed.`}
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 24, height: 24 }} />
          </div>
        ) : apps.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <h3>No applications assigned</h3>
            <p>Check back later or contact the admin</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  Pending Review ({pending.length})
                </h3>
                <div className="app-cards-grid" style={{ marginBottom: 32 }}>
                  {pending.map(app => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              </>
            )}

            {reviewed.length > 0 && (
              <>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  Reviewed ({reviewed.length})
                </h3>
                <div className="app-cards-grid">
                  {reviewed.map(app => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

function AppCard({ app }) {
  return (
    <Link
      to={`/jury/${app.id}`}
      className={`app-card ${app.has_reviewed ? 'reviewed' : 'pending'}`}
    >
      <div className="app-card-header">
        <div className="app-card-name">{app.name || 'Unnamed Applicant'}</div>
        <StatusBadge hasReviewed={app.has_reviewed} />
      </div>
      <div className="app-card-id">{app.application_id}</div>
      <div className="app-card-meta">
        {app.campus_name && <span>📍 {app.campus_name}</span>}
        {app.institution_name && <span>🏫 {app.institution_name}</span>}
        {app.has_reviewed && app.reviewer_slot && (
          <span style={{ color: 'var(--success)', fontWeight: 500, marginTop: 6 }}>
            ✓ Your review submitted
          </span>
        )}
        {!app.has_reviewed && (
          <span style={{ color: 'var(--warning)', fontWeight: 500, marginTop: 6 }}>
            Review needed →
          </span>
        )}
      </div>
    </Link>
  )
}
