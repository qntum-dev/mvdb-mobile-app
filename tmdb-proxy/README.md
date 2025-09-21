# TMDB Proxy API

A Hono.js Cloudflare Worker that serves as a proxy for TMDB API requests, designed to work with cellular data where direct TMDB API access might be blocked.

## Features

- 🚀 **Fast & Lightweight**: Built with Hono.js for optimal performance
- 🌐 **CORS Enabled**: Works with web and mobile applications
- 🔒 **Secure**: API keys are handled server-side
- 📱 **Cellular Data Compatible**: Bypasses cellular network restrictions
- 🔧 **Extensible**: Easy to add support for other APIs
- 📚 **Well Documented**: Built-in API documentation

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your TMDB API key:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:8787` to see the API documentation.

### 4. Deployment

Deploy to Cloudflare Workers:

```bash
# Set your TMDB API key as a secret
wrangler secret put TMDB_API_KEY

# Deploy the worker
npm run deploy
```

## API Endpoints

### Health Check
- **GET** `/` - Service status and information

### Documentation  
- **GET** `/docs` - Complete API documentation

### TMDB Proxy Endpoints
- **GET** `/api/tmdb/search/movie?query={query}` - Search movies
- **GET** `/api/tmdb/discover/movie` - Discover movies
- **GET** `/api/tmdb/trending/movie/day` - Trending movies
- **GET** `/api/tmdb/trending/tv/day` - Trending TV shows
- **GET** `/api/tmdb/movie/popular` - Popular movies
- **GET** `/api/tmdb/person/popular` - Popular people
- **GET** `/api/tmdb/movie/{id}` - Movie details
- **GET** `/api/tmdb/tv/{id}` - TV show details
- **GET** `/api/tmdb/person/{id}` - Person details
- **GET** `/api/tmdb/person/{id}/combined_credits` - Person credits
- **GET** `/api/tmdb/movie/{id}/videos` - Movie videos
- **GET** `/api/tmdb/tv/{id}/videos` - TV show videos

## Usage in Your App

Replace your TMDB API calls from:

```javascript
// Before
const response = await fetch('https://api.themoviedb.org/3/trending/movie/day', {
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
});
```

To:

```javascript
// After
const response = await fetch('https://your-worker.your-subdomain.workers.dev/api/tmdb/trending/movie/day');
```

## Configuration

### Environment Variables

Set these in Cloudflare Workers dashboard or via `wrangler secret`:

- `TMDB_API_KEY` (required) - Your TMDB API key
- `TMDB_BASE_URL` (optional) - TMDB base URL (default: https://api.themoviedb.org/3)
- `CORS_ORIGINS` (optional) - Allowed origins (default: *)
- `ENVIRONMENT` (optional) - Environment name

### Wrangler Configuration

Edit `wrangler.toml` to customize:
- Worker name
- Environment variables
- Custom domains
- Caching settings

## Adding New APIs

To add support for other APIs, extend the `serviceConfigs` object in `src/index.ts`:

```typescript
const serviceConfigs = {
  'spotify': {
    baseUrl: 'https://api.spotify.com/v1',
    apiKeyEnv: 'SPOTIFY_API_KEY'
  },
  // Add more services here
};
```

## Security Considerations

- API keys are stored as Cloudflare Worker secrets
- CORS is configurable per environment
- Request/response logging for debugging
- Rate limiting can be added via Cloudflare dashboard

## Troubleshooting

### Common Issues

1. **API key not working**
   - Ensure the API key is set correctly: `wrangler secret put TMDB_API_KEY`
   - Check the key has proper permissions in TMDB

2. **CORS errors**
   - Verify `CORS_ORIGINS` is set correctly
   - Check that preflight OPTIONS requests are handled

3. **Deployment issues**
   - Ensure you're authenticated: `wrangler auth login`
   - Check your `wrangler.toml` configuration

### Logs

View worker logs:
```bash
wrangler tail
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.