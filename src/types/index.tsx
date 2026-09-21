export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: number;
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  percentage: number;
}

export interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  stats: TodoStats;
  fetchTodos: (isRefresh?: boolean) => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string, completed?: boolean) => Promise<void>;
  updateTodo: (id: string, text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
}
