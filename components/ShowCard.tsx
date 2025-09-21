import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

import { icons } from "@/constants/icons";
import { getShowPosterUrl } from "@/services/api";
import { Show } from "@/interfaces/interfaces";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";

const ShowCard = ({
  id,
  poster_path,
  name,
  vote_average,
  first_air_date,
  overview,
}: Show) => {
  const { isAuthenticated } = useAuth();
  const { toggleBookmark, isBookmarked, refreshBookmarks } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshBookmarks();
    }
  }, [isAuthenticated]);

  const handleBookmarkToggle = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to bookmark TV shows.');
      return;
    }

    try {
      setIsLoading(true);
      await toggleBookmark({
        mediaType: 'tv',
        mediaId: id,
        title: name,
        posterPath: poster_path,
        rating: Math.round(vote_average * 10), // Convert to integer (e.g., 7.5 -> 75)
        releaseDate: first_air_date,
        overview,
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
      <Link href={`/show/${id}`} asChild>
        <TouchableOpacity>
          <View className="relative">
            <Image
              source={{
                uri: poster_path
                  ? getShowPosterUrl(poster_path)
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
                    tintColor={isBookmarked(id, 'tv') ? "#ef4444" : "#ffffff"}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {name}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1 mt-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-yellow-400 font-bold">
            {vote_average.toFixed(1)}
          </Text>
        </View>

          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-xs text-gray-400 font-medium">
              {first_air_date ? new Date(first_air_date).toLocaleDateString('en-US', { 
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

export default ShowCard;