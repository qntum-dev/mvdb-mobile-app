import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

// Environment bindings interface
type Bindings = {
  TMDB_API_KEY: string;
  TMDB_BASE_URL?: string;
  CORS_ORIGINS?: string;
  ALLOWED_METHODS?: string;
  ALLOWED_HEADERS?: string;
  ENVIRONMENT?: string;
};

// Initialize Hono app
const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());

// CORS middleware
app.use('*', async (c, next) => {
  const corsOrigins = c.env.CORS_ORIGINS || '*';
  const allowedMethods = c.env.ALLOWED_METHODS || 'GET,POST,PUT,DELETE,OPTIONS';
  const allowedHeaders = c.env.ALLOWED_HEADERS || 'Content-Type,Authorization,X-API-Key';
  
  return cors({
    origin: corsOrigins,
    allowMethods: allowedMethods.split(','),
    allowHeaders: allowedHeaders.split(','),
    credentials: true,
  })(c, next);
});

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    service: 'TMDB Proxy API',
    version: '1.0.0',
    status: 'healthy',
    environment: c.env.ENVIRONMENT || 'development',
    endpoints: {
      tmdb: '/api/tmdb/*',
      health: '/',
      docs: '/docs'
    }
  });
});

// API documentation endpoint
app.get('/docs', (c) => {
  return c.json({
    title: 'TMDB Proxy API Documentation',
    description: 'A proxy service for TMDB API that works with cellular data',
    version: '1.0.0',
    endpoints: {
      '/api/tmdb/search/movie': {
        method: 'GET',
        description: 'Search for movies',
        parameters: {
          query: 'string (required) - Search query'
        }
      },
      '/api/tmdb/discover/movie': {
        method: 'GET',
        description: 'Discover movies',
        parameters: {
          sort_by: 'string - Sort order (default: popularity.desc)'
        }
      },
      '/api/tmdb/trending/movie/day': {
        method: 'GET',
        description: 'Get trending movies for the day'
      },
      '/api/tmdb/trending/tv/day': {
        method: 'GET',
        description: 'Get trending TV shows for the day'
      },
      '/api/tmdb/movie/popular': {
        method: 'GET',
        description: 'Get popular movies'
      },
      '/api/tmdb/person/popular': {
        method: 'GET',
        description: 'Get popular people'
      },
      '/api/tmdb/movie/:id': {
        method: 'GET',
        description: 'Get movie details by ID'
      },
      '/api/tmdb/tv/:id': {
        method: 'GET',
        description: 'Get TV show details by ID'
      },
      '/api/tmdb/person/:id': {
        method: 'GET',
        description: 'Get person details by ID'
      },
      '/api/tmdb/person/:id/combined_credits': {
        method: 'GET',
        description: 'Get person combined credits'
      },
      '/api/tmdb/movie/:id/videos': {
        method: 'GET',
        description: 'Get movie videos'
      },
      '/api/tmdb/tv/:id/videos': {
        method: 'GET',
        description: 'Get TV show videos'
      }
    },
    notes: [
      'All endpoints proxy to TMDB API',
      'Authorization is handled automatically',
      'Responses are identical to TMDB API responses',
      'CORS is enabled for all origins'
    ]
  });
});

// Generic API proxy function
async function proxyApiRequest(
  c: any,
  baseUrl: string,
  apiKey: string,
  path: string,
  queryParams?: URLSearchParams
) {
  try {
    // Build the target URL by direct concatenation
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    const fullUrl = cleanBaseUrl + cleanPath;
    const targetUrl = new URL(fullUrl);
    
    // Add existing query parameters from the original request
    const url = new URL(c.req.url);
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });
    
    // Add additional query parameters if provided
    if (queryParams) {
      queryParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });
    }

    console.log(`Base URL: ${baseUrl}`);
    console.log(`Path: ${path}`);
    console.log(`Clean Base URL: ${cleanBaseUrl}`);
    console.log(`Clean Path: ${cleanPath}`);
    console.log(`Full URL: ${fullUrl}`);
    console.log(`Proxying request to: ${targetUrl.toString()}`);
    console.log(`Using API key: ${apiKey ? 'present' : 'missing'}`);

    // Make the request to the target API
    const response = await fetch(targetUrl.toString(), {
      method: c.req.method,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'TMDB-Proxy/1.0.0',
        ...(c.req.method !== 'GET' && { 'Content-Type': 'application/json' }),
      },
      ...(c.req.method !== 'GET' && { body: c.req.body }),
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

    // Get response data
    const data = await response.json();

    // Return the response with appropriate status and headers
    return c.json(data, response.status, {
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'X-Proxy-Status': 'success',
      'X-Original-Status': response.status.toString(),
    });

  } catch (error) {
    console.error('Proxy request failed:', error);
    
    return c.json(
      {
        error: 'Proxy request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      500,
      {
        'X-Proxy-Status': 'error',
      }
    );
  }
}

// TMDB API Routes
app.get('/api/tmdb/*', async (c) => {
  const apiKey = c.env.TMDB_API_KEY;
  if (!apiKey) {
    return c.json({ error: 'TMDB API key not configured' }, 500);
  }

  const baseUrl = c.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
  const path = c.req.path.replace('/api/tmdb', '');
  
  return proxyApiRequest(c, baseUrl, apiKey, path);
});

// Future API endpoints can be added here
// Example: Generic API proxy for other services
app.all('/api/:service/*', async (c) => {
  const service = c.req.param('service');
  
  // You can add more services here
  const serviceConfigs = {
    // Example for future APIs:
    // 'spotify': {
    //   baseUrl: 'https://api.spotify.com/v1',
    //   apiKeyEnv: 'SPOTIFY_API_KEY'
    // },
    // 'github': {
    //   baseUrl: 'https://api.github.com',
    //   apiKeyEnv: 'GITHUB_API_KEY'
    // }
  };

  if (service === 'tmdb') {
    // Redirect to specific TMDB handler
    return c.redirect(c.req.url.replace('/api/tmdb', '/api/tmdb'));
  }

  // Handle other services
  const config = serviceConfigs[service as keyof typeof serviceConfigs];
  if (!config) {
    return c.json(
      { 
        error: `Service '${service}' not supported`,
        availableServices: ['tmdb', ...Object.keys(serviceConfigs)]
      }, 
      404
    );
  }

  // Generic service proxy logic would go here
  return c.json({ error: 'Service configuration incomplete' }, 501);
});

// Error handling middleware
app.onError((err, c) => {
  console.error('Application error:', err);
  
  return c.json(
    {
      error: 'Internal server error',
      message: err.message,
      timestamp: new Date().toISOString(),
    },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: 'Not found',
      message: 'The requested endpoint does not exist',
      availableEndpoints: [
        '/',
        '/docs',
        '/api/tmdb/*'
      ],
      timestamp: new Date().toISOString(),
    },
    404
  );
});

export default app;