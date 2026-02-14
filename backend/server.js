import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// In-memory storage (replace with database in production)
const brandVoices = new Map();
const contentLibrary = new Map();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate content
app.post('/api/generate', async (req, res) => {
  try {
    const { contentType, brief, keywords, brandVoiceId, tone } = req.body;

    if (!brief) {
      return res.status(400).json({ error: 'Brief is required' });
    }

    // Get brand voice if specified
    let brandVoicePrompt = '';
    if (brandVoiceId && brandVoices.has(brandVoiceId)) {
      const voice = brandVoices.get(brandVoiceId);
      brandVoicePrompt = `\n\nBrand Voice Guidelines:\n${voice.guidelines}`;
    }

    const systemPrompt = `You are an expert content writer for ContentFlow AI. Generate high-quality ${contentType || 'content'} that is engaging, well-structured, and professional.${brandVoicePrompt}`;

    const userPrompt = `Create ${contentType || 'content'} based on this brief:\n\n${brief}\n\n${keywords ? `Target keywords: ${keywords}` : ''}\n\n${tone ? `Tone: ${tone}` : ''}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const generatedContent = message.content[0].text;

    // Save to library
    const contentId = Date.now().toString();
    contentLibrary.set(contentId, {
      id: contentId,
      content: generatedContent,
      contentType,
      brief,
      keywords,
      brandVoiceId,
      createdAt: new Date().toISOString(),
    });

    res.json({
      content: generatedContent,
      contentId,
      usage: message.usage,
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create brand voice
app.post('/api/brand-voices', async (req, res) => {
  try {
    const { name, sampleContent, tone, vocabulary } = req.body;

    if (!name || !sampleContent) {
      return res.status(400).json({ error: 'Name and sample content are required' });
    }

    // Analyze sample content to extract voice characteristics
    const analysisPrompt = `Analyze this content and extract the brand voice characteristics. Provide a concise summary of tone, style, vocabulary level, and key patterns:\n\n${sampleContent}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: analysisPrompt }],
    });

    const analysis = message.content[0].text;

    const voiceId = Date.now().toString();
    const brandVoice = {
      id: voiceId,
      name,
      sampleContent,
      tone: tone || 'professional',
      vocabulary: vocabulary || 'moderate',
      guidelines: analysis,
      createdAt: new Date().toISOString(),
    };

    brandVoices.set(voiceId, brandVoice);

    res.json(brandVoice);
  } catch (error) {
    console.error('Brand voice creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all brand voices
app.get('/api/brand-voices', (req, res) => {
  const voices = Array.from(brandVoices.values());
  res.json(voices);
});

// Get brand voice by ID
app.get('/api/brand-voices/:id', (req, res) => {
  const voice = brandVoices.get(req.params.id);
  if (!voice) {
    return res.status(404).json({ error: 'Brand voice not found' });
  }
  res.json(voice);
});

// Get content library
app.get('/api/content', (req, res) => {
  const content = Array.from(contentLibrary.values()).reverse();
  res.json(content);
});

// Get content by ID
app.get('/api/content/:id', (req, res) => {
  const content = contentLibrary.get(req.params.id);
  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }
  res.json(content);
});

// Update content
app.put('/api/content/:id', (req, res) => {
  const content = contentLibrary.get(req.params.id);
  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }

  const updatedContent = {
    ...content,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  contentLibrary.set(req.params.id, updatedContent);
  res.json(updatedContent);
});

// Delete content
app.delete('/api/content/:id', (req, res) => {
  if (!contentLibrary.has(req.params.id)) {
    return res.status(404).json({ error: 'Content not found' });
  }
  contentLibrary.delete(req.params.id);
  res.json({ message: 'Content deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 ContentFlow AI Backend running on http://localhost:${PORT}`);
  console.log(`📝 API ready at http://localhost:${PORT}/api`);
});
