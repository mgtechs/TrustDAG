// API client utilities for backend communication
import type { File, AccessGrant, AuditEvent, UserPreferences } from "@shared/schema";

export interface IPFSUploadResult {
  cid: string;
  url: string;
}

// Upload encrypted file to IPFS via backend
export async function uploadFileToIPFS(
  encryptedData: string,
  fileName: string
): Promise<IPFSUploadResult> {
  const response = await fetch("/api/ipfs/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ encryptedData, fileName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload to IPFS");
  }

  return await response.json();
}

// Download encrypted file from IPFS via backend
export async function downloadFileFromIPFS(cid: string): Promise<string> {
  const response = await fetch(`/api/ipfs/download/${cid}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to download from IPFS");
  }

  const result = await response.json();
  return result.data; // Returns base64 encrypted data
}

// Create file metadata record
export async function createFileMetadata(fileData: Omit<File, "id" | "uploadedAt">): Promise<File> {
  const response = await fetch("/api/files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create file record");
  }

  return await response.json();
}

// Grant access to a file
export async function grantFileAccess(
  fileId: string,
  grantedTo: string,
  grantedBy: string,
  role: "viewer" | "editor"
): Promise<AccessGrant> {
  const response = await fetch("/api/access-grants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, grantedTo, grantedBy, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to grant access");
  }

  return await response.json();
}

// Revoke access to a file
export async function revokeFileAccess(grantId: string): Promise<void> {
  const response = await fetch(`/api/access-grants/${grantId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to revoke access");
  }
}

// Log audit event
export async function logAuditEvent(event: {
  eventType: string;
  fileId?: string;
  fileName?: string;
  actorAddress: string;
  targetAddress?: string;
  metadata?: string;
}): Promise<AuditEvent> {
  const response = await fetch("/api/audit-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to log audit event");
  }

  return await response.json();
}

// Update user preferences
export async function updateUserPreferences(prefs: {
  walletAddress: string;
  displayName?: string;
  email?: string;
  notificationsEnabled: boolean;
}): Promise<UserPreferences> {
  const response = await fetch("/api/user-preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prefs),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update preferences");
  }

  return await response.json();
}
