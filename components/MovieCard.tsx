import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

import { icons } from "@/constants/icons";
import { getMoviePosterUrl } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { Movie } from "@/interfaces/interfaces";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  const { isAuthenticated } = useAuth();
  const { toggleBookmark, isBookmarked, refreshBookmarks } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshBookmarks();
    }
  }, [isAuthenticated]);

  const handleBookmarkToggle = async (e: any) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to bookmark movies.');
      return;
    }

    try {
      setIsLoading(true);
      await toggleBookmark({
        mediaType: 'movie',
        mediaId: id,
        title,
        posterPath: poster_path,
        rating: Math.round(vote_average * 10), // Convert to integer (e.g., 7.5 -> 75)
        releaseDate: release_date,
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-[48%] mb-4">
      <Link href={`/movie/${id}`} asChild>
        <TouchableOpacity>
          <View className="relative">
            <Image
              source={{
                uri: poster_path
                  ? getMoviePosterUrl(poster_path)
                  : "https://placehold.co/440x660/1a1a1a/FFFFFF.png",
              }}
              className="w-full h-52 rounded-lg"
              resizeMode="cover"
            />
            
            {/* Bookmark Button */}
            {isAuthenticated && (
              <TouchableOpacity
                onPress={handleBookmarkToggle}
                className="absolute top-2 right-2 p-2 bg-black/70 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Image
                    source={icons.save}
                    className="size-4"
                    tintColor={isBookmarked(id, 'movie') ? "#ef4444" : "#ffffff"}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
            {title}
          </Text>

          <View className="flex-row items-center justify-start gap-x-1 mt-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-yellow-400 font-bold">
              {vote_average.toFixed(1)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-xs text-gray-400 font-medium">
              {release_date ? new Date(release_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }) : 'TBA'}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default MovieCard;
