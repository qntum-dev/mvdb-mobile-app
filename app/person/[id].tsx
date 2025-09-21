import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { icons } from "@/constants/icons";
import { Cast_Credits } from "@/interfaces/interfaces";
import {
  fetchPersonCredits,
  fetchPersonDetails,
  getMoviePosterUrl,
  getPersonProfileUrl,
  getShowPosterUrl,
} from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";
import useFetch from "@/services/usefetch";

interface PersonInfoProps {
  label: string;
  value?: string | number | null;
}

const PersonInfo = ({ label, value }: PersonInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const CreditCard = ({ credit }: { credit: Cast_Credits }) => {
  const isMovie = credit.media_type === "movie";
  const title = isMovie ? credit.title : credit.name;
  const releaseDate = isMovie ? credit.release_date : credit.first_air_date;
  const posterUrl = credit.poster_path
    ? isMovie
      ? getMoviePosterUrl(credit.poster_path)
      : getShowPosterUrl(credit.poster_path)
    : "https://placehold.co/440x660/1a1a1a/FFFFFF.png";

  return (
    <Link href={isMovie ? `/movie/${credit.id}` : `/show/${credit.id}`} asChild>
      <TouchableOpacity className="mr-4">
        <Image
          source={{ uri: posterUrl }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-white text-xs font-semibold mt-2 w-32" numberOfLines={2}>
          {title}
        </Text>
        <Text className="text-gray-400 text-xs mt-1">
          {credit.character ? `as ${credit.character}` : ""}
        </Text>
        <Text className="text-gray-400 text-xs">
          {releaseDate ? new Date(releaseDate).getFullYear() : "TBA"}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const { toggleBookmark, isBookmarked, refreshBookmarks } = useBookmarks();
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const { data: person, loading: personLoading } = useFetch(() =>
    fetchPersonDetails(id as string)
  );

  const { data: credits, loading: creditsLoading } = useFetch(() =>
    fetchPersonCredits(id as string)
  );

  useEffect(() => {
    if (isAuthenticated) {
      refreshBookmarks();
    }
  }, [isAuthenticated]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to bookmark people.');
      return;
    }

    if (!person) return;

    try {
      setBookmarkLoading(true);
      await toggleBookmark({
        mediaType: 'person',
        mediaId: person.id,
        title: person.name,
        posterPath: person.profile_path,
        overview: person.biography ? person.biography.substring(0, 200) + (person.biography.length > 200 ? '...' : '') : undefined,
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (personLoading || creditsLoading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  // Sort credits by popularity and remove duplicates
  const sortedCredits = credits?.cast
    ?.filter((credit, index, self) =>
      index === self.findIndex((c) => c.id === credit.id)
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="flex-row px-5 mt-5">
          <Image
            source={{
              uri: person?.profile_path
                ? getPersonProfileUrl(person.profile_path)
                : "https://placehold.co/276x350/1a1a1a/FFFFFF.png",
            }}
            className="w-32 h-48 rounded-lg"
            resizeMode="cover"
          />

          <View className="flex-1 ml-4">
            <Text className="text-white font-bold text-2xl">{person?.name}</Text>

            {/* Bookmark Button */}
            {isAuthenticated && (
              <TouchableOpacity
                className="absolute top-0 right-0 rounded-full size-10 bg-black/70 flex items-center justify-center"
                onPress={handleBookmarkToggle}
                disabled={bookmarkLoading}
              >
                {bookmarkLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Image
                    source={icons.save}
                    className="size-5"
                    tintColor={person && isBookmarked(person.id, 'person') ? "#ef4444" : "#ffffff"}
                  />
                )}
              </TouchableOpacity>
            )}

            <PersonInfo
              label="Known For"
              value={person?.known_for_department}
            />

            <PersonInfo
              label="Birthday"
              value={
                person?.birthday
                  ? `${new Date(person.birthday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} ${person.birthday && !person.deathday
                    ? `(${new Date().getFullYear() -
                    new Date(person.birthday).getFullYear()
                    } years old)`
                    : ""
                  }`
                  : null
              }
            />

            {person?.place_of_birth && (
              <PersonInfo
                label="Place of Birth"
                value={person.place_of_birth}
              />
            )}
          </View>
        </View>

        <View className="px-5">
          {person?.biography && (
            <View className="mt-5">
              <Text className="text-white font-bold text-lg mb-2">Biography</Text>
              <Text className="text-light-200 text-sm leading-6">
                {person.biography}
              </Text>
            </View>
          )}

          {person?.also_known_as && person.also_known_as.length > 0 && (
            <PersonInfo
              label="Also Known As"
              value={person.also_known_as.join(" • ")}
            />
          )}

          {sortedCredits && sortedCredits.length > 0 && (
            <View className="mt-5">
              <Text className="text-white font-bold text-lg mb-4">
                Known For
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={sortedCredits}
                keyExtractor={(item) => `${item.id}-${item.credit_id}`}
                renderItem={({ item }) => <CreditCard credit={item} />}
                contentContainerStyle={{ paddingRight: 20 }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-[#dc2626] rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default Details;