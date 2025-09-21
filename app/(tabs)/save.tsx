import { icons } from "@/constants/icons";
import { Image, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { useEffect, useState, useRef } from "react";
import { Bookmark } from "@/interfaces/interfaces";
import { Link } from "expo-router";
import { Trash2 } from "lucide-react-native";

interface BookmarkItemProps {
  item: Bookmark;
}

const BookmarkItem = ({ item }: BookmarkItemProps) => {
  const { removeBookmarkOptimistic } = useBookmarks();
  const [isDeleting, setIsDeleting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(1)).current;
  const getHref = () => {
    switch (item.mediaType) {
      case 'movie':
        return `/movie/${item.mediaId}`;
      case 'tv':
        return `/show/${item.mediaId}`;
      case 'person':
        return `/person/${item.mediaId}`;
      default:
        return `/movie/${item.mediaId}`;
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    Alert.alert(
      "Remove Bookmark",
      `Are you sure you want to remove "${item.title}" from your bookmarks?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);

            // Animate the removal
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(heightAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              })
            ]).start(async () => {
              try {
                await removeBookmarkOptimistic(item.mediaId, item.mediaType);
              } catch (error) {
                console.error('Error removing bookmark:', error);
                Alert.alert('Error', 'Failed to remove bookmark. Please try again.');
                // Restore animation if error
                Animated.parallel([
                  Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.timing(heightAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                  })
                ]).start();
                setIsDeleting(false);
              }
            });
          }
        }
      ]
    );
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scaleY: heightAnim }]
      }}
    >
      <Link href={getHref()} asChild>
        <TouchableOpacity className="flex-row bg-gray-900 rounded-lg p-3 mb-3">
          <Image
            source={{
              uri: item.posterPath
                ? `https://image.tmdb.org/t/p/w200${item.posterPath}`
                : "https://placehold.co/120x180/1a1a1a/FFFFFF.png",
            }}
            className="w-16 h-24 rounded-lg mr-3"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-white font-bold text-base mb-1" numberOfLines={2}>
              {item.title}
            </Text>
            <Text className="text-gray-400 text-sm capitalize mb-1">
              {item.mediaType}
            </Text>
            {item.rating && (
              <View className="flex-row items-center mb-1">
                <Image source={icons.star} className="size-3 mr-1" />
                <Text className="text-yellow-400 text-sm font-medium">
                  {(item.rating / 10).toFixed(1)}/10
                </Text>
              </View>
            )}
            {item.releaseDate && (
              <Text className="text-gray-500 text-xs">
                {new Date(item.releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            )}
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={handleDelete}
            className="ml-3 p-2 rounded-full bg-red-600/20 justify-center items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <Trash2 size={18} color="#ef4444" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );
};

const Save = () => {
  const { isAuthenticated, isLoading: authLoading, signInWithGoogle, user } = useAuth();
  const { bookmarks, loading, filter, setFilter, refreshBookmarks } = useBookmarks();

  useEffect(() => {
    if (isAuthenticated) {
      refreshBookmarks();
    }
  }, [isAuthenticated, filter, refreshBookmarks]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Sign In Failed', 'Please try again.');
    }
  };

  if (authLoading) {
    return (
      <SafeAreaView className="bg-black flex-1">
        <View className="flex justify-center items-center flex-1">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-2">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="bg-black flex-1 px-6">
        <View className="flex justify-center items-center flex-1">
          <Image source={icons.save} className="size-16 mb-6" tintColor="#ef4444" />
          <Text className="text-white text-2xl font-bold mb-2">Your Bookmarks</Text>
          <Text className="text-gray-400 text-base text-center mb-8">
            Sign in with Google to save and sync your favorite movies, shows, and people.
          </Text>
          <TouchableOpacity
            onPress={handleSignIn}
            className="bg-red-600 px-8 py-3 rounded-lg flex-row items-center"
          >
            <Text className="text-white font-semibold text-base mr-2">Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-black flex-1">
      <View className="px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">My Bookmarks</Text>
            <Text className="text-gray-400 text-sm">
              {bookmarks.length} {bookmarks.length === 1 ? 'item' : 'items'} saved
            </Text>
          </View>
          <Image source={icons.save} className="size-8" tintColor="#ef4444" />
        </View>

        {/* Filter Tabs */}
        <View className="flex-row mb-4">
          {[{ key: 'all', label: 'All' }, { key: 'movie', label: 'Movies' }, { key: 'tv', label: 'TV Shows' }, { key: 'person', label: 'People' }].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key as any)}
              className={`mr-4 pb-2 ${filter === tab.key ? 'border-b-2 border-red-600' : ''}`}
            >
              <Text className={`${filter === tab.key ? 'text-red-600' : 'text-gray-400'} font-medium`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-2">Loading bookmarks...</Text>
          </View>
        ) : bookmarks.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            {/* <Image source={icons.save} className="size-16 mb-4" tintColor="#666" /> */}
            <Text className="text-white text-lg font-medium mb-2">
              No bookmarks yet
            </Text>
            <Text className="text-gray-500 text-center">
              Start exploring and bookmark your favorite {filter === 'all' ? 'content' : filter === 'tv' ? 'shows' : `${filter}s`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={bookmarks}
            renderItem={({ item }) => <BookmarkItem item={item} />}
            keyExtractor={(item) => item.$id || `${item.mediaType}-${item.mediaId}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Save;
