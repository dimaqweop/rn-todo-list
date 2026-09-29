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