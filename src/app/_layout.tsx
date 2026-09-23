import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Створення клієнта Convex
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false, // Вимикаємо веб-попередження для React Native
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ConvexProvider client={convex}>
         <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ConvexProvider>
    </SafeAreaProvider>
  );
}