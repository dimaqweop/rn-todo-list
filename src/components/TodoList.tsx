import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Todo } from "@/types";
import { TodoItem } from "@/components/TodoItem";

export interface TodoListProps {
  todos?: Todo[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => Promise<any> | any;
  onToggle?: (id: string, completed?: boolean) => Promise<any> | any;
  onDelete?: (id: string) => Promise<any> | any;
  onEdit?: (id: string, text: string) => Promise<any> | any;
}

export function TodoList({
  todos,
  loading,
  refreshing,
  onRefresh,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  if (todos === undefined || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Синхронізація з Convex...</Text>
      </View>
    );
  }

  if (todos.length === 0) {
    return (
      <View style={styles.todoEmpty}>
        <Text style={styles.emptyIcon}>✨</Text>
        <Text style={styles.emptyTitle}>Список завдань порожній</Text>
        <Text style={styles.emptyText}>Додайте нове завдання вище!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.todoList}
      data={todos}
      keyExtractor={(item, index) => (item._id ?? item.id ?? String(index)) as string}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing ?? false}
            onRefresh={onRefresh}
            colors={["#6366f1"]}
            tintColor="#6366f1"
          />
        ) : undefined
      }
    />
  );
}

export default TodoList;

const styles = StyleSheet.create({
  todoList: {
    width: "100%",
  },
  listContent: {
    paddingBottom: 24,
  },
  separator: {
    height: 8,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748b",
  },
  todoEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
    gap: 6,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});