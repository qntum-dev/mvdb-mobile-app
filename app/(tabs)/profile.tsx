import { icons } from "@/constants/icons";
import { Image, Text, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { TestAuth } from "@/components/TestAuth";
import { Link } from "expo-router";

const Profile = () => {
  const { isAuthenticated, isLoading, user, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Sign In Failed', 'Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Sign Out Failed', 'Please try again.');
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: handleSignOut, style: 'destructive' },
      ]
    );
  };

  if (isLoading) {
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
          <Image source={icons.person} className="size-20 mb-6" tintColor="#ef4444" />
          <Text className="text-white text-2xl font-bold mb-2">Welcome to MVDB</Text>
          <Text className="text-gray-400 text-base text-center mb-8">
            Sign in with Google to bookmark your favorite movies, shows, and people.
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
      <View className="px-6 pt-8">
        {/* Profile Header */}
        <View className="flex-col items-center mb-8">
          <View className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text className="text-white text-xl font-bold">{user?.name || 'User'}</Text>
          <Text className="text-gray-400 text-sm">{user?.email}</Text>
        </View>

        {/* Profile Options */}
        <View className="flex gap-2">
          <Link href="/save" asChild>

            <TouchableOpacity className="bg-gray-900 rounded-lg p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image source={icons.save} className="size-5 mr-3" tintColor="#ef4444" />
                  <Text className="text-white font-medium">My Bookmarks</Text>
                </View>
                <Text className="text-gray-400 text-sm">View saved items</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            className="bg-gray-900 rounded-lg p-4"
            onPress={confirmSignOut}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image source={icons.person} className="size-5 mr-3" tintColor="#ffffff" />
                <Text className="text-white font-medium">Sign Out</Text>
              </View>
              <Text className="text-gray-400 text-sm">→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="my-8">
          <Text className="text-gray-500 text-center text-sm">
            MVDB - Movie Database App
          </Text>
          <Text className="text-gray-500 text-center text-xs mt-1">
            Version 1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
