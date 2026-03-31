import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { getJuryApplication, submitReview } from '../api'

function DetailField({ label, value, href }) {
  if (!value) return null
  return (
    <div className="detail-field">
      <label>{label}</label>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer">{value}</a>
        : <p>{value}</p>
      }
    </div>
  )
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    getJuryApplication(id)
      .then(({ data }) => setApp(data))
      .catch(() => setError('Application not found or not assigned to you'))
      .finally(() => setLoading(false))
  }, [id])

  const myScore = app ? app[`review${app.reviewer_slot}_score`] : null
  const myComment = app ? app[`review${app.reviewer_slot}_comment`] : null
  const alreadyReviewed = myScore != null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) { setSubmitError('Comment is required'); return }
    setSubmitting(true)
    setSubmitError('')
    try {
      await submitReview(id, { score, comment: comment.trim() })
      setSubmitSuccess(true)
      // Refresh app data
      const { data } = await getJuryApplication(id)
      setApp(data)
    } catch (e) {
      setSubmitError(e.response?.data?.error || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <span className="spinner" style={{ width: 28, height: 28 }} />
    </div>
  )

  if (error) return (
    <div className="app-content">
      <button className="back-btn" onClick={() => navigate('/jury')}>← Back</button>
      <div className="alert alert-error">{error}</div>
    </div>
  )

  if (!app) return null

  const links = [
    { label: 'GitHub', url: app.github },
    { label: 'Portfolio', url: app.portfolio },
    { label: 'LinkedIn', url: app.linkedin },
    { label: 'Video Link', url: app.video_link },
  ].filter(l => l.url)

  return (
    <>
      <header className="app-header">
        <div className="app-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/jury')}>← Back</button>
          <span className="app-logo">Eval Platform</span>
        </div>
        <div className="app-header-right">
          <div className="user-badge">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <span>{user.name}</span>
          </div>
        </div>
      </header>

      <div className="app-content">
        {submitSuccess && !alreadyReviewed && (
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            Review submitted successfully!
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <h1 className="page-title">{app.name || 'Unnamed Applicant'}</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>ID: {app.application_id}</span>
            {app.campus_name && <span className="badge badge-neutral">{app.campus_name}</span>}
            {alreadyReviewed
              ? <span className="badge badge-success">Reviewed by you</span>
              : <span className="badge badge-warning">Pending your review</span>}
            {app.reviewer_slot === 3 && <span className="badge badge-danger">Conflict reviewer</span>}
          </div>
        </div>

        <div className="app-detail-layout">
          {/* Left: Application Details */}
          <div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Application Details</span>
              </div>
              <div className="card-body">
                <div className="detail-section">
                  <h3>Personal Info</h3>
                  <div className="detail-grid">
                    <DetailField label="Full Name" value={app.name} />
                    <DetailField label="Email" value={app.email} />
                    <DetailField label="Campus" value={app.campus_name} />
                    <DetailField label="Institution" value={app.institution_name} />
                    <DetailField label="Graduation Year" value={app.graduation_year} />
                  </div>
                </div>

                {links.length > 0 && (
                  <div className="detail-section">
                    <h3>Links</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {links.map(({ label, url }) => (
                        <a
                          key={label}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          {label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {app.answers && (
                  <div className="detail-section">
                    <h3>Application Answers</h3>
                    <div className="answers-block">{app.answers}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Review Form */}
          <div>
            {alreadyReviewed ? (
              <div className="reviewed-notice">
                <h3>Your Review</h3>
                <div className="score-big">{myScore}/10</div>
                <div style={{ fontSize: 12, color: 'var(--success)' }}>Score submitted</div>
                <div className="comment-display">{myComment}</div>
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Submit Review</span>
                  <span className="badge badge-info">Reviewer {app.reviewer_slot}</span>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 20 }}>
                      <label>Score (1–10)</label>
                      <div className="score-input-group">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={score}
                          onChange={e => setScore(Number(e.target.value))}
                        />
                        <div className="score-display">{score}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        <span>1 – Poor</span>
                        <span>5 – Average</span>
                        <span>10 – Excellent</span>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 20 }}>
                      <label>Comment <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Provide your detailed evaluation..."
                        rows={5}
                        required
                      />
                    </div>

                    {submitError && (
                      <div className="alert alert-error" style={{ marginBottom: 12 }}>
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary btn-full"
                      disabled={submitting || !comment.trim()}
                    >
                      {submitting ? <><span className="spinner" /> Submitting...</> : 'Submit Review'}
                    </button>

                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, textAlign: 'center' }}>
                      Reviews cannot be changed after submission.
                    </p>
                  </form>
                </div>
              </div>
            )}

            {app.conflict_flag && (
              <div className="alert alert-danger" style={{ marginTop: 12 }}>
                Score conflict detected — a 3rd reviewer has been assigned.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
