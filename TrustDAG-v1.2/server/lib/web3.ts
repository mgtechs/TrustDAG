// Server-side Web3 utilities for blockchain interaction
// Note: This is for read-only operations. Writes happen client-side via MetaMask.

export const TRUSTDAG_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "cid", "type": "string"}],
    "name": "uploadFile",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fileId", "type": "uint256"}, {"internalType": "address", "name": "user", "type": "address"}],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fileId", "type": "uint256"}, {"internalType": "address", "name": "user", "type": "address"}],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fileId", "type": "uint256"}, {"internalType": "address", "name": "user", "type": "address"}],
    "name": "hasAccess",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "files",
    "outputs": [
      {"internalType": "string", "name": "cid", "type": "string"},
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const CONTRACT_ADDRESS = "0x6370e5bF266a7197F0426eB35cB01677BdcD2B3e";

// Verify that a file exists on the blockchain
export async function verifyFileOnChain(fileId: string): Promise<boolean> {
  // This would use a Web3 library to query the smart contract
  // For now, we'll return true as a placeholder
  // In production, use ethers.js or web3.js to query the contract
  return true;
}

// Check if an address has access to a file on the blockchain
export async function checkAccessOnChain(fileId: string, address: string): Promise<boolean> {
  // This would use a Web3 library to query the smart contract
  // For now, we'll return true as a placeholder
  return true;
}

// Validate Ethereum address format
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
