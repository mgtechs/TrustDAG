// Client-side AES-256 encryption utilities

// Generate a random AES-256 key
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Export key to base64 string
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key);
  const exportedKeyBuffer = new Uint8Array(exported);
  const base64 = btoa(String.fromCharCode(...exportedKeyBuffer));
  return base64;
}

// Import key from base64 string
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyBuffer = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Encrypt file data
export async function encryptFile(
  file: File,
  key: CryptoKey
): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const fileData = await file.arrayBuffer();

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    fileData
  );

  return { encryptedData, iv };
}

// Decrypt file data
export async function decryptFile(
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<ArrayBuffer> {
  return await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData
  );
}

// Convert ArrayBuffer to base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert base64 string to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert Uint8Array to base64
export function uint8ArrayToBase64(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array));
}

// Convert base64 to Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
