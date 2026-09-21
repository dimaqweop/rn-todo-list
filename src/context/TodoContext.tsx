import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Todo, TodoContextType, TodoStats } from "@/types";
import {
  getTodos as apiGetTodos,
  addTodo as apiAddTodo,
  toggleTodo as apiToggleTodo,
  updateTodoText as apiUpdateTodoText,
  deleteTodo as apiDeleteTodo,
} from "@/services/api";

const STORAGE_KEY = "@todo_items_storage";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to persist current todos array into AsyncStorage
  const saveToStorage = async (items: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Помилка збереження завдань в AsyncStorage:", err);
    }
  };

  // Helper to load fallback todos from AsyncStorage
  const loadFromStorage = async (): Promise<Todo[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Помилка завантаження з AsyncStorage:", err);
      return [];
    }
  };

  const fetchTodos = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await apiGetTodos();
      setTodos(data);
      await saveToStorage(data);
    } catch (err) {
      console.warn("API недоступне, завантаження з AsyncStorage...", err);
      const cached = await loadFromStorage();
      if (cached && cached.length > 0) {
        setTodos(cached);
        setError("Офлайн режим: дані завантажено з локальної пам'яті.");
      } else {
        setError(
          "Не вдалося з'єднатися з сервером. Переконайтеся, що json-server запущено (порт 3000)."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const newTodo = await apiAddTodo(trimmed);
      setTodos((prev) => {
        const updated = [...prev, newTodo];
        saveToStorage(updated);
        return updated;
      });
    } catch (err) {
      console.warn("API помилка при додаванні, зберігаємо локально...", err);
      const localTodo: Todo = {
        id: Date.now().toString(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      };
      setTodos((prev) => {
        const updated = [...prev, localTodo];
        saveToStorage(updated);
        return updated;
      });
    }
  };

  const toggleTodo = async (id: string, completed?: boolean) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    const newStatus = completed !== undefined ? completed : !target.completed;

    setTodos((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: newStatus } : t
      );
      saveToStorage(updated);
      return updated;
    });

    try {
      await apiToggleTodo(id, newStatus);
    } catch (err) {
      console.warn("Помилка синхронізації статусу з сервером:", err);
    }
  };

  const updateTodo = async (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setTodos((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, text: trimmed } : t
      );
      saveToStorage(updated);
      return updated;
    });

    try {
      await apiUpdateTodoText(id, trimmed);
    } catch (err) {
      console.warn("Помилка оновлення тексту завдання на сервері:", err);
    }
  };

  const deleteTodo = async (id: string) => {
    setTodos((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveToStorage(updated);
      return updated;
    });

    try {
      await apiDeleteTodo(id);
    } catch (err) {
      console.warn("Помилка видалення завдання з сервера:", err);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter((t) => t.completed);
    setTodos((prev) => {
      const updated = prev.filter((t) => !t.completed);
      saveToStorage(updated);
      return updated;
    });

    // Delete completed from server in background
    for (const todo of completedTodos) {
      try {
        await apiDeleteTodo(todo.id);
      } catch (err) {
        console.warn(`Не вдалося видалити завдання ${todo.id} з сервера`, err);
      }
    }
  };

  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, active, completed, percentage };
  }, [todos]);

  const value: TodoContextType = {
    todos,
    loading,
    refreshing,
    error,
    stats,
    fetchTodos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};

// Alias for convenience
export const useTodos = useTodo;