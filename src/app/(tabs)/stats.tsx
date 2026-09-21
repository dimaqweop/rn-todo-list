import React from "react";
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTodo } from "@/context/TodoContext";

export default function StatsScreen() {
  const { stats, refreshing, fetchTodos, clearCompleted } = useTodo();

  const handleClearCompleted = () => {
    if (stats.completed === 0) return;

    Alert.alert(
      "Очищення завдань",
      `Ви впевнені, що хочете видалити всі виконані завдання (${stats.completed} шт.)?`,
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: () => clearCompleted(),
        },
      ]
    );
  };

  const getMotivationalMessage = () => {
    if (stats.total === 0) {
      return {
        title: "Немає завдань",
        desc: "Перейдіть на вкладку «Завдання» та додайте свою першу ціль!",
        icon: "sparkles" as const,
        color: "#6366f1",
      };
    }
    if (stats.percentage === 100) {
      return {
        title: "Чудова робота! 🏆",
        desc: "Всі завдання успішно виконано. Час відпочити або поставити нові цілі!",
        icon: "trophy" as const,
        color: "#10b981",
      };
    }
    if (stats.percentage >= 50) {
      return {
        title: "Гарний темп! 🚀",
        desc: "Більше половини завдань уже завершено. Продовжуйте в тому ж дусі!",
        icon: "rocket" as const,
        color: "#8b5cf6",
      };
    }
    return {
      title: "Початок покладено! 💪",
      desc: "Кожен маленький крок наближає вас до завершення списку.",
      icon: "flame" as const,
      color: "#f59e0b",
    };
  };

  const motivation = getMotivationalMessage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchTodos(true)}
            tintColor="#6366f1"
            colors={["#6366f1"]}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.headerIconWrapper}>
                <Ionicons name="stats-chart" size={24} color="#6366f1" />
              </View>
              <Text style={styles.headerTitle}>Статистика завдань</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Аналітика вашої продуктивності та виконання завдань
            </Text>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <View style={styles.overviewTextGroup}>
                <Text style={styles.overviewLabel}>Загальний прогрес</Text>
                <Text style={styles.overviewPercentage}>
                  {stats.percentage}%
                </Text>
              </View>
              <View
                style={[
                  styles.badgeIconWrapper,
                  { backgroundColor: `${motivation.color}18` },
                ]}
              >
                <Ionicons
                  name={motivation.icon}
                  size={26}
                  color={motivation.color}
                />
              </View>
            </View>

            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${stats.percentage}%`,
                    backgroundColor:
                      stats.percentage === 100 ? "#10b981" : "#6366f1",
                  },
                ]}
              />
            </View>

            <View style={styles.motivationBox}>
              <Text style={[styles.motivationTitle, { color: motivation.color }]}>
                {motivation.title}
              </Text>
              <Text style={styles.motivationDesc}>{motivation.desc}</Text>
            </View>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Показники</Text>
          </View>

          <View style={styles.grid}>
            <View style={[styles.metricCard, styles.borderBlue]}>
              <View style={[styles.iconBadge, styles.badgeBlue]}>
                <Ionicons name="layers-outline" size={22} color="#3b82f6" />
              </View>
              <Text style={styles.metricNumber}>{stats.total}</Text>
              <Text style={styles.metricTitle}>Всього завдань</Text>
              <Text style={styles.metricSub}>Усі створені справи</Text>
            </View>

            <View style={[styles.metricCard, styles.borderAmber]}>
              <View style={[styles.iconBadge, styles.badgeAmber]}>
                <Ionicons name="time-outline" size={22} color="#f59e0b" />
              </View>
              <Text style={styles.metricNumber}>{stats.active}</Text>
              <Text style={styles.metricTitle}>В процесі</Text>
              <Text style={styles.metricSub}>Активні завдання</Text>
            </View>

            <View style={[styles.metricCard, styles.borderEmerald]}>
              <View style={[styles.iconBadge, styles.badgeEmerald]}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#10b981"
                />
              </View>
              <Text style={styles.metricNumber}>{stats.completed}</Text>
              <Text style={styles.metricTitle}>Виконані</Text>
              <Text style={styles.metricSub}>Завершені завдання</Text>
            </View>

            <View style={[styles.metricCard, styles.borderViolet]}>
              <View style={[styles.iconBadge, styles.badgeViolet]}>
                <Ionicons name="trending-up-outline" size={22} color="#8b5cf6" />
              </View>
              <Text style={styles.metricNumber}>{stats.percentage}%</Text>
              <Text style={styles.metricTitle}>Успішність</Text>
              <Text style={styles.metricSub}>Рівень виконання</Text>
            </View>
          </View>

          {stats.total > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Співвідношення завдань</Text>
              <View style={styles.segmentedBar}>
                {stats.completed > 0 && (
                  <View
                    style={[
                      styles.segmentCompleted,
                      { flex: stats.completed },
                    ]}
                  />
                )}
                {stats.active > 0 && (
                  <View
                    style={[styles.segmentActive, { flex: stats.active }]}
                  />
                )}
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
                  <Text style={styles.legendText}>
                    Виконані: {stats.completed} ({stats.percentage}%)
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
                  <Text style={styles.legendText}>
                    В процесі: {stats.active} ({100 - stats.percentage}%)
                  </Text>
                </View>
              </View>
            </View>
          )}

          {stats.completed > 0 && (
            <TouchableOpacity
              style={styles.clearCompletedBtn}
              onPress={handleClearCompleted}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
              <Text style={styles.clearCompletedText}>
                Очистити виконані завдання ({stats.completed})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  headerIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  overviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  overviewTextGroup: {
    gap: 2,
  },
  overviewLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  overviewPercentage: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1e293b",
  },
  badgeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  motivationBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#6366f1",
  },
  motivationTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  motivationDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  sectionTitleRow: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  borderBlue: {
    borderTopWidth: 3,
    borderTopColor: "#3b82f6",
  },
  borderAmber: {
    borderTopWidth: 3,
    borderTopColor: "#f59e0b",
  },
  borderEmerald: {
    borderTopWidth: 3,
    borderTopColor: "#10b981",
  },
  borderViolet: {
    borderTopWidth: 3,
    borderTopColor: "#8b5cf6",
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badgeBlue: {
    backgroundColor: "#eff6ff",
  },
  badgeAmber: {
    backgroundColor: "#fffbeb",
  },
  badgeEmerald: {
    backgroundColor: "#ecfdf5",
  },
  badgeViolet: {
    backgroundColor: "#f5f3ff",
  },
  metricNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 2,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 12,
    color: "#94a3b8",
  },
  breakdownCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  segmentedBar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    marginBottom: 12,
  },
  segmentCompleted: {
    backgroundColor: "#10b981",
  },
  segmentActive: {
    backgroundColor: "#f59e0b",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  clearCompletedBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  clearCompletedText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
