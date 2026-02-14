import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalContent: 0,
    brandVoices: 0,
    recentContent: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [contentRes, voicesRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/brand-voices'),
      ]);

      const content = await contentRes.json();
      const voices = await voicesRes.json();

      setStats({
        totalContent: content.length,
        brandVoices: voices.length,
        recentContent: content.slice(0, 5),
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome to ContentFlow AI</p>
      </div>

      <div className="grid grid-2">
        <div className="stat-card">
          <h4>Total Content</h4>
          <div className="value">{stats.totalContent}</div>
        </div>
        <div className="stat-card">
          <h4>Brand Voices</h4>
          <div className="value">{stats.brandVoices}</div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Content</h3>
        {stats.recentContent.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>
            No content yet. Start by generating your first piece!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.recentContent.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{item.contentType || 'Content'}</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {item.brief?.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/generate" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary">Generate Content</button>
          </a>
          <a href="/brand-voice" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary">Create Brand Voice</button>
          </a>
          <a href="/library" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary">View Library</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
