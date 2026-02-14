# ContentFlow AI - Prototype

An intelligent content management platform powered by Claude (Anthropic).

## Features

- 🤖 AI-powered content generation with Claude 3.5 Sonnet
- 🎯 Brand voice training and application
- 📚 Content library management
- ✍️ Multiple content types (blog posts, social media, emails, etc.)
- 🎨 Modern, responsive UI

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for the root, backend, and frontend.

### 2. Configure Backend

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3001
```

### 3. Run the Application

From the root directory:

```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend on http://localhost:3000

### 4. Open in Browser

Navigate to http://localhost:3000

## Project Structure

```
contentflow-ai/
├── backend/              # Express API server
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env             # Environment variables
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   ├── package.json
│   └── vite.config.js
└── requirements.md      # Full product requirements

```

## API Endpoints

### Content Generation
- `POST /api/generate` - Generate content with AI
- `GET /api/content` - Get all content
- `GET /api/content/:id` - Get specific content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Brand Voice
- `POST /api/brand-voices` - Create brand voice
- `GET /api/brand-voices` - Get all brand voices
- `GET /api/brand-voices/:id` - Get specific brand voice

## Usage

### Generate Content

1. Navigate to "Generate Content"
2. Select content type (blog post, social media, etc.)
3. Enter your content brief
4. Optionally add keywords and select brand voice
5. Click "Generate Content"
6. Copy or save the generated content

### Create Brand Voice

1. Navigate to "Brand Voice"
2. Click "Create New"
3. Enter a name for your brand voice
4. Paste sample content (500+ words recommended)
5. Select tone and vocabulary level
6. Click "Create Brand Voice"
7. AI will analyze and create your brand voice profile

### View Content Library

1. Navigate to "Content Library"
2. Browse all generated content
3. Click on any item to view details
4. Copy or delete content as needed

## Technology Stack

**Frontend:**
- React 18
- React Router
- Vite
- CSS3

**Backend:**
- Node.js
- Express
- Anthropic SDK (Claude API)
- CORS

## Development Notes

- This is a prototype with in-memory storage
- For production, implement a proper database (PostgreSQL, MongoDB)
- Add authentication and authorization
- Implement rate limiting
- Add comprehensive error handling
- Set up monitoring and logging

## Next Steps

See `requirements.md` for the full product roadmap including:
- User authentication
- Database integration
- Multi-channel publishing
- SEO optimization
- Analytics dashboard
- Team collaboration features
- And much more!

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
