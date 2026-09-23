import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.headerTitleGroup}>
        <Text style={styles.headerIcon}>📝</Text>
        <Text style={styles.headerTitle}>Мій Список Завдань</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        {totalCount > 0
          ? `Виконано ${completedCount} з ${totalCount} завдань`
          : "Додайте своє перше завдання"}
      </Text>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  appHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 6,
  },
  headerIcon: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "400",
  },
});