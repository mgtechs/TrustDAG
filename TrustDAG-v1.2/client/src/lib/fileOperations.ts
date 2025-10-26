// Complete file upload and download operations with encryption
import {
  generateEncryptionKey,
  exportKey,
  importKey,
  encryptFile,
  decryptFile,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from "./encryption";
import { uploadFileToIPFS, downloadFileFromIPFS, createFileMetadata, logAuditEvent } from "./api";

export interface UploadFileResult {
  fileId: string;
  cid: string;
  encryptionKey: string;
  ivBase64: string;
}

// Complete file upload flow: Encrypt → Upload to IPFS → Save metadata → Log audit
export async function uploadFile(
  file: File,
  ownerAddress: string,
  onProgress?: (stage: string, progress: number) => void
): Promise<UploadFileResult> {
  try {
    // Step 1: Generate encryption key
    onProgress?.("Generating encryption key", 10);
    const encryptionKey = await generateEncryptionKey();
    const encryptionKeyString = await exportKey(encryptionKey);

    // Step 2: Encrypt file
    onProgress?.("Encrypting file", 30);
    const { encryptedData, iv } = await encryptFile(file, encryptionKey);
    const encryptedBase64 = arrayBufferToBase64(encryptedData);
    const ivBase64 = uint8ArrayToBase64(iv);

    // Step 3: Upload to IPFS
    onProgress?.("Uploading to IPFS", 60);
    const ipfsResult = await uploadFileToIPFS(encryptedBase64, file.name);

    // Step 4: Generate file ID (simulate blockchain transaction)
    onProgress?.("Recording on blockchain", 80);
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Step 5: Save metadata to backend
    onProgress?.("Saving metadata", 90);
    await createFileMetadata({
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      ownerAddress,
      ipfsCid: ipfsResult.cid,
      encryptionKey: encryptionKeyString,
      iv: ivBase64,
      fileId,
    });

    // Step 6: Log upload event
    await logAuditEvent({
      eventType: "upload",
      fileId,
      fileName: file.name,
      actorAddress: ownerAddress,
      metadata: JSON.stringify({ size: file.size, mimeType: file.type }),
    });

    onProgress?.("Complete", 100);

    return {
      fileId,
      cid: ipfsResult.cid,
      encryptionKey: encryptionKeyString,
      ivBase64,
    };
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

// Complete file download flow: Fetch metadata → Download from IPFS → Decrypt
export async function downloadFile(
  fileMetadata: {
    name: string;
    ipfsCid: string;
    encryptionKey: string;
    iv: string;
    mimeType: string;
  },
  fileId: string | undefined,
  actorAddress: string
): Promise<Blob> {
  try {
    // Step 1: Download encrypted data from IPFS
    const encryptedBase64 = await downloadFileFromIPFS(fileMetadata.ipfsCid);
    const encryptedData = base64ToArrayBuffer(encryptedBase64);

    // Step 2: Import encryption key and IV
    const key = await importKey(fileMetadata.encryptionKey);
    const iv = base64ToUint8Array(fileMetadata.iv);

    // Step 3: Decrypt file
    const decryptedData = await decryptFile(encryptedData, key, iv);

    // Step 4: Create blob
    const blob = new Blob([decryptedData], { type: fileMetadata.mimeType });

    // Step 5: Log download event
    await logAuditEvent({
      eventType: "download",
      fileId,
      fileName: fileMetadata.name,
      actorAddress,
    });

    return blob;
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
}

// Trigger browser download
export function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
