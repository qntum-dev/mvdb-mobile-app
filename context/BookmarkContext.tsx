import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Bookmark } from '@/interfaces/interfaces';
import { getUserBookmarks, toggleBookmark as toggleBookmarkService, CreateBookmarkData, removeBookmark as removeBookmarkService } from '@/services/appwrite';
import { useAuth } from './AuthContext';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  filter: 'all' | 'movie' | 'tv' | 'person';
  setFilter: (filter: 'all' | 'movie' | 'tv' | 'person') => void;
  refreshBookmarks: () => Promise<void>;
  toggleBookmark: (bookmarkData: CreateBookmarkData) => Promise<boolean>;
  isBookmarked: (mediaId: number, mediaType: 'movie' | 'tv' | 'person') => boolean;
  removeBookmarkOptimistic: (mediaId: number, mediaType: 'movie' | 'tv' | 'person') => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv' | 'person'>('all');

  const refreshBookmarks = useCallback(async () => {
    if (!isAuthenticated) {
      setBookmarks([]);
      return;
    }

    try {
      setLoading(true);
      const userBookmarks = await getUserBookmarks(filter === 'all' ? undefined : filter);
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filter]);

  // Refresh bookmarks when filter changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshBookmarks();
    }
  }, [filter, isAuthenticated, refreshBookmarks]);

  const toggleBookmark = useCallback(async (bookmarkData: CreateBookmarkData): Promise<boolean> => {
    try {
      const result = await toggleBookmarkService(bookmarkData);
      // Immediately refresh bookmarks after toggling
      await refreshBookmarks();
      return result;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }, [refreshBookmarks]);

  const isBookmarked = useCallback((mediaId: number, mediaType: 'movie' | 'tv' | 'person'): boolean => {
    return bookmarks.some(bookmark => 
      bookmark.mediaId === mediaId && bookmark.mediaType === mediaType
    );
  }, [bookmarks]);

  const removeBookmarkOptimistic = useCallback(async (mediaId: number, mediaType: 'movie' | 'tv' | 'person'): Promise<void> => {
    // Optimistically remove the bookmark from state
    setBookmarks(prevBookmarks => 
      prevBookmarks.filter(bookmark => 
        !(bookmark.mediaId === mediaId && bookmark.mediaType === mediaType)
      )
    );

    try {
      await removeBookmarkService(mediaId, mediaType);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      // On error, refresh to restore the actual state
      await refreshBookmarks();
      throw error;
    }
  }, [refreshBookmarks]);

  const value: BookmarkContextType = {
    bookmarks,
    loading,
    filter,
    setFilter,
    refreshBookmarks,
    toggleBookmark,
    isBookmarked,
    removeBookmarkOptimistic,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};