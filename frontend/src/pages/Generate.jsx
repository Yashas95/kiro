import React, { useState, useEffect } from 'react';

function Generate() {
  const [formData, setFormData] = useState({
    contentType: 'blog-post',
    brief: '',
    keywords: '',
    tone: 'professional',
    brandVoiceId: '',
  });
  const [brandVoices, setBrandVoices] = useState([]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBrandVoices();
  }, []);

  const fetchBrandVoices = async () => {
    try {
      const res = await fetch('/api/brand-voices');
      const data = await res.json();
      setBrandVoices(data);
    } catch (error) {
      console.error('Failed to fetch brand voices:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setGeneratedContent('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Generation failed');
      }

      const data = await res.json();
      setGeneratedContent(data.content);
      setSuccess('Content generated successfully!');
    } catch (error) {
      setError(error.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setSuccess('Content copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Generate Content</h2>
        <p>Create high-quality content with AI</p>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <h3>Content Settings</h3>
        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label htmlFor="contentType">Content Type</label>
            <select
              id="contentType"
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              required
            >
              <option value="blog-post">Blog Post</option>
              <option value="social-media">Social Media Post</option>
              <option value="email">Email</option>
              <option value="product-description">Product Description</option>
              <option value="landing-page">Landing Page Copy</option>
              <option value="article">Article</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="brief">Content Brief *</label>
            <textarea
              id="brief"
              name="brief"
              value={formData.brief}
              onChange={handleChange}
              placeholder="Describe what you want to create..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="keywords">Keywords (optional)</label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="e.g., AI, content marketing, automation"
            />
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
            <label htmlFor="brandVoiceId">Brand Voice (optional)</label>
            <select
              id="brandVoiceId"
              name="brandVoiceId"
              value={formData.brandVoiceId}
              onChange={handleChange}
            >
              <option value="">None</option>
              {brandVoices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating...' : '✨ Generate Content'}
          </button>
        </form>
      </div>

      {generatedContent && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Generated Content</h3>
            <button onClick={handleCopy} className="btn btn-secondary">
              📋 Copy
            </button>
          </div>
          <div
            style={{
              background: 'var(--bg)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
            }}
          >
            {generatedContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default Generate;
