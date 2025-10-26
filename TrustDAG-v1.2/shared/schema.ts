import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles for access control
export const UserRole = {
  OWNER: "owner",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Event types for audit trail
export const EventType = {
  UPLOAD: "upload",
  DOWNLOAD: "download",
  GRANT: "grant",
  REVOKE: "revoke",
  ACCESS: "access",
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

// Files table - stores metadata for uploaded files
export const files = pgTable("files", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  ownerAddress: text("owner_address").notNull(),
  ipfsCid: text("ipfs_cid").notNull(),
  encryptionKey: text("encryption_key").notNull(), // AES key for decryption
  iv: text("iv").notNull(), // Initialization vector for AES-GCM
  fileId: text("file_id").notNull().unique(), // Blockchain file ID
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  uploadedAt: true,
});

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

// Access grants table - tracks who has access to which files
export const accessGrants = pgTable("access_grants", {
  id: varchar("id").primaryKey(),
  fileId: text("file_id").notNull(),
  grantedTo: text("granted_to").notNull(), // Wallet address
  grantedBy: text("granted_by").notNull(), // Wallet address
  role: text("role").notNull(), // viewer or editor
  grantedAt: timestamp("granted_at").notNull().defaultNow(),
});

export const insertAccessGrantSchema = createInsertSchema(accessGrants).omit({
  id: true,
  grantedAt: true,
});

export type InsertAccessGrant = z.infer<typeof insertAccessGrantSchema>;
export type AccessGrant = typeof accessGrants.$inferSelect;

// Audit events table - logs all file and access operations
export const auditEvents = pgTable("audit_events", {
  id: varchar("id").primaryKey(),
  eventType: text("event_type").notNull(), // upload, download, grant, revoke, access
  fileId: text("file_id"),
  fileName: text("file_name"),
  actorAddress: text("actor_address").notNull(), // Who performed the action
  targetAddress: text("target_address"), // For grant/revoke events
  metadata: text("metadata"), // JSON string for additional data
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertAuditEventSchema = createInsertSchema(auditEvents).omit({
  id: true,
  timestamp: true,
});

export type InsertAuditEvent = z.infer<typeof insertAuditEventSchema>;
export type AuditEvent = typeof auditEvents.$inferSelect;

// User preferences (for profile page)
export const userPreferences = pgTable("user_preferences", {
  walletAddress: text("wallet_address").primaryKey(),
  displayName: text("display_name"),
  email: text("email"),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  updatedAt: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
