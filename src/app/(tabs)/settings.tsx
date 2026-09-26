import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors);

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerTitleGroup}>
          <Ionicons name="settings" size={26} color={colors.primary} />
          <Text style={styles.title}>Налаштування</Text>
        </View>

        {/* Секція оформлення */}
        <Text style={styles.sectionHeader}>ТЕМА ОФОРМЛЕННЯ</Text>

        <View style={styles.actionButton}>
          <View style={styles.buttonLeft}>
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(129, 140, 248, 0.2)"
                    : "#e0e7ff",
                },
              ]}
            >
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.actionButtonText}>
              {isDarkMode ? "Темна тема" : "Світла тема"}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Секція керування даними Convex */}
        <Text style={styles.sectionHeader}>КЕРУВАННЯ ХМАРОЮ CONVEX</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleClearCompleted}
          activeOpacity={0.7}
        >
          <View style={styles.buttonLeft}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: colors.warningLight },
              ]}
            >
              <Ionicons
                name="checkmark-done"
                size={20}
                color={colors.warning}
              />
            </View>
            <Text style={styles.actionButtonText}>
              Видалити виконані завдання
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClearAll}
          activeOpacity={0.7}
        >
          <View style={styles.buttonLeft}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: colors.dangerLight },
              ]}
            >
              <Ionicons name="trash" size={20} color={colors.danger} />
            </View>
            <Text style={styles.dangerButtonText}>
              Видалити абсолютно всі завдання
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.danger} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
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
      color: colors.text,
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: "700",
      marginTop: 16,
      marginBottom: 8,
      letterSpacing: 0.5,
      color: colors.textMuted,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 10,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.cardShadow,
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
      color: colors.text,
    },
    dangerButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 10,
      backgroundColor: colors.surface,
      borderColor: colors.dangerBorder,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    dangerButtonText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.danger,
    },
  });


