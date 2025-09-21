require('dotenv').config();

// Check if we have environment variables loaded, if not use defaults for production
if (!process.env.TMDB_URL) {
  // Set production defaults if .env files aren't loaded
  process.env.TMDB_URL = 'https://tmdb-proxy.pritammondal-dev.workers.dev';
  process.env.MOVIE_API_KEY = 'not_needed_with_proxy';
  process.env.TMDB_MEDIA_URL = 'https://image.tmdb.org';
  process.env.APPWRITE_PROJECT_ID = '68cda924000a549f76b3';
  process.env.APPWRITE_DATABASE_ID = '68cda9f1000cc67756d8';
  process.env.APPWRITE_COLLECTION_ID = 'metrics';
  process.env.APPWRITE_BOOKMARKS_COLLECTION_ID = 'bookmarks';
}

export default {
  expo: {
    name: "mvdb",
    slug: "mvdb",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/logo.png",
    scheme: "mvdb",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/logo.png",
        backgroundColor: "#ffffff"
      },
      package: "com.qntum.mvdb"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.ico"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "e4f095ac-67d5-4a6c-9a8a-f058a0936141"
      },
      MOVIE_API_KEY: process.env.MOVIE_API_KEY,
      TMDB_URL: process.env.TMDB_URL,
      TMDB_MEDIA_URL: process.env.TMDB_MEDIA_URL,
      APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
      APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID: process.env.APPWRITE_COLLECTION_ID,
      APPWRITE_BOOKMARKS_COLLECTION_ID: process.env.APPWRITE_BOOKMARKS_COLLECTION_ID,
    }
  }
};