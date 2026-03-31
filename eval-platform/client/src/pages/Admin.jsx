import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import {
  uploadJuryCSV, uploadApplicationsCSV, assignReviewers, reassignReviewers,
  getAdminApplications, getCampuses, getStats, resolveConflict, logout as logoutApi
} from '../api'

function ScorePill({ score }) {
  if (score == null) return <span style={{ color: 'var(--text-muted)' }}>—</span>
  const cls = score >= 7 ? 'avg-high' : score >= 4 ? 'avg-mid' : 'avg-low'
  return <span className={`avg-score ${cls}`}>{score}</span>
}

function AvgScore({ score }) {
  if (score == null) return <span style={{ color: 'var(--text-muted)' }}>—</span>
  const val = Math.round(score * 10) / 10
  const cls = val >= 7 ? 'avg-high' : val >= 4 ? 'avg-mid' : 'avg-low'
  return <span className={`avg-score ${cls}`}>{val}</span>
}

function UploadCard({ title, hint, csvFields, onUpload, loading, result }) {
  const [file, setFile] = useState(null)

  const handleUpload = async () => {
    if (!file) return
    await onUpload(file)
    setFile(null)
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
      </div>
      <div className="card-body">
        <label className={`upload-zone ${file ? 'has-file' : ''}`}>
          <span className="upload-icon">{file ? '✅' : '📄'}</span>
          <p className="upload-title">{file ? file.name : 'Choose CSV file'}</p>
          <p className="upload-hint">{hint}</p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          {!file && (
            <span className="btn btn-secondary btn-sm" style={{ marginTop: 4 }}>
              Browse
            </span>
          )}
        </label>

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 12 }}
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? <><span className="spinner" /> Uploading...</> : 'Upload CSV'}
        </button>

        {result && (
          <div className={`alert ${result.error ? 'alert-error' : 'alert-success'}`} style={{ marginTop: 10 }}>
            {result.error
              ? result.error
              : `${result.inserted} rows imported successfully${result.errors?.length ? ` (${result.errors.length} skipped)` : ''}`
            }
          </div>
        )}

        <details style={{ marginTop: 12 }}>
          <summary style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
            Required CSV columns
          </summary>
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {csvFields.map(f => <div key={f}><code style={{ background: 'var(--bg)', padding: '0 4px', borderRadius: 3 }}>{f}</code></div>)}
          </div>
        </details>
      </div>
    </div>
  )
}

function ExpandedRow({ app, onResolveConflict, resolving }) {
  const links = [
    app.github && { label: 'GitHub', url: app.github },
    app.portfolio && { label: 'Portfolio', url: app.portfolio },
    app.linkedin && { label: 'LinkedIn', url: app.linkedin },
    app.video_link && { label: 'Video', url: app.video_link },
  ].filter(Boolean)

  return (
    <tr className="expanded-row">
      <td colSpan={100}>
        <div className="expanded-content">
          <div>
            {app.conflict_flag ? (
              <div className="conflict-banner">
                Score conflict detected (|R1 - R2| ≥ 4)
                {!app.reviewer3_id && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onResolveConflict(app.id)}
                    disabled={resolving}
                  >
                    {resolving ? 'Assigning...' : 'Assign 3rd Reviewer'}
                  </button>
                )}
              </div>
            ) : null}
            {app.needs_manual_assignment ? (
              <div className="manual-banner">
                Needs manual reviewer assignment (insufficient eligible reviewers)
              </div>
            ) : null}

            <div className="detail-grid" style={{ marginBottom: 16 }}>
              {[
                ['Institution', app.institution_name],
                ['Email', app.email],
                ['Grad Year', app.graduation_year],
              ].map(([label, val]) => val ? (
                <div className="detail-field" key={label}>
                  <label>{label}</label>
                  <p>{val}</p>
                </div>
              ) : null)}
            </div>

            {links.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {links.map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    {label} ↗
                  </a>
                ))}
              </div>
            )}

            {app.answers && (
              <div className="expanded-section">
                <h4>Answers</h4>
                <div className="answers-block">{app.answers}</div>
              </div>
            )}
          </div>

          <div>
            <div className="expanded-section">
              <h4>Reviewer Scores & Comments</h4>
              <div className="reviewer-scores">
                {[1, 2, 3].map(slot => {
                  const name = app[`reviewer${slot}_name`]
                  const score = app[`review${slot}_score`]
                  const comment = app[`review${slot}_comment`]
                  if (!name) return null
                  return (
                    <div className="reviewer-score-item" key={slot}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="score-pill">
                          {score != null ? score : '?'}
                        </span>
                        <div>
                          <div className="reviewer-name">{name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Reviewer {slot}{slot === 3 ? ' (conflict)' : ''}</div>
                        </div>
                      </div>
                      {comment && <p className="comment-text">"{comment}"</p>}
                      {!comment && score == null && (
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pending review</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [apps, setApps] = useState([])
  const [campuses, setCampuses] = useState([])
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState({ campus: '', min_score: '', max_score: '' })
  const [groupByCampus, setGroupByCampus] = useState(false)
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [assignResult, setAssignResult] = useState(null)
  const [assigning, setAssigning] = useState(false)
  const [resolving, setResolving] = useState(null)
  const [uploadLoading, setUploadLoading] = useState({ jury: false, apps: false })
  const [uploadResults, setUploadResults] = useState({ jury: null, apps: null })

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.campus) params.campus = filters.campus
      if (filters.min_score) params.min_score = filters.min_score
      if (filters.max_score) params.max_score = filters.max_score

      const [appsRes, campusesRes, statsRes] = await Promise.all([
        getAdminApplications(params),
        getCampuses(),
        getStats(),
      ])
      setApps(appsRes.data)
      setCampuses(campusesRes.data)
      setStats(statsRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleLogout = async () => {
    try { await logoutApi() } catch {}
    logout()
    navigate('/login')
  }

  const handleUploadJury = async (file) => {
    setUploadLoading(p => ({ ...p, jury: true }))
    setUploadResults(p => ({ ...p, jury: null }))
    try {
      const { data } = await uploadJuryCSV(file)
      setUploadResults(p => ({ ...p, jury: data }))
      fetchAll()
    } catch (e) {
      setUploadResults(p => ({ ...p, jury: { error: e.response?.data?.error || 'Upload failed' } }))
    } finally {
      setUploadLoading(p => ({ ...p, jury: false }))
    }
  }

  const handleUploadApps = async (file) => {
    setUploadLoading(p => ({ ...p, apps: true }))
    setUploadResults(p => ({ ...p, apps: null }))
    try {
      const { data } = await uploadApplicationsCSV(file)
      setUploadResults(p => ({ ...p, apps: data }))
      fetchAll()
    } catch (e) {
      setUploadResults(p => ({ ...p, apps: { error: e.response?.data?.error || 'Upload failed' } }))
    } finally {
      setUploadLoading(p => ({ ...p, apps: false }))
    }
  }

  const handleAssign = async (reassign = false) => {
    setAssigning(true)
    setAssignResult(null)
    try {
      const { data } = await (reassign ? reassignReviewers() : assignReviewers())
      setAssignResult(data)
      fetchAll()
    } catch (e) {
      setAssignResult({ error: e.response?.data?.error || 'Assignment failed' })
    } finally {
      setAssigning(false)
    }
  }

  const handleResolveConflict = async (id) => {
    setResolving(id)
    try {
      await resolveConflict(id)
      fetchAll()
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to resolve conflict')
    } finally {
      setResolving(null)
    }
  }

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Compute top scorer per campus
  const topScorerIds = new Set()
  if (groupByCampus) {
    const campusMap = {}
    for (const app of apps) {
      if (app.average_score != null) {
        const c = app.campus_name || '—'
        if (!campusMap[c] || app.average_score > campusMap[c].score) {
          campusMap[c] = { id: app.id, score: app.average_score }
        }
      }
    }
    for (const v of Object.values(campusMap)) topScorerIds.add(v.id)
  }

  const renderTableRows = () => {
    if (!apps.length) return (
      <tr>
        <td colSpan={10}>
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <h3>No applications yet</h3>
            <p>Upload an applications CSV to get started</p>
          </div>
        </td>
      </tr>
    )

    const rows = []
    let lastCampus = null

    for (const app of apps) {
      if (groupByCampus && app.campus_name !== lastCampus) {
        lastCampus = app.campus_name
        rows.push(
          <tr className="campus-group-header" key={`header-${app.campus_name}`}>
            <td colSpan={10}>{app.campus_name || 'Unknown Campus'}</td>
          </tr>
        )
      }

      const isExpanded = expandedIds.has(app.id)
      const isTopScorer = topScorerIds.has(app.id)
      const rowClass = [
        'row-clickable',
        isExpanded ? 'row-expanded' : '',
        app.conflict_flag ? 'row-conflict' : '',
        app.needs_manual_assignment ? 'row-manual' : '',
        isTopScorer ? 'row-top-scorer' : '',
      ].filter(Boolean).join(' ')

      rows.push(
        <tr key={app.id} className={rowClass} onClick={() => toggleExpand(app.id)}>
          <td>
            <div style={{ fontWeight: 500, fontSize: 13 }}>{app.application_id}</div>
            {isTopScorer && <span className="badge badge-warning" style={{ marginTop: 3 }}>Top</span>}
          </td>
          <td>
            <div style={{ fontWeight: 500 }}>{app.name || '—'}</div>
            {app.email && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{app.email}</div>}
          </td>
          <td>{app.campus_name || '—'}</td>
          <td>
            {app.reviewer1_name
              ? <div style={{ fontSize: 12 }}>{app.reviewer1_name}</div>
              : <span style={{ color: 'var(--text-muted)' }}>—</span>}
            {app.reviewer2_name && <div style={{ fontSize: 12 }}>{app.reviewer2_name}</div>}
            {app.reviewer3_name && <div style={{ fontSize: 12, color: 'var(--warning)' }}>{app.reviewer3_name} (3rd)</div>}
          </td>
          <td><ScorePill score={app.review1_score} /></td>
          <td><ScorePill score={app.review2_score} /></td>
          <td><ScorePill score={app.review3_score} /></td>
          <td><AvgScore score={app.average_score} /></td>
          <td>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {app.conflict_flag
                ? <span className="badge badge-danger">Conflict</span>
                : null}
              {app.needs_manual_assignment
                ? <span className="badge badge-warning">Manual</span>
                : null}
              {!app.reviewer1_id
                ? <span className="badge badge-neutral">Unassigned</span>
                : app.review1_score != null && app.review2_score != null && (!app.reviewer3_id || app.review3_score != null)
                  ? <span className="badge badge-success">Complete</span>
                  : <span className="badge badge-info">In Progress</span>}
            </div>
          </td>
          <td onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {isExpanded ? '▲ Less' : '▼ More'}
            </span>
          </td>
        </tr>
      )

      if (isExpanded) {
        rows.push(
          <ExpandedRow
            key={`exp-${app.id}`}
            app={app}
            onResolveConflict={handleResolveConflict}
            resolving={resolving === app.id}
          />
        )
      }
    }

    return rows
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">Eval Platform</span>
          <span className="badge badge-primary">Admin</span>
        </div>
        <div className="app-header-right">
          <div className="user-badge">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="app-content">
        <div className="tabs">
          <button className={`tab-btn ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>
            Dashboard
          </button>
          <button className={`tab-btn ${tab === 'upload' ? 'active' : ''}`} onClick={() => setTab('upload')}>
            Upload CSVs
          </button>
          <button className={`tab-btn ${tab === 'assign' ? 'active' : ''}`} onClick={() => setTab('assign')}>
            Assign
          </button>
        </div>

        {/* STATS always visible */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-label">Total Applications</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Assigned</div>
              <div className="stat-value">{stats.assigned}</div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-label">Fully Reviewed</div>
              <div className="stat-value">{stats.fully_reviewed}</div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-label">Conflicts</div>
              <div className="stat-value">{stats.conflicts}</div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-label">Needs Manual</div>
              <div className="stat-value">{stats.needs_manual}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Jury Members</div>
              <div className="stat-value">{stats.reviewer_count}</div>
            </div>
          </div>
        )}

        {/* UPLOAD TAB */}
        {tab === 'upload' && (
          <div>
            <h2 className="page-title">Upload CSVs</h2>
            <p className="page-subtitle">Upload jury members and student applications. Re-uploading will update existing records.</p>
            <div className="upload-grid">
              <UploadCard
                title="Jury CSV"
                hint="Upload jury members and admins"
                csvFields={['reviewer_id', 'name', 'email', 'campus_name', 'role (jury/admin)']}
                onUpload={handleUploadJury}
                loading={uploadLoading.jury}
                result={uploadResults.jury}
              />
              <UploadCard
                title="Applications CSV"
                hint="Upload student applications"
                csvFields={[
                  'application_id (required)', 'name', 'campus_name', 'institution_name',
                  'email', 'github', 'portfolio', 'linkedin', 'graduation_year', 'answers', 'video_link'
                ]}
                onUpload={handleUploadApps}
                loading={uploadLoading.apps}
                result={uploadResults.apps}
              />
            </div>
          </div>
        )}

        {/* ASSIGN TAB */}
        {tab === 'assign' && (
          <div>
            <h2 className="page-title">Reviewer Assignment</h2>
            <p className="page-subtitle">Assign reviewers to applications. Each application gets 2 reviewers from different campuses.</p>

            <div className="assign-panel">
              <div className="assign-panel-left">
                <h3>Assign Unassigned Applications</h3>
                <p>Assigns reviewers to applications that have no reviewers yet. Conflict-free (no same-campus).</p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => handleAssign(false)} disabled={assigning}>
                  {assigning ? <><span className="spinner" /> Assigning...</> : 'Assign Reviewers'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => { if (confirm('This will reset ALL assignments. Continue?')) handleAssign(true) }}
                  disabled={assigning}
                >
                  Re-assign All
                </button>
              </div>
            </div>

            {assignResult && (
              <>
                {assignResult.error
                  ? <div className="alert alert-error">{assignResult.error}</div>
                  : (
                    <div className="alert alert-success" style={{ marginBottom: 20 }}>
                      Assignment complete — {assignResult.assigned} assigned, {assignResult.needsManual} need manual assignment
                    </div>
                  )
                }
              </>
            )}

            <div className="card">
              <div className="card-header">
                <span className="card-title">Assignment Rules</span>
              </div>
              <div className="card-body" style={{ fontSize: 13, lineHeight: 2, color: 'var(--text-secondary)' }}>
                <div>• Each application is assigned 2 reviewers from different campuses</div>
                <div>• If fewer than 2 eligible reviewers exist, the application is flagged for manual assignment</div>
                <div>• If reviewer scores differ by 4+, a 3rd reviewer is automatically assigned (conflict resolution)</div>
                <div>• Average score is computed from all submitted reviews</div>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            <div className="filters-bar">
              <span className="filter-label">Filter:</span>
              <select
                value={filters.campus}
                onChange={e => setFilters(p => ({ ...p, campus: e.target.value }))}
              >
                <option value="">All Campuses</option>
                {campuses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="filter-label">Score:</span>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Min"
                value={filters.min_score}
                onChange={e => setFilters(p => ({ ...p, min_score: e.target.value }))}
                style={{ width: 70 }}
              />
              <span style={{ color: 'var(--text-muted)' }}>—</span>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Max"
                value={filters.max_score}
                onChange={e => setFilters(p => ({ ...p, max_score: e.target.value }))}
                style={{ width: 70 }}
              />
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setFilters({ campus: '', min_score: '', max_score: '' })}
              >
                Clear
              </button>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={groupByCampus}
                    onChange={e => setGroupByCampus(e.target.checked)}
                  />
                  Group by campus
                </label>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={fetchAll}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" /> : '↻ Refresh'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--text-muted)' }}>
              {apps.length} application{apps.length !== 1 ? 's' : ''}
              {groupByCampus && topScorerIds.size > 0 && (
                <span style={{ marginLeft: 12 }}>
                  <span className="badge badge-warning" style={{ marginRight: 4 }}>Top</span>
                  = top scorer per campus
                </span>
              )}
              <span style={{ marginLeft: 12 }}>
                <span style={{ color: 'var(--danger)', marginRight: 4 }}>●</span>conflict
                <span style={{ color: 'var(--warning)', marginLeft: 10, marginRight: 4 }}>●</span>needs manual
              </span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Name</th>
                    <th>Campus</th>
                    <th>Reviewers</th>
                    <th>R1</th>
                    <th>R2</th>
                    <th>R3</th>
                    <th>Avg</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}><span className="spinner" /></td></tr>
                    : renderTableRows()
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
