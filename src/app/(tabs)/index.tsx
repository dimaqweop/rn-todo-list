import React from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";

export default function Index() {
  const todos = useQuery(api.todos.getTodos);

  const addTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  const handleAdd = async (text: string) => {
    try {
      await addTodo({ text });
    } catch (err: any) {
      Alert.alert("Помилка", err?.data ?? "Не вдалося створити завдання.");
      console.error(err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodo({ id: id as any });
    } catch (err: any) {
      Alert.alert("Помилка", "Не вдалося оновити статус завдання.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo({ id: id as any });
    } catch (err: any) {
      Alert.alert("Помилка", "Не вдалося видалити завдання.");
      console.error(err);
    }
  };

  const handleEdit = async (id: string, text: string) => {
    try {
      await updateTodo({ id: id as any, text });
    } catch (err: any) {
      Alert.alert("Помилка", err?.data ?? "Не вдалося оновити текст завдання.");
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Header
            totalCount={todos?.length ?? 0}
            completedCount={todos?.filter((t) => t.isCompleted).length ?? 0}
          />

          <TodoForm onAdd={handleAdd} />

          {todos === undefined ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Синхронізація з Convex...</Text>
            </View>
          ) : (
            <View style={styles.listWrapper}>
              <TodoList
                todos={todos}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 14,
  },
  listWrapper: {
    flex: 1,
  },
});