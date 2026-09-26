import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceSubtle: string;
  border: string;
  borderFocus: string;
  text: string;
  textMuted: string;
  textPlaceholder: string;
  primary: string;
  primaryLight: string;
  primaryText: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  dangerBorder: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  progressBarTrack: string;
  checkboxBorder: string;
  cardShadow: string;
  statusBarStyle: "light" | "dark";
  // Backward compatibility aliases
  surfaceHighlight?: string;
  dangerDisabled?: string;
}

export const lightColors: ThemeColors = {
  bg: "#f5f7fb",
  surface: "#ffffff",
  surfaceSubtle: "#f8fafc",
  border: "#e2e8f0",
  borderFocus: "#6366f1",
  text: "#1e293b",
  textMuted: "#64748b",
  textPlaceholder: "#94a3b8",
  primary: "#6366f1",
  primaryLight: "#e0e7ff",
  primaryText: "#ffffff",
  success: "#10b981",
  successLight: "#ecfdf5",
  warning: "#f59e0b",
  warningLight: "#fffbeb",
  danger: "#ef4444",
  dangerLight: "#fef2f2",
  dangerBorder: "#fee2e2",
  tabBarBg: "#ffffff",
  tabBarBorder: "#e2e8f0",
  tabBarActive: "#6366f1",
  tabBarInactive: "#94a3b8",
  progressBarTrack: "#f1f5f9",
  checkboxBorder: "#cbd5e1",
  cardShadow: "#000000",
  statusBarStyle: "dark",
  surfaceHighlight: "#e2e8f0",
  dangerDisabled: "#9ca3af",
};

export const darkColors: ThemeColors = {
  bg: "#0f172a",
  surface: "#1e293b",
  surfaceSubtle: "#162032",
  border: "#334155",
  borderFocus: "#818cf8",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  textPlaceholder: "#64748b",
  primary: "#6366f1",
  primaryLight: "rgba(99, 102, 241, 0.2)",
  primaryText: "#ffffff",
  success: "#10b981",
  successLight: "rgba(16, 185, 129, 0.2)",
  warning: "#f59e0b",
  warningLight: "rgba(245, 158, 11, 0.2)",
  danger: "#ef4444",
  dangerLight: "rgba(239, 68, 68, 0.2)",
  dangerBorder: "rgba(239, 68, 68, 0.35)",
  tabBarBg: "#1e293b",
  tabBarBorder: "#334155",
  tabBarActive: "#818cf8",
  tabBarInactive: "#64748b",
  progressBarTrack: "#334155",
  checkboxBorder: "#475569",
  cardShadow: "#000000",
  statusBarStyle: "light",
  surfaceHighlight: "#334155",
  dangerDisabled: "#475569",
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = "@todo_theme_mode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error("Помилка завантаження теми з AsyncStorage:", error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const nextMode = !isDarkMode;
      setIsDarkMode(nextMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextMode));
    } catch (error) {
      console.error("Помилка збереження теми:", error);
    }
  };

  const currentColors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        colors: currentColors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};