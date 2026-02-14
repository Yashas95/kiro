import React, { useState, useEffect } from 'react';

function Library() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setContent(data);
    } catch (error) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await fetch(`/api/content/${id}`, { method: 'DELETE' });
      setContent(content.filter((item) => item.id !== id));
      setSelectedContent(null);
    } catch (error) {
      setError('Failed to delete content');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading library...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Content Library</h2>
        <p>Manage all your generated content</p>
      </div>

      {error && <div className="error">{error}</div>}

      {content.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No content yet. Start by generating your first piece!
          </p>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/generate" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary">Generate Content</button>
            </a>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedContent ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          <div>
            <div className="card">
              <h3>All Content ({content.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {content.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedContent(item)}
                    style={{
                      padding: '1rem',
                      background: selectedContent?.id === item.id ? 'var(--bg-tertiary)' : 'var(--bg)',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{item.contentType || 'Content'}</strong>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {item.brief?.substring(0, 80)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedContent && (
            <div>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>{selectedContent.contentType || 'Content'}</h3>
                  <button onClick={() => setSelectedContent(null)} className="btn btn-secondary">
                    ✕
                  </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Created: {new Date(selectedContent.createdAt).toLocaleString()}
                  </p>
                  {selectedContent.keywords && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Keywords: {selectedContent.keywords}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Brief:</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {selectedContent.brief}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Content:</strong>
                  <div
                    style={{
                      background: 'var(--bg)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      marginTop: '0.5rem',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    {selectedContent.content}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleCopy(selectedContent.content)}
                    className="btn btn-primary"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => handleDelete(selectedContent.id)}
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Library;
