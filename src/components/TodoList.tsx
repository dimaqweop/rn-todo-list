import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import type { Todo } from "@/types";
import { TodoItem } from "@/components/TodoItem";

interface TodoListProps {
  todos: Todo[];
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoList({
  todos,
  refreshing,
  onRefresh,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <View style={styles.todoEmpty}>
        <Text style={styles.emptyText}>
          Список завдань порожній. Додайте нове завдання вище!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.todoList}
      data={todos}
      keyExtractor={(item) => item.id}
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
  todoEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: 16,
  },
  emptyText: {
    color: "#94a3b8", 
    fontSize: 16,    
    textAlign: "center",
    lineHeight: 22,
  },
});