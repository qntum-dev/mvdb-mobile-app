import { Link } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { images } from "@/constants/images";
import { getMoviePosterUrl } from "@/services/api";
import { Movie } from "@/interfaces/interfaces";

interface TrendingCardProps {
  movie: Movie;
  index: number;
}

const TrendingCard = ({ movie, index }: TrendingCardProps) => {
  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <TouchableOpacity className="w-32 relative pl-5">
        <Image
          source={{
            uri: movie.poster_path
              ? getMoviePosterUrl(movie.poster_path)
              : "https://placehold.co/440x660/1a1a1a/FFFFFF.png",
          }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />

        <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-14"
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        <Text
          className="text-sm font-bold mt-2 text-light-200"
          numberOfLines={2}
        >
          {movie.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
