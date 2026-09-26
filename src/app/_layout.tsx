import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Створення клієнта Convex
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false, // Вимикаємо веб-попередження для React Native
});

function RootNavigation() {
  const { colors, isDarkMode } = useTheme();

  return (
    <>


      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.bg }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>

    </>
  );
}

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </ConvexProvider>
  );
}