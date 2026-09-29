# Практичне завдання: Todo App 5.0 — Автентифікація користувачів (Convex Auth), Мульти-середовищна конфігурація, EAS Build та OTA оновлення

У цьому фінальному практичному завданні ви трансформуєте свій мобільний додаток (**`rn-todo-list`**) у повноцінний багатокористувацький production-ready продукт із захищеними персональними даними та професійною інфраструктурою збірки й доставки оновлень.

Ви навчитеся інтегрувати сучасну систему автентифікації **Convex Auth** на основі токенів JWT і захищеного сховища **Expo SecureStore**, повністю ізолювати списки завдань між різними користувачами, налаштовувати захищену навігацію та підтримувати автоматизовані хмарні збірки (**EAS Build**) та бездротові оновлення (**EAS Update / OTA**).

---

## 🎯 Мета завдання

1. **Інтегрувати Convex Auth у мобільний додаток**:
   - Встановити та налаштувати `@convex-dev/auth`, `@auth/core` та `expo-secure-store`.
   - Згенерувати ключі JWT (`JWT_PRIVATE_KEY`, `JWKS`) та налаштувати конфігураційні файли `convex/auth.config.ts`, `convex/auth.ts`, `convex/http.ts`.
   - Підключити клієнтський адаптер `secureStorage` до `ConvexAuthProvider`.
2. **Оновити схему бази даних та ізолювати дані (`convex/schema.ts`)**:
   - Підключити системні таблиці автентифікації `...authTables`.
   - Прив'язати кожне завдання до власника: `userId: v.id("users")`.
   - Додати індекси `by_user` та `by_user_creation` для швидких персоналізованих запитів.
3. **Захистити бекенд-функції (`convex/todos.ts` та `convex/users.ts`)**:
   - Реалізувати запит поточного користувача `currentUser`.
   - Гарантувати, що будь-які операції (читання, додавання, редагування, видалення, масове очищення) доступні **виключно власнику** через `getAuthUserId(ctx)`.
4. **Створити UI для автентифікації та захищену навігацію**:
   - Розробити красиві екрани входу (`app/sign-in.tsx`) та реєстрації (`app/sign-up.tsx`) у єдиному дизайн-стилі додатку з підтримкою темної/світлої теми (`ThemeContext`).
   - Налаштувати захист маршрутів у `app/_layout.tsx` за допомогою `<AuthLoading>`, `<Unauthenticated>`, `<Authenticated>`.
   - Додати блок інформації про користувача та кнопку виходу (**Sign Out**) на вкладку налаштувань (`app/(tabs)/settings.tsx`).
5. **Налаштувати динамічну конфігурацію середовищ (`app.config.ts`)**:
   - Динамічна зміна назви додатку (`Todo App Dev`, `Todo App Preview`, `Todo App`).
   - Унікальні Package Name / Bundle ID (`.dev`, `.preview`, базовий), що дозволяє встановлювати поруч усі 3 версії на один смартфон.
   - Динамічні схеми діплінків та підключення іконок під кожне середовище.
6. **Налаштувати профілі збірок у `eas.json`**:
   - 🛠️ **`development`** — клієнт розробника для підключення до локального Metro Bundler.
   - 🚀 **`preview`** — автономна внутрішня збірка (Standalone APK/Internal distribution) для тестування без сервера Metro.
   - 🌟 **`production`** — релізна оптимізована збірка для публікації.
7. **Підготувати унікальні іконки для середовищ** (з позначками `DEV` та `PREVIEW` у папці `assets/images/icons/`).
8. **Налаштувати змінні середовища в EAS Dashboard** для кожного профілю окремо (`APP_ENV`, `EXPO_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`).
9. **Зібрати та встановити автономний Preview APK** на фізичний пристрій або емулятор та перевірити роботу автентифікації.
10. **Протестувати швидкі бездротові оновлення (EAS Update / OTA)** без перевстановлення APK.
11. **Виконати деплой схеми Convex у Production (`npx convex deploy`)**.

---

## 📁 Очікувана структура проєкту

```text
rn-todo-list/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Таб-бар
│   │   ├── index.tsx          # 📝 Вкладка 1: Список справ (персональні todos)
│   │   ├── stats.tsx          # 📊 Вкладка 2: Персональна статистика продуктивності
│   │   └── settings.tsx       # ⚙️ Вкладка 3: Налаштування + Профіль користувача та Sign Out
│   ├── _layout.tsx            # Кореневий макет (ConvexAuthProvider + secureStorage + захист маршрутів)
│   ├── sign-in.tsx            # 🔐 Екран входу (Email + Password)
│   └── sign-up.tsx            # 📝 Екран реєстрації нового користувача
├── assets/
│   └── images/
│       ├── icon.png                   # Базова релізна іконка (Production)
│       ├── android-icon-foreground.png
│       ├── android-icon-background.png
│       ├── splash-icon.png
│       └── icons/                     # 🎨 Іконки для різних збірок
│           ├── icon-dev.png           # Іконка з бейджем DEV
│           ├── android-icon-foreground-dev.png
│           ├── icon-preview.png       # Іконка з бейджем PREVIEW
│           └── android-icon-foreground-preview.png
├── components/                # UI компоненти (Header, TodoForm, TodoItem, TodoList тощо)
├── context/
│   └── ThemeContext.tsx       # Тема оформлення
├── convex/                    # 🚀 Хмарний бекенд Convex з підтримкою Auth
│   ├── _generated/            # Автозгенеровані типи
│   ├── auth.config.ts         # Налаштування провайдера токенів JWT
│   ├── auth.ts                # Серверна конфігурація Convex Auth (Password Provider)
│   ├── http.ts                # HTTP маршрутизатор для обробки auth-запитів
│   ├── schema.ts              # Схема бази даних (...authTables + todos з прив'язкою до userId)
│   ├── todos.ts               # Захищені серверні Queries та Mutations
│   └── users.ts               # Запит поточного користувача (currentUser)
├── app.config.ts              # ⚙️ Динамічна конфігурація середовищ Expo
├── eas.json                   # 🚀 Конфігурація профілів EAS Build & Update
├── .env.local                 # Локальні змінні оточення
├── package.json
└── tsconfig.json
```

---

## 📋 Покроковий план виконання

---

### ЧАСТИНА 1: Інтеграція Convex Auth та захист даних

#### Крок 1.1: Встановлення залежностей

У кореневій директорії проєкту `rn-todo-list` виконайте:

```bash
# 1. Захищене апаратне сховище для зберігання токенів авторизації
npx expo install expo-secure-store

# 2. Пакет автентифікації Convex та ядро Auth.js
npm install @convex-dev/auth @auth/core@0.41.1
```

- **`expo-secure-store`** — обов'язкова бібліотека для шифрованого збереження токенів авторизації на пристрої (iOS Keychain / Android Keystore). Вона зберігає сесію активною навіть після перезапуску додатку чи перезавантаження телефону.
- **`@convex-dev/auth`** — офіційна бібліотека автентифікації для Convex.
- **`@auth/core`** — ядро Auth.js v5 для безпечної обробки облікових даних.

---

#### Крок 1.2: Ініціалізація Convex Auth та генерація JWT ключів

1. Запустіть автоматичну ініціалізацію:
   ```bash
   npx @convex-dev/auth
   ```

2. Якщо потрібно налаштувати або перегенерувати ключі вручну:
   Створіть скрипт `generateKeys.mjs` у корені проєкту:
   ```javascript
   // generateKeys.mjs
   import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

   const keys = await generateKeyPair("RS256", { extractable: true });
   const privateKey = await exportPKCS8(keys.privateKey);
   const publicKey = await exportJWK(keys.publicKey);
   const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

   process.stdout.write(
     `JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, " ")}"\n`
   );
   process.stdout.write(`JWKS=${jwks}\n`);
   ```
   Згенеруйте ключі:
   ```bash
   npx -p jose node generateKeys.mjs
   ```
   Отримані змінні `JWT_PRIVATE_KEY` та `JWKS` додайте у **Convex Dashboard** (`Settings` → `Environment Variables`) або у локальний `.env.local`.

3. Створіть файл **`convex/auth.config.ts`**:
   ```typescript
   // convex/auth.config.ts
   export default {
     providers: [
       {
         domain: process.env.CONVEX_SITE_URL,
         applicationID: "convex",
       },
     ],
   };
   ```

4. Створіть файл **`convex/auth.ts`**:
   ```typescript
   // convex/auth.ts
   import { Password } from "@convex-dev/auth/providers/Password";
   import { convexAuth } from "@convex-dev/auth/server";

   export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
     providers: [Password],
   });
   ```

5. Створіть файл **`convex/http.ts`**:
   ```typescript
   // convex/http.ts
   import { httpRouter } from "convex/server";
   import { auth } from "./auth";

   const http = httpRouter();
   auth.addHttpRoutes(http);

   export default http;
   ```

---

#### Крок 1.3: Оновлення схеми бази даних (`convex/schema.ts`)

Додайте системні таблиці автентифікації `...authTables` та прив'яжіть завдання `todos` до облікового запису користувача через `userId: v.id("users")`:

```typescript
// convex/schema.ts
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Системні таблиці Convex Auth (users, authAccounts, authSessions, authRefreshTokens)
  ...authTables,

  // 2. Персональні завдання користувача
  todos: defineTable({
    userId: v.id("users"),
    text: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_creation", ["userId", "createdAt"]),
});
```

> [!IMPORTANT]
> - `...authTables` створює всі необхідні колекції користувачів і сесій.
> - Поле `userId: v.id("users")` та індекси `by_user` і `by_user_creation` гарантують, що кожен користувач взаємодіє виключно зі своїми справами.

---

#### Крок 1.4: Отримання поточного користувача (`convex/users.ts`)

Створіть файл **`convex/users.ts`**:

```typescript
// convex/users.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
```

---

#### Крок 1.5: Захист функцій бекенду (`convex/todos.ts`)

Оновіть файл **`convex/todos.ts`**, щоб кожна дія перевіряла авторизацію через `getAuthUserId(ctx)` та перевіряла права власності на завдання:

```typescript
// convex/todos.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Отримання завдань ТІЛЬКИ поточного авторизованого користувача
export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    return await ctx.db
      .query("todos")
      .withIndex("by_user_creation", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// 2. Персональна статистика поточного користувача
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { total: 0, completed: 0, active: 0, completionRate: 0 };
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const total = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, completionRate };
  },
});

// 3. Створення нового завдання для поточного користувача
export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Необхідно авторизуватися для створення завдань");
    }

    const cleanText = args.text.trim();
    if (!cleanText) {
      throw new ConvexError("Текст завдання не може бути порожнім");
    }

    return await ctx.db.insert("todos", {
      userId,
      text: cleanText,
      isCompleted: false,
      createdAt: Date.now(),
    });
  },
});

// 4. Перемикання статусу завдання (з перевіркою власника)
export const toggleTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new ConvexError("Завдання не знайдено");
    }

    if (todo.userId !== userId) {
      throw new ConvexError("Немає доступу до редагування цього завдання");
    }

    await ctx.db.patch(args.id, {
      isCompleted: !todo.isCompleted,
    });
  },
});

// 5. Оновлення тексту завдання (з перевіркою власника)
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new ConvexError("Завдання не знайдено або доступ заборонено");
    }

    const cleanText = args.text.trim();
    if (!cleanText) {
      throw new ConvexError("Текст завдання не може бути порожнім");
    }

    await ctx.db.patch(args.id, { text: cleanText });
  },
});

// 6. Видалення завдання (з перевіркою власника)
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new ConvexError("Завдання не знайдено або доступ заборонено");
    }

    await ctx.db.delete(args.id);
  },
});

// 7. Очищення виконаних завдань поточного користувача
export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const completedTodos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    for (const todo of completedTodos) {
      await ctx.db.delete(todo._id);
    }
  },
});

// 8. Повне очищення всіх завдань поточного користувача
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const userTodos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const todo of userTodos) {
      await ctx.db.delete(todo._id);
    }
  },
});
```

---

### ЧАСТИНА 2: Клієнтська автентифікація та UI

#### Крок 2.1: Налаштування кореневого провайдера та захисту маршрутів (`app/_layout.tsx`)

Підключіть `ConvexAuthProvider`, адаптер `secureStorage` та компоненти умовного рендерингу `<AuthLoading>`, `<Unauthenticated>` та `<Authenticated>`:

```tsx
// app/_layout.tsx
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import * as SecureStore from "expo-secure-store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Адаптер SecureStore для надійного збереження токенів на мобільному пристрої
const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function RootNavigation() {
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* 1. Стан очікування перевірки сесії */}
      <AuthLoading>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AuthLoading>

      {/* 2. Неавторизований стан: доступні тільки екрани входу та реєстрації */}
      <Unauthenticated>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack>
      </Unauthenticated>

      {/* 3. Авторизований стан: відкривається основний додаток з табами */}
      <Authenticated>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Authenticated>
    </>
  );
}

export default function RootLayout() {
  return (
    <ConvexAuthProvider client={convex} storage={secureStorage}>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}
```

---

#### Крок 2.2: Створення екрану входу (`app/sign-in.tsx`)

Створіть файл **`app/sign-in.tsx`**:

```tsx
// app/sign-in.tsx
import { useTheme } from "@/context/ThemeContext";
import { useAuthActions } from "@convex-dev/auth/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Помилка", "Будь ласка, заповніть усі поля!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("flow", "signIn");

      await signIn("password", formData);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Помилка входу", "Невірний email або пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="check-circle" size={44} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Todo App</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Увійдіть у свій персональний простір завдань
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialIcons
                name="mail-outline"
                size={22}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialIcons
                name="lock-outline"
                size={22}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="login" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Увійти</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Немає облікового запису?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Зареєструватися
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "700",
  },
});
```

---

#### Крок 2.3: Створення екрану реєстрації (`app/sign-up.tsx`)

Створіть файл **`app/sign-up.tsx`**:

```tsx
// app/sign-up.tsx
import { useTheme } from "@/context/ThemeContext";
import { useAuthActions } from "@convex-dev/auth/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Помилка", "Будь ласка, заповніть усі обов'язкові поля!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Помилка", "Паролі не співпадають!");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Помилка", "Пароль має містити мінімум 8 символів!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("flow", "signUp");

      await signIn("password", formData);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Помилка реєстрації",
        "Не вдалося створити профіль. Можливо, такий email вже використовується."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="person-add" size={40} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Новий акаунт</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Створіть профіль для збереження ваших списків справ
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <MaterialIcons
                name="person-outline"
                size={22}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ваше ім'я"
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <MaterialIcons
                name="mail-outline"
                size={22}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <MaterialIcons
                name="lock-outline"
                size={22}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Пароль (мін. 8 символів)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <MaterialIcons
                name="verified-user"
                size={22}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Підтвердження пароля"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="how-to-reg" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Зареєструватися</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Вже маєте акаунт?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Увійти
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
  },
  form: {
    gap: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "700",
  },
});
```

---

#### Крок 2.4: Профіль користувача та кнопка Sign Out (`app/(tabs)/settings.tsx`)

Оновіть екран налаштувань **`app/(tabs)/settings.tsx`**, додавши картку поточного користувача та кнопку виходу:

```tsx
// Додайте в app/(tabs)/settings.tsx:
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Усередині компонента SettingsScreen:
const { signOut } = useAuthActions();
const router = useRouter();
const user = useQuery(api.users.currentUser);

const handleSignOut = () => {
  Alert.alert("Вихід з акаунта", "Ви впевнені, що хочете вийти з додатку?", [
    { text: "Скасувати", style: "cancel" },
    {
      text: "Вийти",
      style: "destructive",
      onPress: async () => {
        await signOut();
        router.replace("/sign-in");
      },
    },
  ]);
};

// Додайте блок картки користувача у верхній частині JSX:
<View
  style={[
    styles.userCard,
    { backgroundColor: colors.card, borderColor: colors.border },
  ]}
>
  <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
    <MaterialIcons name="person" size={28} color="#FFFFFF" />
  </View>
  <View style={styles.userInfo}>
    <Text style={[styles.userName, { color: colors.text }]}>
      {user?.name ?? "Користувач"}
    </Text>
    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
      {user?.email ?? ""}
    </Text>
  </View>
  <TouchableOpacity
    style={styles.signOutBtn}
    onPress={handleSignOut}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <MaterialIcons name="logout" size={22} color={colors.textSecondary} />
  </TouchableOpacity>
</View>
```

---

### ЧАСТИНА 3: Мульти-середовищна конфігурація, EAS Build та OTA

#### Крок 3.1: Встановлення інструментів та ініціалізація EAS

1. Переконайтеся, що встановлено **EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
2. Авторизуйтеся у вашому акаунті на [expo.dev](https://expo.dev):
   ```bash
   eas login
   ```
3. Створіть резервну копію файлу `app.json`:
   ```bash
   cp app.json app.json.backup
   ```
4. Ініціалізуйте проєкт в EAS (якщо ще не робили цього раніше):
   ```bash
   eas project:init
   ```

---

#### Крок 3.2: Створення динамічної конфігурації `app.config.ts`

Створіть файл **`app.config.ts`** у корені проєкту `rn-todo-list`:

```typescript
import { ConfigContext, ExpoConfig } from "expo/config";

// EAS налаштування (отримайте з app.json або після eas project:init)
const EAS_PROJECT_ID = "YOUR_EAS_PROJECT_ID";
const PROJECT_SLUG = "rn-todo-list";
const OWNER = "your-expo-username"; // Ваш логін на expo.dev

// Базова конфігурація Production
const APP_NAME = "Todo App";
const BUNDLE_IDENTIFIER = `com.${OWNER}.rntodolist`;
const PACKAGE_NAME = `com.${OWNER}.rntodolist`;
const SCHEME = "rntodolist";

// Шляхи до базових іконок
const ICON = "./assets/images/icon.png";
const ADAPTIVE_ICON_FOREGROUND = "./assets/images/android-icon-foreground.png";
const ADAPTIVE_ICON_BACKGROUND = "./assets/images/android-icon-background.png";
const ADAPTIVE_ICON_MONOCHROME = "./assets/images/android-icon-monochrome.png";

export default ({ config }: ConfigContext): ExpoConfig => {
  const environment =
    (process.env.APP_ENV as "development" | "preview" | "production") ||
    "development";

  console.log("⚙️  Building rn-todo-list for environment:", environment);
  console.log("📦 Convex URL:", process.env.EXPO_PUBLIC_CONVEX_URL);

  const dynamicConfig = getDynamicAppConfig(environment);

  return {
    ...config,
    name: dynamicConfig.name,
    slug: PROJECT_SLUG,
    version: "1.0.0",
    orientation: "portrait",
    icon: dynamicConfig.icon,
    scheme: dynamicConfig.scheme,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: dynamicConfig.bundleIdentifier,
      buildNumber: "1",
    },

    android: {
      package: dynamicConfig.packageName,
      versionCode: 1,
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: dynamicConfig.adaptiveIconForeground,
        backgroundImage: dynamicConfig.adaptiveIconBackground,
        monochromeImage: dynamicConfig.adaptiveIconMonochrome,
      },
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-secure-store",
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },

    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      router: {},
    },

    owner: OWNER,
  };
};

export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "development") {
    return {
      name: `${APP_NAME} Dev`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
      packageName: `${PACKAGE_NAME}.dev`,
      icon: "./assets/images/icons/icon-dev.png",
      adaptiveIconForeground:
        "./assets/images/icons/android-icon-foreground-dev.png",
      adaptiveIconBackground: ADAPTIVE_ICON_BACKGROUND,
      adaptiveIconMonochrome: ADAPTIVE_ICON_MONOCHROME,
      scheme: `${SCHEME}-dev`,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: "./assets/images/icons/icon-preview.png",
      adaptiveIconForeground:
        "./assets/images/icons/android-icon-foreground-preview.png",
      adaptiveIconBackground: ADAPTIVE_ICON_BACKGROUND,
      adaptiveIconMonochrome: ADAPTIVE_ICON_MONOCHROME,
      scheme: `${SCHEME}-preview`,
    };
  }

  // Production (Default)
  return {
    name: APP_NAME,
    bundleIdentifier: BUNDLE_IDENTIFIER,
    packageName: PACKAGE_NAME,
    icon: ICON,
    adaptiveIconForeground: ADAPTIVE_ICON_FOREGROUND,
    adaptiveIconBackground: ADAPTIVE_ICON_BACKGROUND,
    adaptiveIconMonochrome: ADAPTIVE_ICON_MONOCHROME,
    scheme: SCHEME,
  };
};
```

> [!TIP]
> Після створення `app.config.ts`, застарілий статичний файл `app.json` можна видалити (`rm app.json`).

---

#### Крок 3.3: Налаштування `eas.json` для збірок та OTA

Створіть або оновіть файл **`eas.json`** у корені проєкту:

```json
{
  "cli": {
    "version": ">= 16.28.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "environment": "development",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "environment": "preview",
      "channel": "preview"
    },
    "production": {
      "autoIncrement": true,
      "environment": "production",
      "channel": "production"
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

#### Крок 3.4: Створення іконок з бейджами для Dev та Preview

Створіть папку `assets/images/icons/` та підготуйте окремі іконки з візуальними позначками:

```bash
mkdir -p assets/images/icons
cp assets/images/icon.png assets/images/icons/icon-dev.png
cp assets/images/android-icon-foreground.png assets/images/icons/android-icon-foreground-dev.png
cp assets/images/icon.png assets/images/icons/icon-preview.png
cp assets/images/android-icon-foreground.png assets/images/icons/android-icon-foreground-preview.png
```

- **`icon-dev.png`**: додайте помаранчеву стрічку/бейдж з написом **`DEV`** у кутку.
- **`icon-preview.png`**: додайте синю стрічку/бейдж з написом **`PREVIEW`**.

---

#### Крок 3.5: Налаштування змінних оточення в EAS Dashboard

В особистому кабінеті на [expo.dev](https://expo.dev) перейдіть до проєкту `rn-todo-list` → **Configuration** → **Environment variables** і додайте змінні:

##### 1. Для середовища `Development`:
| Name | Value | Type |
| :--- | :--- | :--- |
| `APP_ENV` | `development` | String |
| `EXPO_PUBLIC_CONVEX_URL` | Ваш Convex dev URL (з `.env.local`) | String |
| `CONVEX_DEPLOYMENT` | Ваш Convex dev deployment ID | String |

##### 2. Для середовища `Preview`:
| Name | Value | Type |
| :--- | :--- | :--- |
| `APP_ENV` | `preview` | String |
| `EXPO_PUBLIC_CONVEX_URL` | Той самий Convex URL (або staging) | String |
| `CONVEX_DEPLOYMENT` | Той самий deployment ID | String |

##### 3. Для середовища `Production`:
| Name | Value | Type |
| :--- | :--- | :--- |
| `APP_ENV` | `production` | String |
| `EXPO_PUBLIC_CONVEX_URL` | Ваш Production Convex URL | String |
| `CONVEX_DEPLOYMENT` | Ваш Production deployment ID | String |

> [!NOTE]
> Переконайтеся також, що змінні автентифікації `JWT_PRIVATE_KEY` та `JWKS` налаштовані у вашому **Convex Dashboard** (`Settings` → `Environment Variables`).

Стягніть змінні в локальний файл:
```bash
eas env:pull --environment development
```

---

#### Крок 3.6: Збірка та встановлення автономного Preview APK

1. Запустіть хмарну збірку автономного файлу:
   - **Для Android (APK):**
     ```bash
     eas build --platform android --profile preview
     ```
   - **Для iOS (Simulator/Ad-hoc):**
     ```bash
     eas build --platform ios --profile preview
     ```

2. Після завершення збірки завантажте та встановіть згенерований додаток **«Todo App Preview»** на свій телефон або емулятор.
3. **Перевірте автентифікацію**: зареєструйте нового користувача, увійдіть у додаток, створіть декілька завдань, вийдіть з акаунта (**Sign Out**) та увійдіть знову. Переконайтеся, що все працює автономно **без запущеного комп'ютера чи Metro Bundler**!

---

#### Крок 3.7: Тестування швидких бездротових оновлень (EAS Update / OTA)

1. Зробіть помітну візуальну зміну в UI (наприклад, змініть колір кнопки або додайте привітальне повідомлення з ім'ям користувача в `Header.tsx`).
2. Опублікуйте бездротове оновлення безпосередньо у канал **`preview`**:
   ```bash
   eas update --platform all --environment preview --channel preview --message "UI: оновлено стилі та додано ім'я користувача"
   ```
3. Відкрийте додаток **«Todo App Preview»** на телефоні, повністю закрийте його (вивантажте з фону) та відкрийте знову.
4. **Результат:** Зміни застосуються автоматично по повітрю без перевстановлення APK!

---

#### Крок 3.8: Деплой бекенду Convex у Production

Перед фінальною публікацією відправте схему та серверні функції у Production деплой Convex:

```bash
npx convex deploy
```

---

## ⚡ Шпаргалка основних команд

| Дія | Команда |
| :--- | :--- |
| **Локальний запуск бекенду Convex** | `npx convex dev` |
| **Локальний запуск Expo з очищенням кешу** | `npx expo start -c` |
| **Ініціалізація Convex Auth** | `npx @convex-dev/auth` |
| **Ініціалізація EAS у проєкті** | `eas project:init` |
| **Стягнути змінні з EAS** | `eas env:pull --environment development` |
| **Збірка автономного Preview APK** | `eas build --platform android --profile preview` |
| **Збірка Dev Client** | `eas build --platform android --profile development` |
| **Збірка Production релізу** | `eas build --platform all --profile production` |
| **Відправка OTA оновлення в Preview** | `eas update --platform all --environment preview --channel preview --message "..."` |
| **Деплой Convex у Production** | `npx convex deploy` |

---

## 💯 Критерії оцінювання (100 балів)

| Критерій | Бали | Опис |
| :--- | :---: | :--- |
| **1. Інтеграція Convex Auth та захист даних** | **25 б.** | Підключено `...authTables`, додано `userId` та індекси до таблиці `todos`. Усі Queries та Mutations у `convex/todos.ts` ізольовані через `getAuthUserId(ctx)`. Створено `convex/users.ts`. |
| **2. UI автентифікації та захищена навігація** | **20 б.** | Реалізовано екрани `sign-in.tsx` та `sign-up.tsx` у загальному стилі тем. Захищено маршрути через `<AuthLoading>`, `<Unauthenticated>`, `<Authenticated>` з адаптером `SecureStore`. Додано картку користувача та Sign Out. |
| **3. Динамічна конфігурація `app.config.ts`** | **20 б.** | Налаштовано динамічну зміну назви, Bundle ID / Package Name (`.dev`, `.preview`) та схем залежно від `APP_ENV`. |
| **4. Налаштування `eas.json`, іконки та змінні** | **15 б.** | Описано профілі `development`, `preview`, `production` з відповідними каналами; підготовлено іконки з бейджами `DEV` та `PREVIEW`; налаштовано змінні середовища в EAS Dashboard. |
| **5. Автономний Preview APK із робочим входом** | **10 б.** | Згенеровано автономну збірку `preview`. Додаток успішно встановлюється, дозволяє пройти реєстрацію/вхід та працює без Metro Bundler. |
| **6. Демонстрація OTA оновлення (EAS Update)** | **10 б.** | Успішно продемонстровано застосування змін по повітрю через команду `eas update`. |
| **РАЗОМ** | **100 б.** | |

---

## 📦 Формат здачі завдання

1. Завантажте оновлений код у свій GitHub-репозиторій.
2. У файлі `README.md` вашого репозиторію:
   - Додайте посилання на публічну сторінку вашої Preview збірки в Expo Dashboard (або QR-код для завантаження APK).
   - Прикріпіть скріншот екрану входу / реєстрації додатку.
   - Прикріпіть скріншот списку збірок з консолі [expo.dev/builds](https://expo.dev).
   - Прикріпіть 1-2 скріншоти встановленого Preview додатку на телефоні з кастомною іконкою `PREVIEW` та персональними справами авторизованого користувача.
3. Надішліть посилання на репозиторій на перевірку.
