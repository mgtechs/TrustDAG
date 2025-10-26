import {
  type File,
  type InsertFile,
  type AccessGrant,
  type InsertAccessGrant,
  type AuditEvent,
  type InsertAuditEvent,
  type UserPreferences,
  type InsertUserPreferences,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // File operations
  createFile(file: InsertFile): Promise<File>;
  getFile(id: string): Promise<File | undefined>;
  getFileByFileId(fileId: string): Promise<File | undefined>;
  getFilesByOwner(ownerAddress: string): Promise<File[]>;
  getAllFiles(): Promise<File[]>;
  deleteFile(id: string): Promise<void>;

  // Access grant operations
  createAccessGrant(grant: InsertAccessGrant): Promise<AccessGrant>;
  getAccessGrantsByFileId(fileId: string): Promise<AccessGrant[]>;
  getAccessGrantsByAddress(address: string): Promise<AccessGrant[]>;
  revokeAccessGrant(id: string): Promise<void>;
  hasAccess(fileId: string, address: string): Promise<boolean>;

  // Audit event operations
  createAuditEvent(event: InsertAuditEvent): Promise<AuditEvent>;
  getAuditEvents(limit?: number): Promise<AuditEvent[]>;
  getAuditEventsByAddress(address: string): Promise<AuditEvent[]>;
  getAuditEventsByFileId(fileId: string): Promise<AuditEvent[]>;

  // User preferences
  createOrUpdateUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences>;
  getUserPreferences(walletAddress: string): Promise<UserPreferences | undefined>;
}

export class MemStorage implements IStorage {
  private files: Map<string, File>;
  private accessGrants: Map<string, AccessGrant>;
  private auditEvents: Map<string, AuditEvent>;
  private userPreferences: Map<string, UserPreferences>;

  constructor() {
    this.files = new Map();
    this.accessGrants = new Map();
    this.auditEvents = new Map();
    this.userPreferences = new Map();
  }

  // File operations
  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = { ...insertFile, id, uploadedAt: new Date() };
    this.files.set(id, file);
    return file;
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFileByFileId(fileId: string): Promise<File | undefined> {
    return Array.from(this.files.values()).find((file) => file.fileId === fileId);
  }

  async getFilesByOwner(ownerAddress: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.ownerAddress.toLowerCase() === ownerAddress.toLowerCase()
    );
  }

  async getAllFiles(): Promise<File[]> {
    return Array.from(this.files.values());
  }

  async deleteFile(id: string): Promise<void> {
    this.files.delete(id);
  }

  // Access grant operations
  async createAccessGrant(insertGrant: InsertAccessGrant): Promise<AccessGrant> {
    const id = randomUUID();
    const grant: AccessGrant = { ...insertGrant, id, grantedAt: new Date() };
    this.accessGrants.set(id, grant);
    return grant;
  }

  async getAccessGrantsByFileId(fileId: string): Promise<AccessGrant[]> {
    return Array.from(this.accessGrants.values()).filter(
      (grant) => grant.fileId === fileId
    );
  }

  async getAccessGrantsByAddress(address: string): Promise<AccessGrant[]> {
    return Array.from(this.accessGrants.values()).filter(
      (grant) => grant.grantedTo.toLowerCase() === address.toLowerCase()
    );
  }

  async revokeAccessGrant(id: string): Promise<void> {
    this.accessGrants.delete(id);
  }

  async hasAccess(fileId: string, address: string): Promise<boolean> {
    return Array.from(this.accessGrants.values()).some(
      (grant) =>
        grant.fileId === fileId &&
        grant.grantedTo.toLowerCase() === address.toLowerCase()
    );
  }

  // Audit event operations
  async createAuditEvent(insertEvent: InsertAuditEvent): Promise<AuditEvent> {
    const id = randomUUID();
    const event: AuditEvent = { ...insertEvent, id, timestamp: new Date() };
    this.auditEvents.set(id, event);
    return event;
  }

  async getAuditEvents(limit: number = 100): Promise<AuditEvent[]> {
    const events = Array.from(this.auditEvents.values());
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return events.slice(0, limit);
  }

  async getAuditEventsByAddress(address: string): Promise<AuditEvent[]> {
    const events = Array.from(this.auditEvents.values()).filter(
      (event) => event.actorAddress.toLowerCase() === address.toLowerCase()
    );
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return events;
  }

  async getAuditEventsByFileId(fileId: string): Promise<AuditEvent[]> {
    const events = Array.from(this.auditEvents.values()).filter(
      (event) => event.fileId === fileId
    );
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return events;
  }

  // User preferences
  async createOrUpdateUserPreferences(
    insertPrefs: InsertUserPreferences
  ): Promise<UserPreferences> {
    const prefs: UserPreferences = { ...insertPrefs, updatedAt: new Date() };
    this.userPreferences.set(insertPrefs.walletAddress, prefs);
    return prefs;
  }

  async getUserPreferences(walletAddress: string): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(walletAddress);
  }
}

export const storage = new MemStorage();
