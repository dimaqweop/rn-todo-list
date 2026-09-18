import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }

    if (trimmed !== todo.text) {
      try {
        setIsUpdating(true);
        await onEdit(todo.id, trimmed);
      } finally {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <View style={[styles.todoItem, isUpdating && styles.updating]}>
      <TouchableOpacity
        style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
        onPress={() => !isUpdating && onToggle(todo.id, !todo.completed)}
        disabled={isUpdating}
        activeOpacity={0.7}
      >
        {todo.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.todoEditInput}
          value={editText}
          onChangeText={setEditText}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          returnKeyType="done"
          autoFocus
          maxLength={120}
        />
      ) : (
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => !isUpdating && onToggle(todo.id, !todo.completed)}
          onLongPress={() => !isUpdating && setIsEditing(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.todoText,
              todo.completed && styles.todoTextCompleted,
            ]}
            numberOfLines={3}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.todoActions}>
        {isUpdating ? (
          <ActivityIndicator size="small" color="#6366f1" style={styles.actionBtn} />
        ) : (
          <>
            {!isEditing && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setEditText(todo.text);
                  setIsEditing(true);
                }}
                disabled={isUpdating}
                activeOpacity={0.6}
              >
                <Text style={styles.actionIcon}>✏️</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => onDelete(todo.id)}
              disabled={isUpdating}
              activeOpacity={0.6}
            >
              <Text style={styles.actionIcon}>🗑️</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

export default TodoItem;

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  updating: {
    opacity: 0.6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -2,
  },
  textContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 15,
    color: "#1e293b",
    lineHeight: 20,
  },
  todoTextCompleted: {
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  todoEditInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#6366f1",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
  todoActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "transparent",
  },
  actionIcon: {
    fontSize: 16,
  },
});