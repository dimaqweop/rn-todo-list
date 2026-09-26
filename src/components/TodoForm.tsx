import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeColors, useTheme } from "@/context/ThemeContext";

export interface TodoFormProps {
  onAdd: (text: string) => Promise<any> | any;
  loading?: boolean;
}

export function TodoForm({ onAdd, loading = false }: TodoFormProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = !text.trim() || isSubmitting || loading;

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting || loading) return;

    Keyboard.dismiss();

    try {
      setIsSubmitting(true);
      await onAdd(trimmed);
      setText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const busy = isSubmitting || loading;

  return (
    <View style={styles.todoForm}>
      <TextInput
        style={[
          styles.todoInput,
          isFocused && styles.todoInputFocused,
          busy && styles.todoInputDisabled,
        ]}
        placeholder="Що потрібно зробити?"
        placeholderTextColor={colors.textPlaceholder}
        value={text}
        onChangeText={setText}
        editable={!busy}
        maxLength={120}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        style={[styles.todoAddBtn, isDisabled && styles.todoAddBtnDisabled]}
        onPress={handleSubmit}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        {busy ? (
          <View style={styles.btnContent}>
            <ActivityIndicator
              size="small"
              color={colors.primaryText}
              style={styles.spinner}
            />
            <Text style={styles.todoAddBtnText}>Додаємо...</Text>
          </View>
        ) : (
          <Text style={styles.todoAddBtnText}>Додати</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default TodoForm;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    todoForm: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
      alignItems: "center",
    },
    todoInput: {
      flex: 1,
      height: 48,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.surfaceSubtle,
      color: colors.text,
    },
    todoInputFocused: {
      borderColor: colors.borderFocus,
      backgroundColor: colors.surface,
    },
    todoInputDisabled: {
      opacity: 0.7,
    },
    todoAddBtn: {
      height: 48,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    todoAddBtnDisabled: {
      opacity: 0.5,
      shadowOpacity: 0,
      elevation: 0,
    },
    btnContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    spinner: {
      marginRight: 6,
    },
    todoAddBtnText: {
      color: colors.primaryText,
      fontWeight: "600",
      fontSize: 15,
    },
  });