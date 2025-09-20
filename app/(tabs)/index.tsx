import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  fetchTrendingMovies,
  fetchPopularPeople,
  fetchPopularMovies,
  fetchTrendingShows,
} from "@/services/api";
import useFetch from "@/services/usefetch";

import { icons } from "@/constants/icons";

import MovieCard from "@/components/MovieCard";
import PersonCard from "@/components/PersonCard";
import ShowCard from "@/components/ShowCard";
import TrendingCard from "@/components/TrendingCard";

const Index = () => {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(fetchTrendingMovies);

  const {
    data: popularPeople,
    loading: peopleLoading,
    error: peopleError,
  } = useFetch(fetchPopularPeople);

  const {
    data: popularMovies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(fetchPopularMovies);

  const {
    data: trendingShows,
    loading: showsLoading,
    error: showsError,
  } = useFetch(fetchTrendingShows);

  const isLoading = trendingLoading || peopleLoading || moviesLoading || showsLoading;
  const hasError = trendingError || peopleError || moviesError || showsError;

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{
          width: 90,
          height: 60,
          alignSelf: 'center',
          marginTop: 60,
          // marginBottom: 20,
        }}>
          <Image
            source={icons.logo}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="contain"
          />
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#ffffff"
            className="mt-20 self-center"
          />
        ) : hasError ? (
          <Text className="text-white text-center mt-20">
            Error loading data. Please try again.
          </Text>
        ) : (
          <View className="flex-1 mt-12">
            {/* Trending Today Section */}
            {trendingMovies && trendingMovies.length > 0 && (
              <View className="mb-8">
                <View className="mb-4">
                  <Text className="text-2xl font-bold">
                    <Text className="text-white">Tren</Text>
                    <Text className="text-red-500">ding today</Text>
                  </Text>
                </View>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={trendingMovies.slice(0, 10)}
                  contentContainerStyle={{
                    gap: 16,
                    paddingHorizontal: 4,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )}

            {/* Most Famous People Section */}
            {popularPeople && popularPeople.length > 0 && (
              <View className="mb-8">
                <View className="mb-4">
                  <Text className="text-2xl font-bold">
                    <Text className="text-white">Most </Text>
                    <Text className="text-red-500">Famous People</Text>
                  </Text>
                </View>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={popularPeople.slice(0, 10)}
                  contentContainerStyle={{
                    gap: 16,
                    paddingHorizontal: 4,
                  }}
                  renderItem={({ item }) => <PersonCard person={item} />}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )}

            {/* Popular Movies Section */}
            {popularMovies && popularMovies.length > 0 && (
              <View className="mb-8">
                <View className="mb-4">
                  <Text className="text-2xl font-bold">
                    <Text className="text-white">Pop</Text>
                    <Text className="text-red-500">ular Movies</Text>
                  </Text>
                </View>
                <FlatList
                  data={popularMovies.slice(0, 6)}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                  scrollEnabled={false}
                  contentContainerStyle={{ gap: 16 }}
                />
              </View>
            )}

            {/* Trending Shows Section */}
            {trendingShows && trendingShows.length > 0 && (
              <View className="mb-8">
                <View className="mb-4">
                  <Text className="text-2xl font-bold">
                    <Text className="text-white">Trending </Text>
                    <Text className="text-red-500">Shows</Text>
                  </Text>
                </View>
                <FlatList
                  data={trendingShows.slice(0, 6)}
                  renderItem={({ item }) => <ShowCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                  scrollEnabled={false}
                  contentContainerStyle={{ gap: 16 }}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
