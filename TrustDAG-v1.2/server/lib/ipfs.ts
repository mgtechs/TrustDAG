// IPFS upload and download utilities using Web3.Storage or Pinata

interface UploadResult {
  cid: string;
  url: string;
}

// Upload file to Web3.Storage
async function uploadToWeb3Storage(fileData: Buffer, fileName: string): Promise<UploadResult> {
  const token = process.env.VITE_WEB3STORAGE_TOKEN;
  
  if (!token) {
    throw new Error("Web3.Storage token not configured");
  }

  // Create form data
  const formData = new FormData();
  const blob = new Blob([fileData], { type: "application/octet-stream" });
  formData.append("file", blob, fileName);

  const response = await fetch("https://api.web3.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Web3.Storage upload failed: ${error}`);
  }

  const data = await response.json();
  const cid = data.cid;

  return {
    cid,
    url: `https://${cid}.ipfs.w3s.link/${fileName}`,
  };
}

// Upload file to Pinata (fallback)
async function uploadToPinata(fileData: Buffer, fileName: string): Promise<UploadResult> {
  const apiKey = process.env.VITE_IPFS_API_KEY;
  const apiSecret = process.env.VITE_IPFS_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Pinata credentials not configured");
  }

  const formData = new FormData();
  const blob = new Blob([fileData], { type: "application/octet-stream" });
  formData.append("file", blob, fileName);

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata upload failed: ${error}`);
  }

  const data = await response.json();
  const cid = data.IpfsHash;

  return {
    cid,
    url: `https://gateway.pinata.cloud/ipfs/${cid}`,
  };
}

// Main upload function with fallback
export async function uploadToIPFS(fileData: Buffer, fileName: string): Promise<UploadResult> {
  // Try Web3.Storage first
  try {
    return await uploadToWeb3Storage(fileData, fileName);
  } catch (error) {
    console.warn("Web3.Storage upload failed, trying Pinata:", error);
    
    // Fallback to Pinata
    try {
      return await uploadToPinata(fileData, fileName);
    } catch (pinataError) {
      console.error("Both IPFS providers failed");
      throw new Error("Failed to upload to IPFS. Please check your API credentials.");
    }
  }
}

// Download file from IPFS
export async function downloadFromIPFS(cid: string): Promise<Buffer> {
  // Try multiple IPFS gateways
  const gateways = [
    `https://${cid}.ipfs.w3s.link`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
  ];

  for (const gateway of gateways) {
    try {
      const response = await fetch(gateway);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    } catch (error) {
      console.warn(`Failed to download from ${gateway}:`, error);
    }
  }

  throw new Error(`Failed to download file with CID: ${cid}`);
}

// Get IPFS gateway URL for a CID
export function getIPFSUrl(cid: string): string {
  return `https://${cid}.ipfs.w3s.link`;
}
