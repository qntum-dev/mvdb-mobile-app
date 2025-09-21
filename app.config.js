// Load environment variables from .env files
require("dotenv").config();

// Load production-specific env file if it exists and we're in production
if (process.env.NODE_ENV === 'production') {
  require("dotenv").config({ path: '.env.production', override: false });
}

// Production environment variable defaults - these will be used if not set elsewhere
const productionDefaults = {
  TMDB_URL: "https://tmdb-proxy.pritammondal-dev.workers.dev",
  MOVIE_API_KEY: "not_needed_with_proxy",
  TMDB_MEDIA_URL: "https://image.tmdb.org",
  APPWRITE_PROJECT_ID: "68cda924000a549f76b3",
  APPWRITE_DATABASE_ID: "68cda9f1000cc67756d8",
  APPWRITE_COLLECTION_ID: "metrics",
  APPWRITE_BOOKMARKS_COLLECTION_ID: "bookmarks"
};

// Apply defaults for any missing environment variables
Object.keys(productionDefaults).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = productionDefaults[key];
  }
});

// Log environment variables for debugging (excluding sensitive data)
console.log('🔧 App Config Environment Variables:');
console.log('  TMDB_URL:', process.env.TMDB_URL);
console.log('  MOVIE_API_KEY:', process.env.MOVIE_API_KEY ? '✓ present' : '✗ missing');
console.log('  TMDB_MEDIA_URL:', process.env.TMDB_MEDIA_URL);
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');

export default {
  expo: {
    name: "mvdb",
    slug: "mvdb",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/logo.png",
    scheme: "appwrite-callback-68cda924000a549f76b3", // Replace with your PROJECT_ID
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/logo.png",
        backgroundColor: "#ffffff",
      },
      package: "com.qntum.mvdb",
      // Add this intentFilters configuration for OAuth deep linking
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "mvdb",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.ico",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "e4f095ac-67d5-4a6c-9a8a-f058a0936141",
      },
      MOVIE_API_KEY: process.env.MOVIE_API_KEY,
      TMDB_URL: process.env.TMDB_URL,
      TMDB_MEDIA_URL: process.env.TMDB_MEDIA_URL,
      APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
      APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID: process.env.APPWRITE_COLLECTION_ID,
      APPWRITE_BOOKMARKS_COLLECTION_ID:
        process.env.APPWRITE_BOOKMARKS_COLLECTION_ID,
    },
  },
};
