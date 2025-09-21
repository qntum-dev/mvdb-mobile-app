import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { getPersonProfileUrl } from "@/services/api";
import { Person } from "@/interfaces/interfaces";
import { icons } from "@/constants/icons";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";

interface PersonCardProps {
  person: Person;
}

const PersonCard = ({ person }: PersonCardProps) => {
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
      Alert.alert('Authentication Required', 'Please sign in to bookmark people.');
      return;
    }

    try {
      setIsLoading(true);
      await toggleBookmark({
        mediaType: 'person',
        mediaId: person.id,
        title: person.name,
        posterPath: person.profile_path,
        overview: person.known_for_department ? `Known for ${person.known_for_department}` : undefined,
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/person/${person.id}`} asChild>
      <TouchableOpacity className="items-center w-32 mx-2">
        <View className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
          <Image
            source={{
              uri: person.profile_path
                ? getPersonProfileUrl(person.profile_path)
                : "https://placehold.co/276x350/1a1a1a/FFFFFF.png",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Bookmark Button */}
          {isAuthenticated && (
            <TouchableOpacity
              onPress={handleBookmarkToggle}
              className="absolute bottom-0 right-0 p-1.5 bg-black/70 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Image
                  source={icons.save}
                  className="size-3"
                  tintColor={isBookmarked(person.id, 'person') ? "#ef4444" : "#ffffff"}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
        
        <Text
          className="text-sm font-medium text-white text-center"
          numberOfLines={2}
        >
          {person.name}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default PersonCard;