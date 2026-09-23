import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SettingsScreen() {
  const clearCompleted = useMutation(api.todos.clearCompleted);
  const clearAll = useMutation(api.todos.clearAll);

  const handleClearCompleted = () => {
    Alert.alert(
      "Очистити виконані",
      "Ви впевнені, що хочете видалити всі виконані завдання?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await clearCompleted();
              Alert.alert("Успішно", `Видалено ${res.deletedCount} завдань`);
            } catch (err) {
              Alert.alert("Помилка", "Не вдалося очистити виконані завдання");
              console.error(err);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Видалити ВСІ завдання",
      "Цю дію неможливо буде скасувати. Видалити всі завдання з хмари Convex?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити все",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await clearAll();
              Alert.alert(
                "Успішно",
                `Базу очищено. Видалено ${res.deletedCount} завдань`
              );
            } catch (err) {
              Alert.alert("Помилка", "Не вдалося очистити базу даних");
              console.error(err);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerTitleGroup}>
          <Ionicons name="settings" size={26} color="#6366f1" />
          <Text style={styles.title}>Налаштування</Text>
        </View>

        {/* Секція керування даними Convex */}
        <Text style={styles.sectionHeader}>КЕРУВАННЯ ХМАРОЮ CONVEX</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleClearCompleted}
          activeOpacity={0.7}
        >
          <View style={styles.buttonLeft}>
            <View style={[styles.iconWrap, { backgroundColor: "#fffbeb" }]}>
              <Ionicons name="checkmark-done" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.actionButtonText}>Видалити виконані завдання</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClearAll}
          activeOpacity={0.7}
        >
          <View style={styles.buttonLeft}>
            <View style={[styles.iconWrap, { backgroundColor: "#fef2f2" }]}>
              <Ionicons name="trash" size={20} color="#ef4444" />
            </View>
            <Text style={styles.dangerButtonText}>Видалити абсолютно всі завдання</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#fca5a5" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  content: {
    padding: 20,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e293b",
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
    color: "#64748b",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderColor: "#fee2e2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#ef4444",
  },
});
