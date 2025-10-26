// Web3 utilities and hooks for wallet connection and smart contract interaction

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

// Contract ABI for TrustDAG (minimal interface for file operations)
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
    "outputs": [{"internalType": "string", "name": "cid", "type": "string"}, {"internalType": "address", "name": "owner", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const CONTRACT_ADDRESS = "0x6370e5bF266a7197F0426eB35cB01677BdcD2B3e";

// Format wallet address for display
export function formatAddress(address: string | null): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// Format IPFS CID for display
export function formatCID(cid: string): string {
  if (!cid || cid.length < 12) return cid;
  return `${cid.slice(0, 8)}...${cid.slice(-8)}`;
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

// Check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask);
}

// Request wallet connection
export async function connectWallet(): Promise<WalletState> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed. Please install MetaMask to use this DApp.");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    return {
      address: accounts[0],
      chainId: parseInt(chainId, 16),
      isConnected: true,
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("Please connect your wallet to continue");
    }
    throw error;
  }
}

// Get current wallet state
export async function getCurrentWallet(): Promise<WalletState> {
  if (!isMetaMaskInstalled()) {
    return { address: null, chainId: null, isConnected: false };
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length === 0) {
      return { address: null, chainId: null, isConnected: false };
    }

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    return {
      address: accounts[0],
      chainId: parseInt(chainId, 16),
      isConnected: true,
    };
  } catch (error) {
    return { address: null, chainId: null, isConnected: false };
  }
}

// Switch to the correct network
export async function switchToNetwork(chainId: number): Promise<void> {
  const chainIdHex = `0x${chainId.toString(16)}`;
  
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      const rpcUrl = import.meta.env.VITE_BDAG_RPC;
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex,
            chainName: "BDAG Network",
            rpcUrls: [rpcUrl],
            nativeCurrency: {
              name: "BDAG",
              symbol: "BDAG",
              decimals: 18,
            },
          },
        ],
      });
    } else {
      throw error;
    }
  }
}
