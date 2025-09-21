import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BookmarkProvider } from "@/context/BookmarkContext";

export default function RootLayout() {
  useEffect(() => {
    // Handle OAuth redirects
    const handleDeepLink = (url: string) => {
      if (url.includes('/auth/success') || url.includes('/auth/failure')) {
        console.log('OAuth redirect received:', url);
        // The AuthContext will handle checking the session
      }
    };

    // Handle initial URL if app was opened by deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle subsequent deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, []);

  return (
    <AuthProvider>
      <BookmarkProvider>
        <StatusBar hidden={true} />

        <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="person/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="show/[id]"
          options={{
            headerShown: false,
          }}
        />
        </Stack>
      </BookmarkProvider>
    </AuthProvider>
  );
}
