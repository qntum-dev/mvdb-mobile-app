require('dotenv').config();

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