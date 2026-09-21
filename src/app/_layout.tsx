import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TodoProvider } from "@/context/TodoContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TodoProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TodoProvider>
    </SafeAreaProvider>
  );
}