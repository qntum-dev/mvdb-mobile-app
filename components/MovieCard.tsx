import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";
import { getMoviePosterUrl } from "@/services/api";
import { Movie } from "@/interfaces/interfaces";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-[48%] mb-4">
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
  );
};

export default MovieCard;
