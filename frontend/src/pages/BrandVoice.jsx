import React, { useState, useEffect } from 'react';

function BrandVoice() {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sampleContent: '',
    tone: 'professional',
    vocabulary: 'moderate',
  });

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const res = await fetch('/api/brand-voices');
      const data = await res.json();
      setVoices(data);
    } catch (error) {
      setError('Failed to load brand voices');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/brand-voices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to create brand voice');
      }

      const newVoice = await res.json();
      setVoices([newVoice, ...voices]);
      setSuccess('Brand voice created successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        sampleContent: '',
        tone: 'professional',
        vocabulary: 'moderate',
      });
    } catch (error) {
      setError(error.message || 'Failed to create brand voice');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading brand voices...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Brand Voice</h2>
        <p>Train AI on your brand's unique voice and style</p>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Your Brand Voices</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ Create New'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg)', borderRadius: '8px' }}>
            <div className="form-group">
              <label htmlFor="name">Brand Voice Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Tech Startup Voice"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sampleContent">Sample Content *</label>
              <textarea
                id="sampleContent"
                name="sampleContent"
                value={formData.sampleContent}
                onChange={handleChange}
                placeholder="Paste 2-3 paragraphs of your brand's existing content..."
                style={{ minHeight: '200px' }}
                required
              />
              <small style={{ color: 'var(--text-secondary)' }}>
                Provide at least 500 words of sample content for best results
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="tone">Tone</label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="authoritative">Authoritative</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="vocabulary">Vocabulary Level</label>
              <select
                id="vocabulary"
                name="vocabulary"
                value={formData.vocabulary}
                onChange={handleChange}
              >
                <option value="simple">Simple</option>
                <option value="moderate">Moderate</option>
                <option value="advanced">Advanced</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Analyzing...' : '✨ Create Brand Voice'}
            </button>
          </form>
        )}

        {voices.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            No brand voices yet. Create your first one to get started!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {voices.map((voice) => (
              <div
                key={voice.id}
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>{voice.name}</h4>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span>Tone: {voice.tone}</span>
                      <span>Vocabulary: {voice.vocabulary}</span>
                      <span>Created: {new Date(voice.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVoice(selectedVoice?.id === voice.id ? null : voice)}
                    className="btn btn-secondary"
                  >
                    {selectedVoice?.id === voice.id ? 'Hide' : 'View'}
                  </button>
                </div>

                {selectedVoice?.id === voice.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <strong>AI Analysis:</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                      {voice.guidelines}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrandVoice;
