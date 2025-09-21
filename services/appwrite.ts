import { Client, Databases, ID, Query, Account, OAuthProvider } from "react-native-appwrite";
import { User, Bookmark, CreateBookmarkData } from "@/interfaces/interfaces";
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Add these type definitions if they're not in your interfaces file
interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface TrendingMovie {
  $id: string;
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

const DATABASE_ID = Constants.expoConfig?.extra?.APPWRITE_DATABASE_ID!;
const SEARCH_COLLECTION_ID = Constants.expoConfig?.extra?.APPWRITE_COLLECTION_ID!;
const BOOKMARKS_COLLECTION_ID = Constants.expoConfig?.extra?.APPWRITE_BOOKMARKS_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(Constants.expoConfig?.extra?.APPWRITE_PROJECT_ID!)
  .setPlatform('com.qntum.mvdb');

const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SEARCH_COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        SEARCH_COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, SEARCH_COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SEARCH_COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// ===========================================
// AUTHENTICATION SERVICES
// ===========================================

// Login with Google - Using the recommended Appwrite mobile OAuth flow
export const loginWithGoogle = async (): Promise<void> => {
  try {
    console.log('Starting Google OAuth flow with createOAuth2Token...');

    // Create proper redirect URI using expo-auth-session
    const redirectUri = makeRedirectUri({
      preferLocalhost: true,
      scheme: 'appwrite-callback-68cda924000a549f76b3' // Your PROJECT_ID
    });

    console.log('Redirect URI:', redirectUri);

    // Create the OAuth2 token URL
    const loginUrl = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri,
      redirectUri // Use same URI for success and failure
    );

    // Open the browser with the OAuth URL
    const result = await WebBrowser.openAuthSessionAsync(
      loginUrl.toString(),
      redirectUri
    );

    // Check if the user completed the flow
    if (result.type === 'success' && result.url) {
      // Extract the secret and userId from the callback URL
      const url = new URL(result.url);
      const secret = url.searchParams.get('secret');
      const userId = url.searchParams.get('userId');

      if (secret && userId) {
        // Create the session manually using the extracted credentials
        await account.createSession(userId, secret);

        const user = await getCurrentUser();
        if (user) {
          console.log('OAuth login successful! User:', user.name);
        }
      } else {
        throw new Error('Missing OAuth credentials in callback URL');
      }
    } else if (result.type === 'cancel') {
      console.log('OAuth flow was cancelled by user');
    } else {
      console.log('OAuth flow failed:', result);
    }

  } catch (error: any) {
    console.error('Google login error:', error.message);
    throw error;
  }
};

// Get current user session
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await account.get();
    return user as User;
  } catch (error: any) {
    // Silently handle expected authentication errors for guests/anonymous users
    // These are normal when no user is logged in
    return null;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Login with Email/Password
export const loginWithEmail = async (email: string, password: string): Promise<void> => {
  try {
    await account.createEmailSession(email, password);
    console.log('Email login successful');
  } catch (error: any) {
    console.error('Email login error:', error);
    throw error;
  }
};

// Register with Email/Password
export const registerWithEmail = async (email: string, password: string, name: string): Promise<void> => {
  try {
    // Create account
    await account.create(ID.unique(), email, password, name);
    // Login immediately after registration
    await account.createEmailSession(email, password);
    console.log('Registration and login successful');
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
};

// ===========================================
// BOOKMARK SERVICES  
// ===========================================

// Create a bookmark
export const createBookmark = async (bookmarkData: CreateBookmarkData): Promise<Bookmark> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const bookmark = await database.createDocument(
      DATABASE_ID,
      BOOKMARKS_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        ...bookmarkData,
      }
    );

    return bookmark as Bookmark;
  } catch (error) {
    console.error('Create bookmark error:', error);
    throw error;
  }
};

// Get user bookmarks
export const getUserBookmarks = async (mediaType?: 'movie' | 'tv' | 'person'): Promise<Bookmark[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const queries = [Query.equal('userId', user.$id)];

    if (mediaType) {
      queries.push(Query.equal('mediaType', mediaType));
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      BOOKMARKS_COLLECTION_ID,
      queries
    );

    return result.documents as Bookmark[];
  } catch (error) {
    console.error('Get bookmarks error:', error);
    throw error;
  }
};

// Check if item is bookmarked
export const isBookmarked = async (mediaId: number, mediaType: 'movie' | 'tv' | 'person'): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const result = await database.listDocuments(
      DATABASE_ID,
      BOOKMARKS_COLLECTION_ID,
      [
        Query.equal('userId', user.$id),
        Query.equal('mediaId', mediaId),
        Query.equal('mediaType', mediaType),
        Query.limit(1)
      ]
    );

    return result.documents.length > 0;
  } catch (error) {
    console.error('Check bookmark error:', error);
    return false;
  }
};

// Remove bookmark
export const removeBookmark = async (mediaId: number, mediaType: 'movie' | 'tv' | 'person'): Promise<void> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const result = await database.listDocuments(
      DATABASE_ID,
      BOOKMARKS_COLLECTION_ID,
      [
        Query.equal('userId', user.$id),
        Query.equal('mediaId', mediaId),
        Query.equal('mediaType', mediaType),
        Query.limit(1)
      ]
    );

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        result.documents[0].$id
      );
    }
  } catch (error) {
    console.error('Remove bookmark error:', error);
    throw error;
  }
};

// Toggle bookmark (add if not exists, remove if exists)
export const toggleBookmark = async (bookmarkData: CreateBookmarkData): Promise<boolean> => {
  try {
    const isCurrentlyBookmarked = await isBookmarked(bookmarkData.mediaId, bookmarkData.mediaType);

    if (isCurrentlyBookmarked) {
      await removeBookmark(bookmarkData.mediaId, bookmarkData.mediaType);
      return false;
    } else {
      await createBookmark(bookmarkData);
      return true;
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    throw error;
  }
};
