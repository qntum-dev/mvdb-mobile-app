// Test script to simulate production environment variable loading
// This helps debug environment variable issues before building

console.log('🧪 Testing Production Environment Configuration...\n');

// Simulate production environment
process.env.NODE_ENV = 'production';

// Clear existing env vars to simulate fresh production environment
delete process.env.TMDB_URL;
delete process.env.MOVIE_API_KEY;
delete process.env.TMDB_MEDIA_URL;

console.log('1️⃣ Loading environment variables...');

// Load app config which includes env loading logic
const appConfig = require('./app.config.js');

console.log('\n2️⃣ Environment variables after loading:');
console.log('   TMDB_URL:', process.env.TMDB_URL || 'MISSING');
console.log('   MOVIE_API_KEY:', process.env.MOVIE_API_KEY || 'MISSING');
console.log('   TMDB_MEDIA_URL:', process.env.TMDB_MEDIA_URL || 'MISSING');

console.log('\n3️⃣ App config extra values:');
console.log('   TMDB_URL:', appConfig.default.expo.extra.TMDB_URL || 'MISSING');
console.log('   MOVIE_API_KEY:', appConfig.default.expo.extra.MOVIE_API_KEY || 'MISSING');
console.log('   TMDB_MEDIA_URL:', appConfig.default.expo.extra.TMDB_MEDIA_URL || 'MISSING');

console.log('\n4️⃣ Testing API URL building...');

// Simulate how Constants.expoConfig?.extra works in production
const mockExpoConfig = {
  extra: appConfig.default.expo.extra
};

const buildApiUrl = (endpoint) => {
  const baseUrl = mockExpoConfig.extra.TMDB_URL || "https://api.themoviedb.org/3";
  const isProxy = baseUrl.includes('workers.dev');
  
  if (isProxy) {
    return `${baseUrl}/api/tmdb${endpoint}`;
  } else {
    return `${baseUrl}${endpoint}`;
  }
};

const testEndpoints = [
  '/trending/movie/day',
  '/movie/popular',
  '/person/popular',
  '/trending/tv/day'
];

console.log('   Test URLs:');
testEndpoints.forEach(endpoint => {
  const fullUrl = buildApiUrl(endpoint);
  console.log(`   ${endpoint} → ${fullUrl}`);
});

console.log('\n✅ Production environment test completed!');
console.log('   If all URLs show /api/tmdb prefix, the configuration is correct.');