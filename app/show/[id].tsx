import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { icons } from "@/constants/icons";
import useFetch from "@/services/usefetch";
import { fetchShowDetails, fetchShowVideos, getShowPosterUrl } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";
import VideoModal from "@/components/VideoModal";
import { Video } from "@/interfaces/interfaces";

interface ShowInfoProps {
  label: string;
  value?: string | number | null;
}

const ShowInfo = ({ label, value }: ShowInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const { toggleBookmark, isBookmarked, refreshBookmarks } = useBookmarks();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const { data: show, loading: showLoading } = useFetch(() =>
    fetchShowDetails(id as string)
  );

  const { data: videos, loading: videosLoading } = useFetch(() =>
    fetchShowVideos(id as string)
  );

  useEffect(() => {
    if (isAuthenticated) {
      refreshBookmarks();
    }
  }, [isAuthenticated]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to bookmark TV shows.');
      return;
    }

    if (!show) return;

    try {
      setBookmarkLoading(true);
      await toggleBookmark({
        mediaType: 'tv',
        mediaId: show.id,
        title: show.name,
        posterPath: show.poster_path,
        rating: Math.round(show.vote_average * 10), // Convert to integer (e.g., 7.5 -> 75)
        releaseDate: show.first_air_date,
        overview: show.overview,
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handlePlayPress = () => {
    if (videos && videos.results && videos.results.length > 0) {
      // Find the first trailer or teaser, otherwise use the first video
      const trailer = videos.results.find(
        (v) => v.type === "Trailer" || v.type === "Teaser"
      ) || videos.results[0];

      setSelectedVideo(trailer);
      setShowVideoModal(true);
    }
  };

  if (showLoading || videosLoading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: show?.poster_path
                ? getShowPosterUrl(show.poster_path)
                : "https://placehold.co/440x660/1a1a1a/FFFFFF.png",
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity
            className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
            onPress={handlePlayPress}
          >
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>

          {/* Bookmark Button */}
          {isAuthenticated && (
            <TouchableOpacity
              className="absolute bottom-5 left-5 rounded-full size-14 bg-black/70 flex items-center justify-center"
              onPress={handleBookmarkToggle}
              disabled={bookmarkLoading}
            >
              {bookmarkLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Image
                  source={icons.save}
                  className="size-6"
                  tintColor={show && isBookmarked(show.id, 'tv') ? "#ef4444" : "#ffffff"}
                />
              )}
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{show?.name}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {show?.first_air_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">
              {show?.number_of_seasons} Season{show?.number_of_seasons !== 1 ? 's' : ''}
            </Text>
            {show?.episode_run_time && show.episode_run_time.length > 0 && (
              <Text className="text-light-200 text-sm">
                • {show.episode_run_time[0]}m
              </Text>
            )}
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {(show?.vote_average ?? 0).toFixed(1)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({show?.vote_count} votes)
            </Text>
          </View>

          <ShowInfo label="Overview" value={show?.overview} />
          <ShowInfo
            label="Genres"
            value={show?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-full">
            <ShowInfo
              label="Status"
              value={show?.status}
            />
            <ShowInfo
              label="Episodes"
              value={show?.number_of_episodes}
            />
          </View>

          <ShowInfo
            label="Networks"
            value={
              show?.networks?.map((n) => n.name).join(" • ") ||
              "N/A"
            }
          />

          <ShowInfo
            label="Created By"
            value={
              show?.created_by?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />

          {show?.last_episode_to_air && (
            <ShowInfo
              label="Last Episode"
              value={`${show.last_episode_to_air.name} (S${show.last_episode_to_air.season_number}E${show.last_episode_to_air.episode_number})`}
            />
          )}

          {show?.next_episode_to_air && (
            <ShowInfo
              label="Next Episode"
              value={`${show.next_episode_to_air.name} (S${show.next_episode_to_air.season_number}E${show.next_episode_to_air.episode_number})`}
            />
          )}
        </View>
      </ScrollView>

      {/* <TouchableOpacity
        className="absolute bottom-16 left-0 right-0 mx-5 bg-[#dc2626] rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity> */}

      <VideoModal
        visible={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        video={selectedVideo}
      />
    </View>
  );
};

export default Details;