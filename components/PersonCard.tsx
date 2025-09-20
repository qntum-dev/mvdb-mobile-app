import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { getPersonProfileUrl } from "@/services/api";
import { Person } from "@/interfaces/interfaces";

interface PersonCardProps {
  person: Person;
}

const PersonCard = ({ person }: PersonCardProps) => {
  return (
    <Link href={`/person/${person.id}`} asChild>
      <TouchableOpacity className="items-center w-32 mx-2">
        <View className="w-24 h-24 rounded-full overflow-hidden mb-2">
          <Image
            source={{
              uri: person.profile_path
                ? getPersonProfileUrl(person.profile_path)
                : "https://placehold.co/276x350/1a1a1a/FFFFFF.png",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
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